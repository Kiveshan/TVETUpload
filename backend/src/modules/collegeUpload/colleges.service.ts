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

export async function getAvailableColleges(): Promise<CollegeRecord[]> {
  const { rows } = await pool.query<CollegeRecord>(
    `SELECT c.college_id, c.college_name
     FROM college c
     WHERE c.college_id NOT IN (
       SELECT DISTINCT college_id FROM uploads
     )
     ORDER BY c.college_name ASC`,
  );
  return rows;
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
