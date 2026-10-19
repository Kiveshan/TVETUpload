import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth/useAuth';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';
import StatsCards from './StatsCards';
import AttentionColleges from './AttentionColleges';
import ProvidersSection from './ProvidersSection';
import CollegeDirectoryModal from './CollegeDirectoryModal';
import { apiFetch, exportPDF } from './adminHelpers';
import { IconDownload, IconLogout } from './AdminIcons';
import type { AdminStats, Provider, YearFilter } from './adminTypes';
import './Admin.css';
import './AdminDocs.css';
import './AdminProviders.css';
import '../../layouts/PortalLayout/PortalLayout.css';


function YearToggle({ value, onChange }: { value: YearFilter; onChange: (v: YearFilter) => void }) {
  return (
    <div className="yearToggle">
      {(['2025', '2026', 'both'] as YearFilter[]).map((v) => (
        <button
          key={v}
          className={`yearToggle__btn${value === v ? ' yearToggle__btn--active' : ''}`}
          onClick={() => onChange(v)}
        >
          {v === 'both' ? 'Both' : v}
        </button>
      ))}
    </div>
  );
}

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDirectory, setShowDirectory] = useState(false);
  const [yearFilter, setYearFilter] = useState<YearFilter>('2026');

  useEffect(() => {
    if (!user) { navigate('/', { replace: true }); return; }
    if (user.role !== 'admin') { navigate('/provider-information', { replace: true }); }
  }, [user, navigate]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => apiFetch<AdminStats>('/admin/stats'),
    enabled: !!user && user.role === 'admin',
    refetchInterval: 10_000,
  });

  const { data: providersData, isLoading: providersLoading } = useQuery({
    queryKey: ['admin', 'providers'],
    queryFn: () => apiFetch<{ providers: Provider[] }>('/admin/providers'),
    enabled: !!user && user.role === 'admin',
    refetchInterval: 10_000,
  });

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  async function handleExport() {
    const providerList = providersData?.providers ?? [];
    if (yearFilter === 'both') {
      await exportPDF(providerList, stats?.neverUploadedColleges2025 ?? [], '2025');
      await new Promise<void>((r) => setTimeout(r, 600));
      await exportPDF(providerList, stats?.neverUploadedColleges2026 ?? [], '2026');
    } else {
      const neverUploaded = yearFilter === '2025'
        ? (stats?.neverUploadedColleges2025 ?? [])
        : (stats?.neverUploadedColleges2026 ?? []);
      void exportPDF(providerList, neverUploaded, yearFilter);
    }
  }

  const providers = providersData?.providers ?? [];
  const isLoading = statsLoading || providersLoading;

  // Helper: compute stats for a specific year from providers data
  const computeYearStats = useMemo(() => (year: '2025' | '2026') => {
    if (!stats) return null;
    const uploadedIds = new Set<number>();
    let totalFiles = 0;
    for (const p of providers) {
      for (const c of p.colleges) {
        for (const f of c.files) {
          if (f.year === year) { uploadedIds.add(c.collegeId); totalFiles++; }
        }
      }
    }
    const neverForYear: { college_id: number; college_name: string }[] = [
      ...stats.neverUploadedColleges,
    ];
    for (const p of providers) {
      for (const c of p.colleges) {
        if (!uploadedIds.has(c.collegeId)) {
          neverForYear.push({ college_id: c.collegeId, college_name: c.collegeName });
        }
      }
    }
    neverForYear.sort((a, b) => a.college_name.localeCompare(b.college_name));
    return {
      uploadedIds,
      totalFiles,
      neverForYear,
      collegesUploaded: uploadedIds.size,
      collegesNeverUploaded: stats.totalColleges - uploadedIds.size,
    };
  }, [stats, providers]);

  // Filtered stats for single-year views
  const filteredStats = useMemo(() => {
    if (!stats) return null;
    if (yearFilter === 'both') return stats;
    const yr = computeYearStats(yearFilter);
    if (!yr) return null;
    return {
      ...stats,
      collegesUploaded: yr.collegesUploaded,
      collegesNeverUploaded: yr.collegesNeverUploaded,
      totalFiles: yr.totalFiles,
      neverUploadedColleges: yr.neverForYear,
    };
  }, [stats, yearFilter, computeYearStats]);

  // Per-year breakdowns shown in "Both" mode stat cards
  const yearBreakdown = useMemo(() => {
    if (yearFilter !== 'both' || !stats) return undefined;
    const s2025 = computeYearStats('2025');
    const s2026 = computeYearStats('2026');
    if (!s2025 || !s2026) return undefined;
    return {
      collegesUploaded:     { '2025': s2025.collegesUploaded,     '2026': s2026.collegesUploaded },
      collegesNeverUploaded:{ '2025': s2025.collegesNeverUploaded, '2026': s2026.collegesNeverUploaded },
      totalFiles:           { '2025': s2025.totalFiles,           '2026': s2026.totalFiles },
    };
  }, [yearFilter, stats, computeYearStats]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="adminWrap">
      <Nav
        actions={
          <div className="portalNavUser">
            <span className="portalSignedInLabel">Signed in as</span>
            <span className="portalUserEmail">{user.email}</span>
            <button className="portalLogoutBtn" onClick={handleLogout} type="button">
              <IconLogout />
              Logout
            </button>
          </div>
        }
      />
      <main className="adminBody">
        <div className="adminPageHeader">
          <div className="adminPageHeader__left">
            <h1>System Admin Dashboard</h1>
            <p>Monitor TVET college submissions, identify missing documents and download submitted files.</p>
          </div>
          <div className="adminPageHeader__actions">
            <YearToggle value={yearFilter} onChange={setYearFilter} />
            {providers.length > 0 && (
              <button className="btnPrimary" onClick={() => void handleExport()}>
                <IconDownload /> Export PDF Summary
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="adminLoading">Loading dashboard…</div>
        ) : filteredStats ? (
          <>
            <StatsCards stats={filteredStats!} onTotalClick={() => setShowDirectory(true)} yearBreakdown={yearBreakdown} />
            {(stats.neverUploadedColleges2025.length > 0 || stats.neverUploadedColleges2026.length > 0) && (
              <AttentionColleges
                colleges={[]}
                colleges2025={stats.neverUploadedColleges2025}
                colleges2026={stats.neverUploadedColleges2026}
              />
            )}
            <ProvidersSection providers={providers} yearFilter={yearFilter} />
          </>
        ) : null}
      </main>
      <Footer />
      {showDirectory && <CollegeDirectoryModal onClose={() => setShowDirectory(false)} />}
    </div>
  );
}
