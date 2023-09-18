<template>
  <div class='LoginComponent row items-center justify-center'>
    <div class="w-690 h-550 bg-white row rounded-16 overflow-hidden">
      <div class="col h-inherit">
        <q-img src="~/assets/webp/bgLogin.webp"
               spinner-color="white"
               class="h-inherit full-width" />
      </div>
      <div class="col h-inherit">
        <div class="relative-position">
          <div class="h-48 full-width">

          </div>

          <q-icon name="close"
                  class="absolute-top-right"
                  @click="store.actions_login_dialog_boolean"
                  size="40px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { userStore } from 'stores/user.js';

export default defineComponent({
  name: 'LoginComponent',
  components: {},
  props: [''],
  data () {
    return {
      store: null,
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
.LoginComponent {
  line-height: normal;
}
</style>