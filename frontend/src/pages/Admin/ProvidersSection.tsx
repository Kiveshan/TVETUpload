import { useState } from 'react';
import { getMissing, pct, barColor, lastSubmission } from './adminHelpers';
import { TOTAL_FOLDERS } from './adminTypes';
import { IconWarning, IconChevronRight } from './AdminIcons';
import { ProgressBar } from './StatsCards';
import FileModal from './FileModal';
import type { Provider, ProviderCollege } from './adminTypes';

function ProviderTile({
  provider, selected, onClick,
}: { provider: Provider; selected: boolean; onClick: () => void }) {
  const totalFiles = provider.colleges.reduce((s, c) => s + c.files.length, 0);
  const hasData = provider.colleges.length > 0;

  return (
    <button
      className={`providerTile${selected ? ' providerTile--selected' : ''}${!hasData ? ' providerTile--empty' : ''}`}
      onClick={onClick}
    >
      <div className="providerTile__icon">{provider.providerName.charAt(0)}</div>
      <div className="providerTile__name">{provider.providerName}</div>
      <div className="providerTile__stats">
        <span className="providerTile__stat">
          <strong>{provider.colleges.length}</strong>
          <span>college{provider.colleges.length !== 1 ? 's' : ''}</span>
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

function ProviderCollegeTable({ provider }: { provider: Provider }) {
  const [fileModal, setFileModal] = useState<ProviderCollege | null>(null);

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
      <div className="collegeTableWrap">
        <table className="collegeTable">
          <thead>
            <tr>
              <th>College</th>
              <th>Submission Progress</th>
              <th>Files</th>
              <th>Missing</th>
              <th>Last Submission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {provider.colleges.map((college) => {
              const missing = getMissing(college.files);
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
                  <td>
                    {missing.length === 0
                      ? <span className="badge badge--none">&#10003; None</span>
                      : <span className="badge badge--missing"><IconWarning /> {missing.length}</span>}
                  </td>
                  <td>{lastSubmission(college.files)}</td>
                  <td>
                    <button className="viewLink" onClick={() => setFileModal(college)}>
                      View files <IconChevronRight />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {fileModal && (
        <FileModal college={fileModal} provider={provider.providerName} onClose={() => setFileModal(null)} />
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
          <p className="adminSection__sub">Select a provider to view its college submissions.</p>
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
        <ProviderCollegeTable key={selectedProvider.providerName} provider={selectedProvider} />
      )}
    </div>
  );
}
