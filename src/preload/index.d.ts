import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      turnOn: () => Promise<void>;
      turnOff: () => Promise<void>;
      ping: () => Promise<void>;
      setLightness: (value: number) => Promise<void>;
      setColorTemp: (value: number) => Promise<void>;
    };
  }
}
