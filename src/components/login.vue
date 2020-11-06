<template>
  <div class="login_container">
    <div class="login_box">
      <div class="head_box">
        <img src="./../assets/logo.png" alt="" />
      </div>
      <el-form
        class="login_info"
        :rules="loginFormRules"
        :model="loginForm"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-xingmingyonghumingnicheng"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //   表单的验证规则
      loginFormRules: {
        //   验证用户名是否合法，在input中通过prop就可以让这个验证规则生效
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        //   验证密码是否符合规则
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // 重置表单
      console.log(this.$refs)
      // this.$refs.loginFormRef：拿到了ref为loginFormRef的表单
      this.$refs.loginFormRef.resetFields()
    },
    // 登录预验证
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // 参数1时验证的结果
        console.log(valid)
        if (!valid) {
          return
        }
        // 验证成功，发起网络请求
        // 参数1：请求的地址，参数2：请求的数据
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        // 登录成功之后
        // 1.将登录之后的token保存到客户端的sessionStorage中
        // 1.1项目中除了登录之外的其他API接口，必须要在登录之后才能访问
        // 1.2token只应该在当前网页打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式导航跳转到后台主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scope>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_container .login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_container .login_box .head_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  background-color: #fff;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_container .login_box .login_info {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.login_container .login_box .login_info .btns {
  display: flex;
  justify-content: flex-end;
}
</style>
