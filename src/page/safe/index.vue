<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('mine.title') }}</p>
      <span />
    </div>
    <div class="menubar">
      <ul class="items">
        <li class="item">
          <p>{{ $t('mine.safe.menubar[0].title') }}<span class="notice" v-if="userInfo.mobile">({{ $t('mine.safe.phoneNotice') }})</span></p>
          <p>
            <span @click="to('/safe/phone')" v-if="!userInfo.mobile">{{ $t('mine.safe.unbound') }}</span>
            <van-switch @change="changeMobile()" v-else size="18px" active-color="#007aff" v-model="mobileChecked" />
            <img v-show="!userInfo.mobile" src="@/static/img/right.png" alt="" class="right">
          </p>
        </li>
        <li class="item">
          <p>{{ $t('mine.safe.menubar[1].title') }}<span class="notice" v-if="userInfo.email">({{ $t('mine.safe.phoneNotice') }})</span></p>
          <p>
            <span @click="to('/safe/email')" v-if="!userInfo.email">{{ $t('mine.safe.unbound') }}</span>
            <van-switch @change="changeEmail()" v-else size="18px" active-color="#007aff" v-model="emailChecked" />
            <img v-show="!userInfo.email" src="@/static/img/right.png" alt="" class="right">
          </p>
        </li>
        <li class="item">
          <p>{{ $t('mine.safe.menubar[2].title') }}</p>
          <p>
            <span @click="to('/safe/identity')">{{ userInfo.front ? $t('mine.safe.certified') : $t('mine.safe.certification') }}</span>
            <img v-show="!userInfo.front" src="@/static/img/right.png" alt="" class="right">
          </p>
        </li>
        <li class="item">
          <p>{{ $t('mine.safe.menubar[3].title') }}</p>
          <p>
            <span @click="to('/safe/fundpwd')" v-show="!userInfo.tradePassword">{{$t('mine.safe.toSet') }}</span>
            <span @click="showForget('trade')" v-show="userInfo.tradePassword" class="blue">{{$t('mine.safe.forget')}}</span>
            <span @click="showModify('trade')" v-show="userInfo.tradePassword" class="blue">{{$t('mine.safe.modify')}}</span>
            <img v-show="userInfo.tradePassword" src="@/static/img/right.png" alt="" class="right">
          </p>
        </li>
        <li class="item">
          <p>{{ $t('mine.safe.menubar[4].title') }}</p>
          <p>
            <span class="blue" @click="showForget('login')">{{ $t('mine.safe.forget') }}</span>
            <span class="blue" @click="showModify('login')">{{ $t('mine.safe.modify') }}</span>
            <img src="@/static/img/right.png" alt="" class="right">
          </p>
        </li>
      </ul>
    </div>
    <ForgetLayer v-show="isShowForget" :type="type" @hideForget="hideForget" />
    <ModifyLayer v-show="isShowModify" :type="type" @hideForget="hideForget" />
  </div>
</template>
<script>
import { getCookie, setCookie, decryptByDES } from '@/utils/utils';
import ForgetLayer from './forget';
import ModifyLayer from './modify';
import { mapActions } from 'vuex';
export default {
  name: 'Safe',
  components: {
    ForgetLayer,
    ModifyLayer
  },
  data () {
    return {
      mobileChecked: false,
      emailChecked: false,
      userInfo: {},
      isShowForget: false,
      isShowModify: false,
      type: ''
    }
  },
  mounted() {
    this.userInfo = JSON.parse(getCookie('userInfo'));
    this.mobileChecked = this.userInfo.mobileAuth === 1 ? true : false;
    this.emailChecked = this.userInfo.emailAuth === 1 ? true : false;
  },
  methods: {
    ...mapActions(['updateEmailAuth', 'updateMobileAuth']),
    changeMobile() {
      const data = {
        userId: decryptByDES(getCookie('token'))
      }
      this.updateMobileAuth(data).then((obj) => {
        this.mobileChecked = obj.mobileAuth === 1 ? true : false;
        this.userInfo.mobileAuth = obj.mobileAuth;
        setCookie('userInfo', JSON.stringify(this.userInfo));
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
      })
    },
    changeEmail() {
      const data = {
        userId: decryptByDES(getCookie('token'))
      };
      this.updateEmailAuth(data).then((obj) => {
        this.emailChecked = obj.emailAuth === 1 ? true : false;
        this.userInfo.emailAuth = obj.emailAuth;
        setCookie('userInfo', JSON.stringify(this.userInfo));
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
      })
    },
    hideForget() {
      this.isShowForget = false;
      this.isShowModify = false;
    },
    back () {
      this.$router.go(-1)
    },
    to (url) {
      if (url === '/safe/identity' && this.userInfo.front) {
        return false;
      }
      this.$router.push({
        path: url
      })
    },
    showForget(type) {
      this.isShowForget = true;
      this.type = type;
    },
    showModify(type) {
      this.isShowModify = true;
      this.type = type;
    }
  }
}
</script>
<style lang="less" scoped>
  .menubar{
    width: 340px;
    margin: 14px auto 0;
    .items{
      width: 311px;
      padding-left: 16px;
      padding-right: 13px;
      background-color: #ffffff;
      position: relative;
      font-size: 12px;
      .item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid 1px #F7FAFD;
        width: 311px;
        height: 40px;
        p{
          display: flex;
          .notice{
            padding-left: 4px;
            color: #A6AEBB;
          }
          span{
            padding-right: 10px;
            &.blue{
              color: #007aff;
            }
          }
          .right{
            width: 12px;
            height: 12px;
          }
        }
      }
    }
    .bft{
      position: absolute;
      right: 10px;
      bottom: 6px;
    }
  }
</style>
