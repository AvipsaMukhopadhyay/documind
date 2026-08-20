const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Failed to process document');
  }

  return response.json();
}

export async function summarizeText(text, summaryLength = 'medium') {
  const response = await fetch(`${API_BASE_URL}/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      summary_length: summaryLength,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Summarization failed' }));
    throw new Error(err.detail || 'Failed to generate summary');
  }

  return response.json();
}