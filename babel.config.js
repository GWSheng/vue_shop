const productPlugins = []
if (process.env.NODE_ENV === 'production') { // 生产环境时去除console， 开发环境时不去除console
  productPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ...productPlugins,
    "@babel/plugin-syntax-dynamic-import"
  ]
}
