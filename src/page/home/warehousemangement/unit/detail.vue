<template>
   <div class="page-kind">
    <myDirect></myDirect>
    <el-row>
      <el-col :span="8">
      <div class="fdj-wrap">
        <div id="preview">
            <div id="img-medium">
                <img src="" alt="" width="350" height="350" />
                <div id="mark"></div>             
            </div>
            <!-- 小图导航开始 -->
            <div class="img-small">
                <a href="javascript:;" class="left" id="left">&lt;</a>
                <a href="javascript:;" class="right" id="right">&gt;</a>
                <div class="img-list-items">
                    <ul id="img-items" >
                        <li><img :src="this.images[0]" :msrc="this.images[0]" alt="" /></li>
                        <li><img :src="this.images[1]" :msrc="this.images[1]" alt="" /></li>
                        <li><img :src="this.images[2]" :msrc="this.images[2]" alt="" /></li>
                        <li><img :src="this.images[3]" :msrc="this.images[3]" alt="" /></li>
                        <li v-if="this.images[4]"><img :src="this.images[4]" :msrc="this.images[4]" alt="" /></li>
                        <li v-else><img :src="this.images[0]" :msrc="this.images[0]" alt="" /></li>
                        <li v-if="this.images[5]"><img :src="this.images[5]" :msrc="this.images[5]" alt="" /></li>
                        <li v-else><img :src="this.images[1]" :msrc="this.images[1]" alt="" /></li>
                    </ul> 
                </div>
            </div>
            <!-- 小图导航结束 -->
            <div id="img-big">
                <img src="" alt="" id="detail" />
            </div>  
        </div>   
      </div>
      </el-col>

      <el-col :span="10">
        <el-form :inline="true" :model="form" class="demo-form"  required  style="margin-left:100px;">

          <!-- <el-form-item label="客户签名" :inline="true" required> -->
            <p class="unitName">{{form.unitName}}</p>
          <!-- </el-form-item> -->
           <el-col >
          <el-form-item label="单价:" :inline="true" required >
            <p>{{Math.round(form.price)}}</p>
          </el-form-item>
          </el-col>
         <el-col >
          <el-form-item label="库存:" :inline="true" required>
            <p>{{form.stock}}</p>
          </el-form-item>
           </el-col>
            <el-col >
          <el-form-item label="品牌:" :inline="true" required>
            <p>{{form.brandName}}</p>
          </el-form-item>
           </el-col>

          <el-form-item label="梯种:" :inline="true" required>
            <p>{{form.elevatorTypeName}}</p>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
        
    <el-row>
      <div class="kind">
        <el-form :inline="true" :model="form" class="demo-form" label-width="160px" required>
        
          <el-form-item label="分类:" :inline="true" required>
            <p>{{form.unitTypeName}}</p>
          </el-form-item>

          <el-form-item label="配件编码:" :inline="true" required>
            <p>{{form.unitNum}}</p>
          </el-form-item>

          <el-form-item label="型号:" :inline="true" required>
            <p>{{form.unitModel}}</p>
          </el-form-item>

          <el-form-item label="描述:" :inline="true" required>
            <p>{{form.remark}}</p>
          </el-form-item>
        </el-form>
      </div>
    </el-row>
   </div>
