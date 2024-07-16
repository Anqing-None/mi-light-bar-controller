import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Command {
    id: number;
    method: string;
    params: (string | number)[];
  }

  interface ResultSuccess {
    id: number;
    result: (string | number)[];
  }

  interface ResultError {
    id: number;
    error: {
      code: number;
      message: string;
    };
  }

  interface Window {
    electron: ElectronAPI;
    api: {
      loginWithQRCode: () => Promise<string>;
      loginWithAccount: ({ username, password }) => Promise<any[]>;
      testConnection: (IP: string, token: string) => Promise<ResultError | ResultSuccess>;
      setStartWithSystem: (isStartWithSystem: boolean) => void;
      setCloseWithApp: (isCloseWithApp: boolean) => void;
      execCommand: (command: Command) => Promise<ResultError | ResultSuccess>;
    };
  }
}
