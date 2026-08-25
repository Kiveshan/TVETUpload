import { createContext, useContext, useState, type ReactNode } from 'react';

interface UploadFilesContextValue {
  getFiles: (year: string) => Record<string, File>;
  setFile: (year: string, key: string, file: File) => void;
  removeFile: (year: string, key: string) => void;
  clearFilesForYear: (year: string) => void;
  clearFiles: () => void;
}

const UploadFilesContext = createContext<UploadFilesContextValue | null>(null);

export function UploadFilesProvider({ children }: { children: ReactNode }) {
  const [filesByYear, setFilesByYear] = useState<Record<string, Record<string, File>>>({});

  function getFiles(year: string): Record<string, File> {
    return filesByYear[year] ?? {};
  }

  function setFile(year: string, key: string, file: File) {
    setFilesByYear((prev) => ({
      ...prev,
      [year]: { ...(prev[year] ?? {}), [key]: file },
    }));
  }

  function removeFile(year: string, key: string) {
    setFilesByYear((prev) => {
      const yearFiles = { ...(prev[year] ?? {}) };
      delete yearFiles[key];
      return { ...prev, [year]: yearFiles };
    });
  }

  function clearFilesForYear(year: string) {
    setFilesByYear((prev) => {
      const next = { ...prev };
      delete next[year];
      return next;
    });
  }

  function clearFiles() {
    setFilesByYear({});
  }

  return (
    <UploadFilesContext.Provider value={{ getFiles, setFile, removeFile, clearFilesForYear, clearFiles }}>
      {children}
    </UploadFilesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUploadFiles() {
  const ctx = useContext(UploadFilesContext);
  if (!ctx) throw new Error('useUploadFiles must be used within UploadFilesProvider');
  return ctx;
}
