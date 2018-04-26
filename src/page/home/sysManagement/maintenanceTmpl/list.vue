<template>
  <el-container>
    <el-main>
      <div class="c-maintenance-container">
        <my-direct></my-direct>
        <div class="c-search">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-select v-model="province" clearable placeholder="请选择省份" @change="onProvinceChange">
                <el-option v-for="item in provinces" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="city" clearable placeholder="请选择城市">
                <el-option v-for="item in cities" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="level" clearable placeholder="保养等级">
                <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="type" clearable placeholder="驱动方式">
                <el-option v-for="item in driveModeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input placeholder="品牌" v-model.trim="brand"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input placeholder="梯种" v-model.trim="kind"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input placeholder="模板名称" v-model.trim="name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="addIsCopy = false; addDialogVisible = true">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="保养模板名" min-width="140" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.templateName}}</template>
            </el-table-column>
            <el-table-column label="地区" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.region}}</template>
            </el-table-column>
            <el-table-column label="保养等级" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getLevelName(scope.row.level)}}</template>
            </el-table-column>
            <el-table-column label="驱动方式" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getDriveModeName(scope.row.driveMode)}}</template>
            </el-table-column>
            <el-table-column label="电梯品牌" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.brandName}}</template>
            </el-table-column>
            <el-table-column label="电梯梯种" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.elevatorTypeName}}</template>
            </el-table-column>
            <el-table-column label="操作" width="300" :fixed="tableData.length ? 'right' : '/'" align="left">
              <template slot-scope="scope">
                <!--templateType 模板类型 1:标准模板 2：私有模板 -->
                <template v-if="scope.row.templateType === 1">
                  <el-button type="primary" size="mini" @click="viewTemplate(scope.row, 'view')">查看保养项</el-button>
                  <el-button type="primary" size="mini" @click="copyTemplate(scope.row)">复制</el-button>
                </template>
                <template v-else="scope.row.templateType !== 1">
                  <el-button type="primary" size="mini" @click="viewTemplate(scope.row, 'edit')">编辑保养项</el-button>
                  <el-button type="primary" size="mini" @click="copyTemplate(scope.row)">复制</el-button>
                  <el-button type="danger" size="mini" @click="deleteTemplate(scope.row)">删除</el-button>
                </template>
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

      <!--新增的对话框-->
      <el-dialog title="新增模板" :visible.sync="addDialogVisible">
        <el-row>
          <el-col><span><i class="el-icon-warning" style="color: orange"></i> 注意，新增模板会替换原本的通用模板</span></el-col>
        </el-row>
        <el-form style="margin-top: 15px" label-width="140px">
          <el-form-item label="模板名称：" required>
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="地区：" required>
            <el-select ref="province" placeholder="省份" v-model="form.province" value="" @change="form.city = ''">
              <el-option v-for="item in provinces" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
            <el-select ref="city" placeholder="城市" v-model="form.city" value="">
              <el-option v-for="item in dialogCities" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保养类型：" required>
            <el-select v-model="form.level" value="">
              <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="驱动方式：" required>
            <el-select v-model="form.driveMode" value="">
              <el-option v-for="item in driveModeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电梯品牌：" required>
            <el-select v-model="form.brand" value="" placeholder="品牌" @change="onBrandChange">
              <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="form.kind" value="" placeholder="梯种">
              <el-option v-for="item in kindList" :key="item.id" :label="item.elevatorTypeName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onAddClick">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  import myDirect from '@/components/direct';
  import refresh from '@/mixins/refresh';
  export default {
    mixins: [refresh],
    components: {myDirect},
    data() {
      return {
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        levels: [
          {id: 1, name: '半月维护保养'},
          {id: 2, name: '月维护保养'},
          {id: 3, name: '季度维护保养'},
          {id: 4, name: '半年维护保养'},
          {id: 5, name: '年度维护保养'}
        ],
        addressDatas: [],
        province: '',
        city: '',
        level: '',
        type: '',
        brand: '',
        kind: '',
        name: '',
        q_province: '',
        q_city: '',
        q_level: '',
        q_type: '',
        q_brand: '',
        q_kind: '',
        q_name: '',
        addDialogVisible: false,
        // 当前的添加是否为拷贝操作
        addIsCopy: false,
        form: {
          name: '',
          province: '',
          city: '',
          level: '',
          driveMode: '',
          brand: '',
          kind: ''
        },
        brandList: [],
        kindList: [],
        driveModeList: [
          { name: '曳引', value: 'traction' },
          { name: '液压', value: 'hydraulicPressure' }
        ],
        companyInfo: {},
        // 复制的模板
        copiedTemplate: {}
      }
    },
    computed: {
      provinces() {
        return this.addressDatas;
      },
      cities() {
        let p = this.provinces.find(item => item.code === this.province);
        return p ? p.children : [];
      },
      dialogCities() {
        let p = this.provinces.find(item => item.code === this.form.province);
        return p ? p.children : [];
      }
    },
    methods: {
      onProvinceChange() {
        this.city = '';
      },
      getLevelName(levelId) {
        let level = this.levels.find(item => item.id === levelId);
        return level ? level.name : '';
      },
      getDriveModeName(driveMode) {
        let dm = this.driveModeList.find(item => item.value === driveMode);
        return dm ? dm.name : '';
      },
      viewTemplate(template, type) {
        this.$router.push({
          path: '/maintenanceTmpl/items',
          query: {
            templateId: template.id,
            type
          }
        });
      },
      copyTemplate(template) {
        this.addIsCopy = true;
        this.copiedTemplate = template;
        this.addDialogVisible = true;
      },
      deleteTemplate(template) {
        this.$confirm('确认删除该模板吗？', '提示', {
          type: 'warning'
        }).then(() => {
          let url = `maintenanceTemplate/${template.id}/delete`;
          this.$xttp.get(url).then(res => {
            if (res.errorCode === 0) {
              this.getTableList();
            }
          }).catch(() => {});
        }).catch(() => {

        });
      },
      query() {
        this.q_province = this.province;
        this.q_city = this.city;
        this.q_level = this.level;
        this.q_type = this.type;
        this.q_brand = this.brand;
        this.q_kind = this.kind;
        this.q_name = this.name;

        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList(1);
        }
      },
      getTableList() {
        this.loading = true;
        let url = `maintenanceTemplate/list`;
        let params = {};
        params['page'] = this.currentPage;
        params['size'] = this.pageSize;
        if (this.q_city) {
          params['regionCode'] = this.q_city;
        }
        if (this.q_level) {
          params['level'] = this.q_level;
        }
        if (this.q_type !== '') {
          params['driveMode'] = this.q_type;
        }
        if (this.q_brand) {
          params['brandName'] = this.q_brand;
        }
        if (this.q_kind) {
          params['elevatorTypeName'] = this.q_kind;
        }
        if (this.q_name) {
          params['templateName'] = this.q_name;
        }
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
      getAddressList() {
        this.$xttp.post('deliveryAddress/state/list', {}).then(res => {
          if (res.errorCode === 0) {
            this.addressDatas = res.data;
          }
        }).catch(()=>{});
      },
      // 品牌
      getBrandList() {
        this.$xttp.post('brand/list', {
          page: 1,
          size: 999
        }).then(res => {
          if (res.errorCode === 0) {
            this.brandList = res.data.records;
          }
        }).catch(() => {});
      },
      onBrandChange() {
        this.kindList = [];
        this.form.kind = '';
        this.getKindList(this.form.brand);
      },
      // 梯种
      getKindList(brandId) {
        this.$xttp.post('elevatortype/list', {
          brandId,
          page: 1,
          size: 999
        }).then(res => {
          if (res.errorCode === 0) {
            this.kindList = res.data.records;
          }
        }).catch(() => {});
      },
      getCompanyInfo() {
        this.$xttp.get('company/myCompany').then(res => {
          this.companyInfo = res.data;
        }).catch(() => {});
      },
      showWarning(message) {
        this.$message({
          message: message,
          type: 'warning'
        });
      },
      resetForm() {
        for (let key in this.form) {
          this.form[key] = '';
        }
      },
      // 新增
      onAddClick() {
        if (!this.form.name) {
          this.showWarning('请输入模板名称');
          return;
        }
        if (!this.form.province) {
          this.showWarning('请选择省份');
          return;
        }
        if (!this.form.city) {
          this.showWarning('请选择城市');
          return;
        }
        if (!this.form.level) {
          this.showWarning('请选择保养类型');
          return;
        }
        if (!this.form.driveMode) {
          this.showWarning('请选择驱动方式');
          return;
        }
        if (!this.form.brand) {
          this.showWarning('请选择电梯品牌');
          return;
        }
        if (!this.form.kind) {
          this.showWarning('请选择梯种');
          return;
        }
        let params = {
          'templateName': this.form.name,
          'templateType': null,
          'brandId': this.form.brand,
          'companyId': this.companyInfo.id,
          'driveMode': this.form.driveMode,
          'editable': 1,
          'elevatorTypeId': this.form.kind,
          'equipType': 1,
          'interval': null,
          'level': this.form.level,
          'region': `${this.$refs.province.selectedLabel}${this.$refs.city.selectedLabel}`,
          'regionCode': this.form.city,
          'timeUnit': null
        };
        const loading = this.$loading();
        this.$xttp.post('maintenanceTemplate/add', params).then(res => {
          loading.close();
          if (res.errorCode === 0) {
            if (this.addIsCopy) {
              this.executeCopy(res.data.id);
            }
            else {
              this.addDialogVisible = false;
              this.getTableList();
              this.resetForm(this.form);
            }
          }
        }).catch(() => {
          loading.close();
        });
      },
      executeCopy(targetTemplateId) {
        let loading = this.$loading();
        // 先查询检查项列表，再执行新增
        let url = `maintenanceTemplate/${this.copiedTemplate.id}/detail`;
        this.$xttp.get(url).then((res) => {
          if (res.errorCode === 0) {
            let checkItems = res.data.checkItems;
            let paramObjects = [];
            for (let it of checkItems) {
              let param = {
                itemName: it.itemName,
                itemSeq: 1,
                itemType: 3,
                itemValueSet: [{
                  defaultValue: 0,
                  itemText: it.itemValueSet[0].itemText,
                  seq: 1,
                  valueType: 0
                }],
                moduleName: it.moduleName,
                moduleSeq: 1,
                remark: null,
                templateId: targetTemplateId
              };
              paramObjects.push(param);
            }
            if (paramObjects.length) {
              this.$xttp.post('maintenanceTemplate/addItems', paramObjects).then(res => {
                loading.close();
                if (res.errorCode === 0) {
                  this.addDialogVisible = false;
                  this.getTableList();
                  this.resetForm(this.form);
                }
              }).catch(() => {
                loading.close();
              });
            }
            else {
              loading.close();
              this.addDialogVisible = false;
              this.getTableList();
              this.resetForm(this.form);
            }
          }
        }).catch(() => {
          loading.close();
        });
      }
    },
    created() {
      this.getAddressList();
      this.getBrandList();
      this.getCompanyInfo();
      this.query();
    }
  }

</script>
