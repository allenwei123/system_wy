<template>
  <el-container>
    <el-main>
      <div class="c-company-container">
        <my-direct></my-direct>
        <div class="title">基本信息</div>
        <div class="form">
          <el-form class="demo-form-inline" label-width="180px">
            <el-form-item label="企业名称：" required>
              <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="联系人：" required>
              <el-input v-model.trim="form.contactName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" required>
              <el-input v-model.trim="form.contactPhone"></el-input>
            </el-form-item>
            <el-form-item label="注册时间：">
              <!--<el-input v-model.trim="form.contactPhone"></el-input>-->
              <span>{{form.registeredTime | time('yyyy-MM-dd')}}</span>
            </el-form-item>
            <el-form-item label="企业Logo：">
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
            <el-form-item label="企业简介：" required>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5}"
                placeholder="请输入内容"
                v-model="form.briefIntroduction">
              </el-input>
            </el-form-item>
            <el-form-item label="所在地区：" required>
              <el-select value="" placeholder="省份" v-model="form.province">
                <el-option v-for="item in provinces" :key="item.code" :label="item.name" :value="item.name" @change="onProvinceChange"></el-option>
              </el-select>
              <el-select value="" placeholder="城市" v-model="form.city">
                <el-option v-for="item in cities" :key="item.code" :label="item.name" :value="item.name" @change="onCityChange"></el-option>
              </el-select>
              <el-select value="" placeholder="县区" v-model="form.area">
                <el-option v-for="item in districts" :key="item.code" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="详细地址：" required>
              <el-input v-model.trim="form.address"></el-input>
            </el-form-item>
            <el-form-item label="">
              <aMap ref="map" @click="onMapClick"></aMap>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
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
  import {send as ossUpload, getUri} from '@/utils/oss';
  import aMap from '@/components/map';

  export default {
    components: { myDirect, aMap },
    mixins: [refresh],
    data() {
      return {
        form: {},
        fileList: [],
        logoUrl: '',
        addressData: []
      }
    },
    computed: {
      provinces() {
        return this.addressData;
      },
      cities() {
        let p = this.provinces.find(item => item.name === this.form.province || '');
        return p ? p.children : [];
      },
      districts() {
        let c = this.cities.find(item => item.name === this.form.city || '');
        return c ? c.children: [];
      }
    },
    methods: {
      onProvinceChange() {
        this.form.city = '';
        this.form.area = '';
      },
      onCityChange() {
        this.form.area = '';
      },
      onExceed() {
        this.$message("只能上传一张图片");
      },
      getCompanyInfo () {
        let url = 'company/myCompany';
        this.$xttp.get(url).then(res => {
          if (res.errorCode === 0) {
            this.form = res.data;
            this.initMap();
            getUri(this.form.logoPath, url => {
              this.logoUrl = url;
              this.fileList.push({
                url: url
              });
            });
          }
        }).catch(() => {

        });
      },
      // 获得省市区数据
      getDsictrict() {
        this.$xttp.post('deliveryAddress/state/list', {}).then(res => {
          if (res.errorCode === 0) {
            this.addressData = res.data;
          }
        }).catch(() => {});
      },
      initMap() {
        let province = this.form.province || '';
        let city = this.form.city || '';
        let area = this.form.area || '';
        let address = this.form.address || '';
        let fullAddress = province + city + area + address;
        this.$nextTick(() => {
          this.$refs.map.$emit('mapInit', {
            initAddress: fullAddress
          })
        });
      },
      onMapClick(data) {
        let province = data.province,
            city = data.city,
            district = data.district,
            formattedAddress = data.formattedAddress;

        let fullDisctrict = province + city + district;
        let address = formattedAddress.substr(formattedAddress.indexOf(fullDisctrict) + fullDisctrict.length);

        this.form.province = province;
        this.form.city = city;
        this.form.area = district;
        this.form.address = address;
        // 触发vue的视图更新
        this.form = Object.assign({}, this.form);
      },
      beforeRemove() {
        this.form.logoPath = '';
      },
      onSubmit() {
        if (!this.form.name) {
          this.showWarning('请输入企业名称');
          return;
        }
        if (!this.form.contactName) {
          this.showWarning('请输入联系人');
          return;
        }
        if (!this.form.contactPhone) {
          this.showWarning('请输入联系电话');
          return;
        }
        if (!this.form.briefIntroduction) {
          this.showWarning('请输入企业简介');
          return;
        }
        if (!this.form.city) {
          this.showWarning('请选择所在地区');
          return;
        }
        if (!this.form.address) {
          this.showWarning('请输入详细地址');
          return;
        }
        var uploadFiles = this.$refs.upload.uploadFiles;
        if (uploadFiles.length) {
          var file = uploadFiles[0];
          // 如果还是原来的图片，没有重新选择
          if (file.status === 'success') {
            this.submitForm();
          }
          // 选择了新图，重新上传
          else {
            ossUpload(file.raw, key => {
              this.form.logoPath = key;
              this.submitForm();
            });
          }
        }
        else {
          this.submitForm();
        }
      },
      showWarning(text) {
        this.$message({
          message: text,
          type: "warning"
        });
      },
      submitForm() {
        let params = Object.assign({}, this.form);
        delete params.registeredTime;
        this.$xttp.post('company/edit', params).then(res => {
          if (res.errorCode === 0) {
            this.$router.push({
              path: '/companyInfo'
            })
          }
        }).catch(() => {});
      }
    },
    created() {
      this.getDsictrict();
      this.getCompanyInfo();
    }
  }
</script>

<style lang="scss" scoped>
  .form {
    margin-top: 20px;
  }
</style>
