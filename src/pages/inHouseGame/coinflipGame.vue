<template>
  <div class='coinflipGame q-px-md'>
    <!-- 展示区 -->
    <div class="full-width h-fit bg-blue-grey-10 rounded-12 overflow-hidden">
      <!-- 历史记录 -->
      <div class="h-52 full-width bg-blue-grey-14 overflow-hidden row">
        <div class="col relative-position">
          <div class="h-52 full-width scroll-x no-scroll scroll absolute"
               ref="randomNumRef">
            <div class="h-52 w-fit float-left"
                 style="white-space: nowrap;">
              <div v-for="(v,k) in randomNumHistory"
                   class="w-30 h-52 line-52 text-center rounded-borders q-mx-xs text-white fz-12 inline-block"
                   :key="k">
                <div class="h-30 w-30"
                     v-if="v.prediction == 1">
                  <q-img src="~/assets/webp/coin-head.webp"
                         spinner-color="bg-blue-grey-14" />
                </div>
                <div class="h-30 w-30"
                     v-else>
                  <q-img src="~/assets/webp/coin-tail.webp"
                         spinner-color="bg-blue-grey-14" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-fit row items-center justify-center">
          <div class="fz-12"> {{ toggleValue?toggleText[1]:toggleText[0] }}</div>
          <q-toggle v-model="toggleValue"
                    color="primary"
                    keep-color />
        </div>
      </div>
      <div class="relative-position full-width h-280">
        <div class="h-280 q-px-xl row items-center justify-center">
          <div class="h-100 full-width bg-blue-grey-14 row"
               style="border-radius: 50px;">
            <div class="col row items-center justify-center text-center">
              <div>
                <div class="line-30">SERIES</div>
                <div class="line-30">-</div>
              </div>
            </div>
            <div class="col row items-center justify-center text-center">
              <div>
                <div class="line-30">MULTIPLIER</div>
                <div class="line-30 fz-24">x {{ odds }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute w-140 h-140"
             style="border-radius: 70px; top:50%;left:50%;margin-left:-70px;margin-top:-70px">
          <div class="w-140 h-140 rotate-wrap relative-position"
               :class="[is_rotate? 'rotate': '']">
            <div class="coinHead w-140 h-140 absolute"
                 :class="[is_head? '' : 'coinHeadHide']"
                 style="transform: translateZ(1px);"></div>
            <div class="coinTail w-140 h-140"
                 :class="[is_rotate? 'coinTailShow': '']"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 投注选项区域 -->
    <div class="q-mt-md">
      <div class="full-width h-80 row overflow-hidden items-center justify-center text-center">
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
      </div>
      <div class="full-width h-80 row overflow-hidden items-center justify-center text-center q-mt-sm">
        <div class="col q-pr-sm"
             :class="[is_submit ? '' : 'disabled']"
             @click="betSubmit(false, 1)">
          <div class="h-76 full-width bg-primary rounded-12 row q-px-md">
            <div class="w-60 row items-center">
              <q-img src="~/assets/webp/coin-head.webp"
                     spinner-color="white" />
            </div>
            <div class="col row items-center justify-center">
              <div>
                <div class="fz-16 line-30">BET HEAD</div>
                <div class="fz-12 line-20">Profit: {{ (betAmount * odds).toFixed(8) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col q-pl-md"
             :class="[is_submit ? '' : 'disabled']"
             @click="betSubmit(false, 0)">
          <div class="h-76 full-width bg-primary rounded-12 row q-px-md">
            <div class="col row items-center justify-center">
              <div>
                <div class="fz-16 line-30">BET HEAD</div>
                <div class="fz-12 line-20">Profit: {{ (betAmount * odds).toFixed(8) }}</div>
              </div>
            </div>
            <div class="w-60 row items-center">
              <q-img src="~/assets/webp/coin-tail.webp"
                     spinner-color="white" />
            </div>
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
  name: 'coinflipGame',
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
      odds: 1.9804,
      // 是否旋转
      is_rotate: false,
      is_head: true,
      toggleValue: false,// Multiply
      toggleText: ['Instant', 'Multiply']
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
    this.SOCKET.on('games.coinflip.bet', (res) => {
      console.log(res);
      setTimeout(() => {
        this.is_rotate = false;
        this.is_submit = true;
        this.is_head = res.prediction == 1 ? true : false;
        this.randomNumHistory.unshift({ prediction: res.prediction, winAmount: res.winAmount });
      }, 1000)
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
    betSubmit (bool = false, status) {
      if (!bool) {
        if (this.isFast) this.startFast = !this.startFast; // 自动开始
      }

      if (!this.is_submit) return;
      let params = {
        amount: this.betAmount.toFixed(8),
        frontID: new Date().getTime(),
        isFast: this.isFast,
        prediction: status,
        type: 0
      }

      this.SOCKET.emit('games.coinflip.bet', params);
      this.is_submit = false;
      // 动画相关
      this.is_rotate = true;
    },
  },
  computed: {}
})
</script>
<style lang='scss' scoped>
.coinflipGame {
  line-height: normal;
  .rotate {
    transform-style: preserve-3d;
    animation: rotate 0.4s linear infinite;
  }
  .rotate-wrap .coinHead {
    background-image: url("assets/webp/coin-head.webp");
    background-size: cover;
  }
  .coinHeadHide {
    z-index: -1;
  }
  .rotate-wrap .coinTail {
    background-image: url("assets/webp/coin-tail.webp");
    background-size: cover;
  }
  .coinTailShow {
    transform: rotateX(180deg);
  }

  @keyframes rotate {
    0% {
      transform: rotateX(0deg);
    }
    100% {
      transform: rotateX(360deg);
    }
  }
}
</style>