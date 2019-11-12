<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-header>
        <div class="fl">
          <i class="el-icon-s-fold"></i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>
        <div class="fr">
          <el-input style="width: 200px;" placeholder="请输入搜索的文章内容"></el-input>
          <span style="margin: 0 20px;">消息</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="imgSrc" alt />
              <i>{{ name }}</i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus">个人信息</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus">github地址</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus-outline" @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script type="text/javascript">
export default {
  computed: {
    name () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    imgSrc () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  data () {
    return {}
  },
  components: {},
  methods: {
    logout () {
      // 提示框
      this.$confirm('此操作将要退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.clear()
        this.$router.push('/login')
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="less">
.fr {
      .el-input {
        .el-input__inner {
          height: 32px;
        }
      }
}
</style>
<style lang="less" scoped>
.el-container {
  height: 100%;
  // 左侧导航栏
  .el-aside {
    background-color: rgb(50, 55, 69);
  }
  // 头部
  .el-header {
    // height: 60px;
    // width: 100%;
    background-color: pink;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    .fl {
      width: 40%;
      display: flex;
      align-items: center;
    }
    .fr {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .el-dropdown {
        img {
          width: 32px;
          vertical-align: middle;
          margin-right: 10px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
