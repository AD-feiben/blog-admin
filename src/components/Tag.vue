<template lang="html">
  <div id="tag">
    <el-tag
      v-for="(tag, index) in t_tags"
      :key="tag"
      closable
      @close="handleClose(index)">
      {{tag}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      placeholder="标签"
      ref="saveTagInput"
      size="small"
      :disabled="forbidAdd"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"></el-input>
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      :disabled="forbidAdd"
      @click="showInput">添加标签</el-button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    t_tags: function (newVal) {
      this.forbidAdd = newVal.length === 3
      this.$emit('input', newVal.join(','))
    },
    value: function (val) {
      this.t_tags = val ? val.split(',') : []
    }
  },
  data () {
    return {
      t_tags: this.value ? this.value.split(',') : [],
      inputVisible: false,
      inputValue: '',
      forbidAdd: false
    }
  },
  methods: {
    handleClose (index) {
      this.t_tags.splice(index, 1)
    },
    handleInputConfirm () {
      if (this.inputValue) {
        this.t_tags.push(this.inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="less">
  #tag{
    .el-tag {
      margin-right: 10px;
    }
    .button-new-tag {
      width: 90px;
      height: 30px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      vertical-align: bottom;
    }
  }
</style>
