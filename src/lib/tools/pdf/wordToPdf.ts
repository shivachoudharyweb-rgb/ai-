import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import mammoth from 'mammoth';

export async function wordToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Extract text from the Word document
  const { value: text } = await mammoth.extractRawText({ arrayBuffer });
  
  const pdf = await PDFDocument.create();
  const page = pdf.addPage();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  
  // Simple rendering logic (only renders the first ~2000 chars for demo purposes)
  // Rendering an entire multi-page document is complex and requires layout logic
  page.drawText(text.substring(0, 2000), {
    x: 50,
    y: page.getHeight() - 50,
    font,
    size: 12,
    color: rgb(0, 0, 0),
  });
  
  const bytes = await pdf.save();
  return new Blob([bytes as any], { type: 'application/pdf' });
}

