<template>
	<div class="warp" v-if="mapshow==1" @click.self='close'>
		<div class="map_in">
			<p class='close' @click="close">X</p>
			<div class="title">
				楼层对照表				
			</div>
			<div class="mapshow">
				<div class="list_heards">
					<p>物理楼层</p>
					<p>标示楼层</p>
				</div>
				<!-- <ul class="map_list">
					<li v-for="(item,index) in form.upFloorNum">
						<span>{{form.upFloorNum-index}}</span>
						<p><input type="text" maxlength="4" :value='form.upFloorNum-index'></p>
					</li>
					<li v-for="(itemd,indexd) in form.downFloorNum">
						<span>{{-itemd}}</span>
						<p><input type="text" maxlength="4" :value='-itemd'></p>
					</li>
				</ul> -->
				<ul class="map_list">
				
					<li v-for="(item,index) in floor">
						<span>{{item.realNum}}</span>
						<p><input type="text" maxlength="4" v-model="item.displayNum"></p>
					</li>
				</ul>
			</div>
			<div class="buttons">
				<button @click="canscolBtn()">取消</button>
				<button @click="saveBtn()">保存</button>
			</div>
		</div>
	</div>
</template>
<script>
	import {bulidMangerHttpUrl} from '../httpUrl';
	export default{
		data(){
			return{
				isempty:false,
				mapshow:0,
				id:null,
				allfloodNum:0,
				floor:[{
					realNum:'',//物理楼层号(真实楼层)
					elevatorNum:'',//电梯层数
					displayNum:'',//显示楼层
				}],
				form:{
					downFloorNum:0,
					upFloorNum:0,
				},
			}
		},
		watch:{
			mapshow(newval,oldval){
				if(newval==1){
					this.$xttp.get(bulidMangerHttpUrl.detail+this.id+'/detail').then(res=>{
						if(res.errorCode ==0){
							this.$message('获取楼盘对照表成功！')
							if(Object.keys(res.data.floorMap).length==0){
								this.isempty=true;
							}else{
								this.isempty=false;
							}
							if(this.isempty){

								this.floor=[];	
								
								let setIn = {};
								let downfor=null;
								 for(let x =(this.form.upFloorNum+this.form.downFloorNum); x>0;x--){
								 	setIn={}
								 	setIn.realNum = x;
								 	downfor=x-this.form.downFloorNum;
								 	if(downfor==0||downfor<0){
								 		downfor-=1
								 	}
								 	setIn.displayNum=downfor
								 	this.floor.push(setIn)
								 }
								

								
							}else{
								this.floor=[];
								let setIn={}
								for(let keys in res.data.floorMap){
									console.log(keys)
									setIn={}
									setIn.realNum=keys;
									setIn.displayNum=res.data.floorMap[keys]
									this.floor.push(setIn)

								}
							}
						}else{
							this.$message(res.errorMsg )
							this.mapshow=false;
						}
					})
				}
				
				
				/*if(newval==1){
					this.$xttp.get(bulidMangerHttpUrl.detail+this.id+'/detail').then(res=>{
						if(res.errorCode ==0){
							console.log(res)
						}
					})
				}*/
			},

		},
		methods:{
			canscolBtn(){
				this.mapshow=0;
			},
			saveBtn(){
				
				this.$xttp.post(bulidMangerHttpUrl.buildMaplist,{buildId:this.id,floor:this.floor}).then(res=>{
						if(res.errorCode == 0){
							this.$message('保存成功!')
							this.mapshow=false;
							this.$emit('floorMapsave')
						}else{

						}
				})
			},
			//关闭
			close(){
				this.mapshow=0;
			}
		},

	}
</script>
<style lang="scss" scoped>
	.warp{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0,0,0,0.5);
		z-index:9999;

	}

	.map_in{
		width:370px;
		height:457px;
		margin:60px auto 0 auto;
		position:relative;
		background:white;
		border-radius:4px 4px;
		-o-border-radius:4px 4px;
		-ms-border-radius:4px 4px;
		-moz-border-radius:4px 4px;
		-webkit-border-radius:4px 4px;
	}

	.close{
		width:20px;
		height:20px;
		line-height:20px;
		text-align:center;
		position:absolute;
		position:absolute;
		right:6px;
		top:10px;
		cursor:pointer;
	}

	.title{
		width:100%;
		height:44px;
		line-height:44px;
		font-size:20px;
		background:#c4e0f7;
		padding-left:20px;
		 -o-border-box:box-sizing;
		 -ms-border-box:box-sizing;
		 -moz-border-box:box-sizing;
		 -webkit-border-box:box-sizing;


	}

	.mapshow{
		width:288px;
		height:312px;
		margin:0 auto;
		// padding:0 0px 0 0;
		// -o-border-box:box-sizing;
		// -ms-border-box:box-sizing;
		// -moz-border-box:box-sizing;
		// -webkit-border-box:box-sizing;
		border:1px #c4e0f7 solid;
		margin-top:10px;
		.list_heards{
			width:100%;
			height:36px;
			display:flex;
			background:#efefef;
			p{
				width:50%;
				flex:1;
				height:100%;
				line-height:36px;
				text-align:center;
				font-size:14px;

			}
			p:nth-child(1){
				border-right:1px #c4e0f7 solid;
			}
		}
		.map_list{
			height:276px;
			width:100%;
			overflow:auto;
			li{
				height:36px;
				line-height:36px;
				border-top:1px #c4e0f7 solid;
				border-bottom:1px #c4e0f7 solid;
				display:flex;
				font-size:13px;
				span{
					display:block;
					flex:1;
					height:100%;
					line-height:36px;
					border-right:1px #c4e0f7 solid;
					text-align:center;
				}
				p{
					height:100%;
					flex:1;
					input{
						width:99px;
						height:25px;
						display:block;
						margin:4px auto 0 ;
						text-align:center;
						border:1px #ddd solid;

					}
				}
			}
		}
	}

	.buttons{
		height:33px;
		width:100%;
		display:flex;
		margin-top:10px;
		justify-content:center;
		button{
			display:block;
			width:78px;
			height:33px;
			margin-right:10px;
			border-radius:4px 4px;
			-o-border-radius:4px 4px;
			-ms-border-radius:4px 4px;
			-moz-border-radius:4px 4px;
			-webkit-border-radius:4px 4px;
			background:#409EFF;
			color:white;
		}

	}

 ul::-webkit-scrollbar{
    width:0px;
    opacity:0;
    -webkit-overflow-scrolling: touch;
}

</style>