const endmangementUrl={//终端管理
	list:'/device/list',//别表
	edit:'/device/edit',//编辑
	add:'/device/add',//新增
	detail:'/device/',//{id}/detail'详情
	delete:'/device/',//{id}/delete'删除
	commyList:'/company/list',//公司名称
},

 operationMonitoringUrl={//运行监控
 	projectName:'/house/list',
 	buildName:'/build/list',//楼栋名称
 	elevtorName:'/elevator/list',//电梯名称
 	list:'/elevator/realTimeData',//实时监控列表
 	runData:'/elevator/',//{id}/rundata',

},

 troubleMangerUrl={//故障管理
 	projectName:'/house/list',
 	buildName:'/build/list',//楼栋名称
 	elevtorName:'/elevator/list',//电梯名称
	list:'/elevatorDeclare/list',//故障列表
	detail:'/',//详情
	troubleLog:'/elevatorDeclare/stateDetail/',//{id}故障详情
	troubleDo:'/elevatorDeclare/opt',//故障处理

	add:'',

};

export{endmangementUrl,operationMonitoringUrl,troubleMangerUrl}