export type ConnectedResponse = {
  name: string;
  api_key: string;
  hits: string;
  used_by?: string;
};

export type Config = {
  appName: string;
  defaultApiHost: string;
  customApiHost?: string;
  user: {
    key?: string;
    connected: boolean;
    connectedData?: ConnectedResponse;
  };
  clips: {
    watch: boolean;
    interval: number;
  };
  pin: {
    enabled: boolean;
    secret?: string;
  };
  perPage: {
    local: number;
  };
};

const config: Config = {
  appName: "OwnClipboard",
  defaultApiHost: "https://ownclipboard.com",
  user: {
    connected: false
  },
  clips: {
    watch: false,
    interval: 2
  },
  pin: {
    enabled: false
  },
  perPage: {
    local: 50
  }
};

export default config;
