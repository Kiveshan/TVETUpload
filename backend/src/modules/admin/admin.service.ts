import { pool } from '../../lib/db';
import { FOLDER_LABELS, FOLDER_ORDER } from '../uploads/s3.service';

const REQUIRED_FOLDERS = new Set(['college_information', 'P_S_Q', 'student', 'staff']);

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
  collegesUploaded2025: number;
  collegesUploaded2026: number;
  neverUploadedColleges2025: { college_id: number; college_name: string }[];
  neverUploadedColleges2026: { college_id: number; college_name: string }[];
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
  year: string;
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

export async function getAdminStats(): Promise<AdminStats> {
  const [totalRes, uploadedRes, typeRes, neverRes, filesRes, up2025Res, up2026Res, never2025Res, never2026Res] = await Promise.all([
    pool.query<{ total: string }>('SELECT COUNT(*) AS total FROM college'),
    pool.query<{ count: string }>(
      "SELECT COUNT(DISTINCT college_id) AS count FROM uploads WHERE s3_bucket_link NOT LIKE '%/Old/%'",
    ),
    pool.query<{ folder: string; uploaded_count: string; updated_count: string }>(`
      SELECT
        CASE
          WHEN s3_bucket_link LIKE '%/college_information/%' THEN 'college_information'
          WHEN s3_bucket_link LIKE '%/P_S_Q/%'               THEN 'P_S_Q'
          WHEN s3_bucket_link LIKE '%/student/%'             THEN 'student'
          WHEN s3_bucket_link LIKE '%/staff/%'               THEN 'staff'
          WHEN s3_bucket_link LIKE '%/head_count_enrollment/%' THEN 'head_count_enrollment'
          ELSE 'other'
        END AS folder,
        COUNT(DISTINCT college_id) AS uploaded_count,
        SUM(reupload_count)        AS updated_count
      FROM uploads
      WHERE s3_bucket_link NOT LIKE '%/Old/%'
      GROUP BY folder
    `),
    pool.query<{ college_id: number; college_name: string }>(`
      SELECT c.college_id, c.college_name
      FROM college c
      WHERE NOT EXISTS (
        SELECT 1 FROM uploads u
        WHERE u.college_id = c.college_id
          AND u.s3_bucket_link NOT LIKE '%/Old/%'
      )
      ORDER BY c.college_name
    `),
    pool.query<{ total_files: string; total_reuploads: string; last_updated: Date | null }>(`
      SELECT
        COUNT(*)             AS total_files,
        SUM(reupload_count)  AS total_reuploads,
        MAX(created_at)      AS last_updated
      FROM uploads
      WHERE s3_bucket_link NOT LIKE '%/Old/%'
    `),
    pool.query<{ count: string }>(
      "SELECT COUNT(DISTINCT college_id) AS count FROM uploads WHERE upload_year = 2025 AND s3_bucket_link NOT LIKE '%/Old/%'",
    ),
    pool.query<{ count: string }>(
      "SELECT COUNT(DISTINCT college_id) AS count FROM uploads WHERE upload_year = 2026 AND s3_bucket_link NOT LIKE '%/Old/%'",
    ),
    pool.query<{ college_id: number; college_name: string }>(`
      SELECT c.college_id, c.college_name FROM college c
      WHERE NOT EXISTS (
        SELECT 1 FROM uploads u WHERE u.college_id = c.college_id
          AND u.upload_year = 2025 AND u.s3_bucket_link NOT LIKE '%/Old/%'
      ) ORDER BY c.college_name
    `),
    pool.query<{ college_id: number; college_name: string }>(`
      SELECT c.college_id, c.college_name FROM college c
      WHERE NOT EXISTS (
        SELECT 1 FROM uploads u WHERE u.college_id = c.college_id
          AND u.upload_year = 2026 AND u.s3_bucket_link NOT LIKE '%/Old/%'
      ) ORDER BY c.college_name
    `),
  ]);

  const totalColleges = parseInt(totalRes.rows[0].total, 10);
  const collegesUploaded = parseInt(uploadedRes.rows[0].count, 10);

  const fileTypeCounts: FileTypeCount[] = FOLDER_ORDER.map((folder) => {
    const row = typeRes.rows.find((r) => r.folder === folder);
    return {
      folder,
      label: FOLDER_LABELS[folder] ?? folder,
      required: REQUIRED_FOLDERS.has(folder),
      uploadedCount: row ? parseInt(row.uploaded_count, 10) : 0,
      updatedCount: row ? parseInt(row.updated_count ?? '0', 10) : 0,
    };
  });

  const fr = filesRes.rows[0];

  return {
    totalColleges,
    collegesUploaded,
    collegesNeverUploaded: totalColleges - collegesUploaded,
    collegesUploaded2025: parseInt(up2025Res.rows[0].count, 10),
    collegesUploaded2026: parseInt(up2026Res.rows[0].count, 10),
    neverUploadedColleges2025: never2025Res.rows,
    neverUploadedColleges2026: never2026Res.rows,
    totalFiles: parseInt(fr.total_files, 10),
    totalReuploads: parseInt(fr.total_reuploads ?? '0', 10),
    lastUpdated: fr.last_updated ? fr.last_updated.toISOString() : null,
    fileTypeCounts,
    neverUploadedColleges: neverRes.rows,
  };
}

