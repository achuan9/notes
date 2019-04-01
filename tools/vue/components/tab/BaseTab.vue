<template>
  <div class="base-tab" :class="[{ scrollable }, {'horizontal-screen': horizontalScreen !== false}, {'fixed-top': fixedTop}]" ref="tab">
    <div 
      class="base-tab-item" 
      :class=" {'base-tab-item__selected': currentIndex === index}"
      @click="currentIndex = index"
      v-for="(item, index) in tabs" 
      :key="index">
      {{item.name || item}}
    </div>
    <i class="base-tab-bar" :style="{left: barLeft}"></i>
  </div>
</template>

<script>

  export default {
    name: 'BaseTab',
    props: {
      tabs: {
        type: Array,
        require: true
      },
      value: {
        type: String | Number
      },
      fixedTop: {//是否固定在顶部
        type: String | Boolean,
        default: true
      },
      horizontalScreen: {//是否横屏
        type: String | Boolean,
        default: false
      },
    },
    data() {
      return {
        
        currentIndex: 0,
        number: this.tabs.length,
        // tabWidth: 0,
        tabItemWidth: 0,
        // barLeft: 0,
        mounted: false
      }
    },
    computed: {
      barLeft() {
        if(this.mounted) {
          const tabItemWidth = this.tabItemWidth;
          const curLeft = tabItemWidth * this.currentIndex
          const itemHalf = tabItemWidth / 2
          return `${curLeft + itemHalf}px`;
        }
      },
      scrollable() {
        return this.number > this.scrollThreshold
      }
    },
    created() {
      if(this.value) {
        this.currentIndex = this.tabs.findIndex(item => (item.value || item) === this.value) //初始化激活tab
      }
    },
    mounted() {
      this.tabItemWidth = this.$refs.tab.children[0].getBoundingClientRect().width;
      this.mounted = true;
    },
    methods: {
      resize() {
        this.tabItemWidth = this.$refs.tab.children[0].getBoundingClientRect().width;
      }
    },
    watch: {
      currentIndex(val) {
        this.$emit('change', this.tabs[val])
      }
    }
  }
</script>


<style lang="scss">
  $tab-height: $header-tab-height;
  $item-color: $color-light-grey; 
  $item-active-color: $color-white; 
  $item-active-bar-color: $color-orange;
  $easing-in-out: cubic-bezier(0.35, 0, 0.25, 1);
  $effect-duration: .1s;
  .base-tab {
    position: relative;
    display: flex;
    width: 100%;
    height: $tab-height;
    background: $color-grey;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    &.fixed-top {
      position: fixed;
      top: 0;
      z-index: $header-zindex;
    }
    .base-tab-item {
      display: block;
      flex: 1;
      width: 100%;
      height: 100%;
      font-size: 16px;
      text-align: center;
      line-height: $tab-height;
      color: $item-color;
      &.base-tab-item__selected {
        color: $item-active-color;
      }
    }
    .base-tab-bar {
      position: absolute;
      bottom: 0;
      display: block;
      width: 32px;
      height: 2px;
      transform: translateX(-50%);
      background: $item-active-bar-color;
        transition: left $effect-duration $easing-in-out $effect-duration*0.3;
    }
  }
  .base-tab.horizontal-screen {
    height: $tab-height * $scale;
    .base-tab-item {
      font-size: 16px * $scale;
      line-height: $tab-height * $scale;
    }
    .base-tab-bar {
      width: 32px * $scale;
      height: 2px * $scale;
    }
  }
</style>