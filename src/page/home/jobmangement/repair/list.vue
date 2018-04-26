<template>
  <el-main>
    <my-direct></my-direct>
    <div class="page-list">
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item>
            <el-select
              v-model="projectIndex"
              filterable
              remote
              clearable
              size="small"
              default-first-option
              placeholder="全部项目"
              :remote-method="projectSearchAsync"
              @change="projectChange"
              :loading="selectLoading">
              <el-option
                v-for="(item,index) in projectOption"
                :key="index"
                :label="item.projectName"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
          <el-select
            v-model="form.buildName"
            filterable
            remote
            clearable
            size="small"
            default-first-option
            placeholder="楼栋"
            :remote-method="buildSearchAsync"
            :loading="selectLoading">
            <el-option
              v-for="item in buildOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.status" size="small" placeholder="全部状态">
              <el-option
                clearable
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="form.faultType" size="small" placeholder="全部召修原因">
              <el-option
                v-for="item in faultOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.declareNum" clearable size="small" placeholder="维修单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="find">查询</el-button>
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item>
            <el-date-picker
              v-model="time"
              size="small"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="c-process">
          <el-button type="primary" size="small">导出</el-button>
        </div>
      </div>
      <el-table :data="list" style="width: 100%" v-loading="loading":row-class-name="tableRowClassName">
        <el-table-column label="召修单号" :show-overflow-tooltip="true" width="230" align="center">
          <template slot-scope="scope">
            <span @click="openComponent('detail',scope.row)">{{scope.row.declareNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{scope.row.projectName}}</template>
        </el-table-column>

        <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.buildName }}</template>
        </el-table-column>

        <el-table-column label="电梯名称" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.elevatorName }}</template>
        </el-table-column>

        <el-table-column label="召修原因" :show-overflow-tooltip="true" align="center" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.faultType === 0">困人</span>
            <span v-if="scope.row.faultType === 1">单梯停梯</span>
            <span v-if="scope.row.faultType === 2">不能启动</span>
            <span v-if="scope.row.faultType === 3">普通维修</span>
          </template>
        </el-table-column>

        <el-table-column label="召修时间" :show-overflow-tooltip="true" align="center" width="200">
          <template slot-scope="scope">{{ scope.row.createTime | time('yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column>

        <el-table-column label="状态" :show-overflow-tooltip="true" align="center" width="250">
          <template slot-scope="scope">
            {{scope.row.status}}
          </template>
        </el-table-column>

        <el-table-column label="维保工" :show-overflow-tooltip="true" align="center" width="170">
          <template slot-scope="scope">{{scope.row.dealWithUserName }}</template>
        </el-table-column>

        <el-table-column label="物业签字" :show-overflow-tooltip="true" align="center" width="100">
          <template slot-scope="scope">{{scope.row.customerSign}}</template>
        </el-table-column>

        <el-table-column label="已耗时(分)" :show-overflow-tooltip="true" align="center" width="150">
          <template slot-scope="scope">{{scope.row.consumeTime}}</template>
        </el-table-column>

        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="openComponent('dispatch',scope.row)">派工</el-button>
            <!--<el-button type="primary" size="small">停梯报告</el-button>-->
            <!--<el-button type="primary" size="small">维修报告</el-button>-->
            <el-button v-if="scope.row.dealWithUserName || scope.row.status !== '未处理'" type="primary" size="small" @click="openWorkTrack(scope.row)">工作轨迹</el-button>
            <!--<el-button type="primary" size="small">配件确认单</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="listPageChange"
        :current-page="currentPage"
        :page-size="size"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <detail ref="detail"></detail>
    <dispatch ref="dispatch" @onload="find"></dispatch>
    <el-dialog
      title="工作轨迹"
      width="700px"
      :visible.sync="workTrackDialog">
      <my-map ref="map" :disabled="true"></my-map>
    </el-dialog>
  </el-main>
</template>
<script>
  import {repairHttpUrl as httpUrl} from '../jobMangerUrl';
  import myDirect from '@/components/direct';
  import detail from './detail';
  import dispatch from './dispatch';
  import map from '@/components/map';
  import {filterParams} from '@/utils/process';
  export default {
    name: 'repairManage',
    components: {myDirect,detail,dispatch,'my-map':map},
    data(){
      return {
        list: [],
        time:null,
        statusOptions:[
          {
            label:'维修人员确认/已接收',
            value:1,
          },
          {
            label:'维修人员确认/已出发',
            value:2,
          },
          {
            label:'维修中',
            value:3,
          },
          {
            label:'暂停维修',
            value:4,
          },
          {
            label:'重启维修',
            value:5,
          },
          {
            label:'故障跟踪处理',
            value:6,
          },
          {
            label:'维修完毕待确认',
            value:7,
          },
          {
            label:'确认完工',
            value:8,
          },
          {
            label:'已恢复',
            value:9,
          },
          {
            label:'作废',
            value:10,
          },
        ],
        faultOptions:[
          {
            label:'困人',
            value:0,
          },
          {
            label:'单梯停梯',
            value:1,
          },
          {
            label:'不能启动',
            value:2,
          },
          {
            label:'普通维修',
            value:3,
          },
        ],
        projectIndex:null,//项目id
        form: {
          faultType: null,//召修原因
          houseName:null,//项目名称
          buildName:null,//楼栋名称
          declareNum :null,//维修单号
          status:null,//状态
          startTime:null,
          endTime:null,
        },
        currentPage: 1,//当前页码
        total: 1,//总数
        size: 10,//总页数
        loading: false,//列表加载loading

        searchTimer:null,
        projectOption:[],
        buildOption:[],
        selectLoading:false,
        consumeTimer:null,

        workTrackDialog:false,
      }
    },
    methods: {
      projectChange(val){
       this.form.houseName = val || val === 0 ? this.projectOption[val].projectName : null;
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
          });
          this.selectLoading = false;
          this.searchTimer = null;
        }, 500);
      },
      buildSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        if (!this.form.houseName) {
          this.$message.warning('请先选择项目');
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchBuild,{
            buildName:queryString,
            communityId:this.projectOption[this.projectIndex].communityId,
            page:1,
            size:10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.forEach(val => {
                this.buildOption.push({label:val.name,value:val.id,})
              });
            }
            this.selectLoading = false;
          });
          this.selectLoading = false;
          this.searchTimer = null;
        }, 500);
      },
      find(){
        if (this.time) {
          this.form.startTime = this.time[0];
          this.form.endTime = this.time[1];
        } else {
          this.form.startTime = null;
          this.form.endTime = null;
        }
        this.get();
      },
      get(){
        clearInterval(this.consumeTimer);
        this.consumeTimer = null;
        this.loading = true;
        this.$xttp.post(httpUrl.list,filterParams(Object.assign({
          page:this.currentPage,
          size:this.size,
        },this.form))).then(res=>{
          if(!res['errorCode']) {
            this.list = res.data['records'];
            this.list.map(val => this.$set(val,'consumeTime',parseInt( (new Date().getTime() - val.createTime) / 60000 )))
            this.total = res.data['total'];
            this.consumeTime();
          }
          this.loading = false;
        }).catch(err => this.loading = false);
      },
      listPageChange(currentPage){
        this.currentPage = currentPage;
        this.get()
      },
      consumeTime(){
        this.consumeTimer = setInterval(()=>{
          this.list.map(val => val.consumeTime = parseInt( (new Date().getTime() - val.createTime)/ 60000))
        },60000);
      },
      openComponent(name,row){
        this.$refs[name].$emit('show',{info:row})
      },
      tableRowClassName({row, rowIndex}){
        if (row.status === 0) {
          return 'warning-row';
        }
        return '';
      },
      openWorkTrack(row){
        //那row realAcceptUserId
        if(!row.realAcceptUserId){
          this.$message.warning('暂无无人接单');
          return false;
        }
        //获取userId的用户位置
        this.$xttp.post('/userLocation/list',filterParams({
          userId:row.realAcceptUserId,
          queryStartTime:row.createTime,
          queryEndTime:row.endRepairTime,
        })).then(res => {
            if(!res['errorCode']){
              if(res.data['records'].length > 0) {
                this['workTrackDialog'] = true;
                this.$nextTick(()=>{
                  this.$refs.map.$emit('mapInit',{
                    type:'track',
                    initAddress:res.data['records'].map(val => val.location)
                  })
                })
              } else {
                this.$message.info('暂无工作轨迹')
              }
            }
          })
      },
    },
    mounted(){
      this.get();
    },
    destroyed(){
      clearInterval(this.consumeTimer);
      this.consumeTimer = null;
    },
  }
</script>
<style lang="scss" scoped>
  .c-search {
    position: relative;
    width: 100%;
    .c-process {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .page-list {
    width: 100%;
    height: 100%;
  }
</style>
