<template>
  <div class="c-header">
      <a href="" class="c-logo">电梯物联网平台</a>
      <ul class="c-navgator">
        <li>
          <span class="c-account">
            帮助&nbsp; | &nbsp;
            <el-popover
              ref="popover"
              placement="bottom"
              width="200"
              trigger="click">
              <el-row style="padding: 16px 0">
                <el-col>mobile : {{userInfo.mobile}}</el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-button icon="el-icon-warning" size="mini" @click="logout">登出</el-button>
                </el-col>
              </el-row>
            </el-popover>
            <span class="el-dropdown-link" v-popover:popover>
              <i class="iconfont icon-user c-sidebar-conl">&nbsp;</i>
              {{userInfo.name}}
            </span>
          </span>
        </li>
      </ul>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Loading} from 'element-ui';
  export default {
    name: 'Header',
    data() {
      return {

      }
    },
    computed: mapGetters(['userInfo']),
    methods: {
      logout() {
        let loadingInstance = Loading.service({fullscreen: true});
        this.$xttp.post('user/signOut').then((res) => {
          if (!res['errorCode']) {
            this.$store.dispatch('changeToken', null);
            loadingInstance.close();
            this.$router.push('/auth/login');
          }
        }).catch(() => loadingInstance.close());
      },
    },
    mounted(){
      // console.log(this.userInfo)
    }
  }
</script>

<style scoped lang="scss">
  $headerBg: #23262b;
  $fontColor: #fff;
  $headerH: 40px;
  .c-header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: $headerH;
    border-bottom: 1px solid hsla(0, 0%, 100%, .15);
    background: $headerBg;
    .c-logo {
      float: left;
      width: 168px;
      margin-top: 10px;
      margin-left: 20px;
      color: $fontColor;
    }
    .c-account {
      color: #fff;
    }
    .c-navgator {
      position: absolute;
      right: 0px;
      z-index: 100;
      font-size: 14px;
      padding: 0 20px;
      li {
        float: left;
        height: $headerH;
        line-height: $headerH;
        color: $fontColor;
        margin-right: 7px;
      }
    }
    .c-sidebar-conl {
      color: white;
    }
  }
</style>
