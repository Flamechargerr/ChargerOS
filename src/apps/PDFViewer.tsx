import { useState } from 'react';
import { FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

const samplePDF = `
Document Title: Sample PDF Document
=====================================

Table of Contents
-----------------
1. Introduction
2. Main Content
3. Conclusion

1. Introduction
---------------
This is a sample PDF document displayed in the ChargerOS PDF Viewer. 
The viewer supports basic navigation including page traversal, zoom 
controls, and text display.

ChargerOS is a fully functional web-based Linux desktop environment 
that runs entirely in your browser. It features 59 built-in apps 
including this PDF viewer.

2. Main Content
---------------
The PDF viewer renders text-based documents with pagination. Each 
"page" displays a fixed amount of content, and users can navigate 
forward and backward through the document.

Features:
- Page navigation (previous/next)
- Zoom in/out controls
- Page counter display
- Keyboard shortcut support

3. Conclusion
-------------
Thank you for using ChargerOS PDF Viewer. For more features, 
check out the other applications in the system.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse 
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
cupidatat non proident, sunt in culpa qui officia deserunt mollit 
anim id est laborum.
`;

export default function PDFViewer() {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const lines = samplePDF.split('\n');
  const linesPerPage = 40;
  const totalPages = Math.max(1, Math.ceil(lines.length / linesPerPage));
  const pageLines = lines.slice((page - 1) * linesPerPage, page * linesPerPage);

  return (
    <div className="flex flex-col h-full bg-[#525659]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#323639] border-b border-[#444]">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-red-400" />
          <span className="text-white text-sm">sample.pdf</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="text-white/60 hover:text-white"><ZoomOut size={14} /></button>
          <span className="text-white/60 text-xs">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="text-white/60 hover:text-white"><ZoomIn size={14} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} className="text-white/60 hover:text-white"><ChevronLeft size={16} /></button>
          <span className="text-white/60 text-xs">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="text-white/60 hover:text-white"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div className="bg-white shadow-lg p-8 w-[600px]" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
          <pre className="text-black text-xs leading-5 font-mono">{pageLines.join('\n')}</pre>
        </div>
      </div>
    </div>
  );
}
