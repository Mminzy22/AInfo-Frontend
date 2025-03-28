// pdf-generator.js - 클라이언트 측 PDF 생성 유틸리티
/* global html2pdf */

class PDFGenerator {
  constructor() {
    // jsPDF 라이브러리 동적 로드
    this.loadDependencies();
  }
  
  async loadDependencies() {
    // 이미 로드되었는지 확인
    if (window.jspdf && window.html2canvas) return;
  
    // jsPDF와 html2canvas 라이브러리 로드
    const jsPDFScript = document.createElement('script');
    jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  
    const html2canvasScript = document.createElement('script');
    html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  
    document.head.appendChild(jsPDFScript);
    document.head.appendChild(html2canvasScript);
  
    // 스크립트 로드 대기
    return new Promise((resolve) => {
      let loaded = 0;
      const checkBothLoaded = () => {
        loaded++;
        if (loaded === 2) resolve();
      };
  
      jsPDFScript.onload = checkBothLoaded;
      html2canvasScript.onload = checkBothLoaded;
    });
  }
  
  async generatePDF(contentHTML, title = 'Chat Report') {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; font-size: 12px; padding: 20px; }
        h1 { font-size: 20px; margin-bottom: 10px; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
          word-break: break-word;
          table-layout: fixed;
        }
        th, td { border: 1px solid #999; padding: 6px; text-align: left; }
        pre { background: #f6f6f6; padding: 10px; border-radius: 4px; }
        code { font-family: monospace; background: #eee; padding: 2px 4px; border-radius: 4px; }
        .page-break {
          page-break-before: always;
          break-before: page;
        }
      </style>
      <h1>${title}</h1>
      <p style="color:#666; font-size:11px;">생성일: ${new Date().toLocaleString()}</p>
      <hr/>
      ${contentHTML}
    `;
  
    document.body.appendChild(container);
  
    const opt = {
      margin:       5,
      filename:     `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
  
    await html2pdf().from(container).set(opt).save();
    container.remove();
  }
  
  
  // HTML에서 텍스트 추출
  extractTextFromHTML(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }
  
  // 콘텐츠에서 제목 생성
  generateTitleFromContent(content, maxLength = 30) {
    const text = this.extractTextFromHTML(content);
    const words = text.split(/\s+/);
    let title = words.slice(0, 5).join(' ');
  
    if (title.length > maxLength) {
      title = title.substring(0, maxLength) + '...';
    }
  
    return title || 'Chat Report';
  }
}
  
export default new PDFGenerator();
    