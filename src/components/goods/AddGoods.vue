<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-alert
            title="添加商品信息"
            type="info"
            show-icon :closable="false" center>
          </el-alert>
        </el-col>
      </el-row>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="tabName-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab标签部分 -->
      <el-tabs :tab-position="'left'" v-model="tabName" @tab-click="tabClick" :before-leave="toggleTabPane">
        <el-tab-pane label="基本信息" name="0">
          <el-form ref="form" :model="goodsForm" label-width="80px">
            <el-form-item label="活动名称">
              <el-input v-model="goodsForm.name"></el-input>
            </el-form-item>
            <el-form-item label="活动名称">
              <el-input v-model="goodsForm.name"></el-input>
            </el-form-item>
            <el-form-item label="活动名称">
              <el-input v-model="goodsForm.name"></el-input>
            </el-form-item>
            <el-form-item label="活动名称">
              <el-input v-model="goodsForm.name"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品信息" name="1">配置管理</el-tab-pane>
        <el-tab-pane label="商品参数" name="2">角色管理</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">角色管理</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabName: '',
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      goodsForm: {}
    }
  },
  methods: {
    tabClick () {
      console.log(typeof this.tabName)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    toggleTabPane () {
      console.log(1)
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0 15px 0;
}
.el-tabs {
  min-height: 300px;
}
</style>
