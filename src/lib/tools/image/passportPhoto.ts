import { loadImage } from './helpers';

export async function createPassportPhoto(file: File): Promise<Blob> {
  const img = await loadImage(file);
  const pw = 140, ph = 180; // approx 35x45mm at 100dpi
  const canvas = document.createElement('canvas');
  canvas.width = 600; 
  canvas.height = 800;
  
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw 6 photos in 2x3 grid
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      ctx.drawImage(img, col * (pw + 20) + 50, row * (ph + 20) + 50, pw, ph);
    }
  }
  
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas empty'));
    }, 'image/jpeg', 0.95);
  });
}
