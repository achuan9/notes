<template>
  <button
    class="base-btn"
    :type="type"
    :class="btnClass"
    @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>

  export default {
    name: 'BaseButton',
    props: {
      active: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      inline: {
        type: Boolean,
        default: false
      },
      outline: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'button'
      }
    },
    computed: {
      btnClass() {
        return {
          'base-btn_active': this.active,
          'base-btn_disabled': this.disabled,
          'base-btn-inline': this.inline,
          'base-btn-outline': this.outline
        }
      }
    },
    methods: {
      handleClick(event) {
        if (this.disabled) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        this.$emit('click', event)
      }
    }
  }
</script>

<style lang="scss">

  @mixin btn-active($bg: $color-light-grey, $border:$bg){
    &.base-btn_active, &:active {
      background: $bg;
      @include border-1px($border);
    }
}


  .base-btn{
    display: block;
    margin: 0 auto;
    width: 310px;
    height: 44px;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    font-size: $fontsize-normal;
    line-height: 1;
    color: $color-white;
    background: $color-gradient;
    outline: none;
    border: none;
    border-radius: $radius-size;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    
     @include btn-active();
    &.base-btn_disabled,
    &.base-btn_disabled.base-btn_active,
    &.base-btn_disabled:active{
      color: $color-white;
      background: $color-light-grey;
       @include border-1px($color-light-grey);}
}
  .base-btn-inline{
    display: inline-block;
    width: 150px;
    vertical-align: middle;
}

  .base-btn-outline{
    color: $color-purple;
    background: none;
    @include  border-1px($color-purple);
    @include btn-active();
    &.base-btn_disabled,
    &.base-btn_disabled.base-btn_active,
    &.base-btn_disabled:active{
      color: $color-grey;
      background: none;
      @include border-1px($color-grey);
    }
  }
</style>
