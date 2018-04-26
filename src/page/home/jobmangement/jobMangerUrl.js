const maintainHttpUrl={//保养管理
	list:'/maintenance/list',
	detail:'/maintenance/',
  projectName:'/house/list',//筛选项目名称
  buildName:'/build/list',//楼栋名称

},repairHttpUrl = {//维修管理
  list:'/declare/list',
  detail:'/declare/',//{id}/detail
  searchProject:'/house/list',//搜索项目
  searchBuild:'/build/list',//搜索楼栋
  searchWorkGroup:'/workGroup/list',//搜索班组
  dispatch:'/declare/sendFaultToSkillMan',//派工
  nearWorkGroup:'/workGroup/nearWorkGroup',//附近班组
  getUserLocation:'/userLocation/list',//获取用户位置
},
//年检
annualHttpUrl ={
	list:'/annualExamine/list',
  detail:'/annualExamine/',//{id}/detail'详情
  confirm:'/annualExamine/commit',//体检年检报告；
  projectName:'/house/list',//获取项目名称
  buildName:'/build/list',//获取楼栋名称

}


export {maintainHttpUrl,repairHttpUrl,annualHttpUrl};
