<template>
  <view class="edit">
    <BaseHeader @back="back">
      <!-- 中间插槽，用于显示标题 -->
      <template v-slot:center>
        <text class="f16">编辑资料</text>
      </template>
      <!-- 右侧插槽，用于显示保存按钮 -->
    </BaseHeader>
    <view class="userinfo">
      <view class="change-avatar">
        <view class="avatar-ctn" @click="handleUploadAvatar">
          <image
            class="avatar"
            :src="getAvatar(userinfo.avatar)"
            mode="aspectFill"
          ></image>
          <image
            class="change"
            src="/static/img/icon/me/camera-light.png"
            mode="aspectFit"
          ></image>
        </view>
        <text>点击更换头像</text>
      </view>
      <view class="row" @click="nav('/pages/user/info-item', { type: 1 })">
        <view class="left">名字</view>
        <view class="right">
          <text>{{ isEmpty(userinfo.nickname) }}</text>
          <image
            src="/static/img/icon/components/light-back.png"
            class="icon-next"
            mode="aspectFit"
          ></image>
        </view>
      </view>
      <view class="row" @click="nav('/pages/user/info-item', { type: 2 })">
        <view class="left">简介</view>
        <view class="right">
          <text>{{ isEmpty(userinfo.description) }}</text>
          <image
            src="/static/img/icon/components/light-back.png"
            class="icon-next"
            mode="aspectFit"
          ></image>
        </view>
      </view>
      <!-- <view class="row" @click="showSexDialog">
        <view class="left">性别</view>
        <view class="right">
          <picker @change="bindPickerChange" :value="sex" :range="sexs">
            <text>{{ sexs[sex] }}</text>
          </picker>
          <image
            src="/static/img/icon/components/light-back.png"
            class="icon-next"
            mode="aspectFit"
          ></image>
        </view>
      </view>
      <view class="row" @click="showBirthdayDialog">
        <view class="left">生日</view>
        <view class="right">
          <view v-if="date">
            <picker
              mode="date"
              :value="date"
              :start="startDate"
              :end="endDate"
              @change="bindDateChange"
            >
              <view class="uni-input">{{ date }}</view>
            </picker>
            <image
              src="/static/img/icon/components/light-back.png"
              class="icon-next"
              mode="aspectFit"
            ></image>
          </view>
          <view v-else>
            <text>未设置</text>
            <image
              src="/static/img/icon/components/light-back.png"
              class="icon-next"
              mode="aspectFit"
            ></image>
          </view>
        </view>
      </view> -->
    </view>
  </view>
</template>
<script setup>
import BaseHeader from "@/components/BaseHeader";
import { baseurl } from "@/api/requestUtil";
import { getUserInfo } from "@/api/video";
import { getAvatar } from "@/utils";
import { computed, reactive, ref, inject } from "vue";
const store = inject("store");

const userinfo = computed(() => store.state.userinfo);
defineOptions({
  name: "EditUserInfo",
});
const data = reactive({
  sexList: [
    { id: 1, name: "男" },
    { id: 2, name: "女" },
    { id: 3, name: "不展示" },
  ],
  avatarList: [
    { id: 1, name: "拍一张" },
    { id: 2, name: "从相册选择" },
    { id: 3, name: "查看大图" },
    { id: 4, name: "取消" },
  ],
  previewImg: "",
});
const sexs = ["男", "女"];
const sex = ref(0);
const bindPickerChange = () => {
  this.sex.value = e.detail.value;
};
const nav = (url, param) => {
  uni.navigateTo({
    url: `${url}?type=${param.type}`,
  });
};

function back() {
  uni.navigateBack()();
}
function isEmpty(val) {
  if (val && val !== -1) return val;
  return "点击设置";
}
function getDate(type) {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (type === "start") {
    year = year - 60;
  } else if (type === "end") {
    year = year + 2;
  }
  month = month > 9 ? month : "0" + month;
  day = day > 9 ? day : "0" + day;
  return `${year}-${month}-${day}`;
}
const date = ref(getDate({ format: true }));

const bindDateChange = function (e) {
  this.date.value = e.detail.value;
};

const startDate = getDate("start");
const endDate = getDate("end");

const handleUploadAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      uni.uploadFile({
        url: `${baseurl}/api/user/updateAvatar?id=${userinfo.value.id}`, // 上传接口地址
        filePath: res.tempFiles[0].path,

        header: {
          Token: uni.getStorageSync("token"), // 自定义请求头，例如添加授权信息
        },
        name: "avatarFile", // 服务器接收文件的字段名
        success: (uploadRes) => {
          getUserInfo(userinfo.value.id).then((res) => {
            if (res.code === 200) {
              store.commit("updateUserinfo", res.data);
            }
          });
        },
        fail: (err) => {},
      });
    },
  });
};
</script>

<style lang="less">
page {
  background-color: #151724;
}
.edit {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: auto;
  font-size: 14px;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;

  .sub {
    color: #bababb;
  }
}

.preview-img {
  z-index: 9;
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

.userinfo {
  padding-top: 160upx;
  color: white;

  .change-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 30px 0;

    .avatar-ctn {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      width: 80px;
      height: 80px;

      .avatar {
        opacity: 0.5;
        position: absolute;
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }

      .change {
        width: 28px;
        height: 28px;

        z-index: 9;
        position: relative;
      }
    }
  }
  uni-picker {
    display: inline-block;
  }
}

.change-dialog {
  z-index: 10;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000000bb;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    background: white;
    width: 80%;
    padding: 5px 0;
    border-radius: 2px;
    box-sizing: border-box;

    .item {
      font-size: 15px;
      padding: 15px 20px;
      transition: all 0.2s;

      &:active {
        background: darkgray;
      }
    }
  }
}

.row {
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  font-size: 14px;

  &.no-active {
    &:active {
      background: #151724;
    }
  }

  &.active {
    &:active {
      background: #1f2534;
    }
  }

  &.no-padding {
    padding: 0;
  }

  &.border {
    border-bottom: 1px solid #252d42;
  }

  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    img {
      margin-right: 10px;
      width: 15px;
    }
  }

  .right {
    max-width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #bababb;

    img {
      margin-left: 5px;
      width: 20px;
    }
  }
  .icon-next {
    transform: rotate(180deg);
    width: 36upx;
    height: 36upx;
    margin-left: 10upx;
  }
}
</style>
