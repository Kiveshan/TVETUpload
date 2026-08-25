import { useState, useMemo } from 'react';
import { IconAlert, IconChevronDown, IconSearch, IconBuilding } from './AdminIcons';
import { getProviderForCollege } from './adminProviderMap';

interface College { college_id: number; college_name: string; }
type YearFilter = '2025' | '2026';

interface Props {
  colleges: College[];
  colleges2025: College[];
  colleges2026: College[];
}

export default function AttentionColleges({ colleges2025, colleges2026 }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<YearFilter>('2025');

  const activeList = yearFilter === '2025' ? colleges2025 : colleges2026;

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const map: Record<string, College[]> = {};
    for (const c of activeList) {
      const provider = getProviderForCollege(c.college_name) ?? 'Other';
      if (!map[provider]) map[provider] = [];
      map[provider].push(c);
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.college_name.localeCompare(b.college_name));
    }
    if (!q) return map;
    const result: Record<string, College[]> = {};
    for (const [provider, list] of Object.entries(map)) {
      if (provider.toLowerCase().includes(q)) {
        result[provider] = list;
      } else {
        const matched = list.filter((c) => c.college_name.toLowerCase().includes(q));
        if (matched.length) result[provider] = matched;
      }
    }
    return result;
  }, [activeList, search]);

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
                {activeList.length} college{activeList.length !== 1 ? 's' : ''} have never uploaded for {yearFilter}
              </span>
            </div>
          </div>
          <div className="attentionSummary__right">
            <div className="attentionYearTabs" onClick={(e) => e.stopPropagation()}>
              {(['2025', '2026'] as YearFilter[]).map((y) => (
                <button
                  key={y}
                  className={`attentionYearTab${yearFilter === y ? ' attentionYearTab--active' : ''}`}
                  onClick={() => setYearFilter(y)}
                >
                  {y}
                </button>
              ))}
            </div>
            <span className="attentionSummary__count">{activeList.length}</span>
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
