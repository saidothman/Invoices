// Google Drive REST API service for OAuth Client in browser

declare global {
  interface Window {
    google?: any;
  }
}

export interface DriveUploadResponse {
  id: string;
  name: string;
  webViewLink: string;
}

const DRIVE_FOLDER_NAME = 'InvoiceFlow Invoices';

/**
 * Ensures or creates a dedicated 'InvoiceFlow Invoices' folder on Google Drive
 */
export async function getOrCreateDriveFolder(accessToken: string): Promise<string> {
  // Check if folder already exists
  const query = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${DRIVE_FOLDER_NAME}' and trashed=false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name)`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!searchRes.ok) {
    throw new Error(`Failed to query Google Drive: ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: DRIVE_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create Google Drive folder: ${createRes.statusText}`);
  }

  const folder = await createRes.json();
  return folder.id;
}

/**
 * Uploads a PDF Blob to Google Drive using multipart upload
 */
export async function uploadInvoicePdfToDrive(
  accessToken: string,
  pdfBlob: Blob,
  fileName: string,
  description?: string
): Promise<DriveUploadResponse> {
  const folderId = await getOrCreateDriveFolder(accessToken);

  const metadata = {
    name: `${fileName}.pdf`,
    mimeType: 'application/pdf',
    parents: [folderId],
    description: description || 'Generated invoice from InvoiceFlow Manager',
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', pdfBlob);

  const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Drive upload failed (${uploadRes.status}): ${errorText}`);
  }

  const result = await uploadRes.json();
  return result;
}

/**
 * Fetches user profile using Google Access Token
 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<{ email: string; name: string; picture: string }> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to retrieve user information from Google');
  }

  const user = await res.json();
  return {
    email: user.email || '',
    name: user.name || user.given_name || 'Google User',
    picture: user.picture || '',
  };
}
