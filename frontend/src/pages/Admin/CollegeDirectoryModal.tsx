import { useState } from 'react';
import { PROVIDER_COLLEGE_MAP } from './adminProviderMap';
import { IconX, IconSearch } from './AdminIcons';

export default function CollegeDirectoryModal({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('');
  const q = search.toLowerCase();

  const filtered = Object.entries(PROVIDER_COLLEGE_MAP).reduce<Record<string, string[]>>(
    (acc, [provider, colleges]) => {
      const matched = colleges.filter(
        (c) => c.toLowerCase().includes(q) || provider.toLowerCase().includes(q),
      );
      if (matched.length) acc[provider] = matched;
      return acc;
    },
    {},
  );

  const total = Object.values(PROVIDER_COLLEGE_MAP).reduce((s, arr) => s + arr.length, 0);

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox modalBox--directory" onClick={(e) => e.stopPropagation()}>
        <div className="modalBox__header">
          <div>
            <h2 className="modalBox__title">College Directory</h2>
            <p className="modalBox__sub">All {total} colleges grouped by provider</p>
          </div>
          <button className="modalClose" onClick={onClose}><IconX /></button>
        </div>

        <div className="modalBox__search">
          <IconSearch />
          <input
            autoFocus
            placeholder="Search college or provider…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="modalBox__body">
          {Object.keys(filtered).length === 0 ? (
            <p className="adminEmpty">No colleges match your search.</p>
          ) : (
            Object.entries(filtered).map(([provider, colleges]) => (
              <div key={provider} className="dirGroup">
                <div className="dirGroup__header">
                  <span className="dirGroup__name">{provider}</span>
                  <span className="dirGroup__count">{colleges.length} college{colleges.length !== 1 ? 's' : ''}</span>
                </div>
                {colleges.map((name) => (
                  <div key={name} className="dirGroup__row">{name}</div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
