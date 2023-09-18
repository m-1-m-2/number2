<template>
  <div class='myAccount'>
    <q-page class="relative-position full-height full-width scroll hide-scrollbar">
      <!-- container -->
      <div class="container-home">
        <div class="h-32 line-32 q-mt-lg fz-20 text-bold">myAccount</div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'myAccount',
  components: {},
  props: [''],
  data () {
    return {

    };
  },
  watch: {},
  created () { },
  beforeMount () { },
  mounted () { },
  methods: {},
  computed: {}
})
</script>

<style lang='scss' scoped>
.myAccount {
  line-height: normal;
}
</style>