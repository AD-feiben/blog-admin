<template lang="html">
  <div id="editor">
    <div class="forms">
      <el-form label-width="80px" :model="article" :rules="rules1" ref="article1" @submit.native.prevent>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="article.title"
            placeholder="标题"
            clearable></el-input>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <tag v-model="article.tags"></tag>
        </el-form-item>
      </el-form>

      <el-form label-width="80px" :model="article" :rules="rules2" ref="article2">
        <el-form-item label="分类" prop="classify">
          <el-autocomplete
            style="width: 100%;"
            v-model="article.classify"
            placeholder="分类"
            :fetch-suggestions="queryClassify"></el-autocomplete>
        </el-form-item>

        <el-form-item label="封面图" prop="cover">
          <el-input
            v-model="article.cover"
            placeholder="封面图（请填写图片地址）"
            clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="editor-container">
      <el-form label-width="80px" :model="article" :rules="rules3" ref="article3" class="editor">
        <el-form-item label="正文" prop="content">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            resize="none"
            v-model="article.content">
            </el-input>
        </el-form-item>
      </el-form>
      <div class="preview" v-html="htmlContent" ref="preview"></div>
    </div>
    <div class="buttons">
      <el-button type="success" size="small" @click="saveArticle(0)" v-if="!id">存草稿</el-button>
      <el-button type="primary" size="small" @click="saveArticle(1)">{{saveText}}</el-button>
      <el-button type="danger" size="small" @click="deleteArticle" v-if="id">删除</el-button>
    </div>
  </div>
</template>

