<template>
  <div>
    <div class="page-kind">
      <myDirect></myDirect>
      <el-form :inline="true" :model="form" class="demo-form" label-width="140px" required>
        <div class="tit">订单状态</div>
        <p class="status">{{getOrderStatusName(form.status)}}</p>
        <!-- 下单 -->
        <el-row v-if="form.status === 0">
          <el-col>
            <el-form-item label="客户" :inline="true" required>
              <p>{{form.propertyCompanyName}}</p>
            </el-form-item>

            <el-form-item label="联系人" :inline="true" required>
              <span>{{form.creatorName}}</span>&nbsp;&nbsp;<span>{{form.creatorPhone}}</span>
            </el-form-item>

            <el-form-item label="客户签名" :inline="true" required>
              <p>{{form.creatorName}}</p>
            </el-form-item>

            <el-form-item label="确认时间" :inline="true" required>
              <p>{{form.orderTime | time('yyyy-MM-dd HH:mm')}}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 已支付 -->
        <el-row v-if="form.status === 1">
          <el-col>
            <el-form-item label="审核人" :inline="true" required>
              <p>{{form.auditPerson}}</p>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="审核时间" :inline="true" required>
              <p>{{form.orderTime | time('yyyy-MM-dd HH:mm')}}</p>
            </el-form-item>
          </el-col>

        </el-row>

        <!-- 采购中 -->
        <el-row v-if="form.status === 8">
          <el-col>
            <el-form-item label="采购信息" :inline="true" required>
              <p>{{form.senderPerson}}</p>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="预计到货日期" :inline="true" required>
              <p>{{form.orderTime | time('yyyy-MM-dd HH:mm')}}</p>
            </el-form-item>
          </el-col>

        </el-row>

        <!-- 已发货 -->
        <el-row v-if="form.status === 2">
          <el-col>
            <el-form-item label="发货人" :inline="true" required>
              <p>{{form.senderPerson}}</p>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="发货时间" :inline="true" required>
              <p>{{form.orderTime | time('yyyy-MM-dd HH:mm')}}</p>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="物流公司" :inline="true" required>
              <p>{{form.shipperName}}</p>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="物流单" :inline="true" required>
              <p>{{form.logisticCode}}</p>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="物流跟踪" :inline="true" required>
              <p>{{form.shipperName}}</p>
            </el-form-item>
          </el-col>

        </el-row>


        <!-- 收货信息 -->
        <div class="tit">收货信息</div>

        <el-col>
          <el-form-item label="收货信息" :inline="true" required>
            <!-- .name .phone -->
            <p>{{form.receiverPerson['name']}}&nbsp;&nbsp;{{form.receiverPerson['phone']}}&nbsp;&nbsp;{{form.receiverProvince}}
                {{form.receiverCity}}{{form.receiverArea}}{{form.receiverAddress}}
              </p>
          </el-form-item>
        </el-col>

        <!-- 订单信息 -->
        <div class="tit">订单信息</div>
        <el-row>
          <el-col :span="10">
            <el-form-item label="订单编号" :inline="true" required>
              <p>{{form.orderNum}}</p>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="创建订单时间" :inline="true" required>
              <p>{{form.orderTime | time('yyyy-MM-dd HH:mm')}}</p>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="下单类型" :inline="true" required>
              <p>{{form.relatedIdType}}</p>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="下单人" :inline="true" required>
              <p>{{form.creatorName}}</p>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="关联维保单" :inline="true" required>
              <p>{{form.relatedNum}}</p>
            </el-form-item>
          </el-col>

          <!-- 已生效状态 新增客户等信息 -->
          <el-row v-if="form.status === 1 || form.status === 2  || form.status === 8">
            <el-col :span="10">
              <el-form-item label="客户" :inline="true" required>
                <p>{{form.propertyCompanyName}}</p>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="联系人" :inline="true" required>
                <p>{{form.creatorName}}</p>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="客户签名" :inline="true" required>
                <p>{{form.creatorName}}</p>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="确认时间" :inline="true" required>
                <p>{{form.orderTime | time('yyyy-MM-dd HH:mm')}}</p>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 已发货 新增审核人 审核时间等信息 -->
          <el-row v-if="form.status === 2  || form.status === 8">
            <el-col :span="10">
              <el-form-item label="审核人" :inline="true" required>
                <p>{{form.auditPerson}}</p>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="审核时间" :inline="true" required>
                <p>{{form.orderTime | time('yyyy-MM-dd HH:mm')}}</p>
              </el-form-item>
            </el-col>
          </el-row>

        </el-row>
      </el-form>

      <!-- 配件列表 -->
      <div class="tit ">配件列表</div>
      <el-row>
        <span class="total">汇总</span>
        <span class="total-price">总价格:</span><span>{{Math.round(this.form.totalPrice)}}元</span>
        <span class="total-num">总数:</span><span>{{this.form.totalNumber}}</span>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading" class="tit-table">
        <el-table-column label="配件编码" :show-overflow-tooltip="true" width="160" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="orderDetail(scope.row)"> -->
            <span class="u-text">{{ scope.row.unitNum }}</span>
            <!-- </el-button> -->
          </template>
        </el-table-column>

        <el-table-column label="配件名称" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.name}}</template>
        </el-table-column>

        <el-table-column label="型号" :show-overflow-tooltip="true" align="center" width="150">
          <template slot-scope="scope">{{ scope.row.unitModel }}</template>
        </el-table-column>

        <el-table-column label="分类" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.source }}</template>
        </el-table-column>

        <el-table-column label="品牌" :show-overflow-tooltip="true" align="center"  width="100">
          <template slot-scope="scope">{{ scope.row.brandName }}</template>
        </el-table-column>

        <el-table-column label="梯种" :show-overflow-tooltip="true" align="center"  width="143">
          <template slot-scope="scope">{{ scope.row.elevatorTypeName }}</template>
        </el-table-column>

          <el-table-column label="价格(元)" :show-overflow-tooltip="true" align="center"  width="96">
            <template slot-scope="scope">{{ Math.round(scope.row.price)}}</template>
          </el-table-column>

        <el-table-column label="需要数量" :show-overflow-tooltip="true" align="center"  width="90">
          <template slot-scope="scope">{{ scope.row.number }}</template>
        </el-table-column>

        <el-table-column label="库存数量" :show-overflow-tooltip="true" align="center"  width="90">
          <template slot-scope="scope">{{ scope.row.stock }}</template>
        </el-table-column>

        <!-- <el-table-row label="总数" :show-overflow-tooltip="true" align="center"  width="90">
          <template slot-scope="scope">{{getOrderStatusName( scope.row.status )}}</template>
        </el-table-row> -->
      </el-table>
      <el-button class="btn" @click="changeStatus" v-if="step ===1 && this.form.status === 0">{{btnText}}</el-button>
      <el-button class="btn" @click="sendGoods" v-if="step ===2 || this.form.status === 8">{{goods}}</el-button>
      <el-button class="btn" @click="back" v-else>返回</el-button>
    </div>
  </div>
