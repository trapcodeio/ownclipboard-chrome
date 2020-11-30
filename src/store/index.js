import { createStore } from 'vuex'

export default createStore({
  state: {
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
