'use client';

import { Upload, ShieldCheck, Zap, ThumbsUp, FileText, Image as ImageIcon, FileSpreadsheet, Bot } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 p-8 sm:p-12 md:p-16 dark:from-indigo-950 dark:via-purple-950/50 dark:to-blue-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
        {/* Left Side: Content & Upload */}
        <div className="flex flex-col justify-center">
          <div className="mb-6 flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-indigo-800 shadow-sm backdrop-blur-sm dark:bg-black/20 dark:text-indigo-300">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Secure
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-indigo-800 shadow-sm backdrop-blur-sm dark:bg-black/20 dark:text-indigo-300">
              <Zap className="h-3.5 w-3.5" /> AI Powered
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-indigo-800 shadow-sm backdrop-blur-sm dark:bg-black/20 dark:text-indigo-300">
              <ThumbsUp className="h-3.5 w-3.5" /> Easy to Use
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-950 dark:text-white sm:text-5xl lg:text-6xl">
            One AI for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Every Document
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-gray-700 dark:text-gray-300">
            Merge, compress, and edit PDFs. Remove backgrounds, resize images, and chat with your documents using powerful AI tools.
          </p>

          {/* Upload Zone */}
          <div className="mt-8 relative group cursor-pointer" onClick={() => document.getElementById('hero-upload')?.click()}>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-300 bg-white/80 p-10 text-center backdrop-blur-xl transition-colors hover:border-indigo-500 hover:bg-white dark:border-indigo-700 dark:bg-gray-900/80 dark:hover:border-indigo-500 dark:hover:bg-gray-900">
              <div className="mb-4 rounded-full bg-indigo-50 p-4 dark:bg-indigo-900/50">
                <Upload className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Drag & drop your file here
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                or click to browse from your computer
              </p>
              <input
                id="hero-upload"
                type="file"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.type === 'application/pdf') {
                    window.location.href = '/chat-with-pdf';
                  } else if (file.type.startsWith('image/')) {
                    window.location.href = '/remove-bg';
                  } else {
                    window.location.href = '/pdf-tools';
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="relative hidden items-center justify-center lg:flex">
          <div className="relative h-96 w-96">
            {/* Center Robot */}
            <div className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl bg-white shadow-2xl shadow-indigo-500/20 dark:bg-gray-900">
              <Bot className="h-24 w-24 text-indigo-600 dark:text-indigo-400" />
            </div>

            {/* Floating Icons */}
            <div className="absolute left-0 top-10 flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-red-100 shadow-lg dark:bg-red-900/50" style={{ animationDelay: '0s', animationDuration: '3s' }}>
              <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            
            <div className="absolute right-0 top-20 flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-blue-100 shadow-lg dark:bg-blue-900/50" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="absolute bottom-10 left-10 flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-green-100 shadow-lg dark:bg-green-900/50" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>
              <FileSpreadsheet className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>

            <div className="absolute bottom-20 right-10 flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-purple-100 shadow-lg dark:bg-purple-900/50" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}>
              <ImageIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            
            {/* Connecting lines / decorative circles */}
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-indigo-200 dark:border-indigo-800" />
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-purple-200 dark:border-purple-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
