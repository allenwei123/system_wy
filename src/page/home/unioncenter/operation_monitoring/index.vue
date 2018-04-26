<template>
	 <el-main>
	<div class="warp">
		<my-direct @click="handleDirectClick"></my-direct>
		<!-- 详情 -->
		<detailShow v-if="detailshows" :show='detailshows' @detailHidden='detailHidden' :id='showid' :listData='showList'></detailShow>
		<div class="in">
			
			<el-form :inline="true" :model="form" class="demo-form-inline" style="display:flex;">
				<el-form-item>
				  <el-select
				    v-model="form.projectId"
				    size="small"
				    filterable
				    remote
				    clearable
				    reserve-keyword
				    placeholder="项目"
				    :remote-method="projectSearchAsync"
				    :loading="selectLoading" @change='projectChange(form.projectName)'>

				    <el-option
				      v-for="item in projectOption"
				      :key="item.id"
				      :label="item.projectName"
				      :value="item.id">
				    </el-option>
				  </el-select>
				</el-form-item>

				<el-form-item v-if='form.projectName'>
				  <el-select
				    v-model="form.buildName"
				    size="small"
				    filterable
				    remote
				    clearable
				   reserve-keyword
				    placeholder="楼栋名字"
				    :remote-method="buildSearchAsync"
				    :loading="buildLoading">
				    <el-option
				      v-for="item in buildOption"
				      :key="item.id"
				      :label="item.projectName"
				      :value="item.id">
				    </el-option>
				  </el-select>
				</el-form-item>
				
				<el-select v-model="form.deviceConnectStatus" placeholder="全部链接状态" size="small" style="width:120px;margin:5px 10px 0 0;">
				    <el-option
				      v-for="item in contactList"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				 </el-select>
				
				<el-select v-model="form.elevatorStatus" placeholder="所有故障状态" size="small"  style="width:120px;margin:5px 10px 0 0;">
				    <el-option
				      v-for="item in troubleList"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				 </el-select>
					
				<el-form-item>
				  <el-select
				    v-model="form.name"
				    size="small"
				    filterable
				    remote
				    clearable
				   reserve-keyword
				    placeholder="电梯名称"
				    :remote-method="elevatorSearchAsync"
				    :loading="elevatorLoading">
				    <el-option
				      v-for="item in elevatorLlist"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
				</el-form-item>

				<el-form-item>
					 <el-button  type='primary' size="small" @click="find">查询</el-button>
				 </el-form-item>
         
			</el-form>
			<!-- 列表开始 -->
			<div v-if='dataList.length==0'>暂无数据</div>
			<div class="elevatorListshow" v-else>
				<ul class="elevtorListin">
					<li v-for='(item,index) in dataList'>
						<div class="boxleft">
							<p>
								<em class="starts" :class="{isget:item.id==isgets}" @click="getintoUp(item.id)"><img src="./starts.png" alt=""></em>
							</p>
							<p><span>{{item.name}}</span><i class="links" :class='{linksin:item.deviceConnectStatus==0}'></i></p>
							<p><span>{{item.houseName}} </span></p>
							<p><span>{{item.buildName}}</span></p>
							<p><span>{{item.runStatus}}</span></p>
							<p><span>{{item.elevatorStatus==0?'正常':item.elevatorStatus==1?'检修':item.elevatorStatus==2?'终端断开':item.elevatorStatus==3?'故障':''}}</span></p>
						</div>
						<div class="boxright">
							<div class="updown"><img class="down" :src="item.direction==1?downUrl:downLinkUrl" alt=""><span>{{item.currentFloor}}</span><img class="up" :src="item.direction==1?uplinkUrl:upUrl" alt=""></div>
							<div class="liftimg">
								<img src="./lift.jpg" alt="" @click="detailShow(item)">
							</div>
						</div>
					</li>
					
				</ul>
				 <el-pagination
			        @current-change="handleCurrentChange"
			        :current-page="currentPage"
			        :page-size="size"
			        layout="total, prev, pager, next, jumper"
			        :total="total">
			      </el-pagination>
			</div>
		</div>
		<!-- in结束 -->
	</div>
	<!-- wrap结束 -->
 </el-main>
