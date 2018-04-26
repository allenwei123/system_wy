const path =[
//数据统计
	/*{
    name:'datastatics',
    path: '/datastatics',
    component: (resolve) => require(["@/page/home/jobmangement/maintain/index"], resolve)
  },*/
  //终端管理
  {
    name:'endmangement',
    path: '/endmangement',
    component: (resolve) => require(["@/page/home/unioncenter/endmangement"], resolve),
    children:[
      {
        name:'endmangementAdd',
        path: '/endmangementAdd',
        component: () => import("@/page/home/unioncenter/endmangement/add"),
      }

    ]

  },
  //运行监控
   {
    name:'operation_monitoring',
    path: '/operation_monitoring',
    component: (resolve) => require(["@/page/home/unioncenter/operation_monitoring"], resolve)
  },
  //故障管理
  {
    name:'trouble_manger',
    path: '/trouble_manger',
    component: (resolve) => require(["@/page/home/unioncenter/trouble_manger"], resolve),
   
  },
]
export default path