<template>
  <view class="Me" v-if="userinfo">
    <view ref="float" class="float" :class="floatFixed ? 'fixed' : ''">
      <view
        :style="{ marginTop: statusHeight, opacity: floatFixed ? 0 : '' }"
        class="left"
        @click="$nav('/pages/user/info')"
      >
        <image class="action-icon" src="/static/img/icon/edit.png"></image>
        <text>编辑资料</text>
      </view>
    </view>
    <view
      class="scroll"
      ref="scroll"
    >
      <view ref="desc" class="desc">
        <header
          class="header"
          ref="header"
          @click="previewImg = getAvatar(userinfo.avatar)"
        >
          <view class="info">
            <image
              :src="getAvatar(userinfo.avatar)"
              class="avatar"
              mode="aspectFill"
              @click.stop="previewImg = getAvatar(userinfo.avatar)"
            />
            <view class="right">
              <p class="name">{{ userinfo.nickname }}</p>
            </view>
          </view>
        </header>
        <view class="detail">
          <view class="head">
            <view class="heat">
              <view class="text" @click="isShowStarCount = true">
                <text class="num">{{
                  _formatNumber(userinfo.aweme_count)
                }}</text>
                <text>获赞</text>
              </view>
              <view
                class="text"
                @click="$nav('/people/follow-and-fans', { type: 0 })"
              >
                <text class="num">{{
                  _formatNumber(userinfo.following_count)
                }}</text>
                <text>朋友</text>
              </view>
              <view
                class="text"
                @click="$nav('/people/follow-and-fans', { type: 0 })"
              >
                <text class="num">{{
                  _formatNumber(userinfo.following_count)
                }}</text>
                <text>关注</text>
              </view>
              <view
                class="text"
                @click="$nav('/people/follow-and-fans', { type: 1 })"
              >
                <text class="num">{{
                  _formatNumber(userinfo.follower_count)
                }}</text>
                <text>粉丝</text>
              </view>
            </view>
          </view>
          <view class="signature" @click="$nav('/user/info-item', { type: 3 })">
            <template v-if="!userinfo.description">
              <text>点击添加介绍，让大家认识你...</text>
              <image src="/static/img/icon/me/write-gray.png" alt=""> </image>
            </template>
            <view v-else class="text" v-html="userinfo.description"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, reactive, onMounted, computed, nextTick, inject } from "vue";
import { _formatNumber, getAvatar } from "@/utils";
const store = inject("store");
import { onShow } from "@dcloudio/uni-app";

