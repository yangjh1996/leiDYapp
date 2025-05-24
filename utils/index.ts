import { baseurl } from "../api/requestUtil";

export function _formatNumber(num) {
  if (!num) return;
  if (num > 100000000) {
    return (num / 100000000).toFixed(1) + "亿";
  } else if (num > 10000) {
    return (num / 10000).toFixed(1) + "万";
  } else {
    return num;
  }
}

export function _checkImgUrl(url) {
  // console.log(url)
  if(!url) return
  //本地图片
  if (
    url.includes("assets/img") ||
    url.includes("file://") ||
    url.includes("data:image") ||
    url.includes("http") ||
    url.includes("https")
  ) {
    return url;
  }
  return `${baseurl}/api/staticfiles/image/${url}`;
}

export const _hideLoading = () => uni.hideLoading();
export const _notice = (title: string) =>
  uni.showToast({
    title: title,
    icon: "none",
  });

export const _showLoading = () =>
  uni.showLoading({
    title: "",
    mask: false,
  });

export const _showSimpleConfirmDialog = (
  content,
  handleSuccess,
  handleCancel
) =>
  uni.showModal({
    content,
    success: (res) => {
      if (res.confirm) {
        handleSuccess();
      } else if (res.cancel) {
        handleCancel();
      }
    },
  });

export const getAvatar = (url) => {
  if (!url) return "/static/img/avatar/28.png";
  return `${baseurl}/api/staticfiles/avatar/${url}`;
};
