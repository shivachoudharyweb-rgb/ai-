import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | AI Office Suite',
    default: 'AI Office Suite — 25 AI-Powered Document Tools',
  },
  description:
    'Merge, split, compress PDFs. Remove backgrounds, resize images, generate passport photos. All powered by AI. Free to start.',
  keywords: [
    'PDF tools', 'image tools', 'AI documents', 'compress PDF',
    'background remover', 'OCR', 'Chat with PDF', 'AI Office Suite',
  ],
  openGraph: {
    siteName: 'AI Office Suite',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head />
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          <TooltipProvider delay={300}>
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
