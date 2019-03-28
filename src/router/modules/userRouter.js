import Layout from '@/views/layout/Layout'

const userRouter = {
  path: '/mydeskList',
  component: Layout,
  redirect: 'noredirect',
  name: 'mydeskList',
  meta: {
    title: '桌面管理',
    icon: 'chart'
  },
  children: [
    {
      path: 'myDesk',
      component: () => import('@/views/user/my-desk'),
      name: 'myDesk',
      meta: { title: 'myDesk' }
    },
    {
      path: '/deskRecycle',
      component: () => import('@/views/user/deskRecycle')
    },
    // {
    //     path:'/desktopApply',
    //     component:()=> import ('@/views/user/desktop-apply'),
    // },
    {
      path: '/myOrder',
      component: () => import('@/views/user/my-order')
    },
    {
      path: '/myFailed',
      component: () => import('@/views/user/my-ticket-failed')
    },
    {
      path: '/myTicket',
      component: () => import('@/views/user/my-ticket')
    },
    {
      path: '/pwdPage',
      component: () => import('@/views/user/desktop-pwd')
    },
    {
      path: '/secretKey',
      component: () => import('@/views/user/secret-key')
    }
    //   {
    //       path:'/appliedDesktopPage',
    //       component:()=> import('@/views/user/appliedDesktopPage'),
    //   },
    //   {
    //       path:'/userLoginPage',
    //       component:()=> import('@/views/user/userLoginPage'),
    //   },
    //   {
    //       path:'/operationPage',
    //       component:()=> import('@/views/user/operationPage'),
    //   }
  ]
}
export default userRouter

