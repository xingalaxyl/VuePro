<template>
  <el-container>
    <!-- 左侧菜单栏 -->
    <el-aside :width="isCollapse ? '65px' : '200px'">
      <img src="@/assets/img/logo_admin.png" alt style="width: 170px; margin: 10px 15px 10px 15px" />
      <el-menu
        router
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#323745"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        :collapse-transition="false"
        :style="{width: isCollapse ? '65px' : '200px'}"
      >
        <el-menu-item index="1">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/articleadd">发布文章</el-menu-item>
          <el-menu-item index="/article">文章列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="3">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/account">
          <i class="el-icon-location"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="fl">
          <i
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            @click="isCollapse = !isCollapse"
            style="margin-right: 10px"
          ></i>
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
      <el-main>
        <router-view></router-view>
      </el-main>
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
    return {
      isCollapse: false // 是否折叠
    }
  },
  components: {},
  methods: {
    logout () {
      // 提示框
      this.$confirm('此操作将要退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {})
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
body {
  background-color: #f2f3f5;
}
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
    min-width: 970px;
    // background-color: pink;
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
