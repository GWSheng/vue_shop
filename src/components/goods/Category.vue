<template>
  <div>
    商品分类
    <test></test>
    <myCom @click="clickMe">
      aaa
    </myCom>
    <g-input type="other" a="abbbbb" @myEvent="fn" @blur="blur1">
      <template slot-scope="scope">
        {{scope.data.name}}
      </template>
    </g-input>
  </div>
</template>

<script>

import Test from '../Test.vue'

export default {
  data () {
    return {}
  },
  methods: {
    clickMe () {
      console.log(123)
    },
    fn (data) {
      console.log(data)
    },
    blur1 () {
      console.log('dsdsdsds')
    }
  },
  components: {
    test: Test
  }

}
</script>

<style lang="less" scoped>

</style>
