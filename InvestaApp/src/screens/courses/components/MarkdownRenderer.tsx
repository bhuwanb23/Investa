import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { CARD_BG, BORDER } from '../constants/courseConstants';

interface MarkdownRendererProps {
  content: string;
  style?: ViewStyle;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mdToHtml(md: string): string {
  let html = '';
  const lines = md.split('\n');
  let i = 0;

  const consumeUntil = (prefix: string): string[] => {
    const block: string[] = [];
    while (i < lines.length) {
      if (lines[i].startsWith(prefix) || lines[i].trim() === '') break;
      block.push(lines[i]);
      i++;
    }
    return block;
  };

  const inline = (text: string): string => {
    return text
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  };

  while (i < lines.length) {
    let line = lines[i];

    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^(#+)/)![1].length;
      const text = line.slice(level + 1);
      html += `<h${level}>${inline(escapeHtml(text))}</h${level}>`;
      i++;
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      i++;
      const code: string[] = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i]);
        i++;
      }
      i++;
      const codeHtml = escapeHtml(code.join('\n'));
      html += `<pre${lang ? ` class="lang-${lang}"` : ''}><code>${codeHtml}</code></pre>`;
    } else if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quote.push(inline(escapeHtml(lines[i].slice(2))));
        i++;
      }
      html += `<blockquote>${quote.join('<br>')}</blockquote>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(`<li>${inline(escapeHtml(lines[i].slice(2)))}</li>`);
        i++;
      }
      html += `<ul>${items.join('')}</ul>`;
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(`<li>${inline(escapeHtml(lines[i].replace(/^\d+\.\s/, '')))}</li>`);
        i++;
      }
      html += `<ol>${items.join('')}</ol>`;
    } else if (line.trim() === '---') {
      html += '<hr>';
      i++;
    } else if (line.trim() === '') {
      i++;
    } else {
      const paragraph: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('```') && !lines[i].startsWith('> ') && !lines[i].startsWith('- ') && !lines[i].startsWith('* ') && !/^\d+\.\s/.test(lines[i]) && lines[i].trim() !== '---') {
        paragraph.push(inline(escapeHtml(lines[i])));
        i++;
      }
      if (paragraph.length) {
        html += `<p>${paragraph.join('<br>')}</p>`;
      }
    }
  }

  return html;
}

const STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: #111827;
    background: #FFFFFF;
    padding: 0;
    overflow: hidden;
  }
  h1 { font-size: 22px; font-weight: 800; margin: 16px 0 8px; color: #111827; }
  h2 { font-size: 18px; font-weight: 800; margin: 14px 0 6px; color: #111827; }
  h3 { font-size: 16px; font-weight: 700; margin: 12px 0 6px; color: #111827; }
  p { margin: 8px 0; color: #111827; }
  strong { font-weight: 800; }
  em { font-style: italic; }
  ul, ol { margin: 8px 0; padding-left: 24px; }
  li { margin: 4px 0; color: #111827; }
  code {
    font-family: 'Courier New', Courier, monospace;
    font-size: 13px;
    background: #F3F4F6;
    padding: 2px 6px;
    border-radius: 4px;
    color: #111827;
  }
  pre {
    background: #0B1020;
    border-radius: 10px;
    padding: 14px;
    margin: 12px 0;
    overflow-x: auto;
  }
  pre code {
    background: transparent;
    padding: 0;
    color: #E5E7EB;
    font-size: 13px;
    line-height: 1.5;
  }
  blockquote {
    border-left: 4px solid #4F46E5;
    padding: 8px 14px;
    margin: 12px 0;
    background: #F9FAFB;
    border-radius: 0 8px 8px 0;
    color: #6B7280;
  }
  a { color: #4F46E5; text-decoration: none; font-weight: 600; }
  img { max-width: 100%; border-radius: 8px; margin: 12px 0; }
  hr { border: none; border-top: 1px solid #E5E7EB; margin: 16px 0; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { border: 1px solid #E5E7EB; padding: 8px 12px; text-align: left; }
  th { background: #F9FAFB; font-weight: 800; }
`;

const HTML_TEMPLATE = (body: string) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style>${STYLES}</style>
</head>
<body>${body}</body>
</html>
`;

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, style }) => {
  const html = useMemo(() => {
    const body = mdToHtml(content);
    return HTML_TEMPLATE(body);
  }, [content]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled={false}
        style={styles.webview}
        originWhitelist={['*']}
        onError={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: 12,
    marginBottom: 16,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default MarkdownRenderer;
