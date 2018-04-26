<template>
  <div class="page-confirm">
      <myDirect></myDirect>
      <p>配件列表</p>
      <div class="list-wrap">
        <div class="c-search" v-if="show">
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
            <template slot-scope="scope">{{ Math.round(scope.row.totalPrice)}}</template>
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
      <p>收货信息</p>
        <el-form :model="getform" ref="getform" label-width="120px" class="demo-form">

            <el-form-item label="收货人" required :inline="true">
              <el-select v-model="getform.userName">
                <el-option
                  v-for="item in nameList" 
                  :key='item.id'
                  :label="item.userName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="联系电话" required :inline="true">
                <el-input v-model="getform.phone" style="width:80%;" ></el-input>
            </el-form-item>

            <el-form-item label="收货地址" required :inline="true">
                <el-select v-model="getform.province" placeholder="请选择省" @change="addressChange()" clearable>
		                  <el-option
		                    v-for="(item,indexs) in addressData" 
		                    :key='indexs'
		                     :label="item.name"
		                    :value="item.name">
		                  </el-option>
		             </el-select>

		             <el-select v-model="getform.city" placeholder="请选择市" style="margin:0 5px;" @change="cityChange()" clearable>
		                  <el-option
		                    v-for="(item,indexs) in cityList" 
		                    :key='indexs'
		                     :label="item.name"
		                    :value="item.name">
		                  </el-option>
		             </el-select>

		             <el-select v-model="getform.area" placeholder="请选择区" clearable>
		                  <el-option
		                    v-for="(item,indexs) in areaList" 
		                    :key='indexs'
		                     :label="item"
		                    :value="item">
		                  </el-option>
		             </el-select>
            </el-form-item>

            <el-form-item label="详细地址" required :inline="true">
                <el-input v-model="getform.address" style="width:80%;" ></el-input>
            </el-form-item>

             <!-- 地圖 -->
        	  <div class="mapshow" >
        	  	<googMap ref="myMap" @click="mapClick" @complete="mapComplete"> </googMap>
        	  </div>
            
            <el-form-item  required :inline="true" class="btn">
              <el-button class="confirm-btn" @click="confirm">确认</el-button>
            </el-form-item>

        </el-form>
  </div>

</template>
<script>
import myDirect from "@/components/direct";
import { unitHttpUrl } from "@/page/home/warehousemangement/warehouseHttp";
import { orderHttpUrl } from "@/page/home/warehousemangement/warehouseHttp";
import { filterParams } from "@/utils/process";
import refresh from "@/mixins/refresh";
import addressDatas from "@/utils/addressData";
import { bulidMangerHttpUrl } from "@/page/home/basis/httpUrl";
import googMap from "@/components/map";
export default {
  components: { myDirect, googMap },
  mixins: [refresh],
  data() {
    return {
      tableData: [],
      input: "",
      form: {
        brandId: "",
        elevatorTypeId: "",
        unitTypeId: "", //分类id
        stockStatus: "",
        unitTypeId: ""
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
      num: "",
      show: false,
      //收货信息
      getform: {
        address: "",
        province: null, //(string): 省份 ,
        city: null, //(string): 城市 ,
        area: null, //(string): 区/县 ,
        userName: "",
        phone: ""
      },
      addressData: addressDatas, //省份
      cityList: [],
      areaList: [], //区
      initForm: {}, //初始化数据
      nameList: [],
    };
  },
  methods: {
    changeStatus() {
      this.find();
      this.tableData = [];
    },

    find() {
      this.currentPage = 1;
      this.getListData();
    },

    confirm() {
      //确定下单
      // this.loading = true;
      // this.$xttp.post(orderHttpUrl.add, {}).then(res => {
      //   if (res.errorCode == 0) {
      //     this.loading = false;
      //     this.unitOptions = res["data"];
      //     console.log(this.unitOptions);
      //     // this.total = res["data"].total;
      //   } else {
      //     this.$message(res.errorMsg);
      //   }
      // });
      this.$router.push({
        name: "order",
      //   query: Object.assign({ 
      //         page: this.currentPage,
      //         size: this.size,
      //         otherText: this.input }, 
      //         this.form)
      });
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

    kinds() {
      //全部分类
      this.loading = true;
      this.$xttp.post(unitHttpUrl.kind, {}).then(res => {
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
            filterParams(this.$route.query)
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
    handleRefresh() {
      this.getListData();
    },

    //收货信息
    //选择省份
    addressList() {
      //收货地址只能选
      this.loading = true;
      this.$xttp.post(orderHttpUrl.addressList, {}).then(res => {
        if (res.errorCode == 0) {
          this.loading = false;
          this.nameList = res["data"].records;
          console.log(33,this.nameList);
        } else {
          this.$message(res.errorMsg);
        }
      });
    },

    addressChange() {
      for (let x = 0; x < this.addressData.length; x++) {
        if (this.addressData[x].name == this.getform.province) {
          Object.assign({}, this.areaList);
          Object.assign({}, this.cityList);
          this.getform.city = "";
          this.getform.area = "";
          Object.assign(this.cityList, this.addressData[x].city);
        }
      }
    },
    //选择城市
    cityChange() {
      for (let x = 0; x < this.cityList.length; x++) {
        if (this.cityList[x].name == this.getform.city) {
          this.areaList = [];
          this.getform.area = "";
          Object.assign(this.areaList, this.cityList[x].area);
        }
      }
    },

    //地图事件
    mapClick(val) {
      this.getform.province = val.province; //省
      this.getform.city = val.city; //市
      this.getform.area = val.district; //区
      this.getform.address = val.formattedAddress; //详细地址
    },
    mapComplete(val) {
      console.log("Complete");
      this.getform.province = val.province; //省
      this.getform.city = val.city; //市
      this.getform.area = val.district; //区
      this.getform.address = val.formattedAddress; //详细地址
    }
  },

  mounted() {
    this.getListData();
    this.lifts();
    this.handleRefresh();
    this.kinds();
    this.$store.commit("PUSHDIRECT", "确认信息");
    //初始化地图
    this.$nextTick(() => {
      this.$refs.myMap.$emit("mapInit", {});
    });
    this.addressList();
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

.list-wrap {
  margin: 30px;
}

.page-confirm {
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

.mapshow {
  width: 80%;
  height: auto;
  margin: 0 auto;
}

.btn {
  margin-top: 30px;
}

.confirm-btn {
  background: #999;
  color: #fff;
}
</style>
