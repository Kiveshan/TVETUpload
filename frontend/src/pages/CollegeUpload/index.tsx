import { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PortalLayout from '../../layouts/PortalLayout/PortalLayout';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Tabs, { type TabOption } from '../../components/Tabs/Tabs';
import SearchableSelect from '../../components/SearchableSelect/SearchableSelect';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import UploadHistory from './UploadHistory';
import { PATHS } from '../../routes/paths';
import { api } from '../../lib/api';
import { useAuth } from '../../auth/useAuth';
import { useUploadFiles } from '../../context/UploadFilesContext';
import { DocIcon, UploadCloudIcon, FileSmallIcon, TickIcon, EyeIcon, TrashIcon, BackArrowIcon, ForwardArrowIcon } from './icons';
import './CollegeUpload.css';
import './UploadCard.css';

interface College { college_id: number; college_name: string; }

const STEPS = [
  { label: 'Provider', href: PATHS.providerInformation },
  { label: 'College Upload' },
  { label: 'Summary & Confirmation' },
];

const DOCUMENT_TYPES = [
  { key: 'collegeInfo', label: 'College Information',                required: true  },
  { key: 'programme',  label: 'Programme, Subject & Qualifications', required: true  },
  { key: 'student',    label: 'Student Data',                        required: true  },
  { key: 'staff',      label: 'Staff Data',                          required: true  },
  { key: 'headcount',  label: 'Head Count Enrollment',               required: false },
];

const YEARS = ['2025', '2026'] as const;
type Year = typeof YEARS[number];

interface UploadEntry { fileName: string; uploadedAt: Date; }
interface StoredEntry { fileName: string; uploadedAt: string; }
interface StoredState {
  selectedCollege: string;
  selectedCollegeName: string;
  selectedYear: string;
  uploadsByYear: Record<string, Record<string, StoredEntry>>;
}
const UPLOAD_STORAGE_KEY = 'tvet_college_upload';

function loadSaved() {
  try {
    const raw = sessionStorage.getItem(UPLOAD_STORAGE_KEY);
    if (!raw) return { selectedCollege: '', selectedCollegeName: '', selectedYear: '', uploadsByYear: {} as Record<string, Record<string, UploadEntry>> };
    const stored: StoredState = JSON.parse(raw);
    const uploadsByYear: Record<string, Record<string, UploadEntry>> = {};
    for (const [year, docs] of Object.entries(stored.uploadsByYear ?? {})) {
      uploadsByYear[year] = {};
      for (const [k, v] of Object.entries(docs)) {
        uploadsByYear[year][k] = { fileName: v.fileName, uploadedAt: new Date(v.uploadedAt) };
      }
    }
    return {
      selectedCollege: stored.selectedCollege ?? '',
      selectedCollegeName: stored.selectedCollegeName ?? '',
      selectedYear: stored.selectedYear ?? '',
      uploadsByYear,
    };
  } catch {
    return { selectedCollege: '', selectedCollegeName: '', selectedYear: '', uploadsByYear: {} as Record<string, Record<string, UploadEntry>> };
  }
}

function formatDate(d: Date) {
  return `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })} ${d.getFullYear()}, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

type Tab = 'new' | 'history';

const UPLOAD_TABS: TabOption<Tab>[] = [
  { value: 'new',     label: 'New Upload' },
  { value: 'history', label: 'Upload History' },
];

export default function CollegeUpload() {
  const saved   = loadSaved();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getFiles, setFile, removeFile } = useUploadFiles();

  const isCollegeUser = user?.role === 'college';

  const [activeTab, setActiveTab]             = useState<Tab>('new');
  const [selectedCollege, setSelectedCollege] = useState(saved.selectedCollege);
  const [selectedCollegeName, setSelectedCollegeName] = useState(saved.selectedCollegeName);
  const [selectedYear, setSelectedYear]       = useState<Year | ''>(saved.selectedYear as Year | '');
  const [historyCollegeId, setHistoryCollegeId] = useState('');
  const [historyYear, setHistoryYear]         = useState<Year | ''>('');
  const [uploadsByYear, setUploadsByYear]     = useState<Record<string, Record<string, UploadEntry>>>(saved.uploadsByYear);
  const [previewKey, setPreviewKey]           = useState<string | null>(null);
  const [modalDismissed, setModalDismissed]   = useState(false);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data: availableColleges = [], isLoading: loadingAvailable } = useQuery({
    queryKey: ['colleges', 'available'],
    queryFn: () => api.get<{ colleges: College[] }>('/colleges/available').then((r) => r.colleges),
  });

  const { data: submittedColleges = [], isLoading: loadingSubmitted } = useQuery({
    queryKey: ['colleges', 'submitted'],
    queryFn: () => api.get<{ colleges: College[] }>('/colleges/submitted').then((r) => r.colleges),
  });

  // ── Derived values ─────────────────────────────────────────────────────────

  const allUploaded =
    !loadingAvailable &&
    !loadingSubmitted &&
    availableColleges.length === 0 &&
    submittedColleges.length > 0;

  const lockedCollege = isCollegeUser && user?.collegeId
    ? availableColleges.find((c) => c.college_id === user.collegeId) ?? null
    : null;

  const effectiveSelectedCollege     = lockedCollege ? String(lockedCollege.college_id) : selectedCollege;
  const effectiveSelectedCollegeName = lockedCollege ? lockedCollege.college_name : selectedCollegeName;
  const effectiveTab: Tab            = allUploaded ? 'history' : activeTab;
  const effectiveHistoryCollegeId    = isCollegeUser && user?.collegeId ? String(user.collegeId) : historyCollegeId;
  const showAllUploadedModal         = allUploaded && !modalDismissed;

  // Which years the currently selected/locked college has already submitted for
  const collegeIdForYears = effectiveSelectedCollege || (isCollegeUser && user?.collegeId ? String(user.collegeId) : '');
  const { data: submittedYearsRaw = [] } = useQuery({
    queryKey: ['submitted-years', collegeIdForYears],
    queryFn: () =>
      api.get<{ years: number[] }>(`/colleges/submitted-years/${collegeIdForYears}`)
        .then((r) => r.years.map(String)),
    enabled: !!collegeIdForYears,
  });
  const submittedYears = submittedYearsRaw;

  // Auto-default year to whichever year the college hasn't uploaded for yet
  const missingYear = useMemo<Year | null>(() => {
    if (!collegeIdForYears) return null;
    if (submittedYears.includes('2025') && !submittedYears.includes('2026')) return '2026';
    if (submittedYears.includes('2026') && !submittedYears.includes('2025')) return '2025';
    return null;
  }, [collegeIdForYears, submittedYears]);

  // Effective upload year: user's explicit pick, or auto-default to missing year
  const effectiveYear: Year | '' = selectedYear || missingYear || '';

  // Uploads and files for the effective year
  const currentUploads = effectiveYear ? (uploadsByYear[effectiveYear] ?? {}) : {};
  const ctxFiles       = effectiveYear ? getFiles(effectiveYear) : {};

  const allRequiredDone = DOCUMENT_TYPES.filter((d) => d.required).every((d) => currentUploads[d.key]);
  const showUploadCards = !!effectiveSelectedCollege && !!effectiveYear;

  // ── Session storage sync ──────────────────────────────────────────────────

  useEffect(() => {
    const stored: StoredState = {
      selectedCollege: effectiveSelectedCollege,
      selectedCollegeName: effectiveSelectedCollegeName,
      selectedYear: effectiveYear,
      uploadsByYear: Object.fromEntries(
        Object.entries(uploadsByYear).map(([yr, docs]) => [
          yr,
          Object.fromEntries(
            Object.entries(docs).map(([k, v]) => [k, { fileName: v.fileName, uploadedAt: v.uploadedAt.toISOString() }]),
          ),
        ]),
      ),
    };
    sessionStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(stored));
  }, [effectiveSelectedCollege, effectiveSelectedCollegeName, effectiveYear, uploadsByYear]);

  // ─────────────────────────────────────────────────────────────────────────

  function handleFile(key: string, files: FileList | null) {
    const file = files?.[0];
    if (!file || !effectiveYear) return;
    setFile(effectiveYear, key, file);
    setUploadsByYear((prev) => ({
      ...prev,
      [effectiveYear]: { ...(prev[effectiveYear] ?? {}), [key]: { fileName: file.name, uploadedAt: new Date() } },
    }));
  }

  function handleDelete(key: string) {
    if (!effectiveYear) return;
    removeFile(effectiveYear, key);
    setUploadsByYear((prev) => {
      const yearDocs = { ...(prev[effectiveYear] ?? {}) };
      delete yearDocs[key];
      return { ...prev, [effectiveYear]: yearDocs };
    });
  }

  function handleCollegeChange(collegeId: string) {
    if (isCollegeUser) return;
    const name = availableColleges.find((c) => String(c.college_id) === collegeId)?.college_name ?? '';
    setSelectedCollege(collegeId);
    setSelectedCollegeName(name);
    setSelectedYear('');
    setUploadsByYear({});
  }

  function handleHistoryCollegeChange(collegeId: string) {
    if (isCollegeUser) return;
    setHistoryCollegeId(collegeId);
    setHistoryYear('');
  }

  function handleTabChange(tab: Tab) {
    if (tab === 'new' && allUploaded) {
      setModalDismissed(false);
      return;
    }
    setActiveTab(tab);
  }

  const availableOptions = availableColleges.map((c) => ({ value: String(c.college_id), label: c.college_name }));
  const submittedOptions = submittedColleges.map((c) => ({ value: String(c.college_id), label: c.college_name }));
  const previewFile = previewKey ? ctxFiles[previewKey] : undefined;

  return (
    <PortalLayout>
      {effectiveTab === 'new' && !isCollegeUser && <Breadcrumb items={STEPS} activeStep={2} />}

      <div className="uploadTabRow">
        <Tabs options={UPLOAD_TABS} value={effectiveTab} onChange={handleTabChange} />
      </div>

      {effectiveTab === 'history' && (
        <div className="historyCollegeFilter">
          <SearchableSelect
            options={submittedOptions}
            value={effectiveHistoryCollegeId}
            onChange={handleHistoryCollegeChange}
            placeholder={loadingSubmitted ? 'Loading…' : 'Select a college to view'}
            disabled={loadingSubmitted || isCollegeUser}
          />
          {effectiveHistoryCollegeId && (
            <div className="yearPickerRow">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={`yearPickerBtn${historyYear === y ? ' yearPickerBtn--active' : ''}`}
                  onClick={() => setHistoryYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {effectiveTab === 'new' ? (
        <>
          <div className="uploadCard">
            <h2>College Upload</h2>
            <p>Select the TVET College and year you are uploading data for.</p>
            <div className="uploadCardRow">
              <div className="formGroup uploadCardRow__college">
                <label htmlFor="college-select" className="formLabel">Select TVET College <span>*</span></label>
                <SearchableSelect
                  id="college-select"
                  options={availableOptions}
                  value={effectiveSelectedCollege}
                  onChange={handleCollegeChange}
                  placeholder={loadingAvailable ? 'Loading colleges…' : 'Choose a college'}
                  disabled={loadingAvailable || isCollegeUser}
                  className="formSelect"
                />
              </div>

              <div className="formGroup uploadCardRow__year">
                <label className="formLabel">Select Upload Year <span>*</span></label>
                <div className="yearPickerRow yearPickerRow--left">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      className={`yearPickerBtn${effectiveYear === y ? ' yearPickerBtn--active' : ''}`}
                      onClick={() => setSelectedYear(y)}
                      disabled={!effectiveSelectedCollege}
                    >
                      {y}
                      {uploadsByYear[y] && Object.keys(uploadsByYear[y]).length > 0 && (
                        <span className="yearPickerBadge">{Object.keys(uploadsByYear[y]).length}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {showUploadCards && (
            <div className="uploadCardsGrid">
              {DOCUMENT_TYPES.map((doc) => {
                const entry = currentUploads[doc.key];
                return (
                  <div key={doc.key} className="docUploadCard">
                    <div className="docCardHeader">
                      <div className="docCardLeft">
                        <div className="docIconBox"><DocIcon /></div>
                        <div className="docCardInfo">
                          <div className="docCardTitleRow">
                            <span className="docCardTitle">
                              {doc.label}
                              {doc.required && <span className="requiredStar">*</span>}
                            </span>
                            {!doc.required && <span className="optionalTag">Optional</span>}
                          </div>
                          <span className="docCardSubtitle">Excel (.xlsx) or CSV</span>
                        </div>
                      </div>
                      {entry ? <span className="uploadedBadge"><TickIcon /> Uploaded</span> : <span className="pendingBadge">⏱ Pending</span>}
                    </div>

                    {entry ? (
                      <div className="uploadedState">
                        <div className="uploadedFileBox">
                          <div className="uploadedFileRow">
                            <span className="uploadedFileName">{entry.fileName}</span>
                            <FileSmallIcon />
                          </div>
                          <span className="uploadedTimestamp">Uploaded {formatDate(entry.uploadedAt)}</span>
                          <div className="uploadedActions">
                            <button className="previewBtn" type="button" onClick={() => setPreviewKey(doc.key)} disabled={!ctxFiles[doc.key]}>
                              <EyeIcon /> Preview
                            </button>
                            <button className="deleteBtn" type="button" onClick={() => handleDelete(doc.key)}>
                              <TrashIcon /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="dropZone" role="button" tabIndex={0}
                        onClick={() => fileRefs.current[doc.key]?.click()}
                        onKeyDown={(e) => e.key === 'Enter' && fileRefs.current[doc.key]?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.preventDefault(); handleFile(doc.key, e.dataTransfer.files); }}
                      >
                        <UploadCloudIcon />
                        <span className="dropZoneText">Drop your file or click to upload</span>
                        <span className="dropZoneHint">.xlsx or .csv</span>
                        <input type="file" accept=".xlsx,.csv" className="dropZoneInput"
                          ref={(el) => { fileRefs.current[doc.key] = el; }}
                          onChange={(e) => handleFile(doc.key, e.target.files)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <UploadHistory
          collegeId={effectiveHistoryCollegeId ? Number(effectiveHistoryCollegeId) : null}
          year={historyYear || null}
        />
      )}

      <div className="pageActions">
        {isCollegeUser
          ? <Link to={PATHS.home} className="backBtn"><BackArrowIcon /> Back</Link>
          : <Link to={PATHS.providerInformation} className="backBtn"><BackArrowIcon /> Back</Link>
        }
        {effectiveTab === 'new' && effectiveSelectedCollege && effectiveYear && allRequiredDone && (
          <button type="button" className="submitBtn" onClick={() => navigate(PATHS.submissionSummary)}>
            Submit <ForwardArrowIcon />
          </button>
        )}
      </div>

      {previewFile && previewKey && (
        <PreviewModal
          file={previewFile}
          fileName={currentUploads[previewKey]?.fileName}
          onClose={() => setPreviewKey(null)}
        />
      )}

      {showAllUploadedModal && (
        <div className="allUploadedOverlay" role="dialog" aria-modal="true">
          <div className="allUploadedModal">
            <div className="allUploadedIconCircle">
              <LockIcon />
            </div>
            <h2 className="allUploadedTitle">
              {isCollegeUser ? 'Files Already Uploaded' : 'All Colleges Uploaded'}
            </h2>
            <p className="allUploadedBody">
              {isCollegeUser ? (
                <>All required files have been uploaded for <strong>{user?.fullName}</strong>. New uploads are no longer available.</>
              ) : (
                <>All colleges have uploaded their data for <strong>{user?.providerName}</strong>. New uploads are no longer available.</>
              )}
            </p>
            <p className="allUploadedHint">
              To replace a specific report, go to the <strong>Upload History</strong> tab
              {!isCollegeUser && ', select the college,'} and use the <strong>Re-upload</strong> option on the document.
            </p>
            <button className="allUploadedBtn" onClick={() => setModalDismissed(true)}>
              Go to Upload History
            </button>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

function LockIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
