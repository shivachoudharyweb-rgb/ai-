'use client';

import { ToolCard } from '@/components/tools/ToolCard';
import { MessageSquare, FileText, Globe, FormInput, CheckCircle2 } from 'lucide-react';

const AI_TOOLS = [
  { id: 'chat-with-pdf', title: 'Chat with PDF', description: 'Ask questions and extract data from any PDF document.', icon: MessageSquare, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400', badge: 'Popular' },
  { id: 'ai-summary', title: 'AI Document Summary', description: 'Get instant summaries of long documents.', icon: FileText, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
  { id: 'ai-translator', title: 'AI Translator', description: 'Translate documents into 50+ languages instantly.', icon: Globe, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
  { id: 'ai-form-ready', title: 'AI Form Ready', description: 'Automatically extract form fields and data.', icon: FormInput, color: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400' },
  { id: 'grammar-checker', title: 'Grammar Checker', description: 'Proofread and correct grammar in your documents.', icon: CheckCircle2, color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
];

export default function AIToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">AI Tools</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Supercharge your productivity with state-of-the-art AI document tools.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {AI_TOOLS.map((tool) => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>
    </div>
  );
}

