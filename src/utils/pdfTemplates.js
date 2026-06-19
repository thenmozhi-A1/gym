/**
 * pdfTemplates.js
 * Shared jsPDF helpers for professional payslip and invoice generation.
 * Used by EmployeeDashboard (payslip) and PaymentModule (invoice).
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Brand colours ────────────────────────────────────────────────────────────
const BRAND_DARK   = [15,  23,  42];   // #0f172a
const BRAND_BLUE   = [59,  130, 246];  // #3b82f6
const BRAND_ACCENT = [250, 204, 21];   // #facc15 (gold)
const WHITE        = [255, 255, 255];
const MUTED        = [100, 116, 139];  // #64748b
const LIGHT_BG     = [241, 245, 249];  // #f1f5f9

// ── Helpers ──────────────────────────────────────────────────────────────────
function drawHeader(doc, title, subtitle) {
  const pageW = doc.internal.pageSize.getWidth();

  // Dark banner
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, pageW, 42, 'F');

  // Accent rule
  doc.setFillColor(...BRAND_BLUE);
  doc.rect(0, 42, pageW, 3, 'F');

  // Logo text
  doc.setTextColor(...WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('B&Y FITNESS GYM', pageW / 2, 18, { align: 'center' });

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_ACCENT);
  doc.text('Elite Fitness Operations Center', pageW / 2, 26, { align: 'center' });

  // Document title
  doc.setTextColor(...WHITE);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), pageW / 2, 36, { align: 'center' });

  // Subtitle (e.g. period)
  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(subtitle, pageW / 2, 52, { align: 'center' });
  }
}

function drawFooter(doc) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  doc.setDrawColor(...BRAND_BLUE);
  doc.setLineWidth(0.3);
  doc.line(15, pageH - 20, pageW - 15, pageH - 20);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    'This is a computer-generated document and does not require a signature.',
    pageW / 2, pageH - 13, { align: 'center' }
  );
  doc.text(
    'B&Y Fitness Gym  |  contact@byfitness.com  |  +123 456 7890',
    pageW / 2, pageH - 7, { align: 'center' }
  );
}

function infoRow(doc, label, value, x, y) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(label, x, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(String(value), x, y + 5);
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Generate and auto-download a professional payslip PDF.
 *
 * @param {object} employeeData  Staff object from /staffs/me
 * @param {number} netPay        Calculated net payable
 */
