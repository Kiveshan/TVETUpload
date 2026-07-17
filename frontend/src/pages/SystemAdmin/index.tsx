import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../layouts/PortalLayout/PortalLayout';
import { useAuth } from '../../auth/useAuth';
import { isSystemAdmin } from '../../auth/roles';
import { PATHS } from '../../routes/paths';
import ProviderRequestsView from './views/ProviderRequestsView';
import './css/SystemAdmin.css';

export default function SystemAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isSystemAdmin(user.email)) {
      navigate(PATHS.providerInformation, { replace: true });
    }
  }, [user, navigate]);

  if (!user || !isSystemAdmin(user.email)) return null;

  return (
    <PortalLayout mainClassName="systemAdminMain">
      <ProviderRequestsView />
    </PortalLayout>
  );
}
