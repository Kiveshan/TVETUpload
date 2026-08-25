import { useState } from 'react';
import { downloadBlob } from './adminHelpers';
import { IconX, IconDownload } from './AdminIcons';
import type { ProviderCollege, UploadFile } from './adminTypes';

interface Props {
  college: ProviderCollege;
  provider: string;
  year: string;
  onClose: () => void;
}

export default function FileModal({ college, provider, year, onClose }: Props) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const files: UploadFile[] = college.files.filter((f) => f.year === year);

  async function handleFile(file: UploadFile) {
    setDownloading(file.s3Key);
    try {
      await downloadBlob(
        `/admin/download?s3Key=${encodeURIComponent(file.s3Key)}`,
        file.fileName,
      );
    } finally { setDownloading(null); }
  }

  async function handleFolder() {
    setDownloading('folder');
    try {
      await downloadBlob(
        `/admin/download-folder?provider=${encodeURIComponent(provider)}&collegeName=${encodeURIComponent(college.collegeName)}&year=${encodeURIComponent(year)}`,
        `${provider}_${college.collegeName}_${year}.zip`,
      );
    } finally { setDownloading(null); }
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        <div className="modalBox__header">
          <div>
            <p className="modalBox__title">{college.collegeName}</p>
            <p className="modalBox__subtitle">
              {provider} · {year} · {files.length} file{files.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="modalCloseBtn" onClick={onClose}><IconX /></button>
        </div>
        <div className="modalBox__body">
          {files.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem', padding: '0.5rem 0' }}>
              No files uploaded for {year}.
            </p>
          ) : (
            files.map((file) => (
              <div key={file.uploadId} className="modalFileRow">
                <span className="modalFileRow__label">{file.label}</span>
                <span className="modalFileRow__name" title={file.fileName}>{file.fileName}</span>
                {file.reuploadsCount > 0 && (
                  <span className="modalFileRow__updated">Updated {file.reuploadsCount}×</span>
                )}
                <div className="modalFileRow__actions">
                  <button
                    className="dlBtnSm"
                    disabled={downloading === file.s3Key}
                    onClick={() => handleFile(file)}
                  >
                    <IconDownload size={12} />
                    {downloading === file.s3Key ? 'Saving…' : 'Download'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="modalBox__footer">
          <button className="btnOutline" onClick={onClose}>Close</button>
          <button
            className="btnPrimary"
            disabled={downloading === 'folder' || files.length === 0}
            onClick={handleFolder}
          >
            <IconDownload />
            {downloading === 'folder' ? 'Zipping…' : `Download ${year} ZIP`}
          </button>
        </div>
      </div>
    </div>
  );
}