</template>
<script>
import myDirect from "@/components/direct";
import { unitHttpUrl } from "@/page/home/warehousemangement/warehouseHttp";
import { filterParams } from "@/utils/process";
import { send as ossUpload, getUri } from "@/utils/oss";
export default {
  components: { myDirect },
  data() {
    return {
      src: "",
      form: {},
      uri: '',
      images: [],
    };
  },

  methods: {
    slide() {
      var preview = document.getElementById("preview"); //获取中图可视区元素
      var big = document.getElementById("img-big"); //获取大图显示div元素
      var bigImg = big.getElementsByTagName("img")[0]; //大图Img元素
      var medium = document.getElementById("img-medium"); //中图div元素
      var mediumImg = medium.getElementsByTagName("img")[0]; //中图img元素
      var mark = document.getElementById("mark"); //遮罩层元素
      var detail = document.getElementById("detail");

      medium.onmouseover = function() {
        mark.style.display = "block";
        // big.style.display = "block";
      };
      medium.onmouseout = function() {
        mark.style.display = "none";
        big.style.display = "none";
      };

      medium.onmousemove = function(e) {
        var e = e || window.event;
        var left = e.clientX - preview.offsetLeft - mark.offsetWidth / 2;
        var top = e.clientY - preview.offsetTop - mark.offsetHeight / 2;
        var markOffsetWidth = mark.offsetWidth;
        var mediumOffsetWidth = this.offsetWidth;
        //判断放大镜遮罩层溢出
        if (left < 0) {
          left = 0;
        } else if (left > mediumOffsetWidth - markOffsetWidth) {
          left = mediumOffsetWidth - markOffsetWidth;
        }
        if (top < 0) {
          top = 0;
        } else if (top > mediumOffsetWidth - markOffsetWidth) {
          top = mediumOffsetWidth - markOffsetWidth;
        }
        mark.style.left = left + "px";
        mark.style.top = top + "px";
        //计算大图随着遮罩层移动显示的百分比
        var persentX = left / (mediumOffsetWidth - markOffsetWidth);
        var persentY = top / (mediumOffsetWidth - markOffsetWidth);
        detail.style.left = -persentX * big.clientWidth + "px";
        detail.style.top = -persentY * big.clientHeight + "px";
      };
      //小图导航
      var imgItems = document.getElementById("img-items");
      var liNodes = imgItems.childNodes;
      var tmpNodes = [];
      //循环只保留li节点
      for (var i = 0; i < liNodes.length; i++) {
        if (liNodes[i].nodeType == 3) continue;
        tmpNodes.push(liNodes[i]);
      }
      var liNum = tmpNodes.length; //li节点总数
      var liWidth = parseInt(getCurrentStyle(tmpNodes[0])["width"]); //获取每个li的width值
      var liNo1 = tmpNodes[0].getElementsByTagName("img")[0];
      liNo1.style.border = "2px solid #e4393c";
      liNo1.style.width = "52px";
      liNo1.style.height = "52px";
      imgItems.style.width = liWidth * liNum + "px";
      //循环每个li导航节点绑定鼠标滑过事件
      for (var j = 0; j < liNum; j++) {
        tmpNodes[j].index = j;
        tmpNodes[j].onmouseover = function() {
          var img = this.getElementsByTagName("img")[0];
          img.style.border = "2px solid #e4393c";
          img.style.width = "52px";
          img.style.height = "52px";
          var _this = this;
          //判断取消li的兄弟节点的鼠标滑过样式
          for (var k = 0; k < liNum; k++) {
            if (k != _this.index) {
              var imgI = tmpNodes[k].getElementsByTagName("img")[0];
              imgI.style.border = "1px solid #999";
              imgI.style.width = "54px";
              imgI.style.height = "54px";
            }
          }
          //获取大图总图替换大图中图src属性加载大图中图
          mediumImg.setAttribute("src", img.getAttribute("msrc"));
          bigImg.setAttribute("src", img.getAttribute("bsrc"));
        };
      }

      //导航左右按钮
      var totalWidth = liWidth * liNum;
      var mcount = liNum - 5;
      // alert(mcount);return;
      var now = 0; //小图左右移动计数器
      var lBtn = document.getElementById("left");
      var rBtn = document.getElementById("right");
      //小图标导航向左移动
      lBtn.onclick = function() {
        if (now == 0) {
          now = 0;
        } else {
          now--;
          var timeId = setInterval(function() {
            imgItems.style.left =
              parseInt(getCurrentStyle(imgItems)["left"]) + 1 + "px";
            if (parseInt(getCurrentStyle(imgItems)["left"]) == -now * liWidth) {
              clearInterval(timeId);
            }
          }, 10);
        }
      };
      //小图标导航向右移动
      rBtn.onclick = function() {
        if (now < mcount) {
          now++;
          var timeId = setInterval(function() {
            imgItems.style.left =
              parseInt(getCurrentStyle(imgItems)["left"]) - 1 + "px";
            if (parseInt(getCurrentStyle(imgItems)["left"]) == -now * liWidth) {
              clearInterval(timeId);
            }
          }, 10);
        }
      };
      //获取style样式兼容
      function getCurrentStyle(node) {
        return window.getComputedStyle
          ? window.getComputedStyle(node, null)
          : node.correntStyle;
      }
    },

    getListData() {
      this.loading = true;
      this.$xttp
        .get(unitHttpUrl.detail + this.$route.query.id + "/detail")
        .then(res => {
          if (res.errorCode == 0) {
            this.loading = false;
            this.form = res.data;
            if (this.form.images.length > 0) {
              this.form.images.forEach(item => {
                getUri(item, uri => {
                  this.images.push(uri);
                });
              });
            }
            console.log(678, this.images);
          } else {
            this.$message(res.errorMsg);
          }
        });
    }
  },
  mounted() {
    this.$store.commit("PUSHDIRECT", "配件详情");
    this.slide();
    this.getListData();
  }
};
</script>
<style lang="scss" scoped>
.c-body {
  width: 90%;
  &.c-maxWidth {
    max-width: calc(100vw - 200px);
  }
}

