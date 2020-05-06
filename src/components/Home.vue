<template>
  <el-container class="home_box">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="logo">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuToggleFlag?'64px':'200px'">
        <div class="toggleMenu" @click="menuToggleFlag?menuToggleFlag=false:menuToggleFlag=true">|||</div>
        <!-- 所有菜单需放置在el-menu中 -->
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409bff" :unique-opened="true" :collapse="menuToggleFlag" :collapse-transition="false" router :default-active="default_active_index">
          <!--el-submenu 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="(item, index) in menuList" :key="item.id">
            <template slot="title">
              <i :class="menuIcons[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--el-menu-item 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" v-bind:key="subItem.id" @click="saveStatus('/'+subItem.path)" >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
       </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      menuIcons: ['iconfont icon-users', 'iconfont icon-tijikongjian', 'iconfont icon-shangpin', 'iconfont icon-danju', 'iconfont icon-baobiao'],
      menuToggleFlag: false,
      default_active_index: ''
    }
  },
  created () {
    this.getMenuList()
    this.default_active_index = window.sessionStorage.getItem('index')
  },
  methods: {
    logOut () { // 退出系统
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    saveStatus (index) {
      window.sessionStorage.setItem('index', index)
    }
  }
}
</script>

<style lang='less' scoped>
  .home_box {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0px;
    > div {
      color: #fff;
      font-size: 20px;
      display: flex;
      align-items: center;

      span {
        margin-left: 20px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border: 0px;
    }
    .toggleMenu {
      background-color: #bbb;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 5px;
  }
</style>
