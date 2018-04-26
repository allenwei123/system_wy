<template>
  <!--新增保养路线-->
  <el-dialog
    :title="type === 'add' ? '新增' : '编辑'"
    :visible.sync="show"
    width="1300px">
    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center" width="130">
        <template slot-scope="scope">{{scope.row.houseName}}</template>
      </el-table-column>
      <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center" width="130">
        <template slot-scope="scope">{{scope.row.buildName }}</template>
      </el-table-column>

      <el-table-column label="电梯名称" :show-overflow-tooltip="true" align="center" width="130">
        <template slot-scope="scope">{{scope.row.elevatorNum}}</template>
      </el-table-column>

      <el-table-column label="预计工时（分）" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{scope.row.time | minutesDiff}}

        </template>
      </el-table-column>

      <el-table-column label="日期" :show-overflow-tooltip="true" align="center" width="250">
        <template slot-scope="scope">
          <el-date-picker
            v-model="list[scope.$index].date"
            size="small"
            type="date"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-table-column>

      <el-table-column label="作业时间" :show-overflow-tooltip="true" align="center" width="380">
        <template slot-scope="scope">
          <el-time-picker
            is-range
            v-model="list[scope.$index].time"
            size="small"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </template>
      </el-table-column>

      <el-table-column label="维保组" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <el-select v-model="list[scope.$index].groupId" placeholder="请选择">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.groupName"
              :value="item.id">
            </el-option>
          </el-select>
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
    <el-button v-if="this.list.length > 0" type="primary" size="small" @click="save">保存</el-button>
  </el-dialog>
</template>
<script>
  import {teamHttpUrl as httpUrl} from '../httpUrl';
  import {filterParams} from '@/utils/process';
  export default {
    data(){
      return {
        show: false,
        type: 'add',//add-添加 edit-编辑
        teamId: null,//班id
        list: [],
        oldList: [],
        form: {
          items: []
        },
        loading: false,
        total: 1,
        size: 10,
        currentPage: 1,
        groupList: [],
      }
    },
    methods: {
      handleCurrentChange(currentPage){
        this.validateList();
        this.currentPage = currentPage;
      },
      validateList(){
        //检验list oldList
        const change = [];
        list.map((val, index) => {
          for (let key of val) {

          }
        })
        if (change.length > 0) {
          this.$confirm('你编辑的数据未保存，是否保存？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            //进行保存操作
            this.save();
          });
        }
      },
      save(){
        let planStartTime, planEndTime, startTime, endTime;
        for (let i = 0, val; i < this.list.length; i++) {
          val = this.list[i];
          if (this.oldList[i].date !== val.date || this.oldList[i].groupId !== val.groupId || this.oldList[i].time !== val.time) {
            //进行校验
            if (!val.date) {
              this.$message.warning('请选择日期');
              return false;
            }
            if (!val.time || !val.time[0]) {
              this.$message.warning('请选择作业时间');
              return false;
            }
            if (!val.groupId) {
              this.$message.warning('请选择维保组');
              return false;
            }
            //合并辨别时间
            startTime = new Date(val.time[0]);
            endTime = new Date(val.time[1]);
            planStartTime = new Date(`${new Date(val.date).toLocaleDateString()} ${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`).getTime();
            planEndTime = new Date(`${new Date(val.date).toLocaleDateString()} ${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()}`).getTime();
            if (planStartTime <= new Date().getTime()) {
              this.$message.warning('日期不能早于现在时间');
              return false;
            }
            this.form.items.push(Object.assign(val, {
              planStartTime,
              planEndTime
            }))
          }
        }
        if (this.form.items.length === 0) {
          this.$message.warning('请输入对应的日期、维保组、作业时间');
          return false;
        }
        this.$xttp.post(httpUrl.addMaintenancePlan, this.form).then(res => {
          if (!res['errorCode']) {

          }
        })
      },
      get(){
        this.$xttp.post('/maintenancePlan/elevatorList', {
          workTeamId: this.teamId,
        }).then(res => {
          if (!res['errorCode']) {
            let list = [];
            res.data['records'].forEach(val => {
              list.push({
                date: null,
                time: null,
                groupId: null,
                elevatorId: val.id,
                houseName: val.houseName,
                buildName: val.buildName,
                elevatorNum: val.elevatorNum,
              })
            });
            this.list = JSON.parse(JSON.stringify(list));
            this.oldList = JSON.parse(JSON.stringify(list));
          }
        })
      },
      getGroup(){
        this.$xttp.get(`${httpUrl.detail}/${this.teamId}/detail`).then(res => {
          if (!res['errorCode']) {
            this.groupList = res.data.groupList;
          }
        })
      }
    },
    mounted(){
      this.$on('show', (op) => {
        this.show = true;
        this.type = op.type;
        this.teamId = op.id;
        this.getGroup();
        this.get();
      })
    }
  }
</script>
<style lang="scss" scoped>
</style>
