<template>
  <div id="desktop-apply" v-loading.fullscreen="loadingState" element-loading-text="正在提交 , 请稍后...">
    <div class="search-wrap">
      <el-input v-model="name" placeholder="请输入名称" style="width:185px;" clearable @clear="searchData" />
      <el-button icon="el-icon-search" circle @click="searchData" />
      <!-- <span class="hint">请点击以下桌面进行申请</span> -->
      <!-- <span class="fr">
        <span><i class="iconfont icon-liebiao" :style="{color:displayType==='one'?'rgb(64, 158, 255)':''}" @click="changeType(1)"></i></span>
        <span><i class="iconfont icon-liebiao1" :style="{color:displayType==='mul'?'rgb(64, 158, 255)':''}" @click="changeType(12)"></i></span>
      </span> -->
    </div>
    <div class="user-commodity-list-main">
      <ul id="commodity-main" class="list">
        <!-- <li class="pcItem" @click="applyDesktop(item)" v-for="(item,index) in commodityData" :key="index" >
          <div class="pcName" :title="item.name">模板名称 : <span>{{item.name}}</span></div>
          <div class="pcContent">
            <div style="padding:10px 5px;display:flex;justify-content:space-between;">
             <span  style="margin-right:10px">CPU:{{item.cpu}}核</span>
            <span  style="margin-right:10px">内存:{{item.memory }}G</span>
            <span  class="pcMemo">磁盘:{{item.disk }}G</span>
            </div>
            <span style="padding:0 5px 10px;">IP分配方式：{{item.ipDistri}}</span>
            <span   style="padding:0 5px 10px;">子网掩码：{{item.subnetMask||'0.0.0.0'}}</span>
            <span  style="padding:0 5px 10px;">网关：{{item.gateway||'0.0.0.0'}}</span>
            <span style="padding:0 5px 10px;">DNS服务器：{{item.dnsServer||'0.0.0.0'}}</span>
          </div>
          <div class="openIcon"></div>
           <el-tooltip class="tag" effect="dark" :content="item.description?item.description:'暂无'" placement="bottom-start">
      <i class="el-icon-info"></i>
    </el-tooltip> -->
        <!-- <div class="tag"><i class="el-icon-info"></i></div> -->
        <!-- <img src="../../../static/img/pc.svg" alt="" width="500"> -->
        <!-- </li> -->
        <!-- <li>
          <img src="../../../static/img/pc2.svg" alt="" width="500">
        </li> -->
        <li v-for="(item,index) in commodityData" :key="index" class="li-item" :style="{flex:displayType==='one'?'0 0 100%':'0 0 32%',minHeight:displayType==='one'?'':'300px'}" @click="applyDesktop(item)">
          <div class="title">
            <img src="../../assets/img/Linux.png" alt="">
            <div>
              <p class="client-name">模板名称 : <span>{{ item.name }}</span></p>
              <p class="tenant-name">云管理员 : <span>{{ item.operatorAccount }}</span></p>
            </div>
          </div>
          <div v-show="showcontent" class="modalDes" :style="{borderBottom: displayType==='one'?'none':'1.5px solid #3081ff'}">
            <span v-if="item.cpu" class="ed">CPU:{{ item.cpu }}核</span>
            <span v-if="item.memory" class="ed">内存：{{ item.memory }}G</span>
            <span v-if="item.disk" class="ed">磁盘:{{ item.disk }}G</span>
            <span v-if="item.ipDistri" class="ed">IP分配方式：{{ item.ipDistri }}</span>
            <span v-if="item.subnetMask" class="ed">子网掩码:{{ item.subnetMask }}</span>
            <span v-if="item.gateway" class="ed">网关:{{ item.gateway }}</span>
            <span v-if="item.dnsServer" class="ed">DNS服务器:{{ item.dnsServer }}</span>
          </div>
          <p v-show="showcontent" class="content-message">描述 : {{ item.description }}</p>
        </li>
      </ul>
    </div>
    <!-- 桌面申请 -->
    <el-dialog
      title="桌面申请"
      :visible.sync="modalState"
      :close-on-click-modal="no"
      custom-class="accountManageDialog"
      top="3%"
      width="40%"
      @close="resetD(&quot;params&quot;)"
    >
      <el-form ref="params" :model="params" :rules="rules2">
        <el-form-item label="名称:" :label-width="formLabelWidth" prop="name">
          <span>{{ Tname }}</span>
        </el-form-item>
        <el-form-item label="有效期:" :label-width="formLabelWidth" prop="deadline">
          <el-date-picker
            v-model="params.deadline"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择有效期"
            :editable="no"
            :picker-options="pickerOptions2"
          />
          <div class="psHint">
            <div>注1：如有效期为空，则无限期使用。
            </div>
            <div>注2：如果设置有效期，到期后桌面资源会自动清退释放。</div>
          </div>
        </el-form-item>
        <el-form-item label="用途:" :label-width="formLabelWidth" prop="description">
          <el-input
            v-model="params.description"
            type="textarea"
            :autosize="{minRows: 6, maxRows: 6 }"
            placeholder="请输入描述,最多255个字"
            :style="{width:inputLabelWidth}"
          />
        </el-form-item>
        <el-form-item label="代申请:" :label-width="formLabelWidth" prop="applyState">
          <el-switch v-model="applyState" active-color="#13ce66" inactive-color="#d2d2d2" />
        </el-form-item>
        <el-form-item v-show="applyState" label="" :label-width="formLabelWidth">
          <div>
            <el-input v-model="params.agentName" style="width:180px;" placeholder="请输入代申请人名称" />
            <el-button type="ghost" @click="queryUserList"><i class="el-icon-search" />查询</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="(applyState&&!params.agentName)" @click="applySubmitBtn('params')">确 定</el-button>
        <el-button @click="modalState = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 待申请  -->
    <el-dialog
      title="选择代申请人"
      :visible.sync="modalState1"
      :close-on-click-modal="no"
      custom-class="accountManageDialog"
      top="8%"
      @close="resetD(&quot;b&quot;)"
    >
      <h4 slot="header">选择代申请人</h4>
      <div class="search-wrap">
        <el-input v-model="queryUserName" placeholder="请输入代申请人名称" style="width:185px;" clearable @clear="queryUserList" />
        <el-button type="ghost" @click="queryUserList"><i class="el-icon-search" />查询</el-button>
        <!-- <el-button type="primary" @click="serviceConfirm">确定</el-button> -->
      </div>
      <div id="table-wrap" class="table-wrap">
        <el-table
          ref="multipleTable"
          :data="userListData"
          height="260"
          stripe
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          @select="checkSelect"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="申请人" />
        </el-table>
      </div>
      <div v-show="userListData.length" class="page-wrap">
        <el-pagination
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next"
          :total="count"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
        <!-- <Page :total="count" size="small" show-total show-sizer @on-change="handleCurrentChange"></Page> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="serviceConfirm">确 定</el-button>
        <el-button @click="modalState1 = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <psloading v-show="loadingState" text="正在提交 , 请稍后...."></psloading> -->
  </div>
