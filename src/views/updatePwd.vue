<template lang="html">
  <div id="updatePwd">
    <el-form label-width="120px" @submit.native.prevent :model="user" :rules="rules" ref="user">
      <el-form-item label="旧密码：" prop="pwd">
        <el-input
          size="small"
          placeholder="请输入旧密码"
          v-model="user.pwd"
          clearable
          type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPwd">
        <el-input
          size="small"
          placeholder="请输入新密码"
          v-model="user.newPwd"
          clearable
          type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="reNewPwd">
        <el-input
          size="small"
          placeholder="请输入确认密码"
          v-model="user.reNewPwd"
          clearable
          type="password"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button size="small" type="primary" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  data () {
    const newPwd = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('请输入新密码'))
      } else {
        if (this.user.reNewPwd !== '') {
          this.$refs.user.validateField('reNewPwd')
        }
        cb()
      }
    }
    const reNewPwd = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('请输入确认密码'))
      } else if (value !== this.user.newPwd) {
        cb(new Error('两次密码不一致！'))
      } else {
        cb()
      }
    }
    return {
      user: {
        pwd: '', // 旧密码
        newPwd: '', // 新密码
        reNewPwd: '' // 确认密码
      },
      rules: {
        pwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPwd: [{ required: true, validator: newPwd, trigger: 'blur' }],
        reNewPwd: [{ required: true, validator: reNewPwd, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.user.validate(valid => {
        if (valid) {
          this.$confirm('是否确定修改密码?').then(() => {
            let req = {
              token: window.sessionStorage.getItem('token') || '',
              pwd: this.user.pwd,
              newPwd: this.user.newPwd
            }
            this.$axiosPosting(this.$api.updatePwd, req).then(res => {
              this.$message({
                message: res.message,
                type: res.code === 200 ? 'success' : 'error'
              })
              if (res.code === 200) {
                window.sessionStorage.setItem('token', '')
                this.$router.replace('/login')
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
  #updatePwd{
    width: 400px;
  }
</style>
