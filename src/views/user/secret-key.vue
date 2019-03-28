<template>
  <div class="v-form-input">
    <div class="from-box-main">
      <div class="box">
        <h3>设置秘钥</h3>
        <el-form ref="params" :model="params" :rules="rules2" label-position="left">
          <el-form-item label="秘钥:" :label-width="formLabelWidth" prop="secretKey">
            <el-input
              v-model="params.secretKey"
              style="width:180px;"
              type="text"
              placeholder="请输入秘钥"
              :style="{width:inputLabelWidth}"
            />
          </el-form-item>
          <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="email">
            <el-input
              v-model="params.email"
              style="width:180px;"
              type="email"
              placeholder="请输入接收随机密码的邮箱"
              :style="{width:inputLabelWidth}"
            />
          </el-form-item>
          <br>
          <el-form-item label="" :label-width="formLabelWidth" prop="name">
            <el-button type="primary" :loading="btnLoading" @click="serviceConfirm">保 存</el-button>
            <el-button @click="reset">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  httpAjax,
  addTableScrollBar
} from '@/api/common'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      const myreg1 = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (value == '') {
        callback('请输入手机号')
      } else if (!myreg1.test(value)) {
        callback('请输入正确的邮箱地址')
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      params: {
        secretKey: '',
        email: ''
      },
      inputLabelWidth: '300px',
      formLabelWidth: '110px',
      rules2: {
        secretKey: [{
          // validator: validatePass,
          required: true,
          message: '请输入秘钥',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          validator: validatePass,
          // message: '请输入新密码',
          trigger: 'blur'
        }]
      }

    }
  },
  mounted() {},

  methods: {
    reset() {
      this.params = {
        secretKey: '',
        email: ''
      }
      this.$refs['params'].resetFields()
    },
    serviceConfirm() {
      this.$refs['params'].validate((valid) => {
        const params = {
          ...this.params
        }
        if (valid) {
          this.btnLoading = true
          httpAjax('/user/saveSecretKey', params).then(res => {
            //   if (res.ResultCode == 0) {
            this.btnLoading = false
            this.$message({
              type: 'success',
              message: '秘钥设置成功!'
            })
            this.reset()
            //   } else {
            //     this.$message({
            //       type: 'error',
            //       message: res.resultDesc
            //     });
            //   }
          }).catch(() => {
            this.btnLoading = false

            this.$message({
              type: 'error',
              message: '通讯错误!'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>
