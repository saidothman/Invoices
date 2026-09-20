import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'de';

export interface Translations {
  // Navigation & General
  appTitle: string;
  appSubtitle: string;
  navDashboard: string;
  navInvoices: string;
  navCompanyBank: string;
  createInvoice: string;
  driveConnected: string;
  googleDrive: string;
  close: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  loading: string;
  languageName: string;
  switchLanguage: string;

  // Statuses
  statusDraft: string;
  statusOpen: string;
  statusDownpayment: string;
  statusPaid: string;
  statusAll: string;

  // Dashboard
  dashCollectedRevenue: string;
  dashTotalInvoiced: string;
  dashPendingBalance: string;
  dashInvoicesOverview: string;
  dashPaidCount: string;
  dashDownpaymentCount: string;
  dashOpenCount: string;
  dashInflowTrends: string;
  dashMonthlySubtitle: string;
  dashRecentInvoices: string;
  dashViewAll: string;
  dashNoInvoices: string;
  dashQuickActions: string;
  dashExportCsvTitle: string;
  dashExportCsvDesc: string;
  dashConfigureBankTitle: string;
  dashConfigureBankDesc: string;
  dashDriveBackupTitle: string;
  dashDriveBackupDesc: string;
  dashLegendInvoiced: string;
  dashLegendCollected: string;
  dashLegendPending: string;
  dashAllCollected: string;
  dashAwaitingCollection: string;
  dashHealthyRatio: string;

  // Invoices List
  invListTitle: string;
  invListSubtitle: string;
  invListExportCsv: string;
  invListNewInvoice: string;
  invListSearchPlaceholder: string;
  invListSortNewest: string;
  invListSortOldest: string;
  invListSortHighest: string;
  invListSortLowest: string;
  invListColNumber: string;
  invListColClient: string;
  invListColDates: string;
  invListColTotal: string;
  invListColBalance: string;
  invListColStatus: string;
  invListColActions: string;
  invListIssued: string;
  invListDue: string;
  invListNoResults: string;
  invListNoResultsDesc: string;
  invListCreateFirst: string;
  invListDeleteConfirm: string;
  invListViewTooltip: string;
  invListEditTooltip: string;
  invListDeleteTooltip: string;
  invListDriveSaved: string;

  // Invoice Form
  formTitleNew: string;
  formTitleEdit: string;
  formSubtitle: string;
  formClientInfo: string;
  formClientName: string;
  formClientNamePlaceholder: string;
  formClientEmail: string;
  formClientEmailPlaceholder: string;
  formClientAddress: string;
  formClientAddressPlaceholder: string;
  formClientCityStateZip: string;
  formClientCityStateZipPlaceholder: string;
  formInvoiceDetails: string;
  formInvoiceNumber: string;
  formIssueDate: string;
  formDueDate: string;
  formCurrency: string;
  formStatus: string;
  formTheme: string;
  formThemeModern: string;
  formThemeMinimalist: string;
  formThemeClassic: string;
  formThemeCorporate: string;
  formLineItems: string;
  formColDescription: string;
  formColQty: string;
  formColPrice: string;
  formColTotal: string;
  formAddItem: string;
  formFinancialSummary: string;
  formSubtotal: string;
  formTaxRate: string;
  formTaxAmount: string;
  formTotalAmount: string;
  formDownpaymentSection: string;
  formRequireDownpayment: string;
  formDownpaymentHelp: string;
  formDownpaymentType: string;
  formDownpaymentPercentage: string;
  formDownpaymentFixed: string;
  formDownpaymentValue: string;
  formCalculatedDeposit: string;
  formAmountPaid: string;
  formBalanceDue: string;
  formTermsAndNotes: string;
  formClientNotes: string;
  formClientNotesPlaceholder: string;
  formPaymentTerms: string;
  formPaymentTermsPlaceholder: string;
  formSaveInvoice: string;
  formSaveSuccess: string;

  // Invoice View Modal
  viewModalTitle: string;
  viewModalBack: string;
  viewModalEdit: string;
  viewModalPrint: string;
  viewModalDownloadPdf: string;
  viewModalGeneratingPdf: string;
  viewModalSaveToDrive: string;
  viewModalSavingToDrive: string;
  viewModalSavedToDrive: string;
  viewModalDriveBackupNotice: string;
  viewModalPaymentActions: string;
  viewModalMarkPaid: string;
  viewModalMarkDownpayment: string;
  viewModalRevertOpen: string;
  viewModalRecordCustomPayment: string;
  viewModalRecordPaymentPrompt: string;
  viewModalInvalidAmount: string;

