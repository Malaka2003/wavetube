import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Globe, Music2, Sun, Moon, KeyRound } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCookieModal: () => void;
  hasCookie: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  isDark,
  onToggleTheme,
  onOpenCookieModal,
  hasCookie,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand title, one line wordmark */}
        <a href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-slate-950 shadow-sm">
            <Music2 className="w-5 h-5 stroke-[2.5]" />
          </span>
          <span className="font-extrabold text-xl tracking-tight">
            Wave<span className="text-amber-500 dark:text-amber-400">Tube</span>
          </span>
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a href="#extractor" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {language === 'si' ? 'ප්ලේලිස්ට්' : 'Playlist'}
          </a>
          <a href="#settings" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {language === 'si' ? 'ශ්‍රව්‍ය සැකසුම්' : 'WAV Specs'}
          </a>
          <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {language === 'si' ? 'භාවිතය' : 'Guide'}
          </a>
          <a href="#why-wav" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {language === 'si' ? 'WAV වාසි' : 'Why WAV'}
          </a>
        </nav>

        {/* Zone 3: 1 primary action lockup with clean controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* YouTube Cookie / Bot Bypass Button */}
          <button
            onClick={onOpenCookieModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              hasCookie
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
            }`}
            title={language === 'si' ? 'YouTube Cookie (Bot Bypass) සැකසුම්' : 'YouTube Cookie (Bot Bypass) Settings'}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasCookie
                ? language === 'si'
                  ? 'Cookie සක්‍රියයි'
                  : 'Cookie Active'
                : language === 'si'
                ? 'Cookie සැකසුම්'
                : 'Cookie Setup'}
            </span>
          </button>

          {/* Theme Switch */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'si' ? 'English' : 'සිංහල'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
