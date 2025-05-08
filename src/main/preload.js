const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openVideoWindow: () => ipcRenderer.send('open-video-window'),
  // onSetVideo: (callback) =>
  //   ipcRenderer.on('set-video', (_event, video) => callback(video)),
  onPlayVideo: (cb) => ipcRenderer.on('play-video', (_, video) => cb(video)),
  onVideoEndedFromPlayer: (cb) => ipcRenderer.on('player-ended-video', cb),
  sendVideoToPlayer: (video) => ipcRenderer.send('play-video', video),
  notifyVideoEnded: () => ipcRenderer.send('video-ended'),
});
