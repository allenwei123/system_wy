<template>
	<div class="warp" v-if="show" @click.self="close">
		<div class="in">
			<div class="close" @click="close">X</div>
			<div class="left">
				<el-form :model="form" ref="form" label-width="120px" class="demo-form">
					  <el-row>
          <el-col >
            <el-form-item label="项目名称" required :inline="true">
              <el-input v-model="form.projectName" style="width:220px;"></el-input>
            </el-form-item>
          </el-col>
         
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称"  :inline="true" v-if='false' >
              <el-select
                 v-model="name"
                 clearable
                  filterable
                 remote
                size="medium"
                 reserve-keyword
                 placeholder="客户名称"
                 :remote-method="remoteSearch"
                 :loading="loading" @change="customerChanges" >
                 <el-option
                   v-for="item in customerList"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id" style="width:200px;">
                 </el-option>
               </el-select>
              <!-- <el-input v-model="form.projectName" :disabled="disabled" style="width:90%;"></el-input> -->
            </el-form-item>
          </el-col>
        
        </el-row>

        <el-row>
          <el-col >
            <el-form-item label="客户名称"  :inline="true">
              <el-select
                 v-model="name"
                 clearable
                  filterable
                 remote
                
                 reserve-keyword
                 placeholder="客户名称"
                 :remote-method="remoteSearch"
                 :loading="loading" @change="customerChanges">
                 <el-option
                   v-for="item in customerList"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
              <!-- <el-input v-model="form.projectName" :disabled="disabled" style="width:90%;"></el-input> -->
            </el-form-item>
          </el-col>
           </el-row>
            <el-row>
          <el-col  :inline="true">
            <el-form-item label="关联合同" >
             <!--  <el-input v-model="form.name" ></el-input> -->
              <el-select v-model="form.ProjectTypeVaule" placeholder="请选择项目关联合同">
                  <el-option
                    v-for="(item,indexs) in projectType" :key='item.id'
                     :label="item.contractNum"
                    :value="item.id">
                  </el-option>
               </el-select>
            </el-form-item>
          </el-col>
        </el-row>
       
	       <el-form-item label="楼盘名称" required>
				    <el-select
                 v-model="form.houseName"
                clearable
                  filterable
                 remote

                 reserve-keyword
                 placeholder="请输入楼盘名称"
                 :remote-method="remoteSearchHouseName"
                 :loading="loading" @change="houseNameChanges" width="200px;">
                 <el-option
                   v-for="item in houseNameList"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
			 </el-form-item> 

        <el-form-item label="住宅类型" >
            <div>{{form.communityType==1?'写字楼':form.communityType==2?'住宅楼':form.communityType==3?'住宅楼':form.communityType==4?'医院':form.communityType==5?'商场':''}}</div>
       </el-form-item>     
	        
       
       
        <el-form-item label="详细地址" required :inline="true">
            <div>{{form.province}}{{form.city}}{{form.area}}{{form.address}}</div>
           
         </el-form-item>
          <el-form-item style="margin:0px auto;position:absolute;bottom:10px;left:20px;">
           		 <el-button @click="close">取消</el-button>
           		 <el-button type='primary' style="margin-left:60px;" @click="saveSubmit">确定</el-button>
           		 </el-form-item>
				</el-form>
			</div>
			<div class="mag">
				<googMap ref="myMap" width="300px"  height="250px" @click="mapClick" @complete="mapComplete"> </googMap>
			</div>
		</div>
	</div>
