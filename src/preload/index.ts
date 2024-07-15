import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  loginWithQRCode: () => ipcRenderer.invoke('login-with-qrcode'),
  loginWithAccount: ({ username, password }) => ipcRenderer.invoke('login-with-account', { username, password }),
  testConnection: (IP: string, token: string) => ipcRenderer.invoke('test-connection', IP, token),
  setStartWithSystem: (isStartWithSystem: boolean) => ipcRenderer.invoke('set-start-with-system', isStartWithSystem),
  setCloseWithApp: (isCloseWithApp: boolean) => ipcRenderer.invoke('set-close-with-app', isCloseWithApp),
  execCommand: (command) => ipcRenderer.invoke('exec-command', command),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
