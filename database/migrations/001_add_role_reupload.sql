-- Migration 001: add role column to users, reupload_count to uploads
-- Run against an existing database to add admin support.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'provider';

ALTER TABLE uploads
  ADD COLUMN IF NOT EXISTS reupload_count INTEGER NOT NULL DEFAULT 0;

-- Promote the existing system admin user to the 'admin' role.
UPDATE users SET role = 'admin' WHERE email = 'systemadmin@gmail.com';
