import { app, BrowserWindow, ipcMain } from 'electron';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; // Importar fileURLToPath para convertir URL a ruta

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mediaFolder = 'D:/music-videos'; // ruta seleccionada
let playerWindow = null;

const getMediaFolder = () => mediaFolder;

function createServer() {
  const server = express();
  server.use(cors());
  server.get('/videos/:filename', (req, res) => {
    const folder = getMediaFolder();
    const filePath = path.join(folder, req.params.filename);

    if (!fs.existsSync(filePath)) return res.status(404).send('No existe');

    const stat = fs.statSync(filePath);
    const range = req.headers.range;
    if (!range) {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : stat.size - 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4',
    });

    fs.createReadStream(filePath, { start, end }).pipe(res);
  });

  server.get('/api/videos', async (req, res) => {
    const videos = fs.readdirSync(getMediaFolder()).map((file) => ({
      id: file,
      name: file.replace(/\.[^/.]+$/, ''),
      url: `/videos/${file}`,
    }));

    res.json(videos);
  });

  server.listen(3001);
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWindow.loadURL('http://localhost:5173'); // o tu build de React
};

function createPlayerWindow() {
  if (playerWindow) {
    playerWindow.focus();
    return;
  }

  playerWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  playerWindow.loadURL('http://localhost:5173/player');

  playerWindow.on('closed', () => {
    playerWindow = null;
  });
}

ipcMain.handle('get-video-names', async () => {
  const files = fs
    .readdirSync(getMediaFolder())
    .filter((file) => /\.(mp4|webm|ogg)$/.test(file));
  return files; // Devuelve lista de nombres
});
// Abrir reproductor
ipcMain.on('open-video-window', () => {
  createPlayerWindow();
});

// Recibir evento de "video terminado"
ipcMain.on('video-ended', () => {
  mainWindow?.webContents.send('player-ended-video');
});

ipcMain.on('play-video', (_, video) => {
  if (!playerWindow) return;
  const sendVideo = () => {
    playerWindow?.webContents.send('play-video', video);
  };
  if (playerWindow.webContents.isLoading()) {
    playerWindow.webContents.once('did-finish-load', sendVideo);
  } else {
    sendVideo();
  }
});

ipcMain.on('player-command', (_event, command) => {
  playerWindow?.webContents.send('player-command', command);
});

app.whenReady().then(() => {
  createServer();
  createWindow(); // ← Lanza la app
});
