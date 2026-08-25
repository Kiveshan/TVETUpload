import { useEffect, useState } from 'react';
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
import type { AdminStats, Provider } from './adminTypes';
import './Admin.css';
import './AdminDocs.css';
import './AdminProviders.css';
import '../../layouts/PortalLayout/PortalLayout.css';

type PdfYear = '2025' | '2026' | 'both';

function PdfYearModal({ onClose, onExport }: { onClose: () => void; onExport: (year: PdfYear) => void }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <div className="modalBox__header">
          <div>
            <p className="modalBox__title">Export PDF Summary</p>
            <p className="modalBox__subtitle">Choose which year(s) to include</p>
          </div>
        </div>
        <div className="modalBox__body" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {(['2025', '2026', 'both'] as PdfYear[]).map((y) => (
            <button
              key={y}
              className="pdfYearOption"
              onClick={() => { onExport(y); onClose(); }}
            >
              <IconDownload />
              {y === 'both' ? 'Both years (2025 & 2026)' : `${y} only`}
            </button>
          ))}
        </div>
        <div className="modalBox__footer">
          <button className="btnOutline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDirectory, setShowDirectory] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

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

  async function handleExport(year: PdfYear) {
    const providers = providersData?.providers ?? [];
    if (year === 'both') {
      await exportPDF(providers, stats?.neverUploadedColleges2025 ?? [], '2025');
      await new Promise<void>((r) => setTimeout(r, 600));
      await exportPDF(providers, stats?.neverUploadedColleges2026 ?? [], '2026');
    } else {
      const neverUploaded = year === '2025'
        ? (stats?.neverUploadedColleges2025 ?? [])
        : (stats?.neverUploadedColleges2026 ?? []);
      void exportPDF(providers, neverUploaded, year);
    }
  }

  if (!user || user.role !== 'admin') return null;

  const providers = providersData?.providers ?? [];
  const isLoading = statsLoading || providersLoading;

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
            {providers.length > 0 && (
              <button className="btnPrimary" onClick={() => setShowPdfModal(true)}>
                <IconDownload /> Export PDF Summary
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="adminLoading">Loading dashboard…</div>
        ) : stats ? (
          <>
            <StatsCards stats={stats} onTotalClick={() => setShowDirectory(true)} />
            {(stats.neverUploadedColleges2025.length > 0 || stats.neverUploadedColleges2026.length > 0) && (
              <AttentionColleges
                colleges={[]}
                colleges2025={stats.neverUploadedColleges2025}
                colleges2026={stats.neverUploadedColleges2026}
              />
            )}
            <ProvidersSection providers={providers} />
          </>
        ) : null}
      </main>
      <Footer />
      {showDirectory && <CollegeDirectoryModal onClose={() => setShowDirectory(false)} />}
      {showPdfModal && (
        <PdfYearModal
          onClose={() => setShowPdfModal(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
