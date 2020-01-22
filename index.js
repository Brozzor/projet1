const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
      width: 1920, 
      height: 1080,
      icon: `file://${__dirname}/assets/icon.png`,
      title: 'South Park by Romain et Anthon',
      movable: true,
      frame: false,
      fullscreen: false,
      backgroundColor: "#111"
    });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});