import { pdfjs } from 'react-pdf';

// Fix worker configuration for Next.js 
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export async function convertPdfToWebPFiles(file, onProgress) {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load PDF
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const webpFiles = [];

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) onProgress(i, numPages);
    
    const page = await pdf.getPage(i);
    const scale = 2.0; 
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    const blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', 0.8);
    });

    const webpFile = new File([blob], `slide_${i}.webp`, { type: 'image/webp' });
    webpFiles.push(webpFile);
  }

  return webpFiles;
}
