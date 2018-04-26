<template>
  <el-main>
    <my-direct @click="handleDirectClick"></my-direct>
    
    <!-- 新增终端 -->
    <!-- <addM v-if='choseIndex!=0' :pageIndex='choseIndex'></addM> -->
     
   <troublelog v-if="troubleShow" :show='troubleShow' :id='logId' @troubleclose='troubleclose'></troublelog>

   <detail v-if="detailshows" :show='detailshows' @detailHidden='detailHidden' :id='showid'></detail>
    <!--form开始输入框-->
    <div  class="page-list" v-if="choseIndex==0">
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          
          <!-- 项目名称 -->
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
            :loading="selectLoading" @change='projectChange(form.projectName)'>

            <el-option
              v-for="item in projectOption"
              :key="item.id"
              :label="item.projectName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
          <!-- 楼盘名称 -->
          <el-form-item v-if='form.projectId'>
          <el-select
            v-model="form.communityId"
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
              :label="item.projectName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
          <!-- 所处理状态 -->

          <el-select v-model="form.status" placeholder="所有故障状态" size="small"  style="width:120px;margin:5px 40px 0 0;">
              <el-option
                v-for="item in takeTrouble"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
           </el-select>
           


          <el-form-item>
          <el-select
            v-model="form.name"
            size="small"
            filterable
            remote
            clearable
           reserve-keyword
            placeholder="电梯名称"
            :remote-method="elevatorSearchAsync"
            :loading="elevatorLoading">
            <el-option
              v-for="item in elevatorLlist"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="find" size="small" style="margin-left:30px;">查询</el-button>
          </el-form-item>

        </el-form>
     
        <el-button  type="primary" class="c-addBtn" @click="add" v-if='false'>新增终端</el-button>

      </div>
      <!--form输入结束-->

      <!-- 表格开始 -->
      <el-table :data="list" style="width: 100%" v-loading="loading"  tooltip-effect="dark" >
      
        <el-table-column label="电梯名称" :show-overflow-tooltip="true" width="110" align="center">
          <el-button type="text" @click="showDetail(scope.row)"  slot-scope="scope" style="color:blue;" >{{scope.row.elevatorName }}</el-button>
        </el-table-column>
        <el-table-column label="项目" :show-overflow-tooltip="true" align="center" width="150">
          <template slot-scope="scope"  >{{ scope.row.projectName  }}</template>
        </el-table-column>

        <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center" width="140" >
          <el-button slot-scope="scope" type="text" style="color:black;">{{ scope.row.buildName  }}</el-button>
        </el-table-column>

        <el-table-column label="故障发生时间" :show-overflow-tooltip="true" align="center" width="160">
          <template slot-scope="scope">{{new Date(scope.row.faultDate).toLocaleDateString().replace(/\//g,'-') }}</template>
        </el-table-column>

         <el-table-column label="最新故障代码" :show-overflow-tooltip="true" align="center"  width="150">
          <el-button slot-scope="scope"  type="text">{{ scope.row.faultCode }}</el-button>
        </el-table-column>

        <el-table-column label="最新故障内容" :show-overflow-tooltip="true" align="center"  width="150">
          <el-button slot-scope="scope"  type="text">{{ scope.row.causeFailure }}</el-button>
        </el-table-column>

        <el-table-column label="故障部位" :show-overflow-tooltip="true" align="center"  width="150">
          <el-button slot-scope="scope"  type="text">{{ scope.row.faultPosition}}</el-button>
        </el-table-column>

        <el-table-column label="处理状态" :show-overflow-tooltip="true" align="center"  width="150">
          <el-button slot-scope="scope"  type="text">{{ troublestatusList[scope.row.status] }}</el-button>
        </el-table-column>

     

       

        <el-table-column label="操作" width="230" fixed="right" align="center" style="position:relative;">
          <template slot-scope="scope">
            <el-button @click="troubleDo(scope.row)" type="danger" size="small" style="margin-left:10px;">故障处理</el-button>
            <ul class="dochoselist" v-if="scope.row.id==showTroubleDo">
              <li v-for='(itimst,keyst) in endNumberList' @click="troubleDoSum(scope.row,keyst)">{{itimst}}</li>
            </ul>
            <el-button @click="troubleLog(scope.row)" type="primary" size="small" style="margin-left:10px;">故障记录</el-button>
          </template>
        </el-table-column>
      </el-table> 

      <!-- 表格结束 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="size"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- 群组管理 -->
  
  </el-main>
</template>
<script>
  import {troubleMangerUrl,endmangementUrl} from '@/page/home/unioncenter/unioncenterUrl';
   import troublelog from './troubleshowdetail'
   import detail from './detail'
  import myDirect from '@/components/direct';
  
 
 

  export default {
    name: 'contractManage',
    components: {myDirect, troublelog,detail},
    data(){
      return {
        showid:null,
        detailshows:false,
        takeTrouble:[{value:null,label:'所有处理'},{value:0,label:'待处理'},{value:1,label:'转急修'},{value:2,label:'转保养'},{value:3,label:'不需要处理'},{value:4,label:'故障恢复'}],//0：待处理 1:转急修 2转保养 3:不需要处理
        selectLoading:false,
        projectOption:[],//项目列表
        buildLoading:false,
        buildOption:[],//楼盘列表
        elevatorLoading:false,
        elevatorLlist:[],//电梯列表
        logId:null,
        troubleShow:false,
        showTroubleDo:null,
        communityId:null,
        //选中增加，编辑，详情
        //1：未连接  0：已连接
        choseIndex:0,//0列表  1增加，2编辑，3详情
        loadings:false,
        endNumber:'',
        endNumberList:['不需要处理','转维修','转维保'],//故障处理列表
        troublestatusList:{ 0:"待处理", 1:"转急修", 2:"转保养", 3:"不需要处理"},
        BuildName:null,
        list:[],
        form: {
          projectName:null,
          buildName:null,
          status:null,
          name:null,
          projectId:null,
          communityId:null,

        },
        currentPage: 1,//当前页码
        total: 1,//总数
        size: 10,//总页数
        loading: false,//列表加载loading
        
         timeout:null, 
         troubleDolist:[],   
      }
    },
    watch:{
      //侦听显示电梯管理显示
      
    },
    methods: {
      //故障处理
      troubleDoSum(row,key){
        console.log(row,key)
        return false;
         this.$xttp.post(troubleMangerUrl.troubleDo,{id:row.id,type:key+1}).then(res=>{
          console.log(res)
         })
      },
      //详情隐藏
      detailHidden(){
        this.detailshows=false;
      },
      //远程项目名称
      projectSearchAsync(queryString){
       

        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
         this.$xttp.post(troubleMangerUrl.projectName,{
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
      buildSearchAsync(query){//获取楼栋名称
        if(this.communityId){
          this.$message('')
        }
         if (query.trim() === '') {
            return false;
          }
           this.buildLoading = true;
           this.$xttp.post(operationMonitoringUrl.buildName,{
              projectName:query,
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
      projectChange(value){
        for(let x = 0 ; x<this.projectOption.length;x++){
                if(this.projectOption[x].id==value){
                    this.communityId = this.projectOption[x].communityId;
                    // this.form.communityId = this.projectOption[x].communityId;
                }
              }
      },
      elevatorSearchAsync(query){
        if (query.trim() === '') {
            return false;
         }
          this.elevatorLoading = true;
           this.$xttp.post(elevtorName.elevtorName,{
              name:query,
              page:1,
              size:10,
            }).then(res => {
              if(res.errorCode==0){
                this.elevatorLlist=res.data.records
            
                this.elevatorLoading = false;
              }
              
            })
         
             this.elevatorLoading = false;
      },

      //故障记录关闭
      troubleclose(){
        this.troubleShow=false;
        this.logId=null;
      },
      //故障处理
      troubleDo(row){
        this.showTroubleDo=this.showTroubleDo==null?row.id:null;
       
      },
      //获取详情
      showDetail(row){
          this.$message("功能未开放")
          return false
          this.detailshows=true;
          this.showid=row.id;
        
      },
      //远程获取终端编号称列表
      remoteSearch(query){
        console.log(query)
        if (query !== '') {
          this.loadings = true;
          this.$xttp.post(endmangementUrl.list,{page:this.currentPage,size:10,name:query}).then(res=>{
            
            console.log(res)
            if(res.errorCode==0){ 
              this.endNumberList=res.data.records;
            }else{
              this.$message(res.errorMsg)
            }
            this.loadings = false;
          })
          
        } else {
          this.customerList = [];
        }
      },
      //当终端编号input改变
       customerChanges(){
          this.customerValue = this.customerId[0]
       },
     
      //楼栋管理
     buildMangerDetail(){},
   
       /**
       * @description 新增
       */
      
      add(){
        this.choseIndex=1;
        this.$router.push({name:"endmangementAdd",params:{id:'1',type:'add'}})
      },
      
       handleSelect(item) {
               console.log(item);
       },
       //导出（不用）
    
    
    
      /**
       * @description 查找
       */
      find(){
       let sendData={}
       sendData.deviceCode=this.endNumber;
        this.get(sendData)
      },
      //故障详情
      troubleLog(row){
       
        this.logId=row.id;
         this.troubleShow=true;
        
      },
      //选择条目选择并对数据进行帅选导出
      
      
      /**
       * @description 换页
       * @param currentPage
       */
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.get();
      },
    
      //顶部导航栏事件
      handleDirectClick(){
        this.choseIndex=0;
         this.$store.commit('POPDIRECT');
      },
      //远程获取数据
      async get(op = {}){
        this.$xttp.post(troubleMangerUrl.list,Object.assign({
          page:this.currentPage,
          size:this.size,
        },op)).then(res=>{
         console.log(res)
          if (!res.errorCode) {

            this.list = res['data'].records;
            // Object.assign(this.list,res.data.records)
          
            this.total = res['data'].total;
             
          }
        })
      }
    },
    mounted(){
     
      
        this.get({})
        
    },
    updated(){
      // console.log(this.liftShow)
      
    
    }
  }
</script>
<style lang="scss" scoped>
  .c-search {
    position: relative;
    width: 100%;
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
    .c-outBtn{
     margin-bottom:10px;
    }
  }
  .page-list {
    width: 100%;
    height: 100%;
  }

  .dochoselist{
    background:white;
    z-index:9999;
    position:absolute;
    left:38px;
    top:38px;
    border:1px #ddd solid;
    li{
      cursor:pointer;
      font-size:12px;
      color:white;
      padding:2px 4px;
      borer-box:box-sizing;
      -o-borer-box:box-sizing;
      -ms-borer-box:box-sizing;
      -moz-borer-box:box-sizing;
      -webkit-borer-box:box-sizing;
      background:#f56c6c;

    }
    li:hover{
      background:blue;
    }
  }
</style>
