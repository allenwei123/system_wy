<template>
  <el-main>
    <my-direct></my-direct>
    <div class="list-wrap">
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <!--全部下单类型  -->
          <el-select v-model="form.source" filterable placeholder="全部下单类型" @change="changeStatus" clearable>
            <el-option
              v-for="item in orderoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <!-- 全部状态 -->
          <el-select v-model="form.status" filterable placeholder="全部状态" @change="changeStatus" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <!-- 时间 -->
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" clearable @change="changeStatus">
          </el-date-picker>

          <el-input v-model.trim="input" placeholder="编号/下单人"></el-input>
          <el-form-item>
            <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
          </el-form-item>

          <!-- 暂时不做新增订单模块 -->
          <!-- <el-form-item style="float: right">
            <el-button type="primary" class="c-addBtn" @click="add('add')">新增订单</el-button>
          </el-form-item> -->
        </el-form>
      </div>

      <!-- 表格开始 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading">

        <el-table-column label="订单编号" :show-overflow-tooltip="true" width="160" align="center">
          <template slot-scope="scope">
            <p class="btn" @click="orderDetail(scope.row)">
              {{ scope.row.orderNum }}
              </p>
          </template>
        </el-table-column>

        <el-table-column label="配件内容" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ temp.name + 'X' + temp.number }}</template>
        </el-table-column>

        <el-table-column label="关联维保单" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="maintenance(scope.row)">
                <u class="u-text">{{ scope.row.relatedNum }}</u>
            </el-button> -->
            <p class="btn" @click="maintenance(scope.row)">
              {{ scope.row.relatedNum }}
              </p>
          </template>
        </el-table-column>

        <el-table-column label="下单类型" :show-overflow-tooltip="true" align="center" width="150">
          <template slot-scope="scope">{{ scope.row.source }}</template>
        </el-table-column>

        <el-table-column label="下单人" :show-overflow-tooltip="true" align="center"  width="100">
          <template slot-scope="scope">{{ scope.row.creatorName }}</template>
        </el-table-column>

        <el-table-column label="总价(元)" :show-overflow-tooltip="true" align="center"  width="143">
          <template slot-scope="scope">{{ Math.round(scope.row.totalPrice) }}</template>
        </el-table-column>

        <el-table-column label="下单时间" :show-overflow-tooltip="true" align="center"  width="150">
          <template slot-scope="scope">{{ scope.row.orderTime | time('yyyy-MM-dd HH:mm') }}</template>
        </el-table-column>

        <el-table-column label="订单状态" :show-overflow-tooltip="true" align="center"  width="90">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="orderDetail(scope.row)">
                <u class="u-text">{{getOrderStatusName( scope.row.status )}}</u>
            </el-button> -->
            <p class="btn" @click="orderDetail(scope.row)">
              {{getOrderStatusName( scope.row.status )}}
              </p>
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
      <transition name="fade">
        <adds ref="detailM" :show='addShow' @close='addClose'></adds>
      </transition>

  </el-main>
</template>
<script>
import myDirect from "@/components/direct";
import { orderHttpUrl } from "@/page/home/warehousemangement/warehouseHttp";
import { filterParams } from '@/utils/process';
import adds from './maintance';
export default {
  components: { myDirect, adds},
  data() {
    return {
      tableData: [],
      form: {
        name: "",
        phone: '',
        source: "",
        status: "", //状态
        startTime: "",
        endTime: ""
      },
      time: null,
      currentPage: 1,
      total: 0,
      loading: false, //列表加载loading
      //下单类型
      orderoptions: [
        {
          value: "6000",
          label: "移动维保端"
        },
        {
          value: "6002",
          label: "PC维保端"
        }
      ],
      //全部状态
      // 状态 0,"下单" 1,"已支付" 2,"已发货" 3,"已出库" 4,"已完成" 5,"已取消" 6,"申请退款" 7,"已退款" 8,"采购中" 9,"缺货" ,
      statusOptions: [
        {
          value: "0",
          label: "下单"
        },
        {
          value: "1",
          label: "已支付"
        },
        {
          value: "2",
          label: "已发货"
        },
        {
          value: "3",
          label: "已出库"
        },
        {
          value: "4",
          label: "已完成"
        },
        {
          value: "5",
          label: "已取消"
        },
        {
          value: "6",
          label: "申请退款"
        },
        {
          value: "7",
          label: "已退款"
        },
        {
          value: "8",
          label: "采购中"
        },
        {
          value: "9",
          label: "缺货"
        }
      ],
      input: '',
      size: 10,
      temp: '', //列表的配件内容
      addShow:0,//add显示隐藏
    };
  },
  methods: {
    add(type, row) {
      this.$router.push({
        name: "orderAdd",
        query: Object.assign({ type }, row ? { row } : {})
      });
    },

    orderDetail(row) { //根据订单编号查询订单详情
      this.$router.push({
        name: "orderDetail",
        query: Object.assign({}, row ? {'id': row.id } : {})
      });
    },

    maintenance(val) {
      this.addShow=1;
        this.$refs.detailM.id=val.relatedId;
    },

    addClose(){ //关闭维保单
        this.addShow=0;
    },

    // 订单状态
    getOrderStatusName(status) {
      let names = {
        "0": "下单",
        "1": "已支付",
        "2": "已发货",
        "3": "已出库",
        "4": "已完成",
        "5": "已取消",
        "6": "申请退款",
        "7": "已退款",
        "8": "采购中",
        "9": "缺货"
      };
      return names[status];
    },

    changeStatus() {
      this.find();
      this.tableData = [];
    },

    find() {
      this.currentPage = 1;
      if (this.time) {
          // console.log(this.time[1]);
          this.form.startTime = (this.time[0]).valueOf();
          this.form.endTime = (this.time[1]*1 + 86400000).valueOf();
      } else {
        this.form.startTime = null;
        this.form.endTime = null;
      }
      this.getListData();
    },

    edit(row) {},

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getListData();
    },
    getListData() {
      // this.loading = true;
      this.$xttp
        .post(
          orderHttpUrl.list,
          Object.assign(
            {
              page: this.currentPage,
              size: this.size,
              searchText: this.input,
            },
            filterParams(this.form)
          )
        )
        .then(res => {
          // console.log(Object.assign(
          //   {
          //     page: this.currentPage,
          //     size: this.size,
          //     searchText: this.input,
          //   },
          //   filterParams(this.form)
          // ));
          if (res.errorCode == 0) {
            this.loading = false;
            this.tableData = res["data"].records;
            this.tableData.forEach( ele => {
               ele.items.forEach( element => {
                 this.temp = element;
               })
            })
            this.total = res["data"].total;
          } else {
            this.$message(res.errorMsg);
          }
        });
    }
  },
  created() {
    this.getListData();
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
}

.list-wrap {
  width: 100%;
  height: 100%;
}

.btn {
  cursor: pointer;
  color: #409EFF;
  text-decoration: underline;
}
</style>
