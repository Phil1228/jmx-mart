import updateManager from './common/updateManager';

App({
  globalData: {
    userInfo: null, // { avatar, nickname }
  },
  onLaunch: function () {},
  onShow: function () {
    updateManager();
  },
});
