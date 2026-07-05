import Compressor from 'compressorjs';

export async function compressImage(file: File, quality: number = 0.6): Promise<Blob> {
  return new Promise((resolve, reject) => {
    new Compressor(file, { 
      quality, 
      success: resolve, 
      error: reject 
    });
  });
}
