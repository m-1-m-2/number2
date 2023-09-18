<template>
  <div class='hiloGame q-px-md'>
    <!-- 展示区 -->
    <div class="h-300 full-width bg-blue-grey-10 rounded-borders row">
      <div class="col"></div>
      <div class="w-160 row items-center justify-center">
        <div>
          <div class="w-144 h-200 relative-position">
            <q-img src="~assets/imgs/hilo/card.svg"
                   class="full-height full-width"
                   alt="" />
          </div>
          <div class="row items-center justify-center">
            <div>
              <q-btn color="primary"
                     @click="skipMethod"
                     class="w-120">SKIP&nbsp;({{ SKIP_count }})</q-btn>
            </div>
          </div>
        </div>
      </div>
      <div class="col"></div>
    </div>
    <!-- 投注选项区域 -->
    <div class="q-mt-md">
      <div class="full-width h-fit row overflow-hidden items-center justify-center text-center">
        <div class="col q-pr-sm column">
          <div class="h-76 full-width bg-blue-grey-10 rounded-12 row q-pa-sm">
            <div class="column">
              <div class="col row items-center justify-center">
                <div class="w-40 h-24 line-24 bg-blue-grey-14 fz-12 rounded-borders cursor-pointer"
                     :class="[(!startFast && is_submit) ? '' : 'disabled']"
                     @click="changeBetAmount('min')">
                  Min
                </div>
              </div>
              <div class="col row items-center justify-center">
                <div class="w-40 h-24 line-24 bg-blue-grey-14 fz-12 rounded-borders cursor-pointer"
                     :class="[(!startFast && is_submit) ? '' : 'disabled']"
                     @click="changeBetAmount('max')">
                  Max
                </div>
              </div>
            </div>
            <div class="col column items-center justify-center">
              <div class="line-24 h-24">{{ betAmount.toFixed(8) }}</div>
              <div class="line-24 h-24">{{ betAmount.toFixed(8) }}</div>
            </div>
            <div class="column">
              <div class="col row items-center justify-center">
                <div class="w-40 h-24 line-24 bg-blue-grey-14 fz-12 rounded-borders cursor-pointer"
                     :class="[(!startFast && is_submit) ? '' : 'disabled']"
                     @click="changeBetAmount('half')">
                  1/2
                </div>
              </div>
              <div class="col row items-center justify-center">
                <div class="w-40 h-24 line-24 bg-blue-grey-14 fz-12 rounded-borders cursor-pointer"
                     :class="[(!startFast && is_submit) ? '' : 'disabled']"
                     @click="changeBetAmount('double')">
                  2x
                </div>
              </div>
            </div>
          </div>
          <div class="h-76 full-width bg-primary rounded-12 column items-center justify-center cursor-pointer q-mt-md"
               @click="betSubmit('bet')"
               v-if="!is_play"
               :class="[is_submit ? '' : 'disabled']">
            <div class="fz-16 h-30 line-30">BET</div>
          </div>
          <div class="h-76 full-width bg-primary rounded-12 column items-center justify-center cursor-pointer q-mt-md"
               v-else
               @click="cashOutSubmit">
            <div class="fz-16 h-32">
              <div class="line-20">
                CASH OUT
              </div>
              <div class="fz-12">
                {{ winAmount.toFixed(8) }} USDT
              </div>
            </div>
          </div>
        </div>
        <div class="col q-pl-sm column">
          <div class="h-76 full-width bg-red rounded-12 column items-center justify-center cursor-pointer"
               @click="betSubmit('high')"
               :class="[is_submit ? '' : 'disabled']">
            <div class="fz-16 h-30 line-30 text-uppercase">Higher or equal</div>
          </div>
          <div class="h-76 full-width bg-green rounded-12 column items-center justify-center cursor-pointer q-mt-md"
               @click="betSubmit('low')"
               :class="[is_submit ? '' : 'disabled']">
            <div class="fz-16 h-30 line-30 text-uppercase">Lower or equal</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { wsStore } from 'stores/ws.js';

export default defineComponent({
  name: 'hiloGame',
  components: {},
  props: [''],
  data () {
    return {
      wsStore: null,
      SOCKET: null,
      betAmount: 1,
      is_submit: true,
      isFast: false,
      startFast: false,
      randomNum: '',
      randomNumHistory: [],
      SKIP_count: 20,
      is_play: false,
      winAmount: 1,
    };
  },
  watch: {},
  created () {
    this.wsStore = wsStore();
  },
  beforeMount () { },
  mounted () {
    this.SOCKET = this.wsStore.getters_socket;
    // 处理相关ws返回
    this.SOCKET.on('games.hilo.bet', (res) => {
      console.log(res)
      this.randomNum = res.roll_number;
      this.randomNumHistory.push(res.roll_number)
    })
  },
  methods: {
    changeBetAmount (params) {
      if (!this.is_submit || this.startFast) return;
      switch (params) {
        case 'min':
          this.betAmount = 0.00000001;
          break;
        case 'max':
          this.betAmount = 100.0000000;
          break;
        case 'half':
          if (this.betAmount > 0.00000001) this.betAmount = this.betAmount / 2;
          break;
        case 'double':
          this.betAmount = this.betAmount * 2;
          break;

        default:
          break;
      }
    },
    betSubmit (str) {
      console.log(str);

      if (!this.is_submit) return;
      let params = {
        ac: 0,
        frontID: new Date().getTime(),
        type: 0,
        amount: this.betAmount.toFixed(8),
        currency: 'usdt',
        card: '',
      }

      this.SOCKET.emit('games.hilo.bet', params);
      // this.is_submit = false;
      this.is_play = true;
    },
    cashOutSubmit () {
      this.is_play = false;
    },
    skipMethod () {


      let params = {
        ac: 3,
        frontID: new Date().getTime(),
        type: 1,
      }

      // this.SOCKET.emit('games.hilo.bet', params);
    }
  },
  computed: {},
  unmounted () {
    this.SOCKET.off('games.hilo.bet')
  }
})
</script>
<style lang='scss' scoped>
.hiloGame {
  line-height: normal;
}
</style>