<template>
    <el-dialog :title="text" :visible.sync="msg" :before-close="handleClose">

        <el-form :model="form"  label-width="120px">

            <el-form-item label="入库物品" label-width="120px" required>
                <!-- <span>鑫诺 MRGL-P 外召板 KT04-BCC-L-B  外召板-蓝色</span> -->
                <span>{{`${form.brandName}${form.unitModel}${form.unitTypeName}`}}</span>
            </el-form-item>

            <el-form-item label="单价" label-width="120px">
                <el-input class="s-input" size="small"></el-input>元
            </el-form-item>

            <el-form-item label="采购数量" label-width="120px">
                <el-input-number v-model="unitPrice"  :min="1"></el-input-number>
            </el-form-item>

            <el-form-item label="金额" label-width="120px">
                <span>999元</span>
            </el-form-item>

            <el-form-item label="供货商" label-width="120px">
                <el-input size="small"></el-input>
            </el-form-item>

            <el-form-item label="联系人" label-width="120px">
                <el-input size="small"></el-input>
            </el-form-item>

            <el-form-item label="联系电话" label-width="120px">
                <el-input size="small"></el-input>
            </el-form-item>

            <el-form-item label="到货日期" label-width="120px">
                <el-date-picker
                  width="240px"
                  v-model="arrvialDate"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>

    </el-dialog>
</template>


<script>
export default {
  data() {
    return {
      form: {
       unitId: '',
      },
      stock: '',
      text: '新增',
      unitPrice: 1,
      arrvialDate: '', //到货时间
    };
  },
  
  methods: {
    showInfo(text) {
      this.$message({
        message: text,
        type: "warning"
      });
    },
    handleClose() {
      this.$emit("addClose");
    },
    save() {
    //   if (this.stock == 0  || this.stock === "") {
    //     this.showInfo("入库数量需大于0");
    //     return;
    //   }
    //       this.submitForm();
    },
    
    submitForm() {
    //   this.loading = true;
    //   let params = {};
    //   params["stock"] = this.stock;
    //   params["unitId"] = this.detail.unitId;
    //   let url = "stock/in";
    //   console.log(params);
    //   this.$xttp.post(url, params).then(res => {
    //     this.loading = false;
    //     if (res.errorCode === 0) {
    //       this.handleClose();  
    //       this.$message.success(this.text + '成功');
    //       this.$emit('saveSuccess');
    //     }
    //   }).catch(() => {
    //     this.loading = false;
    //   });
    }
  },
  props: ['msg', 'detail'],
  mounted() {
    //   console.log(this.detail);
    //   this.stock = this.detail.stock;
      this.form = this.detail;
  }
};
</script>

<style lang="scss" scoped>
.s-input {
  width: 170px;
}
</style>

