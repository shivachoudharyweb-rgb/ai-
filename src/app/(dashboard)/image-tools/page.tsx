'use client';

import { ToolCard } from '@/components/tools/ToolCard';
import { Eraser, Maximize, Minimize, FileText, UserSquare2, ScanFace, Droplets, ArrowUpCircle, Crop, Palette } from 'lucide-react';

const IMAGE_TOOLS = [
  { id: 'remove-bg', title: 'Remove Background', description: 'Automatically remove image backgrounds with AI.', icon: Eraser, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400', badge: 'AI' },
  { id: 'resize-image', title: 'Resize Image', description: 'Change image dimensions easily.', icon: Maximize, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' },
  { id: 'compress-image', title: 'Compress Image', description: 'Reduce image file size with zero quality loss.', icon: Minimize, color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
  { id: 'image-to-pdf', title: 'Image to PDF', description: 'Convert your images to PDF documents.', icon: FileText, color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
  { id: 'profile-pic', title: 'Profile Pic Maker', description: 'Create professional profile pictures.', icon: UserSquare2, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
  { id: 'blur-face', title: 'Blur Face', description: 'Automatically blur faces in photos for privacy.', icon: ScanFace, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
  { id: 'watermark-image', title: 'Watermark Image', description: 'Add a text or image watermark to your photos.', icon: Droplets, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400' },
  { id: 'upscale-image', title: 'Image Upscaler', description: 'Enhance and upscale images with AI.', icon: ArrowUpCircle, color: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400', badge: 'Pro' },
  { id: 'crop-image', title: 'Crop Image', description: 'Crop your images to specific dimensions.', icon: Crop, color: 'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400' },
  { id: 'colorize-photo', title: 'Colorize Photo', description: 'Add color to black and white photos.', icon: Palette, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400', badge: 'AI' },
];

export default function ImageToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Image Tools</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Edit, resize, and enhance your images with powerful tools.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {IMAGE_TOOLS.map((tool) => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>
    </div>
  );
}

