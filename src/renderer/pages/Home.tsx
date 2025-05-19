// VideoPlayerWithPlaylist.tsx
import { useEffect, useState } from 'react';
import { PlayerControls } from '../components/PlayerControls';
import { VideoLibrary } from '../components/VideoLibrary';
import { PlayList } from '../components/PlayList';
type Video = {
  id: string;
  name: string;
  url: string;
};

type VideoStatus = {
  playing: boolean;
  muted: boolean;
};

export default function VideoPlayerWithPlaylist() {
  const [playlist, setPlaylist] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoWindowStatus, setVideoWindowStatus] = useState();
  const [videoStatus, setVideoStatus] = useState<VideoStatus>();

  const currentVideo = playlist[currentIndex];

  useEffect(() => {
    window.electronAPI?.onWindowPlayerChange?.((windowStatus) => {
      setVideoWindowStatus(windowStatus);
      setVideoStatus({ playing: false, muted: false });
    });
  }, []);

  useEffect(() => {
    const restartVideoStatusControls = () =>
      setVideoStatus({ playing: currentIndex ? true : false, muted: false });

    window.electronAPI?.onVideoEndedFromPlayer?.(() => {
      if (currentIndex + 1 < playlist.length) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        const nextVideo = playlist[nextIndex];
        window.electronAPI.sendVideoToPlayer(nextVideo);
      }
    });
    if (videoWindowStatus === 'opened') {
      restartVideoStatusControls();
    }
  }, [currentIndex, playlist, videoWindowStatus]);

  // Agregar a la playlist
  const addToPlaylist = (video: Video) => {
    if (!playlist.find((v) => v.id === video.id)) {
      setPlaylist((prev) => [...prev, video]);
    }
  };
  // Quitar de la playlist
  const removeFromPlaylist = (index: number) => {
    setPlaylist((prev) => prev.filter((_, i) => i !== index));
    if (index === currentIndex) {
      if (currentIndex === playlist.length - 1) {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
        handleStart(playlist[Math.max(0, currentIndex - 1)]);
      } else {
        handleStart(playlist[Math.max(0, currentIndex + 1)]);
      }
    }
  };

  const handleStart = async (video: Video) => {
    if (!currentVideo) return;
    await window.electronAPI?.openVideoWindow?.();
    window.electronAPI?.sendVideoToPlayer?.(video);
  };

  const handleSelectVideo = (index: number) => {
    if (index < 0 || index >= playlist.length) return;
    setCurrentIndex(index);
    handleStart(playlist[index]);
  };

  const handlePause = async () => {
    console.log(videoWindowStatus);

    if (!videoWindowStatus || videoWindowStatus === 'closed') {
      console.log('kakakak');

      handleStart(currentVideo);
      return;
    }
    if (!videoStatus?.playing) {
      await window.electronAPI.openVideoWindow();
      window.electronAPI.sendPlayerCommand({ type: 'play' });
    } else {
      window.electronAPI.sendPlayerCommand({ type: 'pause' });
    }
  };

  return (
    <div className='relative flex flex-col bg-black/85 h-screen text-white items-center'>
      <div className='p-2 space-y-6 w-full grid grid-cols-2 h-full'>
        <VideoLibrary
          setVideoStatus={setVideoStatus}
          addToPlaylist={addToPlaylist}
        />
        {/* Playlist actual */}
        <PlayList
          playlist={playlist}
          currentIndex={currentIndex}
          handleSelectVideo={handleSelectVideo}
          removeFromPlaylist={removeFromPlaylist}
        />
      </div>
      <PlayerControls
        handleSelectVideo={handleSelectVideo}
        currentIndex={currentIndex}
        videoStatus={videoStatus}
        handlePause={handlePause}
      />
    </div>
  );
}