</template>
<script>
import myDirect from "@/components/direct";
import { orderHttpUrl } from "@/page/home/warehousemangement/warehouseHttp";
import { filterParams } from '@/utils/process';
export default {
  components: { myDirect },
  data() {
    return {
      form: {
        receiverPerson: {
          name: '',
          phone: '',
        }
      },
      tableData: [],
      temp: [],
      loading: false,
      // show: true, //生效按钮
      btnText: '生效',
      goods: '发货',
      step: 1,
    };
  },

  methods: {

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

    changeStatus() { //改变订单状态
      this.form.status = 1;
      this.btnText = '发货';
      this.step = 2;
    },

    sendGoods() {
      this.form.status = 2;
      this.goods = '返回';
      this.step = 3;
    },

    back() {
      this.$router.push({
        name: "order",
        // query: Object.assign({ type }, row ? { row } : {})
      });
    },


    get() {
      // this.loading = true;
      this.$xttp
        .get(
          orderHttpUrl.detail + this.$route.query.id + '/detail',
        )
        .then(res => {
          if (res.errorCode == 0) {
            this.loading = false;
            this.form = res.data;
            // console.log(this.form);
            this.temp.push(res.data);
            this.temp.forEach(element => {
              this.tableData = element.items;
            // console.log(333,this.tableData);
            });
          } else {
            this.$message(res.errorMsg);
          }
        }).catch( () => {
          this.loading = false;
        });
    }
  },
  created() {
    this.$store.commit("PUSHDIRECT", "订单详情");
    this.get();
  }
};
</script>
<style lang="scss" scoped>
.page-kind {
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;
  overflow: auto;
  padding: 20px;
  background-color: #fff;
}


.tit {
  font-size: 16px;
}

.status {
  margin: 20px;
  font-size: 28px;
}

.tit-table {
  margin: 30px;
}

.btn {
  background: #999;
  color: #fff;
  cursor: pointer;
}

.total{
  margin-left: 30px;
  margin-top: 15px;
  font-size: 18px;
  display: inline-block;
}

.total-price, .total-num{
  @extend .total
}

</style>
