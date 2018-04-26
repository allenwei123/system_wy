const path=[
  //保养模板
  {
    name:'maintenanceTmpl',
    path:'/maintenanceTmpl',
    component: (resolve) => require(["@/page/home/sysManagement/maintenanceTmpl/list"], resolve)
  },
  // 模板项
  {
    name: 'maintenanceTmplItems',
    path: '/maintenanceTmpl/items',
    component: (resolve) => require(["@/page/home/sysManagement/maintenanceTmpl/items"], resolve)
  },
  // 权限管理
  {
    name: 'permission',
    path: '/permission',
    component: (resolve) => require(["@/page/home/sysManagement/permission/index"], resolve)
  },
  //企业信息
  {
    name: 'companyInfo',
    path: '/companyInfo',
    component: (resolve) => require(["@/page/home/sysManagement/companyInfo/detail"], resolve)
  },
  //企业信息编辑
  {
    name: 'companyInfoEdit',
    path: '/companyInfo/edit',
    component: (resolve) => require(["@/page/home/sysManagement/companyInfo/edit"], resolve)
  },
  //个人信息
  {
    name: 'profile',
    path: '/profile',
    component: (resolve) => require(["@/page/home/sysManagement/profile/index"], resolve)
  },
  //消息管理
  {
    name: 'notice',
    path: '/notice',
    component: (resolve) => require(["@/page/home/sysManagement/notice/list"], resolve)
  }
]
export default path
