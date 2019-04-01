<template>
  <button type="button" class="btn-code" @click="getCodeHandler">{{btnText && `${btnText}s` || '获取验证码'}}</button>
</template>
<script type = 'text/javascript'>
  export default {
    name: '', 
    props: {
      phone: {
        type: String | Number,
        default: ''
      },
      ajaxParmas: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        btnText: 0,        
        btnTimer: null
      }
    },
    created() {
      
    },
    methods: {
      async getCodeHandler() {
        if (this.btnText) return;
        if (!this.$regex.phone.test(this.phone)) return this.$toast('请输入正确的手机号码')
        const res = await this.$post('user/sendSms', {phone: this.phone, ...this.ajaxParmas})
        this.$toast(res.msg)
        if (res.code*1 !== 0) return
        clearInterval(this.btnTimer);
        this.btnText = 60;
        this.btnTimer = setInterval(() => {
          if (this.btnText < 1) {
            return clearInterval(this.btnTimer);
          }
          this.btnText--;
        }, 1000)
      }
    },
    destroyed() {
      clearInterval(this.btnTimer);
    }
  }
  
</script>
<style lang = 'less' scoped>
  .btn-code {
        width: 2.1rem;
        height: 100%;
        color: #fff;
        border: none;
        background: none;
        border-radius: none;
      }
</style>