import auth from "./auth";
import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    errors: [],
    errorAdd: [],
    errorEdit: [],
  },

  getters: {
    errors: state => state.errors,
    errorAdd: state => state.errorAdd,
    errorEdit: state => state.errorEdit,
  },

  mutations: {
    setErrors(state, errors) {
      state.errors = errors;
    },
    setErrorAdd(state, errorAdd) {
      state.errorAdd = errorAdd;
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
