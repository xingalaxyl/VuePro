<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width>
        <img src="./logo_index.png" alt />
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入验证码 "></el-input>
        </el-form-item>
        <el-form-item style="text-align: left" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="login('loginFormRef')" :loading="isloading" type="primary" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
import '@/assets/js/gt.js'
export default {
  created () {
    // let that = this
    document.onkeypress = e => {
      var keycode = document.all ? event.keyCode : e.which
      if (keycode === 13) {
        this.submitForm('loginFormRef') // 登录方法名
        return false
      }
    }
  },
  data () {
    // 自定义检测协议规则
    var xieyiRule = function (rule, value, callback) {
      // console.log(value)
      value ? callback() : callback(new Error('请仔细阅读并同意本协议'))
    }
    return {
      isloading: false, // 用于判断是否显示加载中按钮
      geetObj: null, // 用于记录人机交互缓存
      // loginForm 记录表单的所有数据
      // 内部的属性表示每个input框的值
      loginForm: {
        mobile: '13455552222',
        code: '246810',
        xieyi: true
      },
      // 定义一个名为loginFormRules的检验规则对象
      // 内部是各种使用prop绑定的每一个input框的检验规则
      loginFormRules: {
        mobile: [
          { required: true, message: '请正确输入手机号', trigger: 'blur' },
          { pattern: /^1[135789]\d{9}$/, message: '手机号格式不正确' }
        ],
        code: [
          { required: true, message: '请正确输入验证码', trigger: 'blur' }
        ],
        // validator 表示绑定自定义检测规则
        xieyi: [{ validator: xieyiRule }]
      }
    }
  },
  components: {},
  methods: {
    login (loginFormRef) {
      // console.log(this)
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          // this.$router.push({ name: 'home' })
          if (this.geetObj !== null) {
            return this.geetObj.verify()
          }
          this.isloading = true
          let pro = this.$html.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then((result) => {
              // console.log(result)
              let { data } = result.data
              window.initGeetest({
                // 以下配置参数来自服务端 SDK
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind'
              }, captchaObj => {
                captchaObj.onReady(() => {
                  // 验证码ready之后才能调用verify方法显示验证码
                  captchaObj.verify()
                  this.geetObj = captchaObj
                  this.isloading = false
                }).onSuccess(() => {
                  // your code
                  this.loginAct()
                }).onError(() => {
                  // your code
                })
              })
              // this.login()
            })
            .catch((err) => {
              return this.$message.error('获得人机秘钥信息有错误：' + err)
            })
        }
      })
    },
    loginAct () {
      let pro = this.$html.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          console.log(result)
          // console.log(this)
          if (result.data.message === 'OK') {
            let userinfo = result.data.data
            sessionStorage.setItem('userinfo', JSON.stringify(userinfo))

            console.log(userinfo)
            this.$router.push({ name: 'home' })
          }
        })
        .catch(() => {
          // console.log(err)
          // console.log(this)
          return this.$message({
            message: '错了哦，账号或者密码错误呦',
            duration: 1000 // 控制错误弹框提示时间
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: url("./login_bg.jpg");
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 475px;
    height: 350px;
    background-color: #fff;

    display: flex;
    justify-content: center;
    align-items: center;

    .el-form {
      width: 75%;
      text-align: center;
      img {
        width: 50%;
        margin: 20px auto;
      }
    }
  }
}
</style>
