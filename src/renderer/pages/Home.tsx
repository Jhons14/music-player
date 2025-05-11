// VideoPlayerWithPlaylist.tsx
import { useEffect, useState } from 'react';
import { FaCirclePlay } from 'react-icons/fa6';

type Video = {
  id: string;
  name: string;
  url: string;
};

export default function VideoPlayerWithPlaylist() {
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [playlist, setPlaylist] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideo = playlist[currentIndex];

  // Obtener lista de videos del backend
  useEffect(() => {
    fetch('http://localhost:3001/api/videos')
      .then((res) => res.json())
      .then((data) => setVideoList(data))
      .catch((err) => console.error('Error loading videos:', err));
  }, []);

  useEffect(() => {
    window.electronAPI.onVideoEndedFromPlayer(() => {
      if (currentIndex + 1 < playlist.length) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        const nextVideo = playlist[nextIndex];
        window.electronAPI.sendVideoToPlayer(nextVideo);
      }
    });
  }, [currentIndex, playlist]);

  // Agregar a la playlist
  const addToPlaylist = (video: Video) => {
    if (!playlist.find((v) => v.id === video.id)) {
      setPlaylist((prev) => [...prev, video]);
    }
  };

  // Quitar de la playlist
  const removeFromPlaylist = (index: number) => {
    setPlaylist((prev) => prev.filter((_, i) => i !== index));
    if (index === currentIndex && currentIndex === playlist.length - 1) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleStart = (video: Video) => {
    if (!currentVideo) return;
    window.electronAPI.openVideoWindow();
    window.electronAPI.sendVideoToPlayer(video);
  };

  const handleSelectVideo = (index: number) => {
    setCurrentIndex(index);
    console.log(currentVideo);
    console.log(playlist[index]);

    handleStart(playlist[index]);
  };

  return (
    <div className='relative flex flex-col bg-black/85 h-screen text-white items-center'>
      <div className='p-4 space-y-6 w-full grid grid-cols-2 gap-20 justify-between'>
        {/* Todos los videos disponibles */}
        <div className='flex flex-col'>
          <h3 className='text-lg font-semibold'>📁 Biblioteca</h3>
          <ul className='space-y-2 '>
            {videoList.map((video) => (
              <li key={video.id} className='flex justify-between items-center '>
                <span>{video.name}</span>
                <button
                  className='cursor-pointer transition duration-500 hover:scale-120'
                  onClick={() => {
                    addToPlaylist(video);
                  }}
                >
                  ➕
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Playlist actual */}
        <div>
          <h3 className='text-lg font-semibold'>🎵 Playlist</h3>
          <ul className='space-y-2'>
            {playlist.map((video, index) => (
              <li key={video.id} className='flex justify-between items-center '>
                <button
                  className={`text-left cursor-pointer ${
                    index === currentIndex ? 'font-bold text-blue-600' : ''
                  }`}
                  onClick={() => handleSelectVideo(index)}
                >
                  {video.name}
                </button>
                <button
                  className='cursor-pointer transition duration-500 hover:scale-120'
                  onClick={() => removeFromPlaylist(index)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='absolute bottom-4'>
        <button
          className='cursor-pointer  hover:scale-110 transition duration-200 rounded-full hover:border-2 hover:p-1 border-amber-300'
          onClick={() => handleStart(currentVideo)}
        >
          <FaCirclePlay size={40} />
        </button>
      </div>
    </div>
  );
}