export function generatePayslipPDF(employeeData, netPay) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  const date        = new Date();
  const monthNames  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const month       = monthNames[date.getMonth()];
  const year        = date.getFullYear();
  const grossSalary = typeof employeeData.salary === 'number' ? employeeData.salary : parseInt(String(employeeData.salary).replace(/[^0-9]/g, '')) || 0;
  const leaves      = employeeData.leaves      || 0;
  const permissions = employeeData.permissions || 0;

  const dailyRate       = grossSalary / 30;
  const leaveDeduction  = Math.floor(dailyRate * leaves);
  const permDeduction   = Math.floor((dailyRate / 8) * permissions);
  const pfDeduction     = 1800;
  const tdsDeduction    = 650;
  const totalDeductions = leaveDeduction + permDeduction + pfDeduction + tdsDeduction;

  // ── Header ────────────────────────────────────────────────────────────────
  drawHeader(doc, `Payslip — ${month} ${year}`, `Pay Period: 01 ${month} ${year} – ${new Date(year, date.getMonth()+1, 0).getDate()} ${month} ${year}`);

  // ── Employee Info card ────────────────────────────────────────────────────
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(15, 58, pageW - 30, 36, 3, 3, 'F');

  infoRow(doc, 'EMPLOYEE NAME', employeeData.fullName || employeeData.name || 'N/A', 22, 67);
  infoRow(doc, 'DESIGNATION',   employeeData.role || 'Staff',                         22, 80);
  infoRow(doc, 'EMAIL',         employeeData.email || '',                              90, 67);
  infoRow(doc, 'DATE OF ISSUE', date.toLocaleDateString(),                            90, 80);
  infoRow(doc, 'EMPLOYEE ID',   `EMP-${employeeData.id || '000'}`,                  160, 67);
  infoRow(doc, 'MONTH/YEAR',    `${month} ${year}`,                                 160, 80);

  // ── Earnings & Deductions table ───────────────────────────────────────────
  autoTable(doc, {
    startY: 100,
    head: [['Description', 'Earnings (INR)', 'Deductions (INR)']],
    body: [
      ['Basic Salary',                        `INR ${grossSalary.toLocaleString()}`,    '—'],
      [`Leave Deduction (${leaves} days)`,    '—',                                    `INR ${leaveDeduction.toLocaleString()}`],
      [`Permission Deduction (${permissions} hrs)`, '—',                              `INR ${permDeduction.toLocaleString()}`],
      ['Provident Fund (PF)',                  '—',                                   `INR ${pfDeduction.toLocaleString()}`],
      ['TDS / Professional Tax',               '—',                                   `INR ${tdsDeduction.toLocaleString()}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: BRAND_BLUE, textColor: WHITE, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: LIGHT_BG },
    columnStyles: { 0: { cellWidth: 90 }, 1: { halign: 'right' }, 2: { halign: 'right' } },
    margin: { left: 15, right: 15 },
  });

  // ── Net Pay summary box ───────────────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 8;

  doc.setFillColor(...BRAND_DARK);
  doc.roundedRect(15, finalY, pageW - 30, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...WHITE);
  doc.text('NET PAYABLE AMOUNT:', 22, finalY + 9);

  doc.setFontSize(14);
  doc.setTextColor(...BRAND_ACCENT);
  doc.text(`INR ${netPay.toLocaleString()}`, pageW - 20, finalY + 9, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    `Gross: INR ${grossSalary.toLocaleString()}  |  Total Deductions: INR ${totalDeductions.toLocaleString()}`,
    22, finalY + 17
  );

  // ── Footer ────────────────────────────────────────────────────────────────
  drawFooter(doc);

  doc.save(`Payslip_${(employeeData.fullName || 'Employee').replace(/\s+/g, '_')}_${month}_${year}.pdf`);
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Generate and auto-download a professional payment invoice PDF.
 *
 * @param {object} payment  Payment record from /payments
 */
export function generateInvoicePDF(payment) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  const invoiceNo  = payment.id   || `INV-${Date.now()}`;
  const memberName = payment.user?.fullName || payment.fullName || 'Member';
  const amount     = payment.amount || 0;
  const gst        = Math.floor(amount * 0.18);
  const baseAmount = amount - gst;
  const date       = payment.paymentDate ? new Date(payment.paymentDate) : new Date();
  const status     = payment.paymentStatus || 'PENDING';

  // ── Header ────────────────────────────────────────────────────────────────
  drawHeader(doc, 'Tax Invoice', `Invoice No: ${invoiceNo}`);

  // ── Invoice meta ──────────────────────────────────────────────────────────
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(15, 58, pageW - 30, 36, 3, 3, 'F');

  infoRow(doc, 'BILLED TO',    memberName,                          22, 67);
  infoRow(doc, 'EMAIL',        payment.user?.email || payment.email || '—', 22, 80);
  infoRow(doc, 'INVOICE DATE', date.toLocaleDateString(),          120, 67);
  infoRow(doc, 'PAYMENT MODE', payment.paymentMethod || payment.paymentMode || 'Card', 120, 80);
  infoRow(doc, 'STATUS',       status,                             170, 67);

  const planDescription = payment.planName ? `Gym Membership (${payment.planName})` : 'Gym Membership Fee';

  // ── Line items table ───────────────────────────────────────────────────────
  autoTable(doc, {
    startY: 100,
    head: [['#', 'Description', 'Qty', 'Unit Price', 'Amount']],
    body: [
      ['01', planDescription,        '1', `INR ${baseAmount.toLocaleString()}`, `INR ${baseAmount.toLocaleString()}`],
      ['02', 'GST @ 18%',            '—', '—',                                `INR ${gst.toLocaleString()}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: BRAND_BLUE, textColor: WHITE, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: LIGHT_BG },
    columnStyles: { 0: { cellWidth: 12 }, 3: { halign: 'right' }, 4: { halign: 'right' } },
    margin: { left: 15, right: 15 },
  });

  // ── Total box ──────────────────────────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 8;

  doc.setFillColor(...BRAND_DARK);
  doc.roundedRect(15, finalY, pageW - 30, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...WHITE);
  doc.text('TOTAL AMOUNT DUE:', 22, finalY + 9);

  doc.setFontSize(14);
  doc.setTextColor(...BRAND_ACCENT);
  doc.text(`INR ${amount.toLocaleString()}`, pageW - 20, finalY + 9, { align: 'right' });

  // Status badge
  const badgeColor = status === 'SUCCESS' ? [16, 185, 129] : [245, 158, 11];
  doc.setFillColor(...badgeColor);
  doc.roundedRect(22, finalY + 12, 28, 6, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...WHITE);
  doc.text(status, 36, finalY + 16, { align: 'center' });

  // ── Footer ────────────────────────────────────────────────────────────────
  drawFooter(doc);

  doc.save(`Invoice_${invoiceNo}_${memberName.replace(/\s+/g, '_')}.pdf`);
}
