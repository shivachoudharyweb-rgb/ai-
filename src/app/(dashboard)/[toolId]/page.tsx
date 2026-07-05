import { Metadata } from 'next';
import { ClientToolPage, TOOLS_METADATA } from '@/components/tools/ClientToolPage';

const SEO_KEYWORDS: Record<string, string> = {
  'merge-pdf': 'Combine Multiple PDF Files into One Document Online',
  'split-pdf': 'Extract Pages from PDF & Split PDF Online Free',
  'compress-pdf': 'Reduce PDF File Size Online Without Losing Quality',
  'pdf-to-word': 'Convert PDF to Editable Word Document Free No Email',
  'word-to-pdf': 'Convert Word DOCX to PDF Online Free Fast',
  'chat-with-pdf': 'Free AI PDF Reader & Document Summarizer Tool Online',
  'remove-bg': 'Free AI Image Background Remover Transparent PNG',
  'ai-summary': 'AI Document Summarizer Tool - Shorten Long Text Free',
  'ai-translator': 'Free AI PDF Document Translator Online Preserves Layout',
  'profile-pic': 'Create Professional Passport Photo & LinkedIn Profile Picture AI',
};

export async function generateMetadata({ params }: { params: Promise<{ toolId: string }> }): Promise<Metadata> {
  const { toolId } = await params;
  const tool = TOOLS_METADATA[toolId];
  
  if (!tool) {
    return { title: 'Tool Not Found' };
  }

  const keywordSuffix = SEO_KEYWORDS[toolId] || `Free Online ${tool.title} Tool`;
  const title = `${tool.title} - ${keywordSuffix}`;
  const description = `Looking to ${tool.title.toLowerCase()}? Use our free, fast, and secure AI-powered tool. ${keywordSuffix}. Process documents securely in your browser with zero data retention.`;

  return {
    title,
    description,
    keywords: [tool.title, tool.title.toLowerCase(), 'free online', 'AI tool', keywordSuffix],
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  const tool = TOOLS_METADATA[toolId];

  if (!tool) {
    return <ClientToolPage toolId={toolId} />;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${tool.title} - AI Office Suite`,
    operatingSystem: 'Web',
    applicationCategory: 'BusinessApplication',
    description: `Free online tool for ${tool.title}. Secure, fast, and AI-powered.`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="flex flex-col gap-12 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* The main interactive tool */}
      <ClientToolPage toolId={toolId} />

      {/* SEO Content Section */}
      <div className="mx-auto max-w-4xl px-4 pt-12 border-t border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
          Why use our {tool.title} tool?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 text-gray-600 dark:text-gray-400">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast & Secure Processing</h3>
            <p className="text-sm leading-relaxed">
              All files are processed securely. We prioritize your privacy and automatically delete your files from our servers after processing is complete. You can also save them to your private cloud storage.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Results</h3>
            <p className="text-sm leading-relaxed">
              Our {tool.title} tool is powered by advanced AI models to ensure the highest quality results. Whether you are merging PDFs, compressing images, or extracting text, AI ensures accuracy.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Free to Use</h3>
            <p className="text-sm leading-relaxed">
              Start using the {tool.title} tool entirely for free. We offer generous limits for free users, with premium plans available for professionals who need higher volumes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Installation Required</h3>
            <p className="text-sm leading-relaxed">
              Access the tool directly from your browser on Windows, Mac, Linux, or mobile devices. No need to download heavy software or worry about updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
