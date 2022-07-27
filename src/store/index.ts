import { createStore } from "vuex";
import { isDev } from "../frontend";
import type { Config } from "../../package/config";

export default createStore({
  state: {
    isDev,
    config: undefined as Config | undefined
  },
  mutations: {
    setConfig(state, data) {
      if (data) state.config = data;
    }
  },
  actions: {},
  modules: {}
});
