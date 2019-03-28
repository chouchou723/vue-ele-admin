<template>
  <div id="myDesk" v-loading.fullscreen="loadingState" :element-loading-text="text">
    <div class="search-wrap">
      <el-input v-model="applyUser" placeholder="请输入申请人" style="width:185px;" clearable @clear="clearData(1)" />
      <el-input v-model="applyTable" placeholder="请输入桌面名称" style="width:185px;" clearable @clear="clearData(2)" />
      <el-select v-model="applyState" style="width:190px;" placeholder="请选择运行状态" clearable @clear="clearData(3)">
        <el-option v-for="(item,index) in selectRunState" :key="index" :value="item.value" :label="item.label">
          {{ item.label }}</el-option>
      </el-select>
      <el-select v-model="applyLoginState" style="width:190px" placeholder="请选择登录状态" clearable @clear="clearData(4)">
        <el-option v-for="(item,index) in selectLoginState" :key="index" :value="item.value" :label="item.label">
          {{ item.label }}</el-option>
      </el-select>
      <el-button icon="el-icon-search" circle @click="searchData" />
    </div>
    <div class="button-wrap">
      <!-- <Button type="primary">启动</Button> -->
      <el-button
        size="small"
        type="success"
        plain
        :disabled="!(multSelection.length===1&&checkDisable('start'))"
        @click="start"
      >启动</el-button>
      <el-button
        size="small"
        type="warning"
        plain
        :disabled="!(multSelection.length===1&&checkDisable('restart'))"
        @click="restart"
      >重启</el-button>
      <el-button
        size="small"
        type="danger"
        :autofocus="true"
        plain
        :disabled="!(multSelection.length===1&&checkDisable('quit'))"
        @click="detach"
      >清退</el-button>
      <el-button
        size="small"
        type="info"
        plain
        :disabled="!(multSelection.length===1&&checkDisable('edit'))"
        @click="updateDesk"
      >修改规格</el-button>
      <el-button size="small" type="primary" plain :disabled="multSelection.length!==1" @click="postpone">延期申请
      </el-button>
      <el-button size="small" type="success" @click="loginCloud">云桌面登陆</el-button>
      <el-button size="small" type="primary" @click="exportData">导出</el-button>
      <el-button icon="el-icon-refresh" circle style="float:right" size="small" @click="refreshData" />
    </div>
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
        <el-table-column type="selection" width="55" />
        <el-table-column prop="user" label="申请人" width="150" />
        <el-table-column prop="operatorAccount" label="审批人" width="100" />
        <el-table-column prop="computerName" label="桌面名称" width="200" />
        <el-table-column prop="ip" label="IP" width="120" />
        <el-table-column prop="deskType" label="桌面类型" width="120">
          <template slot-scope="scope">
            <div>
              {{ clouldType(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="feature" label="CPU/内存/磁盘" width="150">
          <template slot-scope="scope">
            <div>
              {{ scope.row.feature }}
              <el-button
                v-if="scope.row.runState!=='stopped'"
                icon="el-icon-plus"
                size="mini"
                circle
                style="margin-left:10px"
                @click="updateDisk(scope.row)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="runState" label="运行状态" width="100">
          <template slot-scope="scope">
            <div>
              {{ runState(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="loginState" label="登录状态" width="100">
          <template slot-scope="scope">
            <div>
              {{ loginState(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="attachState" label="分配状态" width="100">
          <template slot-scope="scope">
            <div>
              {{ branchState(scope) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width="200" />
        <el-table-column prop="deadline" label="到期日" width="200" />
      </el-table>
      <!-- <Table  :height="tableHeight" :loading="vmTableLoadingState" :columns="tableHeader" :data="tableData"></Table> -->
    </div>
    <div v-if="tableData.length" class="bottomWrap">
      <div class="total-wrap">
        <label>总数：</label><span class="ps-blue ps-count">{{ total }}</span>
        <label>CPU/内存/磁盘：</label><span class="ps-yellow ps-count">{{ cpu }}个/{{ memory }}G/{{ disk }}G</span>
      </div>
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
    <!-- 修改规格 -->
    <el-dialog
      title="修改规格"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="no"
      custom-class="accountManageDialog"
      top="9%"
      width="40%"
      @close="resetD(&quot;aform&quot;)"
    >
      <el-form ref="aform" :model="aform" :rules="rules2">
        <el-form-item label="CPU(个)：" :label-width="formLabelWidth" prop="cpu">
          <el-input v-model="aform.cpu" placeholder="请输入1至16整数(单位G)" :style="{width:inputLabelWidth}" />
        </el-form-item>
        <el-form-item label="内存(MB)：" :label-width="formLabelWidth" prop="memory">
          <el-input v-model="aform.memory" placeholder="请输入1至32整数(单位G)" :style="{width:inputLabelWidth}" />
        </el-form-item>
        <el-form-item label="描述：" :label-width="formLabelWidth" prop="specDes">
          <el-input
            v-model="aform.specDes"
            type="textarea"
            :autosize="{minRows: 6, maxRows: 6 }"
            placeholder="请输入描述,最多255个字"
            :style="{width:inputLabelWidth}"
          />
        </el-form-item>
        <el-form-item label="" :label-width="formLabelWidth">
          <div style="color:red;text-align: left;font-size: 12px;line-height: 20px;">修改成功之后需要重启</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 延期 -->
    <el-dialog
      title="延期申请"
      :visible.sync="dialogFormVisibleP"
      :close-on-click-modal="no"
      top="15%"
      width="35%"
      show-close
      class="frozeDialog"
      @close="resetD(&quot;postform&quot;)"
    >
      <el-form ref="postform" :model="postform" :rules="postformrule" label-width="80px">
        <el-form-item prop="Ftime" label="延长日期">
          <el-date-picker
            v-model="postform.Ftime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择延期时间"
            :editable="no"
            :clearable="no"
            :picker-options="pickerOptions2"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="postSubmit">确定</el-button>
        <el-button @click="dialogFormVisibleP = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 增加磁盘 -->
    <el-dialog
      title="增加磁盘"
      :visible.sync="dialogFormVisibleDisk"
      :close-on-click-modal="no"
      custom-class="accountManageDialog"
      top="15%"
      width="35%"
      @close="resetD(&quot;dform&quot;)"
    >
      <el-form ref="dform" :model="dform" :rules="ruled">
        <el-form-item label="磁盘容量：" :label-width="formLabelWidth" prop="disk">
          <el-input v-model="dform.disk" placeholder="请输入10至1024整数(单位G)" :style="{width:inputLabelWidth}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addDisk('dform')">确 定</el-button>
        <el-button @click="dialogFormVisibleDisk = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 同步桌面 -->
    <el-dialog
      title="同步桌面"
      :visible.sync="dialogFormVisibleSyn"
      :close-on-click-modal="no"
      custom-class="accountManageDialog"
      top="15%"
      width="35%"
      @close="resetD(&quot;dform&quot;)"
    >
      <el-form ref="sform" :model="sform" :rules="rulesyn">
        <el-form-item label="请选择FA：" :label-width="formLabelWidth" prop="fa">
          <el-select v-model="sform.fa" style="width:190px;" placeholder="请选择FA">
            <el-option v-for="(item,index) in faList" :key="index" :value="item.faIP" :label="item.faName">
              {{ item.faName }}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="synDesk('sform')">确 定</el-button>
        <el-button @click="dialogFormVisibleSyn = false">取 消</el-button>
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
import {
  selectRunState,
  selectLoginState,
  tableHeader
} from '@/api/resources'
export default {
  data() {
    var nan16 = (rule, value, callback) => {
      if (value && value % 1 === 0 && value <= 16) {
        callback()
      } else {
        callback('请输入正确的数字')
      }
    }
    var nan32 = (rule, value, callback) => {
      if (value && value % 1 === 0 && value <= 32) {
        callback()
      } else {
        callback('请输入正确的数字')
      }
    }
    var nan1024 = (rule, value, callback) => {
      if (value && value % 1 === 0 && value <= 1024) {
        callback()
      } else {
        callback('请输入正确的数字')
      }
    }
    var blow255 = (rule, value, callback) => {
      if (value && value.length <= 255) {
        callback()
      } else {
        callback('请填写描述')
      }
    }
    return {
      btnLoading: false,
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
      currentPage4: 0,
      currentSize: 10,
      multSelection: [],
      selectRowData: [],
      applyUser: '',
      applyTable: '',
      applyState: '',
      applyLoginState: '',
      loadingState: false,
      text: '请稍后',
      dialogFormVisible: false,
      aform: {
        cpu: '',
        memory: '',
        specDes: ''
      },
      rules2: {
        cpu: [{
          required: true,
          validator: nan16,
          trigger: 'blur'
        }],
        memory: [{
          required: true,
          validator: nan32,
          trigger: 'blur'
        }],
        specDes: [{
          required: true,
          validator: blow255,
          trigger: 'blur'
        }]
      },
      formLabelWidth: '110px',
      inputLabelWidth: '300px',
      dialogFormVisibleP: false,
      postform: {
        Ftime: ''
      },
      postformrule: {
        Ftime: [{
          required: true,
          message: '请选择延长的日期',
          // validator: nan32,
          trigger: 'blur'
        }]
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      dialogFormVisibleDisk: false,
      dform: {
        disk: ''
      },
      ruled: {
        disk: [{
          required: true,
          validator: nan1024,
          trigger: 'blur'
        }]
      },
      faList: [],
      dialogFormVisibleSyn: false,
      sform: {
        fa: ''
      }
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
    synDesk(formName) {
      var params = {}
      params.faIp = this.sform.fa
      this.text = '正在同步,请稍后...'
      this.loadingState = true
      httpAjax('/desktop/queryVmInfo', params).then(res => {
        this.dialogFormVisibleSyn = false
        this.loadingState = false
        if (res.success == 'success') {
          this.$message({
            type: 'success',
            message: '同步成功!'
          })
          // this.$alert('同步成功!', '同步桌面', {
          //     confirmButtonText: '确定',
          //     type: 'success',
          //     callback: action => {
          //         // this.multSelection = []
          this.getVmList()
          //     }
          // });
        } else {
          this.$message({
            type: 'error',
            message: '通讯错误,请刷新页面后访问!'
          })
        }
      }).catch(() => {
        this.loadingState = false
      })
    },
    refreshData() {
      httpAjax('/system/faList').then(res => {
        if (res.data) {
          this.faList = res.data
          this.sform.fa = res.data[0].faIP
          this.dialogFormVisibleSyn = true
        } else {
          this.$message.error('通信错误')
        }
      }).catch(() => {
      })
    },
    resetD(formName) {
      switch (formName) {
        case 'aform':
          this.aform = {
            cpu: '',
            memory: '',
            specDes: ''
          }
          this.$refs['aform'].resetFields()
          break
        case 'postform':
          this.postform = {
            Ftime: ''
          }
          this.$refs['postform'].resetFields()
        case 'dform':
          this.dform = {
            disk: ''
          }
          this.$refs['dform'].resetFields()
        default:
          break
      }
    },
    updateDisk(data) {
      this.selectRowData = [data]
      this.dialogFormVisibleDisk = true
    },
    addDisk() { // 增加磁盘
      this.$refs['dform'].validate((valid) => {
        const params = {}
        const checkStatus = this.selectRowData[0]
        params.computerName = checkStatus.computerName
        params.faIp = checkStatus.faIp
        params.disk = this.dform.disk
        if (valid) {
          this.btnLoading = true
          httpAjax('/desktop/userUpdateDisk', params).then(res => {
            if (res.result == 'success') {
              this.$message({
                type: 'success',
                message: '请在我的申请中查看审批结果!'
              })
              // this.$alert('请在我的申请中查看审批结果!', '增加磁盘', {
              //   confirmButtonText: '确定',
              //   type: 'success',
              //   callback: action => {
              //     this.multSelection = []
              //     this.getVmList()
              //   }
              // });
            } else {
              this.$message({
                type: 'error',
                message: '已经提交过，正在审核中!'
              })
            }
            this.getVmList()
            this.dialogFormVisibleDisk = false
            this.btnLoading = false
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    postpone() {
      this.dialogFormVisibleP = true
    },
    postSubmit() { // 延期申请
      this.$refs['postform'].validate((valid) => {
        const params = {}
        const checkStatus = this.multSelection[0]
        params.computerName = checkStatus.computerName
        params.faIp = checkStatus.faIp
        params.deadline = this.postform.Ftime
        if (valid) {
          this.btnLoading = true
          httpAjax('/desktop/postpone', params).then(res => {
            if (res.result == 'success') {
              this.$message.success('请在我的申请中查看审批结果!')
              // this.$alert('请在我的申请中查看审批结果!', '延期申请', {
              //   confirmButtonText: '确定',
              //   type: 'success',
              //   callback: action => {
              //     this.multSelection = []
              //     this.getVmList()
              //   }
              // });
            } else {
              this.$message({
                type: 'error',
                message: '已经提交过，正在审核中!'
              })
            }
            this.getVmList()
            this.dialogFormVisibleP = false
            this.btnLoading = false
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addAccount(formName) { // 修改规格
      this.$refs[formName].validate((valid) => {
        const f = {
          ...this.aform
        }
        const checkStatus = this.multSelection[0]
        f.computerName = checkStatus.computerName
        f.faIp = checkStatus.faIp
        if (valid) {
          this.btnLoading = true
          httpAjax('/desktop/userUpdateDesk', f).then(res => {
            if (res.result == 'success') {
              this.$message({
                type: 'success',
                message: '请在我的订单中查看审批结果!'
              })
              // this.$alert('请在我的订单中查看审批结果!', '修改规格', {
              //   confirmButtonText: '确定',
              //   type: 'success',
              //   callback: action => {
              //     this.multSelection = []
              //     this.getVmList()
              //   }
              // });
            } else {
              this.$message({
                type: 'error',
                message: '已经提交过，正在审核中!'
              })
            }
            this.getVmList()
            this.dialogFormVisible = false
            this.btnLoading = false
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateDesk() {
      this.dialogFormVisible = true
    },
    start() {
      const params = {}
      const checkStatus = this.multSelection[0]
      params.vmId = checkStatus.vmId
      params.faIp = checkStatus.faIp
      params.siteId = checkStatus.siteId
      this.text = '正在启动虚机, 请稍后...'
      this.loadingState = true
      httpAjax('/desktop/start', params).then(res => {
        this.loadingState = false
        if (res.resultCode == '0') {
          this.$message.success('启动需要一定的时间，请耐心等待!')

          // this.$alert('启动需要一定的时间，请耐心等待!', '启动成功', {
          //   confirmButtonText: '确定',
          //   type: 'success',
          //   callback: action => {
          //     this.multSelection = []
          //     this.getVmList()
          //     // this.$message({
          //     //   type: 'info',
          //     //   message: `action: ${ action }`
          //     // });
          //   }
          // });
          // layer.alert('请通知管理员配置UNS连接地址!', {
          //     icon: 5
          // });
        } else {
          this.$message({
            type: 'error',
            message: res.resultDesc
          })
        }
        this.multSelection = []
        this.getVmList()
      }).catch(() => {
        this.loadingState = false
      })
    },
    restart() {
      this.$confirm('确定要重启该桌面?', '重启桌面', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {}
        const checkStatus = this.multSelection[0]
        params.vmId = checkStatus.vmId
        params.faIp = checkStatus.faIp
        params.siteId = checkStatus.siteId
        this.text = '正在重启虚机, 请稍后...'
        this.loadingState = true
        httpAjax('desktop/reStart', params).then(res => {
          this.loadingState = false
          if (res.resultCode == '0') {
            this.$message.success('启动需要一定的时间，请耐心等待!')
            // this.$alert('启动需要一定的时间，请耐心等待!', '启动成功', {
            //   confirmButtonText: '确定',
            //   type: 'success',
            //   callback: action => {
            //     this.multSelection = []
            //     this.getVmList()
            //     // this.$message({
            //     //   type: 'info',
            //     //   message: `action: ${ action }`
            //     // });
            //   }
            // });
            // layer.alert('请通知管理员配置UNS连接地址!', {
            //     icon: 5
            // });
          } else {
            this.$message({
              type: 'error',
              message: res.resultDesc
            })
            //  this.multSelection = []
          }
          this.multSelection = []
          this.getVmList()
        }).catch(() => {
          this.loadingState = false
        })
      }).catch(() => {

      })
    },
    detach() { // 清退
      this.$confirm('确定要清退该桌面?', '清退桌面', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确定
        this.loadingState = true
        const params = {}
        const checkStatus = this.multSelection[0]
        params.computerName = checkStatus.computerName
        params.faIp = checkStatus.faIp
        this.text = '正在申请清退桌面, 请稍后...'
        httpAjax('desktop/userDetach', params).then(res => {
          this.loadingState = false
          if (res.result == 'success') {
            this.$message({
              type: 'success',
              message: '申请成功,请在我的申请中查看审批结果!'
            })
            //   this.$alert('请在我的订单中查看审批结果!', '清退桌面', {
            //     confirmButtonText: '确定',
            //     type: 'success',
            //     callback: action => {
            // this.multSelection = []
            // this.getVmList()
            //     }
            //   });
          } else {
            this.$message({
              type: 'warning',
              message: '已经提交过，正在审核中!'
            })
            // this.multSelection = []
            // this.$alert('已经提交过，正在审核中!', '清退桌面', {
            //   confirmButtonText: '确定',
            //   callback: action => {
            //     this.getVmList()
            //   }
            // });
          }
          this.multSelection = []
          this.getVmList()
        }).catch(() => {
          this.loadingState = false
        })
      }).catch(() => { // 取消

      })
    },
    searchData() {
      this.getVmList()
    },
    clearData(num) {
      this.getVmList()
    },
    exportData() {
      window.open('/dcp/desktop/userExport')
    },
    loginCloud() {
      var params = {
        name: localStorage.getItem('username'),
        initialPassword: localStorage.getItem('password'),
        tenantDomain: localStorage.getItem('domain')
      }
      httpAjax('/user/unsLogin', params).then(res => {
        if (res.noLink) {
          this.$message.error('请通知管理员配置UNS连接地址!')
        } else {
          window.open(res.link + '/servlet/TokenLoginServlet?tokenId=' + res.tokenId)
        }
      })
    },
    checkDisable(type) {
      if (type === 'start') {
        return this.multSelection[0].runState === 'stopped'
      } else if (type === 'restart') {
        return this.multSelection[0].runState === 'running'
      } else if (type === 'quit') {
        return this.multSelection[0].runState !== 'deleted'
      } else if (type === 'edit') {
        return this.multSelection[0].deskType === 'fullcopy_template'
      }
    },
    // handleSelectionChange(val) {
    //   },
    checkSelect(selection, row) {
      // this.tableChecked = [row]
      if (selection.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(selection[0])
      }
      this.multSelection = selection
      // console.log(selection, row)
    },
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
        page: this.currentPage4 + 1,
        limit: this.currentSize,
        user: this.applyUser,
        computerName: this.applyTable,
        runState: this.applyState,
        loginState: this.applyLoginState
      }
      const url = `desktop/myResource?${Math.random()}&${first === 1 ? 'online=1' : ''}`
      httpGet(url, para).then((res) => {
        this.tableData = res.data
        this.tableHeight = computedTableHeight()
        this.vmTableLoadingState = false
        this.count = res.count
        this.$nextTick(() => {
          this.setScrollBar('#table-wrap')
        })
        this.getStatistics()
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
    getStatistics() { // 底部获取数据
      const url = 'desktop/userStatistics?online=1'
      httpAjax(url).then((res) => {
        if (res.cpu) {
          this.total = res.merCnt
          this.cpu = res.cpu
          this.memory = res.memory
          this.disk = res.disk
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // patternState(obj) {
    //   let state = obj.opType
    //   return state == 'set' ? '维护模式' : '工作模式'
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
#myDesk{
  padding:20px;
}
.button-wrap{
  margin: 10px 0;
}
  .bottomWrap {
    position: absolute;
    padding: 0 15px 0px 15px;
    bottom: 0;
    width: calc(100% - 30px);
    height: 40px;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #606266;
  }

</style>
