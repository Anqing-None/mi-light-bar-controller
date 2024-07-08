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
      getLoginUrl: () => Promise<string>;
      testConnection: (IP: string, token: string) => boolean;
      getInitState: () => Promise<{ power: string; lightness: number; colorTemperature: number }>;
    };
  }
}
