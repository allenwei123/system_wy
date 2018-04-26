<template>
  <!--年检管理-->
  <el-main>
    <div style="width:100%;height:100%;">
      <my-direct @click='handleCurrentChange'></my-direct>


       <!--  <submiltMessage ref="submiteM" :id="id" :show="submitShow" @submitSucc='submitSucc' v-if='submitShow==1'></submiltMessage> -->

       <router-view v-if="submitShow==1"></router-view>
      <div v-if="submitShow==0">
          <div class="c-search">

                  <el-select v-model="statusValue" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

         
            <el-select
              v-model="form.projectId"
              size="small"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="项目"
              :remote-method="projectSearchAsync"
              :loading="selectLoading" @change='projectChange(form.projectId)'  >
              <el-option
                v-for="item in projectOption"
                :key="item.id"
                :label="item.projectName"
                :value="item.id">
              </el-option>
            </el-select>

            <el-select
              v-model="form.communityId"
              size="small"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="楼栋"
              :remote-method="elevSearchAsync"
              :loading="elevselectLoading" @change='elevChange()' v-if="communityId">
              <el-option
                v-for="item in elevatorList"
                :key="item.id"
                :label="item.name "
                :value="item.id">
              </el-option>
            </el-select>
          
                    
                  <!-- <el-input v-model="form.projectName" placeholder="项目名称、梯号"  size="small"></el-input> -->
                  <el-button type="primary" @click="find" size="small">查询</el-button>
                </el-form-item>
              </el-form>
              <el-button type="primary" class="c-addBtn" @click="add" v-show='false'>新增</el-button>
           </div>

          <el-table :data="list" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
            <el-table-column
            type="selection"
            width="55" v-if="false">
          </el-table-column>
            <el-table-column label="年检单号" :show-overflow-tooltip="true" width="130" align="center">
              <template slot-scope="scope">{{ scope.row.maintenanceNum}}</template>
            </el-table-column>

             <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.projectName }}</template>
            </el-table-column>
            <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.buildNum  }}</template>
            </el-table-column>

            <el-table-column label="电梯名称" :show-overflow-tooltip="true" align="center" width="100">
              <template slot-scope="scope">{{ scope.row.elevatorName  }}</template>
            </el-table-column>

            <el-table-column label="注册代码" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.registerCode  }}</template>
            </el-table-column>

            <el-table-column label="状态" :show-overflow-tooltip="true" align="center"  width="200">
              <template slot-scope="scope">{{ status[scope.row.status] }}</template>
            </el-table-column>

            <el-table-column label="班组负责人" :show-overflow-tooltip="true" align="center"  width="170">
              <template slot-scope="scope">{{ scope.row.groupHeadName  }}</template>
            </el-table-column>

            <el-table-column label="下次年检时间" :show-overflow-tooltip="true" align="center"  width="170">
              <template slot-scope="scope">{{scope.row.planStartTime? new Date(scope.row.planStartTime).toLocaleDateString().replace(/\//g,'-'):""}}</template>
            </el-table-column>

            <el-table-column label="检查限速器" :show-overflow-tooltip="true" align="center"  width="170">
              <template slot-scope="scope">
                <div class="checks" :class="{ischeck:scope.row.checkLimit==1?true:false}" >
                  <img src="./chose.png" alt="" v-show=''>
                </div>
             <!--  <i :class="{scope.row.checkLimit==0?'el-icon-error':'el-icon-success'}"></i> -->
              </template>
             <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            </el-table-column>



            <el-table-column label="操作" width="180" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)" type="primary" size="small">提交年检信息</el-button>

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
      </div>
    </div>
  </el-main>
</template>
<script>
  import myDirect from '@/components/direct'
   import {annualHttpUrl} from '@/page/home/jobmangement/jobMangerUrl'
   import {filterParams} from '@/utils/process'
   import submiltMessage from './submilemessage'
  export default {
    name: 'contractManage',
    components:{myDirect,submiltMessage},
    data(){
      return {
        elevselectLoading:false,
        elevatorList:[],
        communityId:null,
        selectLoading:false,
        projectOption:[],
        id:null,
        submitShow:0,//0:主页显示1：提交年检单
        hadCheck:false,
        status:{0:"未开始" ,1:"已出发", 2:"保养中", 3:"保养结束", 4:"用户已确认"},
        list:[],
        msg: 'hello',
        tableData:[{phone:8888}],
        form:{
          status:null, //(integer, optional): 状态（0：未开始 1：已出发 2：保养中 3：保养结束 4：用户已确认） ,
          projectName:null, //(string, optional): 项目名称 ,
          // houseId:null,
          projectId:null,
          buildId:null,
           communityId:null,
        },
        size:10,
        currentPage:1,
        total:1,
        loading:false,//列表加载loading
        sendData:{},
        //状态选择
         statusList:[{value:'2',label:'全部状态'},{value:'0',label:'未完成年检'},{value:'1',label:'已完成年检'}],
        statusValue:'',
      }
    },
    watch:{
      $route(){
        if(this.$route.name=='annualManage'){
         
          this.submitShow=0;
          this.getListData();
        }else{

        }
      },
    },
    methods:{
       elevChange(){},
       //远程获取梯号
      elevSearchAsync(queryString){
         if (queryString.trim() === '') {
            return false;
          }
          this.elevselectLoading = true;
           this.$xttp.post(annualHttpUrl.buildName,{
              communityId:this.communityId,

              page:1,
              size:10,
            }).then(res => {
              console.log(res)
              this.elevatorList=[];
              this.elevatorList=res.data.records
              
               this.elevselectLoading = false;
            })
           
            this.elevselectLoading = false;
      },
      //远程获取项目列表选择
      projectSearchAsync(queryString){
       

        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
         this.$xttp.post(annualHttpUrl.projectName,{
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
        // this.communityId=value;
        console.log(value)
            for(let x = 0 ; x<this.projectOption.length;x++){
              if(this.projectOption[x].id==value){
                  this.communityId = this.projectOption[x].communityId;
                  // this.form.communityId = this.projectOption[x].communityId;
              }
            }
            console.log(this.communityId)
      },
      //提交成功
      submitSucc(){
          this.submitShow=0;
          this.$store.commit('POPDIRECT');
      },
        tableRowClassName({row, rowIndex}) {
        let date = new Date()

        if(date.valueOf()>row.planStartTime){

            return 'warning-row';
        }else if(date.valueOf()-row.planStartTime>0&&date.valueOf()-row.planStartTime<0){
             return 'tow-monts';
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
        this.form.status=this.statusValue

        this.getListData();
      },
      /**
       * @description 年检报告详情
       * @param row 行数据
       */
      edit(row){

        this.submitShow=1;
        this.$router.push({name:"submilemessage",params:{id:row.id}})
        this.id=row.id
      },
      /**
       * @description 换页
       */
      handleCurrentChange(){
        console.log(882)
          this.submitShow=0;
          this.$store.commit('POPDIRECT');
      },
       getListData(){
        this.$xttp.post(annualHttpUrl.list,Object.assign({
          page:this.currentPage,
          size:10,
        },filterParams(this.form))).then(res=>{
          console.log(res)
            this.list=res.data.records
            this.currentPage=res.data.currentPage
        })
      },
      handleSelectionChange(val){
        console.log(val)
      },
    },
    created(){
      this.getListData()
    }
  }
</script>
<style lang="scss" scoped>
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
  .checks{
      margin:0 auto;
    display:block;
    width:10px;
    height:10px;
    border:1px #000 solid;
  }

  .ischeck{

    background-position:-3px -3px;
    background-repeat:no-repeat;
    background-image:url('./chose.png') ;
    background-size:13px 14px;
  }
</style>
