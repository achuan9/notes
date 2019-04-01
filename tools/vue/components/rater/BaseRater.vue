<template>
  <div class="rater">
    <a class="rater__box" 
    v-for="i in max" 
    :key="i"
    @click="handleClick(i-1)" 
    >
      <i class="icon-star" :class="[size, {'icon-star-yes':currentValue > i-1}, {'icon-star-half': cutPercent > 0 && cutIndex === i-1}]"></i>
    </a>
  </div>
</template>

<script>
export default {
  name: "BaseRater",
  props: {
    size: {
      //尺寸 big | small
      type: String,
      default: "small"
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 5
    },
    value: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    sliceValue() {
      const _val = this.currentValue.toFixed(2).split(".");
      return _val.length === 1 ? [_val[0], 0] : _val;
    },
    cutIndex() {
      return this.sliceValue[0] * 1;
    },
    cutPercent() {
      return this.sliceValue[1] * 1;
    }
  },
  methods: {
    handleClick(i, force) {
      if (!this.disabled || force) {
        if (this.currentValue === i + 1) {
          this.currentValue = i < this.min ? this.min : i;
        } else {
          this.currentValue = i + 1 < this.min ? this.min : i + 1;
        }
      }
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  watch: {
    currentValue(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.currentValue = val;
    }
  }
};
</script>

<style lang = 'less' scoped>
@import "~@/assets/style/theme.less";

.rater {
  display: inline-block;
  .rater__box {
    position: relative;
    display: inline-block;
    margin-right: 0.1rem;
    text-align: center;
    cursor: pointer;
    .icon-star {
      &.big {
        width: 0.48rem;
        height: 0.45rem;
      }
      &.small {
        width: 0.27rem;
        height: 0.25rem;
      }
      background: url("./mine-star.png") 0 0 no-repeat;
      background-size: 100% auto;
      &.icon-star-yes {
        background: url("./mine-star-yes.png") 0 0 no-repeat;
        background-size: 100% auto;
      }
      &.icon-star-half {
        background: url("./mine-star-half.png") 0 0
          no-repeat;
        background-size: 100% auto;
      }
    }
  }
}

.rater-inner {
  position: relative;
  display: inline-block;
}

.rater-outer {
}
</style>

