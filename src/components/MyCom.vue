<template>
  <div>自定义组件
    <slot></slot>
    <button @click="test"></button>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    test () {
      this.$emit('click', '123')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
