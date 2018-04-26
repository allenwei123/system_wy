<template>
	<div class="addwarp" v-if="show==1" @click.self='close'>
		<div class="detail">
			<p class="close" @click="close">X</p>
			<div class="up">
				<div class="form">
					<ul class="form_message">
						<li>
							<span>项目名称：</span>
							<p>{{data.projectName}}</p>
						</li>
						<li>
							<span>楼栋：</span>
							<p>{{data.buildNum}}</p>
						</li>
						<li>
							<span>电梯名称：</span>
							<p><span>{{data.elevatorName}}</span></p>
						</li>
						<li>
							<span>保养单号：</span>
							<p class="li_pM"><span class="datashow">{{data.maintenanceNum }}</span><el-button  size='mini' type="danger" disabled>{{data.status==0?'未开始':data.status==1?'已出发':data.status==2?'保养中':data.status==3?'保养结束':data.status==4?'已完成':data.status==5?'已超期':data.status==5?'已超期':data.status==6?'暂停':data.status==7?'重启':''}}</el-button></p>
						</li>
						<li>
							<span>保养类型：</span>
							<p>{{liftType[data.maintenanceLevel]}}</p>
						</li>



						<li>
							<span>保养模块：</span>
							<p class="li_pM"><i v-for="(item,index) in data.moduleList ">{{item}}</i></p>
						</li>

						<li class="spiceli">
							<span>维保人员：</span>
							<div><p v-for="(item,index) in data.groupMembers">{{item.userName}}</p></div>
						</li>
						<li>
							<span>截止日期：</span>
							<p>{{data.planStartTime?new Date(data.planStartTime).toLocaleDateString().replace(/\//g,'-'):""}}</p>
						</li>

						<li>
							<span>执行日期：</span>
							<p class="li_pM"><span class="datashow">{{data.deadline?new Date(data.deadline).toLocaleDateString().replace(/\//g,'-'):""}}</span> <el-button size='mini' type="danger" disabled>{{data.planStartTime>data.deadline?"提前":data.planStartTime==data.deadline?"执行日":'逾期'}}</el-button></p>
						</li>

					</ul>
				</div>
				<div class="map">
					<googMap ref="myMap" :width="width" :height="height"> </googMap>
				</div>
			</div>
			<div class="down">
				 <el-tabs v-model="activeName" @tab-click="handleClick">
				    <el-tab-pane label="客户反馈" name="first" style="margin:0;">
				    	<div class="shosemessage">
					    	<div class="select_div" v-if='choseliIndex==0'>
					    		<ul class="cusmeters">
					    			<li>
					    				<span>物业人员：</span>
					    				<p><el-button size='mini' type="danger" disabled>已签名</el-button></p>
					    			</li>
					    			<li>
					    				<span>岗位：</span>
					    				<p></p>
					    			</li>
					    			<li>
					    				<span>服务态度评分：</span>
					    				<p>
					    					<el-rate
					    					  v-model="value4"
					    					  disabled
					    					  show-score
					    					  text-color="#ff9900"
					    					  score-template="{value}">
					    					</el-rate>
					    				</p>
					    			</li>
					    			<li>
					    				<span>维保质量评分：</span>
					    				<p>
					    					<el-rate
					    					  v-model="value5"
					    					  disabled
					    					  show-score
					    					  text-color="#ff9900"
					    					  score-template="{value}">
					    					</el-rate>
					    				</p>
					    			</li>
					    			<li>
					    				<span>客户意见：</span>
					    				<p></p>
					    			</li>
					    		</ul>
					    	</div>
					    </div>
				    </el-tab-pane>
				    <el-tab-pane label="作业记录" name="second">
				    	<div class="shosemessage" style="overflow-y:auto;">
				    		<div class="select_div" >
				    			 <el-table :data="data.attendanceList">
				    			 	<el-table-column label="状态" :show-overflow-tooltip="true" align="center" width='80px'>
				    			 	  <template slot-scope="scope">{{ status[scope.row.attendanceStatus]}}</template>
				    			 	</el-table-column>

				    			 	<el-table-column label="时间" :show-overflow-tooltip="true" align="center" width='200' type="index">
				    			 	  <template slot-scope="scope">{{ new Date(scope.row.clockIn).toLocaleDateString().replace(/\//g,'-') }}&nbsp;{{new Date(scope.row.clockIn).getHours() + ':'}}{{new Date(scope.row.clockIn).getMinutes() + ':'}}{{new Date(scope.row.clockIn).getSeconds()}}</template>
				    			 	</el-table-column>

				    			 	<el-table-column label="位置" :show-overflow-tooltip="true" align="center" width='200'>
				    			 	  <template slot-scope="scope">{{ scope.row.haddress }}</template>
				    			 	</el-table-column>

				    			 	<el-table-column label="耗时" :show-overflow-tooltip="true" align="center">
				    			 	  <template slot-scope="scope">{{}}</template>
				    			 	</el-table-column>
				    			 </el-table>
				    		</div>
				    	</div>
				    </el-tab-pane>
				    <el-tab-pane label="作业图片" name="third">
				    	<div class="shosemessage">
				    		<div class="select_div" >
				    			<el-carousel trigger="click" height="202px">
				    			      <el-carousel-item v-for="item in data.moduleCheckedList" :key="item">
				    			       	<p class="img_title">{{item.moduleName}}</p>
				    			       	<ul class="img_list">
				    			       		<li>
				    			       			<p class="p_img"><img :src="item.afterCheckImages" alt=""></p>
				    			       			<p class="p_text">保养前</p>
				    			       		</li>
				    			       		<li>
				    			       			<p class="p_img"><img :src="item.beforeCheckImages" alt=""></p>
				    			       			<p class="p_text">保养后</p>
				    			       		</li>
				    			       	</ul>
				    			      </el-carousel-item>
				    			 </el-carousel>
				    		</div>
				    	</div>
				    </el-tab-pane>
				    <el-tab-pane label="电梯信息" name="fourth">
				    	<div class="shosemessage">
				    		<div class="select_div">
				    			<ul class="liftMessage_list">
				    				<li><span>电梯编号：</span><p>{{data.elevatorIMSI}}</p></li>
									<li><span>电梯类型：</span><p>{{data.elevatorTypeName}}</p></li>
									<li><span>电梯名称：</span><p>{{data.elevatorName}}</p></li>
									<li><span>电梯用途：</span><p>{{data.elevatorName}}</p></li>
									<li><span>注册代码：</span><p>{{data.elevator.registerCode}}</p></li>
									<li><span>开门方式：</span><p>{{data.elevator.openTypeName}}</p></li>
									<li><span>品牌：</span><p>{{data.brandName}}</p></li>
									 <li><span>电梯安装日期：</span><p>{{data.elevator.installationTime?new Date(data.elevator.installationTime).toLocaleDateString().replace(/\//g,'-'):""}}</p></li>
									<li><span>梯种：</span><p>{{data.elevatorTypeName}}</p></li>
									<li><span>梯龄：</span><p>{{data.elevator.liftAge}}</p></li>
				    			</ul>
				    		</div>
				    	</div>
				    </el-tab-pane>
				 </el-tabs>

				</div>
			</div>
		</div>
	</div>
</template>
<script >
	import {maintainHttpUrl} from '@/page/home/jobmangement/jobMangerUrl'
	import googMap from '@/components/map'
	export default{
		components:{googMap},
		data(){
			return{
				id:null,
				jobImg:['机房照片','进道照片','轿箱顶照片','轿箱照片','入口照片','底坑照片'],
				list:[],
				 activeName: 'first',
				choseList:['客户反馈','作业记录','作业图片','电梯信息'],

				choseliIndex:0,
				value4:3.7,//评分
				value5:4,
				data:{elevator:{installationTime:'',openTypeName:""}},
				liftType:['半月维护保养','月维护保养','季度维护保养','半年维护保养','年度维护保养'],
				addressSelect: ['广东省', '广州市', '天河区'],//初始化地址
				width:"100%",
				height:"350px",
				openType:{1:"左开" ,2:'中开',3:'右开', 4:'双开'},
				status:{0:"未开始" ,1:"已出发" ,2:"保养中" ,3:"保养结束" ,4:"已完成" ,5:"已超期" ,6:"已安排" ,7:"暂停" ,8:"重启"}

			}
		},
		methods:{
			close(){
				// this.show=false;
				this.id=null;
				this.$emit('close')
			},
			handleClick(tab, event) {
	       		 console.log(tab, event);
	      	}
			//选择选项卡
			// shoseDivShow(index){
			// 	this.choseliIndex=index;
			// }

		},
		props:{
			show:{
				type:Number,
				default:0,
			}
		},
		watch:{
			show(){
				try{
					/*this.$nextTick(()=>{
					  this.$refs.myMap.$emit('mapInit',{
					    // disabled:(this.type !== 'add' && this.selfType !== 'edit'),
					    initAddress:`${this.addressSelect.join('')}`
					  })
					})*/
				}catch(erro){
					this.show=0
				}
			},
			id(newval,oldval){

				if(newval){
					this.$xttp.get(maintainHttpUrl.detail+newval+'/detail').then(res=>{
				if(res.errorCode ==0){
					

					  this.data=res.data
					 Object.assign(this.data,res.data,)

					
					this.$nextTick(()=>{
					  this.$refs.myMap.$emit('mapInit',{
					    // disabled:(this.type !== 'add' && this.selfType !== 'edit'),
					    initAddress:`${res.data.elevator.address}`
					  })
					})
					// console.log(res.data.elevator.address,this.$refs.myMap)
					//  this.$refs.myMap.$emit("updateMap",res.data.elevator.address)
					//   this.$refs.myMap.$emit("updateMap")
				}else{
					this.$message(res.errorMsg )
				}
			})


				}

			}
		},
		created(){
			console.log(9999)


		},
		mounted(){
			console.log(888888)
		},
	}
</script>
<style lang="scss" scoped>


	.li_pM{
		display:flex;
		over-flow:hiedden;
		flex-wrap:no-wrap;
		i{
			display:block;
			margin-right:6px;
			width:auto;
		}
		.datashow{
			display:block;
			width:50%;
			margin-right:4px;
			text-align:left;flex:2;
		}
	}
	.liftMessage_list{
		width:100%;
		height:100%;
		display:flex;
		flex-wrap:wrap;
		li{
			width:50%;
			display:flex;
			height:30px;
			span{
				display:block;
				width:38%;
				text-align:right;
				height:100%;
				line-height:30px;
			}
			p{
				display:block;
				width:62%;
				height:100%;
				line-height:30px;
			}

		}
	}

	.img_list{
		width:80%;
		margin:0 auto;
		display:flex;
		li{
			width:50%;
			height:203px;
			.p_img{
				height:163px;
				width:100%;
				img{
					display:block;
					height:163px;
					width:100%;
				}
			}

			.p_text{
				width:100%;
				text-align:center;
				height:20px;
				line-hegiht:20px;
				font-size:16px;
			}
		}
	}
		.addwarp{
			width:100%;
			height:100%;
			background:rgba(0,0,0,0.5);
			position:fixed;
			left:0;
			top:0;
			z-index:88;
			overflow:scroll;
			.detail{
				width:681px;
				height:676px;
				margin:60px auto 60px auto;
				background:white;
				padding:13px;
				border-box:box-sizing;
				-o-border-box:box-sizing;
				-ms-border-box:box-sizing;
				-moz-border-box:box-sizing;
				-webkit-border-box:box-sizing;
				position:relative;
				.close{
					position:absolute;
					top:13px;
					right:13px;
					width:30px;
					height:30px;
					line-height:30px;
					font-size:30px;
					cursor:pointer;
				}
				.up{
					width:100%;
					height:360px;
					display:flex;
					.form{
						width:330px;
						margin-right:5px;
						height:100%;
					}
					.map{
						width:290px;
						height:100%;
					}
				}
				.down{
					height:270px;
					.shose_list{
							width:100%;
							height:28px;
							display:flex;
							li{
								height:100%;
								width:80px;
								text-align:center;
								line-height:28px;
								cursor:pointer;
								font-size:16px;
								font-weight:bold;
							}
							.clickLi{
								background:#409EFF;
									color:white;
							}
							li:hover{
									background:rgba(0,0,0,0.5);
									color:white;

							}
					}


				}
			}
		}

	.form_message{
		width:100%;
		height:100%;
		li{
			height:auto;
			line-height:30px;
			display:flex;
			span{
				display:block;
				font-size:16px;
				height:100%;
				width:30%;
				line-height:30px;
				text-align:right;
			}
			p{
				width:70%;
				height:30px;
				line-height:30px;
				padding-left:10px;
				border-box:box-sizing;
				-o-border-box:box-sizing;
				-ms-border-box:box-sizing;
				-moz-border-box:box-sizing;
				-wekit-border-box:box-sizing;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			div{
				height:auto;
				padding-left:10px;
				border-box:box-sizing;
				-o-border-box:box-sizing;
				-ms-border-box:box-sizing;
				-moz-border-box:box-sizing;
				-wekit-border-box:box-sizing;
				p{
					width:100%;
					height:30px;
					line-height:30px;
				}
			}
		.spiceli{
			height:auto;
		}

		}

	}


	.shosemessage{
			width:100%;
			height:242px;
			margin:0 auto;
			background:#ddd;
			.select_div{
				height:100%;
				width:100%;
				padding:12px 20px;
				border-box:box-sizing;
				-o-border-box:box-sizing;
				-ms-border-box:box-sizing;
				-moz-border-box:box-sizing;
				-webkit-border-box:box-sizing;
				.cusmeters{
					width:100%;
					height:100%;
					li{
						height:30px;
						display:flex;
						span{
							width:20%;
							text-align:right;
						}
					}
				}
			}
	}

	.el-tabs__header{
			margin:0;
	}

	.img_title{
		width:100%;
		text-align:center;
	}
</style>