</template>

<script>
 import {operationMonitoringUrl} from '@/page/home/unioncenter/unioncenterUrl';
  import myDirect from '@/components/direct';
  import detailShow from '@/page/home/unioncenter/operation_monitoring/detailshow'
	export default{
		components:{myDirect,detailShow},
		data(){
			
			return{
				showid:null,
				isgets:null,
				linkstatus:true,
				selectLoading:false,
				upUrl:'./static/img/up.png',
				uplinkUrl:'./static/img/uplink.png',
				downUrl:'./static/img/downlink.png',
				downLinkUrl:'./static/img/down.png',
				communityId:null,
				projectOption:[],//项目列表
				buildLoading:false,
				buildOption:[],//楼盘列表
				elevatorLoading:false,
				elevatorLlist:[],//电梯列表
				contactList:[{value:0,label:'在线'},{value:1,label:'离线'},{value:null,label:'所有状态'}],//状态列表1：未连接 0：已连接
				troubleList:[{value:0,label:'正常'},{value:1,label:'检修'},{value:2,label:'终端断开'},{value:3,label:'无故障'},{value:null,label:'所有状态'}],
				form:{
					projectId:null,
					projectName:null,//项目名称	
					buildName:null,//楼盘名称
					deviceConnectStatus:null,//终端连接状态（1：未连接 0：已连接） ,
					elevatorStatus:null, //(integer, optional): 电梯状态（0：正常 1：检修 2：终端断开 3：故障 ） 故障传 3 无故障 传0 ,
					name:null, //(string, optional): 电梯名称 ,
					communityId:null,
				}, 
				dataList:[],
				currentPage: 1,//当前页码
       		 	total: 1,//总数
       			size: 8,//总页数

       			detailshows:false,
       			showList:{},
			}
		},
		methods:{
			//收藏
			getintoUp(val){
				console.log(val)
				this.isgets=val
			},
			handleDirectClick(){

			},
			projectSearchAsync(queryString){
			 

			  if (queryString.trim() === '') {
			    return false;
			  }
			  this.selectLoading = true;
			   this.$xttp.post(operationMonitoringUrl.projectName,{
			      projectName:queryString,
			      page:1,
			      size:10,
			    }).then(res => {
			    	console.log(res)
			    	this.projectOption=[];
			    	this.projectOption=res.data.records
			      
			     	 this.selectLoading = false;
			    })
			   
			    this.selectLoading = false;
			  
			},
			projectChange(value){
				for(let x = 0 ; x<this.projectOption.length;x++){
	              if(this.projectOption[x].id==value){
	                  this.communityId = this.projectOption[x].communityId;
	                  // this.form.communityId = this.projectOption[x].communityId;
	              }
            	}
			},
			buildSearchAsync(query){//获取楼盘名称
				if(this.communityId){
					this.$message('')
				}
				 if (query.trim() === '') {
				    return false;
				  }
				   this.buildLoading = true;
				   this.$xttp.post(operationMonitoringUrl.buildName,{
				      projectName:query,
				      page:1,
				      size:10,
			    	}).then(res => {
			    		if(res.errorCode==0){
			    			this.buildOption=res.data.records
			      
			     		 	this.buildLoading = false;
			    		}
			    		
			    	})
			   
			   		 this.buildLoading = false;
			},
			elevatorSearchAsync(query){
				if (query.trim() === '') {
				    return false;
				 }
				  this.elevatorLoading = true;
				   this.$xttp.post(operationMonitoringUrl.elevtorName,{
				      name:query,
				      page:1,
				      size:10,
			    	}).then(res => {
			    		if(res.errorCode==0){
			    			console.log(res)
			    			this.elevatorLlist=res.data.records
			      
			     		 	this.elevatorLoading = false;
			    		}
			    		
			    	})
			   
			   		 this.elevatorLoading = false;
			},

			//页面详细别表
			handleCurrentChange(currentPage){
		        this.currentPage = currentPage;
		         this.getData();
		     },
		     //显示详情
		     detailShow(val){
		     	Object.assign(this.showList,val)
		     	this.showid=val.id;
		     	 this.detailshows=true;
		     },
		     //详情隐藏
		     detailHidden(){
		     	this.detailshows=false
		     },
		     //获取列表数据
		     getData(op={}){
		     	this.$xttp.post(operationMonitoringUrl.list,Object.assign({
          			page:this.currentPage,
          			size:this.size,
       			 },op)).then(res=>{
       			 	if(res.errorCode==0){
       			 		// Object.assign(this.dataList,res.data.records)
       			 		this.dataList=res.data.records
       			 		this.total = res['data'].total;
       			 		console.log(this.dataList)
       			 	}else{
       			 		this.$message.error(res.errorMsg)
       			 	}
		     	})
		     },
		     find(){
		     	this.getData(this.form);
		     }
		},
		created(){
			this.getData();
		},

	}
