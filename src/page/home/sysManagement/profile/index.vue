<template>
  <el-container>
    <el-main>
      <div class="c-profile-container">
        <my-direct></my-direct>
        <div class="title">基本信息</div>
        <div class="form">
          <el-form class="demo-form-inline" label-width="180px">
            <el-form-item label="账号：">
              <span>{{form.mobile}}</span>
            </el-form-item>
            <el-form-item label="用户名称：">
              <el-button type="text" @click="onNameClick">{{form.realName}}</el-button>
            </el-form-item>
            <el-form-item label="角色：">
              <span>管理员</span>
            </el-form-item>
            <el-form-item label="登录IP：">
              <span>{{form.ip}}</span>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{form.createTime | time('yyyy-MM-dd HH:mm:ss')}}</span>
            </el-form-item>
            <el-form-item label="上次登录时间：">
              <span>{{form.lastLoginAt | time('yyyy-MM-dd HH:mm:ss')}}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import myDirect from '@/components/direct';
  import refresh from '@/mixins/refresh';

  export default {
    components: { myDirect },
    mixins: [refresh],
    data() {
      return {
        form: { }
      }
    },
    methods: {
      getProfileInfo () {
        this.$xttp.get('user/currentSessionUserInfo').then(res => {
          if (res.errorCode === 0) {
            this.form = res.data;
          }
        }).catch();
      },
      onNameClick() {
        this.$prompt('请输入用户名', '提示', {
          // confirmButtonText: '确定',
          // cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '用户名不能为空',
          inputValue: this.form.realName
        }).then(({ value }) => {
          this.$xttp.post('employee/edit', {
            id: this.form.employeeId,
            userId: this.form.id,
            userName: value
          }).then((res) => {
            if (res.errorCode === 0) {
              this.getProfileInfo();
            }
          });
        }).catch(() => { });
      }
    },
    created() {
      this.getProfileInfo();
    }
  }
</script>
