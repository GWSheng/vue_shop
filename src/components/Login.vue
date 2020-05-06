<template>
  <div class="login">
    <div class="login_box">
      <!-- 绘制Vue图像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <!-- 登录表单区域 -->
      <div class="login_form">
        <!-- :model用于表单的双向数据绑定，:rules用于提供表单验证功能 -->
        <el-form ref="loginFormRef" :model="login_form" :rules="login_form_rules">
          <!-- 账号 -->
          <el-form-item prop="username"> <!-- prop的值是login_form_rules规则对象中的名称 -->
            <!-- 带图标的输入框 通过属性和iconfont提供的图标实现 -->
            <el-input v-model="login_form.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input type='password' v-model="login_form.password" >
              <!-- 带图标的输入框 通过slot和iconfont提供的图标实现 -->
              <i slot="prefix" class="iconfont icon-3702mima"></i>
            </el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="logn_btn">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      login_form: { // 登录表单用到的数据绑定对象
        username: 'admin',
        password: '123456'
      },
      login_form_rules: {
        username: [ // 必须和login_form对象中的属性名对应
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在3~5个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在5~15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () { // 通过this.$refs获取表单，调用elementui表单的resetFields方法重置表单
      this.$refs.loginFormRef.resetFields()
    },
    login () { // 点击登录按钮，提交表单数据之前，对整个表单进行预验证，调用elementui表单的validate方法
      this.$refs.loginFormRef.validate(async (valid, obj) => { // 参数validate为返回的验证结果值，Boolean类型，obj为哪个验证规则出错了
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.login_form)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 将登录之后服务器返回的token保存在浏览器的sessionStorage中，token只应在网站打开期间有效，所有使用sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        // 通过路由式导航将页面跳转到主页面
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);

    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: white;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form {
    position: absolute;
    bottom:0px;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  .logn_btn {
    display: flex;
    justify-content: flex-end;
  }
</style>