</script>
<style scoped lang='scss'>
	.elevatorListshow{
		heigth:auto;
		width:100%;
		.elevtorListin{
			height:500px;
			width:100%;
			display:flex;
			flex-wrap:wrap;
			overflow:auto;
			li{
				
				width:261px;
				height:223px;
				border:1px #ddd solid;
				margin-right:10px;
				display:flex;
				.boxleft{
					height:100%;
					width:50%;
					p{
						width:100%;
						height:30px;
						line-height:30px;
						padding-left:8px;
						font-size:14px;
						overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
						box-sizing:border-box;
								-o-box-sizing:border-box;
								-ms-box-sizing:border-box;
								-moz-box-sizing:border-box;
								-webkit-box-sizing:border-box;
						.starts{
								cursor:pointer;
								display:block;
								width:28px;
								height:28px;
								background:#c0c4cc;
								border-radius:50% 50%;
								-o-border-radius:50% 50%;
								-ms-border-radius:50% 50%;
								-moz-border-radius:50% 50%;
								-webkit-border-radius:50% 50%;
								padding-top:5px;
								box-sizing:border-box;
								-o-box-sizing:border-box;
								-ms-box-sizing:border-box;
								-moz-box-sizing:border-box;
								-webkit-box-sizing:border-box;
								img{
									display:block;
									
									height:auto;
									margin:0 auto 0 auto;
								}
							}
							.isget{
								background:#e1b728;
							}
							.links{
								display:block;
								width:19px;
								height:19px;
								background:#ff8a8a;
								border-radius:50% 50%;
								-o-border-radius:50% 50%;
								-ms-border-radius:50% 50%;
								-moz-border-radius:50% 50%;
								-webkit-border-radius:50% 50%;
								float:right;
								margin:5.5px 10px;
							}
							.linksin{
								background:#8ad08a;
							}
							
						
					}
					p:nth-child(1){
						margin-top:10px;
					}

				}
				.boxright{
					height:100%;
					width:50%;
					.updown{
						width:100%;
						height:50px;
						display:flex;
						padding-top:15px;
						padding-left:12px;
						box-sizing:border-box;
						-o-box-sizing:border-box;
						-ms-box-sizing:border-box;
						-moz-box-sizing:border-box;
						-webkit-box-sizing:border-box;
						span{
							display:block;
							width:30%;
							text-align:center;
							font-weight:bold;
							color:#ff0000;
						}
						.up{
							display:block;
							width:30%;
							height:18px;
						}
						.down{
							display:block;
							width:30%;
							height:18px;
						}
					}
					.liftimg{
						width:100%;
						height:142px;
						cursor:pointer;
						img{
							display:block;
							width:80%;
							height:100%;
							margin:0 auto;
						}
					}
				}
			}
		}
	}
</style>