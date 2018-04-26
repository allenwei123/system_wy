<template>
  <div>
    <div class="page-kind">
        <myDirect></myDirect>
        <div class="list-wrap">
          <div class="c-search">
            <el-form :inline="true" class="demo-form-inline">

              <el-input class="s-input" v-model.trim="input" placeholder="分类名称"></el-input>
              <el-form-item>
                <el-button type="primary" @click="find" size="small"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
              </el-form-item>
              
              <el-form-item style="float: right">
                <el-button type="primary" class="c-addBtn" @click="add">新增</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 表格开始 -->
          <el-table :data="tableData" style="width: 100%" v-loading="loading">

            <el-table-column label="分类名称" :show-overflow-tooltip="true" width="130" align="center">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>

            <el-table-column label="所属部位" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ getSite(scope.row.site) }}</template>
            </el-table-column>

            <el-table-column label="操作" width="240" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button @click="modify(scope.row)" type="primary" size="small">编辑</el-button>
                <el-button  type="primary" size="small" @click="remove(scope.row)">删除</el-button>
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
    </div>
    <!-- 新增&&编辑提示框 -->
    <transition name="fade">
      <Add :msg="see" v-if="see" :isModify="formIsModify" :detail="formDetail" @addClose="addClose" @saveSuccess="find"></Add>
    </transition>
  </div>
</template>
<script>
import myDirect from "@/components/direct";
import { unitHttpUrl } from "@/page/home/warehousemangement/warehouseHttp";
import { filterParams } from "@/utils/process";
import Add from "./accessAdd";
export default {
  components: { myDirect, Add},
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 0,
      loading: false, //列表加载loading
      input: null,
      size: 10,
      //配件部位
      siteOptions: [
        {
          value: "1",
          label: "机房"
        },
        {
          value: "2",
          label: "井道"
        },
        {
          value: "3",
          label: "轿厢"
        },
        {
          value: "4",
          label: "轿厢顶"
        },
        {
          value: "5",
          label: "门厅"
        },
        {
          value: "6",
          label: "底坑"
        },
        {
          value: "7",
          label: "其他"
        }
      ],
      siteName: "",
      see: false, //弹窗开关
      formIsModify: false,
      formDetail: {},
    };
  },

  methods: {
    //新增分类
    add() {
      this.see = true;
    },
    addClose() {
      this.see = false;
      this.formIsModify = false;
    },

    //修改弹窗
    modify(item) {
      this.formIsModify = true;
      this.formDetail = item;
      this.see = true;

    },

    // 所属部位 1, \"机房\" 2,\"井道\" 3, \"轿厢\" 4, \"轿厢顶\" 5, \"门厅\" 6, \"底坑\" 7, \"其他\"
    getSite(status) {
      let names = {
        "1": "机房",
        "2": "井道",
        "3": "轿厢",
        "4": "轿厢顶",
        "5": "门厅",
        "6": "底坑",
        "7": "其他"
      };
      return names[status];
    },

    find() {
      this.currentPage = 1;
      this.getListData();
    },

    remove(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$xttp
            .get(unitHttpUrl.kindDelete + row.id + "/delete")
            .then(res => {
              if (res.errorCode == 0) {
                this.$message("删除成功！");
                // this.getListData();
                this.getListData();
              } else {
                this.$message(res.errorMsg);
              }
            });
        })
        .catch(() => {});
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getListData();
    },
    getListData() {
      this.loading = true;
      this.$xttp
        .post(
          unitHttpUrl.newKind,
          Object.assign(
            {
              page: this.currentPage,
              size: this.size,
              name: this.input
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
    }
  },
  mounted() {
    this.getListData();
    this.$store.commit("PUSHDIRECT", "配件分类");
  }
};
</script>
<style lang="scss" scoped>

// 切换动画
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s ease;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
    transform: rotateY(180deg);
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

.page-kind {
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;
  overflow: auto;
  background-color: #fff;
}

.el-input {
  width: 300px;
}

.s-input {
  width: 170px;
}
</style>