export async function getProvidersWithColleges(): Promise<Provider[]> {
  const [providerRes, uploadRes] = await Promise.all([
    // All distinct providers registered in the system (including those with 0 uploads)
    pool.query<{ provider_name: string }>(
      `SELECT DISTINCT provider_name
       FROM users
       WHERE role != 'admin'
         AND provider_name IS NOT NULL
         AND provider_name != ''
       ORDER BY provider_name`,
    ),
    pool.query<{
      provider_name: string;
      college_id: number;
      college_name: string;
      upload_id: number;
      s3_bucket_link: string;
      created_at: Date;
      reupload_count: number;
    }>(`
      SELECT
        usr.provider_name,
        c.college_id,
        c.college_name,
        u.upload_id,
        u.s3_bucket_link,
        u.created_at,
        u.reupload_count
      FROM uploads u
      JOIN users usr ON usr.user_id = u.user_id
      JOIN college c  ON c.college_id = u.college_id
      WHERE u.s3_bucket_link NOT LIKE '%/Old/%'
      ORDER BY usr.provider_name, c.college_name
    `),
  ]);

  // Seed map with ALL providers so empty ones are included
  const providersMap = new Map<string, Provider>();
  for (const { provider_name } of providerRes.rows) {
    providersMap.set(provider_name, { providerName: provider_name, colleges: [] });
  }

  for (const row of uploadRes.rows) {
    if (!providersMap.has(row.provider_name)) {
      providersMap.set(row.provider_name, { providerName: row.provider_name, colleges: [] });
    }
    const provider = providersMap.get(row.provider_name)!;

    let college = provider.colleges.find((c) => c.collegeId === row.college_id);
    if (!college) {
      college = { collegeId: row.college_id, collegeName: row.college_name, files: [] };
      provider.colleges.push(college);
    }

    const parts = row.s3_bucket_link.split('/');
    // New key format: provider/college/year/folder/filename (parts[2] is a 4-digit year)
    // Old key format: provider/college/folder/filename — treat as 2025
    const hasYear = /^\d{4}$/.test(parts[2] ?? '');
    const year     = hasYear ? (parts[2] ?? '2025') : '2025';
    const folder   = hasYear ? (parts[3] ?? '') : (parts[2] ?? '');
    const fileName = hasYear ? (parts[4] ?? row.s3_bucket_link) : (parts[3] ?? row.s3_bucket_link);

    college.files.push({
      uploadId: row.upload_id,
      folder,
      label: FOLDER_LABELS[folder] ?? folder,
      fileName,
      s3Key: row.s3_bucket_link,
      year,
      createdAt: row.created_at.toISOString(),
      reuploadsCount: row.reupload_count,
    });
  }

  for (const provider of providersMap.values()) {
    for (const college of provider.colleges) {
      college.files.sort(
        (a, b) => FOLDER_ORDER.indexOf(a.folder) - FOLDER_ORDER.indexOf(b.folder),
      );
    }
  }

  return Array.from(providersMap.values()).sort((a, b) =>
    a.providerName.localeCompare(b.providerName),
  );
}
