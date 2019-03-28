<template>
  <div id="login" v-loading="loading2" element-loading-text="正在登录中, 请稍后..." element-loading-background="rgba(0, 0, 0, 0.6)" customClass="loginL">
    <div ref="bannerbox" class="login-banner-box">
      <div ref="bannerWrap" class="clearfix" style="height:100%;position: relative;">
        <div class="banner fl">
          <img src="@/assets/img/banner1.png" alt="">
        </div>
        <!-- <div class="banner fl">
          <img src="../../src/assets/img/banner2.png" alt="">
        </div> -->
      </div>
    </div>
    <div class="login-open">
      <div class="login-welcome-left" :class="{'no-notice':!noticeData.length}">
        <div v-if="!noticeData.length" class="login-welcome">Welcome</div>
        <div v-if="noticeData.length" class="loagin-notice">
          <p class="notice-title">公告</p>
          <ul class="list">
            <li v-for="(item,index) in noticeData" :key="index">
              <i class="el-icon-bell" /><a @click="openNoticeDetails(item)">{{ item.noticeTitle }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="login-form">
        <div class="form-container">
          <div class="cornerClass">
            密码登录
            <div class="login-tip"><div class="poptip"><div class="poptip-arrow"><em /><span /></div><div class="poptip-content">扫码登录</div></div></div>
            <svg-icon icon-class="qcode" style="font-size:30px" class="whitec" />
          </div>
          <!-- <ul class="list clearfix">
            <li class="fl" :class="{'login-this-active':currentActive == 0}" @click="switchLoginState(0)">
              <el-radio v-model="single" label="sin" class="fz16">用户登录</el-radio>
            </li>
            <li class="fl" :class="{'login-this-active':currentActive == 1}" @click="switchLoginState(1)">
              <el-radio v-model="single" label="two" class="fz16">系统登录</el-radio>
            </li>
          </ul> -->
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                name="username"
                type="text"
                autocomplete="on"
                style="width:210px"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入密码"
                name="password"
                autocomplete="on"
                style="width:190px"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-form>
          <el-button :loading="loading" type="primary" class="fz16" style="width:260px" @keydown.enter="submitLogin" @click="submitLogin">
            登录
          </el-button>
          <!-- <form action="">
            <div class="login-form-domain" style="display:none;">
              <select>
                <option v-for="(key,index) in domainNameList" :key="index" :value="key">{{key}}</option>
              </select>
            </div>
            <div class="ps-form-item border-bottom">
              <div>
                <i class="iconfont icon-xingming mr5"></i>
                <input type="text" name="username" v-model="userName" @keydown.enter="submitLogin"
                  placeholder="请输入用户名" />
              </div>
            </div>
            <div class="ps-form-item border-bottom">
              <div>
                <i class="iconfont icon-mima mr5"></i>
                <input type="password" placeholder="请输入密码" v-model="passWord" @keydown.enter="submitLogin"
                  name="initialPassword" />
              </div>
            </div>
            <div class="ps-form-item">
              <a @click="resetPass= true">密码重置</a>
            </div>
            <div style="color:red" align="left" id="errorMsg"></div>
            <el-button type="primary" @keydown.enter="submitLogin" @click="submitLogin" class="fz16"
              style="width:260px">登录</el-button>
          </form> -->
        </div>
      </div>
    </div>
    <el-dialog
      title="密码重置"
      :visible.sync="resetPass"
      :close-on-click-modal="no"
      custom-class="accountManageDialog"
      top="15%"
      width="35%"
      @close="resetD(&quot;dform&quot;)"
    >
      <el-form ref="dform" :model="dform" :rules="ruled">
        <el-form-item label="登录帐号:" :label-width="formLabelWidth" prop="name" required>
          <el-input v-model="dform.name" placeholder="请输入帐号" :style="{width:inputLabelWidth}" />
        </el-form-item>
        <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="tenantDomain" required>
          <el-input v-model="dform.tenantDomain" placeholder="请输入邮箱" :style="{width:inputLabelWidth}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="forgetPass('dform')">确 定</el-button>
        <el-button @click="resetPass = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="model2"
      :title="noticeDataList.noticeTitle"
      top="10%"
      width="60%"
      custom-class="noticeTitle"
    >
      <!-- <p slot="header">
        <span style="font-size:18px">{{noticeDataList.noticeTitle}}</span>
      </p> -->
      <!-- <h4 class="ps-title">{{noticeDataList.noticeTitle}}</h4> -->
      <p class="ps-notice-content">{{ noticeDataList.noticeContent }}</p>
    </el-dialog>
    <!-- <psloading v-show="loadingState" :text="text"></psloading> -->
  </div>
</template>

<script>
import {
  httpAjax
} from '@/api/common'
  // import { validUsername } from '@/utils/validate'
  // import psloading from './loading'
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      btnLoading: false,
      loading2: false,
      text: '正在登录中, 请稍后...',
      noticeData: [],
      domainNameList: [],
      currentActive: 0,
      resetPass: false,
      userName: '',
      passWord: '',
      model2: false,
      noticeDataList: '',
      loadingState: false,
      single: 'sin',
      singleTwo: false,
      formLabelWidth: '110px',
      inputLabelWidth: '300px',
      no: false,
      dform: {
        name: '',
        tenantDomain: ''
      },
      ruled: {
        name: [{
          required: true,
          message: '请输入帐号',
          // validator: nan16,
          trigger: 'blur'
        }],
        tenantDomain: [{
          required: true,
          message: '请输入邮箱',
          // validator: nan32,
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getNoticeData()
    this.domainName()
  },
  mounted() {
    // this.bannerMove();
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    resetD() {
      this.dform = {
        name: '',
        tenantDomain: ''
      }
      this.$refs.dform.resetFields()
    },
    forgetPass(form) {
      this.$refs[form].validate((valid) => {
        const params = {
          ...this.dform
        }
        if (valid) {
          this.btnLoading = true
          httpAjax('/user/resetPassword', params).then(res => {
            this.resetPass = false
            this.btnLoading = false
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: '重置成功!'
              })
              // this.$alert('请在我的订单中查看审批结果!', '充值密码', {
              //   confirmButtonText: '确定',
              //   type: 'success',
              //   callback: action => {
              //     // this.multSelection = []
              //     this.getVmList()
              //   }
              // });
            } else {
              this.$message({
                type: 'error',
                message: res.resultDesc
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '请求无法访问!'
            })
            this.resetPass = false
            this.btnLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    bannerMove() {
      var main = this.$refs.bannerWrap
      var banner = main.children
      var timer = null
      var wd = document.documentElement.clientWidth
      main.style.width = 3 * wd + 'px'
      var num = 0
      for (var i = 0; i < banner.length; i++) {
        banner[i].style.width = wd + 'px'
      }
      var cloneNodes = banner[0].cloneNode(true)
      main.appendChild(cloneNodes)
      var count = 0
      var self = this

      function moveFn() {
        if (count == 3) {
          main.style.left = 0 + 'px'
          count = 1
        }
        $(main).stop(true).animate({
          'left': -count * wd + 'px'
        }, 4000)
      }
      timer = setInterval(function() {
        count++
        moveFn()
      }, 10000)
    },
    domainName() {
      const url = 'user/findDomainName'
      httpAjax(url).then((res) => {
        if (res.length) {
          this.domainNameList = res
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getNoticeData() {
      httpAjax(`notice/list`).then((res) => {
        this.noticeData = res.data
      }).catch((err) => {
        this.$notify.error({
          title: '公告模块',
          message: '网络出错,请刷新页面后再访问！'
        })
      })
    },
    switchLoginState(index) {
      this.currentActive = index
      if (index == 0) {
        this.single = 'sin'
      } else {
        this.single = 'two'
      }
      this.userName = ''
      this.passWord = ''
    },
    submitLogin() {
      this.userName = this.loginForm.username
      this.passWord = this.loginForm.password
      if (!this.userName || !this.passWord) {
        this.$message.warning('用户名密码不能为空')
        return
      }
      var params = {}
      var path = 'login'
      if (this.currentActive) {
        params.operatorAccount = this.userName
        params.password = this.passWord
      } else {
        path = 'domainLogin'
        if (!this.domainNameList.length) {
          this.$message.info('正在连接FA，请稍等!')
          return
        }
        params.name = this.userName
        params.initialPassword = this.passWord
        params.tenantDomain = this.domainNameList[0]
      }
      params.domainId = this.domainNameList[0]
      const url = `user/${path}`
      this.loading2 = true
      httpAjax(url, params).then((res) => {
        this.loading2 = false
        if (res.resultCode >= 0) {
          if (res.resultCode == 0) {
            // 用户
            this.$store.dispatch('setToKen', '2').then(() => {
              localStorage.setItem('role', 'user')
              localStorage.setItem('username', this.userName)
              localStorage.setItem('password', this.passWord)
              localStorage.setItem('domain', this.domainNameList[0])
              this.$router.push({
                path: '/myDesk'
              })
            })
          } else {
            this.$Message.error(res.resultDesc)
          }
        } else if (res.operatorAccount == 'admin') {
          //  系统管理员
          this.$store.dispatch('setToKen', '0').then(() => {
            localStorage.setItem('role', 'admin')
            localStorage.setItem('username', this.userName)
            localStorage.setItem('password', this.passWord)
            localStorage.setItem('domain', this.domainNameList[0])
            this.$router.push({
              path: '/adminOnline'
            })
          })
        } else { //  云管理员
          this.$store.dispatch('setToKen', '1').then(() => {
            localStorage.setItem('role', 'tenantAdmin')
            localStorage.setItem('username', this.userName)
            localStorage.setItem('password', this.passWord)
            localStorage.setItem('domain', this.domainNameList[0])
            this.$router.push({
              path: '/cloudOnline'
            })
          })
        }
        // clearInterval(timer)  // 关闭banner 定时器
      }).catch((err) => {
        this.loading2 = false
        console.log(err)
      })
    },
    openNoticeDetails(item) {
      this.model2 = true
      this.noticeDataList = item
    }
  }
  // components: {
  //   psloading
  // }
}

</script>
<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#013964;
  $light_gray:#cec6c6;
  $cursor: #fff;

  // @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  //   #login .el-input input{
  //     color: $cursor;
  //     // &::first-line {
  //     //   color: $light_gray;
  //     // }
  //   }
  // }

  /* reset element-ui css */
  #login {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $cursor;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }
</style>
<style>
  #login,
  .login-banner-box {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .banner {
    height: 100%;
  }
.el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: #013964;
      border-radius: 5px;
      color: white;
    }
  .notice-title {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 10px;
  }

  .login-open .list {
    font: 14px '微软雅黑';
  }

  .login-open .list li {
    width: 320px;
    margin: 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 30px;
    padding-left: 20px;
    white-space: nowrap;
  }
.svg-container {
    padding: 6px 6px 6px 15px;
    /* color: $dark_gray; */
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .login-open .list li a {
    padding-left: 5px;
    color: #fff;
  }

  .flexcenter {
    display: flex;
    align-items: center;
  }

  .fz16 {
    font-size: 16px;
  }

  .mr5 {
    margin-right: 5px;
  }

  .login-open {
    display: flex;
    width: 700px;
    height: 400px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: #fff;
  }

  .login-welcome-left {
    flex: 1;
    display: flex;
    font-size: 24px;
  }
.cornerClass{
  position: relative;
    height: 44px;
    width: 100%;
    margin: 0 auto 20px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content:space-between;
}
.whitec{
  position: relative;
}
.cornerClass::before{
 display:block;
    content:'';
    border-width:30px 30px 30px 30px;
    transform: rotate(45deg);
    border-style:solid;
    border-color:#003b67 transparent transparent transparent;
    position:absolute;
    left:188px;
    top:8px;
    z-index: 1;

}
.login-tip{
  position: absolute;
    top: 8px;
    right: 40px;
    display: block;
}
.poptip{
  line-height: 16px;
    position: relative;
    z-index: 1;
    border: 1px solid #ff9000;
    border-color: #00c1de;
    padding: 5px 10px;
}
/* .poptip-arrow{
  position: absolute;
    z-index: 10;
    top: 8px;
    right: -10px;
     border-width:10px 10px 10px 10px;
    transform: rotate(-90deg);
    border-style:solid;
    border-color:#00c1de transparent transparent transparent;
} */
.poptip-content{
  color: #00c1de;
    font-size: 12px;
    font-weight: 400;
    position:relative;
}
.poptip-content:before {
    content: '';
    position: absolute;
    top: 0px;
    right: -19px;
    width: 0;
    height: 0;
    border-right: 9px solid #00c1de;
    border-bottom: 9px solid transparent;
    border-top: 9px solid transparent;
    transform: rotate(180deg);
}
/*  上下透明，右边框为9px且在:before伪元素三角形的基础上，向右，下移动了1px  */
.poptip-content:after {
    content: '';
    position: absolute;
    top: 2px;
    right: -17px;
    width: 0;
    height: 0;
    border-bottom: 7px solid transparent;
    border-right: 7px solid #003b67;
    border-top: 7px solid transparent;
    transform: rotate(180deg);
}
  .login-form {
    flex: 1;
  }

  .loagin-notice {
    width: 100%;
  }

  .no-notice {
    align-items: center;
    justify-content: center;
  }

  .form-container {
    width: 260px;
    margin: 0 auto;
    margin-top: 32px;
  }

  .form-container .list li {
    width: 50%;
    padding: 5px 0px;
    text-align: center;
    color: #fff;
    border-bottom: 2px solid #fff;
  }

  .form-container a {
    color: #fff;
    display: block;
    width: 100%;
  }

  .login-form input {
    border-style: none;
    color: #fff;
    background: rgba(0, 0, 0, 0);
  }

  .login-form .ps-form-item {
    padding-bottom: 10px;
    padding-top: 25px;
  }

  .border-bottom {
    border-bottom: 1px solid #fff;
  }

  .login-this-active {
    border-bottom: 2px solid #2b85e4 !important;
  }

  .el-radio {
    color: #fff;
  }

  /* .login-open .ivu-btn-primary {
    width: 100%;
    margin-top: 10px;
  }

  .login-modal-main .ivu-input-wrapper {
    width: 70%;
  }

  .ps-btn-none .ivu-modal-header,
  .ps-btn-none .ivu-modal-body .ps-title {
    text-align: center;
  }

  .ps-small-width .ivu-modal-content {
    width: 100%;
    height: 160px;
  }

  .ps-big-width .ivu-modal-content {
    width: 100%;
    height: 500px;
  } */

  /* .ps-title {
    padding: 10px 0;
  } */

  .ps-notice-content {
    line-height: 30px;
    text-indent: 2em;
    min-height: 300px;
  }

  .loagin-notice .icon-announcement {
    font-size: 20px;
    display: inline-block;
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    vertical-align: -3px;
  }

  .loagin-notice a,
  .ps-title,
  .ps-notice-content {
    font-size: 15px;
  }

  /* .login-form .ivu-btn {
    padding: 8px 15px;
  } */

  .loagin-notice a:hover {
    text-decoration: underline;
  }

  #login .el-dialog__header {
    text-align: center;
  }

  .noticeTitle .el-dialog__title {
    font-weight: 600
  }

</style>
