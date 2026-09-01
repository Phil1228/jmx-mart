const app = getApp();
Page({
  data: { logged: false, avatar: '', nickname: '' },
  onShow() {
    const u = app.globalData.userInfo || {};
    this.setData({ logged: !!u.nickname, avatar: u.avatar || '', nickname: u.nickname || '' });
  },
  login() {
    wx.getUserProfile({ desc: '完善资料', success: r => {
      const info = { avatar: r.userInfo.avatarUrl, nickname: r.userInfo.nickName };
      app.globalData.userInfo = info;
      this.setData({ logged: true, ...info });
      wx.showToast({ title: '登录成功', icon: 'success' });
    }, fail: () => {
      const info = { avatar: '/pages/home/images/logo.png', nickname: '用户' + Math.floor(Math.random()*9000+1000) };
      app.globalData.userInfo = info;
      this.setData({ logged: true, ...info });
    } });
  },
  logout() { app.globalData.userInfo = null; this.setData({ logged: false, avatar: '', nickname: '' }); wx.showToast({ title: '已退出登录' }); },
  guard() {
    if (this.data.logged) return true;
    wx.showModal({ title: '请先登录', content: '该功能需要登录后使用', confirmText: '去登录',
      success: r => { if (r.confirm) this.login(); } });
    return false;
  },
  goOrder()        { if (this.guard()) wx.navigateTo({ url: '/pages/uc/order' }); },
  goApply()        { if (this.guard()) wx.navigateTo({ url: '/pages/uc/apply' }); },
  goWelfare()      { if (this.guard()) wx.navigateTo({ url: '/pages/uc/welfare' }); },
  goBooking()      { if (this.guard()) wx.navigateTo({ url: '/pages/uc/booking' }); },
  goAgent()        { wx.navigateTo({ url: '/pages/uc/agent' }); },
  goBind()         { if (this.guard()) wx.navigateTo({ url: '/pages/uc/bind' }); },
  goPrivacy()      { wx.navigateTo({ url: '/pages/uc/privacy' }); },
});
