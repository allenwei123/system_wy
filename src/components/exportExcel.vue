<template>
	<div>
		<!-- 本地导出选中导出 -->
			<!-- 
				1.需要安装3个依赖
						npm install -S file-saver xlsx

		             npm install -D script-loader，
		        2. 下载Blob.js和ExportsExcel.js,如vendor文件夹下的文件
		        3.使用

		        	<exportExcel  :detailData="detailDatas" :headerTitle="headerTitles" :filterName="filterNames"></exportExcel>
		       	date下设置：
		        表格头部：headerTitles:["项目名称","客户名称","关联合同","项目类型","项目区域","详细地址","电梯数","在保电梯数","开始时间","结束时间"],
		        要导出的json:detailDatas:[],
		        对应导出的字段：filterNames:["houseName","propName","propId","typeName","province","addressDetail","elevatorNumber","paulNumber","startDate","endDate"],
	        -->

		<!-- <button @click="export2Excel" class="exportBtn" v-if="exportType=='local'" >导出</button> -->


		<!-- 远程post导出 -->
			<!--
			 值需要传入url即可 
			使用：<exportExcel  :exportType='remote' :exportUrl='house/export' ：changInput="<input name:'后台接收字段' value='你要传的字段'/>"  ></exportExcel>
			-->
		<button @click="remoteExport" class="exportBtn" v-if='exportType=="remote"'>导出</button>
	</div>
	
</template>
<script >
	import XLSX from 'xlsx'; 
	export default{
		props:{
			//导出方式
			exportType:{
				type:String,
				default:"local",//1.local本地导出 2.remote远程导出
			},
		/*	//本地导出
			detailData:{
				type:Array,
				default:["88"],
			},
			headerTitle:{
				type:Array,
				default:[],
			},
			filterName:{
				type:Array,
				default:[],
			},*/
			//远程导出Url
			exportUrl:{
				type:String,
				default:'',
			},
			//要处理的参数：格式:<input name='' value=''/>

			changInput:{
				type:String,
				default:'',
			}
		},
		data(){
			return{
				list:[
				   
				 ]
			}
			
		},
		mounted(){/*this.flash();*/},
		created(){},
		methods:{
			//本地导出
			formatJson(filterVal, jsonData) {
				console.log(jsonData)
			 　　　　return jsonData.map(v => filterVal.map(j => v[j]))
			 　　},
			 export2Excel() {
			 		if(this.detailData.length==0){
			 			this.$message("请选择导出数据！")
			 			return false;
			 		}
			 　　　　require.ensure([], () => {

			 　　　　　　const { export_json_to_excel } = require('@/vendor/Export2Excel');
			 　　　　　　//const tHeader = ['商品名称','商品货号','售价','库存','销量','分享',];//筛选的头部
			 　　　　　　//const filterVal = ['name', 'number', 'salePrice', 'stocknums', 'salesnums', 'sharenums', ];//帅选的json字段
						
			 			const tHeader =this.headerTitle
			 			const filterVal=this.filterName
			 			const list=[];
			  // 　　　　　　const list = this.detailData;
			  			Object.assign(list,this.detailData);
			  			console.log(list)
			 　　　　　　const data = this.formatJson(filterVal, list);
			 　　　　　　export_json_to_excel(tHeader, data, '商品管理列表');
			 　　　　})
			 　 },
			 //远程导出
			 remoteExport(){
			 	let iframe = document.createElement('iframe');
			 	iframe.setAttribute('id','down-file-iframe');
			 	 let form = document.createElement('form')
			 	 form.target='down-file-iframe'
			 	 form.method='POST'
			 	 form.id='form_sub'
			 	 /**/

			 	let innerHTML=`<input type="hidden" name="CLIENT" value="6000" />\
			 	  <input type="hidden" name="BIT-UID" value="${this.$store.getters.uid}" />\
        		 <input type="hidden" name="BIT-TOKEN" value="${this.$store.getters.token}" />\
			 	 <input type="hidden" name="DEVICE-TYPE" value="1" />\
			 	  <input type="hidden" name="DEVICE-ID" value="1" />\
			 	  <input type="hidden" name="OS" value="3" />\
			 	  <input type="hidden" name="OS-VERSION" value="1" />\
			 	 <input type="hidden" name="APP-VERSION" value="1" />\
			 	  <input type="hidden" name="PUSH-ID" value="1" />`

			 	  	// this.$emit('inputInner',innerHTML)

			 	   form.innerHTML=innerHTML+this.changInput;

			 	    
			 	    
			 	   //对发送前和参数预处理
			 	   // this.$emit('inputInner',innerHTML)

			 	   /*
			 	   格式如：<input  name="province" value="${this.addressValue}" /> ` + (this.customerValue ? 
			          `<input  name="propId" value="${this.customerValue }" />` : '') +
			         `<input  name="houseName" value="${this.inputProjectName}"/>\
			          <input name="city" value="${this.cityValue}"/>\
			           <input  name="erea" value="${this.areaValue}"/>`
			           */
			           
			 	  // form.setAttribute('action',"http://apielevator.test.bitiot.com.cn/v1"+this.exportUrl)
			 	 
			 	   iframe.appendChild(form)

			 	   document.getElementsByTagName('body')[0].appendChild(iframe);

			 	   // console.log(document.getElementsByTagName('iframe')[0].children)
			 	       document.getElementById('form_sub').action="http://apielevator.test.bitiot.com.cn/v1/elevator/export"
			 	    // document.getElementsByTagName('form')[0].method="POST"
			 	   
			 	    document.getElementsByTagName('iframe')[0].children[0].submit()
			 	    // document.getElementsByTagName('form')[0].setAttribute('id','form_sub')

			 	   	document.getElementById('form_sub').submit()
			 	   	console.log(document.getElementById('form_sub'))
			 	     // form.submit();
			 	   iframe.remove();
			 	 
			 	   
			 }
		}
	}
</script>
<style lang="scss" scoped>
	.exportBtn{
		width:70px;
		height:39.6px;
		border:0 #000 solid;
		-o-border-raidus:4px 4px;
		-ms-border-radius:4px 4px;
		-webkit-border-radius:4px 4px;
		-moz-border-radius:4px 4px;
		background:#409EFF;
		color:white;
		font-family:"Simson";
		font-size:14px;
		margin:0px;
		cursor:pointer;
	}
</style>