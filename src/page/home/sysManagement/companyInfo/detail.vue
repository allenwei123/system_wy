<template>
  <el-container>
    <el-main>
      <div class="c-company-container">
        <my-direct></my-direct>
        <div class="title">基本信息</div>
        <div class="form">
          <el-form class="demo-form-inline" label-width="180px">
            <el-form-item label="企业名称：">
              <span>{{form.name}}</span>
            </el-form-item>
            <el-form-item label="联系人：">
              <span>{{form.contactName}}</span>
            </el-form-item>
            <el-form-item label="联系电话：">
              <span>{{form.contactPhone}}</span>
            </el-form-item>
            <el-form-item label="注册时间：">
              <span>{{form.registeredTime | time('yyyy-MM-dd')}}</span>
            </el-form-item>
            <el-form-item label="企业Logo：">
              <img :src="logoUrl" alt="" style="max-width: 300px; max-height: 150px">
            </el-form-item>
            <el-form-item label="企业简介：">
              <span>{{form.briefIntroduction}}</span>
            </el-form-item>
            <el-form-item label="所在地区：">
              <span>{{form.province}} {{form.city}} {{form.area}}</span>
            </el-form-item>
            <el-form-item label="详细地址：">
              <span>{{form.address}}</span>
            </el-form-item>
            <el-form-item label=" " v-if="showMap">
              <aMap ref="map"></aMap>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="edit">编辑</el-button>
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
  import {getUri} from '@/utils/oss';
  import aMap from '@/components/map';

  export default {
    components: { myDirect, aMap },
    mixins: [refresh],
    data() {
      return {
        form: { },
        logoUrl: '',
        showMap: false
      }
    },
    methods: {
      getCompanyInfo () {
        let url = 'company/myCompany';
        this.$xttp.get(url).then(res => {
          if (res.errorCode === 0) {
            this.form = res.data;
            this.initMap();
            getUri(this.form.logoPath, url => {
              this.logoUrl = url;
            });
          }
        }).catch(() => {

        });
      },
      edit() {
        this.$router.push({
          path: 'companyInfo/edit'
        });
      },
      initMap() {
        let province = this.form.province || '';
        let city = this.form.city || '';
        let area = this.form.area || '';
        let address = this.form.address || '';
        let fullAddress = province + city + area + address;
        if (fullAddress) {
          this.showMap = true;
          this.$nextTick(() => {
            this.$refs.map.$emit('mapInit', {
              initAddress: fullAddress
            })
          });
        }
      }
    },
    created() {
      this.getCompanyInfo();
    }
  }
</script>

<style lang="scss" scoped>
  .form {
    margin-top: 20px;
  }
</style>