  // Invoice Document (for Print / PDF / View)
  docInvoice: string;
  docInvoiceNo: string;
  docDate: string;
  docDueDate: string;
  docBilledTo: string;
  docDescription: string;
  docQty: string;
  docRate: string;
  docAmount: string;
  docSubtotal: string;
  docTax: string;
  docTotal: string;
  docDepositRequired: string;
  docAmountPaid: string;
  docBalanceDue: string;
  docPaidInFullBadge: string;
  docDepositReceivedBadge: string;
  docPaymentOpenBadge: string;
  docPaymentInstructions: string;
  docBank: string;
  docAccountHolder: string;
  docIbanOrAccount: string;
  docBicSwift: string;
  docPaymentTermsNote: string;
  docThankYou: string;

  // Business Profile Settings
  profTitle: string;
  profSubtitle: string;
  profSavedSuccess: string;
  profSaveButton: string;
  profCompanyBranding: string;
  profLogo: string;
  profNoLogo: string;
  profRemoveLogo: string;
  profUploadLogo: string;
  profLogoHint: string;
  profCompanyName: string;
  profOwnerName: string;
  profBillingEmail: string;
  profPhone: string;
  profBusinessAddress: string;
  profCityStateZip: string;
  profBankingTitle: string;
  profBankName: string;
  profAccountHolder: string;
  profAccountNumber: string;
  profIban: string;
  profSwiftBic: string;
  profPaymentTermsDefault: string;
  profPaymentTermsDefaultHint: string;

  // Google Drive Modal
  driveModalTitle: string;
  driveModalSubtitle: string;
  driveModalConnectedTitle: string;
  driveModalSyncNotice: string;
  driveModalDisconnect: string;
  driveModalDesc: string;
  driveModalSignInButton: string;
  driveModalSigningIn: string;
  driveModalTokenOption: string;
  driveModalTokenButton: string;
  driveModalTokenPlaceholder: string;

  // Extra helper keys
  navCompany: string;
  driveBtn: string;
  dbLoading: string;
  dbNoticeTitle: string;
  dbRetry: string;
  profSaveSuccess: string;
  profSaveBtn: string;
  profCompanySection: string;
  profEmail: string;
  profAddress: string;
  profBankSection: string;
  profBankSectionHint: string;
  profPaymentTerms: string;
  driveConnectedMsg: string;
  driveDisconnect: string;
  driveSigningIn: string;
  driveSignInBtn: string;
  viewModalDriveSuccess: string;
  viewModalBackingUp: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation & General
    appTitle: 'InvoiceFlow',
    appSubtitle: 'Small Business Billing & Drive Sync',
    navDashboard: 'Dashboard',
    navInvoices: 'Invoices',
    navCompanyBank: 'Company & Bank',
    createInvoice: 'Create Invoice',
    driveConnected: 'Drive Connected',
    googleDrive: 'Google Drive',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading SQLite database & records...',
    languageName: 'English',
    switchLanguage: 'Language',

    // Statuses
    statusDraft: 'Draft',
    statusOpen: 'Open',
    statusDownpayment: 'Downpayment',
    statusPaid: 'Paid',
    statusAll: 'All Statuses',

    // Dashboard
    dashCollectedRevenue: 'Collected Revenue',
    dashTotalInvoiced: 'Invoiced Total',
    dashPendingBalance: 'Pending Balance',
    dashInvoicesOverview: 'Invoices Overview',
    dashPaidCount: 'Paid',
    dashDownpaymentCount: 'Downpayment',
    dashOpenCount: 'Open',
    dashInflowTrends: 'Financial Inflow Trends',
    dashMonthlySubtitle: '6-Month Invoicing vs Revenue Cashflow',
    dashRecentInvoices: 'Recent Invoices',
    dashViewAll: 'View all',
    dashNoInvoices: 'No invoices generated yet. Create your first invoice to populate statistics.',
    dashQuickActions: 'Quick Actions',
    dashExportCsvTitle: 'Export Accounting CSV',
    dashExportCsvDesc: 'Download raw spreadsheet of all records',
    dashConfigureBankTitle: 'Configure Banking',
    dashConfigureBankDesc: 'Update account holder, IBAN & payment terms',
    dashDriveBackupTitle: 'Google Drive Backup',
    dashDriveBackupDesc: 'Sync PDF copies directly to your cloud folder',
    dashLegendInvoiced: 'Invoiced',
    dashLegendCollected: 'Collected',
    dashLegendPending: 'Pending',
    dashAllCollected: '100% Collected',
    dashAwaitingCollection: 'Awaiting Collection',
    dashHealthyRatio: 'Healthy Cashflow Ratio',

