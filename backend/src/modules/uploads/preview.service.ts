import * as XLSX from 'xlsx';

export interface PreviewResult {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

export function generatePreview(
  buffer: Buffer,
  filename: string,
  maxRows = 15,
): PreviewResult {
  let workbook: XLSX.WorkBook;

  try {
    workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true, sheetRows: maxRows + 2 });
  } catch {
    return { headers: [], rows: [], totalRows: 0 };
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { headers: [], rows: [], totalRows: 0 };

  const sheet = workbook.Sheets[sheetName];
  const data: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (data.length === 0) return { headers: [], rows: [], totalRows: 0 };

  const headers = (data[0] as unknown[]).map((h) => String(h ?? '').trim());
  const allRows = data
    .slice(1)
    .map((row) => (row as unknown[]).map((c) => String(c ?? '').trim()));

  return {
    headers,
    rows: allRows.slice(0, maxRows),
    totalRows: allRows.length,
  };
}
