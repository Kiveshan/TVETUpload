import { useEffect, useRef, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import { api, ApiError } from '../../lib/api';
import { queryClient } from '../../lib/queryClient';
import { BigCheckIcon } from '../SubmissionSummary/icons';
import { DocIcon, UploadCloudIcon, FileSmallIcon, TrashIcon } from './icons';
import './UploadCard.css';
import './ReuploadRequestModal.css';

interface ReuploadRequestModalProps {
  uploadId: number;
  documentLabel: string;
  onClose: () => void;
}

export default function ReuploadRequestModal({ uploadId, documentLabel, onClose }: ReuploadRequestModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  function handleFile(files: FileList | null) {
    const picked = files?.[0];
    if (picked) setFile(picked);
  }

  async function handleReplace() {
    if (!file) return;
    setSending(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/uploads/${uploadId}/reupload`, formData);
      await queryClient.invalidateQueries({ queryKey: ['uploads', 'history'] });
      setUploaded(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Re-upload failed. Please try again.');
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (!uploaded) return;
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [uploaded, onClose]);

  if (uploaded) {
    return (
      <Modal onClose={onClose} labelledBy="reupload-success-title" className="reuploadRequestModal">
        <div className="reuploadSuccessIconCircle"><BigCheckIcon /></div>
        <h2 id="reupload-success-title" className="reuploadRequestTitle reuploadSuccessTitle">
          Upload Successful
        </h2>
        <p className="reuploadSuccessSubtitle">
          The new file has been saved and the previous version archived.
        </p>
        <div className="reuploadSuccessSummaryBox">
          <span className="reuploadSuccessLabel">Document</span>
          <span className="reuploadSuccessValue">{documentLabel}</span>
          <span className="reuploadSuccessLabel">File Name</span>
          <span className="reuploadSuccessValue">{file?.name}</span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} labelledBy="reupload-request-title" className="reuploadRequestModal">
      <h2 id="reupload-request-title" className="reuploadRequestTitle">
        Replace File
      </h2>
      <p className="reuploadRequestSubtitle">
        Upload the new version below. It will permanently replace the current file for this document.
      </p>

      <div className="docUploadCard reuploadRequestCard">
        <div className="docCardHeader">
          <div className="docCardLeft">
            <div className="docIconBox"><DocIcon /></div>
            <div className="docCardInfo">
              <div className="docCardTitleRow">
                <span className="docCardTitle">{documentLabel}</span>
              </div>
              <span className="docCardSubtitle">Excel (.xlsx) or CSV</span>
            </div>
          </div>
        </div>

        {file ? (
          <div className="uploadedState">
            <div className="uploadedFileBox">
              <div className="uploadedFileRow">
                <span className="uploadedFileName">{file.name}</span>
                <FileSmallIcon />
              </div>
              <div className="uploadedActions">
                <button className="deleteBtn" type="button" onClick={() => setFile(null)}>
                  <TrashIcon /> Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="dropZone"
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files); }}
          >
            <UploadCloudIcon />
            <span className="dropZoneText">Drop your file or click to upload</span>
            <span className="dropZoneHint">.xlsx or .csv</span>
            <input
              type="file"
              accept=".xlsx,.csv"
              className="dropZoneInput"
              ref={fileRef}
              onChange={(e) => handleFile(e.target.files)}
            />
          </div>
        )}
      </div>

      {error && <p className="reuploadRequestError" role="alert">{error}</p>}

      <Button fullWidth disabled={!file || sending} onClick={handleReplace} className="reuploadRequestSubmit">
        {sending ? 'Replacing…' : 'Replace File'}
      </Button>
    </Modal>
  );
}
