//基础管理
const path = [
  //合同管理
  {
    name:'contractManage',
    path: '/contractManage',
    props: true,
    component: () => import(/*webpackChunkName:"contractManageList"*/'@/page/home/basis/contractManage/list'),
    children:[
      //合同详情
      {
        name:'contractManageDetail',
        path:'/contractManage/detail',
        component: () => import(/*webpackChunkName:"contractManageDetail"*/'@/page/home/basis/contractManage/detail')
      }
    ]
  },
  //电梯管理
  {
    name:'certificateManage',
    path: '/certificateManage',
    component: () => import("@/page/home/basis/certificateManage/list"),
    children:[
      {
        name:'certificateManageAdd',
        path: '/certificateManage/add/:type/:id',
       component: () => import("@/page/home/basis/certificateManage/add"),
      }
    ],

  },
  //客户管理
  {
    name:'cusManage',
    path: '/cusManage',
    props: true,
    component: () => import(/*webpackChunkName:"cusManageList"*/'@/page/home/basis/cusManage/list'),
  },
  //项目管理
  {
    name:'projectManage',
    path: '/projectManage',
    component: () => import(/*webpackChunkName:"projectManageList"*/'@/page/home/basis/projectManage/list'),
    children:[
      {
        name:'projectManageAdd',
        path: '/projectManage/add',
        component: () => import(/*webpackChunkName:"projectManageList"*/'@/page/home/basis/projectManage/add')
      },{
        name:'projectManageDetail',
        path: '/projectManage/detail/:id',
        component: () => import(/*webpackChunkName:"projectManageList"*/'@/page/home/basis/projectManage/detail')
      },
      {
        name:'projectManageContarctDetail',
        path: '/projectManage/contarctDetail/:type/:id',
        component: () => import(/*webpackChunkName:"projectManageList"*/'@/page/home/basis/projectManage/contarctDetail')
      },
       {
        name:'projectManageLift',
        path: '/projectManage/list',
        component: () => import(/*webpackChunkName:"projectManageList"*/'@/page/home/basis/certificateManage/list')
      }
    ],
  },
  //班组管理
  {
    name:'teamManage',
    path:'/teamManage',
    component: () => import(/*webpackChunkName:"teamManageList"*/'@/page/home/basis/teamManage/list'),
    children:[
      //保养路线
      {
        name:'maintainLine',
        path:'/teamManage/maintainLine',
        props: true,
        component: () => import(/*webpackChunkName:"maintainLine"*/'@/page/home/basis/teamManage/maintainLine'),
      }
    ]
  },
  //职工管理
  {
    name: 'employeeManage',
    path: '/employeeManage',
    props: true,
    component: () => import(/*webpackChunkName:"employeeManageList"*/'@/page/home/basis/employeeManage/list'),
    children:[
      //职工新增
      {
        name:'employeeManageDetail',
        path:'/employeeManage/detail',
        component: () => import(/*webpackChunkName:"employeeManageDetail"*/'@/page/home/basis/employeeManage/detail')
      },
      //保养计划
      {
        name:'maintainPlan',
        path:'/employeeManage/maintainPlan',
        component: () => import(/*webpackChunkName:"maintainPlan"*/'@/page/home/basis/employeeManage/maintainPlan')
      }
    ]
  },
  //楼盘管理
  {
    name: 'bulidListManger',
    path: '/bulidListManger',
    component: () => import("@/page/home/basis/buildMangers/list"),
    children:[
      {
        name: 'bulidListMangerAdd',
        path: 'bulidListManger/bulidListMangerAdd',
        component: () => import("@/page/home/basis/buildMangers/add")

      },
      {
        name: 'buildmanger',
        path: '/bulidListManger/buildmanger',
        component: () => import("@/page/home/basis/buildMangers/buildmanger")

      },
    ],
  }
]

export default path;
