'use client';

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AISupportChat() {
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; content: string }[]>([
    { role: 'bot', content: 'Hi there! I am the AI Support Assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // We reuse the existing AI chat endpoint, but prefix the prompt to act as customer support
      const prompt = `You are a helpful customer support agent for 'AI Office Suite'. The user asks: ${userMessage}`;
      const res = await fetch('/api/v1/tools/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();
      
      setMessages((prev) => [...prev, { role: 'bot', content: data.result || 'Sorry, I am having trouble connecting right now.' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', content: 'An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[500px] flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3 border-b border-gray-100 p-4 dark:border-gray-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Premium AI Support</h3>
          <p className="text-xs text-gray-500">Always online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn("flex max-w-[80%] gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                msg.role === 'user' 
                  ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
              )}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn(
                "rounded-2xl px-4 py-2 text-sm",
                msg.role === 'user'
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              )}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[80%] gap-3 flex-row">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                <span className="flex gap-1 items-center h-5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 p-4 dark:border-gray-800">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none dark:text-gray-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
