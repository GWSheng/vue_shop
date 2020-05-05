import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)

// 将Element对象中的Message弹出框挂载到Vue对象的原型上，这样所有的组件都可以通过this.$message来使用弹出框组件
// Vue.prototype.$message = Element.Message
