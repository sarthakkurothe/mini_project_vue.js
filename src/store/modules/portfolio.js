export default {
  namespaced: true,
  state: () => ({
    editing: null,
  }),
  mutations: {
    setEditing(state, payload) {
      state.editing = payload ?? null;
    },
    clearEditing(state) {
      state.editing = null;
    },
  },
  actions: {
    startEditing({ commit }, payload) {
      commit('setEditing', payload);
    },
    stopEditing({ commit }) {
      commit('clearEditing');
    },
  },
  getters: {
    editing(state) {
      return state.editing;
    },
  },
};
