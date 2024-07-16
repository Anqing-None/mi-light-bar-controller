import { ElectronAPI } from '@electron-toolkit/preload';

interface Command {
  id: number;
  method: string;
  params: (string | number)[];
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      loginWithQRCode: () => Promise<string>;
      loginWithAccount: ({ username, password }) => Promise<any[]>;
      testConnection: (IP: string, token: string) => Promise<boolean>;
      setStartWithSystem: (isStartWithSystem: boolean) => void;
      setCloseWithApp: (isCloseWithApp: boolean) => void;
      execCommand: (command: Command) => Promise<string>;
    };
  }
}
