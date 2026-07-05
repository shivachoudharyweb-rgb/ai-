import { removeBackground as removeBg } from '@imgly/background-removal';

export async function removeBackground(file: File): Promise<Blob> {
  const blob = await removeBg(file);
  return blob;
}