</template>

<script>
import {
  httpAjax,
  addScrollBar
  // minTime
} from '@/api/common'
  // import psloading from '../loading'
export default {
  data() {
    return {
      name: '',
      no: false,
      displayType: 'mul',
      commodityData: [],
      modalState: false,
      modalState1: false,
      Tname: '',
      loadingState: false,
      queryUserName: '', //  查询用户名
      // minTime,
      // cloneDeadline: '',
      params: {
        id: '', //  对应商品的 ID
        dealPerson: '', //  对应商品所属云管理员账号
        deadline: '', //  商品有效期
        agentName: '', //  使用人名称
        description: '' //  商品用途
      },
      // rules2:{
      //    cpu: [{
      //     required: true,
      //     validator: nan16,
      //     trigger: 'blur'
      //   }],
      // },
      count: 0,
      formLabelWidth: '110px',
      inputLabelWidth: '300px',
      userListData: [],
      // userConfigInfo: this.getUserConfig(),
      applyState: false,
      tableChecked: [],
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      currentPage4: 1,
      currentSize: 10,
      showcontent: true
    }
  },
  created() {
    this.getCommodityData()
  },
  methods: {
    // selectionChange(val) {
    //   },
    resetD(name) {
      if (name === 'params') {
        this.applyState = false
        this.params = {
          id: '', //  对应商品的 ID
          dealPerson: '', //  对应商品所属云管理员账号
          deadline: '', //  商品有效期
          agentName: '', //  使用人名称
          description: '' //  商品用途
        }
        this.$refs['params'].resetFields()
      } else {
        this.$refs.multipleTable.toggleRowSelection(this.tableChecked[0])
        this.tableChecked = []
        this.queryUserName = ''
      }
    },
    checkSelect(selection, row) {
      if (selection.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(selection[0])
      }
      this.tableChecked = selection
      // console.log(selection, row)
    },
    handleCurrentChange(val) {
      this.currentPage4 = val
      this.queryUserList()
    },
    handleSizeChange(val) {
      this.currentSize = val
      this.queryUserList()
    },
    // changeType(num) {
    //   this.showcontent = false;
    //   if (num === 1) {
    //     this.displayType = 'one'
    //   } else {
    //     this.displayType = 'mul'
    //   }
    //   setTimeout(()=>{
    //     this.showcontent = true;
    //   },300)
    // },
    searchData() {
      this.getCommodityData()
    },
    getCommodityData() {
      const para = {
        name: this.name
      }
      const url = 'merchandise/desktopApplyList?' + Math.random()
      httpAjax(url, para).then((res) => {
        this.commodityData = res
        this.setScroll('.user-commodity-list-main', true)
      }).catch((err) => {
        console.log(err)
      })
    },
    // timeChange(val) {
    //   var str = val.trim()
    //   if (str != '1970-01-01' && str != '') {
    //     this.params.deadline = val
    //   }
    // },
    // cancelModalOne() {
    //   this.applyState = false
    //   this.cloneDeadline = ''
    //   this.params = {
    //     id: '', //  对应商品的 ID
    //     dealPerson: '', //  对应商品所属云管理员
    //     deadline: '', //  商品有效期
    //     agentName: '', //  使用人名称
    //     description: '' //  商品用途
    //   }
    // },
    applyDesktop(item) {
      this.params.id = item.id,
      this.params.dealPerson = item.operatorAccount
      this.Tname = item.name
      this.modalState = true
    },

    queryUserList() {
      // var page = typeof num == 'number' ? num : 1;
      var params = {
        name: this.queryUserName
      }
      const url = `user/userList?&page=${this.currentPage4}&limit=${this.currentSize}`
      this.modalState1 = true
      httpAjax(url, params).then((res) => {
        this.userListData = res.data
        this.count = res.count
        this.$nextTick(() => {
          this.setScroll('#table-wrap', true)
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    // handleCurrentChange(val) {
    //   this.queryUserList(val)
    // },
    // getUserConfig() {
    //   return [{
    //       type: 'selection',
    //       width: 60
    //     },
    //     {
    //       title: '申请人',
    //       key: 'name'
    //     },
    //   ]
    // },
    applySubmitBtn(formName) {
      var params = this.params
      this.loadingState = true
      if (params.agentName) {
        var url = 'user/findTenantOnAD'
        params.name = params.agentName
        httpAjax(url, params).then((res) => {
          if (res.resultCode == 0) {
            this.saveOrder(params)
          } else {
            this.loadingState = false
            this.$message.warning({
              title: '提示',
              message: '待申请人名称不存在,请确认后在提交'
            })
          }
        }).catch((err) => {
          this.loadingState = false
          this.$message.error({
            title: '提示',
            message: '网络错误,请刷新页面再试'
          })
        })
      } else {
        this.saveOrder(params)
      }
    },
    saveOrder(params) {
      const url = 'desktop/saveOrder'
      httpAjax(url, params).then((res) => {
        this.loadingState = false
        if (res.result == 'success') {
          this.modalState = false
          this.$confirm('桌面申请成功', '提示', {
            confirmButtonText: '查看申请状态',
            cancelButtonText: '继续申请',
            type: 'success'
          }).then(() => {
            this.$router.push('myOrder')
          }).catch(() => {
            this.modalState = false
          })
        }
      }).catch((err) => {
        this.$message.error('通信错误')
        this.loadingState = false
      })
    },

    serviceConfirm() {
      // var len = this.tableChecked.length
      // if (len >= 2 || len < 1) {
      //   var title = len < 1 ? '请选择一位待申请人' : '只能选择一位待申请人'
      //   this.$message.warning({
      //     message: title
      //   })

      //   return
      // } else {
      //   }
      this.params.agentName = this.tableChecked[0].name
      // console.log( this.params.agentName)
      this.modalState1 = false
    },
    setScroll(node, bool) {
      addScrollBar(node, bool)
    }
  }
  // components: {
  //   psloading
  // }
}

</script>

<style scoped>
  .search-wrap {
    padding-right: 10px;
  }

  .search-wrap .fr {
    margin-top: 6px;
  }

  .search-wrap .fr .iconfont {
    font-size: 22px;
    cursor: pointer;
    vertical-align: middle;
  }

  .user-commodity-list-main {
    background: #fff;
    height: 89%;
    margin-top: 15px;
  }

  .list {
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
  }

  .li-item {
    border: 1px solid #ccc;
    overflow: hidden;
    padding: 20px 12px;
    border-radius: 4px;

    /* height: 200px; */
    margin-bottom: 15px;
    cursor: pointer;
  }
.pcItem{
  width: 350px;
  height: 300px;
  position: relative;
  background: url('../../../static/img/pc.svg')  no-repeat center/100% 100%;
  margin:0 10px;
  cursor:pointer;
}
.pcName{
  position: absolute;
  width: 80%;
  text-align: center;
  transform: translateX(-50%);
  top:35px;
  left:50%;
  color:white;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.pcContent{
  position: absolute;
  width: 68%;
  height:55%;
  transform: translateX(-50%);
  top:53px;
  left:50%;
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 15px;
  background: #4c4c4c;
  color:white;
}
.pcMemo{
  flex:1;
}
.pcItem:hover .pcContent{
  background: #00ff00;
  color: black;
  /* color: white; */
}
.pcItem:hover .openIcon{
  position:absolute;
  width: 15%;
  height:11px;
  transform: translateX(-50%);
  top:230px;
  left:50%;
   background: #00ff00;
}
.tag{
  position: absolute;
  width: 50px;
  top:222px;
  left:60px;
  font-size: 20px;

}
  .title {
    display: flex;
  }

  .title img {
    width: 70px;
    height: 70px;
    margin-right: 10px;
    border-radius: 10px
  }

  .tenant-name {
    margin-top: 32px;
  }

  /* .number-value {
    padding: 12px 0;
  }

  .number-value span {
    padding: 0 20px 0px 5px;
  } */

  .content-message {
    line-height: 32px;
    margin-top: 10px;
    padding: 0 5px;
  }
/*
  .ivu-form-item {
    margin-bottom: 15px;
  }

  .ivu-date-picker {
    display: block;
  } */

  .li-item:hover {
    box-shadow: 5px 5px 20px rgb(89, 121, 160);
  }

  .li-item {
    transition: all .5s;
  }

  .page-wrap {
    text-align: center;
  }

  /* .li-item::after {
      content: '';
      position: absolute;
      z-index: -1;
      opacity: 0;
      box-shadow: 0 5px 15px rgba(65, 96, 212, 0.7);
      transition: opacity 1s ease-in-out;
    }
    .li-item:hover::after {
    	opacity: 1;
    }
    .li-item{
        position: relative;
        background-color: #fff;
        -webkit-transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
        transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .li-item::after {
      content: "";
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0);
      opacity: 0;
      -webkit-transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
      transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .li-item:hover::after {
        opacity: 1;
    } */
  .hint {
    display: inline-block;
    margin-left: 14px;
    padding: 5px 10px;
    background: #FFB800;
    color: #fff;
    border-radius: 4px;
  }

  .psHint {
    color: red;
    text-align: left;
    /* margin-left: 70px; */
    font-size: 12px;
    line-height: 20px;
  }

  .modalDes {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
    padding: 0 5px;
    flex-wrap: wrap;
  }

  .ed {
    margin-right: 30px;
    line-height: 30px;
  }

</style>
