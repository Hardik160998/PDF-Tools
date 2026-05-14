import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const reqContentType = request.headers.get('content-type') || '';
    let file: File | null = null;
    let fromId = '';
    let webUrl = '';
    let formData: FormData | null = null;

    if (reqContentType.includes('application/json')) {
      const json = await request.json();
      fromId = json.id;
      webUrl = json.url || '';
    } else {
      formData = await request.formData();
      file = formData.get('file') as File;
      fromId = formData.get('id') as string;
    }

    const API_SECRET = process.env.CONVERT_API_SECRET;
    if (!API_SECRET || API_SECRET === 'your_convertapi_secret_here') {
      return NextResponse.json({ error: 'CONVERT_API_SECRET not configured in .env.local' }, { status: 500 });
    }
    const safeSecret = encodeURIComponent(API_SECRET);

    // Handle webpage-to-pdf (URL input, no file)
    if (fromId === 'webpage-to-pdf') {
      if (!webUrl) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
      const endpoint = `https://v2.convertapi.com/convert/web/to/pdf?Secret=${safeSecret}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Parameters: [{ Name: 'Url', Value: webUrl }] }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.Message || `Cloud error: ${response.status}`);
      const fileData = result.Files?.[0]?.FileData;
      const fileUrl = result.Files?.[0]?.Url;
      if (fileData) {
        const pdfBuffer = Buffer.from(fileData, 'base64');
        return new Response(pdfBuffer, {
          headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="webpage.pdf"' },
        });
      }
      if (fileUrl) {
        const pdfRes = await fetch(fileUrl);
        const pdfBuffer = await pdfRes.arrayBuffer();
        return new Response(pdfBuffer, {
          headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="webpage.pdf"' },
        });
      }
      throw new Error('No result file returned from provider.');
    }

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    let actionEndpoint = `https://v2.convertapi.com/convert/docx/to/pdf?Secret=${API_SECRET}`;
    const convertApiParams: any[] = [
      { Name: 'File', FileValue: { Name: file.name, Data: base64Data } },
      { Name: 'StoreFile', Value: true },
    ];

    if (fromId === 'unlock') {
      const password = formData?.get('password') as string;
      actionEndpoint = `https://v2.convertapi.com/convert/pdf/to/unprotect?Secret=${safeSecret}`;
      if (!password) return NextResponse.json({ error: 'Password is required to unlock this PDF.' }, { status: 400 });
      convertApiParams.push({ Name: 'Password', Value: password });
      const i = convertApiParams.findIndex(p => p.Name === 'StoreFile');
      if (i > -1) convertApiParams.splice(i, 1);
    } else if (fromId === 'repair-pdf') {
      actionEndpoint = `https://v2.convertapi.com/convert/pdf/to/repair?Secret=${safeSecret}`;
      const i = convertApiParams.findIndex(p => p.Name === 'StoreFile');
      if (i > -1) convertApiParams.splice(i, 1);
    } else if (fromId === 'protect') {
      const password = formData?.get('password') as string;
      actionEndpoint = `https://v2.convertapi.com/convert/pdf/to/protect?Secret=${safeSecret}`;
      if (!password) return NextResponse.json({ error: 'A password is required to protect this PDF.' }, { status: 400 });
      convertApiParams.push({ Name: 'UserPassword', Value: password });
      const i = convertApiParams.findIndex(p => p.Name === 'StoreFile');
      if (i > -1) convertApiParams.splice(i, 1);
    } else {
      let fromFormat = 'docx';
      let toFormat = 'pdf';
      if (fromId === 'pdf-to-word' || fromId === 'pdf-to-docx')       { fromFormat = 'pdf';  toFormat = 'docx'; }
      else if (fromId === 'pdf-to-ppt')   { fromFormat = 'pdf';  toFormat = 'pptx'; }
      else if (fromId === 'pdf-to-excel') { fromFormat = 'pdf';  toFormat = 'xlsx'; }
      else if (fromId.includes('word') || fromId.includes('docx')) { fromFormat = 'docx'; }
      else if (fromId.includes('excel'))  { fromFormat = 'xlsx'; }
      else if (fromId.includes('ppt'))    { fromFormat = 'pptx'; }
      else if (fromId.includes('html'))   { fromFormat = 'html'; }
      actionEndpoint = `https://v2.convertapi.com/convert/${fromFormat}/to/${toFormat}?Secret=${safeSecret}`;
    }

    console.log(`Processing Tool: ${fromId} | Endpoint: ${actionEndpoint}`);

    const response = await fetch(actionEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Parameters: convertApiParams }),
    });

    const resContentType = response.headers.get('content-type');
    let result: any;

    if (resContentType && resContentType.includes('application/json')) {
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

    let downloadUrl = result.Files?.[0]?.Url;
    if (!downloadUrl && result.Files?.[0]?.FileData) {
      downloadUrl = `data:application/pdf;base64,${result.Files[0].FileData}`;
    }
    if (!downloadUrl) throw new Error('No result file returned from provider.');

    return NextResponse.json({ url: downloadUrl });
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
