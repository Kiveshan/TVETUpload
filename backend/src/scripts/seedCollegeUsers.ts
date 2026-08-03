/**
 * Seed script: inserts one 'college' role user per TVET college.
 * Run from the backend directory:
 *   npx tsx src/scripts/seedCollegeUsers.ts
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface CollegeUser {
  email: string;
  fullName: string;
  providerName: string;
  password: string;
  collegeId: number;
}

const COLLEGE_USERS: CollegeUser[] = [
  // ── Coltech ────────────────────────────────────────────────────────────────
  { email: 'boland.tvet@gmail.com',          fullName: 'Boland TVET College',                   providerName: 'Coltech',   password: 'Bp4xLm7Q', collegeId: 45 },
  { email: 'capricorn.tvet@gmail.com',        fullName: 'Capricorn TVET College',                providerName: 'Coltech',   password: 'Tz8vBk2L', collegeId: 30 },
  { email: 'elangeni.tvet@gmail.com',         fullName: 'Elangeni TVET College',                 providerName: 'Coltech',   password: 'Kf5wCj9X', collegeId: 22 },
  { email: 'emc.tvet@gmail.com',              fullName: 'Eastcape Midlands TVET College',        providerName: 'Coltech',   password: 'Dm3nYs6R', collegeId: 2  },
  { email: 'esayidi.tvet@gmail.com',          fullName: 'Esayidi TVET College',                  providerName: 'Coltech',   password: 'Gh7pLq4T', collegeId: 23 },
  { email: 'flaviusmareka.tvet@gmail.com',    fullName: 'Flavius Mareka TVET College',           providerName: 'Coltech',   password: 'Nc2mWd8V', collegeId: 9  },
  { email: 'goldfields.tvet@gmail.com',       fullName: 'Goldfields TVET College',               providerName: 'Coltech',   password: 'Jb6tFr5Z', collegeId: 10 },
  { email: 'ikhala.tvet@gmail.com',           fullName: 'Ikhala TVET College',                   providerName: 'Coltech',   password: 'Px9kHn3E', collegeId: 3  },
  { email: 'letaba.tvet@gmail.com',           fullName: 'Letaba TVET College',                   providerName: 'Coltech',   password: 'Qw4sMy7U', collegeId: 32 },
  { email: 'lephalale.tvet@gmail.com',        fullName: 'Lephalale TVET College',                providerName: 'Coltech',   password: 'Av8rJc5B', collegeId: 31 },
  { email: 'lovedale.tvet@gmail.com',         fullName: 'Lovedale TVET College',                 providerName: 'Coltech',   password: 'Xu3fGo6P', collegeId: 7  },
  { email: 'maluti.tvet@gmail.com',           fullName: 'Maluti TVET College',                   providerName: 'Coltech',   password: 'Yk7dNm2W', collegeId: 11 },
  { email: 'motheo.tvet@gmail.com',           fullName: 'Motheo TVET College',                   providerName: 'Coltech',   password: 'Bh5xRt9S', collegeId: 12 },
  { email: 'mthashana.tvet@gmail.com',        fullName: 'Mthashana TVET College',                providerName: 'Coltech',   password: 'Cz4wVl6F', collegeId: 26 },
  { email: 'mnambithi.tvet@gmail.com',        fullName: 'Mnambithi TVET College',                providerName: 'Coltech',   password: 'Ls8nKb3H', collegeId: 25 },
  { email: 'majuba.tvet@gmail.com',           fullName: 'Majuba TVET College',                   providerName: 'Coltech',   password: 'Ej2pQy7D', collegeId: 24 },
  { email: 'mopani.tvet@gmail.com',           fullName: 'Mopani South East TVET College',        providerName: 'Coltech',   password: 'Tr6gZc4M', collegeId: 33 },
  { email: 'nkangala.tvet@gmail.com',         fullName: 'Nkangala TVET College',                 providerName: 'Coltech',   password: 'Fd9vXs5N', collegeId: 39 },
  { email: 'ncr.tvet@gmail.com',              fullName: 'Northern Cape Rural TVET College',      providerName: 'Coltech',   password: 'Ow3jBt8K', collegeId: 43 },
  { email: 'sekhukhune.tvet@gmail.com',       fullName: 'Sekhukhune TVET College',               providerName: 'Coltech',   password: 'Ym7rLp2G', collegeId: 34 },
  { email: 'southcape.tvet@gmail.com',        fullName: 'South Cape TVET College',               providerName: 'Coltech',   password: 'Vh4nCf6Q', collegeId: 49 },
  { email: 'taletso.tvet@gmail.com',          fullName: 'Taletso TVET College',                  providerName: 'Coltech',   password: 'Rk9mWd3T', collegeId: 41 },
  { email: 'thekwini.tvet@gmail.com',         fullName: 'Thekwini TVET College',                 providerName: 'Coltech',   password: 'Nb5sXz7J', collegeId: 27 },
  { email: 'tshwanesouth.tvet@gmail.com',     fullName: 'Tshwane South TVET College',            providerName: 'Coltech',   password: 'Pg8qFv4C', collegeId: 19 },
  { email: 'umfolozi.tvet@gmail.com',         fullName: 'Umfolozi TVET College',                 providerName: 'Coltech',   password: 'Hl2wYb6E', collegeId: 28 },
  { email: 'umgungundlovu.tvet@gmail.com',    fullName: 'Umgungundlovu TVET College',            providerName: 'Coltech',   password: 'Sx7kMr3A', collegeId: 29 },
  { email: 'waterberg.tvet@gmail.com',        fullName: 'Waterberg TVET College',                providerName: 'Coltech',   password: 'Dj4tNp9Y', collegeId: 36 },
  { email: 'westcol.tvet@gmail.com',          fullName: 'Western TVET College',                  providerName: 'Coltech',   password: 'Zf6cRe5H', collegeId: 20 },

  // ── Academia ───────────────────────────────────────────────────────────────
  { email: 'falsebay.tvet@gmail.com',         fullName: 'False Bay TVET College',                providerName: 'Academia',  password: 'Wq8vLs4K', collegeId: 47 },

  // ── Thusanang ──────────────────────────────────────────────────────────────
  { email: 'sedibeng.tvet@gmail.com',         fullName: 'Sedibeng TVET College',                 providerName: 'Thusanang', password: 'Mn3xBt7P', collegeId: 16 },

  // ── ITS ────────────────────────────────────────────────────────────────────
  { email: 'buffalocity.tvet@gmail.com',      fullName: 'Buffalo City TVET College',             providerName: 'ITS',       password: 'Kr5jZm2V', collegeId: 1  },
  { email: 'ingwe.tvet@gmail.com',            fullName: 'Ingwe TVET College',                    providerName: 'ITS',       password: 'Th9pCn6W', collegeId: 4  },
  { email: 'kinghintsa.tvet@gmail.com',       fullName: 'King Hintsa TVET College',              providerName: 'ITS',       password: 'Xb4wFr8L', collegeId: 5  },
  { email: 'ksd.tvet@gmail.com',              fullName: 'King Sabata Dalindyebo TVET College',   providerName: 'ITS',       password: 'Uy7sGe3Q', collegeId: 6  },
  { email: 'portelizabeth.tvet@gmail.com',    fullName: 'Port Elizabeth TVET College',           providerName: 'ITS',       password: 'Nf2tJk9M', collegeId: 8  },
  { email: 'cjc.tvet@gmail.com',              fullName: 'Central Johannesburg TVET College',     providerName: 'ITS',       password: 'Aw6mYd5T', collegeId: 13 },
  { email: 'ekurhulenieast.tvet@gmail.com',   fullName: 'Ekurhuleni East TVET College',          providerName: 'ITS',       password: 'Bz3nRp7S', collegeId: 14 },
  { email: 'ekurhuleniwest.tvet@gmail.com',   fullName: 'Ekurhuleni West TVET College',          providerName: 'ITS',       password: 'Vc8fXo4H', collegeId: 15 },
  { email: 'swgc.tvet@gmail.com',             fullName: 'South West Gauteng TVET College',       providerName: 'ITS',       password: 'Dp5rLs2N', collegeId: 17 },
  { email: 'tshwanenorth.tvet@gmail.com',     fullName: 'Tshwane North TVET College',            providerName: 'ITS',       password: 'Jq9kBm6E', collegeId: 18 },
  { email: 'coastal.tvet@gmail.com',          fullName: 'Coastal TVET College',                  providerName: 'ITS',       password: 'Yk4wZc8F', collegeId: 21 },
  { email: 'vhembe.tvet@gmail.com',           fullName: 'Vhembe TVET College',                   providerName: 'ITS',       password: 'Gr7sNt3A', collegeId: 35 },
  { email: 'ehlanzeni.tvet@gmail.com',        fullName: 'Ehlanzeni TVET College',                providerName: 'ITS',       password: 'Ph2xRv5K', collegeId: 37 },
  { email: 'gertsibande.tvet@gmail.com',      fullName: 'Gert Sibande TVET College',             providerName: 'ITS',       password: 'Lm9jWe6T', collegeId: 38 },
  { email: 'orbit.tvet@gmail.com',            fullName: 'Orbit TVET College',                    providerName: 'ITS',       password: 'Cf4bYq8D', collegeId: 40 },
  { email: 'vuselela.tvet@gmail.com',         fullName: 'Vuselela TVET College',                 providerName: 'ITS',       password: 'Xn7mSp3G', collegeId: 42 },
  { email: 'ncu.tvet@gmail.com',              fullName: 'Northern Cape Urban TVET College',      providerName: 'ITS',       password: 'Tj5wBk9L', collegeId: 44 },
  { email: 'capetown.tvet@gmail.com',         fullName: 'College of Cape Town',                  providerName: 'ITS',       password: 'Hd2rZf4V', collegeId: 46 },
  { email: 'northlink.tvet@gmail.com',        fullName: 'Northlink TVET College',                providerName: 'ITS',       password: 'Qx8nMy7C', collegeId: 48 },
  { email: 'westcoast.tvet@gmail.com',        fullName: 'West Coast TVET College',               providerName: 'ITS',       password: 'Eb6tPa3J', collegeId: 50 },
];

async function main() {
  console.log(`Seeding ${COLLEGE_USERS.length} college users…`);
  let inserted = 0;
  let skipped = 0;

  for (const cu of COLLEGE_USERS) {
    const hash = await bcrypt.hash(cu.password, 12);
    const result = await pool.query(
      `INSERT INTO users (email, full_name, provider_name, password, role, college_id)
       VALUES ($1, $2, $3, $4, 'college', $5)
       ON CONFLICT (email) DO NOTHING`,
      [cu.email, cu.fullName, cu.providerName, hash, cu.collegeId],
    );
    if (result.rowCount && result.rowCount > 0) {
      inserted++;
      console.log(`  ✓ ${cu.email}`);
    } else {
      skipped++;
      console.log(`  – ${cu.email} (already exists, skipped)`);
    }
  }

  console.log(`\nDone — ${inserted} inserted, ${skipped} skipped.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
