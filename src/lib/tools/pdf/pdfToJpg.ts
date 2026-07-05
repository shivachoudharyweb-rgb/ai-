import JSZip from 'jszip';

export async function pdfToJpg(file: File): Promise<Blob> {
  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  const arrayBuffer = await file.arrayBuffer();
  
  // Loading document
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  const zip = new JSZip();
  const scale = 2.0; // High resolution
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    
    // Support browser environments
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) throw new Error('Canvas 2D context not available');
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    
    await page.render(renderContext as any).promise;
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas to Blob failed'));
        },
        'image/jpeg',
        0.9
      );
    });
    
    zip.file(`page-${pageNum}.jpg`, blob);
  }
  
  // If only 1 page, return just the image. Otherwise return the zip.
  if (pdf.numPages === 1) {
    const files = zip.file(/.*\.jpg/);
    if (files.length > 0) {
      return await files[0].async('blob');
    }
  }
  
  // Generate zip file for multiple pages
  return await zip.generateAsync({ type: 'blob' });
}



