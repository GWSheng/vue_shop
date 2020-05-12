<template>
  <div>
    <div id="main" ref="dRef" style="width: 1000px;height:600px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted () { // 所有dom元素都准备好了
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.dRef)
    const { data: res } = await this.$http.get('reports/type/1')
    const obj = _.merge(res.data, this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(obj)
  }
}
</script>

<style lang="less" scoped>

</style>
