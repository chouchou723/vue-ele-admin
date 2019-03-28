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
        <el-table-column prop="status" label="工单状态" width="120">
          <template slot-scope="scope">
            <!-- <div :style="scope.row.status=='FAILED'?'color:red':''">
              {{orderStateTpl(scope)}}
            </div> -->
            <div style="color:red">失败
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taskType" label="业务类型" width="150">
          <template slot-scope="scope">
            <div>
              {{ bizTypeTpl(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dealPerson" label="受理人" width="120" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <div>
              {{ new Date(scope.row.createTime).toLocaleString() }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" :loading="btnLoading&&(btnIndex===scope.row.id)" @click="handleClick(scope.row)">{{ btnLoading&&(btnIndex===scope.row.id)?'发起中':'重新发起' }}</el-button>
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
      btnLoading: false,
      btnIndex: '',
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
      text: '请稍后'
    }
  },
  created() {
    this.getVmList(1)
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.tableHeight = computedTableHeight()
    // })
  },
  methods: {
    handleClick(data) { // 重新发起
      this.$confirm('确定重新发起请求吗?', '重新发起', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnIndex = data.id
        this.btnLoading = true
        const params = {
          orderId: data.orderId
        }
        httpAjax('/desktop/reapply', params).then(res => {
          if (res.result == 'success') {
            this.$message({
              type: 'success',
              message: '发起成功'
            })
            this.getVmList()
          } else {
            this.$message({
              type: 'error',
              message: '发起失败!'
            })
          }
          this.btnLoading = false
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '发起失败!'
          })
          this.btnLoading = false
        })
      }).catch(() => {

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
    // orderStateTpl(params) {
    //   let status = params.row.status
    //   if (status == 'SUCCESS') {
    //     return '开通成功';
    //   } else if (status == 'FAILED') {
    //     return '失败';
    //   } else if (status == 'RUNNING') {
    //     return 'ita执行中';
    //   } else if (status == 'deleted') {
    //     return '已删除';
    //   }
    // },
    getVmList(first) {
      const para = {
        page: this.currentPage4,
        limit: this.currentSize,
        merName: this.applyUser,
        createTimeStr: this.applyTable,
        status: 'FAILED'
      }
      const url = `desktop/ticketList?${Math.random()}`
      httpGet(url, para).then((res) => {
        this.tableData = res.data
        this.vmTableLoadingState = false
        this.tableHeight = computedTableHeight()
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

</style>
