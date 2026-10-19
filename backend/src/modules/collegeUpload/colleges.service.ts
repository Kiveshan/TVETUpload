import { pool } from '../../lib/db';

export interface CollegeRecord {
  college_id: number;
  college_name: string;
  created_at?: Date;
}

export async function getAllColleges(): Promise<CollegeRecord[]> {
  const { rows } = await pool.query<CollegeRecord>(
    'SELECT college_id, college_name FROM public.college ORDER BY college_name ASC',
  );
  return rows;
}

/**
 * Colleges belonging to this provider that have NOT uploaded for ALL years yet.
 * A college is still "available" if it is missing uploads for 2025 or 2026.
 */
export async function getAvailableColleges(providerName: string): Promise<CollegeRecord[]> {
  const { rows } = await pool.query<CollegeRecord>(
    `SELECT c.college_id, c.college_name
     FROM college c
     JOIN users cu ON cu.college_id = c.college_id
       AND cu.role = 'college'
       AND cu.provider_name = $1
     WHERE NOT (
       EXISTS (
         SELECT 1 FROM uploads u JOIN users usr ON usr.user_id = u.user_id
         WHERE usr.provider_name = $1 AND u.college_id = c.college_id
           AND u.upload_year = 2025 AND u.s3_bucket_link NOT LIKE '%/Old/%'
       )
       AND
       EXISTS (
         SELECT 1 FROM uploads u JOIN users usr ON usr.user_id = u.user_id
         WHERE usr.provider_name = $1 AND u.college_id = c.college_id
           AND u.upload_year = 2026 AND u.s3_bucket_link NOT LIKE '%/Old/%'
       )
     )
     ORDER BY c.college_name ASC`,
    [providerName],
  );
  return rows;
}

/**
 * Single college available for a college-role user.
 * Available until uploads exist for BOTH 2025 and 2026.
 */
export async function getAvailableCollegeForUser(collegeId: number): Promise<CollegeRecord[]> {
  const { rows } = await pool.query<CollegeRecord>(
    `SELECT c.college_id, c.college_name
     FROM college c
     WHERE c.college_id = $1
       AND NOT (
         EXISTS (SELECT 1 FROM uploads WHERE college_id = $1 AND upload_year = 2025 AND s3_bucket_link NOT LIKE '%/Old/%')
         AND
         EXISTS (SELECT 1 FROM uploads WHERE college_id = $1 AND upload_year = 2026 AND s3_bucket_link NOT LIKE '%/Old/%')
       )`,
    [collegeId],
  );
  return rows;
}

/** Which years (e.g. [2025, 2026]) this college has submitted uploads for under the given provider. */
export async function getSubmittedYears(
  providerName: string,
  collegeId: number,
): Promise<number[]> {
  const { rows } = await pool.query<{ upload_year: number }>(
    `SELECT DISTINCT upload_year
     FROM uploads u
     JOIN users usr ON usr.user_id = u.user_id
     WHERE usr.provider_name = $1
       AND u.college_id = $2
       AND u.s3_bucket_link NOT LIKE '%/Old/%'
     ORDER BY upload_year`,
    [providerName, collegeId],
  );
  return rows.map((r) => r.upload_year);
}

/** Which years a college-role user's college has submitted uploads for. */
export async function getSubmittedYearsForUser(collegeId: number): Promise<number[]> {
  const { rows } = await pool.query<{ upload_year: number }>(
    `SELECT DISTINCT upload_year
     FROM uploads
     WHERE college_id = $1
       AND s3_bucket_link NOT LIKE '%/Old/%'
     ORDER BY upload_year`,
    [collegeId],
  );
  return rows.map((r) => r.upload_year);
}

export async function getSubmittedColleges(providerName: string): Promise<CollegeRecord[]> {
  const { rows } = await pool.query<CollegeRecord>(
    `SELECT DISTINCT c.college_id, c.college_name, MIN(u.created_at) AS created_at
     FROM college c
     JOIN uploads u ON u.college_id = c.college_id
     JOIN users usr ON usr.user_id = u.user_id
     WHERE usr.provider_name = $1
     GROUP BY c.college_id, c.college_name
     ORDER BY c.college_name ASC`,
    [providerName],
  );
  return rows;
}

/** Submitted colleges visible to a college-role user (only their own college). */
export async function getSubmittedCollegesForUser(
  providerName: string,
  collegeId: number,
): Promise<CollegeRecord[]> {
  const { rows } = await pool.query<CollegeRecord>(
    `SELECT DISTINCT c.college_id, c.college_name, MIN(u.created_at) AS created_at
     FROM college c
     JOIN uploads u ON u.college_id = c.college_id
     JOIN users usr ON usr.user_id = u.user_id
     WHERE usr.provider_name = $1
       AND c.college_id = $2
     GROUP BY c.college_id, c.college_name
     ORDER BY c.college_name ASC`,
    [providerName, collegeId],
  );
  return rows;
}
