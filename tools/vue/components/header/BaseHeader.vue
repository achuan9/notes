<template>

  <div class="base-header" :class="{'horizontal-screen': horizontalScreen !== false}">
    <div class="base-header-cont">
      <div class="base-header-left">
        <slot name="overwrite-left">
          <a class="base-header-back" href="javascript:" v-show="leftOptions.showBack" @click="onClickBack">
          </a>
        </slot>
        <slot name="left"></slot>
      </div>
      <div class="base-header-title-area" v-if="shouldOverWriteTitle">
        <slot name="overwrite-title"></slot>
      </div>
      <h1 class="base-header-title" @click="$emit('on-click-title')" v-else>
        <slot></slot>
      </h1>

      <div class="base-header-right">
        <a class="base-header-more" href="javascript:" @click="$emit('on-click-more')" v-if="showMore"></a>
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'BaseHeader',
    props: {
      horizontalScreen: {
        type: String | Boolean,
        default: false
      },
      leftOptions: {
        type: Object,
        default: function() {
          return {
            showBack: true,
            preventGoBack: false
          }
        }
      },
      showMore: {
        type: Boolean | String,
        default: false
      }
    },
    beforeMount() {
      if (this.$slots['overwrite-title']) {
        this.shouldOverWriteTitle = true
      }
    },
    methods: {
      onClickBack() {
        if (this.leftOptions.preventGoBack) {
          this.$emit('on-click-back')
        }
        else {
          this.$router ? this.$router.back() : window.history.back()
        }
      }
    },
    data() {
      return {
        shouldOverWriteTitle: false
      }
    }
  }
</script>

<style lang="scss">
  $header-padding-top: 20px;
  $header-content-height: $header-height - $header-padding-top;

  $header-padding-top-scale: $header-padding-top * $scale;
  $header-content-height-scale: ($header-height - $header-padding-top) * $scale;
  $page-space-scale: $page-space * $scale;
  .base-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: $header-zindex;
    width: 100%;
    padding-top: $header-padding-top;
    box-sizing: border-box;
    background-color: $color-grey;

    .base-header-cont {
      display: flex;
      align-items: center;
      height: $header-content-height;
      .base-header-left {
        position: absolute;
        left: 0;
        height: 100%;
        .base-header-back {
          display: inline-block;
          vertical-align: middle;
          width: 24px + $page-space;
          height: 100%;
          @include bg-image('./base_header_back', $page-space, $w: 24px);
        }
      }
      .base-header-title-area {
        display: flex;
        align-items: center;
        flex: 1;
        height: 100%;
        padding: 0 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .base-header-title {
        display: block;
        width: 100%;
        line-height: $header-content-height;
        text-align: center;
        font-size: 20px;
        font-weight: 400;
        color: $color-white;
        @extend .base-header-title-area;
      }

      .base-header-right {
        position: absolute;
        right: $page-space;
        display: flex;
        align-items: center;
        height: $header-content-height;
        font-size: $fontsize-small;
        color: $color-white;
      }

    }
  }

  .base-header.horizontal-screen {
    padding-top: $header-padding-top-scale;

    .base-header-cont {
      height: $header-content-height-scale;
      .base-header-left {
        .base-header-back {
          width: 24px * $scale + $page-space-scale;
          @include bg-image('./base_header_back', $page-space-scale, $w: 24px * $scale);
        }
      }
      .base-header-title-area {
        padding: 0 40px * $scale;
      }

      .base-header-title {
        line-height: $header-content-height-scale;
        font-size: 20px * $scale;
        @extend .base-header-title-area;
      }

      .base-header-right {
        right: $page-space-scale;
        height: $header-content-height-scale;
        font-size: $fontsize-small * $scale;
      }
    }
  }
</style>