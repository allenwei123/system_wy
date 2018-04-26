<template>
  <div>
      <div class="page-add">
        <myDirect></myDirect>
        <div>
            <el-form :model="form" ref="form" label-width="120px" 
                :title="type === 'add' ? '新增' : type === 'edit' ? '编辑' : '' "> 
            
                <!--全部品牌  id暂时是电梯id 品牌id重复 -->
                <el-form-item label="品牌" label-width="120px" required>
                    <el-select v-if="disabled" v-model="form.brandId"  placeholder="全部品牌" clearable @change="changeElevator"> 
                        <el-option 
                        v-for="item in brandoptions"
                        :key="item.id"
                        :label="item.brandName"
                        :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-else v-model="form.brandId"  placeholder="全部品牌" clearable @change="changeElevator"> 
                        <el-option 
                        v-for="item in brandoptions"
                        :key="item.id"
                        :label="item.brandName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <!-- 全部梯种 -->
                <el-form-item label="梯种" label-width="120px" required>
                    <el-select v-if="disabled" v-model="form.elevatorTypeId" filterable placeholder="全部梯种" clearable>
                        <el-option
                        v-for="item in liftoptions"
                        :key="item.id"
                        :label="item.elevatorTypeName"
                        :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-else v-model="form.elevatorTypeId"  placeholder="梯种" clearable> 
                        <el-option 
                        v-for="item in liftoptions"
                        :key="item.id"
                        :label="item.elevatorTypeName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!-- 全部分类 -->
                <el-form-item label="分类" label-width="120px" required>
                    <el-select  v-if="disabled" v-model="form.unitTypeId" filterable placeholder="全部分类" clearable>
                        <el-option
                        v-for="item in unitOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-else v-model="form.unitTypeId"  placeholder="全部分类" clearable> 
                        <el-option 
                        v-for="item in unitOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="配件编码" label-width="120px" required>
                    <el-input v-if="disabled" v-model="form.unitNum"></el-input>
                    <el-input v-else v-model="form.unitNum" size="small"></el-input>
                </el-form-item>

                <el-form-item label="配件名称" label-width="120px" required>
                    <el-input v-if="disabled" v-model="form.name"></el-input>
                    <el-input v-else v-model="form.name" size="small"></el-input>
                </el-form-item>

                <el-form-item label="型号" label-width="120px" required>
                    <el-input v-if="disabled" v-model="form.unitModel"></el-input>
                    <el-input v-else v-model="form.unitModel" size="small"></el-input>
                </el-form-item>

                <el-form-item label="单价" label-width="120px" required>
                    <el-input v-if="disabled" v-model="form.price"></el-input>
                    <el-input v-else v-model="form.price" size="small"></el-input>
                </el-form-item>

                <el-form-item label="图片" required>
                    <el-upload
                      class="avatar-uploader"
                      action=""
                      :file-list="pictureList"
                      list-type="picture-card"
                      :http-request="httpRequest"
                      :on-remove="removeFile"
                    ><i class="el-icon-plus avatar-uploader-icon"></i></el-upload>
                </el-form-item>

                <el-form-item label="描述" label-width="120px">
                    <el-input type="textarea" :rows="5" v-model="form.remark" ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="save">保存</el-button>
                </el-form-item>
            
            </el-form>
        </div>
      </div>
  </div>
</template>

