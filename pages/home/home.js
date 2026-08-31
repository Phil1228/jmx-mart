const BRANDS = [
  { brand: '丰田', name: '凯美瑞 2024款 2.0L', price: 15.8, img: '/pages/home/images/car_ph_red.png' },
  { brand: '本田', name: '雅阁 锐·T动', price: 16.2, img: '/pages/home/images/car_ph_blue.png' },
  { brand: '比亚迪', name: '汉EV 冠军版', price: 18.9, img: '/pages/home/images/car_ph_green.png' },
  { brand: '大众', name: '帕萨特 330TSI', price: 17.5, img: '/pages/home/images/car_ph_black.png' },
  { brand: '日产', name: '天籁 2.0L', price: 14.6, img: '/pages/home/images/car_ph_orange.png' },
  { brand: '特斯拉', name: 'Model 3 后驱', price: 23.2, img: '/pages/home/images/car_ph_red.png' },
  { brand: '丰田', name: '卡罗拉 双擎', price: 11.8, img: '/pages/home/images/car_ph_blue.png' },
  { brand: '本田', name: 'CR-V 两驱', price: 18.6, img: '/pages/home/images/car_ph_green.png' },
  { brand: '比亚迪', name: '秦PLUS DM-i', price: 9.8, img: '/pages/home/images/car_ph_black.png' },
  { brand: '大众', name: '朗逸 1.5L', price: 10.2, img: '/pages/home/images/car_ph_orange.png' },
  { brand: '吉利', name: '星越L 2.0T', price: 13.7, img: '/pages/home/images/car_ph_red.png' },
  { brand: '吉利', name: '帝豪 第4代', price: 7.9, img: '/pages/home/images/car_ph_blue.png' },
  { brand: '比亚迪', name: '宋PLUS DM-i', price: 14.9, img: '/pages/home/images/car_ph_green.png' },
  { brand: '比亚迪', name: '唐EV 纯电', price: 21.9, img: '/pages/home/images/car_ph_black.png' },
  { brand: '比亚迪', name: '海豚 时尚版', price: 10.5, img: '/pages/home/images/car_ph_orange.png' },
  { brand: '比亚迪', name: '元PLUS 510KM', price: 12.8, img: '/pages/home/images/car_ph_red.png' },
  { brand: '日产', name: '轩逸 经典版', price: 9.6, img: '/pages/home/images/car_ph_blue.png' },
  { brand: '日产', name: '逍客 豪华版', price: 15.2, img: '/pages/home/images/car_ph_green.png' },
  { brand: '日产', name: '奇骏 四驱', price: 18.9, img: '/pages/home/images/car_ph_black.png' },
  { brand: '吉利', name: '博越L 1.5T', price: 11.9, img: '/pages/home/images/car_ph_orange.png' },
  { brand: '吉利', name: '缤越 COOL', price: 8.9, img: '/pages/home/images/car_ph_red.png' },
  { brand: '吉利', name: '几何A 430KM', price: 12.9, img: '/pages/home/images/car_ph_blue.png' },
];
const WH_LIST = ['南沙', '新疆', '比什凯克'];
const BRAND_LIST = [
  { key: '吉利', logo: '/pages/home/images/brands/geely.png' },
  { key: '比亚迪', logo: '/pages/home/images/brands/byd.png' },
  { key: '丰田', logo: '/pages/home/images/brands/toyota.png' },
  { key: '日产', logo: '/pages/home/images/brands/nissan.png' },
];
// 搜索表单：按品牌提取车型（去重）
const MODELS_BY_BRAND = (() => {
  const m = {};
  BRANDS.forEach((b) => { (m[b.brand] = m[b.brand] || new Set()).add(b.name); });
  Object.keys(m).forEach((k) => { m[k] = [...m[k]]; });
  return m;
})();
const PRICE_LIST = [
  { key: '0-5', label: '5万以下', min: 0, max: 5 },
  { key: '5-10', label: '5-10万', min: 5, max: 10 },
  { key: '10-20', label: '10-20万', min: 10, max: 20 },
  { key: '20+', label: '20万以上', min: 20, max: 999 },
];

// 预生成 2 万条全量车源数据（一次性，页面加载完成即可查询/筛选）
const ALL = (() => {
  const list = [];
  const N = 20000;
  for (let i = 0; i < N; i++) {
    const b = BRANDS[i % BRANDS.length];
    const warehouse = WH_LIST[i % WH_LIST.length];
    // 同车型在同仓多台时给个序号，模拟库存多台
    list.push({
      id: i + 1,
      brand: b.brand,
      name: b.name,
      price: b.price,
      img: b.img,
      warehouse,
      vin: 'VIN' + (100000 + i),
    });
  }
  return list;
})();

