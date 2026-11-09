import React, { useState, useEffect } from 'react';
import { PlaylistData, Track, AudioSettings, Language } from './types';
import { translations } from './translations';
import { Navbar } from './components/Navbar';
import { UrlInputSection } from './components/UrlInputSection';
import { AudioSettingsBar } from './components/AudioSettingsBar';
import { PlaylistView } from './components/PlaylistView';
import { AudioPlayerDock } from './components/AudioPlayerDock';
import { CookieModal } from './components/CookieModal';
import { InfoSection } from './components/InfoSection';
import { Music, Radio, Disc3, Sparkles } from 'lucide-react';

export default function App() {
  // Default to Sinhala ('si') based on user request in Sinhala, toggleable to English ('en')
  const [language, setLanguage] = useState<Language>('si');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cookie Modal & Bot Bypass State
  const [isCookieModalOpen, setIsCookieModalOpen] = useState<boolean>(false);
  const [hasCookie, setHasCookie] = useState<boolean>(false);

  // Audio configuration settings
  const [settings, setSettings] = useState<AudioSettings>({
    sampleRate: 48000,
    bitDepth: 16,
    channels: 2,
  });

  // Playlist State
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Batch Conversion State
  const [isBatchConverting, setIsBatchConverting] = useState<boolean>(false);
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState({
    current: 0,
    total: 0,
    currentTitle: '',
  });

  // Audio Player State
  const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Preset Playlists
  const [presets, setPresets] = useState([
    {
      id: 'lofi-beats',
      name: 'Lofi Chill Hip Hop',
      url: 'https://www.youtube.com/playlist?list=PL6NdkXsTSxKMZ_83n_YkC6Z2XgDq_gDkS',
      description: 'Relaxing study beats',
      count: '15 tracks',
    },
    {
      id: 'synthwave-retro',
      name: 'Synthwave & Electronic',
      url: 'https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0HN-Sp55-HAWW9913_c',
      description: 'Electronic synthesizer mix',
      count: '20 tracks',
    },
  ]);

  const t = translations[language];

  // Sync theme with HTML root class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load presets from backend if available
  useEffect(() => {
    fetch('/api/presets')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPresets(data);
        }
      })
      .catch(() => {});
  }, []);

  // Check YouTube cookie status
  const refreshCookieStatus = async () => {
    try {
      const res = await fetch('/api/cookies/status');
      const data = await res.json();
      setHasCookie(Boolean(data.hasCookie));
    } catch {}
  };

  useEffect(() => {
    refreshCookieStatus();
  }, []);

  // Auto-dismiss toast notification
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleToggleLanguage = () => {
    setLanguage(language === 'si' ? 'en' : 'si');
  };

  // Fetch playlist information
  const handleFetchPlaylist = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || url;
    if (!targetUrl.trim()) {
      setError(t.linkError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/playlist/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch playlist data.');
      }

      setPlaylist(data);
      // Automatically select all tracks initially
      setSelectedIds(new Set(data.tracks.map((t: Track) => t.id)));
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.linkError);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert and download a single track
  const handleConvertSingleTrack = async (track: Track) => {
    // If track is already converted and ready, trigger download directly
    if (track.downloadUrl) {
      triggerBrowserDownload(track.downloadUrl);
      return;
    }

    // Update track status to converting
    setPlaylist((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        tracks: prev.tracks.map((t) =>
          t.id === track.id ? { ...t, status: 'converting', error: undefined } : t
        ),
      };
    });

    try {
      const res = await fetch('/api/convert/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: track.id,
          title: track.title,
          sampleRate: settings.sampleRate,
          bitDepth: settings.bitDepth,
          channels: settings.channels,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Conversion failed');
      }

      // Update track in playlist state
      setPlaylist((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          tracks: prev.tracks.map((t) =>
            t.id === track.id
              ? {
                  ...t,
                  status: 'ready',
                  fileSize: result.fileSize,
                  downloadUrl: result.downloadUrl,
                  previewUrl: result.previewUrl,
                }
              : t
          ),
        };
      });

      // Show toast and trigger browser download of .WAV file
      if (result.downloadUrl) {
        setToast(`${track.title}.wav ${t.downloadStartedToast}`);
        triggerBrowserDownload(result.downloadUrl);
      }
    } catch (err: any) {
      setPlaylist((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          tracks: prev.tracks.map((t) =>
            t.id === track.id
              ? { ...t, status: 'error', error: err.message }
              : t
          ),
        };
      });
    }
  };

  // Batch convert and stream ZIP archive
  const handleBatchConvertAndZip = async (targetTracks: Track[]) => {
    if (targetTracks.length === 0) return;

    setIsBatchConverting(true);
    setZipDownloadUrl(null);
    setBatchProgress({
      current: 0,
      total: targetTracks.length,
      currentTitle: targetTracks[0]?.title || '',
    });

    const readyTracks: Track[] = [];

    // Helper: convert one track and return updated track
    const processTrack = async (t: Track, index: number): Promise<Track> => {
      setBatchProgress((prev) => ({
        ...prev,
        current: index,
        currentTitle: t.title,
      }));

      // If already ready, skip network conversion
      if (t.status === 'ready' && t.downloadUrl) {
        return t;
      }

      // Set converting state in UI
      setPlaylist((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          tracks: prev.tracks.map((item) =>
            item.id === t.id ? { ...item, status: 'converting' } : item
          ),
        };
      });

      try {
        const res = await fetch('/api/convert/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoId: t.id,
            title: t.title,
            sampleRate: settings.sampleRate,
            bitDepth: settings.bitDepth,
            channels: settings.channels,
          }),
        });

        const result = await res.json();

        if (res.ok && result.success) {
          const updated: Track = {
            ...t,
            status: 'ready',
            fileSize: result.fileSize,
            downloadUrl: result.downloadUrl,
            previewUrl: result.previewUrl,
          };

          setPlaylist((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              tracks: prev.tracks.map((item) =>
                item.id === t.id ? updated : item
              ),
            };
          });

          return updated;
        }
      } catch (err) {
        console.error(`Failed to batch convert ${t.id}:`, err);
      }

      return t;
    };

    // Process with parallel batches of 2
    for (let i = 0; i < targetTracks.length; i += 2) {
      const slice = targetTracks.slice(i, i + 2);
      const batchResults = await Promise.all(
        slice.map((track, idx) => processTrack(track, i + idx + 1))
      );
      readyTracks.push(...batchResults);
    }

    setBatchProgress({
      current: targetTracks.length,
      total: targetTracks.length,
      currentTitle: t.readyToDownload,
    });

    // Generate ZIP stream download
    const idsWithTitles = readyTracks
      .map((tr) => `${tr.id}~${encodeURIComponent(tr.title)}`)
      .join(',');

    const playlistName = playlist?.title || 'YouTube_WAV_Playlist';
    const zipUrl = `/api/download/playlist-zip?ids=${encodeURIComponent(
      idsWithTitles
    )}&title=${encodeURIComponent(playlistName)}&sr=${settings.sampleRate}&bd=${
      settings.bitDepth
    }&ch=${settings.channels}`;

    setZipDownloadUrl(zipUrl);
    setToast(`${playlistName}.zip ${t.downloadStartedToast}`);
    triggerBrowserDownload(zipUrl);

    setTimeout(() => {
      setIsBatchConverting(false);
    }, 1500);
  };

  // Helper to trigger file download in browser
  const triggerBrowserDownload = (downloadUrl: string) => {
    try {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.setAttribute('download', '');
      a.setAttribute('target', '_blank');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
      }, 3000);
    } catch {
      window.location.assign(downloadUrl);
    }
  };

  // Play / Pause preview handler
  const handlePlayPreview = async (track: Track) => {
    if (currentlyPlayingTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }

    setCurrentlyPlayingTrack(track);
    setIsPlaying(true);

    // If audio is not yet converted, trigger conversion in background so preview is available immediately
    if (!track.previewUrl) {
      try {
        fetch('/api/convert/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoId: track.id,
            title: track.title,
            sampleRate: settings.sampleRate,
            bitDepth: settings.bitDepth,
            channels: settings.channels,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setPlaylist((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  tracks: prev.tracks.map((t) =>
                    t.id === track.id
                      ? {
                          ...t,
                          status: 'ready',
                          fileSize: data.fileSize,
                          downloadUrl: data.downloadUrl,
                          previewUrl: data.previewUrl,
                        }
                      : t
                  ),
                };
              });
            }
          })
          .catch(() => {});
      } catch {}
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (playlist) {
      setSelectedIds(new Set(playlist.tracks.map((t) => t.id)));
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-24">
      {/* Top Bar Contract Navbar */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenCookieModal={() => setIsCookieModalOpen(true)}
        hasCookie={hasCookie}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lossless PCM Audio Downloader</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
            {t.tagline}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* URL Input Section */}
        <div className="max-w-3xl mx-auto w-full">
          <UrlInputSection
            url={url}
            setUrl={setUrl}
            isLoading={isLoading}
            onFetch={handleFetchPlaylist}
            language={language}
            presets={presets}
            error={error}
          />
        </div>

        {/* Audio Quality Configuration Bar */}
        <div className="max-w-4xl mx-auto w-full">
          <AudioSettingsBar
            settings={settings}
            onChange={setSettings}
            language={language}
          />
        </div>

        {/* Extracted Playlist View or Welcome State */}
        {playlist ? (
          <div className="max-w-5xl mx-auto w-full">
            <PlaylistView
              playlist={playlist}
              settings={settings}
              language={language}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onConvertTrack={handleConvertSingleTrack}
              onBatchConvertAndZip={handleBatchConvertAndZip}
              isBatchConverting={isBatchConverting}
              batchProgress={batchProgress}
              zipDownloadUrl={zipDownloadUrl}
              currentlyPlayingId={currentlyPlayingTrack?.id || null}
              isPlaying={isPlaying}
              onPlayPreview={handlePlayPreview}
              onOpenCookieModal={() => setIsCookieModalOpen(true)}
            />
          </div>
        ) : (
          /* Empty / Welcome Guidance Area */
          <div className="max-w-4xl mx-auto w-full py-6">
            <InfoSection language={language} />
          </div>
        )}

        {/* Download Toast Notification */}
        {toast && (
          <div
            role="status"
            className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl font-medium text-xs sm:text-sm animate-fade-in transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="truncate max-w-xs">{toast}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
      </main>

      {/* Floating Audio Player Dock */}
      {currentlyPlayingTrack && (
        <AudioPlayerDock
          track={currentlyPlayingTrack}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onClose={() => {
            setCurrentlyPlayingTrack(null);
            setIsPlaying(false);
          }}
          onDownload={handleConvertSingleTrack}
          settings={settings}
          language={language}
        />
      )}

      {/* YouTube Cookie & Bot Bypass Modal */}
      <CookieModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
        language={language}
        onCookieUpdated={refreshCookieStatus}
      />
    </div>
  );
}
