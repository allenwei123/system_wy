<template>
  <el-container>
    <el-main>
      <div class="c-maintenance-container">
        <my-direct></my-direct>
        <div class="c-search">
          <div class="opt" v-if="$route.query.type === 'edit'">
            <el-button type="primary" size="small" @click="onAddClick">新增保养项</el-button>
          </div>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" align="center" :show-overflow-tooltip="true" >
              <template slot-scope="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="保养项" min-width="140" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.itemName}}</template>
            </el-table-column>
            <el-table-column label="基本要求" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <ul class="requests">
                  <li v-for="item in scope.row.itemValueSet">{{item.itemText}}</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="模块" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.moduleName}}</template>
            </el-table-column>
            <el-table-column v-if="$route.query.type === 'edit'" label="操作" width="300" :fixed="tableData.length ? 'right' : '/'" align="left">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editItem(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!--新增的对话框-->
      <el-dialog title="新增保养项" :visible.sync="dialogVisible">
        <el-row>
          <el-col><span><i class="el-icon-warning" style="color: orange"></i> 注意，新增模板会替换原本的通用模板</span></el-col>
        </el-row>
        <el-form style="margin-top: 15px" label-width="140px">
          <el-form-item label="保养项名称：" required>
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="基本要求：" required>
            <el-input v-model.trim="form.require"></el-input>
          </el-form-item>
          <el-form-item label="模块：" required>
            <el-select v-model="form.module" value="">
              <el-option value="机房" label="机房"></el-option>
              <el-option value="井道" label="井道"></el-option>
              <el-option value="轿顶" label="轿顶"></el-option>
              <el-option value="轿厢" label="轿厢"></el-option>
              <el-option value="层站" label="层站"></el-option>
              <el-option value="底坑" label="底坑"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onApplyClick">确 定</el-button>
        </span>
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
        dialogVisible: false,
        formType: 'create', // || modify
        editingItem: null, // 要编辑的项
        form: {
          name: '',
          require: '',
          module: ''
        }
      }
    },
    methods: {
      query() {
        this.getTableList(1);
      },
      getTableList() {
        this.loading = true;
        let templateId = this.$route.query.templateId;
        let url = `maintenanceTemplate/${templateId}/detail`;
        this.$xttp.get(url).then((res) => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = res.data.checkItems;
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      showWarning(message) {
        this.$message({
          message: message,
          type: 'warning'
        });
      },
      onAddClick() {
        this.formType = 'create';
        this.form.name = '';
        this.form.require = '';
        this.form.module = '';
        this.dialogVisible = true;
      },
      onApplyClick() {
        if (!this.form.name) {
          this.showWarning('请输入保养项名称');
          return;
        }
        if (!this.form.require) {
          this.showWarning('请输入基本要求');
          return;
        }
        if (!this.form.module) {
          this.showWarning('请选择模块');
          return;
        }

        if (this.formType === 'create') {
          const loading = this.$loading();
          let params = [{
            itemName: this.form.name,
            itemSeq: 1,
            itemType: 3,
            itemValueSet: [{
              defaultValue: 0,
              itemText: this.form.require,
              seq: 1,
              valueType: 0
            }],
            moduleName: this.form.module,
            moduleSeq: 1,
            remark: null,
            templateId: this.$route.query.templateId
          }];
          this.$xttp.post('maintenanceTemplate/addItems', params).then(res => {
            loading.close();
            if (res.errorCode === 0) {
              this.dialogVisible = false;
              this.getTableList();
            }
          }).catch(() => {
            loading.close();
          });
        }
        else {
          const loading = this.$loading();
          let params = {
            itemName: this.form.name,
            itemSeq: 1,
            itemType: 3,
            itemValueSet: [{
              defaultValue: 0,
              itemText: this.form.require,
              seq: 1,
              valueType: 0
            }],
            moduleName: this.form.module,
            moduleSeq: 1,
            remark: null,
            templateId: this.$route.query.templateId
          };
          params['id'] = this.editingItem.id;
          this.$xttp.post('maintenanceTemplate/editItem', params).then(res => {
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
      editItem(item) {
        this.editingItem = item;
        this.form.name = item.itemName;
        this.form.require = item.itemValueSet[0].itemText;
        this.form.module = item.moduleName;
        this.formType = 'edit';
        this.dialogVisible = true;
      },
      deleteItem(item) {
        this.$confirm('确认删除该模板吗？', '提示', {
          type: 'warning'
        }).then(() => {
          let url = `maintenanceTemplate/${item.id}/deleteItem`;
          this.$xttp.get(url).then(res => {
            if (res.errorCode === 0) {
              this.getTableList();
            }
          }).catch(() => {});
        }).catch(() => {

        });
      },
    },
    created() {
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
