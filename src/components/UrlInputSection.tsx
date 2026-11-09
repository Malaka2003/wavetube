import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Search, Clipboard, X, Loader2, Sparkles, Youtube, Check } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  url: string;
  description: string;
  count: string;
}

interface UrlInputSectionProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  onFetch: (urlToFetch?: string) => void;
  language: Language;
  presets: Preset[];
  error?: string | null;
}

export const UrlInputSection: React.FC<UrlInputSectionProps> = ({
  url,
  setUrl,
  isLoading,
  onFetch,
  language,
  presets,
  error,
}) => {
  const t = translations[language];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
      }
    } catch {
      // Clipboard permissions may be denied in some browsers
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onFetch(url.trim());
    }
  };

  const handlePresetClick = (presetUrl: string) => {
    setUrl(presetUrl);
    onFetch(presetUrl);
  };

  return (
    <section id="extractor" className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 dark:focus-within:border-amber-500 transition-all">
          <div className="relative flex-1 flex items-center min-w-0">
            <div className="pl-3.5 pr-2 text-slate-400 dark:text-slate-500 pointer-events-none shrink-0">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t.urlInputPlaceholder}
              disabled={isLoading}
              className="w-full py-2.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none min-w-0"
            />

            {url && (
              <button
                type="button"
                onClick={handleClear}
                title={t.clear}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handlePaste}
              title={t.paste}
              className="hidden sm:flex items-center gap-1 mx-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>{t.paste}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all shadow-sm whitespace-nowrap shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>{t.fetching}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>{t.fetchButton}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="mt-3 p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2.5">
          <span className="shrink-0 font-bold">!</span>
          <span>{error}</span>
        </div>
      )}

      {/* Preset Suggestions */}
      {presets.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {t.samplePlaylists}
          </span>
          {presets.map((preset, idx) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetClick(preset.url)}
              disabled={isLoading}
              className="group inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-900 dark:hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 hover:border-amber-500/30 rounded-lg transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{preset.name}</span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
                ({preset.count})
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
