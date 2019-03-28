<template>
  <div id="adminOnline">
    <div class="search-wrap">
      <el-date-picker
        v-model="opStartTime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="请选择操作时间"
        :editable="no"
        clearable
        :picker-options="pickerOptions1"
        @change="searchData"
      />
      <!-- <el-button icon="el-icon-search" circle @click="searchData"></el-button> -->
    </div>
    <div class="table-wrap">
      <el-table
        id="table-wrap"
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
        <el-table-column prop="userId" label="用户" />
        <el-table-column prop="opName" label="操作名称" />
        <el-table-column prop="opStartTime" label="操作时间" />
        <el-table-column prop="detail" label="明细" />
        <el-table-column prop="type" label="类型" />
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
export default {
  data() {
    return {
      opStartTime: '',
      no: false,
      tableData: [],
      count: 0,
      tableHeight: 400,
      total: 0,
      cpu: 0,
      memory: 0,
      disk: 0,
      vmTableLoadingState: true,
      currentPage4: 1,
      currentSize: 10,
      multSelection: [],
      applyUser: '',
      applyTable: '',
      applyState: '', // 管理员使用
      applyLoginState: ''
    }
  },
  created() {
    this.getVmList(1)
  },
  mounted() {
    //   this.$nextTick(() => {
    //     this.tableHeight = computedTableHeight()
    //   })
    //         this.$nextTick(() => {
    //              addScrollBar('#table-wrap')
    //   })
  },
  methods: {

    searchData() {
      this.getVmList()
    },
    clearData(num) {
      this.getVmList()
    },
    getVmList(first) {
      const para = {
        page: this.currentPage4,
        limit: this.currentSize,
        // user: this.applyUser,
        opStartTime: this.opStartTime,
        userId: this.applyState
      }
      const url = `statistic/operationList`
      httpGet(url, para).then((res) => {
        this.tableHeight = computedTableHeight()
        this.tableData = res.data
        this.vmTableLoadingState = false
        this.count = res.count
        this.$nextTick(() => {
          addScrollBar('#table-wrap')
        })
        //   this.$nextTick(() => {
        //   })
        // setTimeout(()=>{
        //     this.setScrollBar('#table-wrap')

        // },000)
        // this.getStatistics()
      }).then(() => {
        // this.setScrollBar('#table-wrap')

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
