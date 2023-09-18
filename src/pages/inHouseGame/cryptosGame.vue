<template>
  <div class='cryptosGame q-px-md'>
    <!-- 展示区 -->
    <div class="h-500 full-width rounded-borders bg-blue-grey-10 q-pa-md column">
      <div class="h-300 row q-mt-sm">
        <div class="col q-px-md">
          <div v-for="(v,k) in cryptoData"
               :key="k"
               class="h-30 full-width rounded-borders q-my-sm row"
               :class="[openResultActive == k?'bg-blue':' bg-blue-grey-14']">
            <div class="col row h-30 items-center q-pl-sm">
              <div v-for="(_v,_k) in v.ball"
                   :key="_k"
                   class="w-20 h-20 q-mx-sm"
                   style="border-radius: 50%;"
                   :class="_v==2?'bg-red': _v==1?'bg-green': 'bg-white'"></div>
            </div>
            <div class="line-30 q-pr-md">{{ v.odd.toFixed(2) }}x</div>
          </div>
        </div>
        <div class="col"></div>
      </div>
      <div class="h-140 row">
        <div class="col row"
             v-if="!!openResult && openResult.length != 0">
          <div v-for="(v,k) in openResult"
               class="col row items-center justify-center"
               :key="k">
            <q-img :src="getImageUrl(v)"
                   class="h-100 w-100 "></q-img>
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
import { defineComponent } from 'vue'
import { wsStore } from 'stores/ws.js';

export default defineComponent({
  name: 'cryptosGame',
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
      cryptoData: [
        { ball: [2, 2, 2, 2, 2], odd: 60.00 },
        { ball: [2, 2, 2, 2, 0], odd: 7.00 },
        { ball: [2, 2, 2, 1, 1], odd: 6.00 },
        { ball: [2, 2, 2, 0, 0], odd: 3.75 },
        { ball: [2, 2, 1, 1, 0], odd: 2.40 },
        { ball: [2, 2, 0, 0, 0], odd: 0.10 },
        { ball: [0, 0, 0, 0, 0], odd: 0.00 },
      ],
      openResult: [],
      openResultActive: -1,
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
    this.SOCKET.on('games.cryptos.bet', (res) => {
      console.log(res)
      setTimeout(() => {
        this.is_submit = true;
        setTimeout(() => {
          this.openResult = res.roll_number;
          this.openResultActive = this.counterArray_result(res.roll_number);
          if (this.startFast) {
            this.betSubmit(true)
          }
        }, 500);
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
    betSubmit (bool = false) {
      if (!bool) {
        if (this.isFast) this.startFast = !this.startFast; // 自动开始
      }

      if (!this.is_submit) return;
      let params = {
        amount: this.betAmount.toFixed(8),
        frontID: new Date().getTime(),
        isFast: this.isFast,
      }
      console.log(params);
      this.SOCKET.emit('games.cryptos.bet', params);
      this.is_submit = false;
      //
      this.openResult = []
      this.openResultActive = -1;
    },
    getImageUrl (name) { return new URL(`../../assets/imgs/cryptos/${name}.svg`, import.meta.url).href; },
    counterArray_result (arr) {
      let obj = {}
      arr.forEach(function (v, k) {
        if (obj[v]) {
          obj[v]++;
        } else {
          obj[v] = 1;
        }
      })
      let array = Object.keys(obj);
      let length = array.length;
      let result = 6;  // 默认值；

      if (length == 1) {
        result = 0;
      } else if (length == 2) {
        if (array[0] == 4 || array[1] == 4) {
          result = 1;
        } else {
          result = 2;
        }
      } else if (length == 3) {
        if (array[0] == 3 || array[1] == 3 || array[2] == 3) {
          result = 3;
        } else {
          result = 4;
        }
      } else if (length == 4) {
        result = 5
      } else if (length == 5) {
        result = 6
      }

      return result;
    }
  },
  computed: {},
  unmounted () {
    this.SOCKET.off('games.cryptos.bet')
  }
})
</script>
<style lang='scss' scoped>
.cryptosGame {
  line-height: normal;
}
</style>