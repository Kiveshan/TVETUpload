import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/useAuth';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';
import StatsCards from './StatsCards';
import DocumentProgress from './DocumentProgress';
import AttentionColleges from './AttentionColleges';
import ProvidersSection from './ProvidersSection';
import { apiFetch, exportCSV, fmtDateTime } from './adminHelpers';
import { IconRefresh, IconDownload, IconLogout } from './AdminIcons';
import type { AdminStats, Provider } from './adminTypes';
import './Admin.css';
import './AdminDocs.css';
import './AdminProviders.css';
import '../../layouts/PortalLayout/PortalLayout.css';

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) { navigate('/', { replace: true }); return; }
    if (user.role !== 'admin') { navigate('/provider-information', { replace: true }); }
  }, [user, navigate]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => apiFetch<AdminStats>('/admin/stats'),
    enabled: !!user && user.role === 'admin',
  });

  const { data: providersData, isLoading: providersLoading } = useQuery({
    queryKey: ['admin', 'providers'],
    queryFn: () => apiFetch<{ providers: Provider[] }>('/admin/providers'),
    enabled: !!user && user.role === 'admin',
  });

  async function handleLogout() {
    await logout();
    navigate('/');
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
            <button className="btnOutline" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin'] })}>
              <IconRefresh /> Refresh
            </button>
            {providers.length > 0 && (
              <button className="btnPrimary" onClick={() => exportCSV(providers)}>
                <IconDownload /> Export summary
              </button>
            )}
            {stats?.lastUpdated && (
              <span className="adminPageHeader__updated">
                Last updated: {fmtDateTime(stats.lastUpdated)}
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="adminLoading">Loading dashboard…</div>
        ) : stats ? (
          <>
            <StatsCards stats={stats} />
            <DocumentProgress stats={stats} providers={providers} />
            {stats.neverUploadedColleges.length > 0 && (
              <AttentionColleges colleges={stats.neverUploadedColleges} />
            )}
            <ProvidersSection providers={providers} />
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
