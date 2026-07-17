import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PortalLayout from '../../layouts/PortalLayout/PortalLayout';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import UploadHistory from './UploadHistory';
import { PATHS } from '../../routes/paths';
import { api } from '../../lib/api';
import './CollegeUpload.css';

interface College { college_id: number; college_name: string; }

function useColleges() {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: () => api.get<{ colleges: College[] }>('/colleges').then((r) => r.colleges),
  });
}

const STEPS = [
  { label: 'Provider', href: PATHS.providerInformation },
  { label: 'College Upload' },
  { label: 'Summary & Confirmation' },
];

interface DocType { key: string; label: string; required: boolean; }

const DOCUMENT_TYPES: DocType[] = [
  { key: 'collegeInfo',  label: 'College Information',                required: true  },
  { key: 'programme',   label: 'Programme, Subject & Qualifications', required: true  },
  { key: 'student',     label: 'Student Data',                       required: true  },
  { key: 'staff',       label: 'Staff Data',                         required: true  },
  { key: 'headcount',   label: 'Head Count Enrollment',              required: false },
];

interface UploadEntry {
  fileName: string;
  uploadedAt: Date;
  file?: File;
}

interface StoredUpload { fileName: string; uploadedAt: string; }
interface StoredState  { selectedCollege: string; selectedCollegeName: string; uploads: Record<string, StoredUpload>; }

const UPLOAD_STORAGE_KEY = 'tvet_college_upload';

function loadSaved(): { selectedCollege: string; selectedCollegeName: string; uploads: Record<string, UploadEntry> } {
  try {
    const raw = sessionStorage.getItem(UPLOAD_STORAGE_KEY);
    if (!raw) return { selectedCollege: '', selectedCollegeName: '', uploads: {} };
    const stored: StoredState = JSON.parse(raw);
    const uploads: Record<string, UploadEntry> = {};
    for (const [key, val] of Object.entries(stored.uploads)) {
      uploads[key] = { fileName: val.fileName, uploadedAt: new Date(val.uploadedAt) };
    }
    return { selectedCollege: stored.selectedCollege, selectedCollegeName: stored.selectedCollegeName ?? '', uploads };
  } catch {
    return { selectedCollege: '', selectedCollegeName: '', uploads: {} };
  }
}

