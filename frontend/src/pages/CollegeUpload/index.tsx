import { useEffect, useRef, useState } from 'react';
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
  { key: 'headcount',  label: 'Head Count Enrollment 2025',           required: false },
];

interface UploadEntry { fileName: string; uploadedAt: Date; }
interface StoredState  { selectedCollege: string; selectedCollegeName: string; uploads: Record<string, { fileName: string; uploadedAt: string }>; }
const UPLOAD_STORAGE_KEY = 'tvet_college_upload';

function loadSaved() {
  try {
    const raw = sessionStorage.getItem(UPLOAD_STORAGE_KEY);
    if (!raw) return { selectedCollege: '', selectedCollegeName: '', uploads: {} as Record<string, UploadEntry> };
    const stored: StoredState = JSON.parse(raw);
    const uploads: Record<string, UploadEntry> = {};
    for (const [k, v] of Object.entries(stored.uploads)) {
      uploads[k] = { fileName: v.fileName, uploadedAt: new Date(v.uploadedAt) };
    }
    return { selectedCollege: stored.selectedCollege, selectedCollegeName: stored.selectedCollegeName ?? '', uploads };
  } catch { return { selectedCollege: '', selectedCollegeName: '', uploads: {} as Record<string, UploadEntry> }; }
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
  const { files: ctxFiles, setFile, removeFile } = useUploadFiles();

  const isCollegeUser = user?.role === 'college';

  // Raw controlled state — college users have some of these overridden by derived values below.
  const [activeTab, setActiveTab]             = useState<Tab>('new');
  const [selectedCollege, setSelectedCollege] = useState(saved.selectedCollege);
  const [selectedCollegeName, setSelectedCollegeName] = useState(saved.selectedCollegeName);
  const [historyCollegeId, setHistoryCollegeId] = useState('');
  const [uploads, setUploads]                 = useState<Record<string, UploadEntry>>(saved.uploads);
  const [previewKey, setPreviewKey]           = useState<string | null>(null);
  // Modal is shown whenever allUploaded && not dismissed; dismissed resets on re-open attempt.
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

  // ── Derived values (no effects needed) ───────────────────────────────────

  const allUploaded =
    !loadingAvailable &&
    !loadingSubmitted &&
    availableColleges.length === 0 &&
    submittedColleges.length > 0;

  // College users: lock the college selection to their own college.
  const lockedCollege = isCollegeUser && user?.collegeId
    ? availableColleges.find((c) => c.college_id === user.collegeId) ?? null
    : null;

  const effectiveSelectedCollege     = lockedCollege ? String(lockedCollege.college_id) : selectedCollege;
  const effectiveSelectedCollegeName = lockedCollege ? lockedCollege.college_name : selectedCollegeName;

  // When all colleges are uploaded the active tab is always history.
  const effectiveTab: Tab = allUploaded ? 'history' : activeTab;

  // College users always see their own college in the history dropdown.
  const effectiveHistoryCollegeId = isCollegeUser && user?.collegeId
    ? String(user.collegeId)
    : historyCollegeId;

  // Show modal when all uploaded and user has not dismissed it this session.
  const showAllUploadedModal = allUploaded && !modalDismissed;

  // ── Session storage sync ──────────────────────────────────────────────────

  useEffect(() => {
    const stored: StoredState = {
      selectedCollege: effectiveSelectedCollege,
      selectedCollegeName: effectiveSelectedCollegeName,
      uploads: Object.fromEntries(
        Object.entries(uploads).map(([k, v]) => [k, { fileName: v.fileName, uploadedAt: v.uploadedAt.toISOString() }]),
      ),
    };
    sessionStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(stored));
  }, [effectiveSelectedCollege, effectiveSelectedCollegeName, uploads]);

  // ─────────────────────────────────────────────────────────────────────────

  const allRequiredDone = DOCUMENT_TYPES.filter((d) => d.required).every((d) => uploads[d.key]);

  function handleFile(key: string, files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setFile(key, file);
    setUploads((prev) => ({ ...prev, [key]: { fileName: file.name, uploadedAt: new Date() } }));
  }

  function handleDelete(key: string) {
    removeFile(key);
    setUploads((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  function handleCollegeChange(collegeId: string) {
    if (isCollegeUser) return;
    const name = availableColleges.find((c) => String(c.college_id) === collegeId)?.college_name ?? '';
    setSelectedCollege(collegeId);
    setSelectedCollegeName(name);
    setUploads({});
  }

  function handleHistoryCollegeChange(collegeId: string) {
    if (isCollegeUser) return;
    setHistoryCollegeId(collegeId);
  }

  function handleTabChange(tab: Tab) {
    if (tab === 'new' && allUploaded) {
      // Re-show the modal each time user tries to switch to New Upload while locked.
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
        </div>
      )}

      {effectiveTab === 'new' ? (
        <>
          <div className="uploadCard">
            <h2>College Upload</h2>
            <p>Select the TVET College you are uploading data for.</p>
            <div className="formGroup">
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
          </div>

          {effectiveSelectedCollege && (
            <div className="uploadCardsGrid">
              {DOCUMENT_TYPES.map((doc) => {
                const entry = uploads[doc.key];
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
        <UploadHistory collegeId={effectiveHistoryCollegeId ? Number(effectiveHistoryCollegeId) : null} />
      )}

      <div className="pageActions">
        {isCollegeUser
          ? <Link to={PATHS.home} className="backBtn"><BackArrowIcon /> Back</Link>
          : <Link to={PATHS.providerInformation} className="backBtn"><BackArrowIcon /> Back</Link>
        }
        {effectiveTab === 'new' && effectiveSelectedCollege && allRequiredDone && (
          <button type="button" className="submitBtn" onClick={() => navigate(PATHS.submissionSummary)}>
            Submit <ForwardArrowIcon />
          </button>
        )}
      </div>

      {previewFile && previewKey && (
        <PreviewModal
          file={previewFile}
          fileName={uploads[previewKey]?.fileName}
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
            <button
              className="allUploadedBtn"
              onClick={() => setModalDismissed(true)}
            >
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
