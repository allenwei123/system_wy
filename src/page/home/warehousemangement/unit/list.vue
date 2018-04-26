<template>
  <el-main>
   <div class="con-wrap">
      <myDirect></myDirect>
      <div class="list-wrap">
        <div class="c-search">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <!--全部品牌  -->
            <el-select v-model="form.brandId" filterable placeholder="全部品牌" clearable @change="changeStatus">
                <el-option
                  v-for="item in brandoptions"
                  :key="item.id"
                  :label="item.brandName"
                  :value="item.id">
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

            <!--有货 -->
            <el-select v-model="form.stockStatus" filterable placeholder="所有" clearable @change="changeStatus">
                <el-option
                  v-for="item in goodsoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>

            <el-input class="s-input" v-model.trim="input" placeholder="配件名称/型号/编码"></el-input>
            <el-form-item>
              <el-button type="primary" @click="find" size="small"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
            <!-- <el-form-item style="float: right">
              <el-button type="primary" class="c-kind" @click="unitKind">配件分类</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" class="c-addBtn" @click="add('add')">新增</el-button>
            </el-form-item> -->
          </el-form>

          <div>
            <el-button type="primary" class="c-kind" @click="unitKind">配件分类</el-button>
            <el-button type="primary" class="c-addBtn" @click="add('add')">新增</el-button>
          </div>
        </div>
        <!-- 表格开始 -->
        <el-table :data="tableData" style="width: 100%" v-loading="loading">

          <el-table-column label="配件编码" :show-overflow-tooltip="true" width="130" align="center">
            <template slot-scope="scope">
              <!-- <el-button type="text"  @click="detail(scope.row)">
                  <u class="u-text">{{ scope.row.unitNum }}</u>
              </el-button> -->
              <p class="btn" @click="detail(scope.row)">
                {{ scope.row.unitNum }}
              </p>
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
            <template slot-scope="scope">{{ Math.round(scope.row.price) }}</template>
          </el-table-column>

          <el-table-column label="库存" :show-overflow-tooltip="true" align="center"  width="90">
            <template slot-scope="scope">
                <span class="active" v-if="scope.row.stock === 0">缺货</span>
                <span v-else-if="scope.row.stock < 10" class="active">{{scope.row.stock}}</span>
                <span v-else>{{scope.row.stock}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="240" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button @click="add('edit',scope.row)" type="primary" size="small">编辑</el-button>
              <el-button  type="primary" size="small" @click="putStore(scope.row)">入库</el-button>
              <!-- <el-button  type="primary" size="small" @click="purchase(scope.row)">采购</el-button> -->
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
      <router-view></router-view>
    </div>

    <!-- 入库 -->
    <transition name="fade">
      <PutStore :msg="see" v-if="see"  :detail="formPutStore" @addClose="putClose" @saveSuccess="handleCurrentChange"></PutStore>
    </transition>

    <!-- 采购 -->
    <transition name="fade1">
      <Purchase :msg="seePurchase" v-if="seePurchase"  :detail="fromPurchase" @addClose="purchaseClose" @saveSuccess="handleCurrentChange"></Purchase>
    </transition>
    
  </el-main>
</template>
<script>
import myDirect from "@/components/direct";
import { unitHttpUrl } from "@/page/home/warehousemangement/warehouseHttp";
import { filterParams } from '@/utils/process';
import refresh from '@/mixins/refresh';
import PutStore from './putStore'; //入库
import Purchase from './purchase'; //采购

export default {
  components: { myDirect, PutStore, Purchase},
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
        unitTypeId: '',
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
      //有货
      goodsoptions: [
        {
          value: "0",
          label: "所有"
        },
        {
          value: "1",
          label: "有货"
        },
        {
          value: "2",
          label: "低库存"
        },
        {
          value: "3",
          label: "缺货"
        }
      ],
      size: 10,
      see: false, //入库弹窗
      seePurchase: false, //采购弹窗
    };
  },
  methods: {
    /**
     * @description 新增
     * @param type add/edit
     * @param row 行数据
     */
    add(type, row) {
      this.$router.push({
        name: "unitAdd",
        query: Object.assign({ type }, row ? { row } : {})
      });
    },


    changeStatus() {
        this.find();
        this.tableData = [];
    },


    /**
     * @description 配件种类
     */
    unitKind() {
      this.$router.push({
        name: "accessories",
        // query: Object.assign({ type }, row ? { row } : {})
      });
    },

    detail(row) {
      // console.log(row);
        this.$router.push({
            name: "unitDetail",
            query: Object.assign({}, row ? {id: row.id} : {})
        });
    },

    find() {
      this.currentPage = 1;
      this.getListData();
    },

    edit(row) {},

    /**
     * @description 入库
     */
    putStore(row) {
      this.see = true;
      this.formPutStore = row;
    },

    putClose() {
      this.see = false;
    },


    /**
     * @description 采购
     */
    purchase(item) {
      this.seePurchase = true;
      this.fromPurchase = item;
    },

    purchaseClose() {
      this.seePurchase = false;
    },


    //获取电梯列表
    lifts() {
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
            // this.brandoptions = res.data.records; //品牌
            //去重相同品牌
            // let hash = {};
            // this.brandoptions = this.brandoptions.reduce(function(item, next) {
            //   hash[next.brandName]
            //     ? ""
            //     : (hash[next.brandName] = true && item.push(next));
            //   return item;
            // }, []);
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
            // console.log(this.unitOptions);
            // this.total = res["data"].total;
          } else {
            this.$message(res.errorMsg);
          }
        }); 
    },

    brandList() { //全部分类
      // this.loading = true;
      this.$xttp
        .post(
          unitHttpUrl.brandList, {}
        )
        .then(res => {
          if (res.errorCode == 0) {
            this.loading = false;
            this.brandoptions = res["data"].records;
            // console.log(this.unitOptions);
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
  mounted() {
    this.getListData();
    this.lifts();
    this.kinds();
    this.brandList();
  }
};
</script>
<style lang="scss" scoped>
  //表格中实现跳转
  .btn { 
    cursor: pointer;
    color: #409EFF;
    text-decoration: underline;
  }

// 切换动画
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s ease;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
    transform: rotateY(180deg);
  }
  .fade1-enter-active, .fade1-leave-active {
    transition: all 0.5s ease;
  }

  .fade1-enter, .fade1-leave-active {
    opacity: 0;
    transform: translateX(-500px);
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

.con-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  .list-wrap {
    width: 100%;
    height: 100%;
  }
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

.active {
  color: red;
}

</style>
