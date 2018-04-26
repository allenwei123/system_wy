<template>
  <el-main>
    <my-direct @click="handleDirectClick"></my-direct>
    
    <!-- 新增终端 -->
    <!-- <addM v-if='choseIndex!=0' :pageIndex='choseIndex'></addM> -->
    <!--form开始输入框-->
    <div  class="page-list" v-if="choseIndex==0">
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          
          <!-- 项目名称 -->
         <el-select
                 v-model="endNumber"
                 multiple
                  filterable
                 remote
                 reserve-keyword
                 placeholder="客户名称"
                 :remote-method="remoteSearch"
                 :loading="loadings" @change="customerChanges">
                 <el-option
                   v-for="item in endNumberList"
                   :key="item.deviceCode"
                   :label="item.deviceCode"
                   :value="item.deviceCode">
                 </el-option>
         </el-select>
          

          <el-form-item>
            <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
          </el-form-item>

        </el-form>
     
        <el-button type="primary" class="c-addBtn" @click="add">新增终端</el-button>

      </div>
      <!--form输入结束-->

      <!-- 表格开始 -->
      <el-table :data="list" style="width: 100%" v-loading="loading"  tooltip-effect="dark" >
      
        <el-table-column label="电梯名称" :show-overflow-tooltip="true" width="110" align="center">
          <el-button type="text" slot-scope="scope" style="color:black;" >{{scope.row.houseName}}</el-button>
        </el-table-column>
        <el-table-column label="项目" :show-overflow-tooltip="true" align="center" >
          <template slot-scope="scope"  >{{ scope.row.propName }}</template>
        </el-table-column>

        <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center" width="100" >
          <el-button slot-scope="scope" type="text" style="color:blue;">{{ scope.row.contractNum }}</el-button>
        </el-table-column>

        <el-table-column label="故障内容" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope" >{{ scope.row.typeName }}</template>
        </el-table-column>
        </el-table-column>
         <el-table-column label="最新故障代码" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope" >{{ scope.row.typeName }}</template>
        </el-table-column>

        <el-table-column label="故障发生时间" :show-overflow-tooltip="true" align="center" width="80">
          <template slot-scope="scope">{{ scope.row.area }}</template>
        </el-table-column>

     

       

        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button @click="buildMangerDetail(scope.row)" type="primary" size="small" style="margin-left:30px;">编辑设备</el-button>
            <el-button @click="buildMangerDetail(scope.row)" type="primary" size="small" style="margin-left:30px;">删除设备</el-button>
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
      
    },
    methods: {
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
      },
      
       handleSelect(item) {
               console.log(item);
       },
       //导出（不用）
    
    
    
      /**
       * @description 查找
       */
      find(){
        let sendDataList={}
        sendDataList={
          area:this.areaValue,
          city:this.cityValue,//城市
          province:this.addressValue,//区域
          propName:this.customerValue,
       
        }
        this.get(sendDataList)
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
