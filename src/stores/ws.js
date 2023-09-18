import { defineStore } from 'pinia';

export const wsStore = defineStore('ws', {
  state: () => ({
    socket: null,
  }),
  getters: {
    getters_socket: (state) => state.socket,
  },
  actions: {
    actions_socket (val) {
      this.socket = val;
    },
  },
});
