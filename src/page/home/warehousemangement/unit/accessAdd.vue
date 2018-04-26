<template>
    <el-dialog :title="text" :visible.sync="msg" :before-close="handleClose">

        <el-form :model="form"  label-width="120px">

        <el-form-item label="分类名称" label-width="120px" required>
            <el-input v-model.trim="form.name"></el-input>
        </el-form-item>

        <el-form-item label="配件部位" required>
            <el-select v-model="form.siteName" filterable placeholder="全部分类" clearable>
                  <el-option
                  v-for="item in siteOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
        </el-form-item>

        <el-form-item label="描述">
            <el-input type="textarea" v-model.trim="form.remark" :rows="5"></el-input>
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
       name: '',
       siteName: '',
       remark: '',
      },
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
      text: '新增',
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
      if (!this.form.name.length) {
        this.showInfo("分类名称不能为空");
        return;
      }
      if (!this.form.siteName) {
        this.showInfo("配件部位不能为空");
        return;
      }
          this.submitForm();
    },
    
    submitForm() {
      this.loading = true;
      let params = {};
      params["name"] = this.form.name;
      params["site"] = this.form.siteName;
      if(this.form.remark){
          params["remark"] = this.form.remark;
      }
      let url = "unitType/add";
      if (this.isModify) {
        url = "unitType/edit";
        params["id"] = this.detail.id;
        params["site"] = this.detail.site;
      }
      console.log(params);
      this.$xttp.post(url, params).then(res => {
        this.loading = false;
        if (res.errorCode === 0) {
          this.handleClose();  
          this.$message.success(this.text + '成功');
          this.$emit('saveSuccess');
        }
      }).catch(() => {
        this.loading = false;
      });
    }
  },
  props: ['msg', 'detail', 'isModify'],
  created() {
    if (this.isModify) {
      this.text = "编辑";
      this.form.name = this.detail.name;
      this.form.siteName = this.detail.siteName;
      this.form.remark = this.detail.remark;
    }else {
        this.form = {
            name: '',
            siteName: '',
            remark: '',
        }
    }

  }
};
</script>

<style lang="scss" scoped>

</style>

