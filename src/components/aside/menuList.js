const arr = [
  {
    id:'1',
    name:'基础管理',
    icon:'icon-base',
    show: 1,
    group:[
      {
        id:'1-1',
        name:'合同管理',
        show: 1,
        link:'/contractManage',
      },
      {
        id:'1-2',
        name:'客户管理',
        tag:'cusManage',
        show: 1,
        link:'/cusManage',
      },
      {
        id:'1-3',
        name:'楼盘管理',
        show: 1,
        link:'/bulidListManger',
      },
      {
        id:'1-4',
        name:'项目管理',
        show: 1,
        link:'/projectManage',
      },
      {
        id:'1-5',
        name:'电梯管理',
        show: 1,
        link:'/certificateManage',
      },
      {
        id:'1-6',
        name:'班组管理',
        show: 1,
        link:'/teamManage',
      },
      {
        id:'1-7',
        name:'职工管理',
        show: 1,
        link:'/employeeManage',
      },
    ]
  },
  {
    id:'3',
    name:'作业管理',
    show: 1,
    icon:'icon-jindu',
    group:[
      {
        id:'3-1',
        name:'保养管理',
        show: 1,
        link:'/maintaintManage',
      },
      {
        id:'3-2',
        name:'维修管理',
        show: 1,
        link:'/repairManage',
      },
      {
        id:'3-3',
        name:'年检管理',
        show: 1,
        link:'/annualManage',
      }
    ]
  },
  {
    id:'4',
    name:'物联中心',
    show: 1,
    icon:'icon-dyiot',
    group:[

      {
        id:'4-2',
        name:'终端管理',
        show: 1,
        link:'/endmangement',
      },
      {
        id:'4-1',
        name:'运行监控',
        show: 1,
        link:'/operation_monitoring',
      },
      {
        id:'4-3',
        name:'故障管理',
        show: 1,
        link:'/trouble_manger',
      }
    ]
  },
  {
    id:'5',
    name:'仓库管理',
    show: 1,
    icon:'icon-cangku',
    group:[
      {
        id:'5-1',
        name:'配件管理',
        show: 1,
        link:'/unit',
      },
      {
        id:'5-2',
        name:'订单管理',
        show: 1,
        link:'/order',
      },
      // {
      //   id:'5-3',
      //   name:'库存管理',
      //   show: 1,
      //   link:'/home/b4Ma42/3/list333',
      // }
    ]
  },
  {
    id:'6',
    name:'报表中心',
    show: 1,
    icon:'icon-web-icon',
    group:[
      {
        id:'6-1',
        name:'综合报表',
        show: 1,
        link:'/home/eportsrMangement',
      },
      {
        id:'6-2',
        name:'电梯报表',
        show: 1,
        link:'/home/eportsrMangement',
      },
      {
        id:'6-3',
        name:'作业报表',
        show: 1,
        link:'/home/eportsrMangement',
      },
      {
        id:'6-4',
        name:'仓库报表',
        show: 1,
        link:'/home/eportsrMangement',
      }
    ]
  },
  {
    id:'7',
    name:'系统管理',
    show: 1,
    icon:'icon-xitong',
    group:[
      {
        id: '7-0',
        name: '保养模板',
        show: 1,
        link: '/maintenanceTmpl',
      },
      {
        id:'7-1',
        name:'权限管理',
        show: 1,
        link:'/permission',
      },
      {
        id:'7-2',
        name:'企业信息',
        show: 1,
        link:'/companyInfo',
      },
      {
        id:'7-3',
        name:'个人信息',
        show: 1,
        link:'/profile',
      },
      {
        id:'7-4',
        name:'消息管理',
        show: 1,
        link:'/notice',
      }
    ]
  }
]
export default arr;
