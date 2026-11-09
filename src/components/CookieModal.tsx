import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  Upload,
  Check,
  X,
  Loader2,
  Trash2,
  ExternalLink,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface CookieModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onCookieUpdated?: () => void;
}

export const CookieModal: React.FC<CookieModalProps> = ({
  isOpen,
  onClose,
  language,
  onCookieUpdated,
}) => {
  const [cookieInput, setCookieInput] = useState('');
  const [hasCookie, setHasCookie] = useState(false);
  const [cookieSize, setCookieSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Load existing cookie status
  const checkStatus = async () => {
    try {
      const res = await fetch('/api/cookies/status');
      const data = await res.json();
      setHasCookie(data.hasCookie);
      setCookieSize(data.sizeBytes || 0);
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
      setStatusMessage(null);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!cookieInput.trim()) return;
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/cookies/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookieText: cookieInput }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text:
            language === 'si'
              ? 'YouTube Cookie සාර්ථකව සුරකින ලදී! දැන් ගීත බාගත කරන්න.'
              : 'YouTube cookies saved successfully! You can now download tracks.',
        });
        setCookieInput('');
        await checkStatus();
        onCookieUpdated?.();
      } else {
        throw new Error(data.error || 'Failed to save');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving cookies' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/cookies/delete', { method: 'POST' });
      setHasCookie(false);
      setCookieSize(0);
      setStatusMessage({
        type: 'success',
        text: language === 'si' ? 'Cookie ඉවත් කරන ලදී.' : 'Cookies removed.',
      });
      onCookieUpdated?.();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCookieInput(content);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'si'
                  ? 'YouTube Bot ආරක්ෂණය මඟහැරීම (Cookie සැකසුම්)'
                  : 'Bypass YouTube Bot Verification (Cookie Setup)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'si'
                  ? '"Sign in to confirm you’re not a bot" ගැටලුව සඳහා විසඳුම'
                  : 'Solution for "Sign in to confirm you’re not a bot" restriction'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            {hasCookie ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {language === 'si'
                    ? 'Cookie සක්‍රියයි (Bot Bypass Active)'
                    : 'Cookie Active (Bot Bypass Active)'}
                </span>
                <span className="text-slate-400 font-mono">
                  ({(cookieSize / 1024).toFixed(1)} KB)
                </span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {language === 'si'
                    ? 'Cookie එකතු කර නැත (No Cookie Configured)'
                    : 'No Cookie Configured'}
                </span>
              </>
            )}
          </div>

          {hasCookie && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:hover:text-red-400 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'ඉවත් කරන්න' : 'Remove'}</span>
            </button>
          )}
        </div>

        {/* Instructions Guide */}
        <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>
              {language === 'si'
                ? 'තත්පර 15කින් Cookie ලබාගන්නා ආකාරය:'
                : 'How to get your YouTube cookie in 15 seconds:'}
            </span>
          </div>

          <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'si' ? (
              <>
                <li>
                  ඔබගේ පරිගණකයේ බ්‍රව්සරයෙන්{' '}
                  <span className="font-mono text-slate-900 dark:text-slate-200">
                    youtube.com
                  </span>{' '}
                  වෙත යන්න (ඔබ ලොග් වී සිටිය යුතුය).
                </li>
                <li>
                  යතුරුපුවරුවේ <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">F12</kbd> (Inspect) ඔබා{' '}
                  <span className="font-medium">Application</span> (හෝ Storage) &gt;{' '}
                  <span className="font-medium">Cookies</span> &gt;{' '}
                  <span className="font-mono">https://www.youtube.com</span> හි ඇති cookies කොපි කරන්න.
                </li>
                <li>
                  නැතහොත් Chrome/Firefox සඳහා{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    "Get cookies.txt LOCALLY"
                  </span>{' '}
                  extension එකෙන් cookies.txt ගොනුව බාගත කර මෙතැනට Upload කරන්න.
                </li>
              </>
            ) : (
              <>
                <li>
                  Open{' '}
                  <span className="font-mono text-slate-900 dark:text-slate-200">
                    youtube.com
                  </span>{' '}
                  in your browser (ensure you are signed in).
                </li>
                <li>
                  Press <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">F12</kbd> &gt;{' '}
                  <span className="font-medium">Application / Storage</span> &gt;{' '}
                  <span className="font-medium">Cookies</span> &gt; copy cookies, or copy the{' '}
                  <span className="font-mono">Cookie:</span> header from Network tab.
                </li>
                <li>
                  Alternatively, export with the{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    "Get cookies.txt LOCALLY"
                  </span>{' '}
                  browser extension and upload the file below.
                </li>
              </>
            )}
          </ol>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'si'
                ? 'Cookie Text එක හෝ Header එක මෙතැනට පේස්ට් කරන්න:'
                : 'Paste Cookie text or Cookie Header below:'}
            </label>

            <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 hover:underline">
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'cookies.txt ගොනුව Upload කරන්න' : 'Upload cookies.txt'}</span>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            rows={5}
            value={cookieInput}
            onChange={(e) => setCookieInput(e.target.value)}
            placeholder="# Netscape HTTP Cookie File OR SID=...; HSID=...; SSID=..."
            className="w-full p-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
          />
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <X className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {language === 'si' ? 'වසන්න' : 'Close'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !cookieInput.trim()}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-sm transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{language === 'si' ? 'සුරකිමින්...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{language === 'si' ? 'Cookie සුරකින්න' : 'Save Cookie'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
