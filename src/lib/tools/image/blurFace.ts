import { loadImage } from './helpers';

export async function blurFace(file: File): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  
  // Draw original
  ctx.drawImage(img, 0, 0);
  
  // Simplified logic: Just blur the center 30% of the image
  // Real implementation would use face-api.js or mediapipe
  const cw = img.width * 0.3;
  const ch = img.height * 0.3;
  const cx = (img.width - cw) / 2;
  const cy = (img.height - ch) / 2;
  
  ctx.filter = 'blur(10px)';
  ctx.drawImage(canvas, cx, cy, cw, ch, cx, cy, cw, ch);
  ctx.filter = 'none';

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas empty'));
    }, file.type, 0.9);
  });
}
