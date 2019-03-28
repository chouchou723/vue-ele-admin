<template>
  <div id="adminOnline">
    <div class="search-wrap">
      <el-input v-model="applyUser" placeholder="请输入名称" style="width:185px;" clearable @clear="clearData(1)" />
      <el-date-picker
        v-model="createTime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="请选择创建时间"
        :editable="no"
        clearable
        :picker-options="pickerOptions1"
        @change="clearDataD(2)"
      />
      <el-select v-model="applyLoginState" style="width:190px" placeholder="请选择工单状态" clearable @clear="clearData(4)">
        <el-option value="SUCCESS" label="开通成功">开通成功</el-option>
        <el-option value="FAILED" label="失败">失败</el-option>
        <el-option value="ABNORMAL" label="中断">中断</el-option>
        <el-option value="RUNNING" label="正在运行">正在运行</el-option>
      </el-select>
      <el-button icon="el-icon-search" circle @click="searchData" />
    </div>
    <!-- <div class="button-wrap">
      <el-button size="small" type="primary" @click="exportData">重新发起</el-button>
    </div> -->
    <div id="table-wrap" class="table-wrap">
      <el-table
        v-loading="vmTableLoadingState"
        :data="tableData"
        :height="tableHeight"
        stripe
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        @select="checkSelect"
      >
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="merName" label="名称" width="150" />
        <el-table-column prop="result" label="结果" width="250" />
        <el-table-column prop="status" label="工单状态">
          <template slot-scope="scope">
            <div :style="scope.row.status=='FAILED'?'color:red':scope.row.status=='SUCCESS'?'color:#3fd43f':scope.row.status=='RUNNING'?'':'color:#d80f17'">
              {{ orderStateTpl(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taskType" label="业务类型">
          <template slot-scope="scope">
            <div>
              {{ bizTypeTpl(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dealPerson" label="受理人" />
        <el-table-column prop="createTime" label="创建时间" min-width="200">
          <template slot-scope="scope">
            <div>
              {{ new Date(scope.row.createTime).toLocaleString() }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <Table  :height="tableHeight" :loading="vmTableLoadingState" :columns="tableHeader" :data="tableData"></Table> -->
    </div>
    <div v-if="tableData.length" class="bottomWrap">
      <!-- <div class="total-wrap">
        <label>总数：</label><span class="ps-blue ps-count">{{total}}</span>
        <label>CPU/内存/磁盘：</label><span class="ps-yellow ps-count">{{cpu}}个/{{memory}}G/{{disk}}G</span>
      </div> -->
      <div class="page-wrap">
        <el-pagination
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next"
          :total="count"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <el-dialog
      title="工单详情"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="no"
      custom-class="accountManageDialog"
      top="9%"
      width="60%"
    >
      <div class="dialogContent">
        <div style="flex:0 0 30%;border-right:1px solid gainsboro;margin-right:5%">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.endTime?new Date(activity.endTime).toLocaleString():''"
              :color="activity.status==&quot;FAILED&quot;?&quot;red&quot;:activity.status==&quot;SUCCESS&quot;||activity.status==&quot;ok&quot;?&quot;#0bbd87&quot;:activity.status==&quot;RUNNING&quot;?&quot;#409EFF&quot;:&quot;#0bbd87&quot;"
            >
              {{ activity.result }}
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="dialogRightContent">
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">申请人:</span>{{ logContent.user }}</div>
            <div class="dialogDiv"><span class="dialogTitle">创建时间:</span>{{ logContent.createTimeStr }}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">vmId:</span>{{ logContent.vmID }}</div>
            <div class="dialogDiv"><span class="dialogTitle">商品名称:</span>{{ logContent.merName }}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">桌面类型:</span>{{ clouldType(logContent.deskType) }}</div>
            <div class="dialogDiv"><span class="dialogTitle">CPU/内存/磁盘:</span>{{ logContent.feature }}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">任务类型:</span>{{ bizTypeTplD(logContent.taskType) }}</div>
            <div class="dialogDiv"><span class="dialogTitle">到期日:</span>{{ logContent.deadline }}</div>
          </div>
          <div class="flexTwo">
            <div class="dialogDiv"><span class="dialogTitle">工单状态:</span>{{ orderStateTplD(logContent.status) }}</div>
            <div class="dialogDiv"><span class="dialogTitle">受理人:</span>{{ logContent.dealPerson }}</div>
          </div>
        </div>

      </div>
    </el-dialog>
    <!-- <psloading v-show="loadingState" :text="text"></psloading> -->
  </div>
</template>

<script>
import {
  httpAjax,
  httpGet,
  computedTableHeight,
  addScrollBar
} from '@/api/common'
export default {
  data() {
    return {
      no: false,
      createTime: '',
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      tableData: [],
      count: 0,
      tableHeight: 400,
      vmTableLoadingState: true,
      currentPage4: 1,
      currentSize: 10,
      multSelection: [],
      applyUser: '',
      // loadingState: false,
      applyLoginState: '',
      // text: '请稍后',
      dialogFormVisible: false,
      taskID: '',
      activities: [],
      logContent: {}
    }
  },
  created() {
    this.getVmList(1)
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.tableHeight = computedTableHeight()
  //   })
  // },
  methods: {
    handleClick(data) {
      this.taskID = data.taskID
      this.dialogFormVisible = true
      const params = {
        taskID: data.taskID
      }
      httpAjax('/desktop/findTaskLog', params).then(res => {
        // console.log(res)
        this.activities = res.res
        this.logContent = res.task
        //   if (res.result == "success") {
        // this.getVmList();
        // this.$message({
        //   type: 'success',
        //   message: '发起成功'
        // });
        //   } else {
        //     this.$message({
        //       type: 'error',
        //       message: '已经提交过，正在审核中!'
        //     });
        //   }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '发起失败!'
        })
      })
    },
    searchData() {
      this.getVmList()
    },
    clearData(num) {
      this.getVmList()
    },
    clearDataD(num) {
      if (num === 2 && !this.createTime) {
        this.getVmList()
      }
    },
    // handleSelectionChange(val) {
    //   },
    //   checkSelect(selection, row) {
    //     this.tableChecked = [row]
    //     if (selection.length > 1) {
    //       this.$refs.multipleTable.toggleRowSelection(selection[0]);
    //     }
    //     // console.log(selection, row)
    //   },
    clouldType(deskType) {
      if (deskType == 'fullcopy_template') {
        return '完整复制'
      } else if (deskType == 'linkclone_template') {
        return '链接克隆'
      } else if (deskType == 'VDI_memoryClone_template') {
        return '全内存'
      }
    },
    orderStateTplD(status) {
      if (status == 'SUCCESS') {
        return '开通成功'
      } else if (status == 'FAILED') {
        return '失败'
      } else if (status == 'RUNNING') {
        return 'ita执行中'
      } else if (status == 'deleted') {
        return '已删除'
      }
    },
    bizTypeTplD(taskType) {
      if (taskType == 'provide') {
        return '桌面申请'
      } else if (taskType == 'detach') {
        return '桌面清退'
      } else if (taskType == 'attachVolume') {
        return '修改桌面磁盘'
      } else if (taskType == 'postpone') {
        return '延期申请'
      } else if (taskType == 'modifyVMStandard') {
        return '桌面规格申请'
      } else if (taskType == 'renameDesktop') {
        return '修改桌面名称'
      }
    },
    bizTypeTpl(params) {
      const taskType = params.row.taskType
      if (taskType == 'provide') {
        return '桌面申请'
      } else if (taskType == 'detach') {
        return '桌面清退'
      } else if (taskType == 'attachVolume') {
        return '修改桌面磁盘'
      } else if (taskType == 'postpone') {
        return '延期申请'
      } else if (taskType == 'modifyVMStandard') {
        return '桌面规格申请'
      } else if (taskType == 'renameDesktop') {
        return '修改桌面名称'
      }
    },
    orderStateTpl(params) {
      const status = params.row.status
      if (status == 'SUCCESS') {
        return '开通成功'
      } else if (status == 'FAILED') {
        return '失败'
      } else if (status == 'RUNNING') {
        return 'ita执行中'
      } else if (status == 'deleted') {
        return '已删除'
      }
    },
    getVmList(first) {
      const para = {
        page: this.currentPage4,
        limit: this.currentSize,
        merName: this.applyUser,
        createTimeStr: this.createTime,
        status: this.applyLoginState

      }
      const url = `desktop/ticketList?${Math.random()}`
      httpGet(url, para).then((res) => {
        this.tableHeight = computedTableHeight()
        this.tableData = res.data
        this.vmTableLoadingState = false
        this.count = res.count
        this.$nextTick(() => {
          this.setScrollBar('#table-wrap')
        })
        //   this.getStatistics()
      }).catch((error) => {
        console.log(error)
      })
    },
    handleCurrentChange(val) {
      this.currentPage4 = val
      this.getVmList()
    },
    handleSizeChange(val) {
      this.currentSize = val
      this.getVmList()
    },
    //   getStatistics() {
    //     const url = 'desktop/userStatistics?online=1'
    //     httpAjax(url).then((res) => {
    //       if (res.cpu) {
    //         this.total = res.merCnt
    //         this.cpu = res.cpu
    //         this.memory = res.memory
    //         this.disk = res.disk
    //       }
    //     }).catch((err) => {
    //       console.log(err)
    //     })
    //   },
    //   patternState(obj) {
    //     let state = obj.opType
    //     return state == 'set' ? '维护模式' : '工作模式'
    //   },
    setScrollBar(dom) {
      if (this.tableData.length) {
        addScrollBar(dom)
      }
    }
  }
}

</script>
<style scoped>
  .bottomWrap {
    position: absolute;
    padding: 0 15px 0px 15px;
    bottom: 0;
    width: calc(100% - 30px);
    height: 40px;
    background: white;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #606266;
  }

  .dialogContent {
    display: flex;
    justify-content: flex-start;
  }

  .dialogRightContent {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    min-height: 300px;
    align-items: flex-start;
    flex-direction: column;
    flex: 0 0 60%;
  }

  .flexTwo {
    flex: auto;
    width: 100%;
    display: flex;
  }

  .dialogDiv {
    flex: 1;
    font-size: 15px;
  }

  .dialogTitle {
    font-size: 15px;
    font-weight: 600;
    margin-right: 5px;
  }

</style>
