<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div>
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态:">
            <el-radio-group v-model="searchForm.status" @change="getarticleList()">
              <el-radio label>全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
              <el-radio label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表:">
            <el-select v-model="searchForm.channel_id" clearable placeholder="请选择" @change="getarticleList()">
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
            <img
              :src="stData.row.cover.images[0]"
              slot-scope="stData"
              width="150"
              height="100"
              alt="..."
            />
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
            <template slot-scope="stData">
              <el-button type="primary" size="mini">修改</el-button>
              <el-button type="danger" size="mini" @click="del(stData.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" id="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchForm.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="searchForm.per_page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tot_count"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'ArticleList', // 组件名称
  created () {
    this.getChannelList() // 调用获取频道信息
    this.getarticleList() // 调用获取文章信息
  },
  // 定义监听器
  watch: {
    timetotime: function (val, oldVal) {
      if (val) {
        this.searchForm.begin_pubdate = val[0]
        this.searchForm.end_pubdate = val[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
      this.getarticleList()
    }
    // searchForm: {
    //   handler: function (val, oldVal) {
    //     this.getarticleList()
    //   },
    //   deep: true
    // }
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
        end_pubdate: '', // 结束时间
        page: 1, // 起始页
        per_page: 10 // 每页数目
      }
    }
  },
  components: {},
  methods: {
    // 获取频道列表
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
    // 获取文章列表
    getarticleList () {
      let searchData = {}
      for (var key in this.searchForm) {
        if (this.searchForm[key]) {
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
    },
    handleSizeChange (val) {
      this.searchForm.per_page = val
      this.getarticleList()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.getarticleList()
    },

    // 删除文章
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let pro = this.$html.delete(`articles/${id}`)
        pro
          .then(result => {
            // console.log(result)
            this.getarticleList()
          })
          .catch(err => {
            return this.$message(new Error('删除文章错误') + err)
          })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 15px;

  #block {
    margin-top: 15px;
    text-align: center;
  }
}
</style>
