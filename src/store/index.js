import auth from "./auth";
import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    errors: [],
    errorEdit: [],
  },

  getters: {
    errors: state => state.errors,
    errorEdit: state => state.errorEdit,
  },

  mutations: {
    setErrors(state, errors) {
      state.errors = errors;
    },
    setErrorEdit(state, errorEdit) {
      state.errorEdit = errorEdit;
    },
  },

  actions: {},

  modules: {
    auth
  }
});
