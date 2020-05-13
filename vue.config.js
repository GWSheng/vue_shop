module.exports = {
  chainWebpack: config => { // 生产模式和开发模式使用不同的打包入口文件
    // 生产环境配置
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', { // 设置externals节点，index.html中引入cdn外链，这样最后打包的js文件体积将会变小
        echarts: 'echarts',
        lodash: '_'
      })
    })
    // 开发环境配置
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}