<template>
  <el-dialog :title="text" :visible.sync="formVisible">
    <el-form :model="form" label-width="140px">
      <el-form-item label="公告标题" required>
        <el-input v-model.trim="form.title"></el-input>
      </el-form-item>
      <el-form-item label="公告类型" required>
        <el-select v-model="form.type" placeholder="请选择公告类型" value="">
          <el-option v-for="item in noticeTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公告内容" required>
        <el-input type="textarea" v-model.trim="form.content" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="公告图片">
        <template>
          <el-upload
            ref="upload"
            action=""
            :auto-upload="false"
            :limit="1"
            accept="image/*"
            :on-exceed="onExceed"
            :file-list="fileList"
            :before-remove="beforeRemove"
            list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
        </template>
      </el-form-item>
      <el-form-item label="推送对象" required>
        <el-checkbox v-model="isGlobal">全局推送</el-checkbox>
        <div class="c-team-container">
          <!--v-model="checkedCities1"-->
          <el-checkbox-group v-model="checkedTeams">
            <el-checkbox v-for="item in teams" :label="item.id" :key="item.id" :disabled="isGlobal">{{item.teamName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeForm">取消</el-button>
      <!--<el-button type="primary" @click="preview">预览</el-button>-->
      <el-button type="primary" @click="save">保存</el-button>
      <!--<el-button type="primary" @click="publish">发布</el-button>-->
    </div>
  </el-dialog>
</template>

<script>
  import { send as ossUpload, getUri } from "@/utils/oss";
  export default {
    data() {
      return {
        formVisible: this.visible,
        communityList: [],
        file: null,
        form: {
          title: "",
          type: "",
          content: "",
          picUrl: ""
        },
        text: '新增公告',
        fileList: [],
        isGlobal: false,
        teams: [],
        checkedTeams: [],
        noticeTypes: []
      };
    },
    watch: {
      visible(val) {
        this.formVisible = val;
      },
      formVisible(val) {
        this.$emit("update:visible", val);
      }
    },
    methods: {
      showWarning(text) {
        this.$message({
          message: text,
          type: "warning"
        });
      },
      closeForm() {
        this.formVisible = false;
      },
      onExceed() {
        this.$message("只能上传一张图片");
      },
      save() {
        if (!this.form.title.length) {
          this.showWarning("请输入公告标题");
          return;
        }
        if (!this.form.type.length) {
          this.showWarning("请选择公告类型");
          return;
        }
        if (!this.form.content.length) {
          this.showWarning("请输入公告内容");
          return;
        }
        if (!this.isGlobal) {
          if (!this.checkedTeams.length) {
            this.showWarning("请选择推送对象");
            return;
          }
        }

        let files = this.$refs.upload.uploadFiles;
        if (files.length) {
          let file = files[0];
          // 如果还是原来的图片，没有重新选择
          if (file.status === 'success') {
            this.submitForm();
          }
          // 选择了新图，重新上传
          else {
            ossUpload(files[0].raw, key => {
              this.form.picUrl = key;
              this.submitForm();
            });
          }
        }
        else {
          this.submitForm();
        }

      },
      submitForm() {
        this.loading = true;
        let params = {};
        params["title"] = this.form.title;
        params["noticeTypeId"] = this.form.type;
        params["content"] = this.form.content;
        params["picUrl"] = this.form.picUrl;
        // 推送范围 scope  1-全局 2-部分
        // 标签类型 tagType 1-公司ID  2-班ID  3-组ID
        // 全局推送
        if (this.isGlobal) {
          params['scope'] = 1;
        }
        else {
          params['scope'] = 2;
          params['tagType'] = 2;
          // tags 指定推送的公司/班/组【相当于标签】 ,
          params['tags'] = this.checkedTeams;
        }
        let url = "pushAppMessage/addPushHistory";
        if (this.isModify) {
          url = "pushAppMessage/editPushHistory";
          params["id"] = this.detail.id;
        }
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.formVisible = false;
            this.$emit('saveSuccess');
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      getTeamList() {
        this.$xttp.post('workGroup/list', {
          page: 1,
          size: 999
        }).then(res => {
          if (res.errorCode === 0) {
            this.teams = res.data.records;
          }
        }).catch(() => {});
      },
      getNoticeTypes() {
        this.$xttp.post('pushAppMessage/getAllNoticeType').then(res => {
          if (res.errorCode === 0) {
            this.noticeTypes = res.data;
          }
        }).catch(() => {});
      },
      beforeRemove() {
        this.form.picUrl = '';
      }
    },
    props: ["visible", "detail", "isModify"],
    created() {
      this.getTeamList();
      this.getNoticeTypes();
      if (this.isModify) {
        this.text = "编辑公告";
        this.form.title = this.detail.title;
        this.form.type = this.detail.noticeTypeId;
        this.form.picUrl = this.detail.picUrl;
        this.form.content = this.detail.content;
        this.isGlobal = this.detail.scope === 1;
        this.checkedTeams = this.detail.tags;
        if (this.detail.picUrl) {
          getUri(this.detail.picUrl,(uri) => {
            this.fileList.push({url:uri});
          });
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .el-upload {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  .c-team-container {
    border: 1px solid #ccc;
    padding: 10px;

    .el-checkbox+.el-checkbox {
      margin-left: 0;
    }
    .el-checkbox {
      margin-right: 30px;
    }
  }
</style>
