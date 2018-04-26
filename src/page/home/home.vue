j
<template>
  <el-main>
    <div class="wrap-1">
      <div class="job-wrap">
        <div class="head-block">
          <span>作业统计</span>
          <div class="process">
            <span :class="companyType === 'day' && 'active'" @click="companyType = 'day'">今日</span>
            <span :class="companyType === 'week' && 'active'" @click="companyType = 'week'">本周</span>
            <span class="more"></span>
          </div>
        </div>
        <div class="con-block">
          <div class="single-con-block maintain">
            <div class="wait-num">
              <span v-if="companyType === 'day'">{{companyDetail.dayMainten1Num }}</span>
              <span v-else>{{companyDetail.weekMainten1Num}}</span>
            </div>
            <p>待保养</p>
            <div class="success-num">已完成
              <span v-if="companyType === 'day'">{{companyDetail.dayMainten2Num}}</span>
              <span v-else>{{companyDetail.weekMainten2Num}}</span>
            </div>
          </div>
          <div class="single-con-block repair">
            <div class="wait-num">
              <span v-if="companyType === 'day'">{{companyDetail.dayDeclare1Num }}</span>
              <span v-else>{{companyDetail.weekDeclare1Num}}</span>
            </div>
            <p>待维修</p>
            <div class="success-num">已完成
              <span v-if="companyType === 'day'">{{companyDetail.dayDeclare2Num}}</span>
              <span v-else>{{companyDetail.weekDeclare2Num}}</span>
            </div>
          </div>
          <div class="single-con-block examine">
            <div class="wait-num">
              <span v-if="companyType === 'day'">{{companyDetail.dayAnnualExamine1Num}}</span>
              <span v-else>{{companyDetail.weekAnnualExamine1Num}}</span>
            </div>
            <p>待年检</p>
            <div class="success-num">已完成
              <span v-if="companyType === 'day'">{{companyDetail.dayAnnualExamine2Num}}</span>
              <span v-else>{{companyDetail.weekAnnualExamine2Num}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="base-wrap">
        <div class="head-block">
          <span>基础数据</span>
        </div>
        <div class="con-block">
          <div class="single-con-block">
            <div class="icon cus"></div>
            <p>客户</p>
            <div class="total">
              <span>{{companyDetail.customerNum}}</span>个

            </div>
          </div>
          <div class="single-con-block">
            <div class="icon project"></div>
            <p>项目</p>
            <div class="total">
              <span>{{companyDetail.projectNum}}</span>个

            </div>
          </div>
          <div class="single-con-block">
            <div class="icon certificate"></div>
            <p>电梯</p>
            <div class="total">
              <span>{{companyDetail.elevatorNum}}</span>个

            </div>
          </div>
          <div class="single-con-block">
            <div class="icon employee"></div>
            <p>职工</p>
            <div class="total">
              <span>{{companyDetail.employeeNum}}</span>个

            </div>
          </div>
        </div>
      </div>
      <div class="declare-wrap">
        <div class="head-block">
          <span>实时故障</span>
          <div class="process">
            <span class="refresh" :class="elevatorDeclareLoading ? 'animate' : ''" @click="getElevatorDeclare"></span>
          </div>
        </div>
        <div class="con-block">
          <div class="thead">
            <p>电梯名称</p>
            <p>地址</p>
            <p>故障描述</p>
            <p>发生时间</p>
          </div>
          <div class="tbody">
            <div v-for="item in elevatorDeclareList">
              <p>{{item.elevatorName}}</p>
              <p>{{item.address}}</p>
              <p>{{item.causeFailure}}</p>
              <p>{{item.faultDate | time('yyyy-MM-dd HH:mm:ss')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="contract-wrap">
        <div class="head-block">
          <span>即将到期合同</span>
          <div class="process">
            <span :class="contractType === 'day' ? 'active' : ''" @click="contractType = 'day';getContract()">今日</span>
            <span :class="contractType === 'week' ? 'active' : ''"
                  @click="contractType = 'week';getContract()">本周</span>
          </div>
        </div>
        <div class="con-block">
          <div class="thead">
            <p>客户名称</p>
            <p>到期时间</p>
          </div>
          <div class="tbody">
            <div v-for="item in contractList">
              <p>{{item.propCompanyName}}</p>
              <p>{{item.endDate | time('yyyy-MM-dd HH:mm:ss')}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wrap-2">
      <div class="map-wrap">
        <div id="home-container" style="width: 100%;height: 100%;border-radius: 5px"></div>
        <div class="switch-type">
          <div :class="mapType === 'elevator' && 'active'" @click="switchMapType('elevator')">电梯</div>
          <div :class="mapType === 'employee' && 'active'" @click="switchMapType('employee')">维修工</div>
        </div>
      </div>
      <div class="news-bulletin">
        <div class="news-wrap">
          <div class="head-block">
            <span>行业新闻</span>
            <div class="process">
              <span class="refresh" :class="newsLoading ? 'animate' : ''" @click="getNews"></span>
            </div>
          </div>
          <div class="con-block">
            <div class="new-block" v-for="item in newsList">
              <img :src="item.image" alt="">
              <div>
                <div>{{item.title}}</div>
                <div>发布日期：{{item.pushTime | time('yyyy-MM-dd HH:mm:ss')}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bulletin-wrap">
          <div class="head-block">
            <span>公告信息</span>
            <div class="process">
              <span class="refresh" :class="bulletinLoading ? 'animate' : ''" @click="getBulletin"></span>
            </div>
          </div>
          <div class="con-block">
            <ul>
              <li v-for="item in bulletinList">
                <p>{{item.title}}</p>
                <p>发布日期：{{item.createAt | time('yyyy-MM-dd HH:mm:ss')}}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </el-main>
</template>
<script>
  const httpUrl = {
    company: '/statistics/company/todo',//基础统计数据
    news: '/news/list',//行业新闻
    bulletin: '/pushAppMessage/getMessageHistoryList',//公告
    employee: '/statistics/regionEmployees',//员工数据
    elevatorCityData: '/statistics/regionElevators',//区域电梯数据
    elevatorData: '/statistics/communityElevators',//电梯数据
    elevatorDeclare: '/elevatorDeclare/list',//实时故障
    contract: '/contract/list',//即将到期合同
  };
  import {filterParams} from '@/utils/process';
  export default {
    name: 'home',
    data(){
      return {
        map: null,
        districtSearch: null,//行政区查询的功能
        currentLevel: null,//当前行政等级
        currentCity: {},//当前地图中心点所在区域
        currentZoom: null,//当前缩放级别
        markers: [],//圆形覆盖物
        polygon: null,//多边形覆盖物
        boundaries: {},//边界仓库
        infoWindow:null,//信息窗体

        mouseoverState: false,//鼠标经过状态
        resizeTimer: null,//resize事件定时器

        mapType: 'elevator',//elevator-查看电梯 employee-查看职工
        elevator: {
          'country': {//国下省
//            '中国':[
//              {
//                name:'广东省',
//                count:1100,
//                center:[],//自行添加center
//              },
//              {
//                name:'福建省',
//                count:1120,
//                center:[],//自行添加center
//              }
//            ]
          },
          'province': {//省下市
//            '广东省':[
//              {
//                name:'广州市',
//                count:235,
//                center:[],//自行添加center
//              },
//              {
//                name:'河源市',
//                count:111,
//                center:[]//自行添加center
//              }
//            ]
          },
          'city': {//市下区
//            '广州市':[
//              {
//                name:'天河区',
//                count:101,
//                center:[],
//              },
//              {
//                name:'海珠区',
//                count:113,
//                center:[],
//              }
//            ]
          },
          'district': {//区下楼盘以及电梯
//            '天河区':{
//              communityId:null,
//              communityName:"楼盘B",
//              elevatorCount:19,
//              location:[],
//            }
          },
        },
        employee: {
          'country': {},//国下省
          'province': {},//省下市
          'city': {},//市下区
          'district': {},//区下楼盘以及电梯
        },

        companyDetail: {
          dayAnnualExamine1Num: 0,//未完成年检
          dayAnnualExamine2Num: 0,//已完成年检
          dayDeclare1Num: 0,//未完成维修数
          dayDeclare2Num: 0,//已完成维修数
          dayMainten1Num: 0,//未完成保养数
          dayMainten2Num: 0,//已完成保养数
          customerNum: 0,//客户数
          projectNum: 0,//项目数
          elevatorNum: 0,//电梯数
          employeeNum: 0,//职工数
        },//统计数据
        companyType: 'day',// day-今日 week-本周

        newsList: [],//新闻
        newsLoading: false,
        bulletinList: [],//公告
        bulletinLoading: false,
        elevatorDeclareList: [],//实时故障
        elevatorDeclareLoading: false,
        contractList: [],//即将到期合同列表
        contractType: 'day',// day-今日 week-本周
      }
    },
    methods: {
      openInfoWindow(e){
        console.log(e)
        this.infoWindow.setContent(e.target.content);
        this.infoWindow.open(this.map, e.target.getPosition());
      },
      /**
       * @description 圆形点击事件回调
       * @param e
       */
      circleClick(e){
        let zoom = 7;
        switch (this.currentLevel) {
          case  'country': //显示市
            zoom = 8;
            break;
          case  'province'://显示区
            zoom = 10;
            break;
          case  'city'://显示街道
            zoom = 13;
            break;
        }
        this.map.setZoomAndCenter(zoom, e.target['F'].extData['center'])
      },
      /**
       * @description 圆形 鼠标移出事件回调
       * @param e
       */
      circleMouseout(e){
        if (this.polygon) {
          this.map.remove(this.polygon);
          this.polygon = null;
          this.mouseoverState = false;
        }
      },
      /**
       * @description 圆形 鼠标经过事件回调
       */
      circleMouseover(e){
        //防重复触发
        if (this.mouseoverState) return false;
        this.mouseoverState = true;
        if (this.polygon) {//已存在边界
          //且重复
          if (this.polygon['F'].extData === e.target['F'].extData['name']) return false;
          //清除边界
          this.map.remove(this.polygon);
        }
        //若已有边界点数据
        if (this.boundaries[e.target['F'].extData['name']]) {
          //渲染边界
          this.renderPolygon(this.boundaries[e.target['F'].extData['name']], e.target['F'].extData['name']);
          this.mouseoverState = false;
          return false;
        }
        this.search({
          level: e.target['F'].extData['level'],
          cityName: e.target['F'].extData['name']
        }).then(result => {
          this.mouseoverState = false;
          //渲染边界
          this.renderPolygon(result.districtList[0].boundaries, e.target['F'].extData['name'])
        })
      },
      /**
       * @description 渲染
       * @returns {Promise.<void>}
       */
      async render(){
        let _this = this, data;
        this.map.clearMap();
        //判断电梯or职工
        //判断数据是否存在
        if (this.elevator[this.currentLevel][this.currentCity[this.currentLevel]]) {
          data = this.elevator[this.currentLevel][this.currentCity[this.currentLevel]];
          //读取数据
          //批量渲染、储存覆盖物集合、绑定事件
          this.renderStatisticsMark(data);
        } else if (this.currentLevel === 'district') {//获取楼盘数据
          data = await  this.getElevatorData();
        } else {//获取城市统计
          data = await this.getElevatorCityData();
        }
        //渲染
        if (this.currentLevel === 'district') {//区下楼盘以及电梯
          let markers = [],marker;
          this.infoWindow = new AMap.InfoWindow({
            closeWhenClickMap:true,
            offset: new AMap.Pixel(0, -30)
          });
          //遍历data
          data.map(val => {
            //直接渲染data每个坐标
            //绘制楼栋图标 使用标准定位图标
            if (val.location.length > 0) {//暂时判断有无坐标
              marker = new AMap.Marker({
                position: val.location,
                animation: 'AMAP_ANIMATION_DROP',
                extData: val,
              });
              marker.content = `<div>楼盘名称：${val.communityName}</div><div>电梯数：${val.elevatorCount}</div>`;
              markers.push(marker);
            }
          });
          const overlay = new AMap.OverlayGroup(markers);
          AMap.event.addListener(overlay, 'click', this.openInfoWindow);
          overlay.setMap(_this.map);
          this.$message.success(this.mapType === 'elevator' ? '渲染电梯成功' : '渲染职工成功');
          return false;
        }
        console.log(this.currentLevel)
        //获取坐标 省市区 并渲染
        this.search({
          level: this.currentLevel,
          cityName: this.currentLevel === 'country' ? '中国' : this.currentCity[this.currentLevel]
        }).then(result => {
          console.log(result)
          let district = {}, districtList = [];
          data.map(val => district[val.name] = val);
          this.elevator[this.currentLevel][this.currentCity[this.currentLevel]] = [];
          //绘制城市图标
          districtList = result.districtList[0].districtList.filter(_district => {
            //数据存在地方才进行渲染
            if (district[_district.name]) {
              //缓存数据
              this.elevator[this.currentLevel][this.currentCity[this.currentLevel]]
                .push(Object.assign(_district, district[_district.name]));
              return _district;
            }
          });
          console.log(districtList)
          //批量渲染、储存覆盖物集合、绑定事件
          this.renderStatisticsMark(districtList)
        });
      },
      switchMapType(type){
        this.mapType = type;
        this.map.clearMap();
        //更新地图
        if (type === 'employee') {
          this.renderEmployee();
        } else {
          this.render();
        }
      },
      /**
       * @description  批量渲染统计标记、储存覆盖物集合、绑定事件
       */
      renderStatisticsMark(list){
        let _this = this, textName, textNum, circle;
        this.markers = [];
        list.map(val => {
          textName = this.renderText({
            text: val.name,
            center: val.center,
            offset: {x: 0, y: -8},
            extData: {
              name: val.name,
              level: val.level,
              adcode: val.adcode,
              center: val.center
            }
          });
          textNum = this.renderText({
            text: `${val.count}台`,
            center: val.center,
            offset: {x: 0, y: 8},
            extData: {
              name: val.name,
              level: val.level,
              adcode: val.adcode,
              center: val.center
            }
          });
          circle = this.renderCircle({
            center: val.center,
            extData: {
              name: val.name,
              level: val.level,
              adcode: val.adcode,
              center: val.center
            }
          });
          this.markers.push(textName, textNum, circle)
        })
        //注册事件
        const overlay = new AMap.OverlayGroup(this.markers);
        AMap.event.addListener(overlay, 'click', this.circleClick);
        AMap.event.addListener(overlay, 'mouseover', this.circleMouseover);
        AMap.event.addListener(overlay, 'mouseout', this.circleMouseout);
        overlay.setMap(_this.map);
      },
      /**
       * @description 渲染文字
       * @param op
       */
      renderText(op = {text: null, center: [], offset: null, extData: null}){
        const text = new AMap.Text(filterParams({
          text: op.text,//显示的文本内容
          textAlign: 'center',
          offset: op.offset,
          position: op.center,
          extData: op.extData,
          clickable: true,
          zIndex: 10,
        }))
        text.setStyle({
          'background-color': 'transparent',
          'border': 'none',
          'color': '#fff',
          'font-size': '12px'
        });
        return text;
      },
      /**
       * @description 渲染边界
       * @param path
       * @param extData
       */
      renderPolygon(path, extData){
        const _this = this;
        this.polygon = new AMap.Polygon({  //行政区边界渲染，使用多边形覆盖物实现
          map: _this.map,
          strokeWeight: 1,
          path: path,
          zIndex: 5,
          fillOpacity: 0.3,
          fillColor: '#CCF3FF',
          strokeColor: '#CC66CC',
          extData: extData,
        });
      },
      /**
       * @description 渲染圆形
       * @param op
       */
      renderCircle(op = {center: [], extData: null, zIndex: 10, fillColor: '#4c84ff'}){
        return new AMap.CircleMarker({
          center: op.center,//圆心位置
          //bubble: true,//是否将覆盖物的鼠标或touch等事件冒泡到地图上
          radius: 35,//圆的半径
          strokeColor: '#d6e0f8',
          strokeOpacity: 0.5,
          strokeWeight: 7,
          fillColor: op.fillColor || '#4c84ff',
          zIndex: op.zIndex,
          extData: op.extData
        })
      },
      /**
       * @description 地图改变大小、移动事件
       */
      resize(){
        clearTimeout(this.resizeTimer);
        this.currentZoom = this.map.getZoom();
        this.resizeTimer = setTimeout(() => {
          //获取当前城市信息
          this.getCity().then(data => {
            //处理直辖市 北京 天津 上海 重庆
            //高德地图 天津市（省级） 下 天津城区（市级）
            if(data.city === ''){
              data.city = data.province.substring(0,2) + '城区'
            }
            if (this.mapType === 'employee') {
              if ((this.level === 'city' && this.currentLevel !== 'city') && (this.level !== 'district' && this.currentLevel === 'district') || data['city'] !== this.currentCity['city']) {
                this.currentCity = Object.assign(data, {'country': '中国'});
                this.currentLevel = this.level;
                this.renderEmployee();
              }
              return false;
            }
            if (this.level !== this.currentLevel || data[this.currentLevel] !== this.currentCity[this.currentLevel]) {
              //getCity data 不会返回所在country 所以默认加上
              this.currentCity = Object.assign(data, {'country': '中国'});
              this.currentLevel = this.level;
              this.render();
            }
          });
        }, 300);
      },
      async renderEmployee(){//职工
        this.map.clearMap();
        let _this = this, data, marker = [];
        //直接查询职工坐标
        if (this.currentLevel === 'district' || this.currentLevel === 'city') {
          //判断数据是否存在
          if (this.employee['city'][this.currentCity['city']]) {
            data = this.employee['city'][this.currentCity['city']];
          } else {
            data = await this.getEmployeeData();
          }
          //渲染
          data.map(val => {
            //绘制楼栋图标 使用标准定位图标
            if (val.location.length > 0) {//暂时判断有无坐标
              marker.push(new AMap.Marker({
                position: val.location,
                animation: 'AMAP_ANIMATION_DROP',
                extData: val
              }));
            }
          });
          const overlay = new AMap.OverlayGroup(marker);
          overlay.setMap(_this.map);
          return false;
        }
        //渲染统计数据
        //判断是否存在
        if (this.employee[this.currentLevel][this.currentCity[this.currentLevel]]) {
          data = this.employee[this.currentLevel][this.currentCity[this.currentLevel]];
        } else {
          data = ''
        }

      },
      /**
       * @description 搜索城市
       * @returns {Promise<T>|Promise}
       */
      search(op = {level: 'country', cityName: '中国', district: 1}){
        this.districtSearch.setLevel(op.level);
        this.districtSearch.setSubdistrict(op.district);
        return new Promise((resolve, reject) => {
          this.districtSearch.search(op.cityName, (status, result) => {
            //若有边界点数据
            if (result.districtList[0].boundaries.length > 0) {
              //储存边界信息 key为name
              this.boundaries[result.districtList[0].name] = result.districtList[0].boundaries;
            }
            resolve(result)
          });
        })
      },
      /**
       * @description 获取当前城市
       * @returns {Promise<T>|Promise}
       */
      getCity(){
        return new Promise((resolve, reject) => {
          this.map.getCity(data => resolve(data))
        })
      },
      /**
       * @description 获取统计数据
       */
      getCompany(){
        this.$xttp.get(httpUrl.company).then(res => {
          if (!res['errorCode']) this.companyDetail = res.data
        })
      },
      /**
       * @description 获取新闻
       */
      getNews(){
        this.newsLoading = true;
        this.$xttp.get(httpUrl.news).then(res => {
          if (!res['errorCode']) this.newsList = res.data.slice(0, 2);
          this.newsLoading = false;
        }).catch(err => this.newsLoading = false);
      },
      /**
       * @description 获取公告
       */
      getBulletin(){
        this.bulletinLoading = true;
        this.$xttp.post(httpUrl.bulletin,{}).then(res => {
          if (!res['errorCode']) this.bulletinList = res.data['records'].slice(0, 3);
          this.bulletinLoading = false;
        }).catch(err => this.bulletinLoading = false)
      },
      /**
       * @description 获取实时故障
       */
      getElevatorDeclare(){
        this.elevatorDeclareLoading = true;
        this.$xttp.post(httpUrl.elevatorDeclare, {
          page: 1,
          size: 4
        }).then(res => {
          if (!res['errorCode']) this.elevatorDeclareList = res.data['records'];
          this.elevatorDeclareLoading = false;
        }).catch(err => this.elevatorDeclareLoading = false)
      },
      /**
       * @description 获取即将到期合同
       */
      getContract(){
        let endDateLeftBoundary = new Date(new Date().toLocaleDateString()).getTime(),
          endDateRightBoundary = endDateLeftBoundary + 86399000;
        if (this.contractType === 'week') {
          endDateLeftBoundary -= new Date().getDay() * 86400000;
          endDateRightBoundary = endDateLeftBoundary + 7 * 86400000 - 1000;
        }
        this.$xttp.post(httpUrl.contract, {
          page: 1,
          size: 4,
          expire: 1,
          endDateLeftBoundary:endDateLeftBoundary,
          endDateRightBoundary:endDateRightBoundary,
        }).then(res => {
          if (!res['errorCode']) {
            this.contractList = res.data['records'];
          }
        })
      },
      /**
       * @description 获取城市电梯数据
       * @returns {Promise<T>|Promise}
       */
      getElevatorCityData(){
        //整理参数
        let address ;
        //处理直辖市情况 后端数据 直辖市（省级）下 名称（市级）一致 eg: 天津市
        if (this.currentCity['city'].match('城区') !== -1) {
          address = this.currentCity['city'].substring(0,2) + '市'
        } else {
          address = this.currentCity[this.currentLevel];
        }
        const data = {
          stateLevel: this.currentLevel,
          address: address,
        };
        return new Promise((resolve, reject) => {
          this.$xttp.post(httpUrl.elevatorCityData, data).then(res => {
            if (!res['errorCode']) {
              resolve(res['data'].items);
            }
          }).catch(err => reject(false))
        });
      },
      /**
       * @description 获取详情电梯位置
       * @returns {Promise<T>|Promise}
       */
      getElevatorData(){
        let city;
        //处理直辖市情况 后端数据 直辖市（省级）下 名称（市级）一致 eg: 天津市
        if (this.currentCity['city'].match('城区') !== -1) {
          city = this.currentCity['city'].substring(0,2) + '市'
        } else {
          city = this.currentCity['city'];
        }
        //整理参数
        const data = {
          stateLevel: this.currentLevel,
          city: city,
          address: this.currentCity[this.currentLevel],
        };
        return new Promise((resolve, reject) => {
          this.$xttp.post(httpUrl.elevatorData, data).then(res => {
            if (!res['errorCode']) {
              this.elevator[this.currentLevel][this.currentCity[this.currentLevel]] = res['data'];
              resolve(res['data']);
            }
          }).catch(err => reject(false))
        });
      },
      /**
       * @description 获取职工位置
       * @returns {Promise<T>|Promise}
       */
      getEmployeeData(){
        return new Promise((resolve, reject) => {
          this.$xttp.post(httpUrl.employee, {
            city: this.currentCity['city'],
            stateLevel: 'city'
          }).then(res => {
            if (!res['errorCode']) {
              this.employee['city'][this.currentCity['city']] = res['data'];
              resolve(res['data'])
            }
          })
        })
      },
      /**
       * @description 获取城市职工数据
       */
      getEmployee(){
        return new Promise((resolve, reject) => {
          this.$xttp.post().then(res => {
            if (!res['errorCode']) {
              resolve();
            }
          })
        })
      }
    },
    computed: {
      /**
       * @description 用户缩放后的对应的level
       * @returns {string} country-查看省 province-查看市 city-查看区 district-查看街道
       */
      level(){
        return this.currentZoom <= 7 ? 'country' : this.currentZoom <= 9 ? 'province' : this.currentZoom <= 12 ? 'city' : 'district';
      }
    },
    mounted(){
//      this.getEmployeeData();
      const _this = this;
      this.getCompany();
      this.getNews();
      this.getBulletin();
      this.getElevatorDeclare();
      this.getContract();
      this.map = new AMap.Map('home-container', {
        zoom: 6,
        resizeEnable: true
      });
      AMap.service(['AMap.DistrictSearch'], () => {//回调函数
        _this.districtSearch = new AMap.DistrictSearch({
          showbiz: false,//是否显示商圈
          extensions: 'all',//是否返回行政区边界坐标
          subdistrict: 1,//显示下级行政区级数
        });
      });
      AMap.plugin(['AMap.Geolocation', 'AMap.CitySearch'], () => {
        const citySearch = new AMap.CitySearch();
        citySearch.getLocalCity((status, result) => {
          if (status === 'complete') {
            this.currentCity = {city: result.city};
            this.currentLevel = 'city';
            this.render();
            this.map.setZoom(12)
          }
        });
      });
      //地图移动结束后触发，包括平移，以及中心点变化的缩放
      this.map.on('moveend', this.resize);

    }
  }
</script>
<style lang="scss" scoped>
  @import "../../style/mixins";

  $mainBc: #fafafc;
  //$mainBc: #FAFCC7;
  $blockBc: #ffffff;
  $space: 15px;
  $radius: 5px;
  $fcDark: #333333;
  $fc: #666666;
  $fcLight: #999999;
  .el-main {
    padding: 0;
    @include optimizationScroll;
    background-color: $mainBc;
  }

  .head-block {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      color: $fcDark;
      font-size: 18px;
      letter-spacing: 1px;
    }
    div.process {
      span {
        font-size: 14px;
        margin: 0 15px;
        &:last-child {
          margin-right: 0;
        }
        &.more {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY5QUY5OTkxNDEzRTExRTg5MENDOUM0NEI4RTc1REQ0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY5QUY5OTkyNDEzRTExRTg5MENDOUM0NEI4RTc1REQ0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjlBRjk5OEY0MTNFMTFFODkwQ0M5QzQ0QjhFNzVERDQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjlBRjk5OTA0MTNFMTFFODkwQ0M5QzQ0QjhFNzVERDQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5hPXc5AAAAb0lEQVR42mL8//8/AymAcfBpYJk1a9ZkIJ0OxDPT0tJygXxdIHsHVN4NKHYVKDYDyE4CqWECEhlAzArVBAKBQCwFxf5AxSA1KVA1aSDOdCD+CcQzoBrWAvETKN4ItOEfVM0vIJ7KOAyClWQNAAEGAAkANkN+vmSMAAAAAElFTkSuQmCC") no-repeat 0 0;
          background-size: contain;
        }
        &.refresh {
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjgxRjFDNzNCNDEzRTExRThBNTJCQUJBRkI5RDZEMzNBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjgxRjFDNzNDNDEzRTExRThBNTJCQUJBRkI5RDZEMzNBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODFGMUM3Mzk0MTNFMTFFOEE1MkJBQkFGQjlENkQzM0EiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODFGMUM3M0E0MTNFMTFFOEE1MkJBQkFGQjlENkQzM0EiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6sKzPuAAABTUlEQVR42qSTPUjDQBTHbfwYiw4dLCJCHQpioasidBcdHRRaHcxSEYVuCip2rIOLSgbFRZ1ERDtWZ51ECoVWwS90F0GkEn+HL3KGGAk9+PFPXt7/3d27XMi27aZGRos7YFlWFJmHYYjBgmmaBeLtPA/BK7wRu1T5hsucRm6gD1YhCevyeQmOoQj75Db/WgGBDLIJE1Q/9FjtHVxAP+TJ+fxZAeYuZAvG/zCr8QGPKgc28HTrW5iDEuYjn35tQ1ZyzmFW38IoLPp1G+M78iKvu7ACOWcFPXAd4PSuoFffQivUAx5/XS9Qg0SAAir3Vi+gzjajHanxT4FJONGbuAYVjCNoBFKQ9nKSM4YMOhMa0uF7ZAYO5GPYx7zzbTGf3XehEx5gCspiaEPi8vepGQdgGvOe12U6gyfogKrE1KValiafqiLOzM4INXqdvwQYABtcYe8bMYcxAAAAAElFTkSuQmCC") no-repeat 0 0;
          background-size: contain;
          &.animate {
            animation: rotate .5s cubic-bezier(.76, .52, .38, .94) forwards infinite;
          }
        }
        &:hover {
          cursor: pointer;
        }
        &.active {
          color: #4c84ff;
        }
      }
    }
  }

  .wrap-1 {
    padding: $space 0 0 $space;
    display: flex;
    flex-wrap: wrap;
    & > div {
      margin-right: $space;
      margin-bottom: $space;
      border-radius: $radius;
    }
    .job-wrap {
      flex: 1;
      min-width: 836px;
      height: 263px;
      background-color: $blockBc;
      padding: 0 23px 23px;
      .con-block {
        display: flex;
        justify-content: space-between;
        .single-con-block {
          width: 30%;
          height: 180px;
          background-color: #f5f5f6;
          text-align: center;
          .wait-num {
            margin-top: 22px;
            font-size: 56px;
            letter-spacing: 2px;
          }
          p {
            font-size: 14px;
            color: $fc;
            margin-bottom: 10px;
          }
          .success-num {
            font-size: 14px;
            color: $fcLight;
          }
          &.maintain {
            .wait-num {
              color: #4c84ff;
            }
          }
          &.repair {
            .wait-num {
              color: #ff6752;
            }
          }
          &.examine {
            .wait-num {
              color: #29cc97;
            }
          }
        }
      }
    }
    .base-wrap {
      flex: 1;
      min-width: 836px;
      height: 263px;
      background-color: $blockBc;
      padding: 0 23px 23px;
      .con-block {
        overflow: hidden;
        .single-con-block {
          float: left;
          width: calc(50% - 11.5px);
          height: 76px;
          background-color: #f5f5f6;
          padding: 0 34px 0 17px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          position: relative;
          &:nth-child(odd) {
            margin-right: 20px;
          }
          .icon {
            display: inline-block;
            width: 45px;
            height: 45px;
            margin-right: 13px;
            &.cus {
              background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA4NDA5Q0I3NDEzRTExRThBNENDREUyNDA2QjVCNzI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA4NDA5Q0I4NDEzRTExRThBNENDREUyNDA2QjVCNzI3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDg0MDlDQjU0MTNFMTFFOEE0Q0NERTI0MDZCNUI3MjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDg0MDlDQjY0MTNFMTFFOEE0Q0NERTI0MDZCNUI3MjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5yVUUfAAADEklEQVR42sxZXWsTQRTdTGJtItXYxo8aLKRafVYExQd/gU8+CBarv0BBn/wBgqD/RBBBqL+gD1IE39SqNVhrSK0fxdqatsR4rtyB7TKzO7t7d5MDh5DdzezJ3TNz750tXL7f81KiAo7w5zC4ByyCCuwyt8AOuAGug9tpblhK+DsSVwNHWaQNReYQ/7FDfHwT/M7sZi2aojkOVgWeDvEYuAq244h3FV3kG1CkCp4caNyj4Bi4DP6QEk0RmQT3etmBLNYAD4CfwL9pRFd5MOXlA5ojZfBD2GQNE1PjCOclWINEnw57siokwhPC/o0DWm2mbE5QFg83+ihYgyJ90qRDGb43+mAJG/aB9SjRdU4cg4QjLN4ouuzLWElBj/Iq+AR8Cc6CtwSWywnbkjcu4OM74HQgSjfZcndTZtBRnXyUr5Y4mFLw8YBgPy7xMpbWJrvsURPw3omI85NC9cp/0QUOfVpElZvrAvcY06IrEeWlK/Y7lARpUdWiR4SWpqztoTPlkI60BFYizrelEo4STCbPwQXLuXfgM6H7DCshP+sWas5ybo57RJHaW3H3IIXH4O/AsV98XKzbUcLVHDWqLYOXv0mL7gkOWAkWN/y9IniPrkrSwhtwmAujWUMpWefjt/2pOI3oEmeyJPsflPqvgOfAMxE2o1xwA5wBX4EvwKfgzySZt8SzOu7juwg+MFjBpXQ9y7wO3gPnY47RIXv8SWCFhwkEm9L+I11PxFlaVYJCZlowIdEfvxazKNtWnBR2YvzwgnA7dT7GtWu6YOp5jttRgoWPH6diXLurc4mz+C8Ii37teB3NvQ1/j9jh0LvUvDN96srbpm68JZwdJbHpt7AKhH91QEUvhW3WtARLSCmsaC/bRFMd0vQi9odzBIn9EjyoLP5pDoC/6eXSokmHClnEl/oonDLfe1vSC9sdpbX7Yx+s0uFcsGW7IGpLdy1qAGHQsvY2auPHZR+aPP4G/JqhXXZ4HjVdmhLX4p8G+sw9oMR7RP+4mb1H9Ed90XN/Yxs2Tm5vbP2TZZnX0LKX87vxfwIMAKDdnVpDxTtbAAAAAElFTkSuQmCC") no-repeat 0 0;
              background-size: contain;
            }
            &.project {
              background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI3RDRDMzRBNDEzRTExRThCREIzOTgyNkI5RDI2NjQzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI3RDRDMzRCNDEzRTExRThCREIzOTgyNkI5RDI2NjQzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjdENEMzNDg0MTNFMTFFOEJEQjM5ODI2QjlEMjY2NDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjdENEMzNDk0MTNFMTFFOEJEQjM5ODI2QjlEMjY2NDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7GEKFZAAAEDElEQVR42sxZy29MURi/c3tb7bSlVUwbgnqUkHRRCWHTjZBIK6gSDfUMKyt/gE23bBDUOxWENIQFIRZsuuuKpIoS6tGJVqX61E59X/K7zXHdufecM/fO9Et+aTMz55zf+c73PCdS0zRppCg5hEJCPiGXMIOQBSQIE4Q/hBHCEGEAf7XF0hzHhEqAqMfvTCAbv5uNz3kTfYQf2EyopJlsKWEu/tcV3kQM6Cd8JQyHQZq1tAALBilFhFmEOMgngiDNGl1EKDbCkwi0zuS7/LRuSjjZypAJi5KL9Yp0SXMUWIGJ0inMaYngtNKk2WyWQ9OZEDaXxck0biYZsAyazqQwj3K3k3YjPR+JYjqIbSqmF+l8ePF0kjxCmRfphcb0lJhoJqYjeUQDWGAm4SjhCeE54bhfCJO07zK35FIaQGbbR9iFI7VlPz57QLiBekNHipExRy3BlvM0J5sDYts9YjrPvYdQR2jVJB9BzdNtCaahKnwyjYRtCvE8B+TrCQ8JVwnfFeufKdIqNjePcISwNYXSlsftwBxM/iKhV7I6zLOwe5XMdy3AsGiTX4sTk5FCUyORjIYQ0oYVfhs1NQqig4Rbigt5kWWnPKZSCVoaRf0vwmk4kVuIk5Hf2PhddC5KPamp0TZx1tyCRHSGUEu4AiIyG27GmGaY5mYkJOl6xNIgfRmhh9v4ZyB8nnAT4ayBUOBCtgWaHUIndAKbZ8W9J+yW7VMttPg6jsjBfhPwAptpxrHvBPlxbOY+7JebigOEjRhvS4HC+hM6pA8hTtcKobIaaCNcIlwHbKnEmA2Oufi0XhLOKayfiNQ0TZaihtZN33Uucb4dmjexySrnwoSncOYuxXUHmTRnw6UKgypAgol1+pB3yjgyINv3Z8xVCW3HJdfvtTSuqC4I3t4GbZ1CvG1E4eQMgSOw6xaQW40x1fi+AZlRRoaY9Bggm8r7BNLrgXZEETF+18Nf7sE5OR6vIZwkrEshIQ3YBU8/CiFZR9yLpGJ7fRXwCuTPIgwaIM4OeBim8E8kIDxG1JERvgMcjuDWNB+XJCpS6BGXO0E+CyGuwvE9n+wjFF8qpWkPl6YR4ap3lWYj4EXerdZoRexWbQKY6GuxczGw43IdG8Px3obJNOBOzllr3AH6NW35p53YLIeDxVJobgdgEiL5MThiq2Rt4qXlb26NLcsnDdv+LyS5ZMRUpccQLt+d9x6DCkE+XTIiajnZtVi3keKbSICSQJpP+JFm+3kXUlulascf3Dok0yOIv4UjZYrwx2SRxvSpm98YGq9PAZlEX9LWxWcC1nQHYmS6nK7DL5bLXLZMYOclqLuzQzKHQF+3pupYaCCId0RRQn1HtLX+BSlf5sXWq1pL24utSD4OpP1t/K8AAwC7v/naHn0NHAAAAABJRU5ErkJggg==") no-repeat 0 0;
              background-size: contain;
            }
            &.certificate {
              background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjMzRTEwNjQzNDEzRTExRTg4MkUyRTExN0NBRDA2ODZEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjMzRTEwNjQ0NDEzRTExRTg4MkUyRTExN0NBRDA2ODZEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzNFMTA2NDE0MTNFMTFFODgyRTJFMTE3Q0FEMDY4NkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzNFMTA2NDI0MTNFMTFFODgyRTJFMTE3Q0FEMDY4NkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5g/Q/wAAADTElEQVR42tSZS2gTURSGTyZpKT4qLkRbIkqVtkYX9iEiiqg7UVQUig3VhYIbVwpuBBciuFDUjbpwp5EKKqJScCM+FrZKrc8mllJDrVpaUFpbkdBmEv/TnGCIyeRmJk1mfvgYSGYyf86cufeec10fwxGyIA2sBVtBI6gFXjAPzAXjYAKEQT/oAk/AVys3dZk0vQocAn5QbeL6HnAd3ARjs216DTgN9kiUrYqfwmVwXp6K8uNVET/qi+At2Fsgw6xKcBL0gbZCmubovgbHgIdmR4tBANySP2LJNKfBK1BPxdF+eVmXmjXNL9ldMIeKKx94AVbma3oXuAHcVBpxpB+BJaqmfZJbpTKcFEe6A1TkMs2pcLsEKZFNTTIcGpo+BVaTvXQUbMhmmkeI42Q/ucDVVK9aWpTLyZ7i9U1r+jTOSf9JZfJ4FnJTVHcZnlO9MEY+b4xC3zQaHjOeCjzuOG3x6SrG34EGSjF5RHW2ex70UGTa+JzGGpoxHYTpN2HjQaiijFRNc7TXgW5NcqaVnKG2ZE77ZA3sBO1Omt5GztEysFyTAdxJatakRHKS6jUJuZPk9UgRalrl+IWpaO7zFlXGZ2DxkBkeNV38zNdUKgUj7WyMUm1VLOd5cfj1b5qmA5unMfnErdxygSbFpSlV4ebNK3Ta0RQlzXiSpB+TLnrZ76afOHb1W1r1/mLTv02vG2t0Ghl3kY4Jra46d7Qf93rofreH9JilnJ7gnP5isndBHT351bmRKaKBEcuF/KAmnR8nqU+Tbo+T9J5NP3WQ4aFkegTBd4eYfpBcMPGg2e4Q04HUcusaiNrc8AcuAFIrlwFpHfhzXVlRHpe6wWBqd/87cmWS+/eUdC69RkxW4/xvymwYZa4Pm4GeXo1zu/WCDQ3HpfehZ2vWnAEhm5m+AjqzNWtYf0CLHO0gnvhOpH+YaSEQlOpcL7FhHhy4extRMc16CA6W0Djvfm0Hw5m+NFpytZcoVfid2iiRpnxNs+6B9TKyFEN3KNEhNdxnVFnc9lKiHXVpFmfNUUnHFpVKSnVFztUNt4EbJPqxApllg2dlYguoXpTvFhtHfR8ldmwPyyhj+x3bTE8qdW+8jv7fG58En6VC6pT1+5CVm/4VYADBZcfNeCnFewAAAABJRU5ErkJggg==") no-repeat 0 0;
              background-size: contain;
            }
            &.employee {
              background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNEOTI5N0MxNDEzRTExRThBNzg4OEU5MzgzNzNDNkNEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNEOTI5N0MyNDEzRTExRThBNzg4OEU5MzgzNzNDNkNEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0Q5Mjk3QkY0MTNFMTFFOEE3ODg4RTkzODM3M0M2Q0QiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0Q5Mjk3QzA0MTNFMTFFOEE3ODg4RTkzODM3M0M2Q0QiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4XhVKEAAAEUElEQVR42sxZTWxMURSeefN0VKmgi1ESoY2/RPwsUBY2IiEICywkVuyEYEUITbBCCEs2JNgQYU8sxErsiASVkLaS+mtl2k5n3jiH7zYn1+t9585P25N86bt99937vTPn99309vPlVJUyldBMmIbrBkJAyBBKhIhQIAwR8oR+XFcsYYXPMbEWwmxC1jEvA0whNBHm4P/DhO+EPrxQXUkzwbkgm65CWWadHMj34EVqSjrABrkqydqShvZZCb1AVAvSrJVFsNl6SRqan0n4mKT1IGExdrBldSYsZRr2a66U9CxCOxxpPCWDfWf5kp5BWFhj+/U1l4XgoSLNNtw2gYQl8TbEfifpAE6XSU0OyUDjgYt0Tul0JmGklQ4dICGlHePQ4Zy5sUJe1r6ZQJgzWRkbcmxdQ9hLWIx1uwgPCc8xLor5WYQ1OXZlRub1zYRCSbpVaccZa0Mm3EG4bs3j9TYSLhPuCY0awpHQeAF1isu+W6GI0Z816woxlhgNZ8SCFxzzT4i4axPm8UgCYSOjdY4h3eIZLYyJ8Oark5IByVZRKEXiBaSGGxT7tkjSsz0JNwgbbFc8swB/I0HQEDa/mFbbf0k3Kt/StmkmsJywT/HMZvwiLBsIVwTJs4QjStLMs5Edcbpn7CwIp2ItvyLchXmlESXM/QDjNsT/14STVg3OCjhAuKGp8DhLBijOKwn6vPFjwkXRoYyAZBHjIohfIjwg7EQ19xWF0VKhhE5tURXGpUmlTQ+L8emEZ16gVjb2z4TvWHOWaNu7wNOebZsOoOWbjvnPQDgFW34SM+c94aC21QsUKTjOpmWcZbntsMdrVqrvtIi/hU33a7uooMLiSGa2FLrsYzHzOOl8EfNNBr4v5tyDIqZof+nQipW+hCORytluj6P+4DD6SGiUCQ2KNeaJaxO9tN8ySiE29CEdWgRCZKoTuD6M/58h7IK2Pzt6U2NiReX+Uej50xibZu3sJ6wknCOsJ2zC/VuE3yiWWPbArq/C4fj+m5i4r94/xNce31i9m3BIFEw/xb2V1twfMMF1QAdsWkYfY0Ijir2HAjiRr2wQ118t0rYMWGQ4M56KaUS0Np0PsaiPTEfBb2SHKIjiZAWh29Gfhp42PWCcquCRZFZZjns2Yf4WYCzp8/SnQfO23z0e3Fbj5nWtss8c5RmKt80pN5mP7BUJR0xXMeay9SnhpWLvPknafHrVNANHEXFK2NzEete4LGzWtuEmxOqyQsv/Nbbd6BOT2q4f1njYc1xIGMdJWTpzYC3em5qc0itfPoi5mZ9khPO2Mm3SEb4tlCYJ4RL4REkfINnJPnhkqHpJGTyGNF9NTertmkDiZew/MFaZ6YoSpQn4impM4peroHdJP9qh/Dg63VsXYW3q5FDzLvXv2KxcR3PowT6JR3PaI7kIwf1bqjbniJJs3c4RpdY/4QU0J7audcbtxFam3m6Am1g+0NGejQ9YPaa3/BFgANbiFfdAy8SSAAAAAElFTkSuQmCC") no-repeat 0 0;
              background-size: contain;
            }
          }
          .total {
            position: absolute;
            right: 34px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            span {
              font-size: 26px;
              padding-right: 7px;
            }
          }
        }
      }
    }
    .declare-wrap {
      flex: 1;
      min-width: 836px;
      height: 326px;
      background-color: $blockBc;
      padding: 0 23px 23px;
      .con-block {
        border-top: 1px solid #eee;
        width: 100%;
        height: 251px;
        overflow-y: auto;
        @include optimizationScroll;
        .thead, .tbody > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 50px;
          p {
            width: 25%;
            text-align: center;
          }
        }
        .thead {
          font-size: 14px;
          color: $fcLight;
        }
        .tbody > div {
          font-size: 12px;
          color: $fcDark;
          p {
            @include ellipsis;
          }
        }
      }
    }
    .contract-wrap {
      flex: 1;
      min-width: 836px;
      height: 326px;
      background-color: $blockBc;
      padding: 0 23px 23px;
      .con-block {
        border-top: 1px solid #eee;
        width: 100%;
        height: 251px;
        overflow-y: auto;
        @include optimizationScroll;
        .thead, .tbody > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 50px;
          p {
            width: 50%;
          }
        }
        .thead {
          font-size: 14px;
          color: $fcLight;
        }
        .tbody > div {
          font-size: 12px;
          color: $fcDark;
          p {
            @include ellipsis;
          }
        }
      }
    }
  }

  .wrap-2 {
    padding-left: $space;
    display: flex;
    flex-wrap: wrap;
    .map-wrap {
      flex: 2;
      min-width: 905px;
      height: 610px;
      margin-right: $space;
      margin-bottom: $space;
      border-radius: $radius;
      background-color: $blockBc;
      position: relative;
      .switch-type {
        position: absolute;
        top: 12px;
        right: 20px;
        z-index: 100;
        width: 160px;
        height: 35px;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        background-color: #fff;
        border: 1px solid #eee;
        & div {
          width: 100%;
          height: 100%;
          color: #5b6378;
          display: flex;
          align-items: center;
          justify-content: center;
          &.active {
            color: #fff;
            background-color: #4c84ff;
          }
          &:first-child {
            border-radius: 5px 0 0 5px;
          }
          &:last-child {
            border-radius: 0 5px 5px 0;
          }
        }
      }
    }
    .news-bulletin {
      flex: 1;
      min-width: 550px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin-right: $space;
    }
    .news-wrap, .bulletin-wrap {
      flex: 1;
      min-width: 560px;
      background-color: $blockBc;
      border-radius: $radius;
      padding: 0 23px 23px;
      margin-bottom: $space;
    }
    .news-wrap {
      height: 333px;
      transition: all .25s;
      .con-block {
        border-top: 1px solid #eee;
        padding-top: 27px;
        .new-block {
          display: flex;
          align-items: center;
          margin-bottom: 23px;
          img {
            width: 128px;
            height: 96px;
            background-color: #cccccc;
            margin-right: 15px;
          }
          & > div {
            width: 350px;
            & div:nth-child(1) {
              font-size: 16px;
              color: $fcDark;
              margin-bottom: 16px;
              @include ellipsis;
            }
            & div:nth-child(2) {
              font-size: 12px;
              color: $fcLight;
            }
          }
        }
      }
    }
    .bulletin-wrap {
      min-height: 262px;
      .con-block {
        border-top: 1px solid #eee;
        padding-top: 8px;
        ul {
          padding-left: 23px;
          li {
            list-style: disc;
            font-size: 12px;
            line-height: 30px;
            margin: 10px 0;
            span:nth-child(1) {
              color: $fcDark;
            }
            span:nth-child(2) {
              color: $fcLight;
            }
          }
        }
      }
    }
  }

  @media screen and (min-width: 1276px) and (max-width: 1625px) {
    .wrap-2 {
      .news-wrap {
        margin-right: $space;
      }
    }
  }

  @keyframes rotate {
    to {
      transform: rotateZ(0deg);
    }
    from {
      transform: rotateZ(360deg);
    }
  }
</style>
<style lang="scss">
  .marker-circle {
    width: 60px;
    height: 60px;
    font-size: 12px;
    border-radius: 50%;
    background-color: #4c84ff;
  }
</style>
