import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './auth/AuthContext';
import { UploadFilesProvider, useUploadFiles } from './context/UploadFilesContext';
import { useAuth } from './auth/useAuth';
import { PATHS } from './routes/paths';
import Home from './pages/Home';
import ProviderInformation from './pages/ProviderInformation';
import SystemAdmin from './pages/SystemAdmin';
import CollegeUpload from './pages/CollegeUpload';
import SubmissionSummary from './pages/SubmissionSummary';

function SessionCleaner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { clearFiles } = useUploadFiles();
  const prevUser = useRef(user);

  useEffect(() => {
    if (prevUser.current !== null && user === null) {
      clearFiles();
    }
    prevUser.current = user;
  }, [user, clearFiles]);

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.home}                element={<Home />} />
      <Route path={PATHS.providerInformation} element={<ProviderInformation />} />
      <Route path={PATHS.collegeUpload}       element={<CollegeUpload />} />
      <Route path={PATHS.submissionSummary}   element={<SubmissionSummary />} />
      <Route path={PATHS.systemAdmin}         element={<SystemAdmin />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <UploadFilesProvider>
            <SessionCleaner>
              <AppRoutes />
            </SessionCleaner>
          </UploadFilesProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
