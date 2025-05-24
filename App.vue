<script>
import { getUserInfo } from "@/api/video";

export default {
  inject: ["store"],
  onLaunch: function () {
    const token = uni.getStorageSync("token");
    const userId = uni.getStorageSync("userId");
    if (token) {
      getUserInfo(userId).then((res) => {
        if (res.code === 200) {
          this.store.commit("updateUserinfo", res.data);
        }
      });
    }
    const statusHeight = uni.getSystemInfoSync().statusBarHeight;
    this.store.commit("updateStatusHeight", statusHeight);
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
    graceNumber(number) {
      if (number == 0) {
        return "0";
      } else if (number > 999 && number <= 9999) {
        return (number / 1000).toFixed(1) + "k";
      } else if (number > 9999 && number <= 99999) {
        return (number / 10000).toFixed(1) + "w";
      } else if (number > 99999) {
        return "10w+";
      }
      return number;
    },
  },
};
</script>

<style>
/*每个页面公共css */
</style>
