const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getVideoNames: () => ipcRenderer.invoke('get-video-names'),
  openVideoWindow: (filename) =>
    ipcRenderer.invoke('open-video-window', filename),
  onSetVideo: (callback) =>
    ipcRenderer.on('set-video', (_event, filename) => callback(filename)),
});
