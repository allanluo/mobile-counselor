// Minimal markdown renderer (headings, bold, ordered lists, paragraphs)
export const renderMarkdownToHtml = (markdown: string) => {
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const formatInline = (text: string) =>
    escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  const lines = markdown.split('\n');
  let html = '';
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line) {
      if (inList) {
        html += '</ol>';
        inList = false;
      }
      continue;
    }

    const headingMatch = line.match(/^(#+)\s+(.*)/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 6);
      const content = formatInline(headingMatch[2]);
      if (inList) {
        html += '</ol>';
        inList = false;
      }
      html += `<h${level}>${content}</h${level}>`;
      continue;
    }

    const listMatch = line.match(/^\d+\.\s+(.*)/);
    if (listMatch) {
      if (!inList) {
        html += '<ol>';
        inList = true;
      }
      html += `<li>${formatInline(listMatch[1])}</li>`;
      continue;
    }

    if (inList) {
      html += '</ol>';
      inList = false;
    }

    html += `<p>${formatInline(line)}</p>`;
  }

  if (inList) {
    html += '</ol>';
  }

  return html;
};
