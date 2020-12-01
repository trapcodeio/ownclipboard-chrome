import { createStore } from 'vuex'

export default createStore({
  state: {
    isDev: process.env.NODE_ENV === 'development',
    config: null,
  },
  mutations: {
    setConfig(state, data){
      if(data) state.config = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