<script>
import Tag from '@/components/Tag'
import marked from 'marked'
import highlight from 'highlight.js'
export default {
  components: {
    Tag
  },
  watch: {
    $route: function (val) {
      if (!val.query.id) this.resetArticle()
    }
  },
  computed: {
    htmlContent: function () {
      marked.setOptions({
        highlight: function (code) {
          return highlight.highlightAuto(code).value
        }
      })
      return marked(this.article.content, { sanitize: true })
    },
    saveText: function () {
      return this.id ? '修改' : '发布'
    }
  },
  data () {
    var checkTitle = (rule, value, cb) => {
      let title = this.article.title
      if (!title) {
        cb(new Error('请输入文章标题'))
      } else if (title.length < 5 || title.length > 20) {
        cb(new Error('标题长度在 5 到 20 个字符'))
      } else {
        cb()
      }
    }
    var checkTags = (rule, value, cb) => {
      setTimeout(() => {
        if (!this.article.tags) {
          cb(new Error('请添加文章标签'))
        } else {
          cb()
        }
      }, 0)
    }
    var checkCover = (rule, value, cb) => {
      let reg = /^https?:\/\/.+|^$/gi
      if (reg.test(this.article.cover)) {
        cb()
      } else {
        cb(new Error('请输入正确的图片地址'))
      }
    }
    return {
      id: '', // 文章id
      classify: [], // 所有分类
      article: {
        title: '', // 标题
        tags: '', // 标签
        classify: '', // 分类
        cover: '', // 封面图
        state: 0,
        content: '' // markdown 文本
      },
      rules1: {
        title: [
          { required: true, validator: checkTitle, trigger: 'blur' }
        ],
        tags: [
          { required: true, validator: checkTags, trigger: 'blur' }
        ]
      },
      rules2: {
        classify: [
          { required: true, message: '请添加文章标签', trigger: 'blur' }
        ],
        cover: [
          { validator: checkCover, trigger: 'blur' }
        ]
      },
      rules3: {
        content: [
          { required: true, message: '请输入正文', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 分类建议
    queryClassify (queryString, cb) {
      let classify = this.classify
      let results = queryString ? classify.filter(this.createStateFilter(queryString)) : classify
      cb(results)
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    resetArticle () {
      this.article = {
        title: '', // 标题
        tags: '', // 标签
        classify: '', // 分类
        cover: '', // 封面图
        state: 0,
        content: '' // markdown 文本
      }
      this.id = ''
      this.$router.replace('/editor')
    },
    deleteArticle () {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '', {type: 'warning'}).then(() => {
        this.$axiosPosting(this.$api.deleteArticle, {id: this.id}).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.resetArticle()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    saveArticle (state) {
      let valid1 = false
      let valid2 = false
      let valid3 = false
      this.$refs.article1.validate(valid => {
        valid1 = valid
      })
      this.$refs.article2.validate(valid => {
        valid2 = valid
      })
      this.$refs.article3.validate(valid => {
        valid3 = valid
      })
      setTimeout(() => {
        if (valid1 && valid2 && valid3) {
          this.$confirm(`是否${state ? this.saveText : '存草稿'}?`).then(() => {
            let req = this.article
            req.desc = this.$refs.preview.innerText.substr(0, 50)
            req.state = state
            req.id = this.id
            this.$axiosPosting(this.$api.saveArticle, req).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.resetArticle()
              } else {
                this.$message.error(res.message)
              }
            })
          })
        }
      }, 0)
    },
    getClassify () {
      this.$axiosGeting(this.$api.classify).then(res => {
        if (res.code === 200) {
          let classify = res.data.classify
          let classifyArr = []
          classify.forEach(item => {
            classifyArr.push({value: item})
          })
          this.classify = classifyArr
        }
      })
    }
  },
  created () {
    this.getClassify()
    this.id = this.$route.query.id || ''
    if (this.id) {
      this.$axiosGet(`${this.$api.article}/${this.id}`).then(res => {
        if (res.code === 200) {
          this.article.title = res.data.title || ''
          this.article.tags = res.data.tags || ''
          this.article.classify = res.data.classify || ''
          this.article.cover = res.data.cover || ''
          this.article.state = res.data.state || ''
          this.article.content = res.data.content || ''
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less">
  @import '../styles/var.less';
  #editor{
    .forms{
      display: flex;
      .el-form{
        flex: 1;
      }
    }
    .el-input__inner{
      height: 30px;
    }
    .el-form-item.is-error .el-button{
      border-color: #f56c6c;
    }
    .editor-container{
      display: flex;
      width: 100%;
      height: 65vh;
      background: #fff;
      &>div,.editor{
        flex: 1;
      }
      .el-form-item,.el-form-item__content,.el-textarea, textarea{
        height: 100%;
        line-height: initial;
        vertical-align: initial;
      }
      .preview{
        height: 100%;
        padding: 5px 15px;
        margin-left: 5px;
        overflow: auto;
        box-shadow: 0 0 1px @baseColor;
        border-radius: 3px;
        word-break: break-all;
        font-size: 16px;
        li{display:list-item}
        head{display:none}
        table{
          display:table;
          width: 100%;
          margin-bottom: 20px;
          border: 1px solid #d9d9d9;
          border-collapse: collapse;
          border-left: none;
          word-break: normal;
        }
        tr{
          display:table-row;
          &:nth-of-type(2n){
            background-color: #f8f8f8;
          }
        }
        thead{
          display: table-header-group;
          vertical-align: middle;
          border-color: inherit;
        }
        tbody{display:table-row-group}
        tfoot{display:table-footer-group}
        col{display:table-column}
        colgroup{display:table-column-group}
        td,th{
          display:table-cell;
          padding: 8px;
          border: 1px solid #d9d9d9;
          line-height: 20px;
        }
        caption{display:table-caption}
        th{font-weight:bolder; text-align:center}
        caption{text-align:center}
        body{line-height:1.12}
        h1{font-size:2em; margin:.67em 0}
        h2{font-size:1.5em; margin:.75em 0}
        h3{font-size:1.17em; margin:.83em 0}
        h4,p,blockquote,ul,fieldset,form,ol,dl,dir,menu{margin:1.12em 0}
        blockquote{
          color: #666;
          border-left: 4px solid #ddd;
          padding-left: 20px;
          margin-left: 0;
          font-size: .875em;
          p{
            margin: 0;
            font-style: italic;
          }
        }
        img{
          max-width: 100%;
          width: auto;
          height: auto;
          vertical-align: middle;
          border: 0;
        }
        h5{font-size:.83em; margin:1.5em 0}
        h6{font-size:.75em; margin:1.67em 0}
        h1,h2,h3,h4,h5,h6,b,strong{font-weight:bolder}
        i,cite,em,var,address{font-style:italic}
        pre,code{
          color: #abb2bf;
          background: #292c33;
          overflow-x: scroll;
        }
        // pre,tt,code,kbd,samp{font-family:monospace}
        pre{white-space:pre; padding: 5px;}
        button,textarea,input,object,select{display:inline-block;}
        big{font-size:1.17em}
        small,sub,sup{font-size:.83em}
        sub{vertical-align:sub}
        sup{vertical-align:super}
        table{border-spacing:2px;}
        thead,tbody,tfoot{vertical-align:middle}
        td,th{vertical-align:inherit}
        s,strike,del{text-decoration:line-through}
        hr{
          margin: 0 0 20px;
          border: 0;
          border-top: 1px solid #d9d9d9!important;
        }
        ol,ul,dir,menu,dd{margin-left:40px}
        ol{
          li{list-style-type:decimal}
        }
        ul{
          li{list-style-type: disc}
        }
        ol ul,ul ol,ul ul,ol ol{margin-top:0; margin-bottom:0}
        u,ins{text-decoration:underline}
        :before,:after{white-space:pre-line}
        center{text-align:center}
        abbr,acronym{font-variant:small-caps; letter-spacing:0.1em}
        :link,:visited{text-decoration:underline}
        :focus{outline:thin dotted invert}
        @media print{
          h1{page-break-before:always}
          h1,h2,h3,
          h4,h5,h6{page-break-after:avoid}
          ul,ol,dl{page-break-before:avoid}
        }
      }
    }
    .buttons{
      margin-top: 10px;
      text-align: right;
    }
  }
</style>
