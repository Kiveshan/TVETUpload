import { useState, useMemo } from 'react';
import { IconAlert, IconChevronDown, IconSearch, IconBuilding } from './AdminIcons';

interface College { college_id: number; college_name: string; }

export default function AttentionColleges({ colleges }: { colleges: College[] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...colleges]
      .filter((c) => c.college_name.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === 'asc'
          ? a.college_name.localeCompare(b.college_name)
          : b.college_name.localeCompare(a.college_name),
      );
  }, [colleges, search, sort]);

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
              <select
                className="filterSelect"
                value={sort}
                onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
              >
                <option value="asc">Sort A–Z</option>
                <option value="desc">Sort Z–A</option>
              </select>
            </div>
            {filtered.length === 0 ? (
              <div className="adminEmpty">No colleges match your search.</div>
            ) : (
              filtered.map((c) => (
                <div key={c.college_id} className="attentionRow">
                  <div className="attentionRow__icon"><IconBuilding /></div>
                  <div className="attentionRow__info">
                    <span className="attentionRow__name">{c.college_name}</span>
                    <span className="badge badge--noUploads">No uploads</span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
