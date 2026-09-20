# InvoiceFlow Manager

> Modern, lightweight, and offline-capable small business invoice management web application built with **React**, **TypeScript**, **Tailwind CSS**, and embedded **SQLite** (`sql.js`). Features automated PDF generation, flexible downpayment tracking, customizable branding templates, and Google Drive cloud backup.

---

## 📑 Table of Contents

- [Overview & Why It's Useful](#overview--why-its-useful)
- [Key Features & Options](#key-features--options)
  - [1. Embedded SQLite Database Engine](#1-embedded-sqlite-database-engine)
  - [2. Flexible Downpayment & Deposit Tracking](#2-flexible-downpayment--deposit-tracking)
  - [3. Dynamic Line Items & Automated Calculations](#3-dynamic-line-items--automated-calculations)
  - [4. Professional PDF Generation & CSV Export](#4-professional-pdf-generation--csv-export)
  - [5. 4 Curated Invoice Design Themes](#5-4-curated-invoice-design-themes)
  - [6. Company Profile & Banking Details](#6-company-profile--banking-details)
  - [7. Financial Performance Dashboard](#7-financial-performance-dashboard)
  - [8. Google Drive Cloud Backup](#8-google-drive-cloud-backup)
- [How to Use the Application](#how-to-use-the-application)
  - [Creating Your First Invoice](#creating-your-first-invoice)
  - [Managing Invoices & Statuses](#managing-invoices--statuses)
  - [Customizing Your Business Profile](#customizing-your-business-profile)
  - [Exporting to PDF or CSV](#exporting-to-pdf-or-csv)
  - [Backing Up to Google Drive](#backing-up-to-google-drive)
- [Getting Started Locally](#getting-started-locally)
  - [Prerequisites](#prerequisites)
  - [Installation & Running](#installation--running)
  - [Production Build](#production-build)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## 💡 Overview & Why It's Useful

Small business owners, freelancers, and independent contractors often face a dilemma:
- Clunky spreadsheet templates lack professional PDF exports and automated balance math.
- Heavy SaaS billing suites charge recurring monthly fees, require internet access, and lock private customer data behind vendor platforms.

**InvoiceFlow Manager** offers the sweet spot:
- **Zero Server Setup**: Powered by an embedded SQLite engine that runs in the browser, storing invoices securely on your own device with instant retrieval.
- **Deposit & Downpayment Ready**: Built specifically for services and projects requiring upfront deposits (e.g., 30% kickoff deposit, fixed retainer) with clear balance breakdowns.
- **Client-Ready PDFs in Seconds**: Download crisp, branded invoices ready to email or print with your logo, bank wiring instructions, and customized terms.
- **No Recurring Fees or Vendor Lock-in**: Retain complete ownership of your invoicing database with one-click CSV and PDF exports.

---

## ✨ Key Features & Options

### 1. Embedded SQLite Database Engine
- **In-Browser Relational SQLite**: Powered by `sql.js` (WebAssembly) with zero external database dependencies.
- **Relational Integrity**: Uses standard SQL tables (`invoices`) with prepared statements for querying, filtering, inserting, and updating invoice records.
- **Automatic Local Persistence**: All database transactions are automatically committed and backed up to browser local storage across browser sessions.
- **Instant Pre-Seeded Sample Data**: Arrives with realistic invoice examples showcasing various payment states for instant evaluation.

### 2. Flexible Downpayment & Deposit Tracking
- **Deposit Requirement Toggle**: Flag whether a project requires an upfront deposit before commencing work.
- **Flexible Calculation Modes**:
  - **Percentage-Based**: Set custom deposit rates (e.g., 20%, 30%, 50%) calculated automatically against the grand total.
  - **Fixed Amount**: Set specific upfront milestone payments (e.g., $1,000.00).
- **Clear Balance Math**: Automatically highlights **Total Amount Invoiced**, **Deposit Required / Paid**, and **Remaining Balance Due**.
- **Specialized Status**: Dedicated `Downpayment Received` status tracks projects in active execution where final balance remains open.

### 3. Dynamic Line Items & Automated Calculations
- **Interactive Line Items**: Add, edit, and remove line items on the fly with item descriptions, unit counts, and unit rates.
- **Automated Subtotals**: Dynamically computes item line totals and cumulative subtotal amounts in real time.
- **Configurable Sales Tax**: Specify your local tax percentage (e.g., 8.5%) for automatic tax amount calculations.
- **Dynamic Currency Support**: Standardizes currency formatting across all views and documents.

### 4. Professional PDF Generation & CSV Export
- **Pixel-Perfect PDF Generation**: Uses `html2canvas` and `jsPDF` to generate crisp, standard A4/Letter PDFs ready for client delivery.
- **One-Click CSV Export**: Export your entire billing ledger or filtered subsets to CSV format for direct import into Excel, QuickBooks, or Google Sheets.
- **Browser Print Dialog**: Supports native high-resolution browser printing directly from the invoice view.

### 5. 4 Curated Invoice Design Themes
Switch document styling instantly to match your brand identity:
1. **Modern Indigo**: Contemporary tech aesthetic with crisp royal indigo headers and clean tabular borders.
2. **Minimal Clean**: Elegant monochrome design with airy margins, subtle hairline rules, and high legibility.
3. **Classic Warm**: Warm amber/stone accents suited for creative agencies, studios, and consultants.
4. **Corporate Slate**: Refined navy/slate palette designed for professional services, legal, and financial practices.

### 6. Company Profile & Banking Details
Configure your business settings once and have them automatically populate every invoice:
- **Branding**: Upload or link your company logo.
- **Contact Details**: Business name, contact person, email, telephone, and registered office address.
- **Direct Wire / Remittance Information**:
  - Bank Name & Account Holder Name
  - Account Number
  - Routing / IBAN
  - SWIFT / BIC code
- **Payment Terms & Default Notes**: Set standard payment window terms (e.g., Net 30) and late fee notices.

### 7. Financial Performance Dashboard
- **Key Financial Metrics**:
  - **Collected Revenue**: Total funds received from completed invoices and paid deposits.
  - **Pending Receivables**: Total outstanding balance across open and partial invoices.
  - **Total Invoiced Volume**: Cumulative billing volume generated.
  - **Active Downpayments**: Number of projects currently operating with deposits paid.
- **Monthly Revenue vs. Receivables Visualizer**: A 6-month comparative bar chart contrasting collected cash against open receivables.
- **Recent Invoices Quick Table**: Instant access to the latest invoices with direct preview shortcuts.

### 8. Google Drive Cloud Backup
- **Connect Google Account**: Seamless Google OAuth integration via Google Identity Services.
- **Cloud Archival**: Back up and archive generated invoice PDFs directly to a dedicated `"InvoiceFlow Invoices"` folder on Google Drive.
- **Direct Access Links**: Track Google Drive file IDs and direct view links directly on each invoice record.

---

## 🚀 How to Use the Application

### Creating Your First Invoice
1. Click the **Create Invoice** button in the top navigation bar.
2. Enter the **Client Details** (Name, Email, Billing Address).
3. Set the **Issue Date** and **Payment Due Date**.
4. Add your **Line Items** (Description, Quantity, and Unit Price). The subtotal and grand total update automatically.
5. *(Optional)* Turn on **Require Downpayment / Deposit**, choose between **Percentage (%)** or **Fixed ($)**, and specify the amount.
6. Choose a **Template Theme** (Modern, Minimal, Classic, or Corporate).
7. Add optional client notes or custom payment terms, then click **Save & Finalize Invoice**.

### Managing Invoices & Statuses
1. Navigate to the **Invoices** tab from the top navigation.
2. Use the **Status Filter Chips** (`All`, `Open`, `Downpayment`, `Paid`) or the **Search Bar** (search by invoice number, client name, or email).
3. Click any invoice card or table row to open the **Invoice View Modal**.
4. In the viewer, update the status:
   - Mark as **Deposit Received** when the initial payment arrives.
   - Mark as **Paid in Full** upon settlement.
   - Reopen as **Open / Unpaid** if adjustments are required.

### Customizing Your Business Profile
1. Click the **Company & Bank** tab.
2. Update your business information and banking wire details.
3. Click **Save Business Profile**. All future invoices and PDF exports will immediately use your updated information.

### Exporting to PDF or CSV
- **Download PDF**: Open any invoice in the viewer and click **Download PDF**.
- **Print**: Click the **Print** button in the invoice viewer to open the native print dialog.
- **Export to CSV**: On the **Invoices** page, click the **Export CSV** button in the upper-right corner.

### Backing Up to Google Drive
1. Click the **Google Drive** button in the header and authenticate with your Google account.
2. Open any invoice, and click **Save to Google Drive**.
3. A PDF of the invoice will be rendered and uploaded to your Drive account with a direct link saved to the invoice.

---

## 🛠️ Getting Started Locally

### Prerequisites
- **Node.js**: Version `18.0.0` or higher
- **npm**: Version `9.0.0` or higher (or `yarn` / `pnpm` / `bun`)

### Installation & Running

1. **Clone or Extract the Project**:
   ```bash
   git clone <repository-url>
   cd invoiceflow-manager
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the App**:
   Open your browser and navigate to `http://localhost:3000` (or the URL printed in the terminal).

### Production Build
To create an optimized production build:
```bash
npm run build
npm run preview
```
Static production files will be output to the `dist/` directory.

---

## 💻 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Declarative user interface library |
| **TypeScript** | Type-safe application logic and data interfaces |
| **Tailwind CSS v4** | Modern utility-first responsive styling |
| **sql.js** (SQLite WASM) | In-browser relational database engine |
| **jsPDF** & **html2canvas** | High-resolution client-side PDF document rendering |
| **Lucide React** | Consistent, accessible icon set |
| **Vite** | Next-generation fast frontend build tool |

---

## 🔒 Privacy & Data Storage

All invoice records, business profiles, and financial computations are stored strictly on **your local machine** within your browser's SQLite database and localStorage. No financial data or customer records are transmitted to third-party servers unless you explicitly trigger the optional Google Drive backup to your personal Google account.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to adapt, modify, and use it for personal or commercial projects.
