<template>
	<div class="warp" v-if="show" @click.self='detailHidden'>
		<div class="mode_in">
			<div class="close"><p @click="detailHidden">X</p></div>
			<div class="chose_list">
				<el-tabs v-model="activeName" @tab-click="handleClick">
				   <el-tab-pane label="实时状态" name="first">
				   		<div class="nowstatus">
				   			<div class="statusleft">
				   				<ul class="statusList">
				   					<li class="title">基本信息</li>
				   					<li>
				   						<span>电梯名称:</span><p>{{listData.name}}</p>
				   					</li>
				   					<li><span>楼栋:</span><p>{{listData.buildName}}</p></li>
				   					<li><span>项目名称:</span><p>{{listData.houseName}}</p></li>
				   					<li><span>电梯型号:</span><p>{{listData.elevatorTypeName}}</p></li>
				   					<li><span>终端编号:</span><p>{{listData.deviceNum}}</p></li>
				   					<li><span>端口号:</span><p>{{listData.devicePort}}</p></li>
				   					<li class="title">当前状态</li>
				   					<li><span>连接状态:</span><p>{{listData.deviceConnectStatus==1?'未连接':'已连接'}}</p></li>
				   					<li><span>终端状态:</span><p>{{listData.elevatorStatus==0?'正常':listData.elevatorStatus==1?'检修':listData.elevatorStatus==2?'终端断开':listData.elevatorStatus==3?'故障':''}}</p></li>
				   					<li><span>运行时间:</span><p>{{listData.runDate}}</p></li>
				   					<li><span>运行次数:</span><p>{{listData.runCount}}</p></li>
				   					<li><span>运行距离:</span><p>{{listData.runningDistance}}</p></li>
				   					<li><span>开门次数:</span><p>{{listData.mainDoorOpenCount}}</p></li>
				   					
				   				</ul>
				   				
				   				<div class="title">故障状态</div>
				   				<div class="troublespan">
				   					<span v-for='(items,indexs) in listData.faultMessage'>{{items}}</span>
				   					
				   				</div>
				   			</div>
				   			<div class="statusright">
				   				<div class="updown"><img class="down" :src="listData.direction==1?downUrl:downLinkUrl" alt=""><span>{{listData.currentFloor}}</span><img class="up" :src="listData.direction==1?uplinkUrl:upUrl" alt=""></div>
				   				<div class="statusright_lift">
				   					<img src="./lift.jpg" alt="">
				   				</div>
				   			</div>
				   		</div>	
				   </el-tab-pane>

				   <el-tab-pane label="视频监控" name="second">
				   	
				   </el-tab-pane>

				   <el-tab-pane label="信号点" name="third">
						<div class="singpoint">
							
							<div class="title">运行信号</div>
								<div class="move_statics">
									<span :class="{goodbtn:isgood}" v-for='(item,index) in moveList'>{{item}}</span>
								</div>
							<div class="title">门机信号</div>
								<div class="move_statics">
									<span v-for='(item,index) in doorMichane'>{{item}}</span>
								</div>
							<div class="title">状态信号</div>
								<div class="move_statics">
									<span v-for='(item,index) in staticesinge'>{{item}}</span>
								</div>
							<div class="title">主门信号</div>
								<div class="move_statics">
									<span v-for='(item,index) in hosedoorSinge'>{{item}}</span>
								</div>
							<div class="title">副门信号</div>
								<div class="move_statics">
									<span v-for='(item,index) in deputydoor'>{{item}}</span>
								</div>
							<div class="title">制动信号</div>
								<div class="move_statics">
									<span v-for='(item,index) in barking'>{{item}}</span>
								</div>
							<div class="title">检修信号</div>
								<div class="move_statics">
									<span v-for='(item,index) in accessSing'>{{item}}</span>
								</div>
						</div>
				   </el-tab-pane>

				   <el-tab-pane label="电梯信息" name="fourth">
						<ul class="liftmasage">
							<li>
								<span>电梯编号:</span>
								<p>{{listData.elevatorId}}</p>
							</li>
							<li>
								<span>电梯类型:</span>
								<p>{{listData.typeName}}</p>
							</li>
							<li>
								<span>电梯名称:</span>
								<p>{{listData.name}}</p>
							</li>
							<li>
								<span>电梯用途:</span>
								<p>{{listData.useTypeName}}</p>
							</li>
							<li>
								<span>注册代吗:</span>
								<p>{{listData.registerCode}}</p>
							</li>
							<li>
								<span>开门方式:</span>
								<p>{{listData.openTypeName}}</p>
							</li>
							<li>
								<span>品牌:</span>
								<p>{{listData.brandName}}</p>
							</li>
							<li>
								<span>电梯安装日期:</span>
								<p>{{new Date(listData.installationTime).toLocaleDateString().replace(/\//g,'-')}}</p>
							</li>
							<li>
								<span>梯种:</span>
								<p>{{listData.elevatorTypeName}}</p>
							</li>
							<li>
								<span>梯龄:</span>
								<p>{{listData.liftAge}}</p>
							</li>
							
						</ul>
				   </el-tab-pane>
				 </el-tabs>
			</div>
		</div>
	</div>
</template>
<script>
import {operationMonitoringUrl} from '@/page/home/unioncenter/unioncenterUrl';
	export default{
		data(){
			return{
				upUrl:'./static/img/up.png',
				uplinkUrl:'./static/img/uplink.png',
				downUrl:'./static/img/downlink.png',
				downLinkUrl:'./static/img/down.png',
				 activeName:'first',
				 form:{},
				 isgood:true,
				 moveList:["上行","下行" ,"上行极限" ,"下行极限","硬件安全回路","软件安全回路","层数测定","自救运行","停电自救"],
				 doorMichane:["轿门锁信号","厅门锁信号","厅轿门旁路输入1","厅轿门旁路输入2"],
				 staticesinge:["内召","外召","消防","司机","门区","专用","超载"],
				 hosedoorSinge:["主门开门"  ,"主门关门"  ,"主门开门极限"  ,"主门关门极限" ,"主门光幕"  ,"主门安全触板" ],
				 deputydoor:["副门开门" ,"副门关门", "副门开门极限" ,"副门关门极限" ,"副门光幕","副门安全触板"],
				 barking:["一级上减速", "二级上减速", "三级上减速" ,"一级下减速" ,"二级下减速", "三级下减速" ],
				 accessSing:["轿内检修", "机房检修","IP柜检修" ,"轿顶检修" ,"底坑检修" ,"遥监检修"],

			}
		},
		props:{
			show:{
				default:true,
				type:Boolean,
			},
			id:{
				default:null,
				type:String,
			},
			listData:{
				default:null,
				type:Object,
			},
		},
		mounted(){
			console.log(this.listData)
			// this.$xttp.get(operationMonitoringUrl.runData+this.id+'/rundata').then(res=>{
			// 	console.log(res)
			// })
		},
		created(){},
		methods:{
			detailHidden(){
				this.$emit('detailHidden')
			},
			 handleClick(tab, event) {
		        console.log(tab, event);
		     },
		}
	}
</script>
<style lang='scss' scoped>
	.warp{
		width:100%;
		height:100%;
		background:rgba(0,0,0,0.5);
		position:fixed;
		top:0;
		left:0;
		z-index:88;
		.mode_in{
			width:553px;
			height:560px;
			background:white;
			margin:60px auto 0 auto;
			padding:15px;
			box-sizing:border-box;
			-o-box-sizing:border-box;
			-ms-box-sizing:border-box;
			-moz-box-sizing:border-box;
			-webkit-box-sizing:border-box;
			.close{
				height:20px;
				width:100%;
				p{
					width:20px;
					height:20px;
					float:right;
					font-weight:bold;
					font-size:20px;
					cursor:pointer;
				}
			}
			.chose_list{
				width:100%;
				height:526px;
			}
		}
	}
	.nowstatus{
		width:100%;
		height:100%;
		display:flex;
		.statusleft{
			width:55%;
			height:100%;
		}
		.statusright{
			width:45%;
			height:100%;
			.updown{
				height:60px;
				width:100%;
				display:flex;
				padding-top:30px;
				box-sizing:border-box;
			-o-box-sizing:border-box;
			-ms-box-sizing:border-box;
			-moz-box-sizing:border-box;
			-webkit-box-sizing:border-box;
				span{
					display:block;
					width:33%;
					text-align:center;
					font-weight:bold;
					color:#ff0000;

				}
				.up{
					display:block;
					width:33%;
					height:18px;
				}
				.down{
					display:block;
					width:33%;
					height:18px;
				}
			}
			.statusright_lift{
				width:100%;
				img{
					display:block;
					width:100%;
					height:auto;
				}
			}
		}
	}

	.statusList{
		width:100%;
		height:100%;
		li{
			height:23px;
			line-height:23px;
			diplay:flex;
			font-size:14px;
			display:flex;
			span{
				display:block;
				width:30%;
				height:100%;
				text-align:right;
			}
			p{
				padding-left:10px;
				box-sizing:border-box;
				-o-box-sizing:border-box;
				-ms-box-sizing:border-box;
				-moz-box-sizing:border-box;
				-webkit-box-sizing:border-box;
			}
		}
		.title{
			height:25px;
			line-heigh:25px;
			font-size:16px;
			font-weith:bold;
		}
		
	}

	.troublespan{
			width:100%;
			height:auto;
			display:flex;
			padding-left:25px;
			box-sizing:border-box;
			-o-box-sizing:border-box;
			-ms-box-sizing:border-box;
			-moz-box-sizing:border-box;
			-webkit-box-sizing:border-box; 
			flex-wrap:wrap;
			span{
				display:block;
				width:72px;
				height:25px;
				color:white;
				font-size:12px;
				background:#ff8a8a;
				line-height:25px;
				text-align:center;
				margin-right:3px;
				border-radius:3px;
				margin-top:3px;
			}
	}

	.singpoint{
		width:100%;
		height:420px;
		overflow-y:auto;
		.title{
			height:25px;
			line-height:25px;
			font-size:14px;
		}
		.move_statics{
			width:100%;
			height:auto;
			display:flex;
			 flex-wrap:wrap;
			padding:5px 10px;
			box-sizing:border-box;
			-o-box-sizing:border-box;
			-ms-box-sizing:border-box;
			-moz-box-sizing:border-box;
			-webkit-box-sizing:border-box; 
			span{
				display:block;
				padding:5px;
				font-size:12px;
				background:#999;
				box-sizing:border-box;
				-o-box-sizing:border-box;
				-ms-box-sizing:border-box;
				-moz-box-sizing:border-box;
				-webkit-box-sizing:border-box; 
				margin-left:5px;
				margin-top:5px;
				border-radius:4px;

			}
			.goodbtn{
				background:#22e235;
				color:white;
			}
		}
	}

	.liftmasage{
		width:100%;
		height:100%;
		display:flex;
		flex-wrap:wrap;
		padding:20px 6px;
		box-sizing:border-box;
			-o-box-sizing:border-box;
			-ms-box-sizing:border-box;
			-moz-box-sizing:border-box;
			-webkit-box-sizing:border-box; 
		li{
			width:50%;
			height:25px;
			line-height:25px;
			display:flex;
			margin-top:6px;

			span{
				display:block;
				width:42%;
				heig:25px;
				line-height:25px;
				text-align:right;
			}
			p{
				width:57%;
				height:100%;
				line-height:25px;
				font-size:15px;
				padding-left:8px;
				box-sizing:border-box;
			-o-box-sizing:border-box;
			-ms-box-sizing:border-box;
			-moz-box-sizing:border-box;
			-webkit-box-sizing:border-box; 
			}
		}
	}
</style>