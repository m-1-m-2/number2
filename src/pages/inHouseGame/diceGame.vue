<template>
  <div class='diceGame q-px-md'>
    <!-- 历史开奖记录 -->
    <div class="h-34 full-width q-mb-md scroll-x no-scroll scroll"
         ref="randomNumRef">
      <div class="h-34 w-fit float-right"
           style="white-space: nowrap;">
        <div v-for="(v,k) in randomNumHistory"
             class="w-40 h-34 line-34 text-center rounded-borders q-mx-xs bg-grey-9 fz-16 text-bold inline-block"
             :class="[v.winAmount > 0 ? 'text-primary' : 'text-red-10']"
             :key="k">
          {{ v.roll_number < 10 ? `0${v.roll_number}` : v.roll_number }}
        </div>
      </div>
    </div>
    <!-- 展示区 -->
    <div>
      <!--  -->
      <div class="full-width h-150 rounded-12 row overflow-hidden bg-teal items-center justify-center text-center">
        <div class="col">
          <div class="fz-36 text-bold q-pb-md">{{ rangeNum < 10 ? `0${rangeNum}` : rangeNum }}</div>
          <div>PREDICTION</div>
        </div>
        <div class="w-120">

        </div>
        <div class="col h-150 row items-center justify-center rounded-12"
             :class="randomNumBg">
          <div>
            <div class="fz-36 text-bold q-pb-md">{{ randomNum < 10 ? `0${randomNum}` : randomNum }}</div>
            <div>LUCKY NUMBER</div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="full-width h-54 rounded-12 bg-black row overflow-hidden q-my-md items-center justify-center text-center">
        <div class="col">
          <q-btn :color="changeObj.mainColor"
                 rounded
                 @click="underFunc"
                 :disable="(!startFast && is_submit)? false: true"
                 label="ROLL UNDER" />
        </div>
        <div class="col column">
          <div class="col text-grey-8">Multiplier</div>
          <div class="col fz-20 text-bold">x {{ is_under ? (baseOdds / rangeNum).toFixed(4) : (baseOdds / ( 99 - rangeNum)).toFixed(4)}}</div>
        </div>
        <div class="col column">
          <div class="col text-grey-8">Chance to win</div>
          <div class="col fz-20 text-bold">{{ is_under ? rangeNum : 99 - rangeNum }} %</div>
        </div>
        <div class="col">
          <q-btn :color="changeObj.subColor"
                 rounded
                 @click="overFunc"
                 :disable="(!startFast && is_submit)? false: true"
                 label="ROLL OVER" />
        </div>
      </div>
      <!--  -->
      <div class="relative-position">
        <q-slider v-model="rangeNum"
                  :color="changeObj.mainColor"
                  thumb-color="white"
                  :label-color="changeObj.mainColor"
                  :track-color="changeObj.subColor"
                  :inner-track-color="changeObj.subColor"
                  switch-marker-labels-side
                  label-always
                  switch-label-side
                  :disable="(!startFast && is_submit)? false: true"
                  :min="1"
                  :max="98"
                  :inner-min="changeObj.innerMin"
                  :inner-max="changeObj.innerMax" />
        <div class="w-40 h-4 absolute rounded-borders"
             :class="changeObj.mainBg"
             v-show="changeObj.state == 'over'"
             style="top:12px"></div>
      </div>
    </div>
    <!-- 投注选项区域 -->
    <div class="q-mt-xl">
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
            <div class="fz-12">
              <span>PROFIT ON WIN:</span> <span> {{is_under ? (betAmount * (( baseOdds/rangeNum ) - 1 )).toFixed(8) : (betAmount * (( baseOdds/( 99 - rangeNum ) ) - 1 )).toFixed(8)}} USDT</span>
            </div>
          </div>
          <div class="h-76 full-width bg-primary rounded-12 column items-center justify-center cursor-pointer"
               v-else>
            <div class="fz-16 h-30 line-30">{{ startFast ? 'STOP' : 'START'}}</div>
            <div class="fz-12">∞</div>
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
import { defineComponent } from 'vue';
import { wsStore } from 'stores/ws.js';

export default defineComponent({
  name: 'diceGame',
  components: {},
  props: [''],
  data () {
    return {
      wsStore: null,
      SOCKET: null,
      betAmount: 1,
      is_under: true,
      is_submit: true,
      isFast: false,
      startFast: false,
      randomNum: 0,
      randomNumHistory: [],
      baseOdds: 99.0200,
      rangeNum: 50,
      randomNumInterval: null,
      changeObj: {
        state: 'under',
        mainBg: 'bg-primary',
        subBg: 'bg-red-10',
        mainColor: 'primary',
        subColor: 'red-10',
        innerMin: 1,
        innerMax: 95,
      },
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
    this.SOCKET.on('games.dice.bet', (res) => {
      console.log(res);
      setTimeout(() => {
        clearInterval(this.randomNumInterval);
        this.randomNum = res.roll_number;
        this.is_submit = true;
        this.randomNumHistory.push({ roll_number: res.roll_number, winAmount: res.winAmount });
        setTimeout(() => { this.backRight(); }, 200); // 延时
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
    underFunc () {
      this.is_under = true
      if (this.rangeNum > 95) { this.rangeNum = 95 }
      this.changeObj = {
        state: 'under',
        mainBg: 'bg-primary',
        subBg: 'bg-red-10',
        mainColor: 'primary',
        subColor: 'red-10',
        innerMin: 1,
        innerMax: 95
      }
    },
    overFunc () {
      this.is_under = false
      if (this.rangeNum < 4) { this.rangeNum = 4 }
      this.changeObj = {
        state: 'over',
        mainBg: 'bg-red-10',
        subBg: 'bg-primary',
        mainColor: 'red-10',
        subColor: 'primary',
        innerMin: 4,
        innerMax: 98
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
        is_under: this.is_under,
        prediction: this.rangeNum,
      }

      this.SOCKET.emit('games.dice.bet', params);
      this.is_submit = false;
      // 运动相关
      this.randomNumInterval = setInterval(() => {
        this.randomNum = Math.floor((Math.random() * 100));
      }, 70)
    },
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
    backRight () {
      let width = this.$refs.randomNumRef.scrollWidth;
      this.$refs.randomNumRef.scrollTo(width, 0);
    }
  },
  computed: {
    randomNumBg: {
      get () {
        let bg = ''
        if (this.is_under) {
          if (this.randomNum < this.rangeNum) {
            bg = 'bg-primary'
          } else {
            bg = 'bg-red-10'
          }
        } else {
          if (this.randomNum > this.rangeNum) {
            bg = 'bg-primary'
          } else {
            bg = 'bg-red-10'
          }
        }
        return bg
      },
    }
  },
  unmounted () {
    this.SOCKET.off('games.dice.bet') // 销毁事件
  }
})
</script>
<style lang='scss' scoped>
.diceGame {
  line-height: normal;
}
</style>