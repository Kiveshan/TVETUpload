import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { api } from '../../lib/api';
import './PreviewModal.css';

export interface PreviewData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

interface Props {
  file?: File;
  s3Key?: string;
  fileName?: string;
  onClose: () => void;
}

function parseFileLocally(file: File, maxRows = 15): Promise<PreviewData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array', cellDates: true, sheetRows: maxRows + 2 });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) { resolve({ headers: [], rows: [], totalRows: 0 }); return; }
        const sheet = workbook.Sheets[sheetName];
        const data: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        if (!data.length) { resolve({ headers: [], rows: [], totalRows: 0 }); return; }
        const headers = (data[0] as unknown[]).map((h) => String(h ?? '').trim());
        const allRows = data.slice(1).map((r) => (r as unknown[]).map((c) => String(c ?? '').trim()));
        resolve({ headers, rows: allRows.slice(0, maxRows), totalRows: allRows.length });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export default function PreviewModal({ file, s3Key, fileName, onClose }: Props) {
  const [data, setData]       = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        let result: PreviewData;
        if (file) {
          result = await parseFileLocally(file);
        } else if (s3Key) {
          result = await api.get<PreviewData>(`/uploads/preview?s3Key=${encodeURIComponent(s3Key)}`);
        } else {
          throw new Error('No file source');
        }
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError('Failed to load preview. The file may be empty or in an unsupported format.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [file, s3Key]);

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="previewOverlay" onClick={handleBackdrop}>
      <div className="previewModal" role="dialog" aria-modal="true">
        <div className="previewHeader">
          <div>
            <h2 className="previewTitle">File Preview</h2>
            {fileName && <p className="previewFileName">{fileName}</p>}
          </div>
          <button className="previewClose" onClick={onClose} aria-label="Close preview">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="previewBody">
          {loading && <p className="previewStatus">Loading preview…</p>}
          {error   && <p className="previewStatus previewStatus--error">{error}</p>}
          {data && !loading && (
            data.headers.length === 0 ? (
              <p className="previewStatus">No data found in this file.</p>
            ) : (
              <>
                <div className="previewTableWrap">
                  <table className="previewTable">
                    <thead>
                      <tr>{data.headers.map((h, i) => <th key={i}>{h || '—'}</th>)}</tr>
                    </thead>
                    <tbody>
                      {data.rows.map((row, ri) => (
                        <tr key={ri}>
                          {data.headers.map((_, ci) => <td key={ci}>{row[ci] ?? '—'}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="previewNote">
                  Showing first {data.rows.length} of {data.totalRows} data rows
                </p>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
