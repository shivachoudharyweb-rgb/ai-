import { PDFDocument } from 'pdf-lib';

export async function splitPDF(file: File, startPage: number, endPage: number): Promise<Blob> {
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const newPdf = await PDFDocument.create();
  
  // Create an array of indices to copy (0-indexed)
  const indices = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage - 1 + i);
  
  const pages = await newPdf.copyPages(pdf, indices);
  pages.forEach((page) => newPdf.addPage(page));
  
  const bytes = await newPdf.save();
  return new Blob([bytes as any], { type: 'application/pdf' });
}

