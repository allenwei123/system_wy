<template>
   <div class="page-add">
      <myDirect></myDirect>
      <div class="list-wrap">
        <div class="c-search">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <!--全部品牌  -->
            <el-select v-model="form.brandId" filterable placeholder="全部品牌" clearable @change="changeStatus">
                <el-option
                  v-for="item in brandoptions"
                  :key="item.brandId"
                  :label="item.brandName"
                  :value="item.brandId">
                </el-option>
            </el-select>

            <!-- 全部梯种 -->
            <el-select v-model="form.elevatorTypeId" filterable placeholder="全部梯种" clearable @change="changeStatus">
                <el-option
                  v-for="item in liftoptions"
                  :key="item.id"
                  :label="item.elevatorTypeName"
                  :value="item.id">
                </el-option>
            </el-select>

            <!-- 全部分类 -->
            <el-select v-model="form.unitTypeId" filterable placeholder="全部分类" clearable @change="changeStatus">
                <el-option
                  v-for="item in unitOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
            </el-select>

            <el-input class="s-input" v-model="input" placeholder="配件名称/型号/编码"></el-input>
            <el-form-item>
              <el-button type="primary" @click="find" size="small"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 表格开始 -->
        <el-table :data="tableData" style="width: 100%" v-loading="loading">

          <el-table-column label="配件编码" :show-overflow-tooltip="true" width="130" align="center">
            <template slot-scope="scope">
                <!-- <router-link :to="{ path: 'unitDetail'}"> -->
                    <el-button type="text">
                        <u class="u-text">{{ scope.row.unitNum }}</u>
                    </el-button>
                <!-- </router-link> -->
            </template>
          </el-table-column>

          <el-table-column label="配件名称" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{ scope.row.unitName }}</template>
          </el-table-column>

          <el-table-column label="型号" :show-overflow-tooltip="true" align="center" width="100">
            <template slot-scope="scope">{{ scope.row.unitModel }}</template>
          </el-table-column>

          <el-table-column label="分类" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{ scope.row.unitTypeName }}</template>
          </el-table-column>

          <el-table-column label="品牌" :show-overflow-tooltip="true" align="center"  width="100">
            <template slot-scope="scope">{{ scope.row.brandName }}</template>
          </el-table-column>

          <el-table-column label="梯种" :show-overflow-tooltip="true" align="center"  width="143">
            <template slot-scope="scope">{{ scope.row.elevatorTypeName }}</template>
          </el-table-column>

          <el-table-column label="价格" :show-overflow-tooltip="true" align="center"  width="96">
            <template slot-scope="scope">{{ Math.round(scope.row.totalPrice) }}</template>
          </el-table-column>

          <el-table-column label="库存" :show-overflow-tooltip="true" align="center"  width="90">
            <template slot-scope="scope">
                <span v-if="scope.row.stock === 0">缺货</span>
                <span v-else>{{scope.row.stock}}</span>
            </template>
          </el-table-column>

          <el-table-column label="需要数量" width="240" fixed="right" align="center">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.stock" :min="0"></el-input-number>
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
      <el-button class="c-btn" @click="nextStep">下一步</el-button>
    </div>
</template>
<script>
import myDirect from "@/components/direct";
import { unitHttpUrl } from "@/page/home/warehousemangement/warehouseHttp";
import { filterParams } from '@/utils/process';
import refresh from '@/mixins/refresh';
export default {
  components: { myDirect },
  mixins:[refresh],
  data() {
    return {
      tableData: [],
      input: '',
      form: {
        brandId: "",
        elevatorTypeId: "",
        unitTypeId: "", //分类id
        stockStatus: "",
      },
      currentPage: 1,
      total: 0,
      loading: false, //列表加载loading
      //选择列表品牌
      brandoptions: [],
      //梯种
      liftoptions: [],
      //分类
      unitOptions: [],
      size: 10,
      num: '',
    };
  },
  methods: {
    nextStep() {
      this.$router.push({
        name: "orderConfirm",
        query: Object.assign({
              page: this.currentPage,
              size: this.size,
              otherText: this.input },
              this.form)
      });


    },
    changeStatus() {
        this.find();
        this.tableData = [];
    },


    find() {
      this.currentPage = 1;
      this.getListData();
    },

    edit(row) {},

    lifts() {
      //获取电梯列表
      this.loading = true;
      this.$xttp
        .post(
          unitHttpUrl.liftList,
          Object.assign({
            page: this.currentPage,
            size: this.size
          })
        )
        .then(res => {
          if (res.errorCode == 0) {
            this.loading = false;
            this.liftoptions = res.data.records; //梯种
            this.brandoptions = res.data.records; //品牌
            //去重相同品牌
            let hash = {};
            this.brandoptions = this.brandoptions.reduce(function(item, next) {
              hash[next.brandName]
                ? ""
                : (hash[next.brandName] = true && item.push(next));
              return item;
            }, []);
            //去除相同梯种
            // let has = {};
            // this.liftoptions = this.liftoptions.reduce(function(item, next) {
            //   has[next.elevatorTypeName]
            //     ? ""
            //     : (has[next.elevatorTypeName] = true && item.push(next));
            //   return item;
            // }, []);
          } else {
            this.$message(res.errorMsg);
          }
        });
    },

    kinds() { //全部分类
      this.loading = true;
      this.$xttp
        .post(
          unitHttpUrl.kind, {}
        )
        .then(res => {
          if (res.errorCode == 0) {
            this.loading = false;
            this.unitOptions = res["data"];
            console.log(this.unitOptions);
            // this.total = res["data"].total;
          } else {
            this.$message(res.errorMsg);
          }
        });
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getListData();
    },
    getListData() {
      this.loading = true;
      this.$xttp
        .post(
          unitHttpUrl.list,
          Object.assign(
            {
              page: this.currentPage,
              size: this.size,
              otherText: this.input
            },
            filterParams(this.form)
          )
        )
        .then(res => {
          if (res.errorCode == 0) {
            this.loading = false;
            this.tableData = res["data"].records;
            this.total = res["data"].total;
          } else {
            this.$message(res.errorMsg);
          }
        });
    },
    handleRefresh(){
        this.getListData();
    }
  },
  created() {
    this.getListData();
    this.lifts();
    this.handleRefresh();
    this.kinds();
    this.$store.commit("PUSHDIRECT", '选择配件');
  }
};
</script>
<style lang="scss" scoped>
.c-body {
  width: 90%;
  &.c-maxWidth {
    max-width: calc(100vw - 200px);
  }
}
.c-search {
  position: relative;
  width: 100%;
  .c-addBtn {
    position: absolute;
    right: 0px;
    top: 0px;
  }
  .c-kind {
    position: absolute;
    right: 100px;
    top: 0px;
  }
}

.page-add {
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;
  overflow: auto;
  background-color: #fff;
}

.c-btn {
    margin-left: 550px;
    background: #ccc;
}

.el-input {
  width: 300px;
}

.s-input {
  width: 170px;
}

.u-text:hover {
    cursor: pointer;
    color: blue;
}

</style>
