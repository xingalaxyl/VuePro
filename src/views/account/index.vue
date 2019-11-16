<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账户管理</span>
    </div>
    <div class="text item accountFormBox">
      <div class="fl">
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          :rules="accountFormRules"
          label-width="100px"
        >
          <el-form-item prop="name" label="用户名：">
            <el-input type="text" v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input type="text" v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱：">
            <el-input type="text" v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介：">
            <el-input type="text" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateAccount()">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="fr">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="httpRequest"
        >
          <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script type="text/javascript">
export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        name: '',
        mobile: '',
        email: '',
        intro: ''
      },
      accountFormRules: {
        name: [
          { required: true, message: '用户名必填' },
          {
            min: 1,
            max: 7,
            message: '长度介于1到7个字符'
          }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          {
            type: 'email',
            message: '邮箱格式不同'
          }
        ]
      }
    }
  },
  created () {
    this.getAccountForm()
  },
  methods: {
    // 头像请求
    httpRequest (resouce) {
      let fd = new FormData()
      fd.append('photo', resouce.file)
      let pro = this.$html.patch('/user/photo', fd)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.accountForm.photo = result.data.data.photo
            this.$message.success('头像修改成功')
          }
        })
        .catch(err => {
          return this.$message.error('头像修改失败' + err)
        })
    },
    getAccountForm () {
      let pro = this.$html.get('/user/profile')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.accountForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取账户信息错误' + err)
        })
    },
    updateAccount () {
      // console.log(this)
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          let pro = this.$html.patch('/user/profile', this.accountForm)
          pro
            .then(result => {
              console.log(result)
            })
            .catch(err => {
              return this.$message.error('修改账户错误' + err)
            })
        }
      })
    }
  },
  components: {}
}
</script>

<style lang="less" scoped>
.accountFormBox {
  display: flex;
  justify-content: space-between;
  .fl {
    width: 50%;
    background-color: orange;
  }
  .fr {
    width: 30%;
    background-color: lightblue;
  }
}

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
