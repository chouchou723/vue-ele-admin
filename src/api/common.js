const oDate = new Date()
const year = oDate.getFullYear()
const month = oDate.getMonth() + 1
const oneDay = oDate.getDate()
import axios from 'axios'
import { Message } from 'element-ui'
import Qs from 'qs'
export const minTime = {
  disabledDate(date) {
    return date && date.valueOf() < Date.now() - 86400000
  }
}

export const pageConfig = {
  arr: [5, 10, 15],
  fiveStrip: 5,
  tenStrip: 10
}

// export  const webroot = 'http://172.16.1.135:8080/dcp/';
export const webroot = '/dcp/'
export const adminIndex = {
  index: 0
}
export const tenantIndex = {
  index: 1
}
export const userIndex = {
  index: 2
}

export const xhrFields = {
  withCredentials: true,
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*'
}

// 重载
export function reloadViewModel(self) {
  var key = new Date().getTime()
  self.$store.dispatch('setViewKey', key)
}

// export function httpAjax(url, data){
//     const params = data ? data :''
//     return new Promise((resolve, reject)=>{
//         $.ajax({
//             url: `${webroot}${url}`,
//             type: 'POST',
//             dataType: 'json',
//             xhrFields,
//             data: params,
//             success:(res)=>{
//                 resolve(res)
//             },
//             error:(error)=>{
//                 reject(error)
//             }
//         })
//     })
// }
axios.interceptors.response.use(function(response) {
  return response
}, function(error) {
  // 处理统一的验证失效错误
  if (error.response.status == 401) {
    Message.error('您的帐号已在其他地方登录,请重新登录')
    router.push('/login')
  } else if (error.response.status == 405) {
    Message.error('请联系管理员确认您的权限')
  } else if (error.response.status == 500) {
    Message.error('服务器内部错误,请联系管理员')
  } else {
    Message.error('通信错误!请联系管理员检查该问题')
  }
  return Promise.reject(error)
})
export const httpAjax = (url, data) => {
  const params = data || ''
  const configs = {
    headers: {
      'withCredentials': true,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return axios.post(`${webroot}${url}`, Qs.stringify(params), configs).then(res => res.data)
}
export const httpGet = (url, data) => {
  const params = data || ''
  const configs = {
    headers: {
      'withCredentials': true,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return axios.get(`${webroot}${url}`, {
    params: params
  }, configs).then(res => res.data)
}

export function formatTime(value) {
  var time = value.row.createTime
  var res = ''
  if (time) {
    var unixTimestamp = new Date(time)
    res = unixTimestamp.toLocaleString()
  }
  return res
}

export function computedTableHeight() {
  const contentBoxHeight = parseInt($('#content').outerHeight(true))
  const searchBoxHeight = parseInt($('.search-wrap').outerHeight(true))
  const buttonBoxHeight = parseInt($('.button-wrap').outerHeight(true))
  let result = ''
  if (isNaN(buttonBoxHeight)) {
    result = contentBoxHeight - searchBoxHeight
  } else if (!isNaN(buttonBoxHeight) && !isNaN(searchBoxHeight)) {
    result = contentBoxHeight - (searchBoxHeight + buttonBoxHeight)
  }

  if (isNaN(buttonBoxHeight) && isNaN(searchBoxHeight)) result = contentBoxHeight
  return result - 70
}

export function addScrollBar(id, bool, type) {
  var domNode
  if (type === 'all') { // 全页调用all
    domNode = $(id)
  } else { // 表格中使用
    domNode = $(id).find('.el-table__body-wrapper')
    if (!domNode.length) {
      domNode = $(id)
      // console.log(domNode)
    }
  }
  var fn = {
    whileScrolling: function() {
      var left = domNode.find('.mCSB_container[dir=ltr]').css('left')
      $(id).find('.el-table__header-wrapper table').css({
        'position': 'relative',
        'left': left
      })
    }
  }
  domNode.mCustomScrollbar('update')
  domNode.mCustomScrollbar({ // 表格 滚动条
    theme: 'dark',
    axis: bool ? 'y' : 'xy',
    callbacks: bool ? {} : fn
  })
}

