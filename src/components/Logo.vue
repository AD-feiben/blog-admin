<template lang="html">
  <div id="logo">
    <router-link to="/">
      <img :src="logoSrc" alt="logo">
      <h1>Feiben's blog</h1>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      logoSrc: require('@/images/logo.png')
    }
  }
}
</script>

<style lang="less">
  @import '../styles/var.less';
  #logo{
    display: inline-block;
    height: 80px;
    line-height: 40px;
    padding: 20px 0;
    img{
      width: auto;
      height: 100%;
      margin-right: 5px;
    }
    h1{
      display: inline-block;
      font-family: Snell Roundhand, cursive;
      color: @baseColor;
    }
  }
</style>
