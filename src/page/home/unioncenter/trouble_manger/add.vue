<template>
	<div class='warp'>
		<div class="message_in">
			<el-form  label-width="150px" :model="form" >
				<div class="title">基本信息</div>
				<el-form-item label="终端编号:" required>
		   			<el-input v-model="form.deviceCode"  style="width:200px;" v-if="!disableds"></el-input>
		   			<span v-else>{{form.deviceCode}}</span>
		 		</el-form-item>
		 		<el-form-item label="sim卡号：" required>
		   			<el-input v-model="form.imsiNum"  style="width:200px;" v-if="!disableds"></el-input>
		   			<span v-else>{{form.imsiNum}}</span>
		 		 </el-form-item>
		 		 <el-form-item label="维保公司名称:" required>
		   			
		   			<el-select
		   			   v-model="form.companyId"
		   			    filterable
		   			   remote

		   			   reserve-keyword
		   			   placeholder="维保公司名称"
		   			   :remote-method="companySearch"
		   			   :loading="loadings" @change="companyChange" v-if='!disableds'>
		   			   <el-option
		   			     v-for="item in CompanyList"
		   			     :key="item.id"
		   			     :label="item.name"
		   			     :value="item.id" >
		   			   </el-option>
		   			 </el-select>
		   			<span v-else>{{form.companyName}}</span>
		 		 </el-form-item>
				<div class="title">其他信息</div>
				<el-form-item label="是否专用电梯：">
		   			 <el-checkbox label="" name="type" v-model="checked" :disabled='disableds' @change="chosechange" v-if='!disableds'></el-checkbox>
		   			 <span v-else>{{form.checked}}</span>
		 		</el-form-item>
		 		<el-form-item label="地区：">
		   			<el-select v-model="form.province" placeholder="请选择省份" @change="addressChange()" v-if="!disableds">
			            <el-option
			              v-for="(item,key) in addressData"
			              :key="key"
			              :label="item.name"
			              :value="item.name">
			            </el-option>
			          </el-select>
			          <!-- 城市 -->
			           <el-select v-model="form.city" placeholder="请选择城市" @change="cityChange()" v-if="!disableds">

			            <el-option
			              v-for="(items,keys) in cityList"
			              :key="keys"
			              :label="items.name"
			              :value="items.name">
			            </el-option>
			          </el-select>
			          <!-- 区 -->
			          <el-select v-model="form.area" placeholder="请选择区域" v-if="!disableds">
			            <el-option
			              v-for="(itema,keya) in areaList"
			              :key="keya"
			              :label="itema"
			              :value="itema">
			            </el-option>
			           
			         </el-select>
			          <span v-else>{{form.province}}{{form.city}}{{form.area}}</span>
		 		 </el-form-item>
		 		 <el-form-item label="服务商：">
		   			
		   			 <el-radio-group v-model="form.telecomCode" v-if="!disableds">
		   			     <el-radio :label="10010">联通</el-radio>
		   			     <el-radio :label="10086">电信</el-radio>
		   			     <el-radio :label="189">移动</el-radio>
		   			  </el-radio-group>
		   			  <span v-else>{{form.telecomCode=="10010"?'联通':form.telecomCode=="10086"?'移动':form.telecomCode=="189"?'电信':false}}</span>
		 		 </el-form-item>
		 		 <el-form-item label="通信协议类型：">
		   			<el-input v-model="form.commuProtocol"  style="width:200px;" v-if="!disableds"></el-input>
		   			 <span v-else>{{form.commuProtocol}}</span>
		 		</el-form-item>
		 		<el-form-item label="软件版本：">
		   			<el-input v-model="form.softwareVersion"  style="width:200px;" v-if="!disableds"></el-input>
		   			 <span v-else>{{form.softwareVersion}}</span>
		 		 </el-form-item>
		 		 <el-form-item label="硬件版本：">
		   			<el-input v-model="form.hardwareVersion"  style="width:200px;" v-if="!disableds"></el-input>
		   			 <span v-else>{{form.hardwareVersion}}</span>
		 		 </el-form-item>
		 		 <div class="sibmit_btn" style="margin-bottom:20px;display:flex;justify-content:center;">
		 		 	<el-button type="primary" @click="saveMsg" v-if='type=="add"'>保存</el-button>	
		 		 	<el-button type="primary" @click="getBack" v-if="type=='detail'||type=='edit'">返回</el-button>

		 		 	<el-button type="danger" @click="saveEdit" v-if='type=="edit"'>保存编辑</el-button>
		 		 </div>
			</el-form >
		</div>
	</div>
