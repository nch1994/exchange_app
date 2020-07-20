import Vue from 'vue';
import Router from 'vue-router';
import MainHasTab from 'page/basePage/MainHasTab/index.vue';

Vue.use(Router);

export const baseRouter = [
  {
    path: '/',
    redirect: '/index',
    component: MainHasTab,
    children: [
      {
        path: '/index',
        name: 'index',
        meta: {
        },
        component: resolve =>
          require(['page/index/index.vue'], resolve)
      },
      {
        path: '/option',
        name: 'option',
        meta: {
        },
        component: resolve =>
          require(['page/option/index.vue'], resolve)
      },
      {
        path: '/community',
        name: 'community',
        meta: {
        },
        component: resolve =>
          require(['page/community/index.vue'], resolve)
      },
      {
        path: '/contract',
        name: 'contract',
        meta: {
        },
        component: resolve =>
          require(['page/contract/index.vue'], resolve)
      },
      {
        path: '/mine',
        name: 'mine',
        component: resolve =>
          require(['page/mine/index.vue'], resolve)
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
    },
    component: resolve =>
      require(['page/login.vue'], resolve)
  },
  {
    path: '/forget',
    name: 'Forget',
    meta: {
    },
    component: resolve =>
      require(['page/forget.vue'], resolve)
  },
  {
    path: '/verify',
    name: 'Verify',
    meta: {
    },
    component: resolve =>
      require(['page/verify.vue'], resolve)
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
    },
    component: resolve =>
      require(['page/register.vue'], resolve)
  },
  // 安全中心
  {
    path: '/safe',
    name: 'Safe',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/safe/index.vue'], resolve)
  },
  {
    path: '/safe/email',
    name: 'Binding',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/safe/email.vue'], resolve)
  },
  {
    path: '/safe/phone',
    name: 'Binding',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/safe/phone.vue'], resolve)
  },
  {
    path: '/safe/identity',
    name: 'Identity',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/safe/identity/index.vue'], resolve)
  },
  {
    path: '/safe/identity/photo',
    name: 'Photo',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/safe/identity/photo.vue'], resolve)
  },
  {
    path: '/google',
    name: 'Google',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/google.vue'], resolve)
  },
  {
    path: '/safe/fundpwd',
    name: 'Fundpwd',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/safe/fundpwd.vue'], resolve)
  },
  {
    path: '/log',
    name: 'Log',
    component: resolve =>
      require(['page/log.vue'], resolve)
  },
  // 地址管理
  {
    path: '/address',
    name: 'Address',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/address/index.vue'], resolve)
  },
  {
    path: '/address/list',
    name: 'List',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/address/list.vue'], resolve)
  },
  {
    path: '/address/add',
    name: 'Add',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/address/add.vue'], resolve)
  },
  // 资产
  {
    path: '/asset',
    name: 'asset',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/asset/index.vue'], resolve)
  },
  {
    path: '/asset/chooseCoin/:type',
    name: 'chooseCoin',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/asset/chooseCoin.vue'], resolve)
  },
  {
    path: '/asset/chooseCont/:type',
    name: 'chooseCont',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/asset/chooseCont.vue'], resolve)
  },
  {
    path: '/asset/charge/:index',
    name: 'Charge',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/asset/charge.vue'], resolve)
  },
  {
    path: '/asset/details',
    name: 'Details',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/asset/assetsDetails.vue'], resolve)
  },
  {
    path: '/asset/funds/:name',
    name: 'fundsDetails',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/asset/fundsDetails.vue'], resolve)
  },
  {
    path: '/asset/funds/record/:id',
    name: 'fundsRecordDetails',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/asset/fundsRecordDetails.vue'], resolve)
  },
  {
    path: '/asset/option/:name',
    name: 'optionsDetails',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/asset/optionDetails.vue'], resolve)
  },
  {
    path: '/asset/withdraw/:index',
    name: 'Withdraw',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/asset/withdraw.vue'], resolve)
  },
  {
    path: '/asset/withdrawSuccess',
    name: 'withdrawSuccess',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/asset/withdrawSuccess.vue'], resolve)
  },
  {
    path: '/asset/transfer/:transfer',
    name: 'AssetTransfer',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/asset/transfer.vue'], resolve)
  },
  {
    path: '/contract/record/:contractIdx',
    name: 'assetRecord',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/contract/record.vue'], resolve)
  },
  // 我的
  {
    path: '/mine/share',
    name: 'Share',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/mine/share.vue'], resolve)
  },
  {
    path: '/mine/user',
    name: 'User',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/mine/user.vue'], resolve)
  },
  {
    path: '/mine/fenxiao',
    name: 'Fenxiao',
    meta: {
      requireAuth: true,
    },
    component: resolve =>
      require(['page/mine/fenxiao.vue'], resolve)
  },
  {
    path: '/mine/help',
    name: 'Help',
    component: resolve =>
      require(['page/mine/help.vue'], resolve)
  },
  {
    path: '/mine/helpDetails',
    name: 'HelpDetails',
    component: resolve =>
      require(['page/mine/helpDetails.vue'], resolve)
  },
  {
    path: '/mine/setting',
    name: 'Setting',
    meta: {
    },
    component: resolve =>
      require(['page/mine/setting.vue'], resolve)
  },
  // k线图
  {
    path: '/trading',
    name: 'Trading',
    meta: {
    },
    component: resolve =>
      require(['page/trading/index.vue'], resolve)
  },
  // 公告
  {
    path: '/notice',
    name: 'Notice',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/notice/index.vue'], resolve)
  },
  // 社区
  {
    path: '/community/search',
    name: 'Search',
    meta: {
    },
    component: resolve =>
      require(['page/community/search.vue'], resolve)
  },
  {
    path: '/leader',
    name: 'Leader',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/leader/index.vue'], resolve)
  },
  {
    path: '/trader',
    name: 'Trader',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/trader/index.vue'], resolve)
  },
  {
    path: '/follow',
    name: 'Follow',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/follow/index.vue'], resolve)
  },
  {
    path: '/follow/setting',
    name: 'FollowSetting',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/follow/setting.vue'], resolve)
  },
  {
    path: '/option/record/:name',
    name: 'optionRecord',
    meta: {
      requireAuth: true
    },
    component: resolve =>
      require(['page/option/record.vue'], resolve)
  },
  {
    path: "/404",
    name: "notFound",
    component: resolve =>
      require(['page/404.vue'], resolve)
  },
  {
    path: "*", // 此处需特别注意置于最底部
    redirect: "/404"
  }
];

export default new Router({
  mode: 'history',
  routes: baseRouter,
});
