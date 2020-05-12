<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户表格区域 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="400"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"  width="90"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款"   width="90">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status==0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"  width="90"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | timeHandle}}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditOrderDialog"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showExpressDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="编辑订单"
      :visible.sync="editOrderDialogVisible"
      width="50%" @close="cleareditOrderForm">
      <el-form :model="editOrderForm" :rules="editOrderFormRules" ref="editOrderFormRef" label-width="100px">
        <el-form-item label="省/市地址" prop="normalAddress">
          <el-cascader
            v-model="editOrderForm.normalAddress"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="editOrderForm.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="conmmitEditOrderDialogVisible">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="物流信息"
      :visible.sync="expressDialogVisible"
      width="50%">
      <el-timeline :reverse="reverse">
        <el-timeline-item color="rgb(0,160,255)"
          v-for="(activity, index) in expressList"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      orderList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      editOrderDialogVisible: false,
      editOrderForm: {
        normalAddress: '',
        detailAddress: ''
      },
      editOrderFormRules: {
        normalAddress: [
          { required: true, message: '请输入省市地址', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      expressDialogVisible: false,
      expressList: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('订单数据获取失败')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getOrderList()
    },
    handleCurrentChange (page) {
      this.queryInfo.pagenum = page
      this.getOrderList()
    },
    conmmitEditOrderDialogVisible () {
      this.editOrderDialogVisible = false
    },
    showEditOrderDialog () {
      this.editOrderDialogVisible = true
    },
    handleChange () {
      console.log('我变了')
    },
    cleareditOrderForm () {
      this.$refs.editOrderFormRef.resetFields()
    },
    async showExpressDialog () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('物流信息获取失败')
      this.expressList = res.data
      this.expressDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
