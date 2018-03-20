<template lang="html">
  <div id="articleList">
    <div class="search-wrapper">
      <el-form inline style="text-align: right" @submit.native.prevent>
        <el-form-item>
          <el-input
            prefix-icon="el-icon-search"
            v-model="keyword"
            placeholder="请输入标题、分类、标签搜索"
            size="small"
            style="width: 220px;"
            clearable
            @clear="clearKeyword"
            @keyup.native.enter="getData">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="getData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <el-table
        :data="articles"
        stripe>
        <el-table-column
          prop="publishedDate"
          width="150"
          sortable
          label="发布日期">
          <template slot-scope="scope">
            <span>{{scope.row.publishedDate ? scope.row.publishedDate.substr(0, 16) : ''}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="title"
          label="标题">
          <template slot-scope="scope">
            <router-link
              class="ellipsis"
              :to="{ path: '/editor', query: {id: scope.row._id}}"
              :title="scope.row.title">
              {{scope.row.title}}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column
          prop="classify"
          label="分类">
          <template slot-scope="scope">
            <p class="ellipsis" :title="scope.row.classify">
              <i class="fas fa-folder"></i>
              <span>{{scope.row.classify}}</span>
            </p>
          </template>
        </el-table-column>

        <el-table-column
          prop="tags"
          width="280"
          label="标签">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.tags"
              v-for="(item, index) in scope.row.tags.split(',')"
              :key="index"
              size="small">
              {{item}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="readingQuantity"
          sortable
          label="阅读量">
        </el-table-column>

        <el-table-column
          prop="state"
          sortable
          label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state ? '' : 'warning'" size="small">{{states[scope.row.state]}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="state"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.state ? 'danger' : 'primary'"
              size="small"
              @click="changeState(scope.row)">{{buttonTexts[scope.row.state]}}</el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteArticle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      states: ['草稿', '已发布'],
      buttonTexts: ['发布', '撤回'],
      articles: [],
      currentPage: 1,
      pageSize: 10,
      total: 1,
      keyword: ''
    }
  },
  methods: {
    changeState (article) {
      this.$confirm(`是否${this.buttonTexts[article.state]}该文章?`).then(() => {
        let req = {
          id: article._id,
          state: article.state ? 0 : 1
        }
        this.$axiosPosting(this.$api.setState, req).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    deleteArticle (article) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '', {type: 'warning'}).then(() => {
        this.$axiosPosting(this.$api.deleteArticle, {id: article._id}).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    handleCurrentChange (page) {
      this.currentPage = page
      this.getData()
    },
    clearKeyword () {
      this.keyword = ''
      this.getData()
    },
    getData () {
      let req = {
        keyword: this.keyword,
        page: this.currentPage
      }
      this.$router.replace({path: '/articleList', query: {...req}})
      this.$axiosGeting(this.$api.article, req).then(res => {
        if (res.code === 200) {
          this.articles = res.data.articles
          this.total = res.data.total
        } else {
          this.$message({message: res.message, type: 'error'})
        }
      })
    }
  },
  created () {
    this.keyword = this.$route.query.keyword || ''
    this.page = +this.$route.query.page || 1
    this.getData()
  }
}
</script>

<style lang="less">
  @import '../styles/var.less';
  #articleList{
    .ellipsis{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    a{
      color: @baseColor;
      &:hover{
        text-decoration: underline;
      }
    }
    .table-wrapper{
      width: 100%;
      overflow: auto;
      .el-table{
        min-width: 900px;
      }
    }
    .el-tag{
      &+.el-tag{
        margin-left: 5px;
      }
    }
    .pagination-wrapper{
      padding-top: 50px;
      text-align: right;
    }
  }
</style>
