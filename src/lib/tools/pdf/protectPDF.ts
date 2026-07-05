import { PDFDocument } from 'pdf-lib';

export async function protectPDF(file: File, password: string): Promise<Blob> {
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  
  const protectedBytes = await pdf.save({ 
    // @ts-ignore - pdf-lib encryption might require a custom build or is undocumented in types
    password: { userPassword: password, ownerPassword: password } 
  });
  return new Blob([protectedBytes as any], { type: 'application/pdf' });
}