    // Invoices List
    invListTitle: 'Invoices Database',
    invListSubtitle: 'Real-time indexed SQLite invoices storage with status filtering, downpayments, and cloud drive sync.',
    invListExportCsv: 'Export CSV',
    invListNewInvoice: 'New Invoice',
    invListSearchPlaceholder: 'Search by invoice #, client, email...',
    invListSortNewest: 'Newest First',
    invListSortOldest: 'Oldest First',
    invListSortHighest: 'Highest Amount',
    invListSortLowest: 'Lowest Amount',
    invListColNumber: 'Invoice #',
    invListColClient: 'Client',
    invListColDates: 'Dates',
    invListColTotal: 'Total',
    invListColBalance: 'Balance Due',
    invListColStatus: 'Status',
    invListColActions: 'Actions',
    invListIssued: 'Issued',
    invListDue: 'Due',
    invListNoResults: 'No invoices match your filter or search query.',
    invListNoResultsDesc: 'Try adjusting your search criteria or create a new invoice.',
    invListCreateFirst: 'Create your first invoice',
    invListDeleteConfirm: 'Are you sure you want to delete invoice',
    invListViewTooltip: 'View & Print Invoice',
    invListEditTooltip: 'Edit Invoice Details',
    invListDeleteTooltip: 'Delete Invoice',
    invListDriveSaved: 'Drive Backup',

    // Invoice Form
    formTitleNew: 'Create New Invoice',
    formTitleEdit: 'Edit Invoice',
    formSubtitle: 'Fill in client details, invoice line items, tax rate, and deposit requirements.',
    formClientInfo: 'Client Information',
    formClientName: 'Client Name / Business *',
    formClientNamePlaceholder: 'Acme Corporation or Jane Doe',
    formClientEmail: 'Client Email',
    formClientEmailPlaceholder: 'accounts@client.com',
    formClientAddress: 'Street Address',
    formClientAddressPlaceholder: '123 Business Way, Suite 100',
    formClientCityStateZip: 'City, State, Zip Code',
    formClientCityStateZipPlaceholder: 'New York, NY 10001',
    formInvoiceDetails: 'Invoice Details & Formatting',
    formInvoiceNumber: 'Invoice Number *',
    formIssueDate: 'Issue Date *',
    formDueDate: 'Due Date *',
    formCurrency: 'Currency',
    formStatus: 'Payment Status',
    formTheme: 'Template Theme',
    formThemeModern: 'Modern Indigo',
    formThemeMinimalist: 'Minimalist Clean',
    formThemeClassic: 'Classic Serif',
    formThemeCorporate: 'Corporate Slate',
    formLineItems: 'Line Items',
    formColDescription: 'Item Description',
    formColQty: 'Qty',
    formColPrice: 'Unit Price',
    formColTotal: 'Total',
    formAddItem: 'Add Item',
    formFinancialSummary: 'Financial Summary',
    formSubtotal: 'Subtotal',
    formTaxRate: 'Tax Rate (%)',
    formTaxAmount: 'Tax Amount',
    formTotalAmount: 'Total Amount',
    formDownpaymentSection: 'Downpayment & Deposit Terms',
    formRequireDownpayment: 'Require upfront deposit / downpayment',
    formDownpaymentHelp: 'Ideal for retainer projects or upfront milestone commits.',
    formDownpaymentType: 'Downpayment Calculation',
    formDownpaymentPercentage: 'Percentage (%)',
    formDownpaymentFixed: 'Fixed Amount',
    formDownpaymentValue: 'Deposit Value',
    formCalculatedDeposit: 'Calculated Deposit',
    formAmountPaid: 'Amount Paid to Date',
    formBalanceDue: 'Remaining Balance Due',
    formTermsAndNotes: 'Notes & Payment Terms',
    formClientNotes: 'Notes for Client',
    formClientNotesPlaceholder: 'Thank you for your business...',
    formPaymentTerms: 'Payment Terms & Bank Instructions',
    formPaymentTermsPlaceholder: 'Payment due within 14 days of invoice date...',
    formSaveInvoice: 'Save Invoice',
    formSaveSuccess: 'Invoice saved successfully!',

