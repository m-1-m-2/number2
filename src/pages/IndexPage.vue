<template>
  <q-page class="relative-position full-height full-width scroll hide-scrollbar">
    <!-- container -->
    <div class="container-home">
      <div>
        <div class="row full-width bg-dark text-white h-308 overflow-hidden">
          <div class="col column items-center justify-center q-px-md h-308">
            <div class="text-h4 text-left full-width q-my-sm text-bold">Leading Crypto Casino</div>
            <div class="text-left full-width q-my-sm text-grey-8"> Enjoy 5000+ crypto games, fast payouts and 24/7 live support. Make the best of the superior Bitcoin Casino. </div>
            <div class="full-width q-my-sm row">
              <q-btn class="glossy bg-red-10 h-52 w-128"
                     @click="store.actions_login_dialog_boolean"
                     label="Sign Up" />
              <div class="bg-white h-52 w-230 rounded-borders">
              </div>
            </div>
          </div>
          <div class="col-auto h-308 w-428">
            <img src="~/assets/avif/racoon-small.avif"
                 class="h-308 w-428"
                 alt="">
          </div>
        </div>
        <div class="q-py-md q-px-sm bg-blue-grey-10 rounded-12">
          <div class="row justify-center">
            <div class="q-mx-sm bg-blue-grey-9 col h-208 rounded-12"></div>
            <div class="q-mx-sm bg-blue-grey-9 col h-208 rounded-12"></div>
            <div class="q-mx-sm bg-blue-grey-9 col h-208 rounded-12"></div>
          </div>
        </div>
        <div class="h-46 line-46 q-mb-lg bg-warning box-border q-px-md">
          12132
        </div>
      </div>
      <!-- lobby-tabs -->
      <div class="bg-primary q-mb-lg box-border rounded-12 row q-px-sm q-py-sm">
        <div class="col-auto">
          <q-tabs v-model="tab"
                  inline-label
                  dense
                  class="bg-primary text-white hideElement">
            <q-tab name="mails"
                   icon="mail"
                   label="Mails" />
            <q-tab name="alarms"
                   icon="alarm"
                   label="Alarms" />
            <q-tab name="movies"
                   icon="movie"
                   label="Movies" />
            <q-tab name="photos"
                   icon="photo"
                   label="Photos" />
            <q-tab name="videos"
                   icon="slow_motion_video"
                   label="Videos" />
            <q-tab name="addressbook"
                   icon="people"
                   label="Address Book" />
          </q-tabs>
        </div>
        <div class="col row items-center justify-end">
          <q-input rounded
                   standout
                   autofocus
                   class="self-input-md"
                   v-model="text">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon name="close"
                      @click="text = ''"
                      class="cursor-pointer" />
            </template>
          </q-input>
        </div>
      </div>
      <!-- lobby games -->
      <div class="grid grid-item">
        <div v-for="(v,k) in 24"
             :key="k"
             class="g-item">
          <q-img src="~/assets/avif/test_img.avif"
                 spinner-color="white"
                 class="full-height full-width rounded-12" />

          <div class="play-icon hidden full-height full-width absolute top left">
            <div class="full-height full-width row items-center justify-center">
              <div class="w-50 h-50">
                <q-img src="~/assets/imgs/playIcon.jpg"
                       spinner-color="white"
                       @click="$router.push({path:'/inHouse/dice'})"
                       class="full-height full-width rounded-borders" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div class="q-my-md text-center">
        <q-btn class="bg-grey-7 h-44 w-142"
               label="Load More" />
      </div>

      <div>
        <div class="h-46 line-46 q-mb-lg bg-warning">
          12132
        </div>
      </div>

      <!-- carousel -->
      <div>
        <q-carousel v-model="slide"
                    transition-prev="scale"
                    transition-next="scale"
                    swipeable
                    autoplay
                    infinite
                    animated
                    control-color="white"
                    padding
                    arrows
                    height="300px"
                    class="bg-primary text-white shadow-1 rounded-borders">
          <q-carousel-slide name="style"
                            class="column no-wrap flex-center">
            <q-icon name="style"
                    size="56px" />
            <div class="q-mt-md text-center">
              {{ lorem }}
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="tv"
                            class="column no-wrap flex-center">
            <q-icon name="live_tv"
                    size="56px" />
            <div class="q-mt-md text-center">
              {{ lorem }}
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="layers"
                            class="column no-wrap flex-center">
            <q-icon name="layers"
                    size="56px" />
            <div class="q-mt-md text-center">
              {{ lorem }}
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="map"
                            topslide
                            class="column no-wrap flex-center">
            <q-icon name="terrain"
                    size="56px" />
            <div class="q-mt-md text-center">
              {{ lorem }}
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { userStore } from 'stores/user.js';

export default defineComponent({
  name: 'IndexPage',
  components: {},
  props: [''],
  data () {
    return {
      store: null,
      tab: 'mails',
      text: '',
      slide: 'style',
      lorem: 'Lorem ipsum dolor',

    };
  },
  watch: {},
  created () {
    this.store = userStore()
  },
  beforeMount () { },
  mounted () { },
  methods: {},
  computed: {}
})
</script>

<style lang='scss' scoped>
</style>
