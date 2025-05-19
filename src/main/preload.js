const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onPlayVideo: (cb) => ipcRenderer.on('play-video', (_, video) => cb(video)),
  onVideoEndedFromPlayer: (cb) => ipcRenderer.on('player-ended-video', cb),
  onPlayerCommand: (cb) =>
    ipcRenderer.on('player-command', (_event, command) => cb(command)),
  onPlayerStatus: (cb) =>
    ipcRenderer.on('player-status', (_event, status) => cb(status)),
  onWindowPlayerChange: (cb) =>
    ipcRenderer.on('playerWindow-status', (_event, windowStatus) =>
      cb(windowStatus)
    ),

  openVideoWindow: () => ipcRenderer.send('open-video-window'),
  sendVideoToPlayer: (video) => ipcRenderer.send('play-video', video),
  notifyPlayerStatus: (status) => ipcRenderer.send('player-status', status),
  sendPlayerCommand: (command) => ipcRenderer.send('player-command', command),
  notifyVideoEndedFromPlayer: (command) =>
    ipcRenderer.send('video-ended', command),
});
