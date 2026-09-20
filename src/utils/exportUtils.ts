import { Invoice, BusinessProfile } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports invoice list to CSV format.
 */
export function exportInvoicesToCSV(invoices: Invoice[]): void {
  const headers = [
    'Invoice Number',
    'Client Name',
    'Client Email',
    'Issue Date',
    'Due Date',
    'Status',
    'Subtotal',
    'Tax Rate (%)',
    'Tax Amount',
    'Total Amount',
    'Downpayment Required',
    'Downpayment Amount',
    'Amount Paid',
    'Balance Due',
    'Currency',
  ];

  const rows = invoices.map((inv) => {
    const balanceDue = Math.max(0, inv.totalAmount - (inv.amountPaid || 0));
    return [
      `"${inv.invoiceNumber}"`,
      `"${inv.clientName.replace(/"/g, '""')}"`,
      `"${(inv.clientEmail || '').replace(/"/g, '""')}"`,
      `"${inv.issueDate}"`,
      `"${inv.dueDate}"`,
      `"${inv.status.toUpperCase()}"`,
      inv.subtotalAmount.toFixed(2),
      inv.taxRate.toFixed(2),
      inv.taxAmount.toFixed(2),
      inv.totalAmount.toFixed(2),
      inv.downpaymentRequired ? 'YES' : 'NO',
      inv.downpaymentAmount.toFixed(2),
      inv.amountPaid.toFixed(2),
      balanceDue.toFixed(2),
      `"${inv.currency}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `invoices_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Renders an invoice element to high-res PDF Blob or triggers a browser download.
 */
export async function generateInvoicePdf(
  invoiceElementId: string,
  fileName: string,
  downloadDirectly = true
): Promise<{ blob: Blob; base64: string }> {
  const element = document.getElementById(invoiceElementId);
  if (!element) {
    throw new Error(`Element with id "${invoiceElementId}" not found`);
  }

  // Generate canvas with high pixel ratio for print sharpness
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  if (downloadDirectly) {
    pdf.save(`${fileName}.pdf`);
  }

  const blob = pdf.output('blob');
  const base64 = pdf.output('datauristring');

  return { blob, base64 };
}

/**
 * Format currency with locale precision
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}
