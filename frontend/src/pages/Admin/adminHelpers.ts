import { jsPDF } from 'jspdf';
import { BASE, MANDATORY_FOLDERS } from './adminTypes';
import { PROVIDER_COLLEGE_MAP, PROVIDER_TOTALS } from './adminProviderMap';
import type { UploadFile, Provider, YearFilter } from './adminTypes';

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

async function svgToDataUrl(svgUrl: string, w: number, h: number): Promise<string> {
  const res = await fetch(svgUrl);
  const svgText = await res.text();
  const blob = new Blob([svgText], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = url;
  });
}

export async function exportPDF(
  providers: Provider[],
  neverUploaded: { college_id: number; college_name: string }[] = [],
  yearFilter: YearFilter = 'both',
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;

  const navy: [number, number, number] = [30, 58, 95];
  const navyLight: [number, number, number] = [42, 82, 133];
  const rowAlt: [number, number, number] = [240, 244, 249];
  const providerBg: [number, number, number] = [219, 234, 254];
  const textDark: [number, number, number] = [15, 23, 42];
  const textMid: [number, number, number] = [100, 116, 139];
  const white: [number, number, number] = [255, 255, 255];
  const green: [number, number, number] = [22, 163, 74];
  const gray: [number, number, number] = [148, 163, 184];

  const now = new Date();
  const generatedDate = now.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  const generatedTime = now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const timestamp = `${generatedDate} at ${generatedTime}`;

  // ── Logo ──
  let logoDataUrl: string | null = null;
  try {
    logoDataUrl = await svgToDataUrl('/DHEAT_logo.svg', 550, 208);
  } catch { /* logo optional */ }

  // ── White header (matches system admin nav style) ──
  const logoH = 18;                          // rendered height in mm
  const logoW = logoH * (550 / 208);        // preserve aspect ratio ~47.6 mm
  const bannerH = logoH + 10;               // 5 mm padding top + bottom

  doc.setFillColor(...white);
  doc.rect(0, 0, pageW, bannerH, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(0, bannerH, pageW, bannerH);

  const logoY = 5;
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', margin, logoY, logoW, logoH);
  }

  // Title vertically centred alongside logo
  const textX = logoDataUrl ? margin + logoW + 6 : margin;
  const titleY = bannerH / 2 + 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...textDark);
  doc.text('TVET Upload Portal', textX, titleY - 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textMid);
  doc.text('Provider Summary Report', textX, titleY + 5);

  // ── Timestamp below header ──
  let y = bannerH + 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textMid);
  const yearLabel = yearFilter === 'both' ? '2025 & 2026' : yearFilter;
  doc.text(`Downloaded on: ${timestamp}  ·  Year: ${yearLabel}`, margin, y);
  y += 10;

  // ── Column setup ──
  const colCollegeName = margin + 6;
  const colUploaded = pageW - margin;
  const rowH = 8;

  // Helper: draw table header row
  const drawTableHeader = () => {
    doc.setFillColor(...navy);
    doc.rect(margin, y, contentW, rowH + 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...white);
    doc.text('PROVIDER / COLLEGE', margin + 3, y + 6);
    doc.text('UPLOADED', colUploaded - 3, y + 6, { align: 'right' });
    y += rowH + 1;
  };

  // Helper: render provider/college rows for a set of providers
  const renderProviderRows = (providerList: Provider[]) => {
    let rowIndex = 0;
    providerList.forEach((p) => {
      const uploadedCount = p.colleges.filter((c) => c.files.length > 0).length;
      if (y + rowH + 2 > pageH - 18) { doc.addPage(); y = 12; drawTableHeader(); }

      doc.setFillColor(...providerBg);
      doc.rect(margin, y, contentW, rowH + 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...navy);
      doc.text(p.providerName, margin + 3, y + 6);
      doc.setFontSize(8);
      doc.setTextColor(...navyLight);
      const totalForProvider = PROVIDER_TOTALS[p.providerName] ?? p.colleges.length;
      doc.text(
        `${uploadedCount} of ${totalForProvider} college${totalForProvider !== 1 ? 's' : ''} uploaded`,
        colUploaded - 3, y + 6, { align: 'right' },
      );
      doc.setDrawColor(200, 218, 240);
      doc.line(margin, y + rowH + 1, margin + contentW, y + rowH + 1);
      y += rowH + 1;

      p.colleges.forEach((c) => {
        if (y + rowH > pageH - 18) { doc.addPage(); y = 12; drawTableHeader(); }
        const hasUploaded = c.files.length > 0;
        if (rowIndex % 2 === 1) { doc.setFillColor(...rowAlt); doc.rect(margin, y, contentW, rowH, 'F'); }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...textDark);
        doc.text(c.collegeName, colCollegeName, y + 5.5);
        const pillLabel = hasUploaded ? `${c.files.length} file${c.files.length !== 1 ? 's' : ''} uploaded` : 'No files submitted';
        const pillW = 38; const pillH = 5;
        const pillX = colUploaded - pillW - 3; const pillY = y + 1.5;
        if (hasUploaded) {
          doc.setFillColor(220, 252, 231);
          doc.roundedRect(pillX, pillY, pillW, pillH, 1.5, 1.5, 'F');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...green);
        } else {
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(pillX, pillY, pillW, pillH, 1.5, 1.5, 'F');
          doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...gray);
        }
        doc.text(pillLabel, pillX + pillW / 2, pillY + 3.5, { align: 'center' });
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y + rowH, margin + contentW, y + rowH);
        y += rowH; rowIndex++;
      });
      y += 2;
    });
  };

  // Helper: draw year section heading banner
  const drawYearBanner = (yr: string) => {
    const bannerBg: [number, number, number] = [30, 58, 95];
    doc.setFillColor(...bannerBg);
    doc.rect(margin, y, contentW, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...white);
    doc.text(`${yr} Submissions`, margin + 3, y + 6.5);
    y += 11;
  };

  // Helper: draw never-uploaded attention section
  const dirCollegeX = margin + 6;
  const dirRowH = 7.5;
  const redMid: [number, number, number] = [220, 38, 38];

  const drawAttentionList = (list: { college_id: number; college_name: string }[], sectionLabel: string) => {
    let dy2 = y;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.text(sectionLabel, margin, dy2);
    dy2 += 4;
    doc.setDrawColor(...navy);
    doc.setLineWidth(0.4);
    doc.line(margin, dy2, margin + contentW, dy2);
    doc.setLineWidth(0.2);
    dy2 += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...textMid);
    const subtitle = list.length === 0
      ? 'All colleges have submitted for this year.'
      : `${list.length} college${list.length !== 1 ? 's' : ''} have not submitted for this year.`;
    doc.text(subtitle, margin, dy2);
    dy2 += 8;

    if (list.length > 0) {
      const grouped2: Record<string, string[]> = {};
      const unmatched2: string[] = [];
      for (const c of list) {
        let matched = false;
        for (const [providerName, colleges] of Object.entries(PROVIDER_COLLEGE_MAP)) {
          const lower = c.college_name.toLowerCase().trim();
          if (colleges.some((m) => {
            const exact = m.toLowerCase() === lower;
            const keyword = m.toLowerCase().replace(' tvet college', '').replace(' tvet', '').trim();
            return exact || lower.includes(keyword);
          })) {
            if (!grouped2[providerName]) grouped2[providerName] = [];
            grouped2[providerName].push(c.college_name);
            matched = true; break;
          }
        }
        if (!matched) unmatched2.push(c.college_name);
      }
      if (unmatched2.length) grouped2['Other'] = unmatched2;

      Object.entries(grouped2).forEach(([providerName, collegeList]) => {
        if (dy2 + dirRowH * 2 > pageH - 18) { doc.addPage(); dy2 = 16; }
        doc.setFillColor(...providerBg);
        doc.rect(margin, dy2, contentW, dirRowH, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...navy);
        doc.text(providerName, margin + 3, dy2 + 5.3);
        doc.setFontSize(8); doc.setTextColor(...redMid);
        doc.text(`${collegeList.length} not uploaded`, pageW - margin - 3, dy2 + 5.3, { align: 'right' });
        doc.setDrawColor(200, 218, 240);
        doc.line(margin, dy2 + dirRowH, margin + contentW, dy2 + dirRowH);
        dy2 += dirRowH;
        collegeList.forEach((name, ci) => {
          if (dy2 + dirRowH > pageH - 18) { doc.addPage(); dy2 = 16; }
          if (ci % 2 === 1) { doc.setFillColor(...rowAlt); doc.rect(margin, dy2, contentW, dirRowH, 'F'); }
          doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...textDark);
          doc.text(name, dirCollegeX, dy2 + 5.3);
          doc.setDrawColor(226, 232, 240);
          doc.line(margin, dy2 + dirRowH, margin + contentW, dy2 + dirRowH);
          dy2 += dirRowH;
        });
        dy2 += 3;
      });
    }
    y = dy2 + 4;
  };

  // ── Helper: filter providers to a specific year ──
  const filterByYear = (yr: '2025' | '2026') =>
    providers.map((p) => ({
      ...p,
      colleges: p.colleges
        .map((c) => ({ ...c, files: c.files.filter((f) => f.year === yr) }))
        .filter((c) => c.files.length > 0),
    }));

  // ── Helper: compute never-uploaded list for a specific year ──
  const neverForYear = (yr: '2025' | '2026') => {
    const uploadedIds = new Set<number>();
    for (const p of providers) {
      for (const c of p.colleges) {
        if (c.files.some((f) => f.year === yr)) uploadedIds.add(c.collegeId);
      }
    }
    const result: { college_id: number; college_name: string }[] = [...neverUploaded];
    for (const p of providers) {
      for (const c of p.colleges) {
        if (!uploadedIds.has(c.collegeId)) {
          result.push({ college_id: c.collegeId, college_name: c.collegeName });
        }
      }
    }
    result.sort((a, b) => a.college_name.localeCompare(b.college_name));
    return result;
  };

  // ── Render provider/college table(s) ──
  if (yearFilter === 'both') {
    drawYearBanner('2025');
    drawTableHeader();
    renderProviderRows(filterByYear('2025'));
    doc.addPage(); y = 12;
    drawYearBanner('2026');
    drawTableHeader();
    renderProviderRows(filterByYear('2026'));
  } else {
    drawTableHeader();
    renderProviderRows(providers);
  }

  // ── Attention section ──
  doc.addPage(); y = 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...textDark);
  doc.text('Colleges Requiring Attention', margin, y);
  y += 5;
  doc.setDrawColor(...navy);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentW, y);
  doc.setLineWidth(0.2);
  y += 10;

  if (yearFilter === 'both') {
    drawAttentionList(neverForYear('2025'), 'Not Uploaded for 2025');
    if (y + 30 > pageH - 18) { doc.addPage(); y = 16; }
    drawAttentionList(neverForYear('2026'), 'Not Uploaded for 2026');
  } else {
    drawAttentionList(neverUploaded, `Not Uploaded for ${yearFilter}`);
  }

  // ── Footer on every page ──
  const totalPages: number = (doc.internal as unknown as { pages: unknown[] }).pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const fY = pageH - 10;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, fY - 3, margin + contentW, fY - 3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...textMid);
    doc.text(`© ${now.getFullYear()} TVET Management Portal  ·  Confidential`, pageW / 2, fY + 1, { align: 'center' });
    doc.text(`Page ${i} of ${totalPages}`, margin + contentW, fY + 1, { align: 'right' });
  }

  doc.save(`tvet_provider_summary_${now.toISOString().slice(0, 10)}.pdf`);
}
