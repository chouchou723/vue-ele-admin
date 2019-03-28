
export const selectRunState = [{ label: '运行中', value: 'running' }, { label: '创建中', value: 'creating' },
  { label: '已停止', value: 'stopped' }, { label: '启动中', value: 'starting' }, { label: '停止中', value: 'stopping' }, { label: '故障恢复中', value: 'fault-resuming' }]

export const selectLoginState = [{ label: '断开连接', value: '23' }, { label: '使用中', value: '25' },
  { label: '就绪', value: '0' }, { label: '未注册', value: '-3' }]

export const tableHeader = [
  { type: 'selection', width: 60 },
  { title: '申请人', key: 'user', width: 150 },
  { title: '桌面名称', key: 'computerName', width: 210 },
  { title: 'IP地址', key: 'ip', width: 130 },
  {
    title: '桌面类型',
    key: 'deskType',
    width: 150,
    render: (h, params) => {
      return h('span', clouldType(params))
    }
  },
  { title: 'CPU/内存/磁盘', key: 'feature', width: 150 },
  {
    title: '运行状态',
    key: 'runState',
    width: 150,
    render: (h, params) => {
      return h('span', runState(params))
    }
  },
  {
    title: '登录状态',
    key: 'loginState',
    width: 120,
    render: (h, params) => {
      return h('span', loginState(params))
    }
  },
  {
    title: '分配状态',
    key: 'attachState',
    width: 120,
    render: (h, params) => {
      return h('span', branchState(params))
    }
  },
  { title: '创建时间', key: 'createTimeStr', width: 180 },
  { title: '到期日', key: 'deadline', width: 130 }
]

export function runState(params) {
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
}

export function loginState(params) {
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
}

export function branchState(params) {
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
}

export function clouldType(params) {
  console.log(params)
  const deskType = params.row.deskType
  if (deskType == 'fullcopy_template') {
    return '完美复制'
  } else if (deskType == 'linkclone_template') {
    return '链接克隆'
  } else if (deskType == 'VDI_memoryClone_template') {
    return '全内存'
  }
}
