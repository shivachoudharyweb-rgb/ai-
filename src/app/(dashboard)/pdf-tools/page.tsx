'use client';

import { ToolCard } from '@/components/tools/ToolCard';
import { FileText, FileDown, Scissors, Merge, Shield, ShieldOff, FileImage, Type, Image as ImageIcon } from 'lucide-react';

const PDF_TOOLS = [
  { id: 'merge-pdf', title: 'Merge PDF', description: 'Combine multiple PDFs into one unified document.', icon: Merge, color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
  { id: 'split-pdf', title: 'Split PDF', description: 'Extract pages or split a PDF into multiple files.', icon: Scissors, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
  { id: 'compress-pdf', title: 'Compress PDF', description: 'Reduce file size while optimizing for maximal quality.', icon: FileDown, color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert your PDFs to editable Word documents.', icon: FileText, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400', badge: 'Popular' },
  { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert Word documents to PDF easily.', icon: FileText, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
  { id: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Convert JPG images to PDF in seconds.', icon: ImageIcon, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
  { id: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Extract images or save each page as a JPG.', icon: FileImage, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
  { id: 'ocr-pdf', title: 'OCR PDF', description: 'Make scanned PDFs searchable and selectable.', icon: Type, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { id: 'protect-pdf', title: 'Protect PDF', description: 'Encrypt your PDF with a password.', icon: Shield, color: 'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400' },
  { id: 'unlock-pdf', title: 'Unlock PDF', description: 'Remove password security from your PDF.', icon: ShieldOff, color: 'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400' },
];

export default function PdfToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">PDF Tools</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Everything you need to manage your PDF files.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {PDF_TOOLS.map((tool) => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>
    </div>
  );
}

