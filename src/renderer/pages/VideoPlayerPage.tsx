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

  const [bannerState, setBannerState] = useState<BannerState>('hidden');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.electronAPI.onPlayVideo(setVideo);
    window.electronAPI.onPlayerCommand((command) => {
      if (!videoRef.current) return;

      switch (command.type) {
        case 'pause':
          videoRef.current.pause();
          break;
        case 'play':
          videoRef.current.play();
          break;
        case 'seek':
          videoRef.current.currentTime += command.payload;
          break;
        case 'previous':
          window.electronAPI.notifyPreviousRequested();
          break;
        case 'next':
          window.electronAPI.notifyNextRequested();
          break;
      }
    });
  }, []);

  useEffect(() => {
    if (!video?.name) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Fases de animación

    setBannerState('hidden');
    const timeouts: NodeJS.Timeout[] = [];

    timeouts.push(
      setTimeout(() => {
        setBannerState('entering');
        timeouts.push(
          setTimeout(() => {
            setBannerState('visible');

            timeouts.push(
              setTimeout(() => {
                setBannerState('exiting');

                timeouts.push(
                  setTimeout(() => {
                    setBannerState('hidden');
                  }, 1000) // duración efecto de salida
                );
              }, 8000) // tiempo efecto visible
            );
          }, 1000) // duración efecto de entrada
        );
      }, 2000) // tiempo que tarde en mostrarse
    );

    // Guardar último timeout activo para control externo
    timeoutRef.current = timeouts[timeouts.length - 1];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [video?.name]);

  const Bannerclasses = {
    hidden: 'opacity-0 scale-x-0 pointer-events-none',
    entering: 'opacity-100 scale-x-100',
    visible: 'opacity-100 scale-x-100',
    exiting: 'opacity-0 scale-x-0',
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-black'>
      {!video ? (
        <p className='text-white'>No hay videos para reproducir</p>
      ) : (
        <div className='relative w-full h-full aspect-video overflow-hidden rounded-2xl shadow-lg'>
          {/* Spinner */}
          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 '>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-white'></div>
            </div>
          )}
          <AnimatePresence mode='wait'>
            <div id='video-container' className='relative w-full h-full'>
              <div
                key={video.name}
                className={`absolute flex bottom-2 left-0 z-20
      transform origin-left transition-all duration-1000 ease-in-out w-160 h-25 items-center border-2  bg-white/80 rounded-r-full shadow-2xl
      ${Bannerclasses[bannerState]}`}
              >
                <img
                  className={`absolute w-80 h-40 -top-9 -left-8 transition-opacity duration-700 delay-300 ${
                    bannerState === 'entering' || bannerState === 'visible'
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                  src={ProfugosLogo}
                  alt='logo'
                />
                <div className='flex absolute items-center text-center w-98 right-2'>
                  <span
                    className={`
            transition-opacity duration-700 delay-300 w-full text-xl font-semibold
            ${
              bannerState === 'entering' || bannerState === 'visible'
                ? 'opacity-100'
                : 'opacity-0'
            }
          `}
                  >
                    {video.name}
                  </span>
                </div>
              </div>

              {/* 🎬 Reproductor con animación y controles */}
              {video?.url && videoReady && (
                <motion.div
                  key={video?.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className='absolute w-full h-full'
                >
                  <video
                    ref={videoRef}
                    src={`http://localhost:3001${video?.url}`}
                    autoPlay
                    onEnded={() => window.electronAPI.notifyVideoEnded()}
                    className='w-full h-full object-cover'
                  />
                </motion.div>
              )}
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
      )}
    </div>
  );
}
