'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Merge, Scissors, FileDown, FileText, ImageIcon, FileImage, Type, Shield, ShieldOff, UploadCloud, File as FileIcon, X, Download, Loader2, Eraser, Maximize, Minimize, UserSquare2, ScanFace, Droplets, ArrowUpCircle, Crop, Palette, MessageSquare, Globe, FormInput, CheckCircle2, Bot } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { mergePDFs } from '@/lib/tools/pdf/pdfMerge';
import { splitPDF } from '@/lib/tools/pdf/pdfSplit';
import { compressPDF } from '@/lib/tools/pdf/pdfCompress';
import { pdfToWord } from '@/lib/tools/pdf/pdfToWord';
import { wordToPdf } from '@/lib/tools/pdf/wordToPdf';
import { jpgToPdf } from '@/lib/tools/pdf/jpgToPdf';
import { pdfToJpg } from '@/lib/tools/pdf/pdfToJpg';
import { ocrPDF } from '@/lib/tools/pdf/ocrPDF';
import { protectPDF } from '@/lib/tools/pdf/protectPDF';
import { unlockPDF } from '@/lib/tools/pdf/unlockPDF';

// Image tools
import { removeBackground } from '@/lib/tools/image/removeBackground';
import { resizeImage } from '@/lib/tools/image/imageResize';
import { compressImage } from '@/lib/tools/image/imageCompress';
import { createPassportPhoto } from '@/lib/tools/image/passportPhoto';
import { blurFace } from '@/lib/tools/image/blurFace';
import { watermarkImage } from '@/lib/tools/image/watermarkImage';
import { cropImage } from '@/lib/tools/image/cropImage';
import { upscaleImage } from '@/lib/tools/image/upscaleImage';
import { colorizePhoto } from '@/lib/tools/image/colorizePhoto';

// AI tools
import { chatWithAI, aiSummarize, aiTranslator, aiFormReady, grammarChecker } from '@/lib/tools/ai/aiMocks';

// Tool metadata mapping
export const TOOLS_METADATA: Record<string, any> = {
  'merge-pdf': { title: 'Merge PDF', icon: Merge, type: 'pdf', accepts: { 'application/pdf': ['.pdf'] }, multiple: true },
  'split-pdf': { title: 'Split PDF', icon: Scissors, type: 'pdf', accepts: { 'application/pdf': ['.pdf'] }, multiple: false, hasOptions: true },
  'compress-pdf': { title: 'Compress PDF', icon: FileDown, type: 'pdf', accepts: { 'application/pdf': ['.pdf'] }, multiple: false },
  'pdf-to-word': { title: 'PDF to Word', icon: FileText, type: 'pdf', accepts: { 'application/pdf': ['.pdf'] }, multiple: false },
  'word-to-pdf': { title: 'Word to PDF', icon: FileText, type: 'pdf', accepts: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }, multiple: false },
  'jpg-to-pdf': { title: 'JPG to PDF', icon: ImageIcon, type: 'pdf', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: true },
  'pdf-to-jpg': { title: 'PDF to JPG', icon: FileImage, type: 'pdf', accepts: { 'application/pdf': ['.pdf'] }, multiple: false },
  'ocr-pdf': { title: 'OCR PDF', icon: Type, type: 'pdf', accepts: { 'application/pdf': ['.pdf'] }, multiple: false },
  'protect-pdf': { title: 'Protect PDF', icon: Shield, type: 'pdf', accepts: { 'application/pdf': ['.pdf'] }, multiple: false, hasOptions: true },
  'unlock-pdf': { title: 'Unlock PDF', icon: ShieldOff, type: 'pdf', accepts: { 'application/pdf': ['.pdf'] }, multiple: false, hasOptions: true },
  // Image Tools
  'remove-bg': { title: 'Remove Background', icon: Eraser, type: 'image', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: false },
  'resize-image': { title: 'Resize Image', icon: Maximize, type: 'image', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: false, hasOptions: true },
  'compress-image': { title: 'Compress Image', icon: Minimize, type: 'image', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: false },
  'image-to-pdf': { title: 'Image to PDF', icon: FileText, type: 'image', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: true },
  'profile-pic': { title: 'Profile Pic Maker', icon: UserSquare2, type: 'image', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: false },
  'blur-face': { title: 'Blur Face', icon: ScanFace, type: 'image', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: false },
  'watermark-image': { title: 'Watermark Image', icon: Droplets, type: 'image', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: false, hasOptions: true },
  'upscale-image': { title: 'Image Upscaler', icon: ArrowUpCircle, type: 'image', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: false },
  'crop-image': { title: 'Crop Image', icon: Crop, type: 'image', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: false },
  'colorize-photo': { title: 'Colorize Photo', icon: Palette, type: 'image', accepts: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: false },
  // AI Tools
  'chat-with-pdf': { title: 'Chat with PDF', icon: MessageSquare, type: 'ai', accepts: { 'application/pdf': ['.pdf'] }, multiple: false, hasOptions: true },
  'ai-summary': { title: 'AI Document Summary', icon: FileText, type: 'ai', accepts: { 'application/pdf': ['.pdf'] }, multiple: false },
  'ai-translator': { title: 'AI Translator', icon: Globe, type: 'ai', accepts: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }, multiple: false, hasOptions: true },
  'ai-form-ready': { title: 'AI Form Ready', icon: FormInput, type: 'ai', accepts: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.png'] }, multiple: false },
  'grammar-checker': { title: 'Grammar Checker', icon: CheckCircle2, type: 'ai', accepts: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] }, multiple: false },
};

