import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfugosLogo from '../assets/profugos-logo.png';

export default function VideoPlayerPage() {
  const [filename, setFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    window.electronAPI.onSetVideo((newFilename) => {
      if (newFilename !== filename) {
        setIsLoading(true);
        setVideoReady(false);
        setFilename(newFilename);
      }
    });
  }, [filename]);

  const videoSrc = filename
    ? `http://localhost:3001/videos/${encodeURIComponent(filename)}.mp4`
    : null;

  const container = document.getElementById('video-container');
  if (container?.requestFullscreen) {
    container.requestFullscreen();
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-black'>
      <h2 className='text-white mb-4'>{filename}</h2>

      <div className='relative w-full h-full aspect-video overflow-hidden rounded-2xl shadow-lg'>
        {/* Spinner */}
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-white'></div>
          </div>
        )}

        <AnimatePresence mode='wait'>
          <div id='video-container'>
            {videoSrc && videoReady && (
              <motion.video
                key={filename}
                ref={videoRef}
                src={videoSrc}
                controls
                autoPlay
                className='w-full h-full object-cover absolute'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
            <img
              className='absolute z-20 w-80 h-40 -top-2'
              src={ProfugosLogo}
              alt=''
              srcSet=''
            />
            <div className='absolute bg-gradient-to-br mask-radial-at-center bg-white/30 mask-radial-from-0% mask-radial-to-70% z-10 w-80 h-40 rounded-xl top-0'></div>
          </div>
        </AnimatePresence>

        {/* Precarga oculta */}
        {videoSrc && !videoReady && (
          <video
            src={videoSrc}
            className='hidden'
            onLoadedData={() => {
              setVideoReady(true);
              setIsLoading(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
