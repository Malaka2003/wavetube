# WaveTube – YouTube Playlist to WAV Downloader

A React + Vite frontend with an Express backend for extracting audio and converting it to WAV.

## Requirements
- Node.js 20 or newer
- FFmpeg installed and available on `PATH` (or set `FFMPEG_PATH`)
- Internet access so the server can download the official yt-dlp standalone binary on first run

## Run locally
1. Extract the project.
2. Install dependencies: `npm install`
3. (Optional) Copy `.env.example` to `.env` and set `FFMPEG_PATH` if FFmpeg is not on your `PATH`.
4. Start the app: `npm run dev`
5. Open `http://localhost:3000`.

The backend downloads yt-dlp into `bin/yt-dlp` on first use. YouTube may require valid browser cookies for some videos or playlists. Only download content you own or are authorized to download, and follow YouTube's terms and applicable copyright law.

## Production build
Run `npm run build`, then set `NODE_ENV=production` and start with `npm start`.
