-- Rebuild uploads table from S3 objects
-- Run in pgAdmin against tvetupload DB
-- Safe to re-run: skips rows with existing s3_bucket_link

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Academia' AND role = 'provider' LIMIT 1),
  'Academia/False_Bay_TVET_College/2025/P_S_Q/Programme_Subject_and_Qualific.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'False Bay TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:27.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Academia/False_Bay_TVET_College/2025/P_S_Q/Programme_Subject_and_Qualific.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Academia' AND role = 'provider' LIMIT 1),
  'Academia/False_Bay_TVET_College/2025/college_information/College_information.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'False Bay TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:27.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Academia/False_Bay_TVET_College/2025/college_information/College_information.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Academia' AND role = 'provider' LIMIT 1),
  'Academia/False_Bay_TVET_College/2025/head_count_enrollment/Student_Count.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'False Bay TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:27.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Academia/False_Bay_TVET_College/2025/head_count_enrollment/Student_Count.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Academia' AND role = 'provider' LIMIT 1),
  'Academia/False_Bay_TVET_College/2025/staff/Staff_data.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'False Bay TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:27.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Academia/False_Bay_TVET_College/2025/staff/Staff_data.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Academia' AND role = 'provider' LIMIT 1),
  'Academia/False_Bay_TVET_College/2025/student/Student_data.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'False Bay TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:28.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Academia/False_Bay_TVET_College/2025/student/Student_data.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Boland_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-8_18_2026_11_44_53_AM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Boland TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:28.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Boland_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-8_18_2026_11_44_53_AM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Boland_TVET_College/2025/college_information/DHET_Submission_College_Information-8_18_2026_11_42_39_AM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Boland TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:28.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Boland_TVET_College/2025/college_information/DHET_Submission_College_Information-8_18_2026_11_42_39_AM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Boland_TVET_College/2025/staff/DHET_Submission_Staff_Data-8_18_2026_3_54_01_PM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Boland TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:28.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Boland_TVET_College/2025/staff/DHET_Submission_Staff_Data-8_18_2026_3_54_01_PM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Boland_TVET_College/2025/student/DHET_Submission_Student_Data-8_18_2026_1_53_37_PM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Boland TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:29.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Boland_TVET_College/2025/student/DHET_Submission_Student_Data-8_18_2026_1_53_37_PM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Capricorn_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications_-_Check-2026_08_18_10_39_13.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Capricorn TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:29.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Capricorn_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications_-_Check-2026_08_18_10_39_13.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Capricorn_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_15_23_24.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Capricorn TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:30.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Capricorn_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_15_23_24.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Capricorn_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_15_27_55.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Capricorn TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:30.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Capricorn_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_15_27_55.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Capricorn_TVET_College/2025/student/DHET_Submission_Student_Data_-_Check-2026_08_18_10_42_37.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Capricorn TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:30.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Capricorn_TVET_College/2025/student/DHET_Submission_Student_Data_-_Check-2026_08_18_10_42_37.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Eastcape_Midlands_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_15_20_21.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Eastcape Midlands TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:31.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Eastcape_Midlands_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_15_20_21.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Eastcape_Midlands_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_15_18_35.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Eastcape Midlands TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:32.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Eastcape_Midlands_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_15_18_35.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Eastcape_Midlands_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2026_08_17_15_23_01.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Eastcape Midlands TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:32.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Eastcape_Midlands_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2026_08_17_15_23_01.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Eastcape_Midlands_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_15_21_18.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Eastcape Midlands TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:33.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Eastcape_Midlands_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_15_21_18.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Eastcape_Midlands_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_15_22_27.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Eastcape Midlands TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:33.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Eastcape_Midlands_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_15_22_27.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Elangeni_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_10_41_56.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Elangeni TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:34.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Elangeni_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_10_41_56.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Elangeni_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_10_40_26.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Elangeni TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:34.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Elangeni_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_10_40_26.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Elangeni_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_10_42_38.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Elangeni TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:34.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Elangeni_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_10_42_38.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Elangeni_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_10_42_52.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Elangeni TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:34.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Elangeni_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_10_42_52.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Esayidi_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_18_12_30_10.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Esayidi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:35.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Esayidi_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_18_12_30_10.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Esayidi_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_18_12_28_25.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Esayidi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:37.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Esayidi_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_18_12_28_25.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Esayidi_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2026_08_17_11_06_50.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Esayidi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:37.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Esayidi_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2026_08_17_11_06_50.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Esayidi_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_18_12_30_34.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Esayidi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:38.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Esayidi_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_18_12_30_34.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Esayidi_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_18_12_31_12.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Esayidi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:38.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Esayidi_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_18_12_31_12.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Flavius_Mareka_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications_-_Check-2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Flavius Mareka TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:39.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Flavius_Mareka_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications_-_Check-2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Flavius_Mareka_TVET_College/2025/college_information/DHET_Submission_College_Information_-_Check-2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Flavius Mareka TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:40.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Flavius_Mareka_TVET_College/2025/college_information/DHET_Submission_College_Information_-_Check-2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Flavius_Mareka_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2025_Flavius_Mareka_TVET_College.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Flavius Mareka TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:41.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Flavius_Mareka_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2025_Flavius_Mareka_TVET_College.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Flavius_Mareka_TVET_College/2025/staff/DHET_Submission_Staff_Data_-_Check-2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Flavius Mareka TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:41.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Flavius_Mareka_TVET_College/2025/staff/DHET_Submission_Staff_Data_-_Check-2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Flavius_Mareka_TVET_College/2025/student/DHET_Submission_Student_Data_-_Check-2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Flavius Mareka TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:42.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Flavius_Mareka_TVET_College/2025/student/DHET_Submission_Student_Data_-_Check-2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Goldfields_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_07_22_08.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Goldfields TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:42.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Goldfields_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_07_22_08.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Goldfields_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_07_21_07.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Goldfields TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:43.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Goldfields_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_07_21_07.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Goldfields_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_07_27_45.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Goldfields TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:43.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Goldfields_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_07_27_45.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Goldfields_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_07_28_07.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Goldfields TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:43.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Goldfields_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_07_28_07.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Ikhala_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_16_09_26.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ikhala TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:43.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Ikhala_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_16_09_26.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Ikhala_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_16_08_33.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ikhala TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:44.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Ikhala_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_16_08_33.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Ikhala_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_16_09_38.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ikhala TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:44.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Ikhala_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_16_09_38.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Ikhala_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_16_09_57.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ikhala TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:44.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Ikhala_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_16_09_57.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Lephalale_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications_-_Check-2026_08_17_15_35_01.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Lephalale TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:44.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Lephalale_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications_-_Check-2026_08_17_15_35_01.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Lephalale_TVET_College/2025/college_information/DHET_Submission_College_Information_-_Check-2026_08_17_15_34_29.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Lephalale TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:45.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Lephalale_TVET_College/2025/college_information/DHET_Submission_College_Information_-_Check-2026_08_17_15_34_29.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Lephalale_TVET_College/2025/staff/DHET_Submission_Staff_Data_-_Check-2026_08_17_15_35_27.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Lephalale TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:45.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Lephalale_TVET_College/2025/staff/DHET_Submission_Staff_Data_-_Check-2026_08_17_15_35_27.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Lephalale_TVET_College/2025/student/DHET_Submission_Student_Data_-_Check-2026_08_17_15_35_36.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Lephalale TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:45.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Lephalale_TVET_College/2025/student/DHET_Submission_Student_Data_-_Check-2026_08_17_15_35_36.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Letaba_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_16_22_53.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Letaba TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:46.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Letaba_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_16_22_53.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Letaba_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_16_19_44.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Letaba TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:46.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Letaba_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_16_19_44.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Letaba_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2026_08_17_19_38_16.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Letaba TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:46.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Letaba_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2026_08_17_19_38_16.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Letaba_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_16_25_35.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Letaba TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:47.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Letaba_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_16_25_35.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Letaba_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_19_34_47.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Letaba TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:47.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Letaba_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_19_34_47.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Lovedale_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_18_07_56_27.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Lovedale TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:47.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Lovedale_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_18_07_56_27.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Lovedale_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_18_07_55_24.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Lovedale TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:47.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Lovedale_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_18_07_55_24.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Lovedale_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2026_08_18_07_58_17.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Lovedale TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:48.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Lovedale_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2026_08_18_07_58_17.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Lovedale_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_18_07_57_16.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Lovedale TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:48.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Lovedale_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_18_07_57_16.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Lovedale_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_18_07_58_02.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Lovedale TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:48.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Lovedale_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_18_07_58_02.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Majuba_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_10_26_41.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Majuba TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:48.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Majuba_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_10_26_41.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Majuba_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_10_17_31.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Majuba TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:49.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Majuba_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_10_17_31.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Majuba_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_07_59_32.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Majuba TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:49.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Majuba_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_07_59_32.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Majuba_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_11_38_28.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Majuba TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:50.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Majuba_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_11_38_28.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Maluti_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications_-_Check-2026_08_17_15_49_16.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Maluti TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:50.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Maluti_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications_-_Check-2026_08_17_15_49_16.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Maluti_TVET_College/2025/college_information/DHET_Submission_College_Information_-_Check-2026_08_17_15_43_15.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Maluti TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:50.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Maluti_TVET_College/2025/college_information/DHET_Submission_College_Information_-_Check-2026_08_17_15_43_15.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Maluti_TVET_College/2025/staff/DHET_Submission_Staff_Data_-_Check-2026_08_17_15_54_00.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Maluti TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:50.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Maluti_TVET_College/2025/staff/DHET_Submission_Staff_Data_-_Check-2026_08_17_15_54_00.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Maluti_TVET_College/2025/student/DHET_Submission_Student_Data_-_Check-2026_08_17_15_57_53.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Maluti TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:51.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Maluti_TVET_College/2025/student/DHET_Submission_Student_Data_-_Check-2026_08_17_15_57_53.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mnambithi_TVET_College/2025/P_S_Q/Mnambithi_TVET_College_DHET_Submission_Programme_Subject__Qualifications-2026_08_17_15_22_00.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mnambithi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:51.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mnambithi_TVET_College/2025/P_S_Q/Mnambithi_TVET_College_DHET_Submission_Programme_Subject__Qualifications-2026_08_17_15_22_00.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mnambithi_TVET_College/2025/college_information/Mnambithi_TVET_College_DHET_Submission_College_Information-2026_08_17_16_21_21.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mnambithi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:51.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mnambithi_TVET_College/2025/college_information/Mnambithi_TVET_College_DHET_Submission_College_Information-2026_08_17_16_21_21.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mnambithi_TVET_College/2025/staff/Mnambithi_TVET_College_DHET_Submission_Staff_Data-2026_08_17_16_17_35.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mnambithi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:51.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mnambithi_TVET_College/2025/staff/Mnambithi_TVET_College_DHET_Submission_Staff_Data-2026_08_17_16_17_35.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mnambithi_TVET_College/2025/student/Mnambithi_TVET_College_DHET_Submission_Student_Data-2026_08_17_16_48_29.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mnambithi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:52.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mnambithi_TVET_College/2025/student/Mnambithi_TVET_College_DHET_Submission_Student_Data-2026_08_17_16_48_29.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mopani_South_East_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_14_35_37.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mopani South East TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:52.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mopani_South_East_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_14_35_37.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mopani_South_East_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_14_34_39.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mopani South East TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:52.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mopani_South_East_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_14_34_39.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mopani_South_East_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2026_08_17_14_38_11.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mopani South East TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:53.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mopani_South_East_TVET_College/2025/head_count_enrollment/DHET_Headcount_Enrolment_Cycle-2026_08_17_14_38_11.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mopani_South_East_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_14_35_53.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mopani South East TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:53.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mopani_South_East_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_14_35_53.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mopani_South_East_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_14_36_11.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mopani South East TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:53.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mopani_South_East_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_14_36_11.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Motheo_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_20_25_58.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Motheo TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:53.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Motheo_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_20_25_58.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Motheo_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_15_18_21.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Motheo TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:54.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Motheo_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_15_18_21.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Motheo_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_17_36_54.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Motheo TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:54.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Motheo_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_17_36_54.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Motheo_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_17_39_55.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Motheo TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:54.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Motheo_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_17_39_55.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mthashana_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_23_05_21.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mthashana TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:54.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mthashana_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_23_05_21.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mthashana_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_23_01_22.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mthashana TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:56.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mthashana_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_23_01_22.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mthashana_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_23_09_42.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mthashana TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:57.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mthashana_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_23_09_42.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Mthashana_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_23_13_45.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Mthashana TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:58.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Mthashana_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_23_13_45.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Nkangala_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026-08-17_03_48_48_PM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Nkangala TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:59.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Nkangala_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026-08-17_03_48_48_PM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Nkangala_TVET_College/2025/college_information/DHET_Submission_College_Information-2026-08-17_03_44_20_PM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Nkangala TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:32:59.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Nkangala_TVET_College/2025/college_information/DHET_Submission_College_Information-2026-08-17_03_44_20_PM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Nkangala_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026-08-17_03_53_01_PM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Nkangala TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:00.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Nkangala_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026-08-17_03_53_01_PM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Nkangala_TVET_College/2025/student/DHET_Submission_Student_Data-2026-08-17_03_53_32_PM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Nkangala TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:00.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Nkangala_TVET_College/2025/student/DHET_Submission_Student_Data-2026-08-17_03_53_32_PM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Northern_Cape_Rural_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_18_8_24_28_AM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northern Cape Rural TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:01.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Northern_Cape_Rural_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_18_8_24_28_AM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Northern_Cape_Rural_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_18_8_22_20_AM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northern Cape Rural TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:01.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Northern_Cape_Rural_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_18_8_22_20_AM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Northern_Cape_Rural_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_18_8_26_03_AM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northern Cape Rural TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:01.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Northern_Cape_Rural_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_18_8_26_03_AM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Northern_Cape_Rural_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_18_8_27_34_AM.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northern Cape Rural TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:02.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Northern_Cape_Rural_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_18_8_27_34_AM.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Sekhukhune_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_18_01_10.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Sekhukhune TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:02.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Sekhukhune_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_18_01_10.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Sekhukhune_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_17_57_59.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Sekhukhune TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:02.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Sekhukhune_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_17_57_59.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Sekhukhune_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_18_04_13.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Sekhukhune TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:02.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Sekhukhune_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_18_04_13.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Sekhukhune_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_18_06_50.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Sekhukhune TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:03.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Sekhukhune_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_18_06_50.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/South_Cape_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_18_08_43_11.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'South Cape TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:03.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/South_Cape_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_18_08_43_11.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/South_Cape_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_18_08_40_36.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'South Cape TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:03.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/South_Cape_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_18_08_40_36.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/South_Cape_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_18_08_45_16.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'South Cape TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:03.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/South_Cape_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_18_08_45_16.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/South_Cape_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_18_08_46_42.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'South Cape TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:03.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/South_Cape_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_18_08_46_42.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Taletso_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_11_43_06.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Taletso TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:04.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Taletso_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_11_43_06.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Taletso_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_11_42_15.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Taletso TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:04.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Taletso_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_11_42_15.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Taletso_TVET_College/2025/head_count_enrollment/Head_Count_Enrollment_2025.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Taletso TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:04.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Taletso_TVET_College/2025/head_count_enrollment/Head_Count_Enrollment_2025.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Taletso_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_11_43_13.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Taletso TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:04.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Taletso_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_11_43_13.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Taletso_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_11_43_31.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Taletso TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:05.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Taletso_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_11_43_31.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Thekwini_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_18_33_56.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Thekwini TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:05.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Thekwini_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_18_33_56.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Thekwini_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_18_32_59.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Thekwini TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:06.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Thekwini_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_18_32_59.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Thekwini_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_18_34_12.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Thekwini TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:06.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Thekwini_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_18_34_12.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Thekwini_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_18_34_29.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Thekwini TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:07.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Thekwini_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_18_34_29.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Tshwane_South_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_19_08_50.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Tshwane South TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:07.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Tshwane_South_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_19_08_50.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Tshwane_South_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_19_04_02.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Tshwane South TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:08.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Tshwane_South_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_19_04_02.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Tshwane_South_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_19_11_57.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Tshwane South TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:08.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Tshwane_South_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_19_11_57.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Tshwane_South_TVET_College/2025/student/DHET_Submission_Staff_Data-2026_08_17_19_11_57.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Tshwane South TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:09.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Tshwane_South_TVET_College/2025/student/DHET_Submission_Staff_Data-2026_08_17_19_11_57.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Umfolozi_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_16_09_01.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Umfolozi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:10.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Umfolozi_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_16_09_01.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Umfolozi_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_15_55_24.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Umfolozi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:10.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Umfolozi_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_15_55_24.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Umfolozi_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_16_29_54.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Umfolozi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:10.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Umfolozi_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_16_29_54.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Umfolozi_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_16_39_16.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Umfolozi TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:10.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Umfolozi_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_16_39_16.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Umgungundlovu_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_13_29_17.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Umgungundlovu TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:11.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Umgungundlovu_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_13_29_17.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Umgungundlovu_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_13_27_55.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Umgungundlovu TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:11.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Umgungundlovu_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_13_27_55.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Umgungundlovu_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_13_29_38.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Umgungundlovu TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:11.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Umgungundlovu_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_13_29_38.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Umgungundlovu_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_13_30_11.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Umgungundlovu TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:11.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Umgungundlovu_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_13_30_11.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Waterberg_TVET_College/2025/P_S_Q/2025_DHET_Submission_Programme_Subject__Qualifications_WATERBERG.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Waterberg TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:12.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Waterberg_TVET_College/2025/P_S_Q/2025_DHET_Submission_Programme_Subject__Qualifications_WATERBERG.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Waterberg_TVET_College/2025/college_information/2025_DHET_Submission_College_Information_WATERBERG.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Waterberg TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:12.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Waterberg_TVET_College/2025/college_information/2025_DHET_Submission_College_Information_WATERBERG.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Waterberg_TVET_College/2025/staff/2025_DHET_Submission_Staff_Data_WATERBERG.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Waterberg TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:13.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Waterberg_TVET_College/2025/staff/2025_DHET_Submission_Staff_Data_WATERBERG.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Waterberg_TVET_College/2025/student/2025_DHET_Submission_Student_Data_WATERBERG.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Waterberg TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:13.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Waterberg_TVET_College/2025/student/2025_DHET_Submission_Student_Data_WATERBERG.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Western_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_16_38_06.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Western TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:13.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Western_TVET_College/2025/P_S_Q/DHET_Submission_Programme_Subject__Qualifications-2026_08_17_16_38_06.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Western_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_17_09_26.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Western TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:14.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Western_TVET_College/2025/college_information/DHET_Submission_College_Information-2026_08_17_17_09_26.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Western_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_16_41_41.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Western TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:14.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Western_TVET_College/2025/staff/DHET_Submission_Staff_Data-2026_08_17_16_41_41.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Coltech' AND role = 'provider' LIMIT 1),
  'Coltech/Western_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_16_44_28.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Western TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:14.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Coltech/Western_TVET_College/2025/student/DHET_Submission_Student_Data-2026_08_17_16_44_28.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Buffalo_City_TVET_College/2025/P_S_Q/Qualification_Info_202517.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Buffalo City TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:14.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Buffalo_City_TVET_College/2025/P_S_Q/Qualification_Info_202517.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Buffalo_City_TVET_College/2025/college_information/Provider_information_202516.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Buffalo City TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:15.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Buffalo_City_TVET_College/2025/college_information/Provider_information_202516.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Buffalo_City_TVET_College/2025/head_count_enrollment/Headcount_202515.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Buffalo City TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:15.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Buffalo_City_TVET_College/2025/head_count_enrollment/Headcount_202515.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Buffalo_City_TVET_College/2025/staff/Staff_information_202519.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Buffalo City TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:15.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Buffalo_City_TVET_College/2025/staff/Staff_information_202519.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Buffalo_City_TVET_College/2025/student/Student_Information_202518.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Buffalo City TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:16.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Buffalo_City_TVET_College/2025/student/Student_Information_202518.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Central_Johannesburg_TVET_College/2025/P_S_Q/QUALIFICATION_INFORMATION.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Central Johannesburg TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:16.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Central_Johannesburg_TVET_College/2025/P_S_Q/QUALIFICATION_INFORMATION.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Central_Johannesburg_TVET_College/2025/college_information/PROVIDER_INFORMATION.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Central Johannesburg TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:16.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Central_Johannesburg_TVET_College/2025/college_information/PROVIDER_INFORMATION.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Central_Johannesburg_TVET_College/2025/head_count_enrollment/HEAD_COUNT.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Central Johannesburg TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:16.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Central_Johannesburg_TVET_College/2025/head_count_enrollment/HEAD_COUNT.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Central_Johannesburg_TVET_College/2025/staff/STAFF_INFORMATION.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Central Johannesburg TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:17.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Central_Johannesburg_TVET_College/2025/staff/STAFF_INFORMATION.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Central_Johannesburg_TVET_College/2025/student/STUDENT_INFORMATION.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Central Johannesburg TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:17.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Central_Johannesburg_TVET_College/2025/student/STUDENT_INFORMATION.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Coastal_TVET_College/2025/P_S_Q/Coastal_TVETMIS_17.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Coastal TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:17.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Coastal_TVET_College/2025/P_S_Q/Coastal_TVETMIS_17.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Coastal_TVET_College/2025/college_information/COASTAL_TVETMIS_16.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Coastal TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:17.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Coastal_TVET_College/2025/college_information/COASTAL_TVETMIS_16.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Coastal_TVET_College/2025/head_count_enrollment/COASTAL_KZN_TVET_COLLEGE_2025_DATA_COLLECTION_26-05-2026.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Coastal TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:18.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Coastal_TVET_College/2025/head_count_enrollment/COASTAL_KZN_TVET_COLLEGE_2025_DATA_COLLECTION_26-05-2026.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Coastal_TVET_College/2025/staff/Coastal_TVETMIS_19.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Coastal TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:18.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Coastal_TVET_College/2025/staff/Coastal_TVETMIS_19.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Coastal_TVET_College/2025/student/Coastal_TVETMIS_18.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Coastal TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:18.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Coastal_TVET_College/2025/student/Coastal_TVETMIS_18.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/College_of_Cape_Town/2025/P_S_Q/2025_PROGRAMME_SUBJECTS_AND_QUALIFICATIONS.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'College of Cape Town' LIMIT 1),
  2025,
  '2026-08-25T06:33:18.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/College_of_Cape_Town/2025/P_S_Q/2025_PROGRAMME_SUBJECTS_AND_QUALIFICATIONS.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/College_of_Cape_Town/2025/college_information/2025_College_Information.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'College of Cape Town' LIMIT 1),
  2025,
  '2026-08-25T06:33:19.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/College_of_Cape_Town/2025/college_information/2025_College_Information.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/College_of_Cape_Town/2025/head_count_enrollment/HEADOUNT_ENROLMENT_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'College of Cape Town' LIMIT 1),
  2025,
  '2026-08-25T06:33:19.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/College_of_Cape_Town/2025/head_count_enrollment/HEADOUNT_ENROLMENT_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/College_of_Cape_Town/2025/staff/2025_Staff_Data.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'College of Cape Town' LIMIT 1),
  2025,
  '2026-08-25T06:33:19.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/College_of_Cape_Town/2025/staff/2025_Staff_Data.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/College_of_Cape_Town/2025/student/2025_Student_Data.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'College of Cape Town' LIMIT 1),
  2025,
  '2026-08-25T06:33:19.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/College_of_Cape_Town/2025/student/2025_Student_Data.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ehlanzeni_TVET_College/2025/P_S_Q/2025_Programme_Subject__Qualifications.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ehlanzeni TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:19.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ehlanzeni_TVET_College/2025/P_S_Q/2025_Programme_Subject__Qualifications.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ehlanzeni_TVET_College/2025/college_information/2025_College_Data.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ehlanzeni TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:20.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ehlanzeni_TVET_College/2025/college_information/2025_College_Data.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ehlanzeni_TVET_College/2025/head_count_enrollment/Headcount_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ehlanzeni TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:20.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ehlanzeni_TVET_College/2025/head_count_enrollment/Headcount_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ehlanzeni_TVET_College/2025/staff/2025_Staff_Data.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ehlanzeni TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:20.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ehlanzeni_TVET_College/2025/staff/2025_Staff_Data.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ehlanzeni_TVET_College/2025/student/2025_Student_Data.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ehlanzeni TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:20.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ehlanzeni_TVET_College/2025/student/2025_Student_Data.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ekurhuleni_East_TVET_College/2025/P_S_Q/Prog_Qual_and_Subject.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ekurhuleni East TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:21.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ekurhuleni_East_TVET_College/2025/P_S_Q/Prog_Qual_and_Subject.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ekurhuleni_East_TVET_College/2025/college_information/College_Information_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ekurhuleni East TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:21.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ekurhuleni_East_TVET_College/2025/college_information/College_Information_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ekurhuleni_East_TVET_College/2025/staff/Staff_Data_2025.txt.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ekurhuleni East TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:21.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ekurhuleni_East_TVET_College/2025/staff/Staff_Data_2025.txt.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ekurhuleni_East_TVET_College/2025/student/Student_Data.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ekurhuleni East TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:21.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ekurhuleni_East_TVET_College/2025/student/Student_Data.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ekurhuleni_West_TVET_College/2025/P_S_Q/Programme_Subject__Qualifications.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ekurhuleni West TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:22.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ekurhuleni_West_TVET_College/2025/P_S_Q/Programme_Subject__Qualifications.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ekurhuleni_West_TVET_College/2025/college_information/College_Information.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ekurhuleni West TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:22.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ekurhuleni_West_TVET_College/2025/college_information/College_Information.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ekurhuleni_West_TVET_College/2025/staff/STAFF_DATA.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ekurhuleni West TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:22.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ekurhuleni_West_TVET_College/2025/staff/STAFF_DATA.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ekurhuleni_West_TVET_College/2025/student/STUDENT_DATA.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ekurhuleni West TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:22.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ekurhuleni_West_TVET_College/2025/student/STUDENT_DATA.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Gert_Sibande_TVET_College/2025/P_S_Q/Qualification_Information.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Gert Sibande TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:23.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Gert_Sibande_TVET_College/2025/P_S_Q/Qualification_Information.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Gert_Sibande_TVET_College/2025/college_information/College_Information.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Gert Sibande TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:23.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Gert_Sibande_TVET_College/2025/college_information/College_Information.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Gert_Sibande_TVET_College/2025/staff/Staff_Information.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Gert Sibande TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:23.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Gert_Sibande_TVET_College/2025/staff/Staff_Information.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Gert_Sibande_TVET_College/2025/student/Student_Information.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Gert Sibande TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:23.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Gert_Sibande_TVET_College/2025/student/Student_Information.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ingwe_TVET_College/2025/P_S_Q/2025_Subject_Qualification.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ingwe TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:23.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ingwe_TVET_College/2025/P_S_Q/2025_Subject_Qualification.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ingwe_TVET_College/2025/college_information/2025_College_Info.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ingwe TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:24.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ingwe_TVET_College/2025/college_information/2025_College_Info.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ingwe_TVET_College/2025/head_count_enrollment/Student_Headcount_2025.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ingwe TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:24.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ingwe_TVET_College/2025/head_count_enrollment/Student_Headcount_2025.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ingwe_TVET_College/2025/staff/2025_Staff.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ingwe TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:25.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ingwe_TVET_College/2025/staff/2025_Staff.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Ingwe_TVET_College/2025/student/2025_Student_Info.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Ingwe TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:25.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Ingwe_TVET_College/2025/student/2025_Student_Info.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/King_Hintsa_TVET_College/2025/P_S_Q/Qualification_and_subjects.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'King Hintsa TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:26.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/King_Hintsa_TVET_College/2025/P_S_Q/Qualification_and_subjects.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/King_Hintsa_TVET_College/2025/college_information/Provider_information_file.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'King Hintsa TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:26.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/King_Hintsa_TVET_College/2025/college_information/Provider_information_file.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/King_Hintsa_TVET_College/2025/head_count_enrollment/HEADCOUNT_2025_FILE.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'King Hintsa TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:26.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/King_Hintsa_TVET_College/2025/head_count_enrollment/HEADCOUNT_2025_FILE.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/King_Hintsa_TVET_College/2025/staff/TVETMIS_STAFF_INFORMATION_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'King Hintsa TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:26.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/King_Hintsa_TVET_College/2025/staff/TVETMIS_STAFF_INFORMATION_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/King_Hintsa_TVET_College/2025/student/Student_data_file.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'King Hintsa TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:27.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/King_Hintsa_TVET_College/2025/student/Student_data_file.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/King_Sabata_Dalindyebo_TVET_College/2025/P_S_Q/Qualification_Information.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'King Sabata Dalindyebo TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:27.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/King_Sabata_Dalindyebo_TVET_College/2025/P_S_Q/Qualification_Information.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/King_Sabata_Dalindyebo_TVET_College/2025/college_information/Provider_Information.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'King Sabata Dalindyebo TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:27.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/King_Sabata_Dalindyebo_TVET_College/2025/college_information/Provider_Information.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/King_Sabata_Dalindyebo_TVET_College/2025/head_count_enrollment/Headcounts.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'King Sabata Dalindyebo TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:27.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/King_Sabata_Dalindyebo_TVET_College/2025/head_count_enrollment/Headcounts.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/King_Sabata_Dalindyebo_TVET_College/2025/staff/Staff_Information.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'King Sabata Dalindyebo TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:27.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/King_Sabata_Dalindyebo_TVET_College/2025/staff/Staff_Information.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/King_Sabata_Dalindyebo_TVET_College/2025/student/Student_Information.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'King Sabata Dalindyebo TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:28.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/King_Sabata_Dalindyebo_TVET_College/2025/student/Student_Information.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Northern_Cape_Urban_TVET_College/2025/P_S_Q/TVETMIS-_17_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northern Cape Urban TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:28.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Northern_Cape_Urban_TVET_College/2025/P_S_Q/TVETMIS-_17_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Northern_Cape_Urban_TVET_College/2025/college_information/TVETMIS_-16_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northern Cape Urban TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:28.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Northern_Cape_Urban_TVET_College/2025/college_information/TVETMIS_-16_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Northern_Cape_Urban_TVET_College/2025/head_count_enrollment/NCU_TVET_2025_DATA.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northern Cape Urban TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:28.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Northern_Cape_Urban_TVET_College/2025/head_count_enrollment/NCU_TVET_2025_DATA.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Northern_Cape_Urban_TVET_College/2025/staff/TVETMIS-_19_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northern Cape Urban TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:29.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Northern_Cape_Urban_TVET_College/2025/staff/TVETMIS-_19_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Northern_Cape_Urban_TVET_College/2025/student/TVETMIS-_18_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northern Cape Urban TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:29.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Northern_Cape_Urban_TVET_College/2025/student/TVETMIS-_18_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Northlink_TVET_College/2025/P_S_Q/TVETMIS_17_2025_QUALIFICATION.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northlink TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:29.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Northlink_TVET_College/2025/P_S_Q/TVETMIS_17_2025_QUALIFICATION.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Northlink_TVET_College/2025/college_information/TVETMIS_16_COLLEGE_INFORMATION.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northlink TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:29.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Northlink_TVET_College/2025/college_information/TVETMIS_16_COLLEGE_INFORMATION.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Northlink_TVET_College/2025/head_count_enrollment/HEADCOUNT_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northlink TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:30.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Northlink_TVET_College/2025/head_count_enrollment/HEADCOUNT_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Northlink_TVET_College/2025/staff/TVETMIS_19_STAFF.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northlink TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:30.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Northlink_TVET_College/2025/staff/TVETMIS_19_STAFF.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Northlink_TVET_College/2025/student/TVETMIS_18STUDENT_DATA.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Northlink TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:30.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Northlink_TVET_College/2025/student/TVETMIS_18STUDENT_DATA.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Orbit_TVET_College/2025/P_S_Q/ORBIT_file02.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Orbit TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:30.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Orbit_TVET_College/2025/P_S_Q/ORBIT_file02.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Orbit_TVET_College/2025/college_information/ORBIT_file01.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Orbit TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:31.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Orbit_TVET_College/2025/college_information/ORBIT_file01.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Orbit_TVET_College/2025/staff/ORBIT_file04.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Orbit TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:31.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Orbit_TVET_College/2025/staff/ORBIT_file04.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Orbit_TVET_College/2025/student/ORBIT_file03.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Orbit TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:31.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Orbit_TVET_College/2025/student/ORBIT_file03.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Port_Elizabeth_TVET_College/2025/P_S_Q/PE_TVET_QUALIFICATIONS_INFORMATION.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Port Elizabeth TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:32.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Port_Elizabeth_TVET_College/2025/P_S_Q/PE_TVET_QUALIFICATIONS_INFORMATION.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Port_Elizabeth_TVET_College/2025/college_information/PE_TVET_CAMPUS_INFORMATION_.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Port Elizabeth TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:32.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Port_Elizabeth_TVET_College/2025/college_information/PE_TVET_CAMPUS_INFORMATION_.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Port_Elizabeth_TVET_College/2025/staff/2025_STAFF_INFORMATION.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Port Elizabeth TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:32.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Port_Elizabeth_TVET_College/2025/staff/2025_STAFF_INFORMATION.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Port_Elizabeth_TVET_College/2025/student/PE_TVET_Student_information_2025_.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Port Elizabeth TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:32.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Port_Elizabeth_TVET_College/2025/student/PE_TVET_Student_information_2025_.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/South_West_Gauteng_TVET_College/2025/P_S_Q/TVETMIS_17.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'South West Gauteng TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:33.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/South_West_Gauteng_TVET_College/2025/P_S_Q/TVETMIS_17.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/South_West_Gauteng_TVET_College/2025/college_information/TVETMIS_16.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'South West Gauteng TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:33.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/South_West_Gauteng_TVET_College/2025/college_information/TVETMIS_16.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/South_West_Gauteng_TVET_College/2025/head_count_enrollment/TVETMIS_15.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'South West Gauteng TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:33.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/South_West_Gauteng_TVET_College/2025/head_count_enrollment/TVETMIS_15.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/South_West_Gauteng_TVET_College/2025/staff/TVETMIS_19.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'South West Gauteng TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:33.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/South_West_Gauteng_TVET_College/2025/staff/TVETMIS_19.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/South_West_Gauteng_TVET_College/2025/student/TVETMIS_18.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'South West Gauteng TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:33.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/South_West_Gauteng_TVET_College/2025/student/TVETMIS_18.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Vhembe_TVET_College/2025/P_S_Q/2025_QUALIFICATIONS_INFOR_0818.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Vhembe TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:34.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Vhembe_TVET_College/2025/P_S_Q/2025_QUALIFICATIONS_INFOR_0818.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Vhembe_TVET_College/2025/college_information/2025_PROVIDER_INFOR.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Vhembe TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:34.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Vhembe_TVET_College/2025/college_information/2025_PROVIDER_INFOR.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Vhembe_TVET_College/2025/head_count_enrollment/2025_HEADCOUNT_INFOR_0817.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Vhembe TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:34.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Vhembe_TVET_College/2025/head_count_enrollment/2025_HEADCOUNT_INFOR_0817.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Vhembe_TVET_College/2025/staff/2025_STAFF_INFOR_0817.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Vhembe TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:34.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Vhembe_TVET_College/2025/staff/2025_STAFF_INFOR_0817.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Vhembe_TVET_College/2025/student/2025_STUDENTS_INFOR_0818.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Vhembe TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:35.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Vhembe_TVET_College/2025/student/2025_STUDENTS_INFOR_0818.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Vuselela_TVET_College/2025/P_S_Q/TVETMIS-17_QUALIFICATIONS_REPORT_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Vuselela TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:35.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Vuselela_TVET_College/2025/P_S_Q/TVETMIS-17_QUALIFICATIONS_REPORT_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Vuselela_TVET_College/2025/college_information/TVETMIS-16_PROVIDER_REPORT.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Vuselela TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:35.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Vuselela_TVET_College/2025/college_information/TVETMIS-16_PROVIDER_REPORT.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Vuselela_TVET_College/2025/head_count_enrollment/TVETMIS-15_STUDENT_HC_REPORT_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Vuselela TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:35.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Vuselela_TVET_College/2025/head_count_enrollment/TVETMIS-15_STUDENT_HC_REPORT_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Vuselela_TVET_College/2025/staff/TVETMIS-19_PERSONNEL_REPORT_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Vuselela TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:36.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Vuselela_TVET_College/2025/staff/TVETMIS-19_PERSONNEL_REPORT_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'ITS' AND role = 'provider' LIMIT 1),
  'ITS/Vuselela_TVET_College/2025/student/TVETMIS-18_STUDENTS_REPORT_2025.xlsx',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Vuselela TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:36.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'ITS/Vuselela_TVET_College/2025/student/TVETMIS-18_STUDENTS_REPORT_2025.xlsx');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Thusanang' AND role = 'provider' LIMIT 1),
  'Thusanang/Sedibeng_TVET_College/2025/P_S_Q/Programme_Subject_Qualifications.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Sedibeng TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:36.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Thusanang/Sedibeng_TVET_College/2025/P_S_Q/Programme_Subject_Qualifications.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Thusanang' AND role = 'provider' LIMIT 1),
  'Thusanang/Sedibeng_TVET_College/2025/college_information/College_Information.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Sedibeng TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:37.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Thusanang/Sedibeng_TVET_College/2025/college_information/College_Information.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Thusanang' AND role = 'provider' LIMIT 1),
  'Thusanang/Sedibeng_TVET_College/2025/staff/Staff_Data.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Sedibeng TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:37.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Thusanang/Sedibeng_TVET_College/2025/staff/Staff_Data.csv');

INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
SELECT
  (SELECT user_id FROM users WHERE provider_name = 'Thusanang' AND role = 'provider' LIMIT 1),
  'Thusanang/Sedibeng_TVET_College/2025/student/Student_Data.csv',
  (SELECT college_id FROM college WHERE college_name ILIKE 'Sedibeng TVET College' LIMIT 1),
  2025,
  '2026-08-25T06:33:38.000Z'::timestamptz,
  0
WHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = 'Thusanang/Sedibeng_TVET_College/2025/student/Student_Data.csv');

-- Total: 213 statements