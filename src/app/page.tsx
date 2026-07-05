import Link from 'next/link';
import { ArrowRight, FileText, Zap, ShieldCheck, Star } from 'lucide-react';

export const metadata = {
  title: 'AI Office Suite - One AI Workspace for Every Document',
  description: 'The Fastest AI Document Toolkit for Modern Teams. Merge PDFs, remove backgrounds, chat with documents, and more.',
};

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#0B0F19]">
      {/* Marketing Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              AI Office
            </span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">Features</Link>
            <Link href="#tools" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">Tools</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-gray-900 dark:text-white hover:opacity-80">
              Log in
            </Link>
            <Link 
              href="/dashboard"
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                One AI Workspace for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Every Document</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                The fastest AI document toolkit for modern teams. Merge, convert, compress, and analyze your PDFs and images securely in your browser.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/dashboard"
                  className="group flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="#tools" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  View Tools <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Everything you need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                No more jumping between different apps
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
                    <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">AI-Powered Workflows</dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                    Chat with your PDFs, remove image backgrounds instantly, and translate documents with state-of-the-art AI models.
                  </dd>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
                    <ShieldCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">Bank-Grade Security</dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                    Your files are processed securely and deleted automatically. We never train our AI on your confidential data.
                  </dd>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
                    <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">25+ Professional Tools</dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                    Merge, compress, split, convert, and edit. Replace five different subscriptions with one comprehensive suite.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">
              Popular Tools
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Link href="/merge-pdf" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all dark:bg-gray-900 dark:border-gray-800">
                <span className="font-semibold text-gray-900 dark:text-white">Merge PDF</span>
              </Link>
              <Link href="/chat-with-pdf" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all dark:bg-gray-900 dark:border-gray-800">
                <span className="font-semibold text-gray-900 dark:text-white">Chat with PDF</span>
              </Link>
              <Link href="/remove-bg" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all dark:bg-gray-900 dark:border-gray-800">
                <span className="font-semibold text-gray-900 dark:text-white">Remove Background</span>
              </Link>
              <Link href="/pdf-to-word" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all dark:bg-gray-900 dark:border-gray-800">
                <span className="font-semibold text-gray-900 dark:text-white">PDF to Word</span>
              </Link>
            </div>
            <div className="mt-12">
              <Link href="/dashboard" className="text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400">
                View all 25+ tools →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AI Office Suite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
