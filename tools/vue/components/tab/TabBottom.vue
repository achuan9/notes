<template>
  <div class="tab-bottom">
    <router-link :to="{name: 'Home'}" class="tab-bottom-item" :class="{active: value === 'home'}">
      <i class="tab-bottom-icon home"></i>
      <p class="tab-bottom-text">首页</p>
    </router-link>
    <router-link :to="{name: 'CameraList'}" class="tab-bottom-item" :class="{active: value === 'camera'}">
      <i class="tab-bottom-icon camera"></i>
      <p class="tab-bottom-text">云眼</p>
    </router-link>
    <router-link :to="{name: 'FurnaceHome'}" class="tab-bottom-item" :class="{active: value === 'furnace'}">
      <i class="tab-bottom-icon furnace"></i>
      <p class="tab-bottom-text">智能加热炉</p>
    </router-link>
    <router-link :to="{name: 'NewsList'}" class="tab-bottom-item" :class="{active: value === 'news'}">
      <i class="tab-bottom-icon news"></i>
      <p class="tab-bottom-text">资讯</p>
    </router-link>
    <router-link :to="{name: 'MineHome'}" class="tab-bottom-item" :class="{active: value === 'mine'}">
      <i class="tab-bottom-icon mine"></i>
      <p class="tab-bottom-text">我的</p>
    </router-link>
  </div>
</template>
<script type='text/javascript'>
  export default {
    name: 'TabBottom',
    props: {
      value: { // ['home', 'camera', 'furnace', 'news', 'mine' ]
        type: String,
        default: 'home'
      }
    },
    data() {
      return {

      }
    },
    computed: {

    },
    created() {

    },
    methods: {

    },
  }
</script>
<style lang='scss' scoped>
  .tab-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    width: 100%;
    background: $color-grey;
    height: $bottom-tab-height;
  }

  .tab-bottom-item {
    flex: 1;
    padding-top: 6px;
    text-align: center;
    
    .tab-bottom-text {
      line-height: 18px;
      font-size: 10px;
      color: #8386A2;
    }
    .tab-bottom-icon {
      display: block;
      width: 24px;
      height: 24px;
      margin: 0 auto;

      &.home {
        @include bg-image('./img/bottombar_home');
      }

      &.camera {
        @include bg-image('./img/bottombar_camera');
      }

      &.furnace {
        @include bg-image('./img/bottombar_furnace');
      }

      &.news {
        @include bg-image('./img/bottombar_news');
      }

      &.mine {
        @include bg-image('./img/bottombar_mine');
      }
    }
  }

  .tab-bottom-item.active {
    .tab-bottom-text {
      color:#FFC69B;
    }
    
    .tab-bottom-icon {
      &.home {
        @include bg-image('./img/bottombar_home_sel')
      }
      &.camera {
        @include bg-image('./img/bottombar_camera_sel')
      }
      &.furnace {
        @include bg-image('./img/bottombar_furnace_sel')
      }
      &.news {
        @include bg-image('./img/bottombar_news_sel')
      }
      &.mine {
        @include bg-image('./img/bottombar_mine_sel')
      }
    }
  }

</style>