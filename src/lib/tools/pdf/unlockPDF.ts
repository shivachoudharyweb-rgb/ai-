import { PDFDocument } from 'pdf-lib';

export async function unlockPDF(file: File, password: string): Promise<Blob> {
  const pdfBytes = await file.arrayBuffer();
  // Pass password to load to decrypt it
  // @ts-ignore - pdf-lib encryption might require a custom build or is undocumented in types
  const pdf = await PDFDocument.load(pdfBytes, { password });
  const unlockedBytes = await pdf.save();
  return new Blob([unlockedBytes as any], { type: 'application/pdf' });
}

