<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div>
        <el-form ref="searchForm" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态:">
            <el-radio v-model="searchForm.status" label=''>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
            <el-radio v-model="searchForm.status" label="4">已删除</el-radio>
          </el-form-item>
          <el-form-item label="频道列表:">
            <el-select v-model="searchForm.channel_id" clearable placeholder="请选择">
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择:">
            <div class="block">
              <el-date-picker
                v-model="timetotime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 文章列表区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共搜索到{{tot_count}}篇文章</span>
      </div>
      <div>
        <el-table :data="articleList" style="width: 100%">
          <el-table-column label="图标">
            <img :src="stData.row.cover.images[0]" slot-scope="stData" width="150" height="100" alt="..." />
          </el-table-column>
          <el-table-column prop="title" label="标题" width></el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-if="stData.row.status===2" type="info">审核通过</el-tag>
              <el-tag v-if="stData.row.status===3" type="warning">审核失败</el-tag>
              <el-tag v-if="stData.row.status===4" type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="时间"></el-table-column>
          <el-table-column label="操作">
            <el-button type="primary" size="mini">修改</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'articleList', // 组件名称
  created () {
    this.getChannelList() // 调用获取频道信息
    this.getarticleList() // 调用获取文章信息
  },
  // 定义监听器
  watch: {
    timetotime: function (val, oldVal) {
      if (val) {
        this.searchForm.begin_pubdate = val[0]
        this.searchForm.end_pubdata = val[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdata = ''
      }
      // this.getarticleList()
    },
    searchForm: {
      handler: function (val, oldVal) {
        this.getarticleList()
      },
      deep: true
    }
  },
  data () {
    return {
      tot_count: 0, // 记录搜索到的文章数量
      channelList: [], // 用于定义频道列表
      articleList: [], // 文章列表
      timetotime: [], // 时间选择
      searchForm: {
        status: '', // 文章状态
        channel_id: '', // 频道ID
        begin_pubdate: '', // 起始时间
        end_pubdata: '', // 结束时间
        page: 1, // 起始页
        per_page: 10, // 每页数目
        total_count: 0 // 文章总数目
      }
    }
  },
  components: {},
  methods: {
    getChannelList () {
      let pro = this.$html.get('/channels')
      pro
        .then(result => {
          console.log(result)
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message(new Error('获取频道错误') + err)
        })
    },
    getarticleList () {
      let searchData = {}
      for (var key in this.searchForm) {
        if (this.searchForm[key] !== '') {
          searchData[key] = this.searchForm[key]
        }
      }
      let pro = this.$html.get('/articles', { params: searchData })
      pro
        .then(result => {
          console.log(result)
          if (result.data.message === 'OK') {
            this.articleList = result.data.data.results
            this.tot_count = result.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message(new Error('获取文章列表错误') + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 15px;
}
</style>
