<template>
  <view
    :id="'BaseHeader'"
    :class="[props.isFixed ? 'fixed' : '']"
    :style="{ paddingTop: statusHeight }"
  >
    <view class="header">
      <!-- 返回按钮 -->
      <image
        src="/static/img/icon/components/light-back.png"
        @click="back"
        class="left"
        direction="left"
      ></image>

      <!-- 中间内容插槽 -->
      <view class="center-slot">
        <slot name="center"><text></text></slot>
      </view>

      <!-- 右侧内容插槽 -->
      <view class="right-slot">
        <slot name="right"><text></text></slot>
      </view>
    </view>

    <!-- 底部内容插槽 -->
    <view class="bottom-slot">
      <slot name="bottom"></slot>
    </view>
  </view>
</template>
<script setup>
import { useAttrs, inject, computed } from "vue";

defineOptions({
  name: "BaseHeader",
});
const store = inject("store");
const props = defineProps({
  backMode: {
    type: String,
    default: "gray",
  },
  backImg: {
    type: String,
    default: "back",
  },
  isClose: {
    type: Boolean,
    default: false,
  },
  isFixed: {
    type: Boolean,
    default: true,
  },
});
const attrs = useAttrs();

const statusHeight = computed(() => store.state.statusHeight + "px");
function back() {
  uni.navigateBack();
}
</script>

<style scoped lang="less">
#BaseHeader {
  width: 100%;
  color: white;

  &.fixed {
    z-index: 2;
    top: 0;
    position: fixed;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100upx;
    box-sizing: border-box;
    border-bottom: 1px solid #cccccc11;
    position: relative;

    .left {
      position: absolute;
      left: 10px;
      width: 40upx;
      height: 40upx;
    }

    & > :nth-last-child(1) {
      height: 100%;
      position: absolute;
      right: 17px;
      top: 0;
      display: flex;
      align-items: center;
    }
  }
}
</style>
