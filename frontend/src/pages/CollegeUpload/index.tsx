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
  const { files: ctxFiles, setFile, removeFile } = useUploadFiles();

  const [activeTab, setActiveTab]                     = useState<Tab>('new');
  const [selectedCollege, setSelectedCollege]         = useState(saved.selectedCollege);
  const [selectedCollegeName, setSelectedCollegeName] = useState(saved.selectedCollegeName);
  const [historyCollegeId, setHistoryCollegeId]       = useState('');
  const [uploads, setUploads]                         = useState<Record<string, UploadEntry>>(saved.uploads);
  const [previewKey, setPreviewKey]                   = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data: availableColleges = [], isLoading: loadingAvailable } = useQuery({
    queryKey: ['colleges', 'available'],
    queryFn: () => api.get<{ colleges: College[] }>('/colleges/available').then((r) => r.colleges),
  });

  const { data: submittedColleges = [], isLoading: loadingSubmitted } = useQuery({
    queryKey: ['colleges', 'submitted'],
    queryFn: () => api.get<{ colleges: College[] }>('/colleges/submitted').then((r) => r.colleges),
  });

  useEffect(() => {
    const stored: StoredState = {
      selectedCollege,
      selectedCollegeName,
      uploads: Object.fromEntries(Object.entries(uploads).map(([k, v]) => [k, { fileName: v.fileName, uploadedAt: v.uploadedAt.toISOString() }])),
    };
    sessionStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(stored));
  }, [selectedCollege, selectedCollegeName, uploads]);

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
    const name = availableColleges.find((c) => String(c.college_id) === collegeId)?.college_name ?? '';
    setSelectedCollege(collegeId);
    setSelectedCollegeName(name);
    setUploads({});
  }

  const availableOptions = availableColleges.map((c) => ({ value: String(c.college_id), label: c.college_name }));
  const submittedOptions = submittedColleges.map((c) => ({ value: String(c.college_id), label: c.college_name }));
  const previewFile = previewKey ? ctxFiles[previewKey] : undefined;

  return (
    <PortalLayout>
      {activeTab === 'new' && <Breadcrumb items={STEPS} activeStep={2} />}

      <div className="uploadTabRow">
        <Tabs options={UPLOAD_TABS} value={activeTab} onChange={setActiveTab} />
        {activeTab === 'history' && (
          <div className="historyCollegeCenter">
            <SearchableSelect
              options={submittedOptions}
              value={historyCollegeId}
              onChange={setHistoryCollegeId}
              placeholder={loadingSubmitted ? 'Loading…' : 'Select a college to view'}
              disabled={loadingSubmitted}
              className="historyCollegeInline"
            />
          </div>
        )}
      </div>

      {activeTab === 'new' ? (
        <>
          <div className="uploadCard">
            <h2>College Upload</h2>
            <p>Select the TVET College you are uploading data for.</p>
            <div className="formGroup">
              <label htmlFor="college-select" className="formLabel">Select TVET College <span>*</span></label>
              <SearchableSelect
                id="college-select"
                options={availableOptions}
                value={selectedCollege}
                onChange={handleCollegeChange}
                placeholder={loadingAvailable ? 'Loading colleges…' : 'Choose a college'}
                disabled={loadingAvailable}
                className="formSelect"
              />
            </div>
          </div>

          {selectedCollege && (
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
        <UploadHistory collegeId={historyCollegeId ? Number(historyCollegeId) : null} />
      )}

      <div className="pageActions">
        <Link to={PATHS.providerInformation} className="backBtn"><BackArrowIcon /> Back</Link>
        {activeTab === 'new' && selectedCollege && allRequiredDone && (
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
    </PortalLayout>
  );
}
