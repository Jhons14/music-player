import { IoMdRemoveCircle } from 'react-icons/io';
type Video = {
  id: string;
  name: string;
  url: string;
};

type PlayListParmsType = {
  playlist: Video[];
  currentIndex: number;
  handleSelectVideo: (index: number) => void;
  removeFromPlaylist: (index: number) => void;
};

export function PlayList({
  playlist,
  currentIndex,
  handleSelectVideo,
  removeFromPlaylist,
}: PlayListParmsType) {
  return (
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
  );
}
