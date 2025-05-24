<template>
  <view class="container">
    <!-- 页面顶部 -->
    <view class="header" :style="{ paddingTop: statusHeight }">
      <view class="close-button" @click="handleClose">×</view>
      <!-- <view class="help" @click="showHelp">帮助</view> -->
    </view>

    <!-- 中央提示信息 -->
    <view class="main-content">
      <text class="title">登录账号</text>
    </view>

    <view>
      <!-- 用户名输入 -->
      <view class="input-section">
        <text class="input-label">用户名</text>
        <input
          class="input-field"
          v-model="username"
          placeholder="请输入用户名"
        />
      </view>

      <!-- 密码输入 -->
      <view class="input-section">
        <text class="input-label">密码</text>
        <input
          class="input-field"
          v-model="password"
          type="password"
          placeholder="请输入密码"
        />
      </view>
    </view>

    <!-- 登录按钮 -->
    <button
      class="login-button"
      @click="handleLogin"
      :disabled="!agreed || !username || !password"
    >
      登录
    </button>
    <view class="register-link" @click="goRegister">去注册</view>
    <!-- 底部协议同意 -->
    <view class="agreement">
      <checkbox
        class="checkbox"
        :checked="agreed"
        @click="toggleAgreement"
      ></checkbox>
      <text class="agreement-text">
        已阅读并同意
        <text class="agreement-link" @click.stop="openUserAgreement"
          >用户协议</text
        >
        和
        <text class="agreement-link" @click.stop="openPrivacyPolicy"
          >隐私政策</text
        >
        同时登录并使用抖音X其关联产品相关服务
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, inject,computed } from "vue";
import { fetchLogin } from "@/api/video";
const store = inject("store");
// 用户名和密码
const username = ref("");
const password = ref("");

const statusHeight = computed(() => store.state.statusHeight + "px");
// 协议同意状态
const agreed = ref(true);

// 切换协议同意状态
const toggleAgreement = (e) => {
  agreed.value = !agreed.value;
};

const handleClose = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};

const goRegister = () => uni.navigateTo({url: '/pages/login/register'})
// 处理登录
const handleLogin = async () => {
  if (!agreed.value) {
    uni.showToast({
      title: "请先同意相关协议",
      icon: "none",
    });
    return;
  }

  if (!username.value || !password.value) {
    uni.showToast({
      title: "请输入用户名和密码",
      icon: "none",
    });
    return;
  }

  // 这里可以添加实际的登录逻辑，例如调用后端API
  uni.showToast({
    title: "登录中...",
    icon: "loading",
  });
  try {
    const res = await fetchLogin(username.value, password.value);
    if (res.code === 200) {
      store.commit("updateUserinfo", res.data);
      // 模拟登录过程
      uni.setStorageSync("token", res.data.token)
      uni.setStorageSync("userId", res.data.id)
      uni.showToast({
        title: "登录成功",
        icon: "success",
      });
      // 登录成功后的跳转或其他操作
      uni.switchTab({ url: "/pages/user/user" });
    } else {
      uni.showToast({
        title: res.msg,
        icon: "error",
      });
    }
  } catch (e) {
    uni.showToast({
      title: "网络错误",
      icon: "error",
    });
  }
};

// 打开用户协议
const openUserAgreement = () => {
  uni.showToast({
    title: "打开用户协议",
    icon: "none",
  });
  // 实际应用中应该打开相应的页面或弹窗
};

// 打开隐私政策
const openPrivacyPolicy = () => {
  uni.showToast({
    title: "打开隐私政策",
    icon: "none",
  });
  // 实际应用中应该打开相应的页面或弹窗
};
</script>

<style scoped>
.container {
  background-color: white;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  font-size: 24px;
  font-weight: bold;
}

.help {
  font-size: 26upx;
  color: #333;
}

.main-content {
  margin-top: 50upx;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.input-section {
  width: 100%;
  margin-top: 20upx;
  display: flex;
  flex-direction: column;
}

.input-label {
  margin-bottom: 10upx;
  font-size: 14px;
  color: #666;
}

.input-field {
  width: 100%;
  padding: 15upx;
  border: 1px solid #ddd;
  border-radius: 10upx;
  font-size: 14px;
}

.login-button {
  width: 400upx;
  background-color: #ff4d4f;
  color: white;
  border-radius: 25px;
  padding: 15upx 0;
  font-size: 28upx;
  margin-top: 50upx;
  border: none;
}

.login-button:disabled {
  background-color: #ccc;
  opacity: 0.7;
}

.agreement {
  display: flex;
  align-items: center;
  margin-top: 30px;
  font-size: 12px;
  color: #666;
}

.checkbox {
  margin-right: 5px;
  transform: scale(0.8);
}

.agreement-text {
  flex: 1;
}

.agreement-link {
  color: #007bff;
  text-decoration: underline;
}

.register-link {
  color:#666;
  text-decoration: underline;
}
/* 适配不同屏幕尺寸 */
@media (max-width: 320px) {
  .title {
    font-size: 20px;
  }

  .login-button {
    padding: 12px 0;
  }
}
</style>
