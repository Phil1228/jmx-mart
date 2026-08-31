Component({
  data: {
    selected: 0,
  },
  pageLifetimes: {
    show() {
      const pages = getCurrentPages();
      const cur = pages[pages.length - 1];
      const path = '/' + cur.route;
      const map = {
        '/pages/home/home': 0,
        '/pages/activity/activity': 1,
        '/pages/used/used': 2,
        '/pages/usercenter/index': 3,
      };
      this.setData({ selected: map[path] ?? 0 });
    },
  },
  methods: {
    switchTab(e) {
      const path = e.currentTarget.dataset.path;
      wx.switchTab({ url: path });
    },
  },
});
