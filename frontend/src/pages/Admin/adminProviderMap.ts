export const PROVIDER_COLLEGE_MAP: Record<string, string[]> = {
  Coltech: [
    'Boland TVET College',
    'Capricorn TVET College',
    'Elangeni TVET College',
    'Eastcape Midlands TVET College',
    'Esayidi TVET College',
    'Flavius Mareka TVET College',
    'Goldfields TVET College',
    'Ikhala TVET College',
    'Letaba TVET College',
    'Lephalale TVET College',
    'Lovedale TVET College',
    'Maluti TVET College',
    'Motheo TVET College',
    'Mthashana TVET College',
    'Mnambithi TVET College',
    'Majuba TVET College',
    'Mopani South East TVET College',
    'Nkangala TVET College',
    'Northern Cape Rural TVET College',
    'Sekhukhune TVET College',
    'South Cape TVET College',
    'Taletso TVET College',
    'Thekwini TVET College',
    'Tshwane South TVET College',
    'Umfolozi TVET College',
    'Umgungundlovu TVET College',
    'Waterberg TVET College',
    'Western TVET College',
  ],
  Academia: ['False Bay TVET College'],
  Thusanang: ['Sedibeng TVET College'],
  ITS: [
    'Buffalo City TVET College',
    'Ingwe TVET College',
    'King Hintsa TVET College',
    'King Sabata Dalindyebo TVET College',
    'Port Elizabeth TVET College',
    'Central Johannesburg TVET College',
    'Ekurhuleni East TVET College',
    'Ekurhuleni West TVET College',
    'South West Gauteng TVET College',
    'Tshwane North TVET College',
    'Coastal TVET College',
    'Vhembe TVET College',
    'Ehlanzeni TVET College',
    'Gert Sibande TVET College',
    'Orbit TVET College',
    'Vuselela TVET College',
    'Northern Cape Urban TVET College',
    'College of Cape Town',
    'Northlink TVET College',
    'West Coast TVET College',
  ],
};

export const PROVIDER_TOTALS: Record<string, number> = {
  Coltech: 28,
  Academia: 1,
  Thusanang: 1,
  ITS: 20,
};

export function getProviderForCollege(collegeName: string): string | null {
  const lower = collegeName.toLowerCase().trim();
  // Exact match first
  for (const [provider, colleges] of Object.entries(PROVIDER_COLLEGE_MAP)) {
    if (colleges.some((c) => c.toLowerCase() === lower)) return provider;
  }
  // Keyword match: strip "tvet college" suffix and check if DB name contains the keyword
  for (const [provider, colleges] of Object.entries(PROVIDER_COLLEGE_MAP)) {
    if (colleges.some((c) => {
      const keyword = c.toLowerCase().replace(' tvet college', '').replace(' tvet', '').trim();
      return lower.includes(keyword);
    })) return provider;
  }
  return null;
}
