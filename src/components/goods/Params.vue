<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告信息区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置参数"
        type="warning" :closable="false" show-icon>
      </el-alert>
      <!-- 级联选项卡区域 -->
      <el-row>
        <el-col>
          <span>请选择商品分类：</span>
          <el-cascader
            v-model="selectValue"
            :options="paramsList"
            :props="cascaderOpt"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="toggleAttributeTab">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="showaddParamsDialog">添加参数</el-button>
           <el-table :data="manyParamsList" style="width: 100%" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="closeTag(index,scope.row)">
                    {{item}}
                  </el-tag>
                  <el-input style="width:100px"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="$event.target.blur"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" @click="showeditParamsDialog(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled"  @click="showaddParamsDialog">添加属性</el-button>
          <el-table :data="onlyParamsList" style="width: 100%" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="closeTag(index,scope.row)">
                    {{item}}
                  </el-tag>
                  <el-input style="width:100px"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="$event.target.blur"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" @click="showeditParamsDialog(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加'+ addParamsDialogStr"
      :visible.sync="addParamsDialogVisible"
      width="50%" @close="closeParamsDialog">
      <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsFormRef" label-width="100px">
        <el-form-item :label="addParamsDialogStr" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitaddParamsDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'编辑'+ addParamsDialogStr"
      :visible.sync="editParamsDialogVisible"
      width="50%" @close="closeEditParamsDialog">
      <el-form :model="editParamsForm" :rules="editParamsRules" ref="editParamsFormRef" label-width="100px">
        <el-form-item :label="addParamsDialogStr" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEditParamsDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      selectValue: [], // 级联选择器选中的值
      paramsList: [], // 级联选择器使用的数据对象
      cascaderOpt: { // 级联选择器配置对象（配置value label children 等使用数据对象中的哪个属性）
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      manyParamsList: [],
      onlyParamsList: [],
      addParamsDialogVisible: false,
      addParamsForm: {
        attr_name: ''
      },
      addParamsRules: {
        attr_name: [
          { required: true, message: '请添加属性名称', trigger: 'blur' }
        ]
      },
      editParamsDialogVisible: false,
      editParamsForm: {
        attr_name: ''
      },
      editParamsRules: {
        attr_name: [
          { required: true, message: '请编辑属性名称', trigger: 'blur' }
        ]
      },
      currentAttrID: ''
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    handleChange () { // 级联选择器发生变化后触发的函数
      if (this.selectValue.length !== 3) {
        this.$message.error('请选择三级选项！！！')
        this.selectValue = []
        this.manyParamsList = []
        this.onlyParamsList = []
        return
      }
      this.getParamsList()
    },
    async getCategoryList () { // 获取级联选择器中需要的数据
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('商品分品数据获取失败')
      this.paramsList = res.data
    },
    toggleAttributeTab () {
      this.getParamsList()
    },
    async getParamsList () {
      let id = ''
      if (this.selectValue.length !== 0) {
        id = this.selectValue[this.selectValue.length - 1]
      }
      const { data: res } = await this.$http.get(`categories/${id}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('参数信息获取失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res)
      if (this.activeName === 'many') this.manyParamsList = res.data
      if (this.activeName === 'only') this.onlyParamsList = res.data
    },
    showaddParamsDialog () {
      this.addParamsDialogVisible = true
    },
    commitaddParamsDialog () {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateID}/attributes`, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getParamsList()
        this.addParamsDialogVisible = false
      })
    },
    closeParamsDialog () {
      this.$refs.addParamsFormRef.resetFields()
    },
    async showeditParamsDialog (row) {
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes/${row.attr_id}`, {
        attr_sel: this.activeName
      })
      if (res.meta.status !== 200) return this.$message.error('编辑信息获取失败')
      this.editParamsForm.attr_name = res.data.attr_name
      this.currentAttrID = row.attr_id
      this.editParamsDialogVisible = true
    },
    closeEditParamsDialog () {
      this.$refs.editParamsFormRef.resetFields()
    },
    commitEditParamsDialog () {
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${this.currentAttrID}`, {
          attr_sel: this.activeName,
          attr_name: this.editParamsForm.attr_name
        })
        if (res.meta.status !== 200) return this.$message.error('参数信息更新失败')
        this.$message.success('参数信息更新成功')
        this.getParamsList()
        this.editParamsDialogVisible = false
      })
    },
    async deleteParams (row) {
      const confirmRes = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => e)
      if (confirmRes !== 'confirm') return
      const { data: res } = await this.$http.delete(`categories/${this.cateID}/attributes/${row.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('参数删除失败')
      this.$message.success('参数删除成功')
      this.getParamsList()
    },
    async closeTag (index, row) {
      row.attr_vals.splice(index, 1)
      const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
        attr_sel: this.activeName,
        attr_name: row.attr_name,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('更新失败')
      this.$message.success('删除成功')
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim() === '') {
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
        console.log(row.attr_vals)
        row.inputVisible = false
        row.inputValue = ''
        const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
          attr_sel: this.activeName,
          attr_name: row.attr_name,
          attr_vals: row.attr_vals.join(' ')
        })
        if (res.meta.status !== 200) return this.$message.error('添加标签失败')
        this.$message.success('添加标签成功')
      }
    },
    showInput (row) {
      row.inputVisible = true
      console.log(this)
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    isBtnDisabled () { // 通过计算属性设计添加参数按钮的disabled属性
      if (this.selectValue.length !== 3) return true
      return false
    },
    cateID () {
      if (this.selectValue.length !== 0) {
        return this.selectValue[this.selectValue.length - 1]
      }
      return null
    },
    addParamsDialogStr () {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
  .el-cascader {
    margin: 15px 0px;
  }
  .el-tag {
    margin: 10px;
  }
</style>
