import React, { useRef, useEffect, useState } from 'react';
import { Track, AudioSettings, Language } from '../types';
import { translations } from '../translations';
import {
  Play,
  Pause,
  Download,
  Volume2,
  VolumeX,
  X,
  Music,
  Loader2,
} from 'lucide-react';

interface AudioPlayerDockProps {
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  onDownload: (track: Track) => void;
  settings: AudioSettings;
  language: Language;
}

export const AudioPlayerDock: React.FC<AudioPlayerDockProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  onClose,
  onDownload,
  settings,
  language,
}) => {
  const t = translations[language];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // When track changes, update audio source
  useEffect(() => {
    if (!track) return;
    const audio = audioRef.current;
    if (!audio) return;

    // Source URL: If converted, use converted preview. Otherwise use server preview
    const src =
      track.previewUrl ||
      `/api/preview/audio/${track.id}?sr=${settings.sampleRate}&bd=${settings.bitDepth}&ch=${settings.channels}`;

    audio.src = src;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay may be restricted
      });
    }
  }, [track?.id]);

  // Sync play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!duration && audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || track?.duration || 0);
      setIsBuffering(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) return null;

  return (
    <aside
      aria-label="Audio Player"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-colors"
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={() => onTogglePlay()}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
          {/* Track Info */}
          <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
              {track.thumbnail ? (
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Music className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {track.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {track.channel}
              </p>
            </div>
          </div>

          {/* Player Center: Controls & Scrubber */}
          <div className="flex-1 flex flex-col items-center gap-1.5 w-full max-w-lg">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 flex items-center justify-center shadow-sm transition-all"
              >
                {isBuffering ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 fill-slate-950" />
                ) : (
                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                )}
              </button>
            </div>

            <div className="w-full flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="tabular-nums min-w-[32px] text-right">
                {formatSeconds(currentTime)}
              </span>

              <input
                type="range"
                min={0}
                max={duration || track.duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />

              <span className="tabular-nums min-w-[32px]">
                {formatSeconds(duration || track.duration || 0)}
              </span>
            </div>
          </div>

          {/* Right Controls: Volume, Download, Dismiss */}
          <div className="flex items-center gap-3 w-full sm:w-1/3 justify-end">
            {/* Volume */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Quick Download */}
            <button
              type="button"
              onClick={() => onDownload(track)}
              title={t.downloadWav}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">.WAV</span>
            </button>

            {/* Dismiss */}
            <button
              type="button"
              onClick={onClose}
              title="Close player"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
