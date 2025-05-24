import { createStore } from "vuex";
const store = createStore({
  state() {
    return {
      userinfo: null,
      statusHeight: 0,
    };
  },
  mutations: {
    updateUserinfo(state, payload) {
      state.userinfo = payload;
    },
    updateStatusHeight(state, payload) {
      state.statusHeight = payload;
    },
  },
  actions: {},
});

export default store;
