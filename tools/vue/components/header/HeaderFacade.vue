<template>

  <div class="header-facade">
    <h1 class="header-facade-title">
      <slot></slot>
    </h1>
    <div class="header-facade-right" v-if="$slots.right" @click="$emit('on-click-right')">
      <slot name="right"></slot>
    </div>
  </div>
</template>


<script>

export default {
  name: 'HeaderFacade',
  props: {
    
  },
  methods: {
    
  },
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss">
$cur-padding-top: 37px;
$header-content-height: $header-facade-height - $header-padding-top - $cur-padding-top;

.header-facade {
  position: fixed;
  top: 0;
  left: 0;
   z-index: 10;
  width: 100%;
  padding-top: $header-padding-top + $cur-padding-top;
  box-sizing: border-box;
  background-color: $color-grey;
  .header-facade-cont {
    display: flex;
    align-items: center;
    height: $header-content-height;
  }
}


.header-facade-title {
  display: block;
  width: 100%;
  line-height: $header-content-height;
  padding-left: $page-space;
  font-size: 32px;
  font-weight: blod;
  color: $color-white;
}
.header-facade-right {
  position: absolute;
  right: $page-space;
  display: flex;
  align-items: center;
  height: $header-content-height;
  font-size: $fontsize-small;
  color: $color-white;
}


</style>
