import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    // The pdf-parse v2+ library exports a PDFParse class.
    const pdf = require('pdf-parse');
    const parser = new pdf.PDFParse(new Uint8Array(arrayBuffer));
    await parser.load();
    const result = await parser.getText();
    const text = typeof result === 'string' ? result : result.text || '';

    return NextResponse.json({ text: text.trim() });
  } catch (error: any) {
    console.error('PDF Extraction Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract text from PDF' },
      { status: 500 }
    );
  }
}
