<template lang="html">
  <div id="login" class="clear-fix">
    <div class="logo-wrap">
      <logo></logo>
    </div>
    <div class="login-form">
      <el-form
        :model="user"
        @submit.native.prevent
        label-width="80px"
        label-position="left"
        ref="user" :rules="rulesUser">

        <el-form-item label="用户名：" prop="account">
          <el-input
            size="small"
            v-model="user.account"
            placeholder="请输入用户名">
          </el-input>
        </el-form-item>

        <el-form-item label="密码：" prop="pwd">
          <el-input
            size="small"
            v-model="user.pwd"
            placeholder="请输入密码"
            type="password" @keyup.native.enter="login">
          </el-input>
        </el-form-item>
        <el-button
          @click="login"
          type="primary"
          size="small"
          style="width: 100%;">登录</el-button>

        <p class="register" @click="register">注册</p>
      </el-form>
    </div>

    <el-dialog :title="dialogTitle" :visible="showDialog" :show-close="false">

      <el-form
        :model="newUser"
        label-width="100px"
        label-position="left"
        ref="newUser"
        :rules="rulesNewUser" @submit.native.prevent>

        <el-form-item label="用户名：" prop="account">
          <el-input
            v-model="newUser.account"
            size="small"
            placeholder="请输入用户名">
          </el-input>
        </el-form-item>

        <el-form-item label="密码：" prop="pwd">
          <el-input
            v-model="newUser.pwd"
            size="small"
            placeholder="请输入密码"
            :disabled="forbidPwd"
            type="password">
          </el-input>
        </el-form-item>

        <el-form-item label="确认密码：" prop="repwd">
          <el-input
            v-model="newUser.repwd"
            size="small"
            placeholder="请输入确认密码"
            :disabled="forbidPwd"
            type="password" @keyup.native.enter="registerUser">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="registerUser" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <div id="bg" ref="bg">
      <i
        class="fas"
        v-for="(item, index) in icons"
        :key="index"
        :class="item"
        :data-depth="(Math.random() * Math.random() * 5 + 0.5) * direction()"
        ref="icon"></i>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo'
import Parallax from 'parallax-js'
export default {
  components: {
    Logo
  },
  data () {
    const pwd = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('请输入密码'))
      } else {
        if (this.newUser.repwd !== '') {
          this.$refs.newUser.validateField('repwd')
        }
        cb()
      }
    }
    const repwd = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('请输入确认密码'))
      } else if (value !== this.newUser.pwd) {
        cb(new Error('两次密码不一致！'))
      } else {
        cb()
      }
    }
    return {
      dialogTitle: '注册',
      forbidPwd: false, // 禁止输入密码
      icons: [
        'fa-book',
        'fa-file-code',
        'fa-keyboard',
        'fa-paper-plane',
        'fa-folder',
        'fa-star',
        'fa-gem',
        'fa-heart',
        'fa-rocket',
        'fa-fire',
        'fa-graduation-cap',
        'fa-cloud',
        'fa-leaf',
        'fa-recycle'
      ],
      showDialog: false, // 显示注册弹窗
      newUser: {
        account: '', // 账号
        pwd: '', // 密码
        repwd: '' // 确认密码
      },
      rulesNewUser: {
        account: [{required: true, message: '请输入用户名', tigger: 'blur'}],
        pwd: [{required: true, validator: pwd, tigger: 'blur'}],
        repwd: [{required: true, validator: repwd, tigger: 'blur'}]
      },
      user: {
        account: '',
        pwd: ''
      },
      rulesUser: {
        account: [{required: true, message: '请输入用户名', tigger: 'blur'}],
        pwd: [{required: true, message: '请输入密码', tigger: 'blur'}]
      }
    }
  },
  methods: {
    direction () {
      return Math.random() > 0.5 ? 1 : -1
    },
    random () {
      return Math.random() * 700
    },
    login () {
      this.$refs.user.validate(valid => {
        if (valid) {
          this.$axiosPosting(this.$api.login, this.user).then((res) => {
            if (res.code === 200) {
              window.sessionStorage.setItem('token', res.data.token)
              window.sessionStorage.setItem('role', res.data.role)
              this.$router.replace('/')
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    register () {
      this.$axiosGeting(this.$api.user).then(res => {
        if (res.code === 200) {
          this.forbidPwd = false
          this.showDialog = true // 允许注册管理员账号
        } else if (res.code === 201) { // 可以注册普通账号
          this.dialogTitle = '注册，密码为666666'
          this.showDialog = true
          this.newUser.pwd = 666666
          this.newUser.repwd = 666666
          this.forbidPwd = true
        } else {
          this.$message({
            message: `已存在体验账号，账号：${res.data.account}，密码：666666`,
            type: 'info'
          })
        }
      })
    },
    registerUser () {
      this.$refs.newUser.validate(valid => {
        if (valid) {
          let req = {
            account: this.newUser.account,
            pwd: this.newUser.pwd
          }
          this.$axiosPosting(this.$api.register, req).then(res => {
            this.$message({message: res.message, type: res.code === 200 ? 'success' : 'error'})
            this.showDialog = false
            this.$refs.newUser.resetFields()
          })
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      /* eslint-disable no-new */
      new Parallax(this.$refs.bg)
      let icons = this.$refs.icon
      for (let i in icons) {
        icons[i].style.display = 'inline-block'
        icons[i].style.top = this.random() + 'px'
        icons[i].style.left = this.random() + 'px'
      }
    })
  }
}
</script>

<style lang="less">
  @import '../styles/var.less';
  #login{
    position: relative;
    height: 100vh;
    .login-form{
      margin-top: 80px;
      padding: 80px 50px;
      width: 400px;
      float: right;
      border-radius: 5px;
    }
    .el-dialog{
      width: 40%;
    }
    .el-dialog__body{
      padding: 30px 80px;
    }
    .register{
      margin: 10px 0;
      text-align: right;
      font-size: 14px;
      color: #606266;
      cursor: pointer;
    }
    #bg{
      position: absolute;
      top: 100px;
      right: 0;
      bottom: 100px;
      left: 300px;
      z-index: -1;
      i{
        position: absolute;
        font-size: 24px;
        color: @baseColor;
      }
    }
  }
</style>
