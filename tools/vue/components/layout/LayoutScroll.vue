<template>
  <div class="layout-scroll">
    <div id="minirefresh" class="minirefresh-wrap">
      <div class="minirefresh-scroll">
          <slot></slot>
      </div>
    </div>
  </div>
</template>
<script type='text/javascript'>
  import MiniRefreshTools from 'minirefresh'; //http://www.minirefresh.com/minirefresh-doc/
  import 'minirefresh/dist/debug/minirefresh.css'
  export default {
    data() {
      return {
        minirefresh: null
      };
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        const self = this;
        // eslint-disable-next-line
        self.miniRefresh = new MiniRefresh({
          container: '#minirefresh',
          dampRate: 0,
          down: {
            isLock: true
          },
          up: {
            isAuto: true,
            callback(){
                // 上拉事件
                self.$emit('up')
                // 注意，由于默认情况是开启满屏自动加载的，所以请求失败时，请务必endUpLoading(true)，防止无限请求
            },
            // callback: self.up,
            loadFull: {
              isEnable: false,
              delay: 400
            }
          }
        });
      },
      triggerUpLoading() {
        this.miniRefresh.triggerUpLoading()
      },
      triggerDownLoading() {
        this.miniRefresh.triggerDownLoading()
      },
      endDownLoading(end) {
        this.miniRefresh.endDownLoading(end)
      },
      endUpLoading(end) {
        this.miniRefresh.endUpLoading(end)
      },
      resetUpLoading() {
        this.miniRefresh.resetUpLoading()
      },
      scrollTo(y, duration){
        this.miniRefresh.scrollTo(y, duration)
      },
      getPosition() {
        return this.minirefresh.getPosition()
      }
    }
  };

</script>
<style lang='less' scoped>
  /**
 * showcase通用样式
 */
  .layout-scroll {
    position: relative;
    width: 100%;
    height: 100%;
  }
  * {
    -webkit-user-select: none;
  }
  .minirefresh-scroll {
    // background: @theme-bg;
  }

</style>
