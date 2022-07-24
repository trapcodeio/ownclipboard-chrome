export default {
  appName: "OwnClipboard",
  defaultApiHost: "https://ownclipboard.com",
  customApiHost: null,
  user: {
    key: null,
    connected: false,
    connectedData: null
  },
  clips: {
    watch: false,
    interval: 2
  },
  pin: {
    enabled: false,
    secret: null
  },
  perPage: {
    local: 50
  }
};
