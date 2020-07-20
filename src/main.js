/*
 * The Vue build version to load with the `import` command
 * (runtime-only or standalone) has been set in webpack.base.conf with an alias.
 */

/* eslint-disable */

import Vue from 'vue';
import App from './App';
import router from './router';

// 状态管理工具
import store from "store";

// JS 工具库

// 路由拦截器
import "@/router-permission";

// 主样式文件
import "@/less/main.less";
import "common/font/font.css";
import 'vant/lib/index.css';

// 设置title
import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle);

Vue.config.productionTip = false;

// i18n
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);
import zh from '@/locales/cn.json'
import en from '@/locales/en.json'

const messages = {
  'zh': zh, // 中文语言包
  'en': en // 英文语言包
}
const i18n = new VueI18n({
  // 从本地存储中取，如果没有默认为中文，
  // 这样可以解决切换语言后，没记住选择的语言，刷新页面后还是默认的语言
  locale: localStorage.getItem('lang') || 'zh',
  messages: messages,
  silentTranslationWarn: true
})

import { Toast, ActionSheet, Switch, SwitchCell, Slider, Loading, Dialog, Pagination, PullRefresh, Stepper, Popup, Search, List, DropdownMenu, DropdownItem, Overlay, NoticeBar, CountDown } from 'vant';
Vue.use(Toast).use(ActionSheet).use(Switch).use(SwitchCell).use(Slider).use(Loading).use(Dialog).use(Pagination).use(PullRefresh).use(Stepper).use(Popup).use(Search).use(List).use(DropdownMenu).use(DropdownItem).use(Overlay).use(NoticeBar).use(CountDown);

// 复制

import clipboard from 'clipboard';
Vue.prototype.clipboard = clipboard;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>',
})
