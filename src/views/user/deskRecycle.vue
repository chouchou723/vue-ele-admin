<template>
  <div id="adminOnline">
    <div class="search-wrap">
      <el-input v-model="applyTable" placeholder="请输入桌面名称" style="width:185px;" clearable @clear="clearData(2)" />
      <el-select v-model="applyState" style="width:190px;" placeholder="请选择运行状态" clearable @clear="clearData(3)">
        <el-option v-for="(item,index) in selectRunState" :key="index" :value="item.value" :label="item.label">{{ item.label }}</el-option>
      </el-select>
      <el-select v-model="applyLoginState" style="width:190px" placeholder="请选择登录状态" clearable @clear="clearData(4)">
        <el-option v-for="(item,index) in selectLoginState" :key="index" :value="item.value" :label="item.label">{{ item.label }}</el-option>
      </el-select>
      <el-button icon="el-icon-search" circle @click="searchData" />
    </div>
    <div id="table-wrap" class="table-wrap">
      <el-table
        v-loading="vmTableLoadingState"
        :data="tableData"
        :height="tableHeight"
        stripe
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55">
                    </el-table-column> -->
        <el-table-column prop="user" label="申请人" />
        <el-table-column prop="computerName" label="桌面名称" />
        <el-table-column prop="ip" label="IP地址" />
        <el-table-column prop="deskType" label="桌面类型">
          <template slot-scope="scope">
            <div>
              {{ clouldType(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="feature" label="CPU/内存/磁盘" min-width="120">
          <template slot-scope="scope">
            <div>
              {{ scope.row.feature }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="runState" label="运行状态">
          <template slot-scope="scope">
            <div>
              {{ runState(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="loginState" label="登录状态">
          <template slot-scope="scope">
            <div>
              {{ loginState(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="attachState" label="分配状态">
          <template slot-scope="scope">
            <div>
              {{ branchState(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" min-width="200" />
        <el-table-column prop="deadline" label="到期日" min-width="200" />
      </el-table>
      <!-- <Table  :height="tableHeight" :loading="vmTableLoadingState" :columns="tableHeader" :data="tableData"></Table> -->
    </div>
    <div v-if="tableData.length" class="bottomWrap">
      <!-- <div class="total-wrap" v-show="tableData.length">
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
  </div>
</template>

<script>
import {
  httpAjax,
  httpGet,
  computedTableHeight,
  addScrollBar
} from '@/api/common'
import {
  selectRunState,
  selectLoginState,
  tableHeader
} from '@/api/resources'
export default {
  data() {
    return {
      no: false,
      tableData: [],
      count: 0,
      tableHeight: 400,
      total: 0,
      cpu: 0,
      memory: 0,
      disk: 0,
      vmTableLoadingState: true,
      selectRunState,
      selectLoginState,
      tableHeader,
      currentPage4: 1,
      currentSize: 10,
      multSelection: [],
      applyUser: '',
      applyTable: '',
      applyState: '',
      applyLoginState: ''
    }
  },
  created() {
    this.getVmList(1)
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = computedTableHeight()
    })
  },
  methods: {

    searchData() {
      this.getVmList()
    },
    clearData(num) {
      // if (num === 1) {
      //   this.applyUser = '';
      // } else if (num === 2) {
      //   this.applyTable = '';
      // } else if (num === 3) {
      //   this.applyState = '';
      // } else if (num === 4) {
      //   this.loginState = '';
      // }
      this.getVmList()
    },
    // handleSelectionChange(val) {
    //     this.multSelection = val;
    // },
    runState(params) {
      const runState = params.row.runState
      if (runState == 'running') {
        return '运行中'
      } else if (runState == 'creating') {
        return '创建中'
      } else if (runState == 'stopped') {
        return '已停止'
      } else if (runState == 'starting') {
        return '启动中'
      } else if (runState == 'stopping') {
        return '停止中'
      } else if (runState == 'fault-resuming') {
        return '故障修复中'
      } else if (runState == 'DeletedFailure') {
        return '删除失败'
      } else if (runState == 'Deleting') {
        return '已删除'
      } else {
        return runState
      }
    },
    loginState(params) {
      const state = params.row.loginState
      if (state == '23') {
        return '断开连接'
      } else if (state == '25') {
        return '使用中'
      } else if (state == '0') {
        return '就绪'
      } else if (state == '-3') {
        return '未注册'
      } else {
        return '未知'
      }
    },
    branchState(params) {
      const state = params.row.attachState
      if (state == 'ATTACHED') {
        return '已分配'
      } else if (state == 'UNATTACH') {
        return '未分配'
      } else if (state == 'DEATTACHED') {
        return '已解分配'
      } else {
        return state
      }
    },
    clouldType(params) {
      const deskType = params.row.deskType
      if (deskType == 'fullcopy_template') {
        return '完整复制'
      } else if (deskType == 'linkclone_template') {
        return '链接克隆'
      } else if (deskType == 'VDI_memoryClone_template') {
        return '全内存'
      }
    },
    getVmList(first) {
      const para = {
        page: this.currentPage4,
        limit: this.currentSize,
        // user: this.applyUser,
        computerName: this.applyTable,
        runState: this.applyState,
        loginState: this.applyLoginState
      }
      const url = `desktop/userRecycleBin?${Math.random()}&${first === 1 ? 'online=1' : ''}`
      httpGet(url, para).then((res) => {
        this.tableData = res.data
        this.vmTableLoadingState = false
        this.count = res.count
        this.$nextTick(() => {
          this.setScrollBar('#table-wrap')
        })
        // this.getStatistics()
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
    // getStatistics() {
    //     const url = 'desktop/userStatistics?online=1'
    //     httpAjax(url).then((res) => {
    //         if (res.cpu) {
    //             this.total = res.merCnt
    //             this.cpu = res.cpu
    //             this.memory = res.memory
    //             this.disk = res.disk
    //         }
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // },
    // patternState(obj) {
    //     let state = obj.opType
    //     return state == 'set' ? '维护模式' : '工作模式'
    // },
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
