<template>
	<div class="warp" v-if='show' @click.self='close'>
		<div class='in'>
			<div class="title"><p>故障记录</p> <span @click='close'>X</span></div>
			<ul class="messagedetail">
				<li v-for='(item,keys) in list'>
					<div class="detail">
						<span></span>
						<div>
							<p>{{item.causeFailure}}{{item.faultCode}}</p>
							<p>{{item.createTime}}</p>
						</div>
					</div>
					<div class='line'>
						<p></p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import {troubleMangerUrl} from '@/page/home/unioncenter/unioncenterUrl'
	export default{
		data(){
			return{
				list:[],
			}
		},
		props:{
			show:{
				default:false,
				type:Boolean,
			},
			id:{
				default:null,
				type:String,
			}
		},
		methods:{
			close(){
				this.$emit('troubleclose')
			}
		},
		mounted(){
			this.$xttp.get(troubleMangerUrl.troubleLog+this.id).then(res=>{
				console.log(res)
				if(res.errorCode==0){
					this.list=res.data
					console.log(this.list)
				}
			})
		}
	}
</script>
<style lang='scss' scoped>
	.warp{
		width:100%;
		height:100%;
		position:fixed;
		top:0;
		left:0;
		background:rgba(0,0,0,0.5);
		z-index:9999;
		.in{
			background:white;
			width:514px;
			heiht:518px;
			margin:60px auto 0 auto;
			.title{
				width:100%;
				height:44px;
				background:#c4e0f7;
				position:relative;
				p{
					height:100%;
					width:100%;
					line-height:44px;
					padding-left:12px;
					box-sizing:border-box;
					-o-box-sizing:border-box;
					-ms-box-sizing:border-box;
					-moz-box-sizing:border-box;
					-webkit-box-sizing:border-box;
				}
				span{
					display:block;
					position:absolute;
					right:0px;
					top:0;
					height:44px;
					width:44px;
					line-height:44px;
					text-align:center;
					cursor:pointer;
				}
			}
			.messagedetail{
				width:200px;
				height:auto;
				margin:30px auto;
				li{
					height:84px;
					margin-bottom:8px;
					.detail{
						width:100%;
						height:36px;
						position:relative;
						padding-left:30px;
						span{
							display:block;
							height:20px;
							width:20px;
							background:#cccccc;
							border-radius:50% 50%;
							-o-border-radius:50% 50%;
							-ms-border-radius:50% 50%;
							-moz-border-radius:50% 50%;
							-webkit-border-radius:50% 50%;
							position:absolute;
							left:0;
							top:8px;
						}
						p{
							color:#999;
							font-size:14px;
						}
					}
					.line{
						width:100%;
						height:48px;
						p{
							width:2px;
							height:40px;
							background:#ccc;
							margin:0 9px;
						}
					}
				}
				li:nth-child(1){
					p{
						color:#3399ff;

					}
					span{
						background:#3399ff;
					}

				}

				li:last-child{
					.line{
						display:none;
					}
				}

			}
		}

	}

</style>