export function ClientToolPage({ toolId }: { toolId: string }) {
  const router = useRouter();
  const tool = TOOLS_METADATA[toolId];

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [textResult, setTextResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Read text blobs for AI chat
  useEffect(() => {
    if (resultBlob && resultBlob.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextResult(e.target?.result as string);
      };
      reader.readAsText(resultBlob);
    } else {
      setTextResult(null);
    }
  }, [resultBlob]);

  // Tool specific options
  const [password, setPassword] = useState('');
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  
  // Image tool specific options
  const [imgWidth, setImgWidth] = useState(800);
  const [imgHeight, setImgHeight] = useState(600);
  const [watermarkText, setWatermarkText] = useState("AI OFFICE");
  
  // AI tool specific options
  const [aiQuery, setAiQuery] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');

  const { user, setAuthModalOpen } = useAuthStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (tool?.multiple) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    } else {
      setFiles([acceptedFiles[0]]);
    }
    setResultBlob(null);
    setError(null);
  }, [tool, user, setAuthModalOpen]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: tool?.accepts,
    multiple: tool?.multiple
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      let result: Blob;
      
      switch (toolId) {
        case 'merge-pdf':
          result = await mergePDFs(files);
          break;
        case 'split-pdf':
          result = await splitPDF(files[0], startPage, endPage);
          break;
        case 'compress-pdf':
          result = await compressPDF(files[0]);
          break;
        case 'pdf-to-word':
          result = await pdfToWord(files[0]);
          break;
        case 'word-to-pdf':
          result = await wordToPdf(files[0]);
          break;
        case 'jpg-to-pdf':
          result = await jpgToPdf(files);
          break;
        case 'pdf-to-jpg':
          result = await pdfToJpg(files[0]);
          break;
        case 'ocr-pdf':
          result = await ocrPDF(files[0]);
          break;
        case 'protect-pdf':
          if (!password) throw new Error("Password is required");
          result = await protectPDF(files[0], password);
          break;
        case 'unlock-pdf':
          if (!password) throw new Error("Password is required");
          result = await unlockPDF(files[0], password);
          break;
          
        // Image Tools
        case 'remove-bg':
          result = await removeBackground(files[0]);
          break;
        case 'resize-image':
          result = await resizeImage(files[0], imgWidth, imgHeight);
          break;
        case 'compress-image':
          result = await compressImage(files[0], 0.6);
          break;
        case 'image-to-pdf': // from image-tools/page.tsx
          result = await jpgToPdf(files);
          break;
        case 'profile-pic':
          result = await createPassportPhoto(files[0]);
          break;
        case 'blur-face':
          result = await blurFace(files[0]);
          break;
        case 'watermark-image':
          result = await watermarkImage(files[0], watermarkText);
          break;
        case 'upscale-image':
          result = await upscaleImage(files[0]);
          break;
        case 'crop-image':
          // Mock crop bounds for now (10% border)
          result = await cropImage(files[0], 50, 50, 400, 400); 
          break;
        case 'colorize-photo':
          result = await colorizePhoto(files[0]);
          break;
          
        // AI Tools
        case 'chat-with-pdf':
          if (!aiQuery) throw new Error("Please enter a message for the AI");
          result = await chatWithAI(files[0], aiQuery);
          break;
        case 'ai-summary':
          result = await aiSummarize(files[0]);
          break;
        case 'ai-translator':
          result = await aiTranslator(files[0], targetLang);
          break;
        case 'ai-form-ready':
          result = await aiFormReady(files[0]);
          break;
        case 'grammar-checker':
          result = await grammarChecker(files[0]);
          break;
          
        default:
          throw new Error('Tool not implemented yet');
      }

      setResultBlob(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    
    // Determine extension
    let ext = '.pdf';
    if (toolId === 'pdf-to-word') ext = '.docx';
    if (toolId === 'pdf-to-jpg' && resultBlob.type === 'application/zip') ext = '.zip';
    if (toolId === 'pdf-to-jpg' && resultBlob.type === 'image/jpeg') ext = '.jpg';
    if (tool.type === 'image' && toolId !== 'image-to-pdf') {
      ext = resultBlob.type === 'image/png' ? '.png' : '.jpg';
    }
    
    a.download = `result-${toolId}${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tool Not Found</h1>
        <p className="mt-2 text-gray-500">The tool you are looking for does not exist or has not been implemented yet.</p>
        <button onClick={() => router.push('/dashboard')} className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white">Go Home</button>
      </div>
    );
  }

  const Icon = tool.icon;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/20">
          <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tool.title}</h1>
          <p className="text-gray-500 dark:text-gray-400">Process your files securely in your browser.</p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Upload & Options */}
        <div className="col-span-1 space-y-6 md:col-span-2">
          
          {/* Upload Zone */}
          {!resultBlob && (
            <div 
              {...getRootProps()} 
              className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center transition-colors ${
                isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800'
              }`}
            >
              <input {...getInputProps()} />
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
                <UploadCloud className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                {isDragActive ? 'Drop files here' : 'Select or drop files'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tool.multiple ? 'You can select multiple files.' : 'Select a single file to process.'}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <span className="font-bold">Error: </span>{error}
            </div>
          )}

          {/* Success / Result Zone */}
          {resultBlob && !textResult && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-green-100 bg-green-50 p-12 text-center dark:border-green-900/30 dark:bg-green-900/10">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <FileDown className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Processing Complete!</h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Your file is ready to download.</p>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 w-full sm:w-auto"
                >
                  <Download className="h-5 w-5" />
                  Download
                </button>
                <button 
                  onClick={async () => {
                    if (!resultBlob) return;
                    try {
                      // Determine extension
                      let ext = '.pdf';
                      if (toolId === 'pdf-to-word') ext = '.docx';
                      if (toolId === 'pdf-to-jpg' && resultBlob.type === 'application/zip') ext = '.zip';
                      if (toolId === 'pdf-to-jpg' && resultBlob.type === 'image/jpeg') ext = '.jpg';
                      if (tool.type === 'image' && toolId !== 'image-to-pdf') {
                        ext = resultBlob.type === 'image/png' ? '.png' : '.jpg';
                      }
                      
                      const fileToUpload = new File([resultBlob], `result-${toolId}${ext}`, { type: resultBlob.type });
                      const formData = new FormData();
                      formData.append('file', fileToUpload);
                      formData.append('tool_used', tool.title);
                      
                      const res = await fetch('/api/v1/files', {
                        method: 'POST',
                        body: formData
                      });
                      
                      if (!res.ok) throw new Error('Upload failed');
                      alert('Saved to cloud successfully! Check My Files.');
                    } catch (err) {
                      alert('Failed to save to cloud.');
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
                >
                  <UploadCloud className="h-5 w-5" />
                  Save to Cloud
                </button>
                <button 
                  onClick={() => { setResultBlob(null); setFiles([]); }}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 w-full sm:w-auto"
                >
                  Process Another
                </button>
              </div>
            </div>
          )}

          {/* Text Result Zone (For AI Tools) */}
          {textResult && (
            <div className="flex flex-col rounded-3xl border border-indigo-100 bg-indigo-50/50 p-8 dark:border-indigo-900/30 dark:bg-indigo-900/10">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bot className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                AI Response
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200">
                {textResult}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <button 
                  onClick={async () => {
                    if (!textResult) return;
                    try {
                      const fileToUpload = new File([textResult], `result-${toolId}.txt`, { type: 'text/plain' });
                      const formData = new FormData();
                      formData.append('file', fileToUpload);
                      formData.append('tool_used', tool.title);
                      
                      const res = await fetch('/api/v1/files', {
                        method: 'POST',
                        body: formData
                      });
                      
                      if (!res.ok) throw new Error('Upload failed');
                      alert('Saved to cloud successfully! Check My Files.');
                    } catch (err) {
                      alert('Failed to save to cloud.');
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
                >
                  <UploadCloud className="h-5 w-5" />
                  Save to Cloud
                </button>
                <button 
                  onClick={() => { setResultBlob(null); setFiles([]); }}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 w-full sm:w-auto"
                >
                  Process Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Files & Actions */}
        <div className="col-span-1 flex flex-col gap-6">
          
          {/* Options Panel (if applicable) */}
          {tool.hasOptions && files.length > 0 && !resultBlob && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h4 className="mb-4 font-bold text-gray-900 dark:text-white">Tool Options</h4>
              
              {(toolId === 'protect-pdf' || toolId === 'unlock-pdf') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    placeholder="Enter password"
                  />
                </div>
              )}

              {toolId === 'split-pdf' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From Page</label>
                    <input 
                      type="number" 
                      min={1}
                      value={startPage}
                      onChange={(e) => setStartPage(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To Page</label>
                    <input 
                      type="number" 
                      min={1}
                      value={endPage}
                      onChange={(e) => setEndPage(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                </div>
              )}
              
              {toolId === 'resize-image' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Width (px)</label>
                    <input type="number" min={1} value={imgWidth} onChange={(e) => setImgWidth(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Height (px)</label>
                    <input type="number" min={1} value={imgHeight} onChange={(e) => setImgHeight(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                  </div>
                </div>
              )}
              
              {toolId === 'watermark-image' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Watermark Text</label>
                  <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                </div>
              )}
              
              {toolId === 'chat-with-pdf' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ask a Question</label>
                  <textarea value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="What is this document about?" rows={3} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"></textarea>
                </div>
              )}
              
              {toolId === 'ai-translator' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Language</label>
                  <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Selected Files List */}
          {files.length > 0 && !resultBlob && (
            <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h4 className="mb-4 font-bold text-gray-900 dark:text-white">Selected Files</h4>
              <ul className="space-y-3">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-950">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileIcon className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                      <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                        {file.name}
                      </span>
                    </div>
                    <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={handleProcess}
                disabled={isProcessing}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process Files'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
