import { useEffect, useState } from 'react';

type VideoStatus = {
  playing: boolean;
  muted: boolean;
};

type Video = {
  id: string;
  name: string;
  url: string;
};

type VideoLibraryParmsType = {
  setVideoStatus: (videoStatus: VideoStatus) => void;
  addToPlaylist: (video: Video) => void;
};

export function VideoLibrary({
  setVideoStatus,
  addToPlaylist,
}: VideoLibraryParmsType) {
  const [library, setLibrary] = useState<Video[]>([]);

  // Obtener lista de videos del backend
  useEffect(() => {
    fetch('http://localhost:3001/api/videos')
      .then((res) => res.json())
      .then((data) => setLibrary(data))
      .catch((err) => console.error('Error loading videos:', err));

    window.electronAPI?.onPlayerStatus?.((status) => {
      setVideoStatus((prev) => ({ ...prev, ...status }));
    });
  }, []);
  return (
    // Todos los videos disponibles
    <div className='flex flex-col w-full p-4 border-1 border-indigo-50/10 m-0'>
      <h3 className='text-lg font-semibold'>📁 Biblioteca</h3>
      <ul className='space-y-2 '>
        {library.map((video) => (
          <li key={video.id} className='flex justify-between items-center '>
            <span
              className='cursor-pointer hover:text-green-600 '
              onClick={() => {
                addToPlaylist(video);
              }}
            >
              {video.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
