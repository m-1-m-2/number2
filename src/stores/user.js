import { defineStore } from 'pinia';

export const userStore = defineStore('user', {
  state: () => ({
    login_dialog_boolean: false,
    server_dialog_boolean: false,
    userBalance: 0,
  }),
  getters: {
    getters_login_dialog_boolean: (state) => state.login_dialog_boolean,
    getters_server_dialog_boolean: (state) => state.server_dialog_boolean,
    getters_userBalance: (state) => state.userBalance,
  },
  actions: {
    actions_login_dialog_boolean () {
      this.login_dialog_boolean = !this.login_dialog_boolean;
    },
    actions_server_dialog_boolean () {
      this.server_dialog_boolean = !this.server_dialog_boolean;
    },
    actions_userBalance (val) {
      this.userBalance = val;
    },
  },
});
