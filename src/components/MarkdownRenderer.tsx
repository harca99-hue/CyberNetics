import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

type BlockToken =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'hr' }
  | { type: 'paragraph'; text: string };

function isSafeUrl(rawUrl: string): boolean {
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith('/')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] !== undefined && match[3] !== undefined) {
      const label = match[2];
      const href = match[3].trim();
      if (isSafeUrl(href)) {
        nodes.push(
          <a
            key={`lnk-${keyIdx++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/40 underline-offset-2"
          >
            <span>{label}</span>
            <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
      } else {
        nodes.push(label);
      }
    } else if (match[4] !== undefined) {
      nodes.push(
        <code
          key={`code-${keyIdx++}`}
          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-cyan-300 text-[11px] font-mono"
        >
          {match[4]}
        </code>
      );
    } else if (match[5] !== undefined) {
      nodes.push(
        <strong key={`b-${keyIdx++}`} className="text-white font-bold">
          {match[5]}
        </strong>
      );
    } else if (match[6] !== undefined) {
      nodes.push(
        <em key={`i-${keyIdx++}`} className="text-slate-200 italic">
          {match[6]}
        </em>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function tokenizeMarkdown(raw: string): BlockToken[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const tokens: BlockToken[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Fenced code block
    const fenceMatch = trimmed.match(/^```([a-zA-Z0-9_-]*)/);
    if (fenceMatch) {
      const language = fenceMatch[1] || 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      tokens.push({ type: 'code', language, code: codeLines.join('\n') });
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      tokens.push({ type: 'hr' });
      i++;
      continue;
    }

    // Heading (# .. ####)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4;
      tokens.push({ type: 'heading', level, text: headingMatch[2] });
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      tokens.push({ type: 'blockquote', lines: quoteLines });
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ''));
        i++;
      }
      tokens.push({ type: 'ul', items });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      tokens.push({ type: 'ol', items });
      continue;
    }

    // Paragraph (consume until blank line or block starter)
    const paraLines: string[] = [];
    while (i < lines.length) {
      const cur = lines[i].trim();
      if (
        !cur ||
        cur.startsWith('```') ||
        /^#{1,4}\s+/.test(cur) ||
        cur.startsWith('>') ||
        /^[-*+]\s+/.test(cur) ||
        /^\d+\.\s+/.test(cur) ||
        /^(-{3,}|\*{3,}|_{3,})$/.test(cur)
      ) {
        break;
      }
      paraLines.push(cur);
      i++;
    }
    if (paraLines.length > 0) {
      tokens.push({ type: 'paragraph', text: paraLines.join(' ') });
    }
  }

  return tokens;
}

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#03060d]">
      <div className="px-3 py-1.5 bg-[#070b14] border-b border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="inline-flex items-center gap-1.5 uppercase tracking-wider text-cyan-400 font-bold">
          <Terminal className="w-3 h-3" />
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3.5 text-slate-200 text-[11px] overflow-x-auto leading-relaxed font-mono">
        {code}
      </pre>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const tokens = tokenizeMarkdown(content);

  return (
    <div className="space-y-4 text-xs font-mono leading-relaxed text-slate-300">
      {tokens.map((tok, idx) => {
        switch (tok.type) {
          case 'heading': {
            if (tok.level === 1 || tok.level === 2) {
              return (
                <h4
                  key={idx}
                  className="text-sm font-bold text-cyan-300 border-b border-slate-800 pb-1.5 pt-2 tracking-wide"
                >
                  {renderInline(tok.text)}
                </h4>
              );
            }
            return (
              <h5 key={idx} className="text-xs font-bold text-white pt-1">
                {renderInline(tok.text)}
              </h5>
            );
          }
          case 'code':
            return <CodeBlock key={idx} language={tok.language} code={tok.code} />;
          case 'blockquote': {
            const joined = tok.lines.join(' ');
            const isVerified = joined.startsWith('✓') || joined.toLowerCase().includes('verified');
            return (
              <blockquote
                key={idx}
                className={`p-3 rounded-lg border text-[11px] space-y-1 ${
                  isVerified
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                    : 'bg-cyan-950/20 border-cyan-800/40 text-cyan-200'
                }`}
              >
                {tok.lines.map((line, lineIdx) => (
                  <p key={lineIdx}>{renderInline(line)}</p>
                ))}
              </blockquote>
            );
          }
          case 'ul':
            return (
              <ul key={idx} className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
                {tok.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={idx} className="list-decimal list-inside space-y-1.5 pl-1 text-slate-300">
                {tok.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case 'hr':
            return <hr key={idx} className="border-slate-800 my-2" />;
          case 'paragraph':
            return (
              <p key={idx} className="text-slate-300 leading-relaxed">
                {renderInline(tok.text)}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
