<template>
  <div class="video-container">
    <mTikTok
      ref="mTikTokRef"
      :video-list="state.videoList"
      @loadMore="loadMore"
      @change="change"
    >
      <!-- 此处为用户完全自定义 data 中的数据为当前渲染的数据 -->
      <template v-slot="data">
        <!-- active修复视频悬浮层消失和点击的问题 -->
        <cover-view
          class="video-side-right"
          :class="{ active: state.cutVideo.id === data.item.id }"
        >
          <cover-view class="action-item action-item-user">
            <cover-image
              class="shop-logo"
              src="https://examples-1251000004.cos.ap-shanghai.myqcloud.com/sample.jpeg?cover-imageMogr2/crop/180x180/gravity/center"
            />
            <cover-view class="action-item-cover-view"></cover-view>
          </cover-view>
          <cover-view class="action-item">
            <cover-image class="action-icon" src="/static/img/icon/love.png" />
            <cover-view class="action-item-cover-view">{{
              data.item.id
            }}</cover-view>
          </cover-view>
          <cover-view class="action-item">
            <cover-image
              class="action-icon"
              src="/static/img/icon/message.png"
            />
            <cover-view class="action-item-cover-view">评论</cover-view>
          </cover-view>
          <cover-view class="action-item">
            <cover-image
              class="action-icon"
              src="/static/img/icon/collect.png"
            />
            <cover-view class="action-item-cover-view">收藏</cover-view>
          </cover-view>
        </cover-view>
        <!-- active修复视频悬浮层消失和点击的问题 -->
        <cover-view
          class="video-bottom-area"
          :class="{ active: state.cutVideo.id === data.item.id }"
        >
          <cover-view class="shop-name"> @{{ data.item.name }} </cover-view>
          <cover-view class="shop-card">{{ data.item.desc }}</cover-view>
        </cover-view>
      </template>
    </mTikTok>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
// 导入组件
import mTikTok from "@/components/mTikTok.vue";
import { getVideoList } from "@/api/video";
import { baseurl } from "@/api/requestUtil";
import { onShow, onHide } from "@dcloudio/uni-app";
const mTikTokRef = ref<InstanceType<typeof mTikTok>>();

const state = reactive({
  cutVideo: {} as AnyObject,
  videoList: [
    {
      src: "http://127.0.0.1:5500/index_20230505201604.mp4",
      id: "1",
      name: "开玩笑的鸡毛",
      desc: "这里是简介内容",
    },
    {
      src: "http://127.0.0.1:5500/index_20230505201604.mp4",
      id: "2",
      name: "开玩笑的鸡毛",
      desc: "这里是简介内容",
    },
    {
      src: "http://127.0.0.1:5500/index_20230505201604.mp4",
      id: "3",
      name: "开玩笑的鸡毛",
      desc: "这里是简介内容",
    },
    {
      src: "http://127.0.0.1:5500/index_20230505201604.mp4",
      id: "4",
      name: "开玩笑的鸡毛",
      desc: "这里是简介内容",
    },
    {
      src: "http://127.0.0.1:5500/index_20230505201604.mp4",
      id: "5",
      name: "开玩笑的鸡毛",
      desc: "这里是简介内容",
    },
    {
      src: "http://127.0.0.1:5500/index_20230505201604.mp4",
      id: "6",
      name: "开玩笑的鸡毛",
      desc: "这里是简介内容",
    },
    {
      src: "http://127.0.0.1:5500/index_20230505201604.mp4",
      id: "7",
      name: "开玩笑的鸡毛",
      desc: "这里是简介内容",
    },
  ],
});

const loadMore = () => {
  // 触发加载更多
  console.log("加载更多");
};

const change = (e: any) => {
  state.cutVideo = e.detail;
  console.log("🚀 ~ file: index.vue:53 ~ change ~ data:", e);
};

// 播放第几个
const playIndex = (index: number) => {
  mTikTokRef.value?.initSwiperData(index);
};
onShow(() => {
  mTikTokRef.value.togglePlay();
});
onHide(() => {
  mTikTokRef.value.togglePlay(true);
});

onMounted(() => {
  getVideoList().then((res) => {
    console.log(res);
    if (res.code === 200) {
      state.videoList = res.data.map((e) => ({
        src: `${baseurl}/api/staticfiles/raw/${e.raw}`,
        id: e.id,
        name: e.title,
        desc: e.description,
      }));
      console.log(state.videoList);
    }
  });
  // 直接播放第3个
  // playIndex(3);
});
</script>
<style lang="scss">
$zIndex: 99;
page {
  height: 100%;
}
.video-layer {
  position: absolute;
  right: 12px;
  bottom: 120px;
  color: #fff;
}

.video-bottom-area {
  position: absolute;
  left: 20px;
  bottom: 160upx;
  z-index: 10000;
  opacity: 0;
  transition: all 250ms;
  z-index: 0;

  &.active {
    opacity: 1;
    z-index: $zIndex;
    transition-delay: 200ms;
  }

  .shop-name {
    color: #fff;
    margin-bottom: 6px;
  }

  .shop-card {
    width: 160px;
    color: #fff;
    border-radius: 4px;
  }
}

.video-side-right {
  position: absolute;
  right: 12px;
  bottom: 120px;
  z-index: 10000;
  color: #fff;
  opacity: 0;
  transition: all 250ms;
  z-index: 0;

  &.active {
    opacity: 1;
    z-index: $zIndex;
    transition-delay: 200ms;
  }

  .action-item {
    position: relative;
    margin-bottom: 20px;
    text-align: center;

    .shop-logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      clip-path: circle(50% at center);
    }

    .iconfont {
      display: block;
      font-size: 28px;
    }

    .action-item-text {
      display: block;
      font-size: 16upx;
    }

    .action-btn {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f60;

      .iconfont {
        font-size: 16px;
      }
    }
  }
  .action-item-cover-view {
    font-size: 22upx;
    margin-top: 5upx;
    margin-left: -8upx;
  }
  .action-item-user {
    width: 80upx;
    height: 80upx;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 70upx;
  }
  .action-icon {
    z-index: 10000;
    width: 70upx;
    height: 70upx;
  }
}
</style>
