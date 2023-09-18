<template>
  <div class='towerGame q-px-md'>
    <!-- 展示区 -->
    <div class="h-500 full-width bgImg row q-pa-sm">
      <div class="col"></div>
      <div class="column">
        <div v-for="(v, k) in oddsSet"
             :key="k"
             class="row line-32 q-my-sm">
          <div class="w-70 h-32 q-mx-sm rounded-borders text-center line-32 fz-12"
               :class="[k >= oddsSetIndex? 'bg-green':'bg-purple']">
            x{{ (0.98/ v).toFixed(4).length >= 10 ? Math.trunc((0.98/ v).toFixed(4)) : (0.98/ v).toFixed(4)}}
          </div>
          <div class="w-60 h-32 bg-indigo q-mx-xs rounded-borders row items-center justify-center"
               :class="[k == oddsSetIndex? 'bg-green':'bg-indigo', k == oddsSetIndex ? 'cursor-pointer' : '']"
               v-for="(_v,_k) in 5"
               @click="betConfirm(k ,_k)"
               :key="_k">
            <img src="~assets/imgs/tower/hide-card.png"
                 class="" />
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
                      v-model="devilkinModel"
                      @update:model-value="devilkinModelInput"
                      :options="devilkinOptions">
              <template v-slot:selected>
                <span class="text-white">DEVILKIN: &nbsp;</span>
                <span class="text-white">{{ devilkinModel }}</span>
              </template>
            </q-select>
          </div>
        </div>
        <div class="col q-pl-md column">
          <div class="row full-height overflow-hidden">
            <div class="col h-40 q-pr-md relative-position">
              <q-btn class="full-height full-width"
                     @click="autoPickFun"
                     :disable="(!is_submit || isFast) ? false: true"
                     color="primary">Auto Pick</q-btn>
            </div>
            <div class="col h-40 q-pl-md relative-position">
              <q-btn class="full-height full-width"
                     @click="clearTableFun"
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
  name: 'towerGame',
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
      devilkinModel: 2,
      devilkinOptions: [1, 2, 3, 4],
      oddsSet: [],
      oddsSetIndex: 100,
    };
  },
  watch: {},
  created () {
    this.wsStore = wsStore();
    this.calcOdd();
  },
  beforeMount () { },
  mounted () {
    this.SOCKET = this.wsStore.getters_socket;
    // 处理相关ws返回
    this.SOCKET.on('games.tower.bet', (res) => {
      // console.log(res)
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
        type: 0,
        difficulty: this.devilkinModel,
      }

      // params
      this.SOCKET.emit('games.tower.bet', params);
      this.is_submit = false;
      this.oddsSetIndex = 9;
    },
    betConfirm (k, _k) {
      if (k != this.oddsSetIndex) return
      let params = {
        frontID: new Date().getTime(),
        isFast: this.isFast,
        type: 1,
        prediction: _k,
      }

      this.SOCKET.emit('games.tower.bet', params);
      this.oddsSetIndex = this.oddsSetIndex - 1;
    },
    devilkinModelInput () { this.calcOdd(); },
    autoPickFun () { },
    clearTableFun () { },
    calcOdd () {
      let arr = []
      for (let i = 10; i >= 1; i--) {
        arr.push(Math.pow((5 - this.devilkinModel) / 5, i * 1))
      }
      this.oddsSet = arr;
    }
  },
  computed: {},
  unmounted () {
    this.SOCKET.off('games.tower.bet')
  }
})
</script>
<style lang='scss' scoped>
.towerGame {
  line-height: normal;
  .bgImg {
    background-image: url("assets/imgs/tower/bg.jpg");
    background-size: cover;
  }
}
</style>