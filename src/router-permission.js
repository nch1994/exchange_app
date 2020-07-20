import router from 'router';
import { getCookie, decryptByDES } from '@/utils/utils';
import store from "store";
router.beforeEach((to, from, next) => {
  if (to.matched.some(function (item) {
    return item.meta.requireAuth
  })) {
    const userId = decryptByDES(getCookie('token')) || '';
    userId === '' ? next('/login') : next();
  } else {
    store.commit('clearToken')// 取消请求
    next()
  }
});
router.afterEach(() => {
  // todo
});
