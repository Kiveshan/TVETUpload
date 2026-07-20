import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
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
}

function useCollegeHistory(collegeId: number | null) {
  return useQuery({
    queryKey: ['uploads', 'history', collegeId],
    queryFn: () =>
      api.get<{ documents: HistoryDocument[] }>(`/uploads/history/${collegeId}`).then((r) => r.documents),
    enabled: collegeId !== null,
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


export default function UploadHistory({ collegeId }: Props) {
  const { data: documents = [], isLoading } = useCollegeHistory(collegeId);
  const [tooltip, setTooltip]   = useState<TooltipPos | null>(null);
  const [previewDoc, setPreviewDoc] = useState<HistoryDocument | null>(null);

  useEffect(() => {
    if (!tooltip) return;
    function handler(e: MouseEvent) {
      const t = e.target as Element;
      if (!t.closest('.reuploadTooltip') && !t.closest('.iconBtn--reupload')) setTooltip(null);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tooltip]);

  if (!collegeId) {
    return (
      <div className="documentsCard">
        <p style={{ color: '#6b7280', padding: '1.5rem 0' }}>Select a college above to view its upload history.</p>
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
                  <td className="docName">{doc.document_label}</td>
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
            </tbody>
          </table>
        </div>
      </div>

      {tooltip && (
        <div
          className="reuploadTooltip"
          style={{ top: tooltip.top, left: tooltip.left, '--caret-left': `${tooltip.caretLeft}px` } as React.CSSProperties}
        >
          <h4 className="reuploadTitle">Re-upload a File</h4>
          <p className="reuploadBody">To re-upload a file you will need to send a request.</p>
          <div className="reuploadActions">
            <button className="sendRequestBtn" onClick={() => setTooltip(null)}>Send Request</button>
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
    </>
  );
}
