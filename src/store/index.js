import auth from "./auth";
import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    errors: []
  },

  getters: {
    errors: state => state.errors
  },

  mutations: {
    setErrors(state, errors) {
      state.errors = errors;
    }
  },

  actions: {},

  modules: {
    auth
  }
});
