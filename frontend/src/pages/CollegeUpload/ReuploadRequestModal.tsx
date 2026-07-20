import { useRef, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import { DocIcon, UploadCloudIcon, FileSmallIcon, TrashIcon } from './icons';
import './UploadCard.css';
import './ReuploadRequestModal.css';

interface ReuploadRequestModalProps {
  documentLabel: string;
  onClose: () => void;
}

export default function ReuploadRequestModal({ documentLabel, onClose }: ReuploadRequestModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  function handleFile(files: FileList | null) {
    const picked = files?.[0];
    if (picked) setFile(picked);
  }

  return (
    <Modal onClose={onClose} labelledBy="reupload-request-title" className="reuploadRequestModal">
      <h2 id="reupload-request-title" className="reuploadRequestTitle">
        Send Re-upload Request
      </h2>

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

      <Button fullWidth disabled={!file} onClick={onClose} className="reuploadRequestSubmit">
        Send Request
      </Button>
    </Modal>
  );
}
