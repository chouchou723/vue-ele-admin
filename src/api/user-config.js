export default [
  // {
  //     'id':'1',
  //     'text':'资源管理',
  //     'iconfont':'icon-ziyuanguanli',
  //     'size':'19px',
  //     'padLeft':'22px',
  //     'textPadding': '10px',
  //     'children':[
  //         {
  //             'id':'1-1',
  //             'text':'资源列表',
  //             'url':'/adminResource',
  //         }
  //     ]
  // },
  {
    'id': '1',
    'text': '桌面管理',
    'iconfont': 'icon-dingdan1',
    'size': '20px',
    'padLeft': '22px',
    'textPadding': '10px',
    'url': '/deskM',
    'children': [{
      'id': '1-1',
      'text': '桌面申请',
      'url': '/desktopApply'
    }, {
      'id': '1-3',
      'text': '我的申请',
      'url': '/myOrder'
    }, {
      'id': '1-2',
      'text': '我的桌面',
      'url': '/myDesk'
    },

    {
      'id': '1-4',
      'text': '回收站',
      'url': '/deskRecycle'
    }
    ]
  },
  // {
  //     'id':'3',
  //     'text':'订单管理',
  //     'iconfont':'icon-4_5yunzhuomian',
  //     'size':'25px',
  //     'padLeft':'20px',
  //     'textPadding': '10px',
  //     'url':'/orderM',
  //     'children':[
  //         // {
  //         //     'id':'3-1',
  //         //     'text':'订单申请',
  //         //     'url':'/desktopApply1',
  //         // },
  //         {
  //             'id':'3-2',
  //             'text':'我的申请',
  //             'url':'/myOrder',
  //         }
  //     ]
  // },
  {
    'id': '4',
    'text': '工单管理',
    'textPadding': '10px',
    'iconfont': 'icon-dingdan1',
    'size': '20px',
    'padLeft': '22px',
    'url': '/workM',
    'children': [{
      'id': '4-1',
      'text': '失败工单',
      'url': '/myFailed'
    },
    {
      'id': '4-2',
      'text': '工单列表',
      'url': '/myTicket'
    }
    ]
  },
  {
    'id': '5',
    'text': '密码管理',
    'textPadding': '3px',
    'iconfont': 'icon-mimaguanli-copy',
    'size': '25px',
    'padLeft': '18px',
    'url': '/passM',
    'children': [{
      'id': '5-1',
      'text': '密码修改',
      'url': '/pwdPage'
    },
    {
      'id': '5-2',
      'text': '我的秘钥',
      'url': '/secretKey'
    }
    ]
  },
  {
    'id': '6',
    'text': '统计分析',
    'textPadding': '10px',
    'iconfont': 'icon-tongjifenxi',
    'size': '20px',
    'padLeft': '20px',
    'url': '/reportM',
    'children': [{
      'id': '6-1',
      'text': '桌面统计',
      'url': '/appliedDesktopPage'
    },
    // {
    //   'id': '6-2',
    //   'text': '已清退桌面',
    //   'url': '/quitDesktopPage',
    // },
    {
      'id': '6-3',
      'text': '用户登录信息',
      'url': '/userLoginPage'
    },
    {
      'id': '6-4',
      'text': '用户操作日志',
      'url': '/operationPage'
    }
    ]
  },
  {
    'id': '7',
    'text': '帮助中心',
    'textPadding': '10px',
    'iconfont': 'icon-xitongbangzhu',
    'size': '23px',
    'padLeft': '19px',
    'url': '/helpM',
    'children': [{
      'id': '7-1',
      'text': '帮助内容',
      'url': '/userHelpList'
    }]
  }

]
