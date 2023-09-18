<template>
  <div class='inHouse user-none'>
    <q-page class="relative-position full-height full-width scroll hide-scrollbar">
      <!-- container -->
      <div class="container-home">
        <!-- 游戏区域 -->
        <div class="h-fit full-width row q-mt-lg">
          <div class="col">
            <router-view />
          </div>
          <div class="w-320 h-600 bg-blue-5 hideElement q-pa-md rounded-borders">
            <div>
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/coinflip"
                     label="coinflip" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/dice"
                     label="dice" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/limbo"
                     label="limbo" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/plinko"
                     label="plinko" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/ring"
                     label="ring" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/mines"
                     label="mines" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/cryptos"
                     label="cryptos" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/triple"
                     label="triple" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/furywild"
                     label="furywild" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/tower"
                     label="tower" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/hilo"
                     label="hilo" />
            </div>
            <div>
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/spacedice"
                     label="spacedice" />
              <q-btn color="accent"
                     class="w-88 q-ma-xs"
                     rounded
                     to="/inHouse/crash"
                     label="crash" />
            </div>
          </div>
        </div>
        <!-- 投注历史 -->
        <div class="q-mt-lg h-fit">
          <bet-history></bet-history>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import betHistory from 'components/betHistory.vue';
import io from "socket.io-client";
import { wsStore } from 'stores/ws.js';
import { userStore } from 'stores/user.js';

export default defineComponent({
  name: 'inHouse',
  components: { betHistory },
  props: [''],
  data () {
    return {
      wsStore: null,
      SOCKET: null,
      userStore: null,
    };
  },
  watch: {},
  created () {
    this.wsStore = wsStore();
    this.userStore = userStore();
    this.initSocket();
  },
  beforeMount () { },
  mounted () { },
  methods: {
    initSocket () {
      this.SOCKET = new io('http://localhost:3000', { timeout: 5000, transports: ['websocket'] });
      // console.log(this.socket);
      this.wsStore.actions_socket(this.SOCKET);
      this.SOCKET.on('userBalance', (msg) => {
        let { userBalance } = msg;
        this.userStore.actions_userBalance(userBalance);
      })
      this.SOCKET.emit('userBalance');
    },
  },
  computed: {}
})
</script>


<style lang='scss' scoped>
.inHouse {
  line-height: normal;
}
</style>