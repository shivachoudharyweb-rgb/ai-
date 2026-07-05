// Helper to extract text from a file using our API
async function extractTextFromFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/v1/tools/pdf/extract', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to extract text from document.');
  }

  const data = await res.json();
  return data.text || '';
}

// Helper to ask AI
async function askAI(prompt: string): Promise<string> {
  const response = await fetch('/api/v1/tools/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  
  if (!response.ok) {
    throw new Error('Error connecting to AI service.');
  }
  
  const data = await response.json();
  return data.result || 'No response generated.';
}

function createTextBlob(content: string): Blob {
  return new Blob([content], { type: 'text/plain' });
}

export async function chatWithAI(file: File, query: string): Promise<Blob> {
  let textContent = '';
  try {
    const extractedText = await extractTextFromFile(file);
    const prompt = `Context from document "${file.name}":\n\n${extractedText.substring(0, 15000)}\n\nUser Query: ${query}\n\nPlease answer the user's query based ONLY on the context provided above.`;
    textContent = await askAI(prompt);
  } catch (err: any) {
    textContent = `Error: ${err.message}`;
  }
  return createTextBlob(textContent);
}

export async function aiSummarize(file: File): Promise<Blob> {
  let textContent = '';
  try {
    const extractedText = await extractTextFromFile(file);
    const prompt = `Please provide a concise, high-level summary of the following document named "${file.name}":\n\n${extractedText.substring(0, 15000)}`;
    textContent = await askAI(prompt);
  } catch (err: any) {
    textContent = `Error: ${err.message}`;
  }
  return createTextBlob(textContent);
}

export async function aiTranslator(file: File, targetLanguage: string): Promise<Blob> {
  let textContent = '';
  try {
    const extractedText = await extractTextFromFile(file);
    const prompt = `Translate the following text from document "${file.name}" to ${targetLanguage}. Keep the original formatting and meaning intact:\n\n${extractedText.substring(0, 5000)}`;
    textContent = await askAI(prompt);
  } catch (err: any) {
    textContent = `Error: ${err.message}`;
  }
  return createTextBlob(textContent);
}

export async function aiFormReady(file: File): Promise<Blob> {
  let textContent = '';
  try {
    const extractedText = await extractTextFromFile(file);
    const prompt = `Extract any potential form fields and their values (or empty states) from the following document named "${file.name}". Output them as a clean, readable Markdown list or key-value format:\n\n${extractedText.substring(0, 10000)}`;
    textContent = await askAI(prompt);
  } catch (err: any) {
    textContent = `Error: ${err.message}`;
  }
  return createTextBlob(textContent);
}

export async function grammarChecker(file: File): Promise<Blob> {
  let textContent = '';
  try {
    const extractedText = await extractTextFromFile(file);
    const prompt = `Review the following text from document "${file.name}" for grammatical errors. Provide a list of the errors found, the corrected text, and a brief explanation for each correction:\n\n${extractedText.substring(0, 8000)}`;
    textContent = await askAI(prompt);
  } catch (err: any) {
    textContent = `Error: ${err.message}`;
  }
  return createTextBlob(textContent);
}
