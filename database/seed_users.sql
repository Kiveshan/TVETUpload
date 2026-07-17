-- Seed: initial four provider users
-- Passwords are bcrypt-hashed (cost factor 12).
-- Plaintext passwords are recorded separately in your password manager.

INSERT INTO users (email, full_name, provider_name, password)
VALUES
  (
    'coltech@gmail.com',
    'Coltech',
    'Coltech',
    '$2b$12$5Z5bxhy0gZJPCXFPAbP1Yeq9qV8lwYRcN6x298in0sMrtWznN8gXi'
  ),
  (
    'thusanang@gmail.com',
    'Thusanang',
    'Thusanang',
    '$2b$12$5Z5bxhy0gZJPCXFPAbP1YeHFGa7kRqlnv6od8aMs1BQ21fqjc7wZK'
  ),
  (
    'its@gmail.com',
    'ITS',
    'ITS',
    '$2b$12$5Z5bxhy0gZJPCXFPAbP1YeZO2/5ZIeofcCrEs5Z/3TM0BlkO8Bwfa'
  ),
  (
    'academia@gmail.com',
    'Academia',
    'Academia',
    '$2b$12$5Z5bxhy0gZJPCXFPAbP1Ye5kvRByZVSm6zEseTlHA7cCwwyM7BWyi'
  )
ON CONFLICT (email) DO NOTHING;
