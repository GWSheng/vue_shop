<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="goodsListParams.query" clearable @clear="clearSearchInput" @keyup.enter.native="clearSearchInput">
            <el-button slot="append" icon="el-icon-search" @click="getSearchGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户表格区域 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="90"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90"></el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            <p>{{scope.row.add_time | timeHandle}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="200">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table>
      <el-pagination background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsListParams.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="goodsListParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      goodsList: [],
      goodsListParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.goodsListParams })
      if (res.meta.status !== 200) return this.$message.error('商品列表数据请求失败')
      console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (size) {
      this.goodsListParams.pagesize = size
      this.getGoodsList()
    },
    handleCurrentChange (page) {
      this.goodsListParams.pagenum = page
      this.getGoodsList()
    },
    getSearchGoodsList () {
      this.getGoodsList()
    },
    clearSearchInput () {
      this.getGoodsList()
    },
    addGoods () {
      this.$router.push('/goods/addGoods')
    }
  }
}
</script>

<style lang='less' scoped>

</style>
