import React, { useState } from 'react';
import { Invoice, BusinessProfile, GoogleDriveUser } from '../types';
import { InvoicePreviewDocument } from './InvoicePreviewDocument';
import { generateInvoicePdf, formatCurrency } from '../utils/exportUtils';
import { uploadInvoicePdfToDrive } from '../services/googleDriveService';
import {
  FileDown,
  Cloud,
  ArrowLeft,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react';

interface InvoiceViewModalProps {
  invoice: Invoice;
  profile: BusinessProfile;
  driveUser: GoogleDriveUser;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: (status: Invoice['status'], amountPaid?: number) => void;
  onDriveUploaded: (invoiceId: string, driveFileId: string, driveFileUrl: string) => void;
  onRequestGoogleLogin: () => void;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  invoice,
  profile,
  driveUser,
  onClose,
  onEdit,
  onStatusChange,
  onDriveUploaded,
  onRequestGoogleLogin,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [driveSuccessMsg, setDriveSuccessMsg] = useState<string | null>(null);
  const [driveError, setDriveError] = useState<string | null>(null);

  const documentElementId = `invoice-render-${invoice.id}`;

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      await generateInvoicePdf(
        documentElementId,
        `${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}`
      );
    } catch (err: any) {
      console.error('PDF export failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToGoogleDrive = async () => {
    if (!driveUser.isSignedIn || !driveUser.accessToken) {
      onRequestGoogleLogin();
      return;
    }

    try {
      setIsUploadingToDrive(true);
      setDriveError(null);
      setDriveSuccessMsg(null);

      // Generate PDF Blob
      const { blob } = await generateInvoicePdf(
        documentElementId,
        `${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}`,
        false // Do not trigger browser download
      );

      const driveResult = await uploadInvoicePdfToDrive(
        driveUser.accessToken,
        blob,
        `${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}`,
        `Invoice ${invoice.invoiceNumber} for ${invoice.clientName} - Amount: ${invoice.totalAmount} ${invoice.currency}`
      );

      onDriveUploaded(invoice.id, driveResult.id, driveResult.webViewLink);
      setDriveSuccessMsg('Saved to Google Drive in folder "InvoiceFlow Invoices"!');
      setTimeout(() => setDriveSuccessMsg(null), 6000);
    } catch (err: any) {
      console.error('Drive upload failed:', err);
      setDriveError(err.message || 'Google Drive upload failed. Please re-authenticate.');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 font-mono">
                {invoice.invoiceNumber}
              </h2>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-700">{invoice.clientName}</span>
            </div>
            <p className="text-xs text-slate-500">
              Total: {formatCurrency(invoice.totalAmount, invoice.currency)} • Due: {invoice.dueDate}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Quick Switchers */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs mr-2">
            <button
              onClick={() => onStatusChange('open', 0)}
              className={`px-2.5 py-1 rounded font-medium transition ${
                invoice.status === 'open'
                  ? 'bg-white text-amber-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Open
            </button>
            {invoice.downpaymentRequired && (
              <button
                onClick={() => onStatusChange('downpayment', invoice.downpaymentAmount)}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  invoice.status === 'downpayment'
                    ? 'bg-white text-sky-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Downpayment
              </button>
            )}
            <button
              onClick={() => onStatusChange('paid', invoice.totalAmount)}
              className={`px-2.5 py-1 rounded font-medium transition ${
                invoice.status === 'paid'
                  ? 'bg-white text-emerald-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paid
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" /> Download PDF
              </>
            )}
          </button>

          <button
            onClick={handleSaveToGoogleDrive}
            disabled={isUploadingToDrive}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {isUploadingToDrive ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Backing up to Drive...
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5" /> Sync to Google Drive
              </>
            )}
          </button>

          <button
            onClick={onEdit}
            className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Cloud Sync Notifications */}
      {driveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-fade-in print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{driveSuccessMsg}</span>
          </div>
          {invoice.driveFileUrl && (
            <a
              href={invoice.driveFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline flex items-center gap-1"
            >
              Open in Drive <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {driveError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 print:hidden">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{driveError}</span>
        </div>
      )}

      {/* Render Document */}
      <div className="overflow-x-auto pb-12 flex justify-center">
        <InvoicePreviewDocument
          invoice={invoice}
          profile={profile}
          previewId={documentElementId}
        />
      </div>
    </div>
  );
};
