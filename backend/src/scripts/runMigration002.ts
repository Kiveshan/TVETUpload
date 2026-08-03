import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  await pool.query(`ALTER TABLE public.users ADD COLUMN IF NOT EXISTS college_id integer`);
  console.log('Added college_id column.');
  await pool.query(`ALTER TABLE public.users DROP CONSTRAINT IF EXISTS fk_user_college`);
  await pool.query(
    `ALTER TABLE public.users ADD CONSTRAINT fk_user_college
     FOREIGN KEY (college_id) REFERENCES public.college(college_id)
     ON UPDATE NO ACTION ON DELETE RESTRICT`
  );
  console.log('Added FK constraint. Migration 002 done.');
  await pool.end();
}

run().catch((e) => {
  console.error('Migration failed:', e.message);
  process.exit(1);
});
