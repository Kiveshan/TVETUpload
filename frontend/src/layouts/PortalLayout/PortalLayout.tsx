import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../auth/useAuth';
import './PortalLayout.css';

interface PortalLayoutProps {
  children?: ReactNode;
  mainClassName?: string;
}

export default function PortalLayout({ children, mainClassName }: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/', { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="portalLayout">
      <Nav
        actions={
          <div className="portalNavUser">
            <span className="portalSignedInLabel">Signed in as</span>
            <span className="portalUserEmail">{user.email}</span>
            <button className="portalLogoutBtn" onClick={handleLogout} type="button">
              <LogoutIcon />
              Logout
            </button>
          </div>
        }
      />
      <main className={mainClassName ? `portalMain ${mainClassName}` : 'portalMain'}>{children}</main>
      <Footer />
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
