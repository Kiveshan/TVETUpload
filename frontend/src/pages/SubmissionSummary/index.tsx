import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../../layouts/PortalLayout/PortalLayout';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { PATHS } from '../../routes/paths';
import './SubmissionSummary.css';

const STEPS = [
  { label: 'Provider', href: PATHS.providerInformation },
  { label: 'College Upload', href: PATHS.collegeUpload },
  { label: 'Summary & Confirmation' },
];

interface ProviderForm { provider: string; fullName: string; email: string; contact: string; }
interface StoredUpload { fileName: string; uploadedAt: string; }
interface StoredUploadState { selectedCollege: string; selectedCollegeName: string; uploads: Record<string, StoredUpload>; }

const DOC_LABELS: Record<string, string> = {
  collegeInfo: 'College Information',
  programme:   'Programme, Subject & Qualifications',
  student:     'Student Data',
  headcount:   'Headcount Enrollment',
  staff:       'Staff Data',
};

const DOC_ORDER    = ['collegeInfo', 'programme', 'student', 'headcount', 'staff'];
const REQUIRED_KEYS = new Set(['collegeInfo', 'programme', 'student', 'staff']);

function loadProvider(): ProviderForm {
  try {
    const raw = sessionStorage.getItem('tvet_provider_form');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return { provider: '', fullName: '', email: '', contact: '' };
}

function loadUploadState(): StoredUploadState {
  try {
    const raw = sessionStorage.getItem('tvet_college_upload');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return { selectedCollege: '', selectedCollegeName: '', uploads: {} };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const mon = d.toLocaleString('en', { month: 'short' });
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${mon} ${year}, ${hh}:${mm}`;
}

function nowFormatted() {
  return formatDate(new Date().toISOString());
}

function clearUploadState() {
  sessionStorage.setItem('tvet_college_upload', JSON.stringify({
    selectedCollege: '',
    selectedCollegeName: '',
    uploads: {},
  }));
}

export default function SubmissionSummary() {
  const navigate    = useNavigate();
  const provider    = loadProvider();
  const uploadState = loadUploadState();
  const [uploads, setUploads]     = useState<Record<string, StoredUpload>>(uploadState.uploads);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionDate] = useState(nowFormatted);

  const allRequiredPresent = [...REQUIRED_KEYS].every((k) => !!uploads[k]);
  const canConfirm = allRequiredPresent && confirmed;

  function handleDelete(key: string) {
    const updated = { ...uploads };
    delete updated[key];

    // Persist the removal back to sessionStorage so upload page reflects it
    const stored = loadUploadState();
    stored.uploads = updated;
    sessionStorage.setItem('tvet_college_upload', JSON.stringify(stored));

    if (REQUIRED_KEYS.has(key)) {
      // Route back so user can re-upload the missing required file
      navigate(PATHS.collegeUpload);
    } else {
      setUploads(updated);
    }
  }

  function handleConfirm() {
    if (!canConfirm) return;
    setSubmitted(true);
  }

  // Auto-navigate after 5 s when modal is showing
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      clearUploadState();
      navigate(PATHS.collegeUpload);
    }, 5000);
    return () => clearTimeout(timer);
  }, [submitted, navigate]);

  return (
    <PortalLayout>
      <Breadcrumb items={STEPS} activeStep={3} />

      <div className="summaryPage">
        <div className="summaryHeader">
          <h1 className="summaryTitle">Submission Summary</h1>
          <p className="summarySubtitle">Please review your submission details below.</p>
        </div>

        {/* ── Info cards row ── */}
        <div className="summaryInfoRow">
          {/* Provider Information */}
          <div className="summaryInfoCard">
            <h2 className="summaryInfoCardTitle">Provider Information</h2>
            <table className="summaryInfoTable">
              <tbody>
                <tr>
                  <th>Provider Name</th>
                  <td>{provider.provider || '—'}</td>
                </tr>
                <tr>
                  <th>Full Name</th>
                  <td>{provider.fullName || '—'}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{provider.email || '—'}</td>
                </tr>
                <tr>
                  <th>Contact Number</th>
                  <td>{provider.contact || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* College Information */}
          <div className="summaryInfoCard">
            <h2 className="summaryInfoCardTitle">College Information</h2>
            <table className="summaryInfoTable">
              <tbody>
                <tr>
                  <th>Selected College</th>
                  <td>{uploadState.selectedCollegeName || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Uploaded Documents table ── */}
        <div className="summaryDocsCard">
          <h2 className="summaryDocsTitle">Uploaded Documents</h2>
          <div className="tableWrapper">
          <table className="summaryDocsTable">
            <thead>
              <tr>
                <th>Document</th>
                <th>File Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {DOC_ORDER.map((key) => {
                const entry = uploads[key];
                return (
                  <tr key={key}>
                    <td className="docNameCell">{DOC_LABELS[key]}</td>
                    <td className="fileNameCell">{entry?.fileName ?? '—'}</td>
                    <td>
                      {entry
                        ? <span className="docUploadedBadge"><CheckIcon /> Uploaded</span>
                        : <span className="docPendingBadge">Not uploaded</span>
                      }
                    </td>
                    <td className="actionsCell">
                      <button className="iconBtn" type="button" title="Preview" disabled={!entry}>
                        <EyeIcon />
                      </button>
                      <button
                        className="iconBtn iconBtn--delete"
                        type="button"
                        title="Delete"
                        disabled={!entry}
                        onClick={() => handleDelete(key)}
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* ── Consent section ── */}
        <div className="consentSection">
          <p className="consentWarning">
            Please review all uploaded information before confirming your submission.
            Once confirmed, your files will not be able to make any edits.
          </p>
          <label className="consentLabel">
            <input
              type="checkbox"
              className="consentCheckbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            I confirm that the uploaded documents are correct.
          </label>
        </div>

        {/* ── Bottom actions ── */}
        <div className="summaryActions">
          <Link to={PATHS.collegeUpload} className="summaryBackBtn">
            <BackArrowIcon /> Back
          </Link>
          <button
            type="button"
            className={`confirmBtn${canConfirm ? ' confirmBtn--active' : ''}`}
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            Confirm Upload <CheckmarkIcon />
          </button>
        </div>
      </div>

      {/* ── Success modal ── */}
      {submitted && (
        <div className="modalOverlay">
          <div className="modalCard">
            <div className="modalIconCircle">
              <BigCheckIcon />
            </div>
            <h2 className="modalTitle">Upload Successful</h2>
            <p className="modalSubtitle">
              Your TVET college submission has been successfully uploaded.
            </p>
            <div className="modalSummaryBox">
              <div className="modalSummaryTopRow">
                <div className="modalSummaryItem">
                  <span className="modalSummaryLabel">Provider Name</span>
                  <span className="modalSummaryValue">{provider.provider || '—'}</span>
                </div>
                <div className="modalSummaryItem">
                  <span className="modalSummaryLabel">Selected College</span>
                  <span className="modalSummaryValue">{uploadState.selectedCollegeName || '—'}</span>
                </div>
              </div>
              <div className="modalSummaryItem">
                <span className="modalSummaryLabel">Submission Date</span>
                <span className="modalSummaryValue">{submissionDate}</span>
              </div>
            </div>
            <p className="modalRedirectNote">Redirecting you in 5 seconds…</p>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

/* ── Icons ── */
function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );
}
function CheckmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function BigCheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  );
}
