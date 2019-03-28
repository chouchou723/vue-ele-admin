<template>
  <div id="user-list">
    <div class="search-wrap">
      <Input placeholder="请输入名称" style="width:185px;" />
      <i-button type="ghost"><i class="iconfont icon-sousuo" />查询</i-button>
    </div>
    <div class="button-wrap">
      <Button type="primary" @click="setAssetAdmin(true)">设置资产管理员</Button>
      <Button type="warning" @click="setAssetAdmin(false)">取消资产管理员</Button>
      <Button type="error" @click="exportData">导出</Button>
    </div>
    <div id="table-wrap" class="table-wrap">
      <Table
        :height="tableHeight"
        :loading="loadingState"
        :columns="tableConfigInfo"
        :data="tableData"
        @on-selection-change="handleSaveCheckedData"
      />
    </div>
    <div v-show="tableData.length" class="page-wrap">
      <Page
        :total="count"
        size="small"
        show-total
        show-sizer
        @on-change="handleCurrentChange"
      />
    </div>
    <div class="total-wrap">
      <label>用户总数：</label><span class="ps-blue ps-count">{{ total }}</span>
    </div>
  </div>
</template>

<script>
import {
  httpAjax,
  formatTime,
  computedTableHeight,
  addScrollBar,
  reloadViewModel,
  webroot
} from '@/api/common'
export default {
  data() {
    return {
      tableData: [],
      count: 0,
      tableHeight: 0,
      total: 0,
      tableConfigInfo: [],
      loadingState: true,
      checkedData: []
    }
  },
  created() {
    this.getTableData()
    this.getUserCount()
  },
  methods: {
    getTableData(pageNum) {
      const page = pageNum || 1
      const url = `user/adminUserList?${Math.random()}&page=${page}&limit=10`
      httpAjax(url).then((res) => {
        this.tableConfigInfo = this.getTableConfigInfo()
        this.tableData = res.data
        this.count = res.count
        this.loadingState = false
        this.tableHeight = computedTableHeight()
        this.$nextTick(() => {
          this.setScrollBar()
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    getUserCount() {
      const url = 'user/adminUserList'
      httpAjax(url).then((res) => {
        this.total = res.count
      }).catch((err) => {
        console.log(err)
      })
    },
    handleCurrentChange(val) {
      this.getTableData(val)
    },
    setAssetAdmin(bool) {
      /*
                bool 为 true   设置资产管理员
                bool 为 false  取消资产管理员
            */
      var arr = this.checkedData
      if (arr.length < 1 || arr.length > 1) {
        var title = arr.length < 1 ? '请选择一位用户' : '只能选择一位用户'
        this.$Message.warning(title)
        return
      }
      var url = 'user/setRole'
      var params = {
        name: arr[0].name,
        role: bool ? 'asset' : ''
      }
      httpAjax(url, params).then((res) => {
        this.$Modal.info({
          title: '提示',
          content: bool ? '设置成功' : '取消成功',
          onOk: () => {
            reloadViewModel(this)
          }
        })
      }).catch((err) => {
        this.$Message.error('通讯错误')
      })
    },
    exportData() {
      window.location.href = `${webroot}user/exportData`
    },
    handleSaveCheckedData(val) {
      this.checkedData = val
    },
    getTableConfigInfo() {
      return [
        { type: 'selection', width: 60 },
        { title: '名称', key: 'name', width: 220 },
        { title: '域用户', key: 'domainUserName', width: 210 },
        { title: '邮箱', key: 'email', width: 210 },
        {
          title: '角色',
          key: 'role',
          width: 240,
          render: (h, params) => {
            var data = params.row.role
            if (data == 'asset') {
              return h('span', '资产管理员')
            } else {
              return h('span', '普通用户')
            }
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 220,
          render: (h, params) => {
            return h('span', formatTime(params))
          }
        },
        {
          title: '最近登录时间',
          key: 'updateTime',
          width: 250,
          render: (h, params) => {
            return h('span', formatTime(params))
          }
        }
      ]
    },
    setScrollBar() {
      // if( this.tableData.length ){
      addScrollBar('#table-wrap')
      // }
    }
  }
}
</script>

