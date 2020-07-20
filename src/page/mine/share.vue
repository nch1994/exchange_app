<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('mine.share.title') }}</p>
      <span />
    </div>
    <div class="info">
      <p class="invite_num">{{ $t('mine.share.inviteNum') }}： {{ inviteNum }}</p>
      <div class="info_bottom">
        <QrcodeVue v-if="userInfo.myInviteCode !== ''" :value="'https://h5.starqueen.top/register?inviteCode='+userInfo.myInviteCode" :size="140" />
        <p>{{ $t('mine.share.inviteCode') }}：{{ userInfo.myInviteCode }}</p>
        <button class="btn copyUid" data-clipboard-action="copy" :data-clipboard-text="userInfo.myInviteCode" @click="copy">{{ $t('mine.share.copyCode') }}</button>
      </div>
    </div>
    <div class="notice">
      <p>{{ $t('mine.share.notice') }}</p>
      <ul>
        <li>{{ $t('mine.share.noticeInfo') }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getCookie, decryptByDES } from '@/utils/utils';
import QrcodeVue from 'qrcode.vue';
import { mapActions } from 'vuex';
export default {
  name: 'Share',
  components: {
    QrcodeVue
  },
  data () {
    return {
      code: '',
      userInfo: {},
      inviteNum: 0
    }
  },
  mounted() {
    this.userInfo = JSON.parse(getCookie('userInfo'));
    const userId = decryptByDES(getCookie('token'));
    this.getInviteNum(userId).then((res) => {
      this.inviteNum = res;
    })
  },
  methods: {
    ...mapActions(['getInviteNum']),
    back () {
      this.$router.go(-1)
    },
    copy () {
      let _this = this;
      let clipboard = new this.clipboard(".copyUid");
      clipboard.on('success', function () {
        _this.$toast(_this.$t('global.copySuccess'));
      });
      clipboard.on('error', function () {
        _this.$toast(_this.$t('global.copyFail'));
      });
    }
  }
}
</script>
<style lang="less" scoped>
  .info{
    padding-top: 24px;
    padding-bottom: 20px;
    background-color: #ffffff;
    width: 340px;
    margin: 0 auto;
    border-radius: 2px;
    img{
      width: 111px;
      height: 111px;
      margin-bottom: 11px;
    }
    .invite_num{
      padding-left: 20px;
      text-align: left;
      font-size: 14px;
    }
    .info_bottom{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    p {
      font-size: 12px;
      color: #24324C;
      font-family: 'Medium';
      line-height: 17px;
      height: 17px;
      margin-bottom: 25px;
    }
    button{
      width: 120px;
      height: 32px;
      line-height: 32px;
      margin-top: 0;
      margin-bottom: 0;
      font-size: 14px;
    }
  }
  .notice{
    padding-top: 13px;
    text-align: left;
    padding-left: 18px;
    padding-right: 34px;
    font-size: 12px;
    line-height: 20px;
    p{
      color: #24324C;
    }
    ul {
      li {
        color: #9099A7;
      }
    }
  }
</style>
