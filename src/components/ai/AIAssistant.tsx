'use client';

import { Bot, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

const SUGGESTIONS = [
  "How do I compress a PDF?",
  "Can you remove backgrounds from images?",
  "How to convert PDF to Word?",
];

export function AIAssistant() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // In a real app, this would send the query to the AI backend
    console.log('Sending query:', query);
    setQuery('');
  };

  return (
    <div className="flex h-[400px] flex-col overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white shadow-sm dark:border-indigo-900/50 dark:from-indigo-950/20 dark:to-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-indigo-100 bg-white p-4 dark:border-indigo-900/50 dark:bg-gray-900">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
          <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">AI Assistant</h3>
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Online
          </p>
        </div>
      </div>

      {/* Chat Area (Empty State with Suggestions) */}
      <div className="flex flex-1 flex-col justify-end p-4">
        <div className="mb-4">
          <div className="mb-3 flex items-start gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
              <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-white p-3 text-sm text-gray-700 shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
              Hi! I'm your AI Office Assistant. How can I help you with your documents today?
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 pl-8">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(suggestion)}
                className="w-fit rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-left text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI anything..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
