<template>
  <div class='limboGame q-px-md'>
    <!-- 展示区 -->
    <div class="full-width limboBg h-fit relative-position">
      <canvas id="space"
              class="absolute full-height full-width"
              style="top:0;left:0;">
      </canvas>
      <!-- 历史开奖记录 -->
      <div class="h-24 full-width q-mb-md scroll-x no-scroll scroll absolute"
           style="top: 12px; left: 0;"
           ref="randomNumRef">
        <div class="h-24 w-fit float-right"
             style="white-space: nowrap;">
          <div v-for="(v,k) in randomNumHistory"
               class="w-50 h-24 line-24 text-center rounded-borders q-mx-xs text-white fz-12 inline-block"
               :class="[v.winAmount > 0 ? 'bg-green' : 'bg-red']"
               :key="k">
            {{ v.roll_number }}x
          </div>
        </div>
      </div>
      <div class="relative-position">
        <q-img src="~assets/webp/up.webp"
               class="full-height full-width" />
      </div>
      <div class="w-50 h-50 rounded bg-red absolute line-50 text-center cursor-pointer"
           style="bottom: 0; left: 50%; margin-left: -25px;"
           :style="{'bottom': limboStart +'px', 'transform': `scale(${limboStartScale})`}">
        火箭
      </div>
    </div>
    <!-- 投注选项区域 -->
    <div class="q-mt-md">
      <div class="full-width h-80 row overflow-hidden items-center justify-center text-center">
        <div class="col q-pr-sm">
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
        <div class="col q-pl-sm row">
          <div class="col h-76 q-pr-sm">
            <div class="bg-black full-height full-width rounded-12 row items-center justify-center text-center">
              <div class="col column">
                <div class="row q-px-sm items-center">
                  <div class="w-20 h-20 bg-blue-grey-14 rounded-borders line-20 cursor-pointer"
                       :class="[(!startFast && is_submit) ? '' : 'disabled']"
                       @click="reduceFun"> - </div>
                  <div class="col h-30 q-px-sm">
                    <q-tooltip anchor="top middle"
                               self="bottom middle"
                               :offset="[20, 20]"
                               class="text-white">
                      输入的数字应大于等于<span class="text-red-6 text-bold">1.01</span>且小于等于<span class="text-red-6 text-bold">9999</span>
                    </q-tooltip>
                    <input class="h-30 full-width fz-20 text-center text-white rounded-borders"
                           style="outline:none;background:none;border:0px;"
                           type="text"
                           v-model="betNum"
                           @blur="betNumOnblur"
                           :disabled="(!startFast && is_submit) ? false: true"
                           onkeyup="value=value.replace(/[^1-9]{0,1}(\d*(?:\.\d{0,2})?).*$/g, '$1')">
                  </div>
                  <div class="w-20 h-20 bg-blue-grey-14 rounded-borders line-20 cursor-pointer"
                       :class="[(!startFast && is_submit) ? '' : 'disabled']"
                       @click="addFun"> + </div>
                </div>
                <div class="text-grey-4 q-mt-xs">TARGET</div>
              </div>
            </div>
          </div>
          <div class="col h-76 q-pl-sm"
               @click="betSubmit(false)">
            <div class="bg-primary full-height full-width rounded-12 row items-center justify-center cursor-pointer">
              <div v-if="!isFast"
                   class="fz-20"
                   :class="[is_submit ? '' : 'disabled']">Bet</div>
              <div v-else
                   class="fz-20">
                <div class="fz-16 h-30 line-30">{{ startFast ? 'STOP' : 'START'}}</div>
                <div class="fz-12">∞</div>
              </div>
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
  name: 'limboGame',
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
      betNum: 2,
      limboStart: 0,
      limboStartScale: 1,
      limboStartInterval: null,
    };
  },
  watch: {},
  created () {
    this.wsStore = wsStore();
  },
  beforeMount () { },
  mounted () {
    this.canvasPainting(); // 开启canvas
    this.SOCKET = this.wsStore.getters_socket;
    // 处理相关ws返回
    this.SOCKET.on('games.limbo.bet', (res) => {
      console.log(res)
      setTimeout(() => {
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
    reduceFun () {
      if (!this.is_submit || this.startFast) return;
      this.betNum = Math.ceil(this.betNum) - 1;
      if (this.betNum < 1.01) { this.betNum = 1.01 }
    },
    addFun () {
      if (!this.is_submit || this.startFast) return;
      this.betNum = Math.floor(this.betNum) + 1;
      if (this.betNum > 9999) { this.betNum = 9999; }
    },
    betNumOnblur () {
      if (this.betNum < 1.01) { this.betNum = 1.01; }
      if (this.betNum > 9999) { this.betNum = 9999; }
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
        prediction: this.betNum,
      }
      this.SOCKET.emit('games.limbo.bet', params);
      this.is_submit = false;
      // 运动相关
      this.limboStartInterval = setInterval(() => {
        this.limboStart += 10;
        this.limboStartScale -= 0.02;
        if (this.limboStart >= 300) {
          clearInterval(this.limboStartInterval)
          this.limboStart = 0;
          this.limboStartScale = 1;
        }
      }, 30);
    },
    backRight () {
      let width = this.$refs.randomNumRef.scrollWidth;
      this.$refs.randomNumRef.scrollTo(width, 0);
    },
    canvasPainting () {
      // 坐标
      class Crood {
        constructor(x = 0, y = 0) {
          this.x = x;
          this.y = y;
        }
        setCrood (x, y) {
          this.x = x;
          this.y = y;
        }
        copy () {
          return new Crood(this.x, this.y);
        }
      }
      // 流星
      class ShootingStar {
        constructor(init = new Crood, final = new Crood, size = 3, speed = 200, onDistory = null) {
          this.init = init; // 初始位置
          this.final = final; // 最终位置
          this.size = size; // 大小
          this.speed = speed; // 速度：像素/s
          // 飞行总时间
          this.dur = Math.sqrt(Math.pow(this.final.x - this.init.x, 2) + Math.pow(this.final.y - this.init.y, 2)) * 1000 / this.speed;
          this.pass = 0; // 已过去的时间
          this.prev = this.init.copy(); // 上一帧位置
          this.now = this.init.copy(); // 当前位置
          this.onDistory = onDistory;
        }
        draw (ctx, delta) {
          this.pass += delta;
          this.pass = Math.min(this.pass, this.dur);

          let percent = this.pass / this.dur;

          this.now.setCrood(
            this.init.x + (this.final.x - this.init.x) * percent,
            this.init.y + (this.final.y - this.init.y) * percent
          );

          // canvas
          ctx.strokeStyle = '#fff';
          ctx.lineCap = 'round';
          ctx.lineWidth = this.size;
          ctx.beginPath();
          ctx.moveTo(this.now.x, this.now.y);
          ctx.lineTo(this.prev.x, this.prev.y);
          ctx.stroke();

          this.prev.setCrood(this.now.x, this.now.y);
          if (this.pass === this.dur) {
            this.distory();
          }
        }
        distory () {
          this.onDistory && this.onDistory();
        }
      }
      // 流星雨
      class MeteorShower {
        constructor(cvs, ctx) {
          this.cvs = cvs;
          this.ctx = ctx;
          this.stars = [];
          this.T;
          this.stop = false;
          this.playing = false;
        }
        // 生成随机位置的流星
        createStar () {
          let angle = Math.PI / 3;
          let distance = Math.random() * 800;
          let init = new Crood((Math.random() * 1.2 * this.cvs.width - 50), Math.random() * 300 | 0);
          let final = new Crood(init.x + distance * Math.cos(angle), init.y + distance * Math.sin(angle));
          let size = Math.random() * 2;
          let speed = Math.random() * 350;
          let star = new ShootingStar(
            init, final, size, speed,
            () => { this.remove(star) }
          );
          return star;
        }

        remove (star) {
          this.stars = this.stars.filter((s) => { return s !== star });
        }

        update (delta) {
          if (!this.stop && this.stars.length < 40) {
            this.stars.push(this.createStar());
          }
          this.stars.forEach((star) => {
            star.draw(this.ctx, delta);
          });
        }

        tick () {
          if (this.playing) return;
          this.playing = true;

          let now = (new Date()).getTime();
          let last = now;
          let delta;

          let _tick = () => {
            if (this.stop && this.stars.length === 0) {
              cancelAnimationFrame(this.T);
              this.playing = false;
              return;
            }

            delta = now - last;
            delta = delta > 500 ? 30 : (delta < 16 ? 16 : delta);
            last = now;
            // console.log(delta);

            this.T = requestAnimationFrame(_tick);

            ctx.save();
            ctx.globalCompositeOperation = "destination-in";
            ctx.fillStyle = 'rgba(0,0,0,0.8)'; // 每一帧用 “半透明” 的背景色清除画布
            ctx.fillRect(0, 0, cvs.width, cvs.height);
            ctx.restore();
            this.update(delta);
          }
          _tick();
        }

        // 开始
        start () {
          this.stop = false;
          this.tick();
        }

        // 暂停
        stop () {
          this.stop = true;
        }
      }

      let cvs = document.querySelector('canvas');
      let ctx = cvs.getContext('2d');
      let meteorShower = new MeteorShower(cvs, ctx);
      meteorShower.start();
    },
  },
  computed: {},
  unmounted () {
    this.SOCKET.off('games.limbo.bet') // 销毁事件
    clearInterval(this.limboStartInterval)
  }
})
</script>
<style lang='scss' scoped>
.limboGame {
  line-height: normal;
  .limboBg {
    background-image: url("assets/svg/limboBg.svg");
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 10px;
    overflow: hidden;
  }
}
</style>