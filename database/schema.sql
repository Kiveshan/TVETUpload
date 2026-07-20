-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    provider_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- COLLEGE TABLE
-- =========================
CREATE TABLE college (
    college_id SERIAL PRIMARY KEY,
    college_name VARCHAR(255) NOT NULL UNIQUE
);

-- =========================
-- UPLOADS TABLE
-- =========================
CREATE TABLE uploads (
    upload_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    s3_bucket_link TEXT NOT NULL,
    college_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_upload_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_upload_college
        FOREIGN KEY (college_id)
        REFERENCES college(college_id)
        ON DELETE RESTRICT
);

-- =========================
-- REQUEST TABLE
-- =========================
CREATE TABLE request (
    request_id SERIAL PRIMARY KEY,
    upload_id INTEGER NOT NULL,
    s3_bucket_link VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',

    CONSTRAINT fk_request_upload
        FOREIGN KEY (upload_id)
        REFERENCES uploads(upload_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_request_status
        CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

INSERT INTO college (college_name)
VALUES
('Buffalo City TVET College'),
('Eastcape Midlands TVET College'),
('Ikhala TVET College'),
('Ingwe TVET College'),
('King Hintsa TVET College'),
('King Sabata Dalindyebo TVET College'),
('Lovedale TVET College'),
('Port Elizabeth TVET College'),

('Flavius Mareka TVET College'),
('Goldfields TVET College'),
('Maluti TVET College'),
('Motheo TVET College'),

('Central Johannesburg TVET College'),
('Ekurhuleni East TVET College'),
('Ekurhuleni West TVET College'),
('Sedibeng TVET College'),
('South West Gauteng TVET College'),
('Tshwane North TVET College'),
('Tshwane South TVET College'),
('Western TVET College'),

('Coastal TVET College'),
('Elangeni TVET College'),
('Esayidi TVET College'),
('Majuba TVET College'),
('Mnambithi TVET College'),
('Mthashana TVET College'),
('Thekwini TVET College'),
('Umfolozi TVET College'),
('Umgungundlovu TVET College'),

('Capricorn TVET College'),
('Lephalale TVET College'),
('Letaba TVET College'),
('Mopani South East TVET College'),
('Sekhukhune TVET College'),
('Vhembe TVET College'),
('Waterberg TVET College'),

('Ehlanzeni TVET College'),
('Gert Sibande TVET College'),
('Nkangala TVET College'),

('Orbit TVET College'),
('Taletso TVET College'),
('Vuselela TVET College'),

('Northern Cape Rural TVET College'),
('Northern Cape Urban TVET College'),

('Boland TVET College'),
('College of Cape Town'),
('False Bay TVET College'),
('Northlink TVET College'),
('South Cape TVET College'),
('West Coast TVET College');
