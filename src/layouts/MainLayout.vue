<template>
  <q-layout view="hHh lpr fFf"
            container
            class="window-height text-white">
    <q-header elevated
              class="bg-black h-64">
      <q-toolbar class="h-inherit">
        <q-btn flat
               round
               dense
               icon="menu"
               @click="dialog_left_switch"
               class="q-mr-sm" />
        <!-- 网站图标 -->
        <q-img src="~/assets/svg/logo.svg"
               spinner-color="white"
               class="hideElement h-40 w-200" />
        <!-- 网站选项 -->
        <q-tabs no-caps
                active-color="primary"
                indicator-color="transparent"
                class="text-grey hideElement"
                v-model="tab">
          <q-tab name="Gaming"
                 label="Gaming" />
          <q-tab name="Sport"
                 label="Sport" />
        </q-tabs>
        <q-toolbar-title></q-toolbar-title>
        <q-btn class="q-mr-sm"
               :label="userStore.getters_userBalance.toFixed(2)" />
        <q-btn class="glossy q-mr-sm"
               color="primary"
               @click="userStore.actions_login_dialog_boolean"
               label="Log In" />
        <q-btn class="glossy q-mr-sm bg-red-10"
               @click="userStore.actions_login_dialog_boolean"
               label="Sign Up" />
        <q-btn flat
               round
               dense
               @click="dialog_right_switch"
               icon="chat" />
      </q-toolbar>
    </q-header>
    <!-- 左边弹出框 -->
    <q-drawer side="left"
              v-model="dialog_left"
              :width="228"
              elevated
              class="bg-white-10 q-pa-sm scroll hide-scrollbar text-black">
      <div v-for="n in 50"
           :key="n"> {{ n }} / 50</div>
    </q-drawer>
    <!-- 右边弹出框 -->
    <q-drawer side="right"
              v-model="dialog_right"
              :width="322"
              elevated
              class="bg-white-10 q-pa-sm scroll hide-scrollbar text-black">
      <div v-for="n in 50"
           :key="n"> {{ n }} / 50</div>
    </q-drawer>
    <!-- 页面 -->
    <q-page-container class="bg-dark window-width window-height">
      <router-view />
    </q-page-container>

    <!-- 悬浮按钮 -->
    <div class="h-100 w-100 fixed-bottom-right"
         style="z-index: 10;">
      <!-- <div class="h-inherit w-inherit relative-position">

      </div> -->
      <div class="h-inherit w-inherit row items-center justify-center">
        <q-icon name="chat"
                color="warning"
                @click="userStore.actions_server_dialog_boolean"
                size="40px" />
      </div>

      <transition-group appear
                        enter-active-class="animated bounceInRight"
                        leave-active-class="animated bounceOutRight">
        <div class="h-520 w-320 bg-red fixed"
             v-if="userStore.server_dialog_boolean"
             style="bottom: 90px; right: 0;">
        </div>
      </transition-group>
    </div>

    <!-- 登录dialog -->
    <q-dialog v-model="userStore.login_dialog_boolean"
              full-width>
      <login-component></login-component>
    </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import LoginComponent from 'components/LoginComponent.vue';
import { userStore } from 'stores/user.js';

export default defineComponent({
  name: 'MainLayout',
  components: { LoginComponent },
  props: [''],
  data () {
    return {
      userStore: null,
      tab: 'Gaming',
      dialog_left: false,
      dialog_right: false,
    };
  },
  watch: {},
  created () {
    this.userStore = userStore()
  },
  beforeMount () { },
  mounted () { },
  methods: {
    dialog_left_switch () {
      this.dialog_left = !this.dialog_left;
    },
    dialog_right_switch () {
      this.dialog_right = !this.dialog_right;
    },
  },
  computed: {}
})
</script>

<style lang='scss'>
.App {
  line-height: normal;
}
</style>
