import { pct, barColor } from './adminHelpers';
import { IconBuilding, IconCheck, IconAlert, IconFile } from './AdminIcons';
import type { AdminStats } from './adminTypes';

export function ProgressBar({ value, color, height = 6 }: { value: number; color?: string; height?: number }) {
  const c = color ?? barColor(value);
  return (
    <div className="progressTrack" style={{ height }}>
      <div className="progressFill" style={{ width: `${Math.min(value, 100)}%`, background: c }} />
    </div>
  );
}

interface YearBreakdown {
  collegesUploaded:      { '2025': number; '2026': number };
  collegesNeverUploaded: { '2025': number; '2026': number };
  totalFiles:            { '2025': number; '2026': number };
}

function YearPills({ y2025, y2026, variant }: { y2025: number; y2026: number; variant: 'blue' | 'red' }) {
  return (
    <div className="statCard__yearPills">
      <span className={`yearPill yearPill--${variant}`}>2025: {y2025}</span>
      <span className={`yearPill yearPill--${variant}`}>2026: {y2026}</span>
    </div>
  );
}

export default function StatsCards({
  stats,
  onTotalClick,
  yearBreakdown,
}: {
  stats: AdminStats;
  onTotalClick?: () => void;
  yearBreakdown?: YearBreakdown;
}) {
  const uploadedPct = pct(stats.collegesUploaded, stats.totalColleges);
  return (
    <div className="statsGrid">
      <button className="statCard statCard--clickable" onClick={onTotalClick}>
        <span className="statCard__label">Total Colleges</span>
        <div className="statCard__row">
          <span className="statCard__val">{stats.totalColleges}</span>
          <span className="statCard__icon statCard__icon--grey"><IconBuilding /></span>
        </div>
        <span className="statCard__sub statCard__sub--link">View directory</span>
      </button>

      <div className="statCard">
        <span className="statCard__label">Colleges Uploaded</span>
        <div className="statCard__row">
          <span className="statCard__val statCard__val--green">{stats.collegesUploaded}</span>
          <span className="statCard__icon statCard__icon--green"><IconCheck /></span>
        </div>
        {yearBreakdown ? (
          <YearPills
            y2025={yearBreakdown.collegesUploaded['2025']}
            y2026={yearBreakdown.collegesUploaded['2026']}
            variant="blue"
          />
        ) : (
          <>
            <span className="statCard__sub">{uploadedPct}% of total</span>
            <ProgressBar value={uploadedPct} color="#16a34a" />
          </>
        )}
      </div>

      <div className="statCard">
        <span className="statCard__label">Never Uploaded</span>
        <div className="statCard__row">
          <span className="statCard__val statCard__val--red">{stats.collegesNeverUploaded}</span>
          <span className="statCard__icon statCard__icon--red"><IconAlert /></span>
        </div>
        {yearBreakdown ? (
          <YearPills
            y2025={yearBreakdown.collegesNeverUploaded['2025']}
            y2026={yearBreakdown.collegesNeverUploaded['2026']}
            variant="red"
          />
        ) : (
          <span className="statCard__sub statCard__sub--red">Needs attention</span>
        )}
      </div>

      <div className="statCard">
        <span className="statCard__label">Total Submitted Files</span>
        <div className="statCard__row">
          <span className="statCard__val statCard__val--blue">{stats.totalFiles}</span>
          <span className="statCard__icon statCard__icon--blue"><IconFile /></span>
        </div>
        {yearBreakdown ? (
          <YearPills
            y2025={yearBreakdown.totalFiles['2025']}
            y2026={yearBreakdown.totalFiles['2026']}
            variant="blue"
          />
        ) : (
          <span className="statCard__sub">{stats.totalReuploads} re-uploads</span>
        )}
      </div>
    </div>
  );
}
