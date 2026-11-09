import React, { useState, useMemo } from 'react';
import { PlaylistData, Track, AudioSettings, Language } from '../types';
import { translations } from '../translations';
import {
  Download,
  Play,
  Pause,
  FolderArchive,
  Check,
  CheckSquare,
  Square,
  Search,
  Music,
  Loader2,
  Clock,
  Sparkles,
  ExternalLink,
  Volume2,
  AlertCircle,
  RotateCcw,
  KeyRound
} from 'lucide-react';

interface PlaylistViewProps {
  playlist: PlaylistData;
  settings: AudioSettings;
  language: Language;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onConvertTrack: (track: Track) => Promise<void>;
  onBatchConvertAndZip: (selectedTracks: Track[]) => Promise<void>;
  isBatchConverting: boolean;
  batchProgress: { current: number; total: number; currentTitle: string };
  zipDownloadUrl: string | null;
  currentlyPlayingId: string | null;
  isPlaying: boolean;
  onPlayPreview: (track: Track) => void;
  onOpenCookieModal: () => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlist,
  settings,
  language,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onConvertTrack,
  onBatchConvertAndZip,
  isBatchConverting,
  batchProgress,
  zipDownloadUrl,
  currentlyPlayingId,
  isPlaying,
  onPlayPreview,
  onOpenCookieModal,
}) => {
  const t = translations[language];
  const [filterQuery, setFilterQuery] = useState('');

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    if (!filterQuery.trim()) return playlist.tracks;
    const q = filterQuery.toLowerCase();
    return playlist.tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.channel.toLowerCase().includes(q)
    );
  }, [playlist.tracks, filterQuery]);

  const allSelected =
    playlist.tracks.length > 0 && selectedIds.size === playlist.tracks.length;
  const someSelected = selectedIds.size > 0;

  const handleDownloadSingle = async (track: Track) => {
    if (track.status === 'converting') return;
    await onConvertTrack(track);
  };

  const handleBatchZip = () => {
    if (isBatchConverting) return;
    const targetTracks = someSelected
      ? playlist.tracks.filter((t) => selectedIds.has(t.id))
      : playlist.tracks;
    onBatchConvertAndZip(targetTracks);
  };

  return (
    <section className="w-full space-y-6">
      {/* Playlist Hero / Summary Card */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Thumbnail */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 shadow-sm">
            {playlist.thumbnail ? (
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Music className="w-8 h-8" />
              </div>
            )}
            <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
              WAV PCM
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>{playlist.isPlaylist ? (language === 'si' ? 'ප්ලේලිස්ට්' : 'Playlist') : (language === 'si' ? 'තනි වීඩියෝව' : 'Single Track')}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {playlist.author}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
              {playlist.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {playlist.totalTracks} {language === 'si' ? 'ගීත' : 'Tracks'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {settings.sampleRate / 1000} kHz / {settings.bitDepth}-bit
              </span>
              <span aria-hidden="true">·</span>
              <span>{settings.channels === 2 ? 'Stereo' : 'Mono'}</span>
            </div>
          </div>

          {/* Top Primary Batch Action Button */}
          <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
            {zipDownloadUrl ? (
              <a
                href={zipDownloadUrl}
                download
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md ring-2 ring-emerald-400/30 transition-all whitespace-nowrap"
              >
                <FolderArchive className="w-4 h-4 stroke-[2.5]" />
                <span>{t.downloadZipNow}</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={handleBatchZip}
                disabled={isBatchConverting || playlist.tracks.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-3 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-sm transition-all whitespace-nowrap"
              >
                {isBatchConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{t.convertingBatch}</span>
                  </>
                ) : (
                  <>
                    <FolderArchive className="w-4 h-4 stroke-[2.2]" />
                    <span>
                      {someSelected ? t.downloadSelectedZip : t.downloadAllZip}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Batch Progress Bar (when converting) */}
        {isBatchConverting && (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                <span>{t.zipPackaging}</span>
                <span className="text-slate-400 dark:text-slate-500 truncate max-w-xs sm:max-w-md">
                  ({batchProgress.currentTitle})
                </span>
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                {batchProgress.current} / {batchProgress.total}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{
                  width: `${(batchProgress.current / Math.max(1, batchProgress.total)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Bot Verification Alert Banner */}
        {playlist.tracks.some(t => t.error?.includes('YOUTUBE_BOT_DETECTED') || t.error?.includes('cookie')) && (
          <div className="mt-4 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>
                {language === 'si'
                  ? 'YouTube Bot ආරක්ෂණය (Sign in to confirm you’re not a bot) ඉල්ලා ඇත. බාගත කිරීමට කරුණාකර YouTube Cookie එකක් එක් කරන්න.'
                  : 'YouTube requires authentication cookies to bypass bot verification for these tracks.'}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenCookieModal}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 whitespace-nowrap self-start sm:self-auto shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'Cookie එක් කරන්න (Fix)' : 'Add Cookie (Fix)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Track Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Selection buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            {allSelected ? (
              <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            <span>{allSelected ? t.deselectAll : t.selectAll}</span>
          </button>

          {someSelected && (
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
              ({selectedIds.size} / {playlist.tracks.length} {language === 'si' ? 'තෝරා ඇත' : 'selected'})
            </span>
          )}
        </div>

        {/* Filter input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={language === 'si' ? 'ගීතයක් සොයන්න...' : 'Filter tracks...'}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Tracks Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredTracks.map((track) => {
            const isSelected = selectedIds.has(track.id);
            const isTrackPlaying = currentlyPlayingId === track.id && isPlaying;
            const isConverting = track.status === 'converting';
            const isReady = track.status === 'ready' || Boolean(track.downloadUrl);

            return (
              <div
                key={track.id}
                className={`group flex items-center gap-3 sm:gap-4 p-3 sm:px-4 sm:py-3.5 transition-colors ${
                  isTrackPlaying
                    ? 'bg-amber-500/5 dark:bg-amber-500/10'
                    : isSelected
                    ? 'bg-slate-50 dark:bg-slate-800/40'
                    : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                }`}
              >
                {/* Select Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleSelect(track.id)}
                  aria-label={`Select ${track.title}`}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>

                {/* Track Index */}
                <span className="w-5 text-right font-mono text-xs text-slate-400 dark:text-slate-500 tabular-nums shrink-0">
                  {track.index}
                </span>

                {/* Thumbnail with quick Play overlay */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700/60 shadow-xs">
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

                  {/* Play / Pause button overlay */}
                  <button
                    type="button"
                    onClick={() => onPlayPreview(track)}
                    aria-label={isTrackPlaying ? 'Pause preview' : 'Play preview'}
                    className={`absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs transition-opacity ${
                      isTrackPlaying
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                    }`}
                  >
                    {isTrackPlaying ? (
                      <Pause className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ) : (
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Title & Channel */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <h4
                      title={track.title}
                      className={`text-sm font-medium truncate ${
                        isTrackPlaying
                          ? 'text-amber-600 dark:text-amber-400 font-semibold'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {track.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="truncate max-w-[150px] sm:max-w-xs">{track.channel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {track.durationFormatted}
                    </span>
                    {isReady && track.fileSize && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">
                          {(track.fileSize / (1024 * 1024)).toFixed(1)} MB WAV
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Status Indicator */}
                  {isConverting ? (
                    <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-mono">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.converting}</span>
                    </span>
                  ) : isReady ? (
                    <span className="hidden md:inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{t.readyToDownload}</span>
                    </span>
                  ) : track.status === 'error' ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      {track.error?.includes('YOUTUBE_BOT_DETECTED') || track.error?.includes('cookie') ? (
                        <button
                          type="button"
                          onClick={onOpenCookieModal}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-colors whitespace-nowrap"
                          title="Click to add YouTube cookie"
                        >
                          <KeyRound className="w-3 h-3 text-amber-500" />
                          <span>{language === 'si' ? 'Cookie අවශ්‍යයි' : 'Add Cookie'}</span>
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(track)}
                        className="text-red-500 hover:text-red-400 underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{t.retry}</span>
                      </button>
                    </div>
                  ) : null}

                  {/* Audio Preview Button */}
                  <button
                    type="button"
                    onClick={() => onPlayPreview(track)}
                    title={isTrackPlaying ? t.stopPreview : t.preview}
                    className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                      isTrackPlaying
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isTrackPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* Direct Download .WAV Button */}
                  {isReady && track.downloadUrl ? (
                    <a
                      href={track.downloadUrl}
                      download={`${track.title}.wav`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>{t.downloadWav}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(track)}
                      disabled={isConverting}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 shadow-xs transition-all whitespace-nowrap disabled:opacity-50"
                    >
                      {isConverting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="hidden sm:inline">{t.converting}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>{t.downloadWav}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredTracks.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              {t.emptyTracks}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
