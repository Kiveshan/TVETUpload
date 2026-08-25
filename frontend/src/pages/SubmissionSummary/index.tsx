import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PortalLayout from '../../layouts/PortalLayout/PortalLayout';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import { PATHS } from '../../routes/paths';
import { api } from '../../lib/api';
import { queryClient } from '../../lib/queryClient';
import { useUploadFiles } from '../../context/UploadFilesContext';
import { useAuth } from '../../auth/useAuth';
import { BackArrowIcon, CheckmarkIcon, CheckIcon, BigCheckIcon, EyeIcon, TrashIcon } from './icons';
import './SubmissionSummary.css';
import './SubmissionModal.css';

const STEPS = [
  { label: 'Provider', href: PATHS.providerInformation },
  { label: 'College Upload', href: PATHS.collegeUpload },
  { label: 'Summary & Confirmation' },
];

interface ProviderForm { provider: string; fullName: string; email: string; contact: string; }
interface StoredEntry { fileName: string; uploadedAt: string; }
interface StoredUploadState {
  selectedCollege: string;
  selectedCollegeName: string;
  selectedYear: string;
  uploadsByYear: Record<string, Record<string, StoredEntry>>;
}

const DOC_LABELS: Record<string, string> = {
  collegeInfo: 'College Information',
  programme:   'Programme, Subject & Qualifications',
  student:     'Student Data',
  headcount:   'Head Count Enrollment',
  staff:       'Staff Data',
};
const DOC_ORDER     = ['collegeInfo', 'programme', 'student', 'headcount', 'staff'];
const REQUIRED_KEYS = new Set(['collegeInfo', 'programme', 'student', 'staff']);

function loadProvider(): ProviderForm {
  try { const r = sessionStorage.getItem('tvet_provider_form'); if (r) return JSON.parse(r); } catch { /* ignore */ }
  return { provider: '', fullName: '', email: '', contact: '' };
}

function loadUploadState(): StoredUploadState {
  try { const r = sessionStorage.getItem('tvet_college_upload'); if (r) return JSON.parse(r); } catch { /* ignore */ }
  return { selectedCollege: '', selectedCollegeName: '', selectedYear: '', uploadsByYear: {} };
}

// After a successful submit: remove only the submitted year's data and reset year selection.
// Files for the other year are preserved so the user can submit them next.
function clearSubmittedYear(year: string) {
  try {
    const stored = loadUploadState();
    const updatedByYear = { ...stored.uploadsByYear };
    delete updatedByYear[year];
    sessionStorage.setItem('tvet_college_upload', JSON.stringify({
      ...stored,
      selectedYear: '',
      uploadsByYear: updatedByYear,
    }));
  } catch { /* ignore */ }
}