.page-kind {
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
  padding: 0 20px;
  z-index: 500;
  background-color: #fff;
}

.unitName {
  margin: 40px 0 40px 90px;
}

.kind {
  width: 800px;
  height: 200px;
  background: #ddd;
}

// @charset "utf-8";
/* CSS Document */
img {
  border: none;
}
li {
  list-style: none;
}
input,
select,
textarea {
  outline: none;
  border: none;
  background: none;
}
textarea {
  resize: none;
}
a {
  text-decoration: none;
  display: block;
}

/*放大镜*/
#preview {
  width: 352px;
  position: relative;
  margin: 0px auto;
  z-index: 100;
}
.fdj-wrap {
  // width: 1000px;
  // height: 500px;
  /*background:#999;*/
  margin: 10px auto 0 auto;
}

#img-medium {
  width: 350px;
  height: 350px;
  border: 1px solid #999;
  margin-left: -20px;
}

.fdj-wrap .img-small {
  width: 310px;
  height: 58px;
  margin-top: 5px;
  /*overflow:hidden;*/
  padding: 0 21px;
  /*background:red;*/
  position: relative;
}
.img-small{
  margin-left: -20px;
}
/*小图导航*/
.fdj-wrap .img-small .img-list-items {
  width: 310px;
  height: 58px;
  position: absolute;
  left: 21px;
  top: 0;
  overflow: hidden;
}
.fdj-wrap .img-small .left,
.fdj-wrap .img-small .right {
  height: 54px;
  width: 17px;
  border: 1px solid #999;
  text-align: center;
  color: #999;
  line-height: 54px;
  position: absolute;
  top: 0;
  // left: 5px;
}
.left {
  left: 0;
}
.right {
  right: -40px;
}
.fdj-wrap .img-small .img-list-items ul {
  /*width:1000px;*/
  /*height:58px;*/
  position: absolute;
  top: 0;
  left: 0;
}
.fdj-wrap .img-small .img-list-items ul li {
  float: left;
  text-align: center;
  width: 62px;
  vertical-align: center;
  /*height:58px;*/
}
.fdj-wrap .img-small .img-list-items ul li img {
  border: 1px solid #999;
  width: 54px;
  height: 54px;
  cursor: pointer;
}
.fdj-wrap .img-small .img-list-items ul li img:hover{
    border:2px solid #e4393c;
    width:52px;
    height:52px;
}
/*大图*/
// #img-big {
//   display: none;
//   width: 400px;
//   height: 400px;
//   position: absolute;
//   top: 0px;
//   left: 360px;
//   border: 1px solid #999;
//   overflow: hidden;
// }
// #img-big img {
//   position: absolute;
//   top: 0;
//   left: 0;
// }
// /*遮罩层*/
// #mark {
//   width: 175px;
//   height: 175px;
//   opacity: 0.5;
//   filter: alpha(opacity=50);
//   background: #999;
//   cursor: move;
//   position: absolute;
//   display: none;
// }
</style>
