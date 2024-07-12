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
      loginWithQRCode: () => Promise<string>;
      loginWithAccount: ({ username, password }) => Promise<any[]>;
      testConnection: (IP: string, token: string) => boolean;
      getInitState: () => Promise<{ power: string; lightness: number; colorTemperature: number }>;
    };
  }
}
