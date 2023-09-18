<template>
  <div class='tripleGame q-px-md'>
    <!-- 展示区 -->
    <div class="full-width bg-black row rounded-borders q-py-md">
      <div class="col column items-center">
        <div v-for="(v, k) in result_left[riskModel]"
             class="w-92 h-66 q-mb-md rounded-borders text-center row items-center justify-center"
             style="border: 2px solid #283753;"
             :key="k">
          <div>
            <div class="row h-24">
              <template v-for="(_v, _k) in v.str.split('')"
                        :key="_k">
                <q-img :src="getImageUrl(_v)"
                       class="w-20 h-20 q-mx-xs"></q-img>
              </template>
            </div>
            <div class="h-12 line-20">{{ v.odd }}</div>
          </div>
        </div>
      </div>
      <div class="">
        <div class=""
             style="display: grid;grid-gap: 12px; grid-template-columns: repeat(6, 1fr);">
          <div class="w-56 h-56 rounded-borders row items-center justify-center"
               v-for="(v, k) in tableArray"
               @click="changeSelectStatusFun(k)"
               :class="[v.status == 'selected' ? 'bg-primary selected_border' :'bg-grey-4']"
               :key="k">
            <q-img :src="getImageUrl(randomSeed[k])"
                   class="w-40 h-40"></q-img>
          </div>
        </div>
      </div>
      <div class="col column items-center">
        <div v-for="(v, k) in result_right[riskModel]"
             class="w-92 h-66 q-mb-md rounded-borders text-center row items-center justify-center"
             style="border: 2px solid #283753;"
             :key="k">
          <div>
            <div class="row h-24">
              <template v-for="(_v, _k) in v.str.split('')"
                        :key="_k">
                <q-img :src="getImageUrl(_v)"
                       class="w-20 h-20 q-mx-xs"></q-img>
              </template>
            </div>
            <div class="h-12 line-20">{{ v.odd }}</div>
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
               :class="[is_submit && pickSet.length >= 3 ? '' : 'disabled']"
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
    <!-- 选项 -->
    <div class="q-mt-md">
      <div class="full-width row overflow-hidden items-center justify-center text-center">
        <div class="col q-pr-md column">
          <div class="rounded-borders overflow-hidden">
            <q-select color="primary"
                      bg-color="primary"
                      filled
                      dense
                      :disable="(!startFast && is_submit)? false: true"
                      v-model="riskModel"
                      :options="riskOptions">
              <template v-slot:selected>
                <span class="text-white">RISk: &nbsp;</span>
                <span class="text-white">{{ riskModel }}</span>
              </template>
            </q-select>
          </div>
        </div>
        <div class="col q-pl-md column">
          <div class="row full-height overflow-hidden">
            <div class="col h-40 q-pr-md relative-position">
              <q-btn class="full-height full-width"
                     @click="autoPickFun"
                     :disable="(!startFast && is_submit)? false: true"
                     color="primary">Auto Pick</q-btn>
            </div>
            <div class="col h-40 q-pl-md relative-position">
              <q-btn class="full-height full-width"
                     @click="clearTableFun"
                     :disable="(!startFast && is_submit)? false: true"
                     color="blue-grey-4">Clear Table</q-btn>
            </div>
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
  name: 'tripleGame',
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
      tableArray: [
        { status: '', val: 1 },
        { status: '', val: 2 },
        { status: '', val: 3 },
        { status: '', val: 4 },
        { status: '', val: 5 },
        { status: '', val: 6 },
        { status: '', val: 7 },
        { status: '', val: 8 },
        { status: '', val: 9 },
        { status: '', val: 10 },
        { status: '', val: 11 },
        { status: '', val: 12 },
        { status: '', val: 13 },
        { status: '', val: 14 },
        { status: '', val: 15 },
        { status: '', val: 16 },
        { status: '', val: 17 },
        { status: '', val: 18 },
        { status: '', val: 19 },
        { status: '', val: 20 },
        { status: '', val: 21 },
        { status: '', val: 22 },
        { status: '', val: 23 },
        { status: '', val: 24 },
        { status: '', val: 25 },
        { status: '', val: 26 },
        { status: '', val: 27 },
        { status: '', val: 28 },
        { status: '', val: 29 },
        { status: '', val: 30 },
        { status: '', val: 31 },
        { status: '', val: 32 },
        { status: '', val: 33 },
        { status: '', val: 34 },
        { status: '', val: 35 },
        { status: '', val: 36 },
      ],
      result_left: {
        'Low': [
          { str: '000', odd: '0.50' },
          { str: '001', odd: '0.80' },
          { str: '002', odd: '1.20' },
          { str: '012', odd: '1.50' },
          { str: '011', odd: '2.40' },
        ],
        'Medium': [
          { str: '000', odd: '0.00' },
          { str: '001', odd: '0.50' },
          { str: '002', odd: '1.50' },
          { str: '012', odd: '2.40' },
          { str: '011', odd: '3.30' },
        ],
        'High': [
          { str: '000', odd: '0.00' },
          { str: '001', odd: '0.00' },
          { str: '002', odd: '0.50' },
          { str: '012', odd: '3.00' },
          { str: '011', odd: '4.20' },
        ],
      },
      result_right: {
        'Low': [
          { str: '000', odd: '3.48' },
          { str: '001', odd: '5.03' },
          { str: '002', odd: '7.00' },
          { str: '012', odd: '15.00' },
          { str: '011', odd: '40.00' },
        ],
        'Medium': [
          { str: '022', odd: '7.00' },
          { str: '112', odd: '10.00' },
          { str: '111', odd: '14.35' },
          { str: '122', odd: '30.60' },
          { str: '222', odd: '80.00' },
        ],
        'High': [
          { str: '000', odd: '10.24' },
          { str: '001', odd: '15.00' },
          { str: '002', odd: '30.00' },
          { str: '012', odd: '60.00' },
          { str: '011', odd: '200.00' },
        ],
      },
      pickSet: [],
      randomSeed: [],
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
    this.SOCKET.on('games.triple.bet', (res) => {
      setTimeout(() => {
        this.randomSeed = res.randomSeed;
        this.is_submit = true;
      }, 500)
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

      if (!this.is_submit || this.pickSet.length < 3) return;
      // console.log(this.pickSet)
      this.randomSeed = [];
      let params = {
        amount: this.betAmount.toFixed(8),
        frontID: new Date().getTime(),
        isFast: this.isFast,
        risk: this.riskModel,
        selected: this.pickSet
      }
      console.log(params)
      this.SOCKET.emit('games.triple.bet', params);
      this.is_submit = false;
    },
    autoPickFun () {
      this.clearTableFun();
      // 3 次
      let arr = [];
      for (let i = 0; i < 3; i++) {
        let random = Math.floor(Math.random() * 36);
        while (arr.includes(random)) {
          random = Math.floor(Math.random() * 36);
        }

        this.tableArray[random].status = 'selected';
        arr.push(random);
      }
      this.pickSet = arr;
    },
    clearTableFun () {
      this.tableArray.forEach((el) => { el.status = '' });
      this.pickSet = [];
      this.randomSeed = [];
    },
    changeSelectStatusFun (k) {
      let status = this.tableArray[k].status;
      if (status) {
        this.tableArray[k].status = '';
        this.pickSet.splice(this.pickSet.indexOf(k), 1);
      } else {
        if (this.pickSet.length >= 3) return;
        this.tableArray[k].status = 'selected';
        this.pickSet.push(k)
      }
    },
    getImageUrl (name) { return new URL(`../../assets/imgs/triple/${name}.png`, import.meta.url).href; }
  },
  computed: {},
  unmounted () {
    this.SOCKET.off('games.triple.bet')
  }
})
</script>
<style lang='scss' scoped>
.tripleGame {
  line-height: normal;
  .selected_border {
    border: 1px solid $primary;
  }
}
</style>