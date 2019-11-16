<template>
  <el-select v-model="chid" clearable placeholder="请选择">
    <el-option
    v-for="item in channelList"
    :key="item.id"
    :label="item.name"
    :value="item.id"></el-option>
  </el-select>
</template>

<script type="text/javascript">
export default {
  name: 'ChannelCom',
  props: {
    // 接收父给子传递的频道信息
    cid: {
      default: 0 // 设置默认值
    }
  },
  data () {
    return {
      channelList: [],
      chid: ''
    }
  },
  watch: {
    cid: function (newv, oldv) {
      this.chid = newv
    },
    chid: function (newv, oldv) {
      this.$emit('slt', this.chid)
    }
  },
  created () {
    this.getChannelList()
  },
  components: {},
  methods: {
    // 获取频道列表
    getChannelList () {
      let pro = this.$html.get('/channels')
      pro
        .then(result => {
          // console.log(result)
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message(new Error('获取频道错误') + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
