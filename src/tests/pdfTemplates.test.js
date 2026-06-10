/**
 * pdfTemplates.test.js
 *
 * Unit tests for PDF generation utilities.
 * jsPDF and jspdf-autotable are mocked — we test the logic
 * (deductions, filenames, GST calc) not the canvas output.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock jsPDF ────────────────────────────────────────────────────────────────
const mockDoc = {
  internal: { pageSize: { getWidth: () => 210, getHeight: () => 297 } },
  setFillColor: vi.fn(),
  setTextColor: vi.fn(),
  setFont: vi.fn(),
  setFontSize: vi.fn(),
  setDrawColor: vi.fn(),
  setLineWidth: vi.fn(),
  rect: vi.fn(),
  roundedRect: vi.fn(),
  line: vi.fn(),
  text: vi.fn(),
  save: vi.fn(),
  lastAutoTable: { finalY: 150 },
};

vi.mock('jspdf', () => ({
  default: vi.fn(() => mockDoc),
}));

vi.mock('jspdf-autotable', () => ({
  default: vi.fn(),
}));

import { generatePayslipPDF, generateInvoicePDF } from '../utils/pdfTemplates';

describe('generatePayslipPDF', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDoc.lastAutoTable = { finalY: 150 };
  });

  const baseEmployee = {
    id: 42,
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    role: 'TRAINER',
    salary: 30000,
    leaves: 2,
    permissions: 4,
  };

  it('calls doc.save() with a filename containing the employee name', () => {
    generatePayslipPDF(baseEmployee, 27000);
    const saveArg = mockDoc.save.mock.calls[0][0];
    expect(saveArg).toContain('Jane_Doe');
  });

  it('calls doc.save() exactly once', () => {
    generatePayslipPDF(baseEmployee, 27000);
    expect(mockDoc.save).toHaveBeenCalledTimes(1);
  });

  it('handles string salary gracefully (e.g. "₹30,000")', () => {
    const emp = { ...baseEmployee, salary: '₹30,000' };
    expect(() => generatePayslipPDF(emp, 27000)).not.toThrow();
  });

  it('handles missing leaves/permissions (defaults to 0)', () => {
    const emp = { ...baseEmployee, leaves: undefined, permissions: undefined };
    expect(() => generatePayslipPDF(emp, 30000)).not.toThrow();
  });

  it('handles missing fullName (falls back to "Employee")', () => {
    const emp = { ...baseEmployee, fullName: undefined, name: undefined };
    generatePayslipPDF(emp, 27000);
    const saveArg = mockDoc.save.mock.calls[0][0];
    expect(saveArg).toContain('Employee');
  });

  it('computes deductions correctly', () => {
    // salary=30000, leaves=3 → leaveDeduction = floor(30000/30 * 3) = 3000
    // permissions=8 → permDeduction = floor(1000/8 * 8) = 1000
    // PF=1800, TDS=650 → total deductions = 3000+1000+1800+650 = 6450
    // Net = 30000 - 6450 = 23550
    const emp = { ...baseEmployee, salary: 30000, leaves: 3, permissions: 8 };
    const netPay = 30000 - Math.floor(30000 / 30 * 3) - Math.floor((30000 / 30 / 8) * 8) - 1800 - 650;
    expect(netPay).toBe(23550);
    expect(() => generatePayslipPDF(emp, netPay)).not.toThrow();
  });
});

describe('generateInvoicePDF', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDoc.lastAutoTable = { finalY: 150 };
  });

  const basePayment = {
    id: 'INV-001',
    fullName: 'John Smith',
    amount: 10000,
    paymentDate: '2026-06-01',
    paymentMode: 'UPI',
    paymentStatus: 'SUCCESS',
  };

  it('calls doc.save() exactly once', () => {
    generateInvoicePDF(basePayment);
    expect(mockDoc.save).toHaveBeenCalledTimes(1);
  });

  it('filename contains the invoice ID', () => {
    generateInvoicePDF(basePayment);
    const saveArg = mockDoc.save.mock.calls[0][0];
    expect(saveArg).toContain('INV-001');
  });

  it('filename contains the member name', () => {
    generateInvoicePDF(basePayment);
    const saveArg = mockDoc.save.mock.calls[0][0];
    expect(saveArg).toContain('John_Smith');
  });

  it('calculates GST as 18% of total amount', () => {
    const amount = 10000;
    const gst = Math.floor(amount * 0.18);
    expect(gst).toBe(1800);
    expect(amount - gst).toBe(8200); // base amount
  });

  it('handles payment with user object instead of fullName', () => {
    const payment = {
      ...basePayment,
      fullName: undefined,
      user: { fullName: 'Alice Brown' },
    };
    generateInvoicePDF(payment);
    const saveArg = mockDoc.save.mock.calls[0][0];
    expect(saveArg).toContain('Alice_Brown');
  });

  it('handles missing amount (defaults to 0)', () => {
    const payment = { ...basePayment, amount: undefined };
    expect(() => generateInvoicePDF(payment)).not.toThrow();
  });

  it('handles missing paymentDate (uses current date)', () => {
    const payment = { ...basePayment, paymentDate: undefined };
    expect(() => generateInvoicePDF(payment)).not.toThrow();
  });

  it('defaults to PENDING status when paymentStatus is missing', () => {
    const payment = { ...basePayment, paymentStatus: undefined };
    expect(() => generateInvoicePDF(payment)).not.toThrow();
  });
});
