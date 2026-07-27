import { useState } from 'react';
import { pct } from './adminHelpers';
import { IconFile, IconChevronRight, IconX } from './AdminIcons';
import { ProgressBar } from './StatsCards';
import type { AdminStats, FileTypeCount, Provider } from './adminTypes';

function CollegesForDocModal({
  ft, providers, totalColleges, onClose,
}: {
  ft: FileTypeCount; providers: Provider[]; totalColleges: number; onClose: () => void;
}) {
  const uploaded: { name: string; provider: string }[] = [];
  const missing: { name: string }[] = [];

  const uploadedIds = new Set<number>();
  for (const p of providers) {
    for (const c of p.colleges) {
      if (c.files.some((f) => f.folder === ft.folder)) {
        uploadedIds.add(c.collegeId);
        uploaded.push({ name: c.collegeName, provider: p.providerName });
      }
    }
  }
  for (const p of providers) {
    for (const c of p.colleges) {
      if (!uploadedIds.has(c.collegeId)) missing.push({ name: c.collegeName });
    }
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        <div className="modalBox__header">
          <div>
            <p className="modalBox__title">{ft.label}</p>
            <p className="modalBox__subtitle">
              {uploaded.length} of {totalColleges} colleges have uploaded this document
            </p>
          </div>
          <button className="modalCloseBtn" onClick={onClose}><IconX /></button>
        </div>
        <div className="modalBox__body">
          {uploaded.length > 0 && (
            <>
              <div className="docModalSection">Uploaded ({uploaded.length})</div>
              {uploaded.map((c) => (
                <div key={c.name} className="docCollegeItem">
                  <span className="docCollegeItem__dot docCollegeItem__dot--yes" />
                  {c.name}
                  <span className="docCollegeItem__provider">{c.provider}</span>
                </div>
              ))}
            </>
          )}
          {missing.length > 0 && (
            <>
              <div className="docModalSection">Not yet uploaded ({missing.length})</div>
              {missing.map((c) => (
                <div key={c.name} className="docCollegeItem">
                  <span className="docCollegeItem__dot docCollegeItem__dot--no" />
                  {c.name}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DocumentProgress({
  stats, providers,
}: { stats: AdminStats; providers: Provider[] }) {
  const [tab, setTab] = useState<'mandatory' | 'optional'>('mandatory');
  const [docModal, setDocModal] = useState<FileTypeCount | null>(null);

  const shown = stats.fileTypeCounts.filter((f) =>
    tab === 'mandatory' ? f.required : !f.required,
  );

  return (
    <div className="adminSection">
      <div className="adminSection__header">
        <div>
          <h2 className="adminSection__title">Document Submission Progress</h2>
          <p className="adminSection__sub">
            Completion rate per document type across all <strong>{stats.totalColleges}</strong> colleges.
          </p>
        </div>
      </div>
      <div className="docProgressCard">
        <div className="docTabRow">
          <button className={`docTabBtn${tab === 'mandatory' ? ' docTabBtn--active' : ''}`} onClick={() => setTab('mandatory')}>
            Mandatory Documents
          </button>
          <button className={`docTabBtn${tab === 'optional' ? ' docTabBtn--active' : ''}`} onClick={() => setTab('optional')}>
            Optional Documents
          </button>
        </div>
        {shown.map((ft) => {
          const p = pct(ft.uploadedCount, stats.totalColleges);
          return (
            <div key={ft.folder} className="docRow">
              <div className="docRow__icon"><IconFile /></div>
              <div className="docRow__main">
                <div className="docRow__nameRow">
                  <span className="docRow__name">{ft.label}</span>
                  <span className={`badge ${ft.required ? 'badge--required' : 'badge--optional'}`}>
                    {ft.required ? 'Required' : 'Optional'}
                  </span>
                </div>
                <ProgressBar value={p} height={7} />
              </div>
              <div className="docRow__right">
                <span className="docRow__count">{ft.uploadedCount} of {stats.totalColleges} · {p}%</span>
                <span className="docRow__reuploads">{ft.updatedCount} re-uploads</span>
                <button className="viewLink" onClick={() => setDocModal(ft)}>
                  View colleges <IconChevronRight />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {docModal && (
        <CollegesForDocModal
          ft={docModal}
          providers={providers}
          totalColleges={stats.totalColleges}
          onClose={() => setDocModal(null)}
        />
      )}
    </div>
  );
}
