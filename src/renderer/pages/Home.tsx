// VideoPlayerWithPlaylist.tsx
import { useEffect, useState } from 'react';
import {
  IoMdRemoveCircle,
  IoMdAddCircle,
  IoMdPause,
  IoMdPlay,
} from 'react-icons/io';
import {
  MdSkipPrevious,
  MdSkipNext,
  MdForward10,
  MdReplay10,
} from 'react-icons/md';

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
    handleStart(playlist[index]);
  };

  return (
    <div className='relative flex flex-col bg-black/85 h-screen text-white items-center'>
      <div className='p-2 space-y-6 w-full grid grid-cols-2 h-full'>
        {/* Todos los videos disponibles */}
        <div className='flex flex-col w-full p-4 border-1 border-indigo-50/10 m-0'>
          <h3 className='text-lg font-semibold'>📁 Biblioteca</h3>
          <ul className='space-y-2 '>
            {videoList.map((video) => (
              <li key={video.id} className='flex justify-between items-center '>
                <span>{video.name}</span>
                <button
                  className='cursor-pointer transition hover:scale-110'
                  onClick={() => {
                    addToPlaylist(video);
                  }}
                >
                  <IoMdAddCircle className='hover:fill-green-400' size={24} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Playlist actual */}
        <div className='p-4 border-1 border-indigo-50/10'>
          <h3 className='text-lg font-semibold'>🎵 Playlist</h3>
          <ul className='space-y-2'>
            {playlist.map((video, index) => (
              // Nombre de la cancion
              <li key={video.id} className='flex justify-between items-center '>
                <button
                  className={`text-left hover:text-amber-300 cursor-pointer ${
                    index === currentIndex ? 'font-bold text-blue-600' : ''
                  }`}
                  onClick={() => handleSelectVideo(index)}
                >
                  {video.name}
                </button>
                <button
                  className='cursor-pointer  transition hover:scale-110'
                  onClick={() => removeFromPlaylist(index)}
                >
                  <IoMdRemoveCircle
                    className='hover:fill-red-500 rounded-full'
                    size={24}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id='Controles' className='flex gap-4 py-4'>
        <button
          className='cursor-pointer'
          onClick={() => handleSelectVideo(currentIndex - 1)}
        >
          <MdSkipPrevious className='hover:fill-amber-300' size={24} />
        </button>

        <button
          className='cursor-pointer'
          onClick={() =>
            window.electronAPI.sendPlayerCommand({ type: 'seek', payload: -10 })
          }
        >
          <MdReplay10 className='hover:fill-amber-300' size={24} />
        </button>

        <button
          className='cursor-pointer'
          onClick={() =>
            window.electronAPI.sendPlayerCommand({ type: 'pause' })
          }
        >
          <IoMdPause className='hover:fill-amber-300' size={24} />
        </button>
        <button
          className='cursor-pointer'
          onClick={() => window.electronAPI.sendPlayerCommand({ type: 'play' })}
        >
          <IoMdPlay className='hover:fill-amber-300' size={24} />
        </button>

        <button
          className='cursor-pointer'
          onClick={() =>
            window.electronAPI.sendPlayerCommand({ type: 'seek', payload: 10 })
          }
        >
          <MdForward10 className='hover:fill-amber-300' size={24} />
        </button>

        <button
          className='cursor-pointer '
          onClick={() => handleSelectVideo(currentIndex + 1)}
        >
          <MdSkipNext className='hover:fill-amber-300' size={24} />
        </button>
      </div>
      {/* <div className='relative flex items-center justify-center h-16'>
        <button
          className='absolute cursor-pointer hover:scale-110 mb-2 transition duration-200 rounded-full hover:border-2 hover:p-1 border-amber-300'
          onClick={() => handleStart(currentVideo)}
        >
          <FaCirclePlay size={40} />
        </button>
      </div> */}
    </div>
  );
}
