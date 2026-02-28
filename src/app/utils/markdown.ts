// Simple markdown-to-HTML parser for rendered content
function parseMarkdown(content: string): string {
  let html = content
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Scripture references (e.g., John 3:16, Romans 12:1-2)
    .replace(/([A-Za-z]+ \d+:\d+(?:-\d+)?)/g, '<span class="scripture-ref">$1</span>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  return `<p>${html}</p>`;
}

// Detect content type and apply specific styling
function detectSections(content: string): { type: string; content: string }[] {
  const sections: { type: string; content: string }[] = [];
  
  // Split by main headers
  const parts = content.split(/(?=^#{1,3} )/gm);
  
  parts.forEach(part => {
    if (!part.trim()) return;
    
    const headerMatch = part.match(/^(#{1,3})\s+(.+)$/m);
    const body = part.replace(/^#{1,3}\s+.+$/m, '').trim();
    
    if (headerMatch) {
      const level = headerMatch[1].length;
      const title = headerMatch[2];
      
      if (level === 1) {
        sections.push({ type: 'title', content: title });
      } else if (level === 2) {
        sections.push({ type: 'section', content: title });
      } else {
        sections.push({ type: 'subsection', content: title });
      }
    }
    
    if (body) {
      sections.push({ type: 'body', content: body });
    }
  });
  
  return sections.length > 0 ? sections : [{ type: 'body', content }];
}

export { parseMarkdown, detectSections };