function nowFormatted() {
  const d = new Date();
  return `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })} ${d.getFullYear()}, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function SubmissionSummary() {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const uploadState = loadUploadState();
  const year        = uploadState.selectedYear;
  const yearUploads = uploadState.uploadsByYear?.[year] ?? {};

  const isCollegeUser = user?.role === 'college';

  const { data: providerInfo } = useQuery({
    queryKey: ['auth', 'provider-info'],
    queryFn: () => api.get<{ contactNumber: string | null }>('/auth/provider-info'),
    enabled: isCollegeUser,
  });

  const savedProvider = loadProvider();
  const provider: ProviderForm = savedProvider.provider
    ? savedProvider
    : {
        provider:  user?.providerName  ?? '',
        fullName:  user?.fullName      ?? '',
        email:     user?.email         ?? '',
        contact:   providerInfo?.contactNumber ?? user?.contactNumber ?? '',
      };

  const { getFiles, removeFile, clearFilesForYear } = useUploadFiles();
  const ctxFiles = getFiles(year);

  const [uploads, setUploads]               = useState<Record<string, StoredEntry>>(yearUploads);
  const [confirmed, setConfirmed]           = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitted, setSubmitted]           = useState(false);
  const [submitError, setSubmitError]       = useState<string | null>(null);
  const [submissionDate]                    = useState(nowFormatted);
  const [previewKey, setPreviewKey]         = useState<string | null>(null);

  const allRequiredPresent = [...REQUIRED_KEYS].every((k) => !!uploads[k]);
  const hasFiles           = Object.keys(ctxFiles).length > 0;
  const canConfirm         = allRequiredPresent && confirmed && hasFiles && !submitting;

  function handleDelete(key: string) {
    const updated = { ...uploads };
    delete updated[key];

    // Persist the deletion into the correct year bucket in session storage
    const stored = loadUploadState();
    const updatedByYear = { ...stored.uploadsByYear };
    if (updatedByYear[year]) {
      updatedByYear[year] = { ...updatedByYear[year] };
      delete updatedByYear[year][key];
    }
    sessionStorage.setItem('tvet_college_upload', JSON.stringify({ ...stored, uploadsByYear: updatedByYear }));
    removeFile(year, key);

    if (REQUIRED_KEYS.has(key)) {
      navigate(PATHS.collegeUpload);
    } else {
      setUploads(updated);
    }
  }

  async function handleConfirm() {
    if (!canConfirm) return;
    setSubmitting(true);
    setSubmitProgress(0);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('collegeId', uploadState.selectedCollege);
      formData.append('year', year || '2025');
      for (const [key, file] of Object.entries(ctxFiles)) {
        formData.append(key, file);
      }
      await api.postUpload('/uploads/submit', formData, setSubmitProgress);
      await queryClient.invalidateQueries({ queryKey: ['colleges'] });
      await queryClient.invalidateQueries({ queryKey: ['uploads'] });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const totalUploadBytes = Object.values(ctxFiles).reduce((sum, f) => sum + f.size, 0);
  const uploadedMb = ((submitProgress * totalUploadBytes) / (1024 * 1024)).toFixed(1);
  const totalMb    = (totalUploadBytes / (1024 * 1024)).toFixed(1);

  useEffect(() => {
    if (!submitted) return;
    // Only clear the submitted year — other years' data stays intact
    const timer = setTimeout(() => {
      clearSubmittedYear(year);
      clearFilesForYear(year);
      navigate(PATHS.collegeUpload);
    }, 5000);
    return () => clearTimeout(timer);
  }, [submitted, year, navigate, clearFilesForYear]);

  useEffect(() => {
    if (!hasFiles && allRequiredPresent) {
      navigate(PATHS.collegeUpload, { replace: true });
    }
  }, [hasFiles, allRequiredPresent, navigate]);

  const previewFile = previewKey ? ctxFiles[previewKey] : undefined;

  return (
    <PortalLayout>
      {!isCollegeUser && <Breadcrumb items={STEPS} activeStep={3} />}

      <div className="summaryPage">
        <div className="summaryHeader">
          <h1 className="summaryTitle">Submission Summary</h1>
          <p className="summarySubtitle">Please review your submission details below.</p>
        </div>

        <div className="summaryInfoRow">
          <div className="summaryInfoCard">
            <h2 className="summaryInfoCardTitle">Provider Information</h2>
            <table className="summaryInfoTable">
              <tbody>
                <tr><th>Provider Name</th><td>{provider.provider || '—'}</td></tr>
                <tr><th>Full Name</th><td>{provider.fullName || '—'}</td></tr>
                <tr><th>Email</th><td>{provider.email || '—'}</td></tr>
                <tr><th>Contact Number</th><td>{provider.contact || '—'}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="summaryInfoCard">
            <h2 className="summaryInfoCardTitle">College Information</h2>
            <table className="summaryInfoTable">
              <tbody>
                <tr><th>Selected College</th><td>{uploadState.selectedCollegeName || '—'}</td></tr>
                <tr><th>Upload Year</th><td>{year || '—'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="summaryDocsCard">
          <h2 className="summaryDocsTitle">Uploaded Documents</h2>
          <div className="tableWrapper">
            <table className="summaryDocsTable">
              <thead>
                <tr><th>Document</th><th>File Name</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {DOC_ORDER.map((key) => {
                  const entry = uploads[key];
                  return (
                    <tr key={key}>
                      <td className="docNameCell">{DOC_LABELS[key]}</td>
                      <td className="fileNameCell">{entry?.fileName ?? '—'}</td>
                      <td>
                        {entry ? <span className="docUploadedBadge"><CheckIcon /> Uploaded</span> : <span className="docPendingBadge">Not uploaded</span>}
                      </td>
                      <td className="actionsCell">
                        <button className="iconBtn" type="button" title="Preview" disabled={!entry || !ctxFiles[key]} onClick={() => entry && ctxFiles[key] && setPreviewKey(key)}>
                          <EyeIcon />
                        </button>
                        <button className="iconBtn iconBtn--delete" type="button" title="Delete" disabled={!entry} onClick={() => handleDelete(key)}>
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

        {submitError && <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: '0.5rem 0' }}>{submitError}</p>}

        {submitting && (
          <div className="uploadProgressWrap">
            <div className="uploadProgressTrack">
              <div className="uploadProgressFill" style={{ width: `${Math.round(submitProgress * 100)}%` }} />
            </div>
            <span className="uploadProgressLabel">
              Uploading… {Math.round(submitProgress * 100)}% ({uploadedMb} / {totalMb} MB)
            </span>
          </div>
        )}

        <div className="consentSection">
          <p className="consentWarning">Please review all uploaded information before confirming your submission. Once confirmed, your files will not be able to make any edits.</p>
          <label className="consentLabel">
            <input type="checkbox" className="consentCheckbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
            I confirm that the uploaded documents are correct.
          </label>
        </div>

        <div className="summaryActions">
          <Link to={PATHS.collegeUpload} className="summaryBackBtn"><BackArrowIcon /> Back</Link>
          <button type="button" className={`confirmBtn${canConfirm ? ' confirmBtn--active' : ''}`} disabled={!canConfirm} onClick={handleConfirm}>
            {submitting ? 'Uploading…' : <><span>Confirm Upload</span> <CheckmarkIcon /></>}
          </button>
        </div>
      </div>

      {submitted && (
        <div className="modalOverlay">
          <div className="modalCard">
            <div className="modalIconCircle"><BigCheckIcon /></div>
            <h2 className="modalTitle">Upload Successful</h2>
            <p className="modalSubtitle">Your TVET college submission has been successfully uploaded.</p>
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
              <div className="modalSummaryTopRow">
                <div className="modalSummaryItem">
                  <span className="modalSummaryLabel">Upload Year</span>
                  <span className="modalSummaryValue">{year || '—'}</span>
                </div>
                <div className="modalSummaryItem">
                  <span className="modalSummaryLabel">Submission Date</span>
                  <span className="modalSummaryValue">{submissionDate}</span>
                </div>
              </div>
            </div>
            <p className="modalRedirectNote">Redirecting you in 5 seconds…</p>
          </div>
        </div>
      )}

      {previewFile && previewKey && (
        <PreviewModal file={previewFile} fileName={uploads[previewKey]?.fileName} onClose={() => setPreviewKey(null)} />
      )}
    </PortalLayout>
  );
}
