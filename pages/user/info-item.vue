<template>
  <view class="edit-item">
    <!-- 基础头部组件 -->
    <BaseHeader @back="back">
      <!-- 中间插槽，用于显示标题 -->
      <template v-slot:center>
        <text v-if="type === 1" class="f16">修改名字</text>
        <text v-if="type === 2" class="f16">修改简介</text>
      </template>
      <!-- 右侧插槽，用于显示保存按钮 -->
      <template v-slot:right>
        <view>
          <!-- 保存按钮，样式根据是否修改过内容动态变化 -->
          <text
            class="f16"
            :class="isChanged ? 'save-yes' : 'save-no'"
            @click="save"
            >保存</text
          >
        </view>
      </template>
    </BaseHeader>
    <!-- 内容区域 -->
    <view class="content">
      <!-- 当type为1时，显示修改名字的界面 -->
      <view v-if="type === 1">
        <!-- 提示文字 -->
        <view class="notice">我的名字</view>
        <!-- 输入框容器 -->
        <view class="input-ctn" style="margin-bottom: 1px">
          <!-- 输入框 -->
          <input
            type="text"
            v-model="localUserinfo.nickname"
            placeholder="记得填写名字哦"
          />
          <!-- 清除输入按钮，当输入框不为空时显示 -->
          <image
            v-if="localUserinfo.nickname"
            style="transform: scale(2)"
            class="close"
            src="/static/img/icon/newicon/close-and-bg.png"
            alt=""
            @click="localUserinfo.nickname = ''"
          ></image>
        </view>
        <!-- 字数统计 -->
        <!-- <view class="num">{{ localUserinfo.nickname.length }}/20</view> -->
      </view>
      <!-- 当type为2时，显示修改简介的界面 -->
      <view class="l-row" v-if="type === 2">
        <!-- 提示文字 -->
        <view class="notice">个人简介</view>
        <!-- 文本框容器 -->
        <view class="textarea-ctn">
          <!-- 文本框 -->
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            v-model="localUserinfo.description"
            placeholder="你可以填写兴趣爱好、心情愿望，有趣的介绍能让被关注的概率变高噢！"
          ></textarea>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
//TODO 1、数据变了后，保存按钮变亮；2、数据变了，点返回，弹窗是否确认
import BaseHeader from "@/components/BaseHeader";
import {
  _hideLoading,
  _notice,
  _showLoading,
  _showSimpleConfirmDialog,
} from "@/utils";
import { cloneDeep } from "lodash";
import { computed, onMounted, reactive, ref, inject } from "vue";
import { onShow } from "@dcloudio/uni-app";

import { fetchUpdateUserInfo, getUserInfo } from "@/api/video";
defineOptions({
  name: "EditUserInfo",
});
const store = inject("store");
const props = defineProps({
  type: String,
});

const userinfo = computed(() => store.state.userinfo);
const type = Number(props.type);
const localUserinfo = ref({
  ...userinfo.value,
});
const isChanged = computed(() => {
  if (type.value === 1) if (!localUserinfo.value.nickname) return false;
  if (type.value === 2) if (!localUserinfo.value.description) return false;
  if (userinfo.value.nickname !== localUserinfo.value.nickname) return true;
  if (userinfo.value.description !== localUserinfo.value.description)
    return true;
});

onShow(() => {
  localUserinfo.value = { ...userinfo.value };
});

function back() {
  if (isChanged.value) {
    _showSimpleConfirmDialog("是否保存修改", save, router.back);
  } else {
    uni.navigateBack();
  }
}

async function save() {
  if (!isChanged.value) return;
  if (type.value === 1) {
    if (!localUserinfo.value.nickname) return _notice("名字不能为空");
  }
  _showLoading();
  try {
    let res = await fetchUpdateUserInfo({ ...localUserinfo.value });
    _hideLoading();

    if (res.code === 200) {
      uni.showToast({
        title: "保存成功",
        duration: 2000,
      });
      res = await getUserInfo(userinfo.value.id);
      if (res.code === 200) {
        store.commit("updateUserinfo", res.data);
      }

      uni.navigateBack();
    } else {
      uni.showToast({
        title: "保存失败",
        duration: 2000,
      });
    }
  } catch {
    _hideLoading();
    uni.showToast({
      title: "网络错误",
      type: "error",
      duration: 2000,
    });
  }
}
</script>

<style lang="less">
page {
  background-color: #151724;
}
.edit-item {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;

  .save-yes {
    color: #fc2f56;
  }

  .save-no {
    color: #fc2f5680;
  }

  .content {
    padding: 40upx;
    margin-top: 140upx;

    .notice,
    .num {
      font-size: 12px;
      color: #bababb;
    }

    .input-ctn {
      position: relative;
      border-bottom: 1px solid #252d42;
      display: flex;
      align-items: center;

      input {
        margin: 5px 0;
        color: white;
        height: 30px;
        width: 100%;
        outline: none;
        border: none;
        background: transparent;

        &::placeholder {
          color: #bababb;
        }
      }

      .close {
        position: absolute;
        right: 0;
        top: 15px;
        width: 20upx;
        height: 20upx;
      }
    }

    .textarea-ctn {
      width: 100%;
      background: #1f2534;
      padding: 15px;
      box-sizing: border-box;
      margin-top: 10px;
      border-radius: 2px;

      textarea {
        font-family: "Microsoft YaHei UI";
        outline: none;
        width: 100%;
        border: none;
        background: transparent;
        color: white;

        &::placeholder {
          color: #bababb;
        }
      }
    }
  }
}
</style>
