import React from 'react';
import { AudioSettings, Language } from '../types';
import { translations } from '../translations';
import { Sliders, Sparkles, Disc3, Cpu } from 'lucide-react';

interface AudioSettingsBarProps {
  settings: AudioSettings;
  onChange: (settings: AudioSettings) => void;
  language: Language;
}

export const AudioSettingsBar: React.FC<AudioSettingsBarProps> = ({
  settings,
  onChange,
  language,
}) => {
  const t = translations[language];

  return (
    <div id="settings" className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.audioSettings}</span>
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-normal">
                [RIFF WAVE / PCM]
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'si'
                ? 'පරිවර්තනය වන සියලුම .WAV ගොනු සඳහා අවශ්‍ය ශ්‍රව්‍ය පරාමිතීන් සකසන්න'
                : 'Configure lossless PCM encoding parameters for all generated .WAV tracks'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-200">
            {settings.sampleRate / 1000} kHz
          </span>
          <span>·</span>
          <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-200">
            {settings.bitDepth}-bit
          </span>
          <span>·</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            {settings.channels === 2 ? 'Stereo' : 'Mono'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {/* Sample Rate */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t.sampleRate}
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            {[
              { val: 44100, label: '44.1 kHz' },
              { val: 48000, label: '48.0 kHz' },
              { val: 96000, label: '96.0 kHz' },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => onChange({ ...settings, sampleRate: item.val })}
                className={`py-1.5 px-2 text-xs font-mono font-medium rounded-md transition-all whitespace-nowrap ${
                  settings.sampleRate === item.val
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bit Depth */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t.bitDepth}
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            {[
              { val: 16, label: '16-bit' },
              { val: 24, label: '24-bit' },
              { val: 32, label: '32-bit' },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => onChange({ ...settings, bitDepth: item.val })}
                className={`py-1.5 px-2 text-xs font-mono font-medium rounded-md transition-all whitespace-nowrap ${
                  settings.bitDepth === item.val
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Channels */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t.channels}
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            {[
              { val: 2, label: t.stereo },
              { val: 1, label: t.mono },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => onChange({ ...settings, channels: item.val })}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  settings.channels === item.val
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
