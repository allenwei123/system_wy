<template>
	<div class="warp" v-if="show" @click.self="close">
		<div class="in">
			<div class="title">新增梯种</div>
			<div class="close" @click="close">X</div>
			<div class="textall">
				<el-form :model="form" ref="form" label-width="120px" class="demo-form">
					 <el-form-item label="品牌名称：" required  style="margin-top:20px;">
               			<span>{{form.blandName}}</span>
             
           		 	</el-form-item>
				 	<el-form-item label="梯种名称：" required  style="margin-top:20px;">
               			<el-input v-model="form.blandType" size="max" style="width:290px;" ></el-input>
             
           		 	</el-form-item>
           		 <el-form-item style="margin:0 auto;">
           		 <el-button @click="close">取消</el-button>
           		 <el-button type='primary' style="margin-left:140px;" @click="save">确定</el-button>
           		 </el-form-item>
           		 </el-form>
			</div>
		</div>
	</div>
</template>
<script>
import {certificateHttpUrl} from '../httpUrl';
	export default{
		data(){
			return{
				form:{

					blandName:null,
					blandType:null,

				}
				

			}
			
		},
		props:{
			show:{
				default:false,
				type:Boolean,
			},
			blandId:{
				default:null,
				type:String
			}
		},
		methods:{
			close(){
				this.$emit("blantypeClose")
			},
			save(){
					this.$xttp.post(certificateHttpUrl.blandTypeAdd,{brandId:this.blandId,elevatorTypeName:this.form.blandType}).then(res=>{
							if(res.errorCode==0){
								this.$message("新增梯种成功")
								this.close();
							}
					})
			}
		},
		mounted(){
			
			this.$xttp.get(certificateHttpUrl.blandDetail+this.blandId+'/detail').then(res=>{
				console.log(88888)
				console.log(res)
				if(res.errorCode==0){
					this.form.blandName=res.data.brandName
					console.log(this.form.brandName)
				}else{
					this.$message(res.errorMsg);
				}
			})
		},
	}
</script>
<style lang="scss" scoped> 
	.warp{
		width:100%;
		height:100%;
		position:fixed;
		top:0;
		left:0;
		background:rgba(0,0,0,0.5);
		.in{
			width: 514px;
			height: 270px;
			background: inherit;
			background-color: rgba(255, 255, 255, 1);
			box-sizing: border-box;
			border-width: 2px;
			border-style: solid;
			border-color: rgba(121, 121, 121, 1);
			border-radius: 2px;
			-moz-box-shadow: none;
			-webkit-box-shadow: none;
			box-shadow: none;
			margin:120px auto 0 auto;
			position:relative;
			.title{
				idth: 512px;
   				height: 44px;
   				background-color: rgba(196, 224, 247, 1);
   				line-height:44px;
   				padding-left:20px;
   				box-sizeing:border-box;
   				-o-box-sizeing:border-box;
   				-ms-box-sizeing:border-box;
   				-moz-box-sizeing:border-box;
   				-webkit-box-sizeing:border-box;
			}
			.close{
				height:44px;
				line-height:44px;
				width:44px;
				position:absolute;
				right:6px;
				top:0;
				text-align:center;
				cursor:pointer;
			}
			.textall{
				height:234px;
			}
		}
	}
</style>