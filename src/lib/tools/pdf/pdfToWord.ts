import { Document, Packer, Paragraph } from 'docx';

export async function pdfToWord(file: File): Promise<Blob> {
  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const texts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    texts.push(content.items.map((item: any) => item.str).join(' '));
  }

  const doc = new Document({
    sections: [
      {
        children: texts.map((t) => new Paragraph(t)),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

