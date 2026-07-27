import { BASE, MANDATORY_FOLDERS, TOTAL_FOLDERS } from './adminTypes';
import type { UploadFile, Provider } from './adminTypes';

export function pct(uploaded: number, total: number) {
  return total === 0 ? 0 : Math.round((uploaded / total) * 100);
}

export function barColor(p: number) {
  if (p >= 80) return '#16a34a';
  if (p >= 50) return '#f59e0b';
  return '#dc2626';
}

export function getMissing(files: UploadFile[]) {
  const uploaded = new Set(files.map((f) => f.folder));
  return MANDATORY_FOLDERS.filter((f) => !uploaded.has(f));
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function lastSubmission(files: UploadFile[]) {
  if (!files.length) return '—';
  const sorted = [...files].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return fmtDate(sorted[0].createdAt);
}

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function downloadBlob(path: string, filename: string) {
  const res = await fetch(`${BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCSV(providers: Provider[]) {
  const rows = [
    ['Provider', 'College', 'Files Uploaded', 'Completion %', 'Missing Mandatory', 'Last Submission'],
  ];
  for (const p of providers) {
    for (const c of p.colleges) {
      const missing = getMissing(c.files);
      const completion = pct(c.files.length, TOTAL_FOLDERS);
      rows.push([
        p.providerName,
        c.collegeName,
        String(c.files.length),
        `${completion}%`,
        String(missing.length),
        lastSubmission(c.files),
      ]);
    }
  }
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tvet_summary_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
