const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");
const { getPolishWord } = require('./fetch');

function createWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 425,
    frame: false,
    transparent: true,
    //resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  win.loadFile('index.html');
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.handle('fetch-polish-word', async () => {
  try {
    const word = await getPolishWord();
    return word;
  } catch (error) {
    console.error('Error fetching word:', error);
    return { polish: 'Error', english: 'Could not fetch word' };
  }
});