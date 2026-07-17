import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PortalLayout from '../../layouts/PortalLayout/PortalLayout';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import UploadHistory from './UploadHistory';
import { PATHS } from '../../routes/paths';
import { api } from '../../lib/api';
import './CollegeUpload.css';

interface College {
  college_id: number;
  college_name: string;
}

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

const DOCUMENT_TYPES = [
  'College Information',
  'Programme, Subject & Qualifications',
  'Student Data',
  'Staff Data',
];

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0047a2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function UploadArrowIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0047a2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

type Tab = 'new' | 'history';

export default function CollegeUpload() {
  const [activeTab, setActiveTab] = useState<Tab>('new');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [historyCollege, setHistoryCollege] = useState('');
  const { data: colleges = [], isLoading } = useColleges();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    <PortalLayout>
      <Breadcrumb items={STEPS} activeStep={2} />

      {/* Tab toggle row — college select appears inline when history tab is active */}
      <div className="uploadTabRow">
        <button
          type="button"
          className={`tabBtn${activeTab === 'new' ? ' tabBtn--active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New Upload
        </button>
        <button
          type="button"
          className={`tabBtn${activeTab === 'history' ? ' tabBtn--active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Upload History
        </button>

        {activeTab === 'history' && (
          <select
            className="historyCollegeInline"
            value={historyCollege}
            onChange={(e) => setHistoryCollege(e.target.value)}
            disabled={isLoading}
          >
            <option value="">{isLoading ? 'Loading…' : 'Select a college to view'}</option>
            {colleges.map((c) => (
              <option key={c.college_id} value={c.college_id}>
                {c.college_name}
              </option>
            ))}
          </select>
        )}
      </div>

      {activeTab === 'new' ? (
        <>
          {/* College selection card */}
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
                onChange={(e) => setSelectedCollege(e.target.value)}
                disabled={isLoading}
                required
              >
                <option value="">{isLoading ? 'Loading colleges…' : 'Choose a college'}</option>
                {colleges.map((c) => (
                  <option key={c.college_id} value={c.college_id}>
                    {c.college_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Document upload cards — shown once a college is selected */}
          {selectedCollege && (
            <div className="uploadCardsGrid">
              {DOCUMENT_TYPES.map((doc) => (
                <div key={doc} className="docUploadCard">
                  <div className="docCardHeader">
                    <div className="docCardTitleRow">
                      <FileIcon />
                      <span className="docCardTitle">{doc}</span>
                    </div>
                    <span className="pendingBadge">⏱ Pending</span>
                  </div>
                  <p className="docCardSubtitle">Excel (.xlsx) or CSV</p>

                  <div
                    className="dropZone"
                    onClick={() => fileInputRefs.current[doc]?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      // file handling wired up when backend is ready
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && fileInputRefs.current[doc]?.click()}
                  >
                    <UploadArrowIcon />
                    <span className="dropZoneText">Drop your file or click to upload</span>
                    <span className="dropZoneHint">.xlsx or .csv</span>
                    <input
                      type="file"
                      accept=".xlsx,.csv"
                      className="dropZoneInput"
                      ref={(el) => { fileInputRefs.current[doc] = el; }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <UploadHistory />
      )}

      <Link to={PATHS.providerInformation} className="backBtn">
        ← Back
      </Link>
    </PortalLayout>
  );
}
