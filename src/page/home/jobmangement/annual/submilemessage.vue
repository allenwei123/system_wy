<template>
	<div class="submile" v-if='show==1'>
		<div>编辑</div>
		<el-form  label-width="150px" :model="form" >
		  <el-form-item :label="labelText+(index+1)"  :key='index' v-for='(item,index) in form.groupMembers'>
		    <el-input v-model="item.userName" :disabled="true" style="
		    width:200px;"></el-input>
		  </el-form-item>
		 <!--  <el-form-item label="年检人员2：" >
		    <el-input v-model="form.secondName" :disabled="true" style="
		    width:200px;"></el-input>
		  </el-form-item> -->
		  <el-form-item label="注册代码：">
		    <el-input v-model="form.registerCode" :disabled="true" style="
		    width:200px;"></el-input>
		  </el-form-item>
		   <el-form-item label="完成年检时间：">
		    <el-date-picker
		      v-model="annualExamineTime"
		      align="right"
		      type="date"
		      placeholder="选择日期"
		      :picker-options="pickerOptions1">
		    </el-date-picker>
		  </el-form-item>
		   <el-form-item label="下次年检时间：">
		    <el-date-picker
		      v-model="planStartTime"
		      align="right"
		      type="date"
		      placeholder="选择日期"	
		      :picker-options="pickerOptions1">
		    </el-date-picker>
		  </el-form-item>

		   <el-form-item label="是否检查限速器：">
		   <el-checkbox label="" name="type" v-model="checked"></el-checkbox>
		  </el-form-item>

		   <el-form-item label="年检合格标签">
			   <el-upload
			    :on-remove='removeImg'
			   	:http-request='upLoadFun'
			    action=''
			     :limit=1
			     list-type="picture-card"
			     :file-list='fileList'>
			
			     <i class="el-icon-plus"></i>
			   </el-upload>
			   <el-dialog :visible.sync="dialogVisible">
			     <img width="100%" :src="dialogImageUrl" alt="">
			   </el-dialog>
		  </el-form-item>
		</el-form>

		<div class="btn_div">
			<el-button type="primary" @click='onSubmit'>保存</el-button>
		</div>
	</div>
</template>
<script>
	import {annualHttpUrl} from '@/page/home/jobmangement/jobMangerUrl'
	import { send as uploadFile,getUri } from '@/utils/oss'

	export default{
		data(){
			return{
				//图片上传
				id:null,
				Imgfile:[],
				dialogImageUrl: '',
        		dialogVisible: false,
				checked:false,
				fileList:[],
				labelText:'年检人员',
				annualExamineTime:null,
				planStartTime:null,
				form:{
					firstName:null,
					secondName:null,
					regitCode:null,
					groupMembers:[],
					planStartTime:null,
				},
				formLabelAlign:null,
				pickerOptions1:{
				         disabledDate(time) {
				           return time.getTime() > Date.now();
				         },
				         shortcuts: [{
				           text: '今天',
				           onClick(picker) {
				             picker.$emit('pick', new Date());
				           }
				         }, {
				           text: '昨天',
				           onClick(picker) {
				             const date = new Date();
				             date.setTime(date.getTime() - 3600 * 1000 * 24);
				             picker.$emit('pick', date);
				           }
				         }, {
				           text: '一周前',
				           onClick(picker) {
				             const date = new Date();
				             date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
				             picker.$emit('pick', date);
				           }
				         }]
				       },
				 value2:'',
			}
		},
		props:{
			//显示隐藏
			show:{
				default:1,
				type:Number
			},
			// id:{
			// 	default:null,
			// 	type:String,
			// }
		},
		watch:{
			show(newval,oldval){
				console.log(newval)
				if(newval==1){
					
				}else{
					
				}

			},
		},
		created(){

			 this.$store.commit('PUSHDIRECT','提交年检表')
		},
		mounted(){
			this.id=this.$route.params.id
			this.$xttp.get(annualHttpUrl.detail+this.id+'/detail').then(res=>{
				if(res.errorCode  == 0  ){
					console.log(res)
					this.$message('获取信息成功')
					Object.assign(this.form,res.data)
					this.annualExamineTime=res.data.annualExamineTime
					this.planStartTime=res.data.planStartTime
					this.checked=res.data.checkLimit==1?true:false;
					getUri(this.form.qualifiedTag,(url)=>{
						this.fileList.push({url})
					})
				}else{
					this.$message(res.errorMsg)
				}
			})


		},
		methods:{
			
			handlePictureCardPreview(file) {
			       this.dialogImageUrl = file.url;
			       this.dialogVisible = true;
			 },
			 upLoadFun(file){
			 	this.Imgfile.push(file.file);
			 },
			 removeImg(file){
			 	this.Imgfile.splice(0,1);
			 },
			 async onSubmit(){

			 	if(this.Imgfile.length) {
			 		console.log(6666)
			 		uploadFile(this.Imgfile[0],(key) => {
			 			let sendData={}
					 	sendData.orderId=this.id;
					 	sendData.checkLimit=this.checked?1:0;//是否检查加速器0：未检查，1：已检查
					 	sendData.qualifiedTag= key//合格标签
					 	sendData.annualExamineTime=this.annualExamineTime.valueOf();//年检完成时间
					 	sendData.nextTime=this.planStartTime.valueOf();//下次年检时间
					 	this.$xttp.post(annualHttpUrl.confirm,sendData).then(res=>{
					 		if(res.errorCode==0){
					 			this.$message({message:'提交成功！',type:"success"})
					 			this.$router.push({name:'annualManage'})
					 		}else{
					 			this.$message('提交失败')
					 		}
					 	})
			 		})
			 	}else{
			 		console.log(89898)
			 			let sendData={}
					 	sendData.orderId=this.id;
					 	sendData.checkLimit=this.checked?1:0;//是否检查加速器0：未检查，1：已检查
			 			sendData.annualExamineTime=this.annualExamineTime.valueOf();//年检完成时间
			 		this.$xttp.post(annualHttpUrl.confirm,sendData).then(res=>{
					 		if(res.errorCode==0){
					 			this.$message({message:'提交成功！',type:"success"})
					 			this.$router.push({name:'annualManage'})
					 		}else{
					 			this.$message('提交失败')
					 		}
					})
			 	}
			 	



			 }
		}

	}
</script>
<style lang="scss" scoped>
	.submile{
		width:100%;
		height:100%;
	}	
	.btn_div{
		width:100;
		
		margin:0 atuo;
		display:flex;
		justify-content:center;
	}
</style>