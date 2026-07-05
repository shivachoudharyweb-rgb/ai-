import { PDFDocument } from 'pdf-lib';

export async function compressPDF(file: File): Promise<Blob> {
  const pdfBytes = await file.arrayBuffer();
  // Basic compression by discarding unused objects and streams
  const pdf = await PDFDocument.load(pdfBytes, { updateMetadata: false });
  const bytes = await pdf.save({ useObjectStreams: true });
  
  return new Blob([bytes as any], { type: 'application/pdf' });
}

