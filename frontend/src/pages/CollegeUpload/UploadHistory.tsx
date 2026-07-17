import { useState, useEffect } from 'react';
import './UploadHistory.css';

const DOCUMENT_TYPES = [
  'College Information',
  'Programme, Subject & Qualifications',
  'Student Data',
  'Staff Data',
];

const MOCK_FILENAME = 'Practice Note 2_College Performance Reporting T...';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ReuploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

interface TooltipPos {
  doc: string;
  top: number;
  left: number;
  alignRight: boolean;
}

export default function UploadHistory() {
  const [tooltip, setTooltip] = useState<TooltipPos | null>(null);

  // Close tooltip on outside click
  useEffect(() => {
    if (!tooltip) return;
    function handler(e: MouseEvent) {
      const target = e.target as Element;
      if (!target.closest('.reuploadTooltip') && !target.closest('.iconBtn--reupload')) {
        setTooltip(null);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tooltip]);

  function handleReuploadClick(e: React.MouseEvent<HTMLButtonElement>, doc: string) {
    if (tooltip?.doc === doc) {
      setTooltip(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    // position: fixed uses viewport coords — no scroll offsets needed
    const tooltipWidth = 230;
    const spaceRight = window.innerWidth - rect.right;
    const alignRight = spaceRight < tooltipWidth + 8;
    setTooltip({
      doc,
      top: rect.bottom + 8,
      left: alignRight ? rect.right - tooltipWidth : rect.left,
      alignRight,
    });
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
            {DOCUMENT_TYPES.map((doc) => (
              <tr key={doc}>
                <td className="docName">{doc}</td>
                <td className="fileName">{MOCK_FILENAME}</td>
                <td>
                  <span className="statusBadge statusBadge--uploaded">✓ Uploaded</span>
                </td>
                <td>
                  <div className="actionsCell">
                    <button className="iconBtn" title="View" aria-label="View file">
                      <EyeIcon />
                    </button>
                    <button
                      className="iconBtn iconBtn--reupload"
                      title="Re-upload"
                      aria-label="Re-upload file"
                      onClick={(e) => handleReuploadClick(e, doc)}
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

      {/* Tooltip rendered at fixed position — bypasses any overflow:hidden ancestors */}
      {tooltip && (
        <div
          className="reuploadTooltip"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          <h4>Re-upload a File</h4>
          <p>To re-upload a file you will need to send a request.</p>
          <button className="sendRequestBtn" onClick={() => setTooltip(null)}>
            Send Request
          </button>
        </div>
      )}
    </>
  );
}