const userinfo = computed(() => store.state.userinfo);
onShow(() => {
  if (!userinfo.value) {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
});

const $nav = (path) => {
  uni.navigateTo({
    url: path,
  });
};

const statusHeight = computed(() => store.state.statusHeight + "px");

// 定义响应式变量
const previewImg = ref("");
const isShowStarCount = ref(false);
const floatFixed = ref(false);
const floatShowName = ref(false);
const isScroll = ref(false);
const refs = reactive({
  header: null,
  headerHeight: 0,
  descHeight: 0,
  videoSlideHeight: 0,
  maxSlideHeight: 0,
});
const startLocationY = ref(0);
const fixedLocationY = ref(0);
const lastMoveYDistance = ref(0);
const canTransformY = ref(0);
const startTime = ref(0);
const floatHeight = 46;
const tempScroll = ref(false);
const acceleration = 1.2;
const sprint = 15;
const canScroll = ref(true);
const contentIndex = ref(0);

// 计算属性
const videoSlideRowListStyle = computed(() => {
  return {
    height:
      refs.videoSlideHeight !== 0
        ? `${refs.videoSlideHeight}px`
        : "calc(var(--vh, 1vh) * 100 - 146px)",
  };
});

const SlideItemStyle = computed(() => {
  return tempScroll.value || isScroll.value
    ? { overflow: "auto" }
    : { overflow: "hidden" };
});

// 生命周期钩子
onMounted(() => {
  nextTick(() => {
    refs.header = document.querySelector(".header");
    refs.headerHeight = refs.header.offsetHeight;
    refs.descHeight = document.querySelector(".desc").offsetHeight;
    // refs.maxSlideHeight = document.querySelector('.videoSlideRowList').offsetHeight; // 注意这里需要根据实际DOM结构调整
    canTransformY.value = refs.descHeight - floatHeight; // 浮动元素高度假设为46
    // changeIndex(0, null); // 如果有changeIndex方法，需要定义
  });
});

// 方法


// 获取滚动区域高度
const getScrollAreaHeight = async (index = contentIndex.value) => {
  let scrollAreaHeight = 0;
  if (index === 3) {
    await nextTick(() => {
      const collectElement = document.querySelector(".collect"); // 确保该元素存在
      if (collectElement) {
        scrollAreaHeight = collectElement.clientHeight + 60 + 40;
      }
    });
  } else {
    switch (index) {
      case 0:
        scrollAreaHeight += 60;
        break;
      case 1:
        scrollAreaHeight += 60 + 40;
        break;
      case 2:
        scrollAreaHeight += 60 + 40;
        break;
    }
  }
  return scrollAreaHeight;
};

// 获取DOM元素的transform值
const getTransform = (el) => {
  const transform = el.style.transform;
  if (!transform) return 0;
  const transformY = transform.substring(
    transform.indexOf("0px") + 5,
    transform.lastIndexOf("0px") - 4
  );
  return parseInt(transformY);
};

// 根据年龄计算周岁
const filterAge = (age) => {
  const date = new Date(age);
  return new Date().getFullYear() - date.getFullYear();
};
</script>
<style scoped lang="less">
body {
  background: #151723;
}
.Me {
  background: #151723;
  height: 100%;
  width: 100%;
  font-size: 14px;

  .preview-img {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;

    .resource {
      width: 100%;
      max-height: 100%;
    }

    .download {
      position: absolute;
      bottom: 20px;
      right: 20px;
      padding: 3px;
      background: #3a3a4666;
      width: 20px;
    }
  }

  .mask {
    background: #0000004f;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100);
    z-index: 3;
  }

  .scroll {
    .notice {
      font-size: 12px;
      height: 40px;
      color: #bababb;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        height: 12px;
        margin-right: 5px;
      }
    }

    .collect {
      padding: 7px;

      .video {
        background: #1f2534;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 7px;

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;

          .left {
            display: flex;
            align-items: center;
            color: gainsboro;

            img {
              height: 20px;
              margin-right: 5px;
            }
          }

          .right {
            font-size: 14px;
            display: flex;
            align-items: center;
            color: #bababb;

            img {
              height: 15px;
              width: 15px;
            }
          }
        }

        .list {
          display: grid;
          grid-template-columns: 33.33% 33.33% 33.33%;

          .item {
            height: calc(33.33% * 1.3);
            padding: 2px;
            overflow: hidden;
            position: relative;

            .poster {
              object-fit: cover;
              border-radius: 4px;
              width: 100%;
              height: 100%;
              display: block;
            }

            .num {
              color: white;
              position: absolute;
              bottom: 5px;
              left: 5px;
              display: flex;
              align-items: center;
              font-size: 14px;

              .love {
                width: 14px;
                height: 14px;
                margin-right: 5px;
              }
            }
          }
        }
      }

      .music {
        background: #1f2534;
        border-radius: 5px;
        padding: 10px;

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;

          .left {
            display: flex;
            align-items: center;
            color: gainsboro;

            img {
              height: 15px;
              margin-right: 5px;
            }
          }

          .right {
            display: flex;
            align-items: center;
            color: #bababb;

            img {
              height: 15px;
              width: 15px;
            }
          }
        }

        .list {
          display: grid;
          grid-template-columns: 33.33% 33.33% 33.33%;

          .item {
            padding: 2px;
            overflow: hidden;
            position: relative;

            .poster {
              border-radius: 4px;
              width: 100%;
              height: 130px;
              max-height: calc((100vw - 34px) / 3);
              display: block;
            }

            .title {
              margin-top: 5px;
              color: #bababb;
            }
          }
        }
      }
    }
  }

  .float {
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 110upx;
    padding: 0 15px;
    background: transparent;
    transition: all 0.2s;
    text-align: center;
    .action-icon {
      width: 40upx;
      height: 40upx;
    }
    .center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: white;
    }

    &.fixed {
      background: #151724;

      .item {
        background: #151724 !important;
      }
    }

    .left {
      font-size: 14px;
      height: 30px;
      display: flex;
      gap: 6px;
      padding: 0 10px;
      align-items: center;
      border-radius: 20px;
      background: rgba(82, 80, 80, 0.5);
      color: white;

      svg {
        font-size: 16px;
      }
    }

    .right {
      display: flex;

      .item {
        height: 30px;
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(82, 80, 80, 0.5);
        border-radius: 50%;
        margin-left: 10px;

        svg {
          color: white;
          font-size: 22px;
        }

        .finger {
          transform: rotate(90deg);
        }
      }
    }
  }

  .desc {
    header {
      position: relative;
      color: white;
      height: 450upx;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;

      box-sizing: border-box;

      .info {
        position: absolute;
        bottom: 10px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 15px;

        .avatar {
          border: 1px solid black;
          padding: 2px;
          border-radius: 50%;
          width: 100px;
          height: 100px;
        }

        .name {
          font-size: 16px;
          margin-bottom: 5px;
        }

        .number {
          font-size: 12px;
          color: #bababb;
          display: flex;
          align-items: center;

          img {
            width: 12px;
            margin-left: 5px;
          }
        }
      }
    }

    .detail {
      transform: translateY(-10px);
      background: #151724;
      padding: 15px 15px 0 15px;
      border-radius: 14px 14px 0 0;

      .head {
        width: 100%;
        display: flex;
        margin-bottom: 20px;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;

        .heat {
          color: #bababb;
          display: flex;
          gap: 26px;
          align-items: center;
          justify-content: space-between;

          .num {
            color: white;
            font-size: 14px;
            font-weight: bold;
          }

          .text {
            font-size: 13px;
            display: flex;
            align-items: center;
            flex-direction: column;
          }
        }

        .button {
          position: relative;
          padding: 8px 20px;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          background: #3a3a46;
          color: white;
        }
      }

      .signature {
        font-size: 13px;
        color: #bababb;
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        img {
          height: 12px;
          margin-left: 6px;
        }

        .text {
          white-space: pre-wrap;
        }
      }

      .more {
        margin-bottom: 10px;
        color: #bababb;
        display: flex;
        gap: 8px;

        .item {
          padding: 2px 5px;
          border-radius: 2px;
          background: #3a3a4666;
          font-size: 12px;
          display: flex;
          align-items: center;

          img {
            height: 10px;
            margin-right: 2px;
          }
        }
      }

      .other {
        display: flex;

        .item {
          width: 20vw;
          margin-right: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: gray;
          gap: 6px;
          font-size: 12px;

          svg {
            color: white;
            font-size: 24px;
          }
        }
      }
    }
  }

  .ul {
    font-size: 14px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    margin: 0;
    position: absolute;
    color: white;
    background: #151724;

    .line {
      height: 1px;
      background: #cccccc;
      opacity: 0.1;
      margin: 5px 20px;
    }

    .li {
      box-sizing: border-box;
      background: #151724;
      width: 100%;
      padding: 10px 26px;
      list-style: none;
      display: flex;
      align-items: center;
      line-height: 40px;

      &:nth-last-child(1) {
        margin-bottom: 90px;
      }

      &:active {
        background: #454b65;
      }

      img {
        height: 20px;
        width: 20px;
        margin-right: 15px;
      }
    }
  }

  .more-function {
    box-sizing: border-box;
    font-size: 12px;
    width: 100%;
    position: absolute;
    background: #151724;

    .title {
      padding: 20px 0 10px 20px;
      color: gray;
    }

    .functions {
      display: grid;
      grid-template-columns: 33.33% 33.33% 33.33%;

      color: white;

      .function {
        margin: 15px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
          border-radius: 50%;
          background: #3a3a4666;
          padding: 6px;
          height: 16px;
          margin-bottom: 15px;
        }
      }
    }
  }

  .button-ctn {
    font-size: 14px;
    z-index: 99999;
    width: 70vw;
    position: absolute;
    bottom: 0;
    background: 151724;

    .button {
      box-sizing: border-box;
      width: calc(100% - 40px);
      background: #3a3a46;
      margin: 20px;
      height: 45px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;

      img {
        height: 25px;
        width: 25px;
        margin-right: 15px;
      }
    }
  }
}
.header {
  background-image: url("../../static/img/icon/avatar/background.png") !important;
}
</style>
