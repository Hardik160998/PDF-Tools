import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fromId = formData.get('id') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const API_SECRET = process.env.CONVERT_API_SECRET;
    if (!API_SECRET || API_SECRET === 'your_convertapi_secret_here') {
      return NextResponse.json({ error: 'CONVERT_API_SECRET not configured in .env.local' }, { status: 500 });
    }
    const safeSecret = encodeURIComponent(API_SECRET);

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // Interpret conversion format/action
    let actionEndpoint = `https://v2.convertapi.com/convert/docx/to/pdf?Secret=${API_SECRET}`;
    const convertApiParams: any[] = [
      {
        Name: 'File',
        FileValue: {
          Name: file.name,
          Data: base64Data,
        },
      },
      {
        Name: 'StoreFile',
        Value: true,
      }
    ];

    if (fromId === 'unlock') {
      const password = formData.get('password') as string;
      actionEndpoint = `https://v2.convertapi.com/convert/pdf/to/unprotect?Secret=${safeSecret}`;
      if (!password) {
        return NextResponse.json({ error: 'Password is required to unlock this PDF.' }, { status: 400 });
      }
      convertApiParams.push({ Name: 'Password', Value: password });
      
      const storeFileIndex = convertApiParams.findIndex(p => p.Name === 'StoreFile');
      if (storeFileIndex > -1) convertApiParams.splice(storeFileIndex, 1);
    } else if (fromId === 'repair-pdf') {
      actionEndpoint = `https://v2.convertapi.com/convert/pdf/to/repair?Secret=${safeSecret}`;
      const storeFileIndex = convertApiParams.findIndex(p => p.Name === 'StoreFile');
      if (storeFileIndex > -1) convertApiParams.splice(storeFileIndex, 1);
    } else if (fromId === 'protect') {
      const password = formData.get('password') as string;
      actionEndpoint = `https://v2.convertapi.com/convert/pdf/to/protect?Secret=${safeSecret}`;
      if (!password) {
        return NextResponse.json({ error: 'A password is required to protect this PDF.' }, { status: 400 });
      }
      // Protect action requires UserPassword and/or OwnerPassword
      convertApiParams.push({ Name: 'UserPassword', Value: password });
      
      const storeFileIndex = convertApiParams.findIndex(p => p.Name === 'StoreFile');
      if (storeFileIndex > -1) convertApiParams.splice(storeFileIndex, 1);
    } else {
      let fromFormat = 'docx';
      let toFormat = 'pdf';

      if (fromId === 'pdf-to-word') {
        fromFormat = 'pdf';
        toFormat = 'docx';
      } else if (fromId === 'pdf-to-ppt') {
        fromFormat = 'pdf';
        toFormat = 'pptx';
      } else if (fromId === 'pdf-to-excel') {
        fromFormat = 'pdf';
        toFormat = 'xlsx';
      } else {
        if (fromId.includes('word')) fromFormat = 'docx';
        else if (fromId.includes('excel')) fromFormat = 'xlsx';
        else if (fromId.includes('ppt')) fromFormat = 'pptx';
        else if (fromId.includes('html')) fromFormat = 'html';
      }

      actionEndpoint = `https://v2.convertapi.com/convert/${fromFormat}/to/${toFormat}?Secret=${safeSecret}`;
    }

    // Log the request for debugging (remove in production)
    console.log(`Processing Tool: ${fromId} | Endpoint: ${actionEndpoint}`);
    
    // Call ConvertAPI REST endpoint
    const response = await fetch(
      actionEndpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Parameters: convertApiParams,
        }),
      }
    );

    const contentType = response.headers.get('content-type');
    let result: any;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const rawText = await response.text();
      console.error(`ConvertAPI returned non-JSON response (${response.status}):`, rawText);
      throw new Error(`Cloud provider error (${response.status}). Check server logs.`);
    }

    if (!response.ok) {
      console.error('ConvertAPI Error Details:', JSON.stringify(result, null, 2));
      throw new Error(result.Message || `Cloud error: ${response.status}`);
    }

    // Handle different response structures
    let downloadUrl = result.Files?.[0]?.Url;
    
    // If StoreFile was false or URL is missing, check for FileData
    if (!downloadUrl && result.Files?.[0]?.FileData) {
      downloadUrl = `data:application/pdf;base64,${result.Files[0].FileData}`;
    }

    if (!downloadUrl) {
      throw new Error('No result file returned from provider.');
    }

    return NextResponse.json({ url: downloadUrl });
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
