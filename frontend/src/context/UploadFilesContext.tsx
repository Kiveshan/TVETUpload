import { createContext, useContext, useState, type ReactNode } from 'react';

interface UploadFilesContextValue {
  files: Record<string, File>;
  setFile: (key: string, file: File) => void;
  removeFile: (key: string) => void;
  clearFiles: () => void;
}

const UploadFilesContext = createContext<UploadFilesContextValue | null>(null);

export function UploadFilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<Record<string, File>>({});

  function setFile(key: string, file: File) {
    setFiles((prev) => ({ ...prev, [key]: file }));
  }

  function removeFile(key: string) {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function clearFiles() {
    setFiles({});
  }

  return (
    <UploadFilesContext.Provider value={{ files, setFile, removeFile, clearFiles }}>
      {children}
    </UploadFilesContext.Provider>
  );
}

export function useUploadFiles() {
  const ctx = useContext(UploadFilesContext);
  if (!ctx) throw new Error('useUploadFiles must be used within UploadFilesProvider');
  return ctx;
}
