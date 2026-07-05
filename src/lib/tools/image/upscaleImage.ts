import { loadImage } from './helpers';

export async function upscaleImage(file: File, scaleFactor: number = 2): Promise<Blob> {
  const img = await loadImage(file);
  const width = img.width * scaleFactor;
  const height = img.height * scaleFactor;
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas empty'));
    }, 'image/png'); // Upscale to PNG to avoid lossy artifacts
  });
}
