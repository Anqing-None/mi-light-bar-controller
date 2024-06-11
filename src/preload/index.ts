import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  ping: () => ipcRenderer.invoke('ping'),
  turnOn: () => ipcRenderer.invoke('turn-on'),
  turnOff: () => ipcRenderer.invoke('turn-off'),
  setLightness: (value) => ipcRenderer.invoke('set-lightness', value),
  setColorTemp: (value) => ipcRenderer.invoke('set-color-temp', value),
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
