<template>
  <div class='minesGame row'>
    <!-- 投注选项区域 -->
    <div class="w-240 h-600 bg-blue-grey-10 overflow-hidden rounded-borders relative-position">
      <div class="h-46 full-width bg-black row line-46 text-center fz-12">
        <q-btn class="col"
               :class="[isFast? '': 'tabs__btn_selected']"
               @click="isFast = false">MANUAL</q-btn>
        <q-btn class="col"
               :disable="is_Auto_Pick ? true: false"
               :class="[isFast? 'tabs__btn_selected': '']"
               @click="isFast = true">AUTO</q-btn>
      </div>
      <div class="bg-blue-grey-10 q-pa-sm">
        <!--  -->
        <div class="h-60 full-width bg-black row rounded-borders overflow-hidden">
          <div class="w-40">

          </div>
          <div class="col column">
            <div class="col line-30 row text-grey">
              <div class="col">Amount</div>
              <div class="q-pr-sm">{{ betAmount.toFixed(2) || 0.00 }}</div>
            </div>
            <div class="col line-30">{{ betAmount.toFixed(8) }}</div>
          </div>
        </div>
        <!--  -->
        <div class="q-mt-sm full-width text-center"
             style="display: grid;grid-gap: 6px; grid-template-columns: repeat(4, 1fr);">
          <div class="full-width h-24 line-24 bg-blue-grey-14 fz-12 rounded-borders cursor-pointer"
               :class="[(!startFast && is_submit) ? '' : 'disabled']"
               @click="changeBetAmount('min')">
            Min
          </div>
          <div class="full-width h-24 line-24 bg-blue-grey-14 fz-12 rounded-borders cursor-pointer"
               :class="[(!startFast && is_submit) ? '' : 'disabled']"
               @click="changeBetAmount('half')">
            1/2
          </div>
          <div class="full-width h-24 line-24 bg-blue-grey-14 fz-12 rounded-borders cursor-pointer"
               :class="[(!startFast && is_submit) ? '' : 'disabled']"
               @click="changeBetAmount('double')">
            2x
          </div>
          <div class="full-width h-24 line-24 bg-blue-grey-14 fz-12 rounded-borders cursor-pointer"
               :class="[(!startFast && is_submit) ? '' : 'disabled']"
               @click="changeBetAmount('max')">
            Max
          </div>
        </div>
        <!-- 炸弹数量 -->
        <div>
          <div class="h-36 line-48 fz-12">Mines Amount</div>
          <div class="h-48 bg-black rounded-borders row">
            <div class="w-40 text-center line-48">{{ sliderNum }}</div>
            <div class="col q-px-md items-center justify-center row">
              <q-slider v-model="sliderNum"
                        inner-track-color="blue-grey-14"
                        @update:model-value="sliderChange"
                        :disable="(!startFast && is_submit)? false: true"
                        :min="1"
                        :max="24" />
            </div>
          </div>
        </div>
        <!--  -->
        <div class="h-48 full-width q-mt-md">
          <q-btn class="full-width h-48"
                 :disable="(!is_Auto_Pick || auto_pick_arr.length >= ( 25-sliderNum ) )? true: false"
                 @click="autoPickSubmit('')"
                 color="primary">
            Auto Pick
          </q-btn>
        </div>
        <div class="h-48 full-width q-mt-md">
          <q-btn v-if="!is_Auto_Pick"
                 class="full-width h-48 bg-red-10"
                 @click="betSubmit(false)">
            BET
          </q-btn>
          <q-btn v-else
                 :disable="auto_pick_arr.length == 0? true : false"
                 class="full-width h-48 bg-red-10"
                 @click="cashOutSubmit">
            <div>
              <div class="line-16">
                CASH OUT
              </div>
              <div class="line-14 fz-12">
                {{ winAmount.toFixed(8) }} USDT
              </div>
            </div>
          </q-btn>
        </div>
      </div>
    </div>
    <!-- 展示区域 -->
    <div class="col h-600">
      <div class="w-500 h-600 bg-blue rounded-borders column"
           style="margin:auto">
        <div class="h-80 row">
          <div class="col row items-center justify-center">
            <div>
              <q-img src="~/assets/webp/label-diamond.png"
                     fit="cover"
                     class="w-50 h-40" />
              &nbsp;
              <span class="fz-20 text-bold">{{ 25-sliderNum <10 ? `0${ 25-sliderNum}` :  25-sliderNum}}</span>
            </div>
          </div>
          <div class="col row items-center justify-center">
            <div>
              <span class="fz-20 text-bold">{{ sliderNum < 10 ?`0${sliderNum}` : sliderNum}}</span>
              &nbsp;
              <q-img src="~/assets/webp/label-bomb.png"
                     fit="cover"
                     class="w-50 h-40" />
            </div>
          </div>
        </div>
        <div class="row items-center justify-center">
          <div class="q-pa-sm rounded-12"
               style="border: 4px solid white">
            <div style="display: grid;grid-gap: 6px; grid-template-columns: repeat(5, 1fr);">
              <div v-for="(v, k) in tableArray"
                   @click="changeStatus(v.val)"
                   class="w-64 h-64 relative-position line-64 text-center text-black cursor-pointer rounded-borders bg-grey-4"
                   :key="k">
                <div v-if="!v.status">
                  {{ v.val }}
                </div>
                <div v-else-if="v.status == 'diamond'">
                  <q-img src="~/assets/webp/label-diamond.png"
                         fit="cover"
                         class="w-50 h-40" />
                </div>
                <div v-else-if="v.status == 'bomb'">
                  <q-img src="~/assets/webp/label-bomb.png"
                         fit="cover"
                         class="w-50 h-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col relative-position">
          <div class="w-420 full-height row items-center justify-center"
               style="margin: 0 auto;">
            <div class="col row h-50 bg-blue">
              <div class="w-30 text-center line-50"
                   @click="oddItemsMove('left')">
                <q-icon class="fz-30 cursor-pointer"
                        name="chevron_left" />
              </div>
              <div class="w-360 h-50 bg-blue-8 scroll-x no-scroll scroll rounded-borders"
                   ref="oddItemsMove"
                   style="white-space: nowrap;">
                <div class="w-360 h-50  inline-block"
                     v-for="(_v, _k) in Math.ceil(oddItems.length / 6)"
                     :key="_k">
                  <div class="h-50 w-60 inline-block"
                       v-for="(v, k) in oddItems.slice( 0 + _k * 6,  6 + _k * 6 )"
                       :class="[(6 +_k * 6) >oddItems.length ? oddItems.length % 6 == 1? 'w-360':oddItems.length % 6 == 2?'w-180':oddItems.length % 6 == 3? 'w-120': oddItems.length % 6 == 4? 'w-90' :oddItems.length % 6 == 5? 'w-72' :'w-60' :'w-60']"
                       :key="k">
                    <div class="column items-center justify-center"
                         :class="[ k + 1  + _k * 6 <= auto_pick_arr.length? 'bg-red-10': '']">
                      <div class="h-24 line-24 w-30 text-center"
                           style="border-bottom: 1px solid white">
                        {{ k + 1  + _k * 6}}
                      </div>
                      <div class="h-26 line-26 fz-10">
                        {{ (0.99/ v).toFixed(2).length >= 8 ? Math.trunc((0.99/ v).toFixed(2)) : (0.99/ v).toFixed(2)}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-30 text-center line-50"
                   @click="oddItemsMove('right')">
                <q-icon class="fz-30 cursor-pointer"
                        name="chevron_right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 对话框 -->
    <q-dialog v-model="gameOver"
              persistent>
      <div class="h-200 w-360 bg-white user-none relative-position">
        <div class="absolute w-40 h-40 line-40"
             style="top: 0; right: 0;">
          <q-btn icon="close"
                 flat
                 round
                 dense
                 v-close-popup />
        </div>
        <div class="fz-36 line-200 text-center full-height full-width"
             v-if="winAmount == 0">
          游戏结束
        </div>
        <div v-else
             class="fz-36 line-200 text-center full-height full-width">
          恭喜中奖
        </div>
      </div>
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { wsStore } from 'stores/ws.js';

export default defineComponent({
  name: 'minesGame',
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
      sliderNum: 4,
      oddBase: 0.99,
      oddItems: [],
      oddItemsMoveIndex: 0,
      is_Auto_Pick: false,
      auto_pick_arr: [],
      winAmount: 1,
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
      ],
      gameOver: false,
    };
  },
  watch: {
    auto_pick_arr: {
      handler (n) {
        this.$refs.oddItemsMove.scrollTo(360 * (Math.floor((n.length - 1) / 6)), 0);
      },
      deep: true
    }
  },
  created () {
    this.wsStore = wsStore();
  },
  beforeMount () { },
  mounted () {
    this.SOCKET = this.wsStore.getters_socket;
    // 处理相关ws返回
    this.SOCKET.on('games.mines.bet', (res) => {
      console.log(res)
      this.winAmount = res.winAmount;
      if (res.fields) {
        this.is_Auto_Pick = false;
        this.is_submit = true;
        this.auto_pick_arr = [];
        if (!res.winAmount) { this.winAmount = 0 }

        this.tableArray.forEach((el) => { el.status = 'diamond' });
        res.fields.forEach((el) => {
          this.tableArray[el - 1].status = 'bomb';
        })

        this.gameOver = true;
      } else {
        let pick_num = this.auto_pick_arr[this.auto_pick_arr.length - 1]
        if (pick_num) {
          this.tableArray[pick_num - 1].status = 'diamond';
        }
      }
    })
    // 初始化
    this.updateOddItems(this.sliderNum);
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
    sliderChange (val) {
      this.updateOddItems(val);
      this.$refs.oddItemsMove.scrollTo(0, 0);
    },
    updateOddItems (val) {
      this.oddItems = this.probabilityFun(25 - val);
    },
    probabilityFun (x) {
      let arr = [];
      for (let i = 0; i < x; i++) {
        let n = (x - i) / (25 - i);
        n *= arr[i - 1] || 1;
        arr.push(n);
      }
      return arr;
    },
    changeStatus (val) {
      if (this.auto_pick_arr.length >= (25 - this.sliderNum)) return;
      if (!this.is_Auto_Pick || this.auto_pick_arr.includes(val)) return
      this.autoPickSubmit(val)
    },
    oddItemsMove (origin) {
      if (origin == 'right') {
        this.oddItemsMoveIndex += 1;
        if (this.oddItemsMoveIndex > Math.ceil(this.oddItems.length / 6) - 1) { this.oddItemsMoveIndex = Math.ceil(this.oddItems.length / 6) - 1 };
      } else {
        this.oddItemsMoveIndex -= 1;
        if (this.oddItemsMoveIndex < 0) this.oddItemsMoveIndex = 0;
      }
      this.$refs.oddItemsMove.scrollTo(360 * this.oddItemsMoveIndex, 0);
    },
    betSubmit (bool = false) {
      if (!bool) {
        if (this.isFast) this.startFast = !this.startFast; // 自动开始
      }

      if (!this.is_submit) return;
      let params = {
        amount: this.betAmount.toFixed(8),
        count: this.sliderNum,
        frontID: new Date().getTime(),
        isFast: this.isFast,
        prediction: [],
        type: 0
      }

      // console.log(params);
      this.SOCKET.emit('games.mines.bet', params);
      this.is_submit = false;
      this.is_Auto_Pick = true;
      this.winAmount = 1;
      this.tableArray.forEach((el) => { el.status = '' });
    },
    autoPickSubmit (val) {
      if (!this.is_Auto_Pick || this.auto_pick_arr.includes(val)) return
      let prediction;
      if (val) {
        prediction = val;
        this.auto_pick_arr.push(val);
      } else {
        prediction = this.randomAutoPick();
      }
      let params = {
        amount: this.betAmount.toFixed(8),
        frontID: new Date().getTime(),
        isFast: this.isFast,
        prediction: prediction,
        type: 1
      }

      console.log(params);
      this.SOCKET.emit('games.mines.bet', params);
    },
    cashOutSubmit () {
      let params = {
        amount: this.betAmount.toFixed(8),
        frontID: new Date().getTime(),
        isFast: this.isFast,
        type: 2
      }

      this.SOCKET.emit('games.mines.bet', params);
    },
    randomAutoPick () {
      let roll_number = Math.floor(Math.random() * 25) + 1;
      while (this.auto_pick_arr.includes(roll_number)) {
        roll_number = Math.floor(Math.random() * 25) + 1;
      }
      this.auto_pick_arr.push(roll_number);
      return roll_number;
    }
  },
  computed: {},
  unmounted () {
    this.SOCKET.off('games.mines.bet')
  }
})
</script>
<style lang='scss' scoped>
.minesGame {
  line-height: normal;
  .tabs__btn_selected {
    border-image-slice: 1;
    border-image-source: linear-gradient(
      to left,
      transparent 0,
      red 50%,
      transparent 100%
    );
    border-style: solid;
    border-width: 2px;
    border-left: 0;
    border-right: 0;
    border-top: 0;
    color: $primary !important;
  }
}
</style>