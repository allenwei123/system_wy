<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <my-direct></my-direct>
        <div class="c-search">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="type" placeholder="全部类型" clearable value="">
                <el-option v-for="item in noticeTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="dates"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" clearable>
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="query">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" size="small" class="c-addBtn" @click="onNoticeTypeClick">公告类型</el-button>
              <el-button type="primary" size="small" class="c-addBtn" @click="addNotice">新增公告</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="标题" min-width="180" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.title}}</template>
            </el-table-column>
            <el-table-column label="类型" min-width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getNoticeTypeName(scope.row.noticeTypeId)}}</template>
            </el-table-column>
            <el-table-column label="推送对象" width="80">
              <template slot-scope="scope">{{ scope.row.scope === 1 ? '全局' : '部分' }}</template>
            </el-table-column>
            <el-table-column label="推送成功" min-width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.successNum}}</template>
            </el-table-column>
            <el-table-column label="发布时间" min-width="150" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.createAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="更新时间" min-width="150" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.updateAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="操作" width="300" :fixed="tableData.length ? 'right' : '/'" align="left">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="preview(scope.row)">预览</el-button>
                <el-button type="primary" size="mini" @click="modify(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="c-pagination">
          <el-pagination
            layout="total, prev, pager, next, jumper" @current-change="getTableList"
            :total="total" :page-size="pageSize" :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </div>

      <!--公告类型对话框-->
      <el-dialog title="公告类型" :visible.sync="noticeTypeDialogVisible">
        <div style="overflow: hidden">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item style="float: right">
              <el-button type="primary" @click="onAddClick">新增</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-input v-model.trim="typeName" placeholder="请输入要增加的类型名称" style="width: 200px"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-table :data="noticeTypes" style="width: 100%" stripe>
            <el-table-column label="类型名称" min-width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="创建时间" min-width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.createAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="modifyType(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteType(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="noticeTypeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="noticeTypeDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <NoticeForm :detail="formDetail" :isModify="formIsModify" :visible.sync="formVisible" v-if="formVisible" @saveSuccess="query"></NoticeForm>
      <NoticePreview :visible.sync="previewVisible" v-if="previewVisible" :noticeInfo="previewNoticeInfo"></NoticePreview>
    </el-main>
  </el-container>
</template>

<script>
  import NoticeForm from './form';
  import NoticePreview from './preview';
  import myDirect from '@/components/direct';
  import refresh from '@/mixins/refresh';
  export default {
    name: 'notice',
    mixins: [refresh],
    components: {
      NoticeForm,
      NoticePreview,
      myDirect
    },
    data () {
      return {
        dates: '',
        type: '',
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        formVisible: false,
        formIsModify: false,
        formDetail: {},
        previewVisible: false,
        previewNoticeInfo: null,
        noticeTypeDialogVisible: false,
        q_type: '',
        typeName: '',
        noticeTypes: []
      }
    },
    methods: {
      showWarning(message) {
        this.$message({
          message: message,
          type: 'warning'
        });
      },
      onAddClick() {
        if (!this.typeName) {
          this.showWarning('请输入类型名称');
          return;
        }
        this.$xttp.post('pushAppMessage/addNoticeType', {
          name: this.typeName
        }).then(res => {
          if (res.errorCode === 0) {
            this.typeName = '';
            this.getNoticeTypes();
          }
        }).catch(() => {});
      },
      query() {
        // this
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList();
        }
      },
      // 获取公告类型名称
      getNoticeTypeName(typeId) {
        let type = this.noticeTypes.find(item => item.id === typeId);
        return type ? type.name : '';
      },
      // 删除
      del(item) {
        this.$confirm('确认删除公告？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$xttp.get(`pushAppMessage/${item.id}/delete/pushHistory`).then(res => {
            this.loading = false;
            if (res.errorCode === 0) {
              this.getTableList();
            }
          }).catch(() => {
            this.loading = false;
          })
        }).catch(() => {});
      },
      // 修改
      modify(item) {
        this.formIsModify = true;
        this.formDetail = item;
        this.formVisible = true;
      },
      addNotice() {
        this.formIsModify = false;
        this.formVisible = true;
      },
      preview(item) {
        this.previewNoticeInfo = item;
        this.previewVisible = true;
      },
      onNoticeTypeClick() {
        this.noticeTypeDialogVisible = true;
      },
      getTableList() {
        this.loading = true;
        let url = `pushAppMessage/getMessageHistoryList`;
        let params = {};
        params['page'] = this.currentPage;
        params['size'] = this.pageSize;
        if(this.type){
          params['noticeTypeId'] = this.type;
        }
        if(this.dates) {
          params['startTime'] = this.dates[0];
          params['endTime'] = this.dates[1];
        }
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      getNoticeTypes() {
        this.$xttp.post('pushAppMessage/getAllNoticeType').then(res => {
          if (res.errorCode === 0) {
            this.noticeTypes = res.data;
          }
        }).catch(() => {});
      },
      // 修改公告类型
      modifyType(item) {
        this.$prompt('请输入类型名称', '提示', {
          // confirmButtonText: '确定',
          // cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '类型名称不能为空',
          inputValue: item.name
        }).then(({ value }) => {
          this.$xttp.post('pushAppMessage/editNoticeType', {
            id: item.id,
            name: value
          }).then((res) => {
            if (res.errorCode === 0) {
              this.getNoticeTypes();
            }
          });
        }).catch(() => { });
      },
      // 删除公告类型
      deleteType(item) {
        this.$confirm('确认删除此公告类型吗？', '提示', {
          type: 'warning'
        }).then(() => {
          let url = `pushAppMessage/${item.id}/deleteNoticeType`;
          this.$xttp.get(url).then(res => {
            if (res.errorCode === 0) {
              this.getNoticeTypes();
            }
          }).catch(() => {

          })
        });
      }
    },
    created() {
      this.query();
      this.getNoticeTypes();
    }
  }
</script>

<style scoped lang="scss">
  .c-navDetail {
    margin-bottom: 10px;
    li {
      float: left;
      margin-right: 10px;
    }
  }

  .c-body {
    width: 90%;
    &.c-maxWidth {
      max-width: calc(100vw - 200px);
    }
  }

  .c-search {
    position: relative;
    width: 100%;
    overflow: hidden;
    .c-addBtn {
      /*position: absolute;*/
      /*right: 0px;*/
      /*top: 0px;*/
    }
  }

</style>
