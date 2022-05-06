import axios from "axios";
import router from '../router';

export default {
  namespaced: true,

  state: {
    userData: null
  },

  getters: {
    user: state => state.userData
  },

  mutations: {
    setUserData(state, user) {
      state.userData = user;
    }
  },

  actions: {
    getUserData({ commit }) {
      axios
        .get(process.env.VUE_APP_ROOT_API + "user")
        .then(response => {
          commit("setUserData", response.data);
        })
        .catch(() => {
          localStorage.removeItem("authToken");
        });
    },
    sendLoginRequest({ commit }, data) {
      commit("setErrors", {}, { root: true });
      return axios
        .post(process.env.VUE_APP_ROOT_API + "login", data)
        .then(response => {
          commit("setUserData", response.data.data.user);
          localStorage.setItem("authToken", response.data.data.token);
        });
    },
    sendLogoutRequest({ commit }) {

      axios.post(process.env.VUE_APP_ROOT_API + "logout").then(() => {
        commit("setUserData", null);
        localStorage.removeItem("authToken");
        router.push({
          name: "login"
        });
      });
    },
  }
};
