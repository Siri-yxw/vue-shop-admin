<template>
  <div class="login_contain">
      <div class="login_box">
        <!-- 用户头像 -->
          <div class="user_img">
              <img src="../assets/user_img.jpg" alt="">
          </div>
          <!-- 表单内容 -->
          <div class="login_form">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
                  <el-form-item  prop="username">
                      <el-input prefix-icon="el-icon-user-solid" v-model="ruleForm.username"></el-input>
                  </el-form-item>
                  <el-form-item  prop="password">
                      <el-input prefix-icon="el-icon-goods" type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item class="login_btn">
                      <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                      <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('/login', this.ruleForm)
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        window.localStorage.setItem('token', res.data.token)
        this.$router.push('home')
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.login_contain {
  height: 100%;
  background-color: #274a6c;
  position: relative;
  .login_box {
    width: 550px;
    height: 400px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    .user_img {
      width: 150px;
      height: 150px;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      padding: 10px;
      position: absolute;
      left: 50%;
      top: -75px;
      transform: translateX(-50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .login_form {
      margin-top: 120px;
      padding: 0 20px 0 20px;
      .login_btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>


