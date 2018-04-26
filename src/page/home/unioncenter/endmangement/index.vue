<template>
  <el-main>
    <my-direct @click="handleDirectClick"></my-direct>
    
    <!-- 新增终端 -->
    <!-- <addM v-if='choseIndex!=0' :pageIndex='choseIndex'></addM> -->
    <router-view v-if="choseIndex==1"></router-view>
    <!--form开始输入框-->
    <div  class="page-list" v-if="choseIndex==0">
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          
          <!-- 项目名称 -->
         <el-select
                 v-model="endNumber"
                  filterable
                 remote
                 
                 reserve-keyword
                 placeholder="终端编号"
                 :remote-method="remoteSearch"
                 :loading="loadings" @change="customerChanges" size="small" style="margin-top:5px;"> 
                 <el-option
                   v-for="item in endNumberList"
                   :key="item.deviceCode"
                   :label="item.deviceCode"
                   :value="item.deviceCode">
                 </el-option>
         </el-select>
          <el-form-item>
            <el-button type="primary" @click="find" size="small">查询</el-button>
          </el-form-item>

        </el-form>
     
        <el-button type="primary" class="c-addBtn" size="small" @click="add">新增终端</el-button>

      </div>
      <!--form输入结束-->

      <!-- 表格开始 -->
      <el-table :data="list" style="width: 100%" v-loading="loading"  tooltip-effect="dark" >
      
        <el-table-column label="终端编码" :show-overflow-tooltip="true" width="110" align="center">
          <el-button type="text" @click="showDetail(scope.row)"  slot-scope="scope" style="color:blue;" >{{scope.row.deviceCode }}</el-button>
        </el-table-column>
        <el-table-column label="手机号码" :show-overflow-tooltip="true" align="center" width="150">
          <template slot-scope="scope"  >{{ scope.row.mobile  }}</template>
        </el-table-column>

        <el-table-column label="SIM号码" :show-overflow-tooltip="true" align="center" width="140" >
          <el-button slot-scope="scope" type="text" style="color:black;">{{ scope.row.simNumber  }}</el-button>
        </el-table-column>

        <el-table-column label="连接状态" :show-overflow-tooltip="true" align="center"  width="100">
          <el-button slot-scope="scope" :style="{color:scope.row.connectStatus=='0'?'green':'red'}" type="text">{{ scope.row.connectStatus=='0'?'已连接':'未连接' }}</el-button>
        </el-table-column>

        <el-table-column label="添加日期" :show-overflow-tooltip="true" align="center" width="160">
          <template slot-scope="scope">{{new Date(scope.row.createTime).toLocaleDateString().replace(/\//g,'-') }}</template>
        </el-table-column>

     

       

        <el-table-column label="操作" width="230" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button @click="editDevice(scope.row)" type="primary" size="small" style="margin-left:10px;">编辑设备</el-button>
            <el-button @click="deleteDevice(scope.row)" type="danger" size="small" style="margin-left:10px;">删除设备</el-button>
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
  import {endmangementUrl} from '@/page/home/unioncenter/unioncenterUrl';
  // import addM from './add'
  import myDirect from '@/components/direct';
  
 
 

  export default {
    name: 'contractManage',
    components: {myDirect},
    data(){
      return {
        //选中增加，编辑，详情
        //1：未连接  0：已连接
        choseIndex:0,//0列表  1增加，2编辑，3详情
        loadings:false,
        endNumber:'',
        endNumberList:[],
        BuildName:null,
        list:[],
        form: {
          name: ''
        },
        currentPage: 1,//当前页码
        total: 1,//总数
        size: 10,//总页数
        loading: false,//列表加载loading
        
         timeout:null,    
      }
    },
    watch:{
      //侦听显示电梯管理显示
      $route(to){
        if(this.$route.name=='endmangement'){
         
          this.choseIndex=0;
          this.get()
        }else{

        }
        console.log(this.$route.name,to)
      }
    },
    methods: {
      //编辑终端
      editDevice(row){
        this.choseIndex=1;
        this.$router.push({name:"endmangementAdd",params:{id:row.id,type:'edit'}})
      },
      //获取详情
      showDetail(row){
         console.log(row)
         this.choseIndex=1;
        this.$router.push({name:"endmangementAdd",params:{id:row.id,type:'detail'}})
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
      //删除设备
      deleteDevice(row){
         this.$confirm('此操作将永久删除此数据吗, 是否继续?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$xttp.get(endmangementUrl.delete+row.id+'/delete').then(res=>{
              if(res.errorCode==0){
                  this.$message({
              message: '删除成功',
              type: 'success'})
                  this.get();
              }else{
                 this.$message.error(res.errorMsg)
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
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
        console.log(99999)
        this.choseIndex=0;
         this.$store.commit('POPDIRECT');
      },
      //远程获取数据
      async get(op = {}){
        this.$xttp.post(endmangementUrl.list,Object.assign({
          page:this.currentPage,
          size:this.size,
        },op)).then(res=>{
         
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
</style>
