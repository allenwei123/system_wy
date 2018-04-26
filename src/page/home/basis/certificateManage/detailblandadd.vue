<template>
	<div class="warp" v-if='show' @click.self='close'>
		<div class="in">
			<div class="title">新增品牌</div>
			<div class="close" @click='close'>X</div>
			<div class="textall">
				<el-form :model="form" ref="form" label-width="120px" class="demo-form">
				 <el-form-item label="品牌名称：" required  style="margin-top:20px;">
               			<el-input v-model="form.brandName" size="max" style="width:290px;" ></el-input>
             
           		 </el-form-item>
           		 <el-form-item style="margin:0 auto;">
           		 <el-button @click='close'>取消</el-button>
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
					brandName :null,
				}
				

			}
			
		},
		props:{
			show:{
				default:false,
				type:Boolean,
			}
		},
		methods:{
			close(){
				this.$emit("blanaddClose")
			},
			save(){
				this.$xttp.post(certificateHttpUrl.blandadd,{brandName:this.form.brandName}).then(res=>{
					if(res.errorCode==0){
						this.$message('品牌新增成功')
						this.$emit("blanaddClose")
						
					}else{
						this.$message.error(res.errorMsg)
					}
				})
			},

		}

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
			height: 209px;
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
				height:165px;
			}
		}
	}
</style>