<template>
  <div>
    <slot :data="d"></slot>
    <input type="text" class="btn" @click="click" @blur="blur" :class="type" :value="type">
  </div>
</template>

<script>

export default {
  props: ['a', 'type'],
  data () {
    return {
      d: {
        name: 'jack',
        sex: 'gril'
      }
    }
  },
  methods: {
    click () {
      this.$emit('myEvent', '123')
    },
    blur () {
      this.$emit('blur')
    }
  }
}
</script>

<style lang="less" scoped>
.btn {
  width: 100px;
  height: 25px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline:none;
}
.danger {
  background: rgb(222,80,70);
}
.success {
  background: rgb(22,160,100);
}
.other {
  background: rgb(255,205,70);
}
</style>
