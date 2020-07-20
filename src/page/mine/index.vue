<template>
  <div class="content">
    <div class="tabbar">
      <span />
      <img src="@/static/img/setting.png" alt="" class="setting" @click="setting()">
    </div>
    <div class="uid">
      <div class="uid_left">
        <router-link to="/mine/user">
          <img v-show="userInfo.icon" :src="userInfo.icon" alt="">
          <img v-show="!userInfo.icon" src="@/static/img/default.png" alt="">
        </router-link>
      </div>
      <div class="uid_right" v-if="userId !== ''">
        <p class="user">{{ userInfo.nickName || 'STARQUEEN 用户' }}</p>
        <span>UID: {{ userInfo.userId }}</span>
        <img src="@/static/img/copy.png" data-clipboard-action="copy" class="copyUid" :data-clipboard-text="userInfo.myInviteCode" alt="" @click="copy"> 
      </div>
      <div v-else>
        <router-link to="/login" class="toLogin">{{ $t('global.login') }}/{{ $t('global.register2') }}</router-link>
      </div>
    </div>
    <div class="menubar">
      <div v-for="(item, index) in $t('mine.index.menubar')" :key="index" class="items">
        <div class="item">
          <router-link :to="item.url" class="router_item">
            <span>{{ item.title }}</span>
            <img src="@/static/img/right.png" alt="" class="right">
          </router-link>
        </div>
      </div>
      <div class="items">
        <div class="item">
          <a href="https://h5.starqueen.top/guide_page/" class="router_item">
            <span>{{ $t('global.download') }}</span>
            <img src="@/static/img/right.png" alt="" class="right">
          </a>
        </div>
      </div>
    </div>
    <p class="text">{{$t('mine.index.notice')}}</p>
  </div>
</template>
<script>
import { getCookie, decryptByDES } from '@/utils/utils';
export default {
  name: 'Mine',
  data () {
    return {
      checked: false,
      userInfo: {},
      user: '',
      userId: ''
    }
  },
  mounted () {
    this.user = this.user.substr(0, 4) + "****" + this.user.substr(7);
    this.userId = decryptByDES(getCookie('token')) || '';
    this.userInfo = getCookie('userInfo') ? JSON.parse(getCookie('userInfo')) : {}
    const user = this.userInfo.mobile || this.userInfo.email || '';
    this.user = user.substr(0, 4) + "****" + user.substr(7);
  },
  methods: {
    copy () {
      let _this = this;
      let clipboard = new this.clipboard(".copyUid");
      clipboard.on('success', function () {
        _this.$toast(_this.$t('global.copySuccess'));
      });
      clipboard.on('error', function () {
        _this.$toast(_this.$t('global.copyFail'));
      });
    },
    setting () {
      this.$router.push({
        path: 'mine/setting'
      })
    },
    toNav (url) {
      this.$router.push({
        path: url
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .content{
    padding-bottom: 60px;
    .tabbar{
      .setting{
        width: 20px;
        height: 20px;
      }
    }
    .uid{
      padding-left: 18px;
      height: 102px;
      text-align: left;
      display: flex;
      align-items: center;
      .uid_left{
        img{
          width: 55px;
          height: 55px;
          border-radius: 50%;
        }
      }
      .uid_right{
        .user{
          text-align: left;
          padding-left: 9px;
          font-weight: bold;
          color: #24324C;
          font-size: 20px;
          padding-bottom: 5px;
        }
        span{
          padding-left: 9px;
          color: #9099A7;
          font-size: 14px;
          padding-right: 7px;
        }
        img{
          width: 18px;
          height: 18px;
        }
      }
    }
    .toLogin{
      color: #24324c;
      padding-left: 10px;
      font-size: 14px;
    }
    .menubar{
      width: 340px;
      margin: 0 auto;
      .items{
        width: 311px;
        padding-left: 16px;
        padding-right: 13px;
        background-color: #ffffff;
        position: relative;
        font-size: 12px;
        .item{
          border-bottom: solid 1px #F7FAFD;
          width: 311px;
          .router_item{
            color: #24324C;
            height: 40px;
            display: flex;
            align-items: center;
            .icon{
              width: 18px;
              height: auto;
              margin-right: 10px;
            }
            .right{
              position: absolute;
              right: 10px;
              width: 12px;
              height: 12px;
            }
          }
          
        }
        // &:nth-child(1), &:nth-child(3){
        //   margin-bottom: 10px;
        //   div{
        //     border-bottom: none;
        //   }
        // }
      }
    }
    .text{
      margin-top: 15px;
      font-size: 12px;
      color: #9099A7;
      padding-left: 27px;
      padding-right: 25px;
      text-align: left;
      line-height: 20px;
    }
  }
  
</style>
