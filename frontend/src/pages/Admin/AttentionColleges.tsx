import { useState, useMemo } from 'react';
import { IconAlert, IconChevronDown, IconSearch, IconBuilding } from './AdminIcons';
import { getProviderForCollege } from './adminProviderMap';

interface College { college_id: number; college_name: string; }

export default function AttentionColleges({ colleges }: { colleges: College[] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    // First group everything, then filter: keep providers whose name matches OR colleges whose name matches
    const map: Record<string, College[]> = {};
    for (const c of colleges) {
      const provider = getProviderForCollege(c.college_name) ?? 'Other';
      if (!map[provider]) map[provider] = [];
      map[provider].push(c);
    }
    // Sort colleges within each group A-Z
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.college_name.localeCompare(b.college_name));
    }
    if (!q) return map;
    // Filter: if provider name matches → show all its colleges; else show only matching colleges
    const result: Record<string, College[]> = {};
    for (const [provider, list] of Object.entries(map)) {
      if (provider.toLowerCase().includes(q)) {
        result[provider] = list; // whole group
      } else {
        const matched = list.filter((c) => c.college_name.toLowerCase().includes(q));
        if (matched.length) result[provider] = matched;
      }
    }
    return result;
  }, [colleges, search]);

  const totalFiltered = Object.values(grouped).reduce((s, arr) => s + arr.length, 0);

  return (
    <div className="adminSection">
      <div className="attentionCard">
        <button className="attentionSummary" onClick={() => setOpen((v) => !v)}>
          <div className="attentionSummary__left">
            <div className="attentionSummary__icon"><IconAlert /></div>
            <div>
              <span className="attentionSummary__title">Colleges Requiring Attention</span>
              <span className="attentionSummary__sub">
                {colleges.length} college{colleges.length !== 1 ? 's' : ''} have never uploaded any documents
              </span>
            </div>
          </div>
          <div className="attentionSummary__right">
            <span className="attentionSummary__count">{colleges.length}</span>
            <span className={`chevron${open ? ' chevron--open' : ''}`}><IconChevronDown /></span>
          </div>
        </button>

        {open && (
          <>
            <div className="attentionFilterRow">
              <div className="searchBox">
                <IconSearch />
                <input
                  placeholder="Search college"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {totalFiltered === 0 ? (
              <div className="adminEmpty">No colleges match your search.</div>
            ) : (
              Object.entries(grouped).map(([provider, list]) => (
                <div key={provider} className="attentionProviderGroup">
                  <div className="attentionProviderGroup__header">
                    <span className="attentionProviderGroup__name">{provider}</span>
                    <span className="attentionProviderGroup__count">
                      {list.length} not uploaded
                    </span>
                  </div>
                  {list.map((c) => (
                    <div key={c.college_id} className="attentionRow">
                      <div className="attentionRow__icon"><IconBuilding /></div>
                      <div className="attentionRow__info">
                        <span className="attentionRow__name">{c.college_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
