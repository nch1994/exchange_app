import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations
})

export default store

