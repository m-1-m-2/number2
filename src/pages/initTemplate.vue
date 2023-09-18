<template>
  <div class='initTemplate'>
    <q-page class="relative-position full-height full-width scroll hide-scrollbar">
      <!-- container -->
      <div class="container-home">
        <div class="h-32 line-32 q-mt-lg fz-20 text-bold">initTemplate</div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'initTemplate',
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
.initTemplate {
  line-height: normal;
}
</style>