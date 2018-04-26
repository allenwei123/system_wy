<template>
	<div class="buildadd" v-if="show" @click.self="hiddenM">
		<div class="buildadd_in">
			<div class="close" @click="hiddenM">X</div>
			<el-form :model="form" ref="form" label-width="120px" class="demo-form">
				<el-form-item label="楼栋名称:" required>
				  <el-input v-model="form.buildName" size="medium" :disabled="disableds"></el-input>
				</el-form-item>
				<el-form-item label="地上建筑层数:" required>
				  <el-input v-model="form.upFloorNum" size="medium" type="number" :disabled="disableds"></el-input>
				</el-form-item>
				<el-form-item label="地下建筑层数:" required>
				  <el-input v-model="form.downFloorNum" type="number" size="medium" :disabled="disableds"></el-input>
				</el-form-item>
				<el-form-item label="楼层总数:" required>
				  <el-input type="number" v-model="allFlound" size="medium" :disabled="true"></el-input>
				</el-form-item>

				<el-button type="primary" @click="saveAdd" v-if='!detailId' style="display:block;margin:0 auto">保存</el-button>

				<div class="detail" style="display:flex;justify-content:center;" v-else>
					<el-button type="danger" @click="editBtn">{{editBtnText}}</el-button>
					<el-button type="primary" @click="hiddenM">返回</el-button>
				</div>
			</el-form >
		</div>
	</div>
</template>
<script >
import {bulidMangerHttpUrl} from '@/page/home/basis/httpUrl';
	export default{
		
		data(){
			return{
				saveform:{},
				show:false,
				disableds:false,
				detailId:null,//详情id
				editBtnText:'编辑',
				form:{
					
					/*address:null,// (string, optional): 地址 ,
					
					
					
					createTime:null,// (integer, optional): 创建时间 ,
					creatorId:null,// (ObjectId, optional): 创建者 ,
					dataStatus :null,//(integer, optional): 数据状态（0：无效 1：有效） ,
					floor:null,// (Array[楼层], optional): 楼层对照表 ,
					houseId :null,//(ObjectId, optional): 项目id ,
					houseName:null,// (string, optional): 项目名称 ,
					
					modifiTime:null,// (integer, optional): 修改时间 ,
					modifierId:null,// (ObjectId, optional): 修改者*/
					/*
					*接口：4-12
					*H5:2018-4-13
					*最新修改
					*/
					buildName:null,// (string, optional): 名称或名称+单元 ,
					buildNum:null,// (string, optional): 楼号,
					communityId :null,//(ObjectId): 楼盘ID ,
					id :null,//(ObjectId, optional): 唯一id ,
					downFloorNum:0,// (integer, optional): 地下建筑层数 ,
					upFloorNum:0, //(integer, optional): 地上建筑层数
					//详情展示
					name:null //(string, optional): 名称或名称+单元 ,//获取
				}
			}
		},
		computed:{
		
			allFlound(){
				return parseFloat(this.form.downFloorNum?this.form.downFloorNum:0)+parseFloat(this.form.upFloorNum?this.form.upFloorNum:0)
			}
		},
		created(){
			Object.assign(this.saveform,this.form)
		},
		watch:{
			 detailId(newVal,oldVal){

				 if(newVal){

					this.disableds=true;
					this.form.communityId=this.detailId;
					this.$xttp.get(bulidMangerHttpUrl.buildDetail+this.detailId+'/detail').then(res=>{
						if(res.errorCode == 0){
							this.form.buildName=res.data.name;
							this.form.upFloorNum=res.data.upFloorNum;
							this.form.downFloorNum=res.data.downFloorNum;
							this.form.communityId=res.data.communityId;
							this.form.id=res.data.id;
						}else{
							this.$message(res.errorMsg+',获取失败！')
						}
					})
				 }
			}
		},

		methods:{
			editBtn(){
				if(this.editBtnText=='保存'){
					this.$xttp.post(bulidMangerHttpUrl.edit,this.form).then(res=>{
						if(res.errorCode ==0){

							this.$message('保存成功')
							this.hiddenM()
							this.$emit("editScuess")
						}else{
							this.$message(res.errorMsg)
							return false;
						}
					})
					
				}else{
					this.disableds=false;
				}
				this.editBtnText=this.editBtnText=='保存'?'编辑':'保存';

			},

			saveAdd(){
				this.$xttp.post(bulidMangerHttpUrl.add,this.form).then(res=>{
					if(res.errorCode==0){
	        				this.$message("新增成功");
	        				
	        				
	        				this.show=false;
	        				
	        				this.$emit("addSuccess",this.show)
	        				this.detailId=null;
	        			}else{
	        				this.$message(res.errorMsg)
	        			}
				})
				
			},
			hiddenM(){
				this.show=false;
				this.disableds=false;
				this.detailId=null;
				this.editBtnText='编辑';
				Object.assign(this.form,this.saveform)

			},

		}
	}
</script>
<style lang="scss" scoped>
	.buildadd{
		width:100%;
		height:100%;
		position:fixed;
		top:0;
		left:0;
		z-index:88;
		background:rgba(0,0,0,0.5);

		.buildadd_in{
			width:460px;
			height:360px;
			height:auto;
			margin:100px auto 0 auto;
			background:#fff;
			padding:30px;
			box-sizing:border-box;
			-o-box-sizing:border-box;
			-ms-box-sizing:border-box;
			-moz-box-sizing:border-box;
			-webkit-box-sizing:border-box;
			border-radius:5px 5px;
			-o-border-radius:5px 5px;
			-ms-border-radius:5px 5px;
			-moz-border-radius:5px 5px;
			-webkit-border-radius:5px 5px;
			position:relative;
			.close{
				height:30px;
				width:30px;
				text-align:center;
				line-height:30px;
				position:absolute;
				right:5px;
				top:0;
				font-size:20px;
				cursor:pointer;
			}
		}
	}
</style>

