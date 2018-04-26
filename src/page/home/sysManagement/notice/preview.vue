<template>
  <el-dialog title="公告预览" :visible.sync="previewVisible">
    <div class="c-preview-container" v-if="noticeInfo">
      <h1>{{noticeInfo.title}}</h1>
      <p>
        <span>{{time | time('yyyy-MM-dd HH:mm')}}</span>
      </p>
      <div class="c-image" v-if="uri"><img :src="uri"></div>
      <div>
        <pre>{{noticeInfo.content}}</pre>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { getUri } from '@/utils/oss';
  export default {
    data() {
      return {
        previewVisible: this.visible,
        uri:''
      }
    },
    watch: {
      visible(val) {
        this.previewVisible = val;
      },
      previewVisible(val) {
        this.$emit('update:visible', val);
      }
    },
    props: ['visible', 'noticeInfo'],
    computed: {
      time() {
        let ts = this.noticeInfo.updateAt;
        if (!ts) {
          ts = new Date().getTime();
        }
        return ts;
      }
    },
    created() {
      if(this.noticeInfo.picUrl) {
        getUri(this.noticeInfo.picUrl,(uri)=> {
          this.uri = uri;
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .c-preview-container {
    pre {
      margin: 0;
      padding: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      background-color: transparent;
      font-size: 14px;
      min-width: 280px;
      font-family: inherit;
    }
  }
  .c-image {
    width:100px;
    height: auto;
    overflow: hidden;
    img {
      width:100%;
      vertical-align: middle;
    }
  }
</style>
