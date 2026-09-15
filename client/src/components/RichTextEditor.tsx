import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Quote,
  Code,
  Minus,
  Eye,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { FormattedDescription } from './FormattedDescription';

interface RichTextEditorProps {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label = 'Description',
  required = false,
  value,
  onChange,
  rows = 8,
  placeholder = 'Type detailed event description...',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [savedSelection, setSavedSelection] = useState<{ start: number; end: number } | null>(null);
  const [targetPreview, setTargetPreview] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert or wrap text around current cursor selection
  const insertFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToWrap = selectedText || defaultPlaceholder;
    const replacement = `${prefix}${textToWrap}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Restore focus & selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + textToWrap.length;
      textarea.setSelectionRange(
        selectedText ? start : start + prefix.length,
        selectedText ? start + replacement.length : newCursorPos
      );
    }, 10);
  };

  // Insert list prefix on each line or new line
  const insertList = (type: 'bullet' | 'ordered') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    if (selected) {
      const lines = selected.split('\n');
      const formatted = lines
        .map((l, i) => (type === 'bullet' ? `• ${l.replace(/^[•\-\*]\s*/, '')}` : `${i + 1}. ${l.replace(/^\d+[\.\)]\s*/, '')}`))
        .join('\n');
      const newValue = value.substring(0, start) + formatted + value.substring(end);
      onChange(newValue);
    } else {
      const prefix = type === 'bullet' ? '\n• Item 1\n• Item 2\n• Item 3' : '\n1. First step\n2. Second step\n3. Third step';
      insertFormatting(prefix, '');
    }
  };

  // Open Link Dialog with smart URL & selection detection
  const handleOpenLinkModal = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    let selected = value.substring(start, end);

    let detectedUrl = '';
    let detectedLabel = '';
    let previewTarget = '';

    // Check if user selected something
    if (selected && selected.trim()) {
      const trimmed = selected.trim();
      if (/^https?:\/\/[^\s]+$/i.test(trimmed)) {
        detectedUrl = trimmed;
        detectedLabel = 'Register Now';
        previewTarget = trimmed;
      } else {
        detectedLabel = trimmed.replace(/[:;\-]+$/, '').trim();
        previewTarget = trimmed;
      }
    } else {
      // Nothing explicitly highlighted: inspect current line around cursor
      const textBefore = value.substring(0, start);
      const lineStart = textBefore.lastIndexOf('\n') + 1;
      const lineEndIdx = value.indexOf('\n', start);
      const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
      const currentLine = value.substring(lineStart, lineEnd);

      // Search for URL on the current line
      const urlMatch = currentLine.match(/(https?:\/\/[^\s\)]+)/);
      if (urlMatch && urlMatch.index !== undefined) {
        const urlStart = lineStart + urlMatch.index;
        const urlEnd = urlStart + urlMatch[0].length;
        start = urlStart;
        end = urlEnd;
        detectedUrl = urlMatch[0];
        detectedLabel = 'Register Now';
        previewTarget = urlMatch[0];
      } else {
        detectedLabel = 'Register Now';
      }
    }

    setSavedSelection({ start, end });
    setTargetPreview(previewTarget);
    setLinkText(detectedLabel);
    setLinkUrl(detectedUrl);
    setShowLinkModal(true);
  };

  // Apply the link and replace the exact target range cleanly
  const handleApplyLink = () => {
    if (!linkUrl.trim()) return;
    const textarea = textareaRef.current;

    const start = savedSelection ? savedSelection.start : (textarea ? textarea.selectionStart : 0);
    const end = savedSelection ? savedSelection.end : (textarea ? textarea.selectionEnd : 0);

    let cleanUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }
    const label = linkText.trim() || 'Link';
    const formatted = `[${label}](${cleanUrl})`;

    // Check character before insertion point - ensure whitespace if touching symbols like `:-` or `;-`
    const textBefore = value.substring(0, start);
    const lastChar = textBefore.length > 0 ? textBefore[textBefore.length - 1] : '';
    const needsLeadingSpace = lastChar && !/\s/.test(lastChar);

    // Check character after insertion point
    const textAfter = value.substring(end);
    const nextChar = textAfter.length > 0 ? textAfter[0] : '';
    const needsTrailingSpace = nextChar && !/\s/.test(nextChar) && !/[.,!?;)]/.test(nextChar);

    const replacement = `${needsLeadingSpace ? ' ' : ''}${formatted}${needsTrailingSpace ? ' ' : ''}`;

    const newValue = textBefore + replacement + textAfter;
    onChange(newValue);
    setShowLinkModal(false);
    setSavedSelection(null);
    setTargetPreview('');
    setLinkText('');
    setLinkUrl('');

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const pos = start + replacement.length;
        textareaRef.current.setSelectionRange(pos, pos);
      }
    }, 20);
  };

  // Quick preset labels for link modal
  const presetLabels = ['Register Now', 'Google Form', 'Registration Portal', 'Join Discord', 'Official Rules', 'View Details'];

  // Insert quick template snippets
  const insertTemplate = (templateType: 'registration' | 'rules' | 'schedule') => {
    let snippet = '';
    if (templateType === 'registration') {
      snippet = '\n\n**Registration & Details:**\n• Registration Link: [Register Now](https://forms.gle/RxVncDsAqDpgbSv76)\n• Eligibility: Open to all students\n• Team Size: 3–6 Members\n';
    } else if (templateType === 'rules') {
      snippet = '\n\n### Rules of Engagement:\n1. Respect all event infrastructure and designated network bounds.\n2. DoS and brute-forcing shared scoring services is strictly prohibited.\n3. Bring a fully charged laptop and valid student ID card.\n';
    } else if (templateType === 'schedule') {
      snippet = '\n\n### Timeline & Agenda:\n• **10:00 AM** — Opening Briefing & Keynote\n• **11:00 AM** — Challenge Access Unlocked\n• **01:00 PM** — Lunch & Strategy Break\n• **04:30 PM** — Final Flag Submission & Closing Ceremony\n';
    }
    insertFormatting(snippet, '');
  };

  // Keyboard shortcut handlers (Ctrl+B, Ctrl+I, Ctrl+K)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        insertFormatting('**', '**', 'bold text');
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        insertFormatting('*', '*', 'italic text');
      } else if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleOpenLinkModal();
      }
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 font-medium">
          {label} {required && <span className="text-[#FF4D1C]">*</span>}
        </label>

        {/* Tab Switcher: Write vs Live Preview */}
        <div className="flex items-center bg-[#0a0c13] p-1 rounded-lg border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all ${
              activeTab === 'write'
                ? 'bg-[#FF4D1C] text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all ${
              activeTab === 'preview'
                ? 'bg-[#FF4D1C] text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="rounded-xl border border-white/10 bg-[#07090e] overflow-hidden focus-within:border-[#FF4D1C]/50 transition-colors">
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-[#0c0e17] border-b border-white/10">
          <div className="flex items-center flex-wrap gap-1">
            {/* Bold */}
            <button
              type="button"
              title="Bold (**text**) [Ctrl+B]"
              onClick={() => insertFormatting('**', '**', 'bold text')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <Bold className="w-4 h-4" />
            </button>

            {/* Italic */}
            <button
              type="button"
              title="Italic (*text*) [Ctrl+I]"
              onClick={() => insertFormatting('*', '*', 'italic text')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <Italic className="w-4 h-4" />
            </button>

            <span className="w-[1px] h-4 bg-white/10 mx-1" />

            {/* Heading 2 */}
            <button
              type="button"
              title="Section Header (## Header)"
              onClick={() => insertFormatting('\n## ', '\n', 'Section Header')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            {/* Heading 3 */}
            <button
              type="button"
              title="Subheader (### Subheader)"
              onClick={() => insertFormatting('\n### ', '\n', 'Subheader')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <span className="w-[1px] h-4 bg-white/10 mx-1" />

            {/* Bullet List */}
            <button
              type="button"
              title="Bullet List (• item)"
              onClick={() => insertList('bullet')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <List className="w-4 h-4" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              title="Numbered List (1. item)"
              onClick={() => insertList('ordered')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <span className="w-[1px] h-4 bg-white/10 mx-1" />

            {/* Link */}
            <button
              type="button"
              title="Format / Insert Hyperlink [Ctrl+K]"
              onClick={handleOpenLinkModal}
              className="p-1.5 rounded bg-[#FF4D1C]/15 hover:bg-[#FF4D1C]/25 text-[#FF4D1C] hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono border border-[#FF4D1C]/30 font-semibold"
            >
              <Link2 className="w-4 h-4" />
              <span>Link</span>
            </button>

            {/* Quote / Callout */}
            <button
              type="button"
              title="Callout Quote (> quote)"
              onClick={() => insertFormatting('\n> ', '\n', 'Important note or briefing')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <Quote className="w-4 h-4" />
            </button>

            {/* Code */}
            <button
              type="button"
              title="Inline Code (`code`)"
              onClick={() => insertFormatting('`', '`', 'code')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <Code className="w-4 h-4" />
            </button>

            {/* Divider */}
            <button
              type="button"
              title="Horizontal Rule (---)"
              onClick={() => insertFormatting('\n---\n', '')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Insert Templates */}
          <div className="flex items-center gap-1.5 pt-1 sm:pt-0">
            <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF4D1C]" />
              Templates:
            </span>
            <button
              type="button"
              onClick={() => insertTemplate('registration')}
              className="px-2 py-1 text-[11px] font-mono bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded border border-white/5 transition-colors"
            >
              + Registration
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('rules')}
              className="px-2 py-1 text-[11px] font-mono bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded border border-white/5 transition-colors"
            >
              + Rules
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('schedule')}
              className="px-2 py-1 text-[11px] font-mono bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded border border-white/5 transition-colors"
            >
              + Agenda
            </button>
          </div>
        </div>

        {/* Tab Content: Editor vs Preview */}
        {activeTab === 'write' ? (
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={rows}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent p-4 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-y leading-relaxed"
            />
          </div>
        ) : (
          <div className="p-6 bg-[#05070c] min-h-[220px] max-h-[450px] overflow-y-auto">
            {value.trim() ? (
              <FormattedDescription content={value} />
            ) : (
              <div className="text-zinc-600 text-xs font-mono italic py-12 text-center">
                Nothing to preview. Switch to "Editor" tab to add content.
              </div>
            )}
          </div>
        )}

        {/* Footer info & shortcut guide */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-[#090b12] border-t border-white/5 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>{value.length} characters</span>
            <span>•</span>
            <span>{value.split(/\r?\n/).length} lines</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-zinc-500">
            <span>Hotkeys:</span>
            <kbd className="px-1 bg-white/5 rounded border border-white/10 text-zinc-400">Ctrl+B</kbd>
            <span>Bold</span>
            <kbd className="px-1 bg-white/5 rounded border border-white/10 text-zinc-400">Ctrl+I</kbd>
            <span>Italic</span>
            <kbd className="px-1 bg-white/5 rounded border border-white/10 text-zinc-400">Ctrl+K</kbd>
            <span>Link</span>
          </div>
        </div>
      </div>

      {/* Insert / Format Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0e111a] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[#FF4D1C]" />
                <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                  {targetPreview ? 'Convert / Replace with Formatted Link' : 'Insert Hyperlink'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false);
                  setSavedSelection(null);
                }}
                className="text-zinc-400 hover:text-white text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>

            {targetPreview && (
              <div className="p-2.5 rounded-lg bg-[#FF4D1C]/10 border border-[#FF4D1C]/20 text-xs font-mono text-zinc-300">
                <span className="text-[#FF4D1C] font-semibold block mb-0.5">Target to replace:</span>
                <span className="truncate block font-mono text-zinc-400">{targetPreview}</span>
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Link Button Text / Label</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Register Now"
                  className="w-full bg-[#05070c] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FF4D1C]"
                />

                {/* Quick preset label chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {presetLabels.map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setLinkText(lbl)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                        linkText === lbl
                          ? 'bg-[#FF4D1C] text-white border-[#FF4D1C]'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Destination URL</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://forms.gle/RxVncDsAqDpgbSv76"
                  className="w-full bg-[#05070c] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FF4D1C]"
                  autoFocus={!linkUrl}
                />
              </div>

              {/* Preview formatted tag */}
              {linkUrl && (
                <div className="text-[11px] text-zinc-500 font-mono pt-1">
                  Result: <code className="text-[#FF4D1C] font-mono bg-white/5 px-1 py-0.5 rounded">[{linkText.trim() || 'Link'}]({linkUrl.trim()})</code>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false);
                  setSavedSelection(null);
                }}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyLink}
                disabled={!linkUrl.trim()}
                className="px-4 py-2 rounded-lg bg-[#FF4D1C] hover:bg-[#FF3B00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors shadow-[0_0_15px_rgba(255,77,28,0.3)]"
              >
                {targetPreview ? 'Replace with Link' : 'Insert Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
