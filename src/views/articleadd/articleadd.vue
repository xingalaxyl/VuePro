<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发表文章</span>
    </div>
    <div class="text item">
      <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quill-editor v-model="addForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="addForm.cover.type">
            <!--注意：label是属性绑定，要求信息是整型的-->
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <channel-com @slt="selectHandler"></channel-com>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addarticle(false)">发布</el-button>
          <el-button @click="addarticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script type="text/javascript">
import ChannelCom from '@/components/channel.vue'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'ArticleAdd',
  data () {
    return {
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          {
            min: 5,
            max: 30,
            message: '标题介于5到30个字符之间'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      },

      addForm: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: ''
      }
      // addForm: {
      //   title: "", // 添加文章标题
      //   content: "", // 添加文章内容
      //   cover: {
      //     type: 0, // 封面类型 -1-自动 0-无图 1-1张 3-3张
      //     images: [] // 图片地址
      //   },
      //   channel_id: "" // 所属频道id
      // }
    }
  },
  components: {
    quillEditor,
    ChannelCom
  },
  methods: {
    selectHandler (id) {
      this.addForm.channel_id = id
    },
    // 添加文章
    addarticle (flag) {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          let pro = this.$html.post('/articles', this.addForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              this.$message.success('成功发布')
              this.$router.push('/article')
            })
            .catch(err => {
              return this.$message.err(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
</style>
