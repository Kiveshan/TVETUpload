export const MANDATORY_FOLDERS = ['college_information', 'P_S_Q', 'student', 'staff'];
export const TOTAL_FOLDERS = 5;
export const BASE = import.meta.env.VITE_API_URL ?? '/api';

export interface FileTypeCount {
  folder: string;
  label: string;
  required: boolean;
  uploadedCount: number;
  updatedCount: number;
}

export interface AdminStats {
  totalColleges: number;
  collegesUploaded: number;
  collegesNeverUploaded: number;
  totalFiles: number;
  totalReuploads: number;
  lastUpdated: string | null;
  fileTypeCounts: FileTypeCount[];
  neverUploadedColleges: { college_id: number; college_name: string }[];
}

export interface UploadFile {
  uploadId: number;
  folder: string;
  label: string;
  fileName: string;
  s3Key: string;
  createdAt: string;
  reuploadsCount: number;
}

export interface ProviderCollege {
  collegeId: number;
  collegeName: string;
  files: UploadFile[];
}

export interface Provider {
  providerName: string;
  colleges: ProviderCollege[];
}
