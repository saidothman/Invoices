export type PaymentStatus = 'draft' | 'open' | 'downpayment' | 'paid';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface BusinessProfile {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  logoUrl: string; // base64 or image url
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  routingOrIban: string;
  swiftBic: string;
  paymentTermsNote: string;
}

export type TemplateTheme = 'modern' | 'minimalist' | 'classic' | 'corporate';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientCityStateZip: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  items: InvoiceItem[];
  subtotalAmount: number;
  taxRate: number; // e.g. 10 for 10%
  taxAmount: number;
  totalAmount: number;
  downpaymentRequired: boolean;
  downpaymentType: 'fixed' | 'percentage';
  downpaymentValue: number;
  downpaymentAmount: number; // calculated deposit amount
  amountPaid: number; // actual amount paid so far
  status: PaymentStatus;
  notes: string;
  terms: string;
  templateTheme: TemplateTheme;
  driveFileId?: string;
  driveFileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleDriveUser {
  isSignedIn: boolean;
  email: string;
  name: string;
  picture: string;
  accessToken: string | null;
}