function formatDate(d: Date) {
  const day = d.getDate();
  const mon = d.toLocaleString('en', { month: 'short' });
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${mon} ${year}, ${hh}:${mm}`;
}

/* ── Icons ── */
function DocIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 20V4C3 3.20435 3.3163 2.44152 3.87891 1.87891C4.44152 1.3163 5.20435 1 6 1H15L15.0986 1.00488C15.3276 1.02757 15.5429 1.12883 15.707 1.29297L20.707 6.29297C20.8946 6.48051 21 6.73478 21 7V20C21 20.7957 20.6837 21.5585 20.1211 22.1211C19.5585 22.6837 18.7957 23 18 23H6C5.20435 23 4.44152 22.6837 3.87891 22.1211C3.3163 21.5585 3 20.7956 3 20ZM5 20C5 20.2652 5.10543 20.5195 5.29297 20.707C5.48051 20.8946 5.73478 21 6 21H18C18.2652 21 18.5195 20.8946 18.707 20.707C18.8946 20.5195 19 20.2652 19 20V7.41406L14.5859 3H6C5.73478 3 5.48051 3.10543 5.29297 3.29297C5.10543 3.48051 5 3.73478 5 4V20Z" fill="#0047a2"/>
      <path d="M13 6V2C13 1.44772 13.4477 1 14 1C14.5523 1 15 1.44772 15 2V6C15 6.26522 15.1054 6.51949 15.293 6.70703C15.4805 6.89457 15.7348 7 16 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H16C15.2044 9 14.4415 8.6837 13.8789 8.12109C13.3163 7.55848 13 6.79565 13 6Z" fill="#0047a2"/>
      <path d="M10 8C10.5523 8 11 8.44772 11 9C11 9.55228 10.5523 10 10 10H8C7.44772 10 7 9.55228 7 9C7 8.44772 7.44772 8 8 8H10Z" fill="#0047a2"/>
      <path d="M16 12C16.5523 12 17 12.4477 17 13C17 13.5523 16.5523 14 16 14H8C7.44772 14 7 13.5523 7 13C7 12.4477 7.44772 12 8 12H16Z" fill="#0047a2"/>
      <path d="M16 16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17C7 16.4477 7.44772 16 8 16H16Z" fill="#0047a2"/>
    </svg>
  );
}
function UploadCloudIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#0047a2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  );
}
/* File-text SVG from assets — used in the filename row */
function FileSmallIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 20V4C3 3.20435 3.3163 2.44152 3.87891 1.87891C4.44152 1.3163 5.20435 1 6 1H15L15.0986 1.00488C15.3276 1.02757 15.5429 1.12883 15.707 1.29297L20.707 6.29297C20.8946 6.48051 21 6.73478 21 7V20C21 20.7957 20.6837 21.5585 20.1211 22.1211C19.5585 22.6837 18.7957 23 18 23H6C5.20435 23 4.44152 22.6837 3.87891 22.1211C3.3163 21.5585 3 20.7956 3 20ZM5 20C5 20.2652 5.10543 20.5195 5.29297 20.707C5.48051 20.8946 5.73478 21 6 21H18C18.2652 21 18.5195 20.8946 18.707 20.707C18.8946 20.5195 19 20.2652 19 20V7.41406L14.5859 3H6C5.73478 3 5.48051 3.10543 5.29297 3.29297C5.10543 3.48051 5 3.73478 5 4V20Z" fill="#686583"/>
      <path d="M13 6V2C13 1.44772 13.4477 1 14 1C14.5523 1 15 1.44772 15 2V6C15 6.26522 15.1054 6.51949 15.293 6.70703C15.4805 6.89457 15.7348 7 16 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H16C15.2044 9 14.4415 8.6837 13.8789 8.12109C13.3163 7.55848 13 6.79565 13 6Z" fill="#686583"/>
      <path d="M10 8C10.5523 8 11 8.44772 11 9C11 9.55228 10.5523 10 10 10H8C7.44772 10 7 9.55228 7 9C7 8.44772 7.44772 8 8 8H10Z" fill="#686583"/>
      <path d="M16 12C16.5523 12 17 12.4477 17 13C17 13.5523 16.5523 14 16 14H8C7.44772 14 7 13.5523 7 13C7 12.4477 7.44772 12 8 12H16Z" fill="#686583"/>
      <path d="M16 16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17C7 16.4477 7.44772 16 8 16H16Z" fill="#686583"/>
    </svg>
  );
}

/* Green tick — used in the Uploaded badge */
function TickIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#16a34a"/>
      <path d="M7 12.5l3.5 3.5L17 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  );
}

type Tab = 'new' | 'history';

export default function CollegeUpload() {
  const saved = loadSaved();
  const navigate = useNavigate();
  const [activeTab, setActiveTab]                   = useState<Tab>('new');
  const [selectedCollege, setSelectedCollege]       = useState(saved.selectedCollege);
  const [selectedCollegeName, setSelectedCollegeName] = useState(saved.selectedCollegeName);
  const [historyCollege, setHistoryCollege]         = useState('');
  const [uploads, setUploads]                       = useState<Record<string, UploadEntry>>(saved.uploads);
  const { data: colleges = [], isLoading }          = useColleges();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Persist state to sessionStorage whenever it changes
  useEffect(() => {
    const stored: StoredState = {
      selectedCollege,
      selectedCollegeName,
      uploads: Object.fromEntries(
        Object.entries(uploads).map(([k, v]) => [k, { fileName: v.fileName, uploadedAt: v.uploadedAt.toISOString() }])
      ),
    };
    sessionStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(stored));
  }, [selectedCollege, selectedCollegeName, uploads]);

  const allRequiredDone = DOCUMENT_TYPES
    .filter((d) => d.required)
    .every((d) => uploads[d.key]);

  function handleFile(key: string, files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploads((prev) => ({ ...prev, [key]: { file, fileName: file.name, uploadedAt: new Date() } }));
  }

  function handleDelete(key: string) {
    setUploads((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  function handleCollegeChange(collegeId: string) {
    const name = colleges.find((c) => String(c.college_id) === collegeId)?.college_name ?? '';
    setSelectedCollege(collegeId);
    setSelectedCollegeName(name);
    setUploads({});
  }

  return (
    <PortalLayout>
      {activeTab === 'new' && <Breadcrumb items={STEPS} activeStep={2} />}

      {/* ── Tab toggle ── */}
      <div className="uploadTabRow">
        <button type="button" className={`tabBtn${activeTab === 'new' ? ' tabBtn--active' : ''}`} onClick={() => setActiveTab('new')}>
          New Upload
        </button>
        <button type="button" className={`tabBtn${activeTab === 'history' ? ' tabBtn--active' : ''}`} onClick={() => setActiveTab('history')}>
          Upload History
        </button>

        {activeTab === 'history' && (
          <select className="historyCollegeInline" value={historyCollege} onChange={(e) => setHistoryCollege(e.target.value)} disabled={isLoading}>
            <option value="">{isLoading ? 'Loading…' : 'Select a college to view'}</option>
            {colleges.map((c) => <option key={c.college_id} value={String(c.college_id)}>{c.college_name}</option>)}
          </select>
        )}
      </div>

      {activeTab === 'new' ? (
        <>
          {/* ── College selection card ── */}
          <div className="uploadCard">
            <h2>College Upload</h2>
            <p>Select the TVET College you are uploading data for.</p>
            <div className="formGroup">
              <label htmlFor="college-select" className="formLabel">
                Select TVET College <span>*</span>
              </label>
              <select
                id="college-select"
                className="formSelect"
                value={selectedCollege}
                onChange={(e) => handleCollegeChange(e.target.value)}
                disabled={isLoading}
                required
              >
                <option value="">{isLoading ? 'Loading colleges…' : 'Choose a college'}</option>
                {colleges.map((c) => <option key={c.college_id} value={String(c.college_id)}>{c.college_name}</option>)}
              </select>
            </div>
          </div>

          {/* ── Document upload cards ── */}
          {selectedCollege && (
            <div className="uploadCardsGrid">
              {DOCUMENT_TYPES.map((doc) => {
                const entry = uploads[doc.key];
                return (
                  <div key={doc.key} className="docUploadCard">
                    {/* Card header: icon box + title/subtitle + badge */}
                    <div className="docCardHeader">
                      <div className="docCardLeft">
                        <div className="docIconBox"><DocIcon /></div>
                        <div className="docCardInfo">
                          <div className="docCardTitleRow">
                            <span className="docCardTitle">{doc.label}</span>
                            {!doc.required && <span className="optionalTag">Optional</span>}
                          </div>
                          <span className="docCardSubtitle">Excel (.xlsx) or CSV</span>
                        </div>
                      </div>
                      {entry
                        ? <span className="uploadedBadge"><TickIcon /> Uploaded</span>
                        : <span className="pendingBadge">⏱ Pending</span>
                      }
                    </div>

                    {entry ? (
                      /* ── Uploaded state ── */
                      <div className="uploadedState">
                        <div className="uploadedFileBox">
                          <div className="uploadedFileRow">
                            <span className="uploadedFileName">{entry.fileName}</span>
                            <FileSmallIcon />
                          </div>
                          <span className="uploadedTimestamp">Uploaded {formatDate(entry.uploadedAt)}</span>
                          <div className="uploadedActions">
                            <button className="previewBtn" type="button">
                              <EyeIcon /> Preview
                            </button>
                            <button className="deleteBtn" type="button" onClick={() => handleDelete(doc.key)}>
                              <TrashIcon /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ── Drop zone ── */
                      <div
                        className="dropZone"
                        role="button"
                        tabIndex={0}
                        onClick={() => fileRefs.current[doc.key]?.click()}
                        onKeyDown={(e) => e.key === 'Enter' && fileRefs.current[doc.key]?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.preventDefault(); handleFile(doc.key, e.dataTransfer.files); }}
                      >
                        <UploadCloudIcon />
                        <span className="dropZoneText">Drop your file or click to upload</span>
                        <span className="dropZoneHint">.xlsx or .csv</span>
                        <input
                          type="file"
                          accept=".xlsx,.csv"
                          className="dropZoneInput"
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
        <UploadHistory />
      )}

      {/* ── Bottom actions ── */}
      <div className="pageActions">
        <Link to={PATHS.providerInformation} className="backBtn">
          <BackArrowIcon /> Back
        </Link>
        {activeTab === 'new' && selectedCollege && allRequiredDone && (
          <button type="button" className="submitBtn" onClick={() => navigate(PATHS.submissionSummary)}>
            Submit <ForwardArrowIcon />
          </button>
        )}
      </div>
    </PortalLayout>
  );
}

function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );
}

function ForwardArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