Page({
  data: {
    statusBarHeight: 20,
    currentWh: '南沙',
    whShow: false,
    whList: WH_LIST,
    currentBrand: '',
    brandList: BRAND_LIST,
    goodsList: [],
    page: 0,
    pageSize: 10,
    loading: false,
    noMore: false,
    // 搜索表单
    searchShow: false,
    selBrand: '',
    selModel: '',
    modelList: [],
    priceList: PRICE_LIST,
    selPrice: '',
    // 已应用搜索条件（用于搜索框下方标签）
    appliedBrand: '',
    appliedModel: '',
    appliedPrice: '',
    appliedPriceLabel: '',
  },

  onLoad() {
    const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sys.statusBarHeight || 20 });
    this.loadGoods(true);
  },

  // 从全量 ALL 中按仓库+品牌+车型+价格筛选后分页，同步返回（无模拟延迟）
  filteredAll() {
    const wh = this.data.currentWh;
    const brand = this.data.currentBrand;
    const model = this.data.appliedModel;
    const price = this.data.appliedPrice ? PRICE_LIST.find((p) => p.key === this.data.appliedPrice) : null;
    return ALL.filter((x) => {
      if (x.warehouse !== wh) return false;
      if (brand && x.brand !== brand) return false;
      if (model && x.name !== model) return false;
      if (price && (x.price < price.min || x.price >= price.max)) return false;
      return true;
    });
  },

  loadGoods(reset) {
    if (this.data.loading) return;
    if (!reset && this.data.noMore) return;
    const src = this.filteredAll();
    const { page, pageSize, goodsList } = this.data;
    const start = reset ? 0 : page * pageSize;
    const slice = src.slice(start, start + pageSize);
    const next = reset ? slice : goodsList.concat(slice);
    const noMore = start + pageSize >= src.length;
    this.setData({
      goodsList: next,
      page: reset ? 1 : page + 1,
      loading: false,
      noMore,
    });
  },

  onReachBottom() {
    this.loadGoods(false);
  },

  openWh() { this.setData({ whShow: true }); },
  closeWh() { this.setData({ whShow: false }); },
  noop() {},
  pickWh(e) {
    const w = e.currentTarget.dataset.w;
    this.setData({ currentWh: w, whShow: false, page: 0, noMore: false });
    this.loadGoods(true);
  },

  pickBrand(e) {
    const b = e.currentTarget.dataset.b;
    const current = this.data.currentBrand;
    this.setData({ currentBrand: current === b ? '' : b, page: 0, noMore: false });
    this.loadGoods(true);
  },

  goSearch() {
    // 打开搜索表单，初始化临时选择
    this.setData({
      searchShow: true,
      selBrand: this.data.appliedBrand,
      selModel: this.data.appliedModel,
      modelList: this.data.appliedBrand ? (MODELS_BY_BRAND[this.data.appliedBrand] || []) : [],
      selPrice: this.data.appliedPrice,
    });
  },
  closeSearch() { this.setData({ searchShow: false }); },
  selBrand(e) {
    const b = e.currentTarget.dataset.b;
    const modelList = MODELS_BY_BRAND[b] || [];
    this.setData({ selBrand: b, selModel: '', modelList });
  },
  selModel(e) {
    const m = e.currentTarget.dataset.m;
    this.setData({ selModel: this.data.selModel === m ? '' : m });
  },
  selPrice(e) {
    const k = e.currentTarget.dataset.k;
    this.setData({ selPrice: this.data.selPrice === k ? '' : k });
  },
  applySearch() {
    const priceLabel = this.data.selPrice ? (PRICE_LIST.find((p) => p.key === this.data.selPrice) || {}).label : '';
    this.setData({
      searchShow: false,
      appliedBrand: this.data.selBrand,
      appliedModel: this.data.selModel,
      appliedPrice: this.data.selPrice,
      appliedPriceLabel: priceLabel,
      page: 0,
      noMore: false,
    });
    this.loadGoods(true);
  },
  clearSearch() {
    this.setData({
      appliedBrand: '', appliedModel: '', appliedPrice: '',
      currentBrand: '', page: 0, noMore: false,
    });
    this.loadGoods(true);
  },
  goCategory(e) { wx.showToast({ title: '分类页待开发', icon: 'none' }); },
  goActivity() { wx.showToast({ title: '活动页待开发', icon: 'none' }); },
  goGoods(e) {
    const b = e.currentTarget.dataset.b;
    const n = e.currentTarget.dataset.n;
    wx.navigateTo({ url: `/pages/detail/detail?brand=${encodeURIComponent(b)}&name=${encodeURIComponent(n)}` });
  },
});
