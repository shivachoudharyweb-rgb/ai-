import Tesseract from 'tesseract.js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function ocrPDF(file: File): Promise<Blob> {
  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  const scale = 2.0; // Higher scale for better OCR
  const extractedTexts: string[] = [];
  
  // Create a new PDF to store the results
  const newPdf = await PDFDocument.create();
  const font = await newPdf.embedFont(StandardFonts.Helvetica);

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    
    // Render page to canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context not available');
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({ canvasContext: context, viewport } as any).promise;
    
    // Convert canvas to image data URL for Tesseract
    const dataUrl = canvas.toDataURL('image/png');
    
    // Run OCR
    const { data: { text } } = await Tesseract.recognize(
      dataUrl,
      'eng',
      { logger: m => console.log(m) }
    );
    
    // For demo purposes, we are just creating a text PDF of the OCR result
    // (Actual invisible text overlays are much more complex)
    const newPage = newPdf.addPage([viewport.width / scale, viewport.height / scale]);
    newPage.drawText(text.substring(0, 3000), {
      x: 50,
      y: newPage.getHeight() - 50,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  }

  const bytes = await newPdf.save();
  return new Blob([bytes as any], { type: 'application/pdf' });
}