<script>
import { send as ossUpload, getUri } from "@/utils/oss";
import { unitHttpUrl } from "@/page/home/warehousemangement/warehouseHttp";
import { filterParams } from "@/utils/process";
import myDirect from "@/components/direct";
export default {
  components: { myDirect },
  data() {
    return {
      //选择列表品牌
      brandoptions: [],
      //梯种
      liftoptions: [],
      //分类
      unitOptions: [],
      show: false, //显示状态,
      type: null, //打开类型
      form: {
        //编辑表单 list传入
        brandId: "",
        elevatorTypeId: "", //梯种
        unitTypeId: "", //分类
        unitNum: "", //配件编码
        name: "", //配件名称
        unitModel: "", //型号
        price: "",
        images: [],
        remark:"",
        // name:'',
      },
      currentPage: 1, //获取电梯品牌种类
      size: 10, // 暂时拿10条 可配置
      pictureList: [], //照片列表
      uploadFile_pic: [], //图片上传数组
      title: ""
    };
  },
  computed: {
    disabled() {
      return this.type === "edit";
    },
    typeText() {
      //面包屑分级
      return this.type === "add"
        ? "新增配件"
        : this.type === "edit" ? "编辑配件" : "配件详情";
    }
  },
  methods: {
    httpRequest(file) { //图片上传数组
      this.uploadFile_pic.push(file.file);
    },

    removeFile(file) {
      let index = this.uploadFile_pic.findIndex(item => item.uid == file.uid);
      this.uploadFile_pic.splice(index, 1);
      if (this.type === "edit") {
        let index = this.pictureList.findIndex(item => item == file.key);
        this.pictureList.splice(index, 1);
      }
    },

    kinds() {
      //全部分类
      this.loading = true;
      this.$xttp.post(unitHttpUrl.kind, {}).then(res => {
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

    changeElevator() {
      //每次选择品牌时清空上次的梯种
      this.form.elevatorTypeId = '';
      this.elevatorList();
    },

    liftList() {
      //获取电梯列表
      this.loading = true;
      this.$xttp
        .post(
          unitHttpUrl.brandList,
          Object.assign({
            page: this.currentPage,
            size: this.size,
            brandId: this.form.brandId 
          })
        )
        .then(res => {
          
          if (res.errorCode == 0) {
            this.loading = false;
            console.log(res)
            // this.liftoptions = res.data.records; //梯种
            this.brandoptions = res.data.records; //品牌

            //去重相同品牌
            let hash = {};
            this.brandoptions = this.brandoptions.reduce(function(item, next) {
              hash[next.brandName]
                ? ""
                : (hash[next.brandName] = true && item.push(next));
              return item;
            }, []);
            // this.elevatorList();
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

    elevatorList() {
      //获取电梯列表
      this.loading = true;
      this.$xttp
        .post(
          unitHttpUrl.liftList,
          Object.assign({
            page: this.currentPage,
            size: this.size,
            brandId: this.form.brandId 
          })
        )
        .then(res => {
          // console.log(Object.assign({
          //   page: this.currentPage,
          //   size: this.size,
          //   brandId: this.form.brandId 
          // }));
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

    save() {
      this.$Validate({
        obj: this.form,
        rules: {
          brandId: {
            required: "请选择品牌"
          },
          elevatorTypeId: {
            required: "请选择梯种"
          },
          unitTypeId: {
            required: "请选择分类"
          },
          unitNum: {
            required: "请输入配件编码"
          },
          name: {
            required: "请输入配件名称"
          },
          unitModel: {
            required: "请输入型号"
          },
          price: {
            required: "请输入单价"
          }
        }
      })
        .then(() => {
          let arr = this.uploadFile_pic;
          // 上传图片数组和图片展示数组
          let length = arr.length + this.pictureList.length;
          // length是否有图片 没有提示上传 
          if (length) {
            //编辑时没有新的图片上传
            if (!this.uploadFile_pic.length && this.type === 'edit') {
              //删除时找到pictureList删除的照片
              this.form.images = this.pictureList.map(item => item.key);
              this[this.type]();
            } else {
              arr.forEach(item => {
                let flag = 0;
                ossUpload(item, key => {
                  flag++;
                  this.form.images.push(key);
                  //当新增的图片length = flag 此时发请求
                  if(flag == arr.length){
                    this[this.type]();
                  }
                });
              });
            }
          } else {
            this.$message.error("请上传图片");
          }
        })
        .catch(() => {
          console.warn("validate error");
        });
    },

    add() {
      this.loading = true;
      let params = this.form;
      this.$xttp
        .post(
          unitHttpUrl.add,
          Object.assign(params, { price: this.form.price })
        )
        .then(res => {
          if (!res["errorCode"]) {
            this.$message.success("新增成功");
            this.$router.push({
              //返回配件首页
              name: "unit",
              params: { refresh: true }
            });
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    edit() {
      this.loading = true;
      let params = this.form;
      this.$xttp
        .post(
          unitHttpUrl.edit,
          Object.assign(params, { price: this.form.price })
        )
        .then(res => {
          if (!res["errorCode"]) {
            this.$message.success("编辑成功");
            this.$router.push({
              //返回配件首页
              name: "unit",
              params: { refresh: true }
            });
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    const op = this.$route.query;
    this.type = op.type;
    if (this.type === "edit") {
      //编辑
      this.form = op.row; //list传来的row
      // console.log(op.row);
      console.log(op.row);
      this.liftoptions = [
      {
        elevatorTypeName:op.row.elevatorTypeName,
        id:op.row.elevatorTypeId
      }];
      
      this.form.price = Math.round(op.row.price);
      this.form.name = op.row.unitName;
      this.form.id = op.row.unitId; //部件的id  不是库存唯一id只有品牌可以
      this.form.images = op.row.images ? op.row.images : [];
      if (op.row.images.length > 0) {
        op.row.images.forEach(item => {
          if (!item) return;
          getUri(item, uri => {
            this.pictureList.push({ url: uri, key: item });
          });
        });
      }
    } else {
      this.form = {
        //新增
        brandId: "",
        elevatorTypeId: "", //梯种
        unitTypeId: "", //分类
        unitNum: "", //配件编码
        name: "", //配件名称
        unitModel: "", //型号
        price: "",
        images: [] //
      };
    }
    this.$store.commit("PUSHDIRECT", this.typeText);
    this.liftList(); //获取电梯种类
    this.kinds();
  }
};
</script>

<style lang="scss" scoped>
.el-upload {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.el-input {
  width: 200px;
}

.page-add {
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;
  overflow: auto;
  padding: 0 20px;
  background-color: #fff;
}
</style>

