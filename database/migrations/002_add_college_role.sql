-- Migration 002: add college_id to users and support 'college' role
-- Run once on the tvetupload database.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS college_id integer;

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS fk_user_college;

ALTER TABLE public.users
  ADD CONSTRAINT fk_user_college
    FOREIGN KEY (college_id)
    REFERENCES public.college(college_id)
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
