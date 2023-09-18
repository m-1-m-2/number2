<template>
  <div class='ringGame  q-px-md relative-position'>
    <!-- 游戏展示区 -->
    <div class="h-fit full-width bg-blue-grey-10 rounded-borders relative-position">
      <div class="h-480 full-width row">
        <div class="w-480 relative-position">
          <div class="absolute w-160 h-40"
               style="top: 24px;left: 50%; margin-left:-80px; z-index:2">
            <q-img src="~assets/imgs/target.png"
                   class="h-40" />
          </div>
          <div class="full-height full-width row items-end justify-center">
            <q-img :src="getImageUrl(riskModel+segmentsModel)"
                   class="w-440 h-440"
                   :class="[is_submit && !once_bet? 'rotate': !is_submit ? 'rotateFast' : '',]"
                   :style="{'transform': `rotateZ(-${rotateNum}deg)`}"
                   alt="" />
          </div>
          <div class="w-200 h-200 absolute"
               style="top:50%;left:50%;margin-top:-80px;margin-left:-100px;">
            <q-img src="~assets/webp/ringText.webp"
                   class="w-200 h-200 scaleImg" />
          </div>
        </div>
        <div class="col">
          <div class="full-height full-width row items-end">
            <q-img src="~assets/imgs/char.png"
                   class="h-400" />
          </div>
        </div>
      </div>
    </div>
    <!-- 投注选项区域 -->
    <div class="q-mt-md">
      <div class="full-width h-80 row overflow-hidden items-center justify-center text-center">
        <div class="col q-pr-md">
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
        <div class="col q-pl-md"
             @click="betSubmit(false)">
          <div class="h-76 full-width bg-primary rounded-12 column items-center justify-center cursor-pointer"
               :class="[is_submit ? '' : 'disabled']"
               v-if="!isFast">
            <div class="fz-16 h-30 line-30">BET</div>
          </div>
          <div class="h-76 full-width bg-primary rounded-12 column items-center justify-center cursor-pointer"
               v-else>
            <div class="fz-16 h-30 line-30">{{ startFast ? 'STOP' : 'START'}}</div>
            <div class="fz-12">∞</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 玩家选择难度 -->
    <div class="q-mt-md">
      <div class="full-width row overflow-hidden items-center justify-center text-center">
        <div class="col q-pr-md column">
          <div class="h-30 line-30 fz-16 text-grey-4 text-left">RISK:</div>
          <div class="rounded-borders overflow-hidden">
            <q-select color="primary"
                      bg-color="primary"
                      filled
                      dense
                      :disable="(!startFast && is_submit)? false: true"
                      v-model="riskModel"
                      :options="riskOptions">
              <template v-slot:selected>
                <span class="text-white">{{ riskModel }}</span>
              </template>
            </q-select>
          </div>
        </div>
        <div class="col q-pl-md column">
          <div class="h-30 line-30 fz-16 text-grey-4 text-left">ROWS:</div>
          <div class="rounded-borders overflow-hidden">
            <q-select color="primary"
                      bg-color="primary"
                      filled
                      dense
                      :disable="(!startFast && is_submit)? false: true"
                      v-model="segmentsModel"
                      :options="segmentsOptions">
              <template v-slot:selected>
                <span class="text-white">{{ segmentsModel }}</span>
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </div>
    <!-- 自动 -->
    <div class="q-mt-xl row justify-center">
      <q-btn-group push>
        <q-btn :color="!isFast?'primary': 'grey-6'"
               push
               glossy
               class="w-120"
               @click="isFast = false"
               :disable="(!startFast && is_submit)? false: true"
               label="MANUAL" />
        <q-btn :color="isFast?'primary': 'grey-6'"
               push
               glossy
               class="w-120"
               @click="isFast = true"
               :disable="(!startFast && is_submit)? false: true"
               label="AUTO" />
      </q-btn-group>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { wsStore } from 'stores/ws.js';

export default defineComponent({
  name: 'ringGame',
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
      riskModel: 'Medium',
      riskOptions: ['Low', 'Medium', 'High', 'Extreme'],
      segmentsModel: 50,
      segmentsOptions: [10, 20, 30, 40, 50],
      once_bet: false,
      rotateNum: 0,
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
    this.SOCKET.on('games.ring.bet', (res) => {
      console.log(res)
      let { roll_number, winAmount } = res
      setTimeout(() => {
        this.is_submit = true;
        this.rotateNum = (360 / this.segmentsModel) * (roll_number + 1) - (360 / this.segmentsModel) / 2;
        // 自动开始
        setTimeout(() => {
          if (this.startFast) {
            this.betSubmit(true)
          }
        }, 500);
      }, 1000);
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
    betSubmit (bool = false) {
      if (!bool) {
        if (this.isFast) this.startFast = !this.startFast; // 自动开始
      }

      if (!this.is_submit) return;
      let params = {
        amount: this.betAmount.toFixed(8),
        frontID: new Date().getTime(),
        isFast: this.isFast,
        risk: this.riskModel,
        segments: this.segmentsModel,
      }

      this.SOCKET.emit('games.ring.bet', params);
      this.is_submit = false;
      // 更新状态;
      this.rotateNum = 0;
      this.once_bet = true;
    },
    getImageUrl (name) { return new URL(`../../assets/imgs/ringGame/${name}.png`, import.meta.url).href; }
  },
  computed: {

  },
  unmounted () {
    this.SOCKET.off('games.ring.bet')
  }
})
</script>
<style lang='scss' scoped>
.ringGame {
  line-height: normal;
  .rotate {
    animation: rotate 36s linear infinite;
  }
  .rotateFast {
    animation: rotate 0.9s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
  .scaleImg {
    animation: scaleImg 4s linear infinite;
  }

  @keyframes scaleImg {
    0% {
      transform: scale(2);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(2);
    }
  }
}
</style>