    // Invoice View Modal
    viewModalTitle: 'Invoice Details',
    viewModalBack: 'Back',
    viewModalEdit: 'Edit',
    viewModalPrint: 'Print',
    viewModalDownloadPdf: 'Download PDF',
    viewModalGeneratingPdf: 'Generating PDF...',
    viewModalSaveToDrive: 'Save to Google Drive',
    viewModalSavingToDrive: 'Saving to Drive...',
    viewModalSavedToDrive: 'Saved to Drive',
    viewModalDriveBackupNotice: 'Saved to Google Drive in folder "InvoiceFlow Invoices"!',
    viewModalPaymentActions: 'Quick Payment Actions',
    viewModalMarkPaid: 'Mark as Fully Paid',
    viewModalMarkDownpayment: 'Mark Deposit as Received',
    viewModalRevertOpen: 'Revert to Open',
    viewModalRecordCustomPayment: 'Record Custom Payment',
    viewModalRecordPaymentPrompt: 'Enter the total amount paid so far:',
    viewModalInvalidAmount: 'Please enter a valid non-negative number.',

    // Invoice Document (for Print / PDF / View)
    docInvoice: 'INVOICE',
    docInvoiceNo: 'Invoice No.',
    docDate: 'Date',
    docDueDate: 'Due Date',
    docBilledTo: 'BILLED TO',
    docDescription: 'DESCRIPTION',
    docQty: 'QTY',
    docRate: 'RATE',
    docAmount: 'AMOUNT',
    docSubtotal: 'Subtotal',
    docTax: 'Tax',
    docTotal: 'Total',
    docDepositRequired: 'Deposit Required',
    docAmountPaid: 'Amount Paid',
    docBalanceDue: 'Balance Due',
    docPaidInFullBadge: 'PAID IN FULL',
    docDepositReceivedBadge: 'DEPOSIT RECEIVED',
    docPaymentOpenBadge: 'PAYMENT DUE',
    docPaymentInstructions: 'Payment Instructions & Bank Details',
    docBank: 'Bank',
    docAccountHolder: 'Account Holder',
    docIbanOrAccount: 'IBAN / Account',
    docBicSwift: 'BIC / SWIFT',
    docPaymentTermsNote: 'Payment Terms',
    docThankYou: 'Thank you for your business!',

    // Business Profile Settings
    profTitle: 'Business Profile & Banking',
    profSubtitle: 'Configure your logo, business address, and banking transfer credentials for invoice headers.',
    profSavedSuccess: 'Saved successfully',
    profSaveButton: 'Save Profile',
    profCompanyBranding: 'Company Branding & Address',
    profLogo: 'Company Logo',
    profNoLogo: 'No Logo',
    profRemoveLogo: 'Remove',
    profUploadLogo: 'Upload New Logo',
    profLogoHint: 'PNG, JPG or WebP up to 2MB. Square or horizontal logos work best.',
    profCompanyName: 'Company / Business Name *',
    profOwnerName: 'Owner / Contact Name',
    profBillingEmail: 'Billing Email Address *',
    profPhone: 'Phone Number',
    profBusinessAddress: 'Business Street Address',
    profCityStateZip: 'City, State, Postal / Zip Code',
    profBankingTitle: 'Banking & Wire Credentials',
    profBankName: 'Bank Name',
    profAccountHolder: 'Account Holder Name',
    profAccountNumber: 'Account Number',
    profIban: 'IBAN / Routing Number',
    profSwiftBic: 'SWIFT / BIC Code',
    profPaymentTermsDefault: 'Default Payment Terms Note',
    profPaymentTermsDefaultHint: 'This note will automatically appear on new invoices.',

    // Google Drive Modal
    driveModalTitle: 'Google Drive Cloud Storage',
    driveModalSubtitle: 'Secure automated invoice backup',
    driveModalConnectedTitle: 'Connected Google Account',
    driveModalSyncNotice: 'Invoices are synced directly into your private Google Drive "InvoiceFlow Invoices" folder.',
    driveModalDisconnect: 'Disconnect Account',
    driveModalDesc: 'Connect your Google account to automatically back up generated PDF invoices to your Google Drive. The app only accesses files it creates to store your invoices.',
    driveModalSignInButton: 'Sign in with Google',
    driveModalSigningIn: 'Signing in with Google...',
    driveModalTokenOption: 'Have an OAuth access token?',
    driveModalTokenButton: 'Connect with Token',
    driveModalTokenPlaceholder: 'ya29.a0...',

    // Extra helper keys
    navCompany: 'Company & Bank',
    driveBtn: 'Google Drive',
    dbLoading: 'Loading SQLite database & records...',
    dbNoticeTitle: 'Database Initialization Notice',
    dbRetry: 'Retry Initialization',
    profSaveSuccess: 'Saved successfully',
    profSaveBtn: 'Save Profile',
    profCompanySection: 'Company Branding & Address',
    profEmail: 'Billing Email',
    profAddress: 'Street Address',
    profBankSection: 'Bank Remittance & Settlement Info',
    profBankSectionHint: 'These wire/remittance instructions are clearly printed on every issued invoice for your clients.',
    profPaymentTerms: 'Default Payment Terms & Policy',
    driveConnectedMsg: 'Invoices are synced directly into your private Google Drive "InvoiceFlow Invoices" folder.',
    driveDisconnect: 'Disconnect Account',
    driveSigningIn: 'Signing in with Google...',
    driveSignInBtn: 'Sign in with Google',
    viewModalDriveSuccess: 'Saved to Google Drive in folder "InvoiceFlow Invoices"!',
    viewModalBackingUp: 'Backing up to Drive...',
  },
  de: {
    // Navigation & General
    appTitle: 'InvoiceFlow',
    appSubtitle: 'Rechnungsverwaltung & Google Drive-Synchronisation',
    navDashboard: 'Übersicht',
    navInvoices: 'Rechnungen',
    navCompanyBank: 'Unternehmen & Bank',
    createInvoice: 'Rechnung erstellen',
    driveConnected: 'Drive verbunden',
    googleDrive: 'Google Drive',
    close: 'Schließen',
    cancel: 'Abbrechen',
    save: 'Speichern',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    loading: 'SQLite-Datenbank & Datensätze werden geladen...',
    languageName: 'Deutsch',
    switchLanguage: 'Sprache',

    // Statuses
    statusDraft: 'Entwurf',
    statusOpen: 'Offen',
    statusDownpayment: 'Anzahlung',
    statusPaid: 'Bezahlt',
    statusAll: 'Alle Status',

    // Dashboard
    dashCollectedRevenue: 'Erhaltene Einnahmen',
    dashTotalInvoiced: 'Rechnungsgesamtbetrag',
    dashPendingBalance: 'Offener Restbetrag',
    dashInvoicesOverview: 'Rechnungsübersicht',
    dashPaidCount: 'Bezahlt',
    dashDownpaymentCount: 'Anzahlung',
    dashOpenCount: 'Offen',
    dashInflowTrends: 'Finanzielle Entwicklung',
    dashMonthlySubtitle: '6-Monats-Übersicht: Rechnungen vs. Einnahmen',
    dashRecentInvoices: 'Neueste Rechnungen',
    dashViewAll: 'Alle anzeigen',
    dashNoInvoices: 'Noch keine Rechnungen erstellt. Erstellen Sie Ihre erste Rechnung, um Statistiken zu sehen.',
    dashQuickActions: 'Schnellaktionen',
    dashExportCsvTitle: 'Buchhaltungs-CSV exportieren',
    dashExportCsvDesc: 'Tabelle aller Rechnungsdatensätze herunterladen',
    dashConfigureBankTitle: 'Bankverbindung konfigurieren',
    dashConfigureBankDesc: 'Kontoinhaber, IBAN & Zahlungsbedingungen aktualisieren',
    dashDriveBackupTitle: 'Google Drive-Sicherung',
    dashDriveBackupDesc: 'PDF-Rechnungen direkt in Ihrem Cloud-Ordner sichern',
    dashLegendInvoiced: 'In Rechnung gestellt',
    dashLegendCollected: 'Erhalten',
    dashLegendPending: 'Ausstehend',
    dashAllCollected: '100% erhalten',
    dashAwaitingCollection: 'Ausstehend zur Zahlung',
    dashHealthyRatio: 'Gesunde Zahlungsquote',

    // Invoices List
    invListTitle: 'Rechnungsdatenbank',
    invListSubtitle: 'Echtzeit-indizierte SQLite-Rechnungsverwaltung mit Statusfiltern, Anzahlungen und Google Drive-Synchronisation.',
    invListExportCsv: 'CSV exportieren',
    invListNewInvoice: 'Neue Rechnung',
    invListSearchPlaceholder: 'Suche nach Rechnungsnr., Kunde, E-Mail...',
    invListSortNewest: 'Neueste zuerst',
    invListSortOldest: 'Älteste zuerst',
    invListSortHighest: 'Höchster Betrag',
    invListSortLowest: 'Niedrigster Betrag',
    invListColNumber: 'Rechnungsnr.',
    invListColClient: 'Kunde',
    invListColDates: 'Daten',
    invListColTotal: 'Gesamtbetrag',
    invListColBalance: 'Restbetrag',
    invListColStatus: 'Status',
    invListColActions: 'Aktionen',
    invListIssued: 'Ausgestellt',
    invListDue: 'Fällig',
    invListNoResults: 'Keine Rechnungen stimmen mit Ihrem Suchfilter überein.',
    invListNoResultsDesc: 'Passen Sie Ihre Suchkriterien an oder erstellen Sie eine neue Rechnung.',
    invListCreateFirst: 'Erste Rechnung erstellen',
    invListDeleteConfirm: 'Möchten Sie diese Rechnung wirklich löschen',
    invListViewTooltip: 'Rechnung anzeigen & drucken',
    invListEditTooltip: 'Rechnungsdetails bearbeiten',
    invListDeleteTooltip: 'Rechnung löschen',
    invListDriveSaved: 'Drive-Kopie',

    // Invoice Form
    formTitleNew: 'Neue Rechnung erstellen',
    formTitleEdit: 'Rechnung bearbeiten',
    formSubtitle: 'Kundendaten, Rechnungspositionen, Mehrwertsteuersatz und Anzahlungskonditionen festlegen.',
    formClientInfo: 'Kundeninformationen',
    formClientName: 'Kundenname / Firma *',
    formClientNamePlaceholder: 'Musterfirma GmbH oder Max Mustermann',
    formClientEmail: 'E-Mail-Adresse',
    formClientEmailPlaceholder: 'buchhaltung@musterfirma.de',
    formClientAddress: 'Straße & Hausnummer',
    formClientAddressPlaceholder: 'Musterstraße 12',
    formClientCityStateZip: 'PLZ & Ort',
    formClientCityStateZipPlaceholder: '10115 Berlin',
    formInvoiceDetails: 'Rechnungsdetails & Formatierung',
    formInvoiceNumber: 'Rechnungsnummer *',
    formIssueDate: 'Rechnungsdatum *',
    formDueDate: 'Fälligkeitsdatum *',
    formCurrency: 'Währung',
    formStatus: 'Zahlungsstatus',
    formTheme: 'Vorlagendesign',
    formThemeModern: 'Modern Indigo',
    formThemeMinimalist: 'Minimalistisch Clean',
    formThemeClassic: 'Klassisch Serif',
    formThemeCorporate: 'Corporate Schiefer',
    formLineItems: 'Rechnungspositionen',
    formColDescription: 'Leistungsbeschreibung',
    formColQty: 'Menge',
    formColPrice: 'Einzelpreis',
    formColTotal: 'Gesamt',
    formAddItem: 'Position hinzufügen',
    formFinancialSummary: 'Finanzielle Zusammenfassung',
    formSubtotal: 'Zwischensumme',
    formTaxRate: 'MwSt.-Satz (%)',
    formTaxAmount: 'MwSt.-Betrag',
    formTotalAmount: 'Gesamtbetrag',
    formDownpaymentSection: 'Anzahlung & Abschlagszahlung',
    formRequireDownpayment: 'Anzahlung / Vorschuss anfordern',
    formDownpaymentHelp: 'Ideal für Projektstarts, Meilensteine oder Materialvorschüsse.',
    formDownpaymentType: 'Berechnungsart der Anzahlung',
    formDownpaymentPercentage: 'Prozentual (%)',
    formDownpaymentFixed: 'Fester Betrag',
    formDownpaymentValue: 'Anzahlungswert',
    formCalculatedDeposit: 'Berechnete Anzahlung',
    formAmountPaid: 'Bisher bezahlter Betrag',
    formBalanceDue: 'Verbleibender Restbetrag',
    formTermsAndNotes: 'Notizen & Zahlungsbedingungen',
    formClientNotes: 'Notizen für den Kunden',
    formClientNotesPlaceholder: 'Vielen Dank für Ihren Auftrag...',
    formPaymentTerms: 'Zahlungsbedingungen & Bankhinweise',
    formPaymentTermsPlaceholder: 'Zahlbar innerhalb von 14 Tagen nach Rechnungsdatum ohne Abzug...',
    formSaveInvoice: 'Rechnung speichern',
    formSaveSuccess: 'Rechnung erfolgreich gespeichert!',

    // Invoice View Modal
    viewModalTitle: 'Rechnungsdetails',
    viewModalBack: 'Zurück',
    viewModalEdit: 'Bearbeiten',
    viewModalPrint: 'Drucken',
    viewModalDownloadPdf: 'PDF herunterladen',
    viewModalGeneratingPdf: 'PDF wird erstellt...',
    viewModalSaveToDrive: 'In Google Drive speichern',
    viewModalSavingToDrive: 'Wird in Drive gesichert...',
    viewModalSavedToDrive: 'In Drive gespeichert',
    viewModalDriveBackupNotice: 'Erfolgreich im Google Drive-Ordner "InvoiceFlow Invoices" gesichert!',
    viewModalPaymentActions: 'Schnelle Zahlungsaktionen',
    viewModalMarkPaid: 'Als vollständig bezahlt markieren',
    viewModalMarkDownpayment: 'Anzahlung als erhalten markieren',
    viewModalRevertOpen: 'Auf "Offen" zurücksetzen',
    viewModalRecordCustomPayment: 'Individuelle Zahlung erfassen',
    viewModalRecordPaymentPrompt: 'Geben Sie den gesamten bisher erhaltenen Betrag ein:',
    viewModalInvalidAmount: 'Bitte geben Sie einen gültigen, nicht-negativen Betrag ein.',

    // Invoice Document (for Print / PDF / View)
    docInvoice: 'RECHNUNG',
    docInvoiceNo: 'Rechnungs-Nr.',
    docDate: 'Datum',
    docDueDate: 'Fälligkeitsdatum',
    docBilledTo: 'RECHNUNGSEMPFÄNGER',
    docDescription: 'BESCHREIBUNG',
    docQty: 'MENGE',
    docRate: 'EINZELPREIS',
    docAmount: 'BETRAG',
    docSubtotal: 'Zwischensumme netto',
    docTax: 'Umsatzsteuer',
    docTotal: 'Gesamtbetrag brutto',
    docDepositRequired: 'Geforderte Anzahlung',
    docAmountPaid: 'Bereits bezahlt',
    docBalanceDue: 'Zu zahlender Restbetrag',
    docPaidInFullBadge: 'VOLLSTÄNDIG BEZAHLT',
    docDepositReceivedBadge: 'ANZAHLUNG ERHALTEN',
    docPaymentOpenBadge: 'ZAHLUNG FÄLLIG',
    docPaymentInstructions: 'Zahlungshinweise & Bankverbindung',
    docBank: 'Kreditinstitut',
    docAccountHolder: 'Kontoinhaber',
    docIbanOrAccount: 'IBAN / Kontonummer',
    docBicSwift: 'BIC / SWIFT',
    docPaymentTermsNote: 'Zahlungsbedingungen',
    docThankYou: 'Vielen Dank für das Vertrauen und Ihren Auftrag!',

    // Business Profile Settings
    profTitle: 'Unternehmensprofil & Bankverbindung',
    profSubtitle: 'Logo, Firmenanschrift und Bankverbindungsdaten für Ihre Rechnungen festlegen.',
    profSavedSuccess: 'Erfolgreich gespeichert',
    profSaveButton: 'Profil speichern',
    profCompanyBranding: 'Firmenidentität & Anschrift',
    profLogo: 'Firmenlogo',
    profNoLogo: 'Kein Logo',
    profRemoveLogo: 'Entfernen',
    profUploadLogo: 'Neues Logo hochladen',
    profLogoHint: 'PNG, JPG oder WebP bis 2MB. Quadratische oder Querformat-Logos eignen sich am besten.',
    profCompanyName: 'Firmenname / Geschäftsbezeichnung *',
    profOwnerName: 'Inhaber / Ansprechpartner',
    profBillingEmail: 'Rechnungs-E-Mail-Adresse *',
    profPhone: 'Telefonnummer',
    profBusinessAddress: 'Geschäftsadresse',
    profCityStateZip: 'PLZ & Ort',
    profBankingTitle: 'Bankverbindung & Zahlungsdaten',
    profBankName: 'Name der Bank',
    profAccountHolder: 'Kontoinhaber',
    profAccountNumber: 'Kontonummer',
    profIban: 'IBAN / Kontokennung',
    profSwiftBic: 'BIC / SWIFT-Code',
    profPaymentTermsDefault: 'Standard-Zahlungsbedingung',
    profPaymentTermsDefaultHint: 'Dieser Text wird automatisch in neu erstellte Rechnungen eingefügt.',

    // Google Drive Modal
    driveModalTitle: 'Google Drive Cloud-Speicher',
    driveModalSubtitle: 'Sichere automatische Rechnungssicherung',
    driveModalConnectedTitle: 'Verbundenes Google-Konto',
    driveModalSyncNotice: 'Rechnungen werden direkt in Ihren privaten Google Drive-Ordner "InvoiceFlow Invoices" synchronisiert.',
    driveModalDisconnect: 'Konto trennen',
    driveModalDesc: 'Verbinden Sie Ihr Google-Konto, um erstellte PDF-Rechnungen automatisch zu sichern. Die App hat ausschließlich Zugriff auf die von ihr erstellten Rechnungsdateien.',
    driveModalSignInButton: 'Mit Google anmelden',
    driveModalSigningIn: 'Anmeldung bei Google läuft...',
    driveModalTokenOption: 'Besitzen Sie ein OAuth-Zugriffstoken?',
    driveModalTokenButton: 'Mit Token verbinden',
    driveModalTokenPlaceholder: 'ya29.a0...',

    // Extra helper keys
    navCompany: 'Unternehmen & Bank',
    driveBtn: 'Google Drive',
    dbLoading: 'SQLite-Datenbank & Datensätze werden geladen...',
    dbNoticeTitle: 'Hinweis zur Datenbankinitialisierung',
    dbRetry: 'Initialisierung wiederholen',
    profSaveSuccess: 'Erfolgreich gespeichert',
    profSaveBtn: 'Profil speichern',
    profCompanySection: 'Unternehmensmarke & Anschrift',
    profEmail: 'Rechnungs-E-Mail',
    profAddress: 'Straße und Hausnummer',
    profBankSection: 'Bankverbindung & Überweisungsdaten',
    profBankSectionHint: 'Diese Überweisungsinformationen werden übersichtlich auf jeder ausgestellten Rechnung für Ihre Kunden gedruckt.',
    profPaymentTerms: 'Standard-Zahlungsbedingungen',
    driveConnectedMsg: 'Rechnungen werden direkt in Ihren privaten Google Drive-Ordner „InvoiceFlow Invoices“ synchronisiert.',
    driveDisconnect: 'Konto trennen',
    driveSigningIn: 'Anmeldung bei Google...',
    driveSignInBtn: 'Mit Google anmelden',
    viewModalDriveSuccess: 'Auf Google Drive im Ordner „InvoiceFlow Invoices“ gespeichert!',
    viewModalBackingUp: 'Sicherung auf Drive läuft...',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  formatDate: (dateStr: string) => string;
  formatAmount: (amount: number, currency?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'invoiceflow_language_pref';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'de' || saved === 'en') return saved;
    // Check browser language
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('de')) {
      return 'de';
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to save language preference to localStorage:', e);
    }
  };

  const t = translations[language];

  // Date formatting localized according to current language
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        if (language === 'de') {
          return `${day}.${month}.${year}`;
        }
        const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Currency formatting localized according to current language
  const formatAmount = (amount: number, currency = 'USD'): string => {
    try {
      const locale = language === 'de' ? 'de-DE' : 'en-US';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency || 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currency}`;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatDate, formatAmount }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
