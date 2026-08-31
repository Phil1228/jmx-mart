const PRAISE_POOL = [
  '油耗低', '舒适性不错', '加速强劲', '配置高', '后排空间足够',
  '内饰材质好', '方向盘轻重合理', '车身时尚', '底盘调校好',
  '隔音出色', '性价比高', '操控精准',
];
const GUIDE_RANGE = {
  '丰田': '11.98-20.68万 / 紧凑型车', '本田': '12.99-21.59万 / 紧凑型车',
  '比亚迪': '9.98-24.98万 / 新能源', '吉利': '7.99-17.49万 / 紧凑型车',
  '日产': '11.59-17.49万 / 紧凑型车', '大众': '10.29-19.99万 / 紧凑型车',
  '特斯拉': '25.99-33.59万 / 中型车',
};
const VERSION_TPL = [
  { name: '2024款 1.5L 豪华型', drop: '限时立降 3.2 万', guide: '12.99万' },
  { name: '2024款 1.5T 尊贵型', drop: '限时立降 3.5 万', guide: '14.99万' },
  { name: '2024款 2.0L 旗舰型', drop: '限时立降 3.8 万', guide: '16.99万' },
];

function pick(arr, n) {
  const a = arr.slice();
  const out = [];
  while (out.length < n && a.length) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
  return out;
}

Page({
  data: {
    statusBarHeight: 20,
    swipeIndex: 0,
    brand: '',
    name: '',
    slogan: '',
    guide: '',
    imgs: [],
    praises: [],
    versions: [],
  },

  onLoad(q) {
    const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const brand = decodeURIComponent(q.brand || '丰田');
    const name = decodeURIComponent(q.name || '热销车型');
    const colors = ['car_ph_red', 'car_ph_blue', 'car_ph_green', 'car_ph_black', 'car_ph_orange'];
    const imgs = pick(colors, 6).map((c) => `/pages/home/images/${c}.png`).concat(['/pages/home/images/car_new.png']);
    const drop = (3 + Math.random()).toFixed(1);
    this.setData({
      statusBarHeight: sys.statusBarHeight || 20,
      brand,
      name,
      slogan: `限时立降 ${drop} 万`,
      guide: GUIDE_RANGE[brand] || '9.99-19.99万 / 紧凑型车',
      imgs,
      praises: pick(PRAISE_POOL, 8),
      versions: VERSION_TPL.map((v) => ({ ...v })),
    });
  },

  onSwipe(e) { this.setData({ swipeIndex: e.detail.current }); },
  goBack() { wx.navigateBack({ delta: 1 }); },
  todo() { wx.showToast({ title: '功能待开发', icon: 'none' }); },
});