</template>
<script>
import googMap from '@/components/map'
import addressDatas from  '@/utils/addressData'
import {projectHttpUrl} from '@/page/home/basis/httpUrl'; 
	export default{
		components:{googMap,},
	    props: {
	      show: {
	        
	        default: false,
	      },
	      // type: {
	      //   type: String,
	      //   default: 'add',//add edit see
	      // },
	      // detail:{

	      // },
	      //  propId:{
	      //   default:null,
	      //   type:String
	      // },
	    	},
		data(){
			return{
				
				    initData:{},
		      	addressSelect: ['广东省', '广州市', '天河区'],//初始化地址
		        name:null,//客户名称
		      	customerList:[],//客户列表
		        houseNameList:[],
		        loading:false,
		        form: {
		          communityType:null,//(integer, optional): 楼盘类型（1：写字楼 2：住宅楼 3：医院 4：学校 5：商场 ） ,
		          houseName:null,
		          projectName: null,//项目名称
		          ProjectTypeVaule:null,//项目类型
		          user: null,
		          addressValue:'',//省
		          cityValue:'',//市
		          areaValue:'',//区
		          detailAddress:"",//详细地址，

		          province:null,// (string, optional): 省份 ,
		          city:null,// (string, optional): 城市 ,
		          area:null,// (string, optional): 区/县 ,
		          address:null, //(string, optional): 详细地址 ,
		          files: [{
		            name: 'xxx',
		            url: 'xxxxxx'
		          }],
		          startTime: null,
		          endTime: null,
		          cusmoterValue:'',
		          contactUntilValue:'',
		          elevatorNumber:"",
		        },
			        time: null,
				    projectType:[],//{value:'选项1',label:'住宅楼'},{value:'选项2',label:'写字楼'},{value:'选项3',label:'医院'},{value:'选项4',label:'学校'},{value:'选项5',label: '商场'}

			        addressData:addressDatas,//省份
			       
		   
			        cityList:[],
			        areaList:[],//区
			        cusmoterList:["888",8888,9999],//客户名称
			        contactUnitList:[9999,6666,7777],//关联合同
	       
       
			}
		},
		mounted(){
          this.$nextTick(()=>{
            this.$refs.myMap.$emit('mapInit',{
              // disabled:(this.type !== 'add' && this.selfType !== 'edit'),
              initAddress:this.addressSelect.join(''),
            })
          })
           
         
		},
    computed:{
      province(){
        return this.form.province;
      },
    },
    watch:{
      province(){
           this.$refs.myMap.updateMap(this.form.province+this.form.city+this.form.area+this.form.address)
      },
    },
		methods:{
			addSave(){

			},
			close(){
				this.$emit('projectAddHide')
			},
			//关闭当前

			 remoteSearch(query){
        console.log(query)
        if (query !== '') {
          this.loading = true;
          this.$xttp.post(projectHttpUrl.customer,{page:this.currentPage,size:10,name:query}).then(res=>{
            
            console.log(res)
            if(res.errorCode==0){
              
              this.customerList=res.data.records;


              
              // this.
            }else{
              this.$message(res.errorMsg)
            }
            this.loading = false;
          })
          
        } else {
          this.customerList = [];
        }
      },
       customerChanges(){
           console.log(this.name[0])
           this.$xttp.post(projectHttpUrl.contractList,{page:1,size:10,propertyCompanyId:[this.name]}).then(res=>{
                if(res.errorCode==0){
                    this.projectType=res.data.records
                }else{
                  this.$message(res.errorMsg)
                }
           })
       },
   //远程获取楼盘名称
    remoteSearchHouseName(query){
      if (query !== '') {
        this.loading = true;
        this.$xttp.post(projectHttpUrl.buildList,{page:this.currentPage,size:10,name:query}).then(res=>{
          
          console.log(res)
          if(res.errorCode==0){
            
            this.houseNameList=res.data.records;
            console.log(this.houseNameList)

            
            // this.
          }else{
            this.$message(res.errorMsg)
          }
          this.loading = false;
        })
        
      } else {
        this.customerList = [];
      }
        // this.houseNameList
    },
    houseNameChanges(){
      console.log(this.houseNameList)
        for( let x= 0 ; x<this.houseNameList.length;x++){
          if(this.houseNameList[x].id==this.form.houseName){
              console.log(9999)
              this.form.province=this.houseNameList[x].province;
              this.form.city = this.houseNameList[x].city
              this.form.area =this.houseNameList[x].area;
              this.form.address = this.houseNameList[x].address;
              this.form.communityType=this.houseNameList[x].communityType;
          }
        }
    },
    	//隐藏
    	accessSave(){
    		this.$emit("accessSave",this.show)
    	},
    	//提交接口
    	getData(op={}){
    		this.$xttp.post('house/add',op).then(res=>{
    			if(res.errorCode==0 && res.success==true){
    				this.$message('保存成功')
    				this.close();
    			}else{
    				this.$message('请输入完整信息')
            this.$message(res.errorMsg)
    			}
    		})
    	},
    	//保存添加
	    saveSubmit(){
	    	let sendData={
	    		"projectName":this.form.projectName,
	    		// "province":this.form.province,
	    		// "city":this.form.city,
	    		// "area":this.form.area,
	    		"address":this.form.address,
          'communityId':this.form.houseName,
	    		 "propId":this.name,
	    		// "contractId":"5ab5f4f4268a07d522c53649",
	    		// "propId":this.form.cusmoterValue,
	    		// "contractId":this.form.contactUntilValue,
	    		// "elevatorNumber":this.form.elevatorNumber
	    	}
	    	this.getData(sendData);
	    	
	    },
      handleAvatarSuccess(res, file){

      },
      handleRemove(){

      },
    
      //地图事件
      mapClick(val){
        return false;
        this.form.addressValue = val.province;//省
        this.form.cityValue = val.city;//市
        this.form.areaValue = val.district;//区
        this.form.detailAddress = val.formattedAddress;//详细地址
      },
      mapComplete(val){
        
        this.form.addressValue = val.province;//省
        this.form.cityValue = val.city;//市
        this.form.areaValue = val.district;//区
        this.form.detailAddress = val.formattedAddress;//详细地址
      },
      initFormData(){
      	Object.assign(this.initData,this.form)
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
			width:746px;
			height:480px;
			diplay:flex;
			background:white;
			margin:120px auto 0 auto; 
			padding:20px 20px 20px 0px;
			box-sizeing:border-box;
   				-o-box-sizeing:border-box;
   				-ms-box-sizeing:border-box;
   				-moz-box-sizeing:border-box;
   				-webkit-box-sizeing:border-box;
   				position:relative;
			.left{
				width:50%;
				height:100%;
			}
		}
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
				font-size:30px;
			}
</style>