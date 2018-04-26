<template>
	 <!--保养管理-->
  <el-main>
      <transition name="fade">
         <imgShowUrl ref="imgShowM"></imgShowUrl>
      </transition>
      <transition name="fade">
        <adds ref="detailM" :show='addShow' @close='addClose'></adds>
      </transition>

    <div>
      <my-direct></my-direct>
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
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
              :loading="selectLoading" @change='projectChange(form.projectId)'>

              <el-option
                v-for="item in projectOption"
                :key="item.id"
                :label="item.projectName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-input v-model="form.projectName" placeholder="请输入项目名"></el-input> -->

          <el-form-item v-if='form.projectId'>
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
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>

        <!--   <el-input v-model="form.buildNum" placeholder="楼栋"></el-input> -->
          <el-select v-model="form.status" placeholder="请选择状态" size="small">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-form-item >
          <el-select
            v-model="form.maintenanceNum"
            size="small"
            filterable
            remote
            clearable
           reserve-keyword
            placeholder="保养单号"
            :remote-method="maintenanceNumSearchAsync"
            :loading="maintenanceNumLoading">
            <el-option
              v-for="item in maintenanceNumOption"
              :key="item.id"
              :label="item.maintenanceNum"
              :value="item.maintenanceNum">
            </el-option>
          </el-select>
        </el-form-item>
         <!--  <el-input v-model="form.maintenanceNum" placeholder="请输入保养单号"></el-input> -->

          <el-button type="primary" @click="search" size="small" style="margin-top:5px;">搜索</el-button>
        </el-form>
        <el-button type="primary" class="c-addBtn" @click="add" v-show='false'>新增</el-button>

         <el-date-picker
      v-model="value7"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions2" style="margin-top:10px;" @change="dateChange" size="small">
    </el-date-picker>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
      <el-table-column label="保养单号" :show-overflow-tooltip="true" width="130" align="center">
        <!-- <template type="text">{{scope.row.planName }}</el-button> -->
          <el-button slot-scope="scope" type="text" style="color:blue;" @click="showDetail(scope.row)">{{ scope.row.planName }}</el-button>
      </el-table-column>
      <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.projectName}}</template>
      </el-table-column>

      <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.buildNum  }}</template>
      </el-table-column>

      <el-table-column label="电梯名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.elevatorName }}</template>
      </el-table-column>

        <el-table-column label="计划日期" :show-overflow-tooltip="true" align="center"  width="140">
        <template slot-scope="scope">{{scope.row.planStartTime? new Date(scope.row.planStartTime).toLocaleDateString().replace(/\//g,'-'):""  }}</template>
      </el-table-column>

       <el-table-column label="执行日期" :show-overflow-tooltip="true" align="center"  width="140">
        <template slot-scope="scope">{{scope.row.startTime? new Date(scope.row.startTime ).toLocaleDateString().replace(/\//g,'-'):""   }}</template>
      </el-table-column>

      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">{{ scope.row.status==0?"未开始":scope.row.status==1?"已出发":scope.row.status==2?"保养中":scope.row.status==3?"保养结束 ":scope.row.status==4?"用户已确认":false}}</template>
      </el-table-column>

      <el-table-column label="维保工人" :show-overflow-tooltip="true" align="center" >
       <!--  <template slot-scope="scope">{{ scope.row.groupMembers}}</template> -->
        <template slot-scope="scope"><p style="font-size:12px;" v-for="(items,index) in scope.row.groupMembers">{{items.userName}}</p ></template>
      </el-table-column>

      <el-table-column label="耗时(分钟)" :show-overflow-tooltip="true" align="center"  >
        <template slot-scope="scope">{{ scope.row.timeConsuming}}</template>
      </el-table-column>

      <el-table-column label="物业签字" :show-overflow-tooltip="true" align="center"  >
        <template slot-scope="scope">{{ scope.row.customerAutograph.length==0?"":scope.row.customerAutograph }}</template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button @click="showReport(scope.row)" type="primary" size="small" style="margin:0 auto">保养报告</el-button>

        </template>
      </el-table-column>
    </el-table>
    <div class="c-block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </el-main>
</template>
<script>
  import myDirect from '@/components/direct'
  import {maintainHttpUrl} from '@/page/home/jobmangement/jobMangerUrl'
  import imgShowUrl from '@/page/home/jobmangement/maintain/reportImg'
  import {filterParams} from '@/utils/process'
  import adds from './add'

  export default {
    name: 'contractManage',
    components:{myDirect,imgShowUrl,adds},
    data(){
      return {
        addShow:0,//add显示隐藏
        list:[],
        msg: 'hello',
        sendData:{
    		  endTime: 0,
    		  page: 1,

    		  startTime: 0,
    		  templateId: "string"
    		},
        //头部筛选
        projectOption:[],
        selectLoading:false,
        buildLoading:false,
        buildOption:[],
        communityId:null,

        maintenanceNumLoading:false,
        maintenanceNumOption:[],
        form:{
         brandId:null,//(ObjectId, optional): 品牌id ,
         companyId:null,// (ObjectId, optional): 公司id ,
         elevatorId:null,// (ObjectId, optional): 电梯id ,
         endPlanTime:null,// (integer, optional): 查询条件计划时间右边界 ,
         endTime:null,// (integer, optional): 创建时间 结束时间 ,
         houseId:null,// (ObjectId, optional): 楼盘id ,
         //page:1,// (integer, optional): 页码 ,
         //size:10,// (integer, optional): 每页所包含的条数 ,
         startPlanTime:null,// (integer, optional): 查询条件计划时间左边界 ,
         startTime:null,// (integer, optional): 创建时间 开始时间 ,
         status:null,// (integer, optional): 状态（0：未开始 1：已出发 2：保养中 3：保养结束 4：用户已确认） ,
         userId:null,// (ObjectId, optional): 用户userId

         //新版本部分
         maintenanceNum:null,//保养单号
         buildNum:null,//楼号
         projectName:null,//项目名称
         houseName:null,//楼盘名称
         projectId:null,
        },
        currentPage:1,
        total:1,
        size: 10,
        loading:false,//列表加载loading
        statusList:[
            {value:null,label:'全部状态'}
            ,{value:0,label:'未开始'}
            ,{value:1,label:'已出发'}
            ,{value:2,label:'保养中'}
            ,{value:3,label:'保养结束'}
            ,{value:4,label:'用户已确认'}
        ],
        statusValue:'',
        inputName:'',//输入名称
        inputmaintainNum:'',//输入保养单号


        //时间选择
         pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
         value7:'',
      }
      // http://apielevator.test.bitiot.com.cn/v1/maintenanceTemplate/list

    },
    methods:{
      //项目筛选
      projectSearchAsync(queryString){
       

        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
         this.$xttp.post(maintainHttpUrl.projectName,{
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
        if(value){
             for(let x = 0 ;x<this.projectOption.length;x++){
                if(this.projectOption[x].id==value){

                  this.communityId=this.projectOption[x].communityId;
                  console.log( this.projectOption[x],this.communityId)
                }
            }
        }
       
        
      },
      buildSearchAsync(query){//获取楼盘名称
      
         if (query.trim() === '') {
            return false;
          }
           this.buildLoading = true;
           this.$xttp.post(maintainHttpUrl.buildName,{
             communityId:this.communityId,
              buildName:query,
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
      //单号筛选
      maintenanceNumSearchAsync(){
          if (query.trim() === '') {
            return false;
          }
           this.maintenanceNumLoading = true;
           this.$xttp.post(maintainHttpUrl.list,{
             maintenanceNum:this.form.maintenanceNum,
              page:1,
              size:10,
            }).then(res => {
              if(res.errorCode==0){
                this.maintenanceNumOption=res.data.records
            
                this.maintenanceNumLoading = false;
              }
              
            })
         
             this.maintenanceNumLoading = false;
      },
      addClose(){
        this.addShow=0;
      },

      showDetail(val){
       this.addShow=1;
        this.$refs.detailM.id=val.id;
      },
      dateChange(){

        this.form.startTime=this.value7[0].valueOf();
        this.form.endTime =this.value7[1].valueOf();

      },
      //未完成为高量
      tableRowClassName({row, rowIndex}) {
        let date = new Date()

        if(date.valueOf()>row.planStartTime && row.planStartTime<row.startTime){

            return 'warning-row';
        }
        return '';
      },
      /**
       * @description 新增
       */
      add(){
        console.log('新增')
      },
      /**
       * @description 查找
       */
      find(){

      },
      /**
       * @description 编辑
       * @param row 行数据
       */
      showReport(row){
        console.log(row)
         this.$refs.imgShowM.imgUrl=row.reportImage
         if(this.$refs.imgShowM.imgUrl){
          this.$refs.imgShowM.imgShow=true;
        }else{
          this.$message("无相关信息")
        }

      },
      /**
       * @description 换页
       */
      handleCurrentChange(currentPage){
         this.currentPage = currentPage;
         this.getListData();
      },
      getListData(){
      	this.$xttp.post(maintainHttpUrl.list,Object.assign({
          page:this.currentPage,
          size:this.size,
        },filterParams(this.form))).then(res=>{
          if(res.errorCode ==0){

            this.list = res['data'].records;
            this.total = res['data'].total;
          }else{
            this.$message(res.errorMsg)
          }
        })
      },
      search(){
        // this.form.size=1;

        this.getListData()
      },
    },
    created(){
    	this.getListData();



    }
  }
</script>
<style  lang="scss" >

.el-table .warning-row{
    background-color:#f56c6c;
}
  .c-search {
    position: relative;
    width: 100%;
    margin-bottom:13px;
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }


</style>
