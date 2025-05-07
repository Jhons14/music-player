// VideoPlayerWithPlaylist.tsx
import { useEffect, useState } from 'react';

type Video = {
  id: string;
  name: string;
  url: string;
};

export default function VideoPlayerWithPlaylist() {
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [playlist, setPlaylist] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Obtener lista de videos del backend
  useEffect(() => {
    fetch('http://localhost:3001/api/videos')
      .then((res) => res.json())
      .then((data) => setVideoList(data))
      .catch((err) => console.error('Error loading videos:', err));
  }, []);

  useEffect(() => {
    (async () => {
      setVideoList(await window.electronAPI.getVideoNames());
    })();
  }, []);

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

  // Ir al siguiente video
  const playNext = () => {
    if (currentIndex + 1 < playlist.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentVideo = playlist[currentIndex];

  return (
    <div className='p-4 space-y-6'>
      {/* Reproductor */}
      {/* {currentVideo ? (
        <div className='w-full'>
          <h2 className='mb-2 font-bold'>{currentVideo.name}</h2>
          <video
            key={currentVideo.id}
            src={`http://localhost:3001${currentVideo.url}`}
            controls
            autoPlay
            onEnded={playNext}
            className='w-full max-h-[60vh]'
          />
        </div>
      ) : (
        <p>No hay video en reproducción</p>
      )} */}

      {/* Playlist actual */}
      <div>
        <h3
          onClick={() => {
            fetch('http://localhost:3001/api/videos')
              .then(async (res) => await res.json())
              .then((data) => setVideoList(data))
              .catch((err) => console.error('Error loading videos:', err));
          }}
          className='text-lg font-semibold'
        >
          🎵 Playlist
        </h3>
        <ul className='space-y-2'>
          {playlist.map((video, index) => (
            <li key={video.id} className='flex justify-between items-center'>
              <button
                className={`text-left ${
                  index === currentIndex ? 'font-bold text-blue-600' : ''
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                {video.name}
              </button>
              <button onClick={() => removeFromPlaylist(index)}>❌</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Todos los videos disponibles */}
      <div>
        <h3 className='text-lg font-semibold'>📁 Biblioteca</h3>
        <ul className='space-y-2'>
          {videoList.map((video) => (
            <li key={video.id} className='flex justify-between items-center'>
              <span>{video.name}</span>
              <button
                onClick={() => {
                  addToPlaylist(video);
                  window.electronAPI.openVideoWindow(currentVideo);
                }}
              >
                ➕ Añadir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
