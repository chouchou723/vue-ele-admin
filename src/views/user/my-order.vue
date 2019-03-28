<template>
  <div id="adminOnline">
    <div class="search-wrap">
      <el-input v-model="templateName" placeholder="请输入模板名称" style="width:185px;" clearable @clear="clearData(1)" />
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
      <el-date-picker
        v-model="expTime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="请选择到期日期"
        :editable="no"
        clearable
        @change="clearDataD(3)"
      />
      <el-select v-model="orderState" style="width:190px" placeholder="请选择订单状态" clearable @clear="clearData(4)">
        <el-option value="applied" label="审批中">审批中</el-option>
        <el-option value="approved" label="审批通过">审批通过</el-option>
        <el-option value="reject" label="已拒绝">已拒绝</el-option>
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
        style="width:100%"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55">
                    </el-table-column> -->
        <el-table-column prop="name" label="模板名称" min-width="120" />
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            <div>
              {{ new Date(scope.row.createTime).toLocaleString() }}
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
        <el-table-column prop="deadline" label="到期日" width="120">
          <template slot-scope="scope">
            <div style="color:red">
              {{ scope.row.deadline }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderState" label="订单状态">
          <template slot-scope="scope">
            <div>
              {{ orderStateType(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="businessType" label="业务类型">
          <template slot-scope="scope">
            <div>
              {{ businessStateType(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dealPerson" label="受理人" />
        <el-table-column prop="description" label="描述" min-width="200">
          <template slot-scope="scope">
            <div>
              {{ scope.row.description }}
            </div>
          </template>
        </el-table-column>

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
  // httpAjax,
  httpGet,
  computedTableHeight,
  addScrollBar
} from '@/api/common'
export default {
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      no: false,
      tableData: [],
      createTime: '',
      expTime: '',
      count: 0,
      tableHeight: 400,
      total: 0,
      cpu: 0,
      memory: 0,
      disk: 0,
      vmTableLoadingState: true,
      currentPage4: 1,
      currentSize: 10,
      templateName: '',
      orderState: ''
    }
  },
  created() {
    // computedTableHeight();
    this.getVmList(1)
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.tableHeight = computedTableHeight()
    // })
  },
  methods: {
    searchData() {
      this.getVmList()
    },
    clearData(num) {
      this.getVmList()
    },
    clearDataD(num) {
      if (num === 2 && !this.createTime) {
        this.getVmList()
      } else if (num === 3 && !this.expTime) {
        this.getVmList()
      }
    },
    // handleSelectionChange(val) {
    //     this.multSelection = val;
    // },
    orderStateType(params) {
      const orderState = params.row.orderState
      if (orderState == 'applied') {
        return '审批中'
      } else if (orderState == 'oa_applied') {
        return 'OA审批中'
      } else if (orderState == 'approved') {
        return '审批通过'
      } else if (orderState == 'oa_approved') {
        return 'OA审批通过'
      } else if (orderState == 'reject') {
        return '已拒绝'
      }
    },
    businessStateType(params) {
      const businessType = params.row.businessType
      if (businessType == 'provide') {
        return '桌面申请'
      } else if (businessType == 'detach') {
        return '桌面清退'
      } else if (businessType == 'attachVolume') {
        return '修改桌面磁盘'
      } else if (businessType == 'postpone') {
        return '延期申请'
      } else if (businessType == 'modifyVMStandard') {
        return '桌面规格申请'
      } else if (businessType == 'renameDesktop') {
        return '修改桌面名称'
      }
    },
    getVmList(first) {
      const para = {
        page: this.currentPage4,
        limit: this.currentSize,
        // user: this.applyUser,
        name: this.templateName,
        startDate: this.createTime,
        deadline: this.expTime,
        orderState: this.orderState
      }
      const url = `desktop/desktopList?${Math.random()}&${first === 1 ? 'online=1' : ''}`
      httpGet(url, para).then((res) => {
        this.tableHeight = computedTableHeight()// ( document.querySelector('#content').offsetHeight-160)+'px';
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
