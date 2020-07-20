<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('mine.setting.title') }}</p>
      <span />
    </div>
    <ul class="menubar">
      <li @click="showList">
        <div>
          <p>{{ $t('mine.setting.lang.title') }}</p>
          <p>
            <span>{{lang}}</span>
            <img src="@/static/img/right.png" alt="" class="right">
          </p>
        </div>
      </li>
    </ul>
    <button v-show="userId !== ''" class="btn" @click="layout">{{ $t('global.layout') }}</button>
    <van-action-sheet v-model="show" :actions="actions" :cancel-text="$t('global.cancel')" @cancel="onCancel" @select="select" />
  </div>
</template>
<script>
import { removeCookie, getCookie, decryptByDES } from '@/utils/utils';
export default {
  name: 'Setting',
  data () {
    return {
      actions: [],
      show: false,
      lang: this.$i18n.locale === 'en' ? 'English' : '简体中文',
      userId: ''
    }
  },
  mounted() {
    this.userId = decryptByDES(getCookie('token')) || '';
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    showList () {
      this.actions = [{
        name: '简体中文'
      }, {
        name: 'English'
      }];
      this.show = true
    },
    layout() {
      removeCookie('token');
      removeCookie('userInfo');
      this.$router.push('/index');
    },
    select(item, index) {
      if (index === 1 ) {
        this.$i18n.locale = 'en';//关键语句
        this.lang = 'English';
        localStorage.setItem('lang', 'en');
      } else if (index === 0){
        this.$i18n.locale = 'zh';//关键语句
        this.lang = '简体中文';
        localStorage.setItem('lang', 'zh');
      }
      this.show = false
    },
    onCancel() {
      this.show = false;
    }
  }
}
</script>
<style lang="less" scoped>
  .menubar{
    width: 340px;
    margin: 14px auto 29px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
    li{
      width: 311px;
      padding-left: 16px;
      padding-right: 13px;
      background-color: #ffffff;
      position: relative;
      font-size: 12px;
      div{
        display: flex;
        align-items: center;
        border-bottom: solid 1px #F7FAFD;
        width: 311px;
        height: 40px;
        justify-content: space-between;
        p{
          display: flex;
          span{
            padding-right: 14px;
          }
          .right{
            position: absolute;
            right: 10px;
            width: 12px;
            height: 12px;
          }
        }
        
      }
    }
  }
  .btn{
    border: solid 1px #C9CBD5;
    color: #C9CBD5;
    background-color: transparent;
  }
</style>
