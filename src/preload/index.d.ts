import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      loginWithQRCode: () => Promise<string>;
      loginWithAccount: ({ username, password }) => Promise<any[]>;
      testConnection: (IP: string, token: string) => boolean;
      setStartWithSystem: (isStartWithSystem: boolean) => void;
      setCloseWithApp: (isCloseWithApp: boolean) => void;
      execCommand: (command: string) => Promise<any>;
    };
  }
}
