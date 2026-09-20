import initSqlJs, { Database } from 'sql.js';
import { Invoice, BusinessProfile } from './types';
import { SQL_WASM_BASE64 } from './sqlWasmBase64';

let dbInstance: Database | null = null;
const SQL_STORAGE_KEY = 'invoiceflow_sqlite_db';
const PROFILE_STORAGE_KEY = 'invoiceflow_business_profile';

// Helper to convert base64 to ArrayBuffer for WebAssembly
function getWasmBinaryBuffer(): ArrayBuffer {
  const binaryString = atob(SQL_WASM_BASE64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Default business profile
export const defaultProfile: BusinessProfile = {
  companyName: 'Apex Creative Studio LLC',
  ownerName: 'Alex Reynolds',
  email: 'billing@apexstudio.io',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace, Suite 400',
  cityStateZip: 'San Francisco, CA 94107',
  logoUrl: '',
  bankName: 'Silicon Valley Commercial Bank',
  accountHolder: 'Apex Creative Studio LLC',
  accountNumber: '•••••••• 4829',
  routingOrIban: 'US89BANK01234567894829',
  swiftBic: 'SVBKUS33XXX',
  paymentTermsNote: 'Payment due within 30 days of issue date. Late balances are subject to a 1.5% monthly fee.',
};

/**
 * Initializes sql.js in-memory database and restores persisted state from localStorage.
 */
export async function getDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  let SQL: any;
  try {
    const wasmBinary = getWasmBinaryBuffer();
    SQL = await initSqlJs({ wasmBinary });
  } catch (wasmErr) {
    console.warn('Wasm binary direct buffer failed, trying locateFile...', wasmErr);
    SQL = await initSqlJs({
      locateFile: (file) => `/${file}`,
    }).catch(async () => {
      return await initSqlJs({
        locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
      });
    });
  }

  let db: Database;
  const savedDbBase64 = localStorage.getItem(SQL_STORAGE_KEY);
  if (savedDbBase64) {
    try {
      const binaryString = atob(savedDbBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      db = new SQL.Database(bytes);
    } catch (e) {
      console.warn('Failed to load saved SQLite database, creating new one', e);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Ensure tables exist
  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      invoiceNumber TEXT NOT NULL,
      clientName TEXT NOT NULL,
      clientEmail TEXT,
      clientAddress TEXT,
      clientCityStateZip TEXT,
      issueDate TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      currency TEXT DEFAULT 'USD',
      itemsJson TEXT NOT NULL,
      subtotalAmount REAL NOT NULL,
      taxRate REAL NOT NULL,
      taxAmount REAL NOT NULL,
      totalAmount REAL NOT NULL,
      downpaymentRequired INTEGER DEFAULT 0,
      downpaymentType TEXT DEFAULT 'percentage',
      downpaymentValue REAL DEFAULT 0,
      downpaymentAmount REAL DEFAULT 0,
      amountPaid REAL DEFAULT 0,
      status TEXT NOT NULL,
      notes TEXT,
      terms TEXT,
      templateTheme TEXT DEFAULT 'modern',
      driveFileId TEXT,
      driveFileUrl TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // Seed sample invoices if empty
  const countRes = db.exec('SELECT COUNT(*) as count FROM invoices');
  const count = countRes[0]?.values[0]?.[0] as number;

  if (count === 0) {
    seedInitialInvoices(db);
  }

  dbInstance = db;
  return dbInstance;
}

export function saveDatabaseToStorage(db: Database) {
  try {
    const data = db.export();
    let binary = '';
    const len = data.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(data[i]);
    }
    const base64 = btoa(binary);
    localStorage.setItem(SQL_STORAGE_KEY, base64);
  } catch (err) {
    console.error('Error saving SQLite DB to local storage:', err);
  }
}

export async function fetchAllInvoices(): Promise<Invoice[]> {
  const db = await getDatabase();
  const stmt = db.prepare('SELECT * FROM invoices ORDER BY issueDate DESC, createdAt DESC');
  const invoices: Invoice[] = [];

  while (stmt.step()) {
    const row = stmt.getAsObject();
    invoices.push({
      id: String(row.id),
      invoiceNumber: String(row.invoiceNumber),
      clientName: String(row.clientName),
      clientEmail: String(row.clientEmail || ''),
      clientAddress: String(row.clientAddress || ''),
      clientCityStateZip: String(row.clientCityStateZip || ''),
      issueDate: String(row.issueDate),
      dueDate: String(row.dueDate),
      currency: String(row.currency || 'USD'),
      items: JSON.parse(String(row.itemsJson || '[]')),
      subtotalAmount: Number(row.subtotalAmount || 0),
      taxRate: Number(row.taxRate || 0),
      taxAmount: Number(row.taxAmount || 0),
      totalAmount: Number(row.totalAmount || 0),
      downpaymentRequired: Boolean(row.downpaymentRequired),
      downpaymentType: (row.downpaymentType as 'fixed' | 'percentage') || 'percentage',
      downpaymentValue: Number(row.downpaymentValue || 0),
      downpaymentAmount: Number(row.downpaymentAmount || 0),
      amountPaid: Number(row.amountPaid || 0),
      status: row.status as Invoice['status'],
      notes: String(row.notes || ''),
      terms: String(row.terms || ''),
      templateTheme: (row.templateTheme as Invoice['templateTheme']) || 'modern',
      driveFileId: row.driveFileId ? String(row.driveFileId) : undefined,
      driveFileUrl: row.driveFileUrl ? String(row.driveFileUrl) : undefined,
      createdAt: String(row.createdAt),
      updatedAt: String(row.updatedAt),
    });
  }
  stmt.free();
  return invoices;
}

export async function saveInvoiceToDb(invoice: Invoice): Promise<void> {
  const db = await getDatabase();
  const itemsJson = JSON.stringify(invoice.items);

  const query = `
    INSERT OR REPLACE INTO invoices (
      id, invoiceNumber, clientName, clientEmail, clientAddress, clientCityStateZip,
      issueDate, dueDate, currency, itemsJson, subtotalAmount, taxRate, taxAmount,
      totalAmount, downpaymentRequired, downpaymentType, downpaymentValue,
      downpaymentAmount, amountPaid, status, notes, terms, templateTheme,
      driveFileId, driveFileUrl, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  db.run(query, [
    invoice.id,
    invoice.invoiceNumber,
    invoice.clientName,
    invoice.clientEmail,
    invoice.clientAddress,
    invoice.clientCityStateZip,
    invoice.issueDate,
    invoice.dueDate,
    invoice.currency,
    itemsJson,
    invoice.subtotalAmount,
    invoice.taxRate,
    invoice.taxAmount,
    invoice.totalAmount,
    invoice.downpaymentRequired ? 1 : 0,
    invoice.downpaymentType,
    invoice.downpaymentValue,
    invoice.downpaymentAmount,
    invoice.amountPaid,
    invoice.status,
    invoice.notes,
    invoice.terms,
    invoice.templateTheme,
    invoice.driveFileId || null,
    invoice.driveFileUrl || null,
    invoice.createdAt,
    invoice.updatedAt,
  ]);

  saveDatabaseToStorage(db);
}

export async function deleteInvoiceFromDb(id: string): Promise<void> {
  const db = await getDatabase();
  db.run('DELETE FROM invoices WHERE id = ?', [id]);
  saveDatabaseToStorage(db);
}

export async function updateInvoiceStatusInDb(id: string, status: Invoice['status'], amountPaid?: number): Promise<void> {
  const db = await getDatabase();
  if (amountPaid !== undefined) {
    db.run('UPDATE invoices SET status = ?, amountPaid = ?, updatedAt = ? WHERE id = ?', [
      status,
      amountPaid,
      new Date().toISOString(),
      id,
    ]);
  } else {
    db.run('UPDATE invoices SET status = ?, updatedAt = ? WHERE id = ?', [
      status,
      new Date().toISOString(),
      id,
    ]);
  }
  saveDatabaseToStorage(db);
}

export async function updateInvoiceDriveBackupInDb(id: string, fileId: string, fileUrl: string): Promise<void> {
  const db = await getDatabase();
  db.run('UPDATE invoices SET driveFileId = ?, driveFileUrl = ?, updatedAt = ? WHERE id = ?', [
    fileId,
    fileUrl,
    new Date().toISOString(),
    id,
  ]);
  saveDatabaseToStorage(db);
}

export function loadBusinessProfile(): BusinessProfile {
  try {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading business profile', e);
  }
  return defaultProfile;
}

export function saveBusinessProfile(profile: BusinessProfile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving business profile', e);
  }
}

function seedInitialInvoices(db: Database) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const sample1: Invoice = {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-001',
    clientName: 'Meridian Logistics Inc.',
    clientEmail: 'accounts@meridianlogistics.com',
    clientAddress: '100 Harbor Boulevard, Floor 12',
    clientCityStateZip: 'Seattle, WA 98104',
    issueDate: todayStr,
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    currency: 'USD',
    items: [
      { id: '1', description: 'Enterprise UI/UX Design System Redesign', quantity: 1, unitPrice: 3200, subtotal: 3200 },
      { id: '2', description: 'Frontend React Component Architecture', quantity: 40, unitPrice: 95, subtotal: 3800 },
      { id: '3', description: 'Quality Assurance & Cross-Browser Audit', quantity: 1, unitPrice: 650, subtotal: 650 },
    ],
    subtotalAmount: 7650,
    taxRate: 8.5,
    taxAmount: 650.25,
    totalAmount: 8300.25,
    downpaymentRequired: true,
    downpaymentType: 'percentage',
    downpaymentValue: 30,
    downpaymentAmount: 2490.08,
    amountPaid: 2490.08,
    status: 'downpayment',
    notes: 'Thanks for choosing Apex Creative Studio. Deposit received; remainder due upon final deliverables.',
    terms: 'Net 14 payment terms apply.',
    templateTheme: 'modern',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  };

  const sample2: Invoice = {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-002',
    clientName: 'Horizon Fintech Labs',
    clientEmail: 'billing@horizonfintech.io',
    clientAddress: '450 Mission St, 8th Floor',
    clientCityStateZip: 'San Francisco, CA 94105',
    issueDate: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
    dueDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    currency: 'USD',
    items: [
      { id: '1', description: 'Realtime Data Pipeline & WebSocket Bridge', quantity: 1, unitPrice: 4500, subtotal: 4500 },
      { id: '2', description: 'Security Hardening & Penetration Verification', quantity: 1, unitPrice: 1200, subtotal: 1200 },
    ],
    subtotalAmount: 5700,
    taxRate: 9.0,
    taxAmount: 513.0,
    totalAmount: 6213.0,
    downpaymentRequired: false,
    downpaymentType: 'percentage',
    downpaymentValue: 0,
    downpaymentAmount: 0,
    amountPaid: 6213.0,
    status: 'paid',
    notes: 'Paid in full via ACH Direct Transfer. Thank you for your partnership!',
    terms: 'Payment settled.',
    templateTheme: 'classic',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  };

  const sample3: Invoice = {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-003',
    clientName: 'Beacon Healthcare Solutions',
    clientEmail: 'finance@beaconmed.org',
    clientAddress: '88 Commonwealth Ave',
    clientCityStateZip: 'Boston, MA 02116',
    issueDate: todayStr,
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    currency: 'USD',
    items: [
      { id: '1', description: 'Patient Portal Accessibility Compliance (WCAG 2.1 AA)', quantity: 1, unitPrice: 2800, subtotal: 2800 },
      { id: '2', description: 'Custom Appointment Booking Workflow Integration', quantity: 18, unitPrice: 110, subtotal: 1980 },
    ],
    subtotalAmount: 4780,
    taxRate: 6.25,
    taxAmount: 298.75,
    totalAmount: 5078.75,
    downpaymentRequired: true,
    downpaymentType: 'fixed',
    downpaymentValue: 1500,
    downpaymentAmount: 1500,
    amountPaid: 0,
    status: 'open',
    notes: 'Please submit the downpayment of $1,500.00 prior to sprint kickoff.',
    terms: 'Deposit required prior to start. Balance due Net 30 upon completion.',
    templateTheme: 'corporate',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sample4: Invoice = {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-004',
    clientName: 'Solaria Solar Energy Co.',
    clientEmail: 'invoices@solariapower.com',
    clientAddress: '1200 Sunshine Blvd',
    clientCityStateZip: 'Tempe, AZ 85281',
    issueDate: new Date(Date.now() - 45 * 86400000).toISOString().split('T')[0],
    dueDate: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
    currency: 'USD',
    items: [
      { id: '1', description: 'Commercial Solar Quotation Calculator Engine', quantity: 1, unitPrice: 3400, subtotal: 3400 },
    ],
    subtotalAmount: 3400,
    taxRate: 7.5,
    taxAmount: 255.0,
    totalAmount: 3655.0,
    downpaymentRequired: false,
    downpaymentType: 'percentage',
    downpaymentValue: 0,
    downpaymentAmount: 0,
    amountPaid: 3655.0,
    status: 'paid',
    notes: 'Full payment received with gratitude.',
    terms: 'Paid.',
    templateTheme: 'minimalist',
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  };

  const invoicesToSeed = [sample1, sample2, sample3, sample4];
  for (const inv of invoicesToSeed) {
    db.run(`
      INSERT INTO invoices (
        id, invoiceNumber, clientName, clientEmail, clientAddress, clientCityStateZip,
        issueDate, dueDate, currency, itemsJson, subtotalAmount, taxRate, taxAmount,
        totalAmount, downpaymentRequired, downpaymentType, downpaymentValue,
        downpaymentAmount, amountPaid, status, notes, terms, templateTheme,
        driveFileId, driveFileUrl, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [
      inv.id,
      inv.invoiceNumber,
      inv.clientName,
      inv.clientEmail,
      inv.clientAddress,
      inv.clientCityStateZip,
      inv.issueDate,
      inv.dueDate,
      inv.currency,
      JSON.stringify(inv.items),
      inv.subtotalAmount,
      inv.taxRate,
      inv.taxAmount,
      inv.totalAmount,
      inv.downpaymentRequired ? 1 : 0,
      inv.downpaymentType,
      inv.downpaymentValue,
      inv.downpaymentAmount,
      inv.amountPaid,
      inv.status,
      inv.notes,
      inv.terms,
      inv.templateTheme,
      null,
      null,
      inv.createdAt,
      inv.updatedAt,
    ]);
  }

  saveDatabaseToStorage(db);
}
