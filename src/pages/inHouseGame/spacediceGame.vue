<template>
  <div class='spacediceGame q-px-md'>
    <!-- 展示区 -->
    <div class="h-fit full-width bg-deep-purple column rounded-borders">
      <div class="h-100 full-width"></div>
      <div class="w-fit h-160 bg-black column rounded-12 overflow-hidden"
           style="margin:auto;">
        <div class="h-120 row bg-light-blue-3">
          <div class="col">
            <div></div>
          </div>
          <div class="w-240 row items-center justify-center">
            <div class="h-100 w-220 bg-light-blue-8 rounded-12 text-center line-100"
                 style="font-size: 80px">
              {{ betNumber }}
            </div>
          </div>
          <div class="col">
            <div></div>
          </div>
        </div>
        <div class="h-40 q-px-sm row items-center justify-center">
          <div class="row full-width h-22 line-24 text-center fz-12">
            <div class="w-76 row bg-light-blue-3 rounded-borders overflow-hidden">
              <div class="w-38 h-22 rounded-borders text-primary text-bold cursor-pointer"
                   :class="[is_in?'bg-blue text-white':'']"
                   @click="changeInStatus('in')">IN</div>
              <div class="w-38 h-22 rounded-borders text-primary text-bold cursor-pointer"
                   :class="[!is_in?'bg-blue text-white':'']"
                   @click="changeInStatus('out')">OUT</div>
            </div>
            <div style="border: 1px solid #436690;height: 22px;margin: 0 11px;"></div>
            <div class="bg-light-blue-3 w-45 h-22 rounded-borders text-primary text-bold q-mr-sm cursor-pointer"
                 @click="changeRang('min')">MIN</div>
            <div class="bg-light-blue-3 w-45 h-22 rounded-borders text-primary text-bold q-mr-sm cursor-pointer"
                 @click="changeRang('toMin')">-5%</div>
            <div class="bg-light-blue-3 w-100 h-22 rounded-borders text-primary text-bold q-mr-sm cursor-pointer"
                 @click="changeRang('auto')">AUTO PICK</div>
            <div class="bg-light-blue-3 w-45 h-22 rounded-borders text-primary text-bold q-mr-sm cursor-pointer"
                 @click="changeRang('toMax')">+5%</div>
            <div class="bg-light-blue-3 w-45 h-22 rounded-borders text-primary text-bold cursor-pointer"
                 @click="changeRang('max')">MAX</div>
          </div>
        </div>
      </div>
      <div class="col column">
        <div class="h-50">

        </div>
        <div class="h-40 row items-center justify-center">
          <div class="w-680">
            <q-range v-model="labelRange"
                     v-if="is_labelRange"
                     key="labelRange"
                     :min="0"
                     :max="9999"
                     :step="1"
                     label-always
                     switch-label-side
                     drag-range
                     thumb-color="purple"
                     thumb-size="24px"
                     :track-color="!is_in?'green': 'red'"
                     track-size="12px"
                     @pan="qRangePan"
                     :color="is_in?'green': 'red'" />
          </div>
        </div>
        <div class="h-40 line-60 row items-center justify-center">
          <div class="w-680 row">
            <div class="w-170">
              0
            </div>
            <div class="w-340 row">
              <div class="relative-position"
                   style="left:-12px;">2500</div>
              <div class="col text-center">5000</div>
              <div class="relative-position"
                   style="right:-12px;">7500</div>
            </div>
            <div class="w-170 text-right">
              9999
            </div>
          </div>
        </div>
        <div class="h-60 line-60 text-center row items-center justify-center">
          <div class="w-fit"
               style="display: grid;grid-gap: 12px; grid-template-columns: repeat(3, 1fr);">
            <div class="w-200 h-60">
              Multiplier:x1.0423
            </div>
            <div class="w-200 h-60">
              Profit on win:USDT 1.04230000
            </div>
            <div class="w-200 h-60">
              Chance to win:95.00%
            </div>
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
// import vue from 'vue';
import { defineComponent } from 'vue';
import { wsStore } from 'stores/ws.js';

