import { useState } from 'react';
import { pct, barColor, lastSubmission } from './adminHelpers';
import { TOTAL_FOLDERS } from './adminTypes';
import { PROVIDER_TOTALS } from './adminProviderMap';
import { IconChevronRight } from './AdminIcons';
import { ProgressBar } from './StatsCards';
import FileModal from './FileModal';
import type { Provider, ProviderCollege } from './adminTypes';

const YEARS = ['2025', '2026'] as const;
type Year = typeof YEARS[number];

function ProviderTile({
  provider, selected, onClick,
}: { provider: Provider; selected: boolean; onClick: () => void }) {
  const totalFiles = provider.colleges.reduce((s, c) => s + c.files.length, 0);
  const hasData = provider.colleges.length > 0;
  const totalColleges = PROVIDER_TOTALS[provider.providerName] ?? provider.colleges.length;
  const uploadedColleges = provider.colleges.length;

  return (
    <button
      className={`providerTile${selected ? ' providerTile--selected' : ''}${!hasData ? ' providerTile--empty' : ''}`}
      onClick={onClick}
    >
      <div className="providerTile__icon">{provider.providerName.charAt(0)}</div>
      <div className="providerTile__name">{provider.providerName}</div>
      <div className="providerTile__stats">
        <span className="providerTile__stat">
          <strong>{uploadedColleges} of {totalColleges}</strong>
          <span>college{totalColleges !== 1 ? 's' : ''}</span>
        </span>
        <span className="providerTile__divider" />
        <span className="providerTile__stat">
          <strong>{totalFiles}</strong>
          <span>file{totalFiles !== 1 ? 's' : ''}</span>
        </span>
      </div>
      {!hasData && <span className="providerTile__nodata">No submissions yet</span>}
    </button>
  );
}

interface ModalState { college: ProviderCollege; year: Year; }

function YearCollegePanel({
  year, colleges, provider, onView,
}: {
  year: Year;
  colleges: ProviderCollege[];
  provider: string;
  onView: (college: ProviderCollege, year: Year) => void;
}) {
  // Colleges that have at least one file for this year
  const yearColleges = colleges
    .map((c) => ({ ...c, files: c.files.filter((f) => f.year === year) }))
    .filter((c) => c.files.length > 0);

  return (
    <div className="yearPanel">
      <div className="yearPanel__header">
        <span className="yearPanel__badge">{year}</span>
        <span className="yearPanel__count">
          {yearColleges.length} college{yearColleges.length !== 1 ? 's' : ''}
        </span>
      </div>
      {yearColleges.length === 0 ? (
        <div className="yearPanel__empty">No submissions for {year}</div>
      ) : (
        <table className="collegeTable">
          <thead>
            <tr>
              <th>College</th>
              <th>Progress</th>
              <th>Files</th>
              <th>Last Submission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {yearColleges.map((college) => {
              const collegePct = pct(college.files.length, TOTAL_FOLDERS);
              return (
                <tr key={college.collegeId}>
                  <td className="td--collegeName">{college.collegeName}</td>
                  <td>
                    <div className="inlineProgress">
                      <ProgressBar value={collegePct} color={barColor(collegePct)} />
                      <span>{college.files.length} of {TOTAL_FOLDERS}</span>
                    </div>
                  </td>
                  <td>{college.files.length}</td>
                  <td>{lastSubmission(college.files)}</td>
                  <td>
                    <button className="viewLink" onClick={() => onView(college, year)}>
                      View files <IconChevronRight />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ProviderYearSplit({ provider }: { provider: Provider }) {
  const [modal, setModal] = useState<ModalState | null>(null);

  if (provider.colleges.length === 0) {
    return (
      <div className="providerDetail">
        <div className="adminEmpty">
          No colleges have submitted files under <strong>{provider.providerName}</strong> yet.
        </div>
      </div>
    );
  }

  return (
    <div className="providerDetail">
      <div className="yearSplitRow">
        {YEARS.map((year) => (
          <YearCollegePanel
            key={year}
            year={year}
            colleges={provider.colleges}
            provider={provider.providerName}
            onView={(college, y) => setModal({ college, year: y })}
          />
        ))}
      </div>
      {modal && (
        <FileModal
          college={modal.college}
          provider={provider.providerName}
          year={modal.year}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default function ProvidersSection({ providers }: { providers: Provider[] }) {
  const [selected, setSelected] = useState<string | null>(
    providers.find((p) => p.colleges.length > 0)?.providerName ?? null,
  );
  const selectedProvider = providers.find((p) => p.providerName === selected) ?? null;

  return (
    <div className="adminSection">
      <div className="adminSection__header">
        <div>
          <h2 className="adminSection__title">Providers and College Submissions</h2>
          <p className="adminSection__sub">Select a provider to view its college submissions by year.</p>
        </div>
      </div>
      <div className="providerGrid">
        {providers.map((p) => (
          <ProviderTile
            key={p.providerName}
            provider={p}
            selected={selected === p.providerName}
            onClick={() => setSelected(selected === p.providerName ? null : p.providerName)}
          />
        ))}
      </div>
      {selectedProvider && (
        <ProviderYearSplit key={selectedProvider.providerName} provider={selectedProvider} />
      )}
    </div>
  );
}