</template>
<script>
	import addressDatas from  '@/utils/addressData'
	 import {endmangementUrl} from '@/page/home/unioncenter/unioncenterUrl';
	 import {filterParams} from '@/utils/process';
	export default{
		data(){
			return{
				commyChange:false,
				type:'',
				savecompanyId:'',
				form:{
					area:null, //(string, optional): 区/县 ,
					bboardStatus:null, //(string, optional),
					cboardStatus:null, //(string, optional),
					city:null, //(string, optional): 城市 ,
					commuProtocol:null, //(string, optional): 通信协议 动态更新 ,
					companyId:null, //(ObjectId, optional): 维保公司ID ,
					deviceCode:null, //(string): 终端编号 ,
					hardwareVersion:null, //(string, optional): 硬件版本 ,
					id:null, //(ObjectId, optional): 唯一id ,
					imsiNum:null, //(string): IMSI编号 测试号码 89860617040019309949 ,
					peculiarUsage:null, //(integer): 是否是特殊用途 1 特殊用途 0 普通用途 ,
					province:null, //(string, optional): 省份 ,
					softwareVersion:null, //(string, optional): 软件版本 ,
					telecomCode:null, //(integer, optional): 运营商编号 10010 联通 10086 移动 189 电信
				},
				checked:false,
				addressData:addressDatas,//省份
				addressValue:'',//
				cityValue:'',//城市
				cityList:[],
				areaList:[],//区
				areaValue:'',
				disableds:false,
				loadings:false,
				//维保公司名称列表
				CompanyList:[],

			}
		},
		methods:{
			chosechange(){
				this.form.peculiarUsage
			},
			//远程搜索公司名称
			companySearch(query){
			  if (query !== '') {
			    this.loadings = true;
			    this.$xttp.post(endmangementUrl.commyList,{page:1,size:10,name:query}).then(res=>{
			      if(res.errorCode==0){
			        this.CompanyList=res.data.records

			      }else{
			        this.$message(res.errorMsg)
			      }
			      this.loadings = false;
			    })
			  }
			},
			//远程公司名称改变
			companyChange(){
			  this.commyChange=true;
			},
			//选择省份
			addressChange(){
			  for(let x = 0 ; x <this.addressData.length;x++){
			    if(this.addressData[x].name==this.form.province){
			         Object.assign({},this.areaList);
			          Object.assign({},this.cityList);
			          this.form.city='';
			          this.form.area='';
			        Object.assign(this.cityList,this.addressData[x].city)
			      

			    }

			  }
			},
			//选择城市
			cityChange(){
			    for(let x = 0; x <this.cityList.length;x++){
			     
			      if(this.cityList[x].name==this.form.city){
			        this.areaList=[]
			        this.form.area='';
			         Object.assign(this.areaList,this.cityList[x].area)
			        
			      }
			    }
			},
			saveMsg(){

				this.form.peculiarUsage=this.checked==true?'1':'0'
				console.log(this.form.peculiarUsage)
				console.log(this.form)
				this.$xttp.post(endmangementUrl.add,filterParams(this.form)).then(res=>{
					if(res.errorCode==0){
						this.$message('新增录入成功')
						this.$router.push({name:'endmangement'})
					}else{
						this.$message(res.errorMsg)
					}
				})
			},
			//返回
			getBack(){
				this.$router.push({name:'endmangement'})
			},
			//保存编辑
			saveEdit(){
				this.form.peculiarUsage=this.checked==true?'1':'0'
				if(this.commyChange==false){
					this.form.companyId=this.savecompanyId;
				}
				this.$xttp.post(endmangementUrl.edit,filterParams(this.form)).then(res=>{
					if(res.errorCode==0){
						this.$message('保存编辑成功')
						this.$router.push({name:'endmangement'})
					}else{
						this.$message(res.errorMsg)
					}
				})
			},
		},
		created(){
			this.type=this.$route.params.type
			if(this.$route.params.type=='add'){
				this.disableds=false;
				this.$store.commit('PUSHDIRECT','终端录入')
			}else if(this.$route.params.type=='detail'){
				this.disableds=true;
				this.$store.commit('PUSHDIRECT','终端详情')
				this.$xttp.get(endmangementUrl.detail+this.$route.params.id+'/detail').then(res=>{
					if(res.errorCode==0){
						console.log(res)
						this.$message('获取成功！')
						Object.assign(this.form,res.data)
						this.form.imsiNum=res.data.simNumber;
						this.form.checked=res.data.peculiarUsage==1?"是":'否';

					}else{
						this.$message(res.errorMsg)
					}
				})
			}else{
				this.disableds=false;
				this.$store.commit('PUSHDIRECT','编辑终端')
				this.$xttp.get(endmangementUrl.detail+this.$route.params.id+'/detail').then(res=>{
					if(res.errorCode==0){
						console.log(res)
						this.$message('获取成功！')
						Object.assign(this.form,res.data);
						this.form.companyId=res.data.companyName;
						this.savecompanyId=res.data.companyId;
						this.form.imsiNum=res.data.simNumber;
						this.checked=res.data.peculiarUsage==1?true:false;
						console.log(this.form.checked)

					}else{
						this.$message(res.errorMsg)
					}
				})
			}
		},
		mounted(){
			
		},
	}
</script>
<style lang="scss" >
	.warp{
		width:100%;
		height:100%;

		.message_in{
			margin-top:40px;
			margin-left:20px;
		}
	}
</style>
