import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let browser = null;
  try {
    const { url } = await request.json();

    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    try { new URL(url); } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const puppeteer = await import('puppeteer');
    browser = await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait a bit for any lazy-loaded content
    await new Promise(r => setTimeout(r, 1500));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    });

    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="webpage.pdf"',
      },
    });

  } catch (error: any) {
    console.error('Webpage to PDF error:', error.message);
    return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
