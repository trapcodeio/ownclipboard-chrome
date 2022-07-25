import { createStore } from "vuex";
import { isDev } from "../frontend";

export default createStore({
  state: {
    isDev,
    config: null as null | typeof import("../../package/config").default
  },
  mutations: {
    setConfig(state, data) {
      if (data) state.config = data;
    }
  },
  actions: {},
  modules: {}
});
