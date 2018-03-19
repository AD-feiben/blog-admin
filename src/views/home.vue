<template lang="html">
  <div id="home">
    <el-container style="height: 80px;">
      <el-header style="height: 80px;">
        <logo></logo>
      </el-header>
    </el-container>
    <el-container style="height: calc(100% - 80px);">
      <el-aside :style="{width: showRightArrow ? '0px' : '240px'}" ref="aside">
        <el-menu
        :default-active="defaultActive">
          <el-submenu v-for="(item, index) in menu" :index="`${index}`" :key="index">
            <template slot="title">{{item.title}}</template>
            <el-menu-item
              v-for="(subItem, subIndex) in item.subMenu"
              :index="subItem.path"
              :key="subIndex"
              @click="$router.push(subItem.path);clickMain()">
              {{subItem.title}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main @click.native="clickMain">
        <router-view></router-view>
        <div class="drop-menu" @click.stop="changeSideWidth">
          <i class="fas fa-arrow-right"
            :style="{transform: `rotate(${showRightArrow ? 0 : -180}deg)`}"></i>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Logo from '@/components/Logo'
export default {
  components: {
    Logo
  },
  watch: {
    $route: function (newVal) {
      this.defaultActive = newVal.path
    }
  },
  data () {
    return {
      showRightArrow: false,
      defaultActive: '',
      menu: [
        {
          title: '文章管理',
          subMenu: [
            {
              title: '文章列表',
              path: '/articleList'
            },
            {
              title: '编辑器',
              path: '/editor'
            }
          ]
        }
      ]
    }
  },
  methods: {
    changeSideWidth () {
      this.showRightArrow = !this.showRightArrow
    },
    clickMain () {
      if (document.body.clientWidth <= 900) {
        this.showRightArrow = true
      }
    }
  },
  mounted () {
    this.defaultActive = this.$route.path
    this.showRightArrow = document.body.clientWidth <= 900
    window.onresize = () => {
      setTimeout(() => {
        this.showRightArrow = document.body.clientWidth <= 900
      }, 500)
    }
  }
}
</script>

<style lang="less">
  @import '../styles/var.less';
  #home{
    height: 100vh;
    .el-aside{
      transition: width .5s;
    }
    .el-menu{
      height: 100%;
    }
    .el-main{
      position: relative;
    }
    .drop-menu{
      position: absolute;
      bottom: 10px;
      left: 3px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      font-size: 12px;
      box-shadow: 0 0 2px @baseColor;
      cursor: pointer;
      z-index: 100;
    }
    .fa-arrow-right{
      transition: transform .3s;
    }
  }
</style>
