import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Disc, Layers, Zap, ShieldCheck } from 'lucide-react';

interface InfoSectionProps {
  language: Language;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="w-full space-y-12 pt-6">
      {/* How it Works Section */}
      <section id="how-it-works" className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.howItWorksTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            {language === 'si'
              ? 'සරල පියවර 3 කින් සම්පූර්ණ ප්ලේලිස්ට් එකම .WAV ගොනු බවට පත් කරගන්න'
              : 'Convert and save entire YouTube playlists into lossless PCM WAV tracks in 3 effortless steps'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              01
            </div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
              {t.step1Title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              02
            </div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
              {t.step2Title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              03
            </div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
              {t.step3Title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.step3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Why WAV Comparison Section */}
      <section
        id="why-wav"
        className="bg-slate-900 dark:bg-slate-900/90 text-white border border-slate-800 rounded-2xl p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
              Audio Fidelity Standard
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {t.whyWavTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.whyWavDesc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400 font-medium">Standard Bitrate</div>
                <div className="text-base sm:text-lg font-bold font-mono text-amber-400 mt-0.5 tabular-nums">
                  1,536 kbps
                </div>
                <div className="text-[10px] text-slate-400">vs 128 kbps MP3</div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400 font-medium">Sample Rate</div>
                <div className="text-base sm:text-lg font-bold font-mono text-amber-400 mt-0.5 tabular-nums">
                  48.0 kHz
                </div>
                <div className="text-[10px] text-slate-400">Studio Master Standard</div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400 font-medium">Audio Compression</div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5">
                  0% Loss (PCM)
                </div>
                <div className="text-[10px] text-slate-400">Zero artifacts</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950/70 rounded-xl p-4 sm:p-5 border border-slate-800 font-mono text-xs space-y-2.5">
            <div className="text-slate-400 text-[11px] pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>WAVEFORMATEX Header</span>
              <span className="text-amber-400">RIFF WAVE</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Format Tag:</span>
              <span className="text-slate-200">WAVE_FORMAT_PCM (0x0001)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Channels:</span>
              <span className="text-slate-200">2 Channels (Stereo Left/Right)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Samples Per Sec:</span>
              <span className="text-slate-200">48,000 Hz</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Bits Per Sample:</span>
              <span className="text-slate-200">16-bit / 24-bit PCM Linear</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Packaging:</span>
              <span className="text-emerald-400">Direct .WAV or Instant ZIP</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