export default defineComponent({
  name: 'spacediceGame',
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
      betNumber: 5000,
      is_in: true,
      labelRange: {
        min: 2500,
        max: 7499,
      },
      is_labelRange: true,
      randomNumInterval: null,
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
    this.SOCKET.on('games.spacedice.bet', (res) => {
      console.log(res)
      setTimeout(() => {
        clearInterval(this.randomNumInterval);
        this.betNumber = String(res.roll_number).padStart(4, 0);
        this.is_submit = true;
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
    changeInStatus (status) {
      if (status == 'in') {
        this.is_in = true
        if (this.labelRange.max - this.labelRange.min > 9499) { this.labelRange.max = this.labelRange.min + 9499; }
      }
      if (status == 'out') {
        this.is_in = false;
        if (this.labelRange.max - this.labelRange.min < 500) { this.labelRange.max = this.labelRange.min + 500; }
      }
    },
    changeRang (key) {
      let a, b, medium;
      if (!!this.is_in) {
        switch (key) {
          case 'min':
            medium = Math.ceil((this.labelRange.min + this.labelRange.max) / 2);
            this.labelRange = {
              min: medium,
              max: medium,
            }
            break;
          case 'max':
            this.labelRange = {
              min: 100,
              max: 9599
            }
            break;
          case 'toMin':
            a = this.labelRange.min + 250;
            b = this.labelRange.max - 250;
            if (a >= b) {
              this.changeRang('min');
            } else {
              this.labelRange = { min: a, max: b, }
            }
            break;
          case 'toMax':
            a = this.labelRange.min - 250 < 0 ? 0 : this.labelRange.min - 250;
            b = this.labelRange.max + 250 > 9999 ? 9999 : this.labelRange.max + 250;
            if (b - a > 9499) {
              this.changeRang('max');
            } else {
              this.labelRange = { min: a, max: b, }
            }
            break;
          case 'auto':
            a = Math.floor(Math.random() * 10000);
            b = Math.floor(Math.random() * 10000);
            if (a > b) { [a, b] = [b, a] }
            if (b - a > 9499) { b = a + 9499; }
            this.labelRange = { min: a, max: b, }
            break;

          default:
            break;
        }
      } else {
        switch (key) {
          case 'min':
            this.labelRange = {
              min: 0,
              max: 9998
            }
            break;
          case 'max':
            medium = Math.ceil((this.labelRange.min + this.labelRange.max) / 2);
            this.labelRange = {
              min: medium - 250,
              max: medium + 250,
            }
            break;
          case 'toMin':
            a = this.labelRange.min - 250 < 0 ? 0 : this.labelRange.min - 250;
            b = this.labelRange.max + 250 > 9999 ? 9999 : this.labelRange.max + 250;
            if (b - a > 9998) {
              this.changeRang('min');
            } else {
              this.labelRange = { min: a, max: b, }
            }
            break;
          case 'toMax':
            a = this.labelRange.min + 250;
            b = this.labelRange.max - 250;
            if (b - a < 500) {
              this.changeRang('max');
            } else {
              this.labelRange = { min: a, max: b, }
            }
            break;
          case 'auto':
            a = Math.floor(Math.random() * 10000);
            b = Math.floor(Math.random() * 10000);
            if (a > b) { [a, b] = [b, a] }
            if (b - a < 500) { b = a + 500; }
            this.labelRange = { min: a, max: b, }
            break;

          default:
            break;
        }
      }
    },
    qRangePan (str) {
      // console.log(str)
      if (str == 'end') {
        if (!!this.is_in) {
          if (this.labelRange.max - this.labelRange.min > 9499) {
            this.is_labelRange = false
            let min = this.labelRange.min;
            let max = min + 9499;
            console.log(min)
            console.log(max)
            setTimeout(() => {
              this.labelRange = {
                min, max
              }
              this.is_labelRange = true
            }, 200)
          }
        } else {
          if (this.labelRange.max - this.labelRange.min < 500) {
            this.is_labelRange = false
            let min = this.labelRange.min;
            let max = min + 500;
            setTimeout(() => {
              this.labelRange = {
                min, max
              }
              this.is_labelRange = true
            }, 200)
          }
        }
      }
    },
    betSubmit (bool = false) {
      if (!bool) {
        if (this.isFast) this.startFast = !this.startFast; // 自动开始
      }

      if (!this.is_submit) return;
      let predictionRange = [this.labelRange.min, this.labelRange.max]
      let params = {
        amount: this.betAmount.toFixed(8),
        frontID: new Date().getTime(),
        isFast: this.isFast,
        isIn: this.is_in,
        predictionRange,
      }
      // console.log(params)
      this.SOCKET.emit('games.spacedice.bet', params);
      this.is_submit = false;
      // 运动相关
      this.randomNumInterval = setInterval(() => {
        this.betNumber = String(Math.floor((Math.random() * 10000))).padStart(4, 0);
      }, 70)
    },
  },
  computed: {},
  unmounted () {
    this.SOCKET.off('games.spacedice.bet')
  }
})
</script>
<style lang='scss' scoped>
.spacediceGame {
  line-height: normal;
}
</style>