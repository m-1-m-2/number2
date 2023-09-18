<template>
  <div class='crashGame q-px-md relative-position'>
    <div class="h-600 w-250 absolute bg-red rounded-16 relative-position overflow-hidden"
         style="top:0; left: 0;">
      <div class="full-width h-48"
           style="background: radial-gradient(100% 100% at 50% 0,rgba(238,20,70,.83) 0,rgba(251,93,127,0) 100%),#151f2b;">
      </div>
      <div class="full-width h-48 line-48 text-center row bg-grey-10 cursor-pointer">
        <div class="col">Manual</div>
        <div class="col">Auto</div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'crashGame',
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
.crashGame {
  line-height: normal;
}
</style>