<template>
  <div class='plinkoGame q-px-md'>
    <!-- 历史开奖记录 -->
    <div class="h-34 full-width q-mb-md scroll-x no-scroll scroll"
         ref="randomNumRef">
      <div class="h-34 w-fit float-right"
           style="white-space: nowrap;">
        <div v-for="(v,k) in randomNumHistory"
             class="w-40 h-34 line-34 text-center rounded-borders q-mx-xs bg-grey-9 fz-16 text-bold inline-block"
             :class="[v.coef <= 1 ? 'text-green' : 'text-primary']"
             :key="k">
          {{ v.coef }}x
        </div>
      </div>
    </div>
    <!-- 游戏展示区 -->
    <div class="h-fit full-width bg-keep-orange">
      <div class="column items-center justify-center">
        <table class="text-center inline-block fz-12 text-black">
          <template v-for="(v, k) in rowsModel"
                    :key="k">
            <tr>
              <td v-for="(td_v, td_k) in v"
                  :id="`circle-${k}-${td_k}`"
                  :ref="`circle-${k}-${td_k}`"
                  class="inline-block h-24 w-24 rounded shadow-4 q-mx-xs inset-shadow inset-shadow-down text-primary"
                  style="background: white;"
                  :key="'td'+ td_k">
              </td>
            </tr>
          </template>
        </table>
        <div class="row q-mt-sm">
          <div v-for="(v, k) in odds[riskModel][rowsModel]"
               class="h-16 line-16 text-center w-24 q-mx-xs fz-8 rounded-borders"
               style="background: red"
               :ref="`odds-${k}`"
               :key="k">
            {{ v }}
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
                      v-model="rowsModel"
                      :options="rowsOptions">
              <template v-slot:selected>
                <span class="text-white">{{ rowsModel }}</span>
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
  name: 'plinkoGame',
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
      riskOptions: ['Low', 'Medium', 'High'],
      rowsModel: 16,
      rowsOptions: [8, 9, 10, 11, 12, 13, 14, 15, 16],
      odds: {
        'Low': {},
        'Medium': {
          8: [13.1, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13.1],
          9: [17.6, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 17.6],
          10: [22.5, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22.5],
          11: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
          12: [33.6, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 3, 11, 33.6],
          13: [44.1, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 44.1],
          14: [60.2, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 60.2],
          15: [90.2, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 90.2],
          16: [120.4, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 120.4],
        },
        'High': {},
      },
      exampleArr: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1]
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
    this.SOCKET.on('games.plinko.bet', (res) => {
      // console.log(res)
      this.plinko_render(res.roll_array);
      setTimeout(() => {
        let Element = this.$refs[`odds-${res.sum}`][0]
        Element.style.background = 'green';
        setTimeout(() => {
          Element.style.background = 'red';
        }, 500)
      }, 100 * (res.roll_array.length) * 1);
      setTimeout(() => {
        this.is_submit = true;
        this.randomNumHistory.push({ coef: res.coef });
        setTimeout(() => { this.backRight(); }, 200); // 延时
        // 自动开始
        setTimeout(() => {
          if (this.startFast) {
            this.betSubmit(true)
          }
        }, 500);
      }, 100 * (res.roll_array.length) * 1);
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
      let sectorObj = {
        'Low': 0,
        'Medium': 1,
        'High': 2
      }
      let params = {
        amount: this.betAmount.toFixed(8),
        frontID: new Date().getTime(),
        isFast: this.isFast,
        rows: this.rowsModel,
        sector: sectorObj[this.riskModel],
      }

      this.SOCKET.emit('games.plinko.bet', params);
      // this.is_submit = false;   // 是否连续点击
    },
    // 球体渲染
    plinko_render (exampleArr) {
      let render_num = 0;
      exampleArr.forEach((el, k) => {
        setTimeout(() => {
          let element = this.$refs[`circle-${k}-${render_num + el}`][0];
          element.style.background = 'red';
          setTimeout(() => {
            element.style.background = 'pink';
          }, 200)
          setTimeout(() => {
            element.style.background = 'white';
          }, 300)
          render_num = render_num + el;
        }, 100 * k)
      })
    },
    backRight () {
      let width = this.$refs.randomNumRef.scrollWidth;
      this.$refs.randomNumRef.scrollTo(width, 0);
    }
  },
  computed: {},
  unmounted () {
    this.SOCKET.off('games.plinko.bet')
  }
})
</script>
<style lang='scss' scoped>
.plinkoGame {
  line-height: normal;
  // .circle {
  //   transition: background-color 0.25s;
  //   transition: background 0.25s;
  // }
}
</style>