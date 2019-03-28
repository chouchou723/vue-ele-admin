<template>
  <div class="v-form-input">
    <div class="from-box-main">
      <div class="box">
        <h3>修改密码</h3>
        <el-form ref="params" :model="params" :rules="rules2" label-position="left">
          <el-form-item label="原密码:" :label-width="formLabelWidth" prop="initialPassword">
            <el-input v-model="params.initialPassword" style="width:180px;" type="password" placeholder="请输入原密码" :style="{width:inputLabelWidth}" />
          </el-form-item>
          <el-form-item label="新密码:" :label-width="formLabelWidth" prop="newPwd">
            <el-input v-model="params.newPwd" style="width:180px;" type="password" placeholder="请输入新密码" :style="{width:inputLabelWidth}" />
          </el-form-item>
          <el-form-item label="确认新密码:" :label-width="formLabelWidth" prop="newPwdConfirm">
            <el-input v-model="params.newPwdConfirm" style="width:180px;" type="password" placeholder="请确认新密码" :style="{width:inputLabelWidth}" />
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
      if (value.length < 6) {
        callback(new Error('请输入至少6位'))
      } else {
        //   var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{6,30}');
        //   if (!regex.test(value)) {
        //     callback(new Error('密码中必须包含字母、数字，至少6个字符，最多30个字符'));
        //   }
        //   if (this.ruleForm2.checkPass !== '') {
        //     this.$refs.ruleForm2.validateField('checkPass');
        //   }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.params.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      params: {
        initialPassword: '',
        newPwd: '',
        newPwdConfirm: ''
      },
      inputLabelWidth: '300px',
      formLabelWidth: '110px',
      rules2: {
        initialPassword: [{
          // validator: validatePass,
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }],
        newPwd: [{
          required: true,
          validator: validatePass,
          // message: '请输入新密码',
          trigger: 'blur'
        }],
        newPwdConfirm: [{
          required: true,
          validator: validatePass2,
          trigger: 'blur'
        }]
      }

    }
  },
  mounted() {},

  methods: {
    reset() {
      this.params = {
        initialPassword: '',
        newPwd: '',
        newPwdConfirm: ''
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
          httpAjax('/user/changePwd', params).then(res => {
            this.btnLoading = false
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: '密码修改成功!'
              })
              this.reset()
            } else {
              this.$message({
                type: 'error',
                message: res.resultDesc
              })
            }
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
