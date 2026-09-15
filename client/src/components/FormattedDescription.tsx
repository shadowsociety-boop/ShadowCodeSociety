import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FormattedDescriptionProps {
  content: string;
  className?: string;
}

/**
 * Parses inline formatting:
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Code: `code`
 * - Markdown links: [text](url)
 * - Auto URLs: https://... or http://...
 */
const renderInline = (text: string): React.ReactNode[] => {
  // Regex to tokenise inline patterns
  // 1: Markdown link [text](url)
  // 2: Auto URL (https?://[^\s]+)
  // 3: Bold (**text** or __text__)
  // 4: Italic (*text* or _text_)
  // 5: Inline code (`code`)
  const pattern = /(\[[^\]]+\]\([^\)]+\)|https?:\/\/[^\s\)]+|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // Markdown link: [text](url)
    const mdLinkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\)]+)\)$/);
    if (mdLinkMatch) {
      const [, label, url] = mdLinkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF4D1C] hover:text-[#FF7A50] underline underline-offset-2 font-medium inline-flex items-center gap-1 transition-colors"
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline-block flex-shrink-0" />
        </a>
      );
    }

    // Bare URL: https://...
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF4D1C] hover:text-[#FF7A50] underline underline-offset-2 break-all font-mono text-[13px] inline-flex items-center gap-1 transition-colors"
        >
          <span>{part}</span>
          <ExternalLink className="w-3 h-3 inline-block flex-shrink-0" />
        </a>
      );
    }

    // Bold: **text** or __text__
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="text-white font-bold">
          {renderInline(boldText)}
        </strong>
      );
    }

    // Italic: *text* or _text_
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      const italicText = part.slice(1, -1);
      return (
        <em key={index} className="text-zinc-200 italic">
          {renderInline(italicText)}
        </em>
      );
    }

    // Code: `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-white/10 text-[#FF4D1C] font-mono text-xs border border-white/10"
        >
          {codeText}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content into blocks (paragraphs, lists, headings, dividers, blockquotes)
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-1.5 my-3 pl-2">
          {currentList.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] mt-2 flex-shrink-0" />
              <div className="flex-1 leading-relaxed">{renderInline(item)}</div>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`list-${elements.length}`} className="space-y-1.5 my-3 pl-2">
          {currentList.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-zinc-300">
              <span className="text-xs font-mono font-bold text-[#FF4D1C] mt-0.5 min-w-[18px]">
                {i + 1}.
              </span>
              <div className="flex-1 leading-relaxed">{renderInline(item)}</div>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      elements.push(<div key={`empty-${idx}`} className="h-2" />);
      return;
    }

    // Divider
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushList();
      elements.push(
        <hr key={`hr-${idx}`} className="my-4 border-t border-white/10" />
      );
      return;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${idx}`} className="text-base font-bold font-['Space_Grotesk'] text-white mt-4 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-[#FF4D1C]" />
          <span>{renderInline(trimmed.slice(4))}</span>
        </h3>
      );
      return;
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${idx}`} className="text-lg font-bold font-['Space_Grotesk'] text-white mt-5 mb-2.5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-[#FF4D1C]" />
          <span>{renderInline(trimmed.slice(3))}</span>
        </h2>
      );
      return;
    }

    // Heading 1
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${idx}`} className="text-xl font-bold font-['Space_Grotesk'] text-white mt-6 mb-3">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    // Blockquote: > Quote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote
          key={`quote-${idx}`}
          className="my-3 pl-4 py-2 border-l-2 border-[#FF4D1C] bg-[#FF4D1C]/[0.04] rounded-r-lg text-xs font-mono text-zinc-300 italic"
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Bullet list: •, -, *
    if (/^[•\-\*]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[•\-\*]\s+/, '');
      if (currentList && currentList.type === 'ul') {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      }
      return;
    }

    // Numbered list: 1., 2.
    if (/^\d+[\.\)]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+[\.\)]\s+/, '');
      if (currentList && currentList.type === 'ol') {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      }
      return;
    }

    // Standard paragraph line
    flushList();
    elements.push(
      <p key={`p-${idx}`} className="leading-relaxed my-1">
        {renderInline(line)}
      </p>
    );
  });

  flushList();

  return (
    <div className={`space-y-1 text-sm text-zinc-300 ${className}`}>
      {elements}
    </div>
  );
};
