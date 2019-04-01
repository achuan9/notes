<template>
  <div class="page-wrapper">
    <slot name="header"></slot>
    <div class="page-content" ref="content">
       <slot></slot>
    </div>
    <slot name="footer"></slot>
  </div>
</template>
<script type = 'text/javascript'>
  export default {
    name: 'LayoutPage',
    data() {
      return {
        
      }
    },
    methods: {
     
    }
  }
</script>
<style lang = 'less' scoped>
  .page-wrapper{
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 0;
    bottom: 0;
    width: 100%;
    .page-content{
      position: relative;
      flex: 1 1 0;
      width: 100%;
      /* padding-bottom: 0.1rem; */
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch; 
    }
  }
</style>