<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input type="text" placeholder="请输入内容" v-model="userListParam.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
          </el-col>
        </el-row>
        <el-table :data="userList" border stripe style="width: 100%">
          <el-table-column type="index"></el-table-column> <!-- 添加索引列 -->
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="changeUserStatus(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showeditDialog(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
              <el-tooltip class="item" effect="dark" content="设置权限" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userListParam.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="userListParam.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" ref="paginationRef">
        </el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeAddUserDialog">
      <el-form :model="addUserForm" :rules="addUserRules" ref="ruleFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitAddUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="closeEditUserDialog">
      <el-form :model="editUserForm" :rules="editUserRules" ref="ruleEditFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEditUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    const checkEmail = (rule, value, cb) => { // 自定义验证邮箱的规则
      const emailReg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (emailReg.test(value)) {
        return cb() // 合法的邮箱
      }
      cb(new Error('请输入正确格式的邮箱')) // 不合法的邮箱
    }
    const checkMobile = (rule, value, cb) => { // 自定义验证手机号的规则
      const moblieReg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (moblieReg.test(value)) {
        return cb() // 合法的手机号
      }
      cb(new Error('请输入正确格式的手机号')) // 不合法的手机号
    }
    return {
      userListParam: {
        query: '',
        pagenum: 1, // 当前页码值
        pagesize: 2 // 每页显示多少条数据
      },
      userList: [],
      total: 0, // 一共有多少条数据
      dialogVisible: false,
      editDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' } // 自定义验证规则的使用方式
        ],
        mobile: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editUserRules: {
        email: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' } // 自定义验证规则的使用方式
        ],
        mobile: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.userListParam })
      if (res.meta.status !== 200) return this.$message.error('用户数据请求失败')
      if (res.data.users.length !== 0) {
        this.total = res.data.total
        this.userList = res.data.users
      } else {
        if (this.userListParam.pagenum !== 1) this.userListParam.pagenum--
        const { data: res } = await this.$http.get('users', { params: this.userListParam })
        if (res.meta.status !== 200) return this.$message.error('用户数据请求失败')
        this.total = res.data.total
        this.userList = res.data.users
      }
    },
    handleSizeChange (newSize) { // 监听 size 的改变,选择每页显示多少条数据
      this.userListParam.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) { // 监听当前页面的改变，改变当前页面的值
      this.userListParam.pagenum = newPage
      this.getUserList()
    },
    async changeUserStatus (params) {
      const { data: res } = await this.$http.put(`users/${params.id}/state/${params.mg_state}`)
      if (res.meta.status !== 200) {
        params.mg_state = !params.mg_state
        return this.$message.error('用户状态更新失败')
      }
      this.$message.success('用户状态更新成功')
    },
    closeAddUserDialog () { // 添加用户对话框关闭时，清空表单中的数据
      this.$refs.ruleFormRef.resetFields()
    },
    commitAddUser () {
      this.$refs.ruleFormRef.validate(async res => {
        if (!res) return
        const { data: res1 } = await this.$http.post('users', this.addUserForm)
        if (res1.meta.status !== 201) return this.$message.error('用户添加失败')
        this.$message.success('用户添加成功')
        this.getUserList() // 用户添加成功之后再次请求最新的用户列表信息
        this.dialogVisible = false
      })
    },
    async showeditDialog (id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    commitEditUser () {
      this.$refs.ruleEditFormRef.validate(async va => {
        if (!va) return
        const { data: res } = await this.$http.put(`users/${this.editUserForm.id}`, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('用户信息编辑失败')
        this.$message.success('用户信息更新成功')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    closeEditUserDialog () {
      this.$refs.ruleEditFormRef.resetFields()
    },
    async deleteUser (id) {
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') return
      const { data: re } = await this.$http.delete('users/' + id)
      if (re.meta.status !== 200) return this.$message.error('用户删除失败')
      this.$message.success('用户删除成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
  .el-table {
    margin-top: 15px;
  }
</style>
