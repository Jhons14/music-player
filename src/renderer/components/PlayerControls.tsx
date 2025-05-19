import { IoMdPause, IoMdPlay } from 'react-icons/io';
import {
  MdSkipPrevious,
  MdSkipNext,
  MdForward10,
  MdReplay10,
} from 'react-icons/md';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
type VideoStatus = {
  playing: boolean;
};
type PlayerControls = {
  handleSelectVideo: (currentIndex: number) => void;
  currentIndex: number;
  videoStatus?: VideoStatus;
  handlePause: () => void;
};

export function PlayerControls({
  handleSelectVideo,
  currentIndex,
  videoStatus,
  handlePause,
}: PlayerControls) {
  return (
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

      <button className='cursor-pointer' onClick={() => handlePause()}>
        {!videoStatus?.playing ? (
          <IoMdPlay className='hover:fill-amber-300' size={24} />
        ) : (
          <IoMdPause className='hover:fill-amber-300' size={24} />
        )}
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

      <button
        className='cursor-pointer '
        onClick={() =>
          window.electronAPI.sendPlayerCommand({
            type: !videoStatus.muted ? 'mute' : 'unmute',
          })
        }
      >
        {!videoStatus?.muted ? (
          <HiVolumeUp className='hover:fill-amber-300' size={24} />
        ) : (
          <HiVolumeOff className='hover:fill-amber-300' size={24} />
        )}
      </button>
    </div>
  );
}
