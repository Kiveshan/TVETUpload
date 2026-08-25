import { useRef, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import ReuploadRequestModal from './ReuploadRequestModal';
import './UploadHistory.css';

interface HistoryDocument {
  upload_id: number;
  document_label: string;
  file_name: string;
  s3_key: string;
  created_at: string;
}

interface Props {
  collegeId: number | null;
  year: string | null;
}

function useCollegeHistory(collegeId: number | null, year: string | null) {
  return useQuery({
    queryKey: ['uploads', 'history', collegeId, year],
    queryFn: () =>
      api.get<{ documents: HistoryDocument[] }>(`/uploads/history/${collegeId}?year=${year}`).then((r) => r.documents),
    enabled: collegeId !== null && year !== null,
  });
}

interface TooltipPos { doc: string; top: number; left: number; caretLeft: number; }

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ReuploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function UploadHistory({ collegeId, year }: Props) {
  const queryClient = useQueryClient();
  const { data: documents = [], isLoading } = useCollegeHistory(collegeId, year);
  const [tooltip, setTooltip]       = useState<TooltipPos | null>(null);
  const [previewDoc, setPreviewDoc] = useState<HistoryDocument | null>(null);
  const [reuploadDoc, setReuploadDoc] = useState<HistoryDocument | null>(null);

  const [uploadingHeadcount, setUploadingHeadcount] = useState(false);
  const [headcountError, setHeadcountError]         = useState<string | null>(null);
  const headcountInputRef = useRef<HTMLInputElement>(null);

  const hasHeadcount = documents.some((d) => d.s3_key.includes('/head_count_enrollment/'));

  useEffect(() => {
    if (!tooltip) return;
    function handler(e: MouseEvent) {
      const t = e.target as Element;
      if (!t.closest('.reuploadTooltip') && !t.closest('.iconBtn--reupload')) setTooltip(null);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tooltip]);

  async function handleHeadcountFile(files: FileList | null) {
    const file = files?.[0];
    if (!file || !collegeId || !year) return;
    setUploadingHeadcount(true);
    setHeadcountError(null);
    try {
      const formData = new FormData();
      formData.append('headcount', file);
      formData.append('year', year);
      await api.postUpload(`/uploads/headcount/${collegeId}`, formData);
      await queryClient.invalidateQueries({ queryKey: ['uploads', 'history', collegeId] });
    } catch (err) {
      setHeadcountError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploadingHeadcount(false);
      if (headcountInputRef.current) headcountInputRef.current.value = '';
    }
  }

  if (!collegeId) {
    return (
      <div className="documentsCard">
        <p style={{ color: '#6b7280', padding: '1.5rem 0' }}>Select a college above to view its upload history.</p>
      </div>
    );
  }

  if (!year) {
    return (
      <div className="documentsCard">
        <p style={{ color: '#6b7280', padding: '1.5rem 0' }}>Select a year above to view the upload history.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="documentsCard"><p style={{ color: '#6b7280', padding: '1.5rem 0' }}>Loading…</p></div>;
  }

  if (!documents.length) {
    return <div className="documentsCard"><p style={{ color: '#6b7280', padding: '1.5rem 0' }}>No documents found for this college.</p></div>;
  }

  return (
    <>
      <div className="documentsCard">
        <h2>Uploaded Documents</h2>
        <div className="tableWrapper">
          <table className="docsTable">
            <thead>
              <tr>
                <th>Document</th>
                <th>File Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.upload_id}>
                  <td className="docName">{doc.document_label === 'Head Count Enrollment' ? 'Head Count Enrollment 2025' : doc.document_label}</td>
                  <td className="fileName">{doc.file_name}</td>
                  <td><span className="statusBadge statusBadge--uploaded">✓ Uploaded</span></td>
                  <td>
                    <div className="actionsCell">
                      <button className="iconBtn" title="Preview" aria-label="Preview file" onClick={() => setPreviewDoc(doc)}>
                        <EyeIcon />
                      </button>
                      <button
                        className="iconBtn iconBtn--reupload"
                        title="Re-upload"
                        aria-label="Re-upload file"
                        onClick={(e) => {
                          if (tooltip?.doc === doc.s3_key) { setTooltip(null); return; }
                          const rect = e.currentTarget.getBoundingClientRect();
                          const tooltipWidth = 340;
                          const spaceRight = window.innerWidth - rect.right;
                          const left = spaceRight < tooltipWidth + 8 ? rect.right - tooltipWidth : rect.left;
                          const buttonCenterX = rect.left + rect.width / 2;
                          const caretLeft = Math.min(Math.max(buttonCenterX - left, 20), tooltipWidth - 20);
                          setTooltip({ doc: doc.s3_key, top: rect.bottom + 8, left, caretLeft });
                        }}
                      >
                        <ReuploadIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!hasHeadcount && (
                <tr className="headcountUploadRow">
                  <td className="docName" style={{ color: '#6b7280' }}>Head Count Enrollment 2025</td>
                  <td className="fileName" style={{ color: '#9ca3af' }}>Not uploaded</td>
                  <td><span className="statusBadge statusBadge--pending">⏱ Pending</span></td>
                  <td>
                    <div className="actionsCell">
                      <button
                        className="headcountUploadBtn"
                        title="Upload Head Count Enrollment"
                        aria-label="Upload Head Count Enrollment"
                        disabled={uploadingHeadcount}
                        onClick={() => headcountInputRef.current?.click()}
                      >
                        {uploadingHeadcount ? (
                          <span className="headcountSpinner" />
                        ) : (
                          <><PlusIcon /> Upload Headcount</>
                        )}
                      </button>
                      <input
                        ref={headcountInputRef}
                        type="file"
                        accept=".xlsx,.csv"
                        style={{ display: 'none' }}
                        onChange={(e) => handleHeadcountFile(e.target.files)}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {headcountError && (
          <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.75rem' }}>{headcountError}</p>
        )}
      </div>

      {tooltip && (
        <div
          className="reuploadTooltip"
          style={{ top: tooltip.top, left: tooltip.left, '--caret-left': `${tooltip.caretLeft}px` } as React.CSSProperties}
        >
          <h4 className="reuploadTitle">Replace This File?</h4>
          <p className="reuploadBody">This will replace the current file with a new one. Continue to choose a replacement.</p>
          <div className="reuploadActions">
            <button
              className="sendRequestBtn"
              onClick={() => {
                const doc = documents.find((d) => d.s3_key === tooltip.doc);
                setTooltip(null);
                if (doc) setReuploadDoc(doc);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {previewDoc && (
        <PreviewModal
          s3Key={previewDoc.s3_key}
          fileName={previewDoc.file_name}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {reuploadDoc && (
        <ReuploadRequestModal
          uploadId={reuploadDoc.upload_id}
          documentLabel={reuploadDoc.document_label}
          onClose={() => setReuploadDoc(null)}
        />
      )}
    </>
  );
}
