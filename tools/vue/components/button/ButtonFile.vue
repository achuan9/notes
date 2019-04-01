<template>
  <label :for="`fileInput${_uid}`" class="button-file needsclick" :class="[{'default': !hasSlot}, {'show-icon': !hasSlot && !imgSrc }]">
    <input type="file" :id="`fileInput${_uid}`" @change="changeHandler" class="needsclick" accept="image/*" />
    <div v-show="hasSlot && !imgSrc">
      <slot></slot>
    </div>
    <img :src="imgSrc" alt="" width="100%" class="button-file__preview needsclick"/>
  </label>
</template>
<script type='text/javascript'>
  export default {
    data() {
      return {
        imgSrc: ''
      };
    },
    computed: {
      hasSlot() {
        return !!this.$slots.default
      }
    },
    created() {},
    methods: {  
      changeHandler(event) {//打开文件夹，查找图片
        const that = this;
        const file = event.target.files[0];
        if (typeof FileReader === 'undefined') return this.$toast('您的浏览器不支持图片上传，请升级您的浏览器');
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          that.imgSrc = e.target.result; //页面显示base64
        };
        that.uploadFile(file)//上传
      },
      async uploadFile(file) {
        this.$indicator.open({
          text: '上传中...',
          spinnerType: 'fading-circle'
        });
        var formdata = new FormData();
        formdata.append("file", file);
        
        let res = await this.$post('upload/upload', formdata, {'Content-Type': 'multipart/form-data'}, false);
        if (res.code * 1 !== 0) return this.$toast(res.msg);
        this.$indicator.close()
        this.$emit('upload', res.data)
      },
    }

  };

</script>
<style lang='less' scoped>
  .button-file {
    position: relative;
    display: block;
    overflow: hidden;
    background: #fff;
    input {
      position: absolute;
      z-index: -1;
    }
    &.show-icon {
      &::before,
      &::after {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: block;
        content: '';
        background: #000;
      }
      &::before {
        width: .6rem;
        height: .04rem;
      }
      &::after {
        width: .04rem;
        height: .6rem;
      }
      
    }
    &.default {
      width: 1.1rem;
      height: 1.1rem;
    }

  }

</style>
