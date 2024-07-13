import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import Yeelight from './Yeelight';
import MiLogin from './MiLogin';

const yeelight = new Yeelight();
const miaccount = new MiLogin();
let isCloseWithApp = false;

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 850,
    height: 550,
    minWidth: 768,
    minHeight: 520,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('top.xieanqing.mi-light-controller');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.handle('ping', () => console.log('pong'));
  ipcMain.handle('turn-on', () => turn('on'));
  ipcMain.handle('turn-off', () => turn('off'));
  ipcMain.handle('set-lightness', (_, v) => console.log('set-lightness', v));
  ipcMain.handle('set-color-temp', (_, v) => console.log('set-color-temp', v));
  ipcMain.handle('login-with-qrcode', () => loginWithQRCode());
  ipcMain.handle('login-with-account', (_, { username, password }) => loginWithAccount({ username, password }));
  ipcMain.handle('test-connection', async (_, IP, token) => {
    yeelight.setDevice(IP, token);
    return await yeelight.hello();
  });
  ipcMain.handle('set-start-with-system', (_, v) => setStartWithSystem(v));
  ipcMain.handle('set-close-with-app', (_, v) => setCloseWithApp(v));
  // ipcMain.handle('get-initstate', (_, v) => setCloseWithApp(v));

  ipcMain.on('listen-qrcode-scan', async (event, lp) => {
    const deviceList = await miaccount.listenScanState(lp);
    event.sender.send('qrcode-success', deviceList);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async (event) => {
  event.preventDefault();

  if (isCloseWithApp) await turn('off');
  yeelight.destory();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

async function turn(state: 'on' | 'off') {
  const res = await yeelight.hello();
  if (res) {
    yeelight.turn(state);
  }
}

async function loginWithQRCode() {
  await miaccount.getSign();
  return await miaccount.getQRCode();
}

async function loginWithAccount({ username, password }) {
  miaccount.setAccount(username, password);
  return await miaccount.getDevicesByAccount();
}

function setStartWithSystem(isStartWithSystem: boolean) {
  app.setLoginItemSettings({
    openAtLogin: isStartWithSystem,
    openAsHidden: false,
  });
}

function setCloseWithApp(_isCloseWithApp: boolean) {
  isCloseWithApp = _isCloseWithApp;
}
