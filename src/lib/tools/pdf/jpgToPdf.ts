import { PDFDocument } from 'pdf-lib';

export async function jpgToPdf(files: File[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const imgBytes = await file.arrayBuffer();
    
    // Embed the JPG image bytes
    // (Assuming all inputs are JPGs for now, can add png support checking file.type)
    let image;
    if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(imgBytes);
    } else {
      image = await pdfDoc.embedJpg(imgBytes);
    }

    const { width, height } = image.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

