const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");
const { getPolishWord } = require('./fetch');
const log = require('electron-log');


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
  //win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

// Inside your Puppeteer handler
ipcMain.handle('fetch-polish-word', async () => {
  try {
    log.info('Fetching Polish word...');
    const word = await getPolishWord();
    log.info('Fetched:', word);
    return word;
  } catch (error) {
    log.error('Error fetching word:', error);
    return { polish: 'Error', english: 'Could not fetch word' };
  }
});