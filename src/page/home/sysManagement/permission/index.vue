<template>
  <el-container>
    <el-main>
      <div class="c-maintenance-container">
        <my-direct></my-direct>
        <div class="c-search">
          <div class="opt">
            <el-button type="primary" size="small" @click="onAddClick">新增岗位</el-button>
          </div>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="岗位名称" min-width="150" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="描述" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.remark}}</template>
            </el-table-column>
            <el-table-column label="操作" width="300" :fixed="tableData.length ? 'right' : '/'" align="left">
              <template slot-scope="scope">
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

      <!--新增岗位对话框-->
      <el-dialog title="新增" :visible.sync="dialogVisible">
        <el-form label-width="140px">
          <el-form-item label="岗位名称：" required>
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input v-model.trim="form.remark"></el-input>
          </el-form-item>
          <el-form-item label="授权模块：">
            <el-button type="text" @click="onSelectAll">全选</el-button>
            <el-button type="text" @click="onClearAll">清空</el-button>
          </el-form-item>
          <el-form-item v-for="menu1 in menus" :label="menu1.name" class="menu" :key="menu1.id">
            <el-button v-for="menu2 in menu1.resources" :key="menu2.id" size="small" :type="menu2 === selectedMenu2 ? 'primary' : ''" @click="onMenu2Click(menu2)">{{menu2.name}} {{getMenu2PermissionCount(menu2)}}</el-button>
          </el-form-item>
          <el-form-item label="操作权限：" v-if="selectedMenu2">
            <el-button type="text" @click="onMenu3SelectAll">全选</el-button>
            <el-button type="text" @click="onMenu3ClearAll">清空</el-button>
          </el-form-item>
          <el-form-item label="" v-if="selectedMenu2">
            <el-button v-for="menu3 in (selectedMenu2 ? selectedMenu2.resources : [])" :key="menu3.id" size="small" :type="form.resourceIds.includes(menu3.id) ? 'primary' : ''" @click="onMenu3Click(menu3)">{{menu3.name}}</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onApplyClick">确认</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  import myDirect from '@/components/direct';
  import refresh from '@/mixins/refresh';
  export default {
    name: 'MaintenanceTmplItems',
    mixins: [refresh],
    components: {myDirect},
    data() {
      return {
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        // 是否是编辑
        dialogIsEdit: false,
        editingItem: null,
        dialogVisible: false,
        menus: [],
        selectedMenu2: null,
        form: {
          name: '',
          remark: '',
          resourceIds: []
        }
      }
    },
    computed: {

    },
    methods: {
      query() {
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList(1);
        }
      },
      getTableList: function () {
        this.loading = true;
        let url = `position/list`;
        let params = {};
        params['page'] = this.currentPage;
        params['size'] = this.pageSize;
        this.$xttp.post(url, params).then((res) => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      getEnablingResource() {
        this.$xttp.get('resource/getEnablingResource').then(res => {
          if (res.errorCode === 0) {
            this.menus = res.data;
          }
        }).catch(() => {

        });
      },
      // 获取二级菜单有权限的数量
      getMenu2PermissionCount(menu2) {
        let set1 = new Set(menu2.resources.map(r => r.id));
        let set2 = new Set(this.form.resourceIds);
        // 交集
        let intersect = [...new Set([...set1].filter(x => set2.has(x)))];
        return intersect.length;
      },
      onMenu2Click(menu2) {
        this.selectedMenu2 = menu2;
      },
      onMenu3Click(menu3) {
        let index = this.form.resourceIds.indexOf(menu3.id);
        if (index >= 0) {
          this.form.resourceIds.splice(index, 1);
        }
        else {
          this.form.resourceIds.push(menu3.id);
        }
      },
      // 模块全选
      onSelectAll() {
        let tempArray = [];
        for (let menu1 of this.menus) {
          for (let menu2 of menu1.resources) {
            for (let menu3 of menu2.resources) {
              tempArray.push(menu3.id);
            }
          }
        }
        this.form.resourceIds = tempArray;
      },
      // 模块清空
      onClearAll() {
        this.form.resourceIds = [];
      },
      // 三级菜单全选
      onMenu3SelectAll() {
        let resourceIds = this.form.resourceIds.slice();
        for (let m3 of this.selectedMenu2.resources) {
          if (!resourceIds.includes(m3.id)) {
            resourceIds.push(m3.id);
          }
        }
        this.form.resourceIds = resourceIds;
      },
      // 三级菜单清空
      onMenu3ClearAll() {
        let resourceIds = this.form.resourceIds.slice();
        for (let m3 of this.selectedMenu2.resources) {
          let index = resourceIds.indexOf(m3.id);
          if (index >= 0) {
            resourceIds.splice(index, 1);
          }
        }
        this.form.resourceIds = resourceIds;
      },
      showWarning(text) {
        this.$message({
          message: text,
          type: "warning"
        });
      },
      onAddClick() {
        this.form.name = '';
        this.form.remark = '';
        this.form.resourceIds = [];
        this.dialogIsEdit = false;
        this.dialogVisible = true;
        this.selectedMenu2 = null;
        // 新增角色默认全选所有权限
        this.onSelectAll();
      },
      onApplyClick() {
        if (!this.form.name) {
          this.showWarning('请输入岗位名称');
          return;
        }
        let params = {
          'name' : this.form.name,
          'remark': this.form.remark,
          'resourceIds': this.form.resourceIds
        };
        // 新增
        if (this.dialogIsEdit === false) {
          const loading = this.$loading();
          this.$xttp.post('position/add', params).then(res => {
            loading.close();
            if (res.errorCode === 0) {
              this.dialogVisible = false;
              this.getTableList();
            }
          }).catch(() => {
            loading.close();
          });
        }
        // 修改
        else {
          params['id'] = this.editingItem.id;
          const loading = this.$loading();
          this.$xttp.post('position/edit', params).then(res => {
            loading.close();
            if (res.errorCode === 0) {
              this.dialogVisible = false;
              this.getTableList();
            }
          }).catch(() => {
            loading.close();
          });
        }
      },
      del(it) {
        this.$confirm('确认删除此岗位吗？', '提示', {
          type: 'warning'
        }).then(() => {
          let url = `position/${it.id}/delete`;
          this.$xttp.get(url).then(res => {
            if (res.errorCode === 0) {
              this.getTableList();
            }
          }).catch(() => {

          })
        });
      },
      modify(item) {
        const loading = this.$loading();
        this.$xttp.get(`position/${item.id}/detail`).then(res => {
          loading.close();
          if (res.errorCode === 0) {
            this.dialogIsEdit = true;
            this.editingItem = item;
            this.form.name = res.data.name;
            this.form.remark = res.data.remark;
            this.form.resourceIds = res.data.resourceIds;
            this.dialogVisible = true;
            this.selectedMenu2 = null;
          }
        }).catch(() => {
          loading.close();
        });
      },
    },
    created() {
      this.getEnablingResource();
      this.query();
    }
  }
</script>

<style scoped lang="scss">
  .c-search {
    overflow: hidden;
    margin-bottom: 10px;
    .opt {
      float: right;
    }
  }

</style>

<style lang="css" scoped>
  .menu >>> .el-form-item__label {
    color: #999;
  }
</style>
