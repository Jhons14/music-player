import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfugosLogo from '../assets/profugos-logo.png';

export default function VideoPlayerPage() {
  type VideoType = {
    id: string;
    name: string;
    url: string;
  };

  const [video, setVideo] = useState<VideoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    window.electronAPI.onPlayVideo(setVideo);
  }, []);

  if (!video) return <p>Esperando video...</p>;

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-black'>
      <div className='relative w-full h-full aspect-video overflow-hidden rounded-2xl shadow-lg'>
        {/* Spinner */}
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-white'></div>
          </div>
        )}

        <AnimatePresence mode='wait'>
          <div id='video-container' className='relative w-full h-full'>
            {video?.url && videoReady && (
              <motion.video
                key={video?.id}
                ref={videoRef}
                src={`http://localhost:3001${video?.url}`}
                controls
                autoPlay
                onEnded={() => {
                  window.electronAPI.notifyVideoEnded();
                }}
                className='w-full h-full object-cover absolute'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
            <img
              className='absolute z-20 w-80 h-40 -top-8 -left-8'
              src={ProfugosLogo}
              alt=''
              srcSet=''
            />
            <div className='absolute -top-6 -left-8 bg-gradient-to-br mask-radial-at-center bg-white/40 mask-radial-to-60% z-10 w-80 h-40 rounded-xl '></div>
          </div>
        </AnimatePresence>

        {/* Precarga oculta */}
        {video?.url && !videoReady && (
          <video
            src={`http://localhost:3001${video?.url}`}
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
