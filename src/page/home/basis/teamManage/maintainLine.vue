<template>
  <!--保养路线-->
  <div>
    <div class="page-team-maintainPlan">
        <myDirect/>
        <div class="c-search">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select
                v-model="form.projectId"
                size="small"
                filterable
                remote
                clearable
                reserve-keyword
                default-first-option
                placeholder="项目"
                :remote-method="projectSearchAsync"
                :loading="selectLoading">
                <el-option
                  v-for="item in projectOption"
                  :key="item.id"
                  :label="item.projectName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="time"
                size="small"
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.name" size="small" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="find">搜索</el-button>
            </el-form-item>
          </el-form>
          <div class="c-process">
            <!--<el-button type="primary" size="small" @click="openPage('editMaintainLine','add')">新增</el-button>-->
          </div>
        </div>
        <el-table :data="list" style="width: 100%" v-loading="loading">
          <el-table-column label="小组" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{scope.row.workGroupName}}</template>
          </el-table-column>
          <el-table-column label="日期" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{scope.row.planStartTime | time}}</template>
          </el-table-column>

          <el-table-column label="星期" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{scope.row.planStartTime | week}}</template>
          </el-table-column>

          <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{ scope.row.projectName }}</template>
          </el-table-column>

          <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{scope.row.buildNum }}</template>
          </el-table-column>

          <el-table-column label="电梯名称" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{scope.row.elevatorName}}</template>
          </el-table-column>

          <el-table-column label="预计工时" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{parseInt( (scope.row.planEndTime  - scope.row.planStartTime ) / 60000 )}}分钟</template>
          </el-table-column>

          <el-table-column label="作业时间" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              {{scope.row.planStartTime | time('HH:mm:ss')}} ~ {{scope.row.planEndTime | time('HH:mm:ss')}}
            </template>
          </el-table-column>

        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="size"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
    <add ref="add"></add>
  </div>
</template>
<script>
  import myDirect from '@/components/direct';
  import {teamHttpUrl as httpUrl} from '../httpUrl';
  import {filterParams} from '@/utils/process';
  import add from './editMaintainLine';
  export default {
    components:{myDirect,add},
    data(){
      return {
        teamId:null,

        list:[],
        loading:false,
        total:1,
        size:10,
        currentPage:1,


        time:null,
        form:{
          startDate:null,
          endDate:null,
          name:null,
          //员工名称
          projectId:null,//项目id
          //班id
        },
        projectOption:[],
        searchTimer:null,
        selectLoading:false,
      }
    },
    methods:{
      save(){
        this.$router.push({
          name:'teamManage',
          params:{refresh:true}
        })
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.get();
      },
      find(){
        this.currentPage = 1;
        this.get();
      },
      get(){
        this.loading = true;
        this.$xttp.post(httpUrl.maintainPlanList,filterParams(Object.assign({
          page:this.currentPage,
          size:this.size,
          workTeamId:this.teamId,
        },this.form))).then(res=>{
          if(!res['errorCode']) {
            this.list = res.data['records'];
          }
          this.loading = false;
        }).catch(err=> this.loading = false);
      },
      projectSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchProject,{
            projectName:queryString,
            page:1,
            size:10,
          }).then(res => {
            if (!res['errorCode']) {
              this.projectOption = res['data'].records;
            }
            this.selectLoading = false;
          })
          this.selectLoading = false;
        }, 500);
      },
      handleRefresh(){
        console.log('handleRefresh');
        this.get();
      },
      openPage(name,type,row){
        this.$refs.add.$emit('show',{type:'add',id:this.teamId})
      }
    },
    mounted(){
      const op = this.$route.query;
      this.teamId = op.id;
      this.$store.commit('PUSHDIRECT', '保养路线');
//      this.handleRefresh();
      this.get();
    },
  }
</script>
<style lang="scss" scoped>
  .page-team-maintainPlan {
    width: 100%;
    min-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px;
    z-index: 500;
    background-color: #fff;
  }
  .c-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
