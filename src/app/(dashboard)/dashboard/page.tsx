'use client';

import { HeroSection } from '@/components/hero/HeroSection';
import { UsageMetrics } from '@/components/billing/UsageMetrics';
import { ToolCard } from '@/components/tools/ToolCard';
import { FileText, FileDown, Scissors, Merge, Shield, Eraser, Maximize, Minimize, UserSquare2, MessageSquare, Globe, FormInput, ShieldCheck, Zap, Clock, Laptop } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

// Reusing subsets for the homepage display
const POPULAR_PDF_TOOLS = [
  { id: 'merge-pdf', title: 'Merge PDF', description: 'Combine multiple PDFs into one unified document.', icon: Merge, color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
  { id: 'split-pdf', title: 'Split PDF', description: 'Extract pages or split a PDF into multiple files.', icon: Scissors, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
  { id: 'compress-pdf', title: 'Compress PDF', description: 'Reduce file size while optimizing for maximal quality.', icon: FileDown, color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert your PDFs to editable Word documents.', icon: FileText, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400', badge: 'Popular' },
  { id: 'protect-pdf', title: 'Protect PDF', description: 'Encrypt your PDF with a password.', icon: Shield, color: 'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400' },
];

const POPULAR_IMAGE_TOOLS = [
  { id: 'remove-bg', title: 'Remove Background', description: 'Automatically remove image backgrounds with AI.', icon: Eraser, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400', badge: 'AI' },
  { id: 'resize-image', title: 'Resize Image', description: 'Change image dimensions easily.', icon: Maximize, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' },
  { id: 'compress-image', title: 'Compress Image', description: 'Reduce image file size with zero quality loss.', icon: Minimize, color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
  { id: 'image-to-pdf', title: 'Image to PDF', description: 'Convert your images to PDF documents.', icon: FileText, color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
  { id: 'profile-pic', title: 'Profile Pic Maker', description: 'Create professional profile pictures.', icon: UserSquare2, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
];

const POPULAR_AI_TOOLS = [
  { id: 'chat-with-pdf', title: 'Chat with PDF', description: 'Ask questions and extract data from any PDF document.', icon: MessageSquare, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400', badge: 'Popular' },
  { id: 'ai-summary', title: 'AI Document Summary', description: 'Get instant summaries of long documents.', icon: FileText, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
  { id: 'ai-translator', title: 'AI Translator', description: 'Translate documents into 50+ languages instantly.', icon: Globe, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
  { id: 'ai-form-ready', title: 'AI Form Ready', description: 'Automatically extract form fields and data.', icon: FormInput, color: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400' },
];

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      <Link href={href} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
        View all &rarr;
      </Link>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30">
        <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h4 className="mb-2 font-bold text-gray-900 dark:text-gray-100">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

export default function DashboardHomepage() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <HeroSection />
        </div>
        <div className="xl:col-span-1">
          <UsageMetrics />
        </div>
      </div>

      <section>
        <SectionHeader title="Popular PDF Tools" href="/pdf-tools" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {POPULAR_PDF_TOOLS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Popular Image Tools" href="/image-tools" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {POPULAR_IMAGE_TOOLS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="AI Tools" href="/ai-tools" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {POPULAR_AI_TOOLS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard icon={ShieldCheck} title="Secure & Private" description="Your files are encrypted and automatically deleted after 2 hours." />
        <FeatureCard icon={Zap} title="AI Powered" description="State-of-the-art models handle complex document processing." />
        <FeatureCard icon={Clock} title="Fast Processing" description="Optimized infrastructure delivers results in seconds." />
        <FeatureCard icon={Laptop} title="Works Everywhere" description="Access your tools on desktop, tablet, and mobile devices." />
      </section>
    </div>
  );
}

