<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['borderBottom', index==0 ? 'borderTop' : '', 'vcenter']" v-for="(item1, index) in scope.row.children" :key="item1.id">
                <el-col :span="5">
                  <el-tag closable @close="deleteRight(scope.row.id, item1.id)">
                    {{item1.authName}}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row :class="[index==0 ? '' : 'borderTop']" v-for="(item2, index) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="deleteRight(scope.row.id, item2.id)">
                        {{item2.authName}}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" closable  v-for="(item3, index) in item2.children" :key="item3.id" @close="deleteRight(scope.row.id, item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column> <!-- 添加索引列 -->
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作" width="360px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="50%" @close="closeRightDialog">
      <span>
        <el-tree :data="rightsList" :props="rightsProps" show-checkbox :default-expand-all="true" node-key="id" :default-checked-keys="defaultKeyArr" ref="rightTreeRef">
        </el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      roleList: [],
      rightDialogVisible: false,
      rightsList: [],
      rightsProps: {
        children: 'children', // tree表中父子联系的键值名称
        label: 'authName' // tree表中显示的名称的键值名称
      },
      defaultKeyArr: [],
      roleID: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('角色列表信息获取失败')
      this.roleList = res.data
    },
    async deleteRight (roleID, rightID) {
      const confirmFlag = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmFlag !== 'confirm') return this.$message.warning('已取消删除该权限')
      const { data: res } = await this.$http.delete(`roles/${roleID}/rights/${rightID}`)
      if (res.meta.status !== 200) return this.$message.error('权限删除失败')
      this.$message.success('权限删除成功')
      const role = this.roleList.find(item => {
        return item.id === roleID
      })
      role.children = res.data
    },
    async showRightDialog (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('权限列表获取失败')
      this.rightsList = res.data
      this.roleID = role.id
      this.getDefaultRight(role, this.defaultKeyArr)
      this.rightDialogVisible = true
    },
    getDefaultRight (role, arr) {
      if (!role.children) return arr.push(role.id)
      role.children.forEach(item => {
        this.getDefaultRight(item, arr)
      })
    },
    closeRightDialog () {
      this.defaultKeyArr = []
    },
    async commitRights () {
      const arr1 = this.$refs.rightTreeRef.getHalfCheckedKeys()
      const arr2 = this.$refs.rightTreeRef.getCheckedKeys()
      const idStr = arr1.join(',') + ',' + arr2.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleID}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('权限分配失败')
      this.$message.success('权限分配成功')
      this.getRoleList()
      this.rightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }
  .borderTop {
    border-top: 1px solid #ddd;
  }
  .borderBottom {
    border-bottom: 1px solid #ddd;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
