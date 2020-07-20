<template>
  <div class="wrap">
    <div class="top">
      <div class="top_left">
        <router-link :to="{ path:'/trader', query: {userId: details.userId}}">
          <img class="header" v-if="details.icon" :src="details.icon" alt="">
          <img class="header" v-else src="@/static/img/default.png" alt="">
          <p>{{ details.nickName ? details.nickName : 'STARQUEEN 用户' + details.userId }}</p>
          <!-- <span class="name">{{ details.nickName ? details.nickName : 'STARQUEEN 用户' + details.userId }}</span> -->
          <!-- <span class="has_name">{{ details.front ? $t('community.hasRealname') : $t('community.noRealname') }}</span> -->
        </router-link>
      </div>
      <button v-show="traderId !== details.userId" :disabled="myUserId == details.userId" :class="myUserId == details.userId ? 'disabled' : ''" @click="toNext(details.userId, details.nickName)">{{ $t('community.flow') }}</button>
      <button v-show="traderId === details.userId" @click="toNext(details.userId, details.nickName)">{{ $t('follow.edit') }}</button>
    </div>
    <div class="right">
      <ul class="items">
        <li>
          <p>{{ $t('community.totalRate') }}</p>
          <p :class="details.profit.indexOf('-') !== -1 ? 'red' : 'green'">{{ details.profit || 0 }}</p>
        </li>
        <li>
          <p>{{ $t('community.weekRate') }}</p>
          <p>{{ details.win || 0 }}</p>
        </li>
        <li>
          <p>{{ $t('community.maxBack') }}</p>
          <p>{{ details.defeat }}</p>
        </li>
        <li>
          <p>{{ $t('community.tradeDays') }}</p>
          <p>{{ details.days || 0 }}</p>
        </li>
        <li>
          <p>{{ $t('community.totalFlow') }}</p>
          <p>{{ details.peoples || 0 }}</p>
        </li>
        <li>
          <p>{{ $t('community.tradeTimes') }}</p>
          <p>{{ details.number || 0 }}</p>
        </li>
      </ul>
      <ul class="tags" v-show="details.tagsArr.length > 0">
        <li v-for="(item, index) in details.tagsArr" :key="index">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getCookie, decryptByDES } from '@/utils/utils'
export default {
  props: ['details', 'contractIdx', 'traderId'],
  data() {
    return {
      myUserId: ''
    }
  },
  mounted() {
    this.myUserId = decryptByDES(getCookie('token'))
  },
  methods: {
    toNext(userId, nickName) {
      if (this.traderId !== '' && this.traderId !== userId) {
        this.$toast(this.$t('community.followNotice'));
        return false;
      }
      if(parseInt(userId) !== parseInt(this.myUserId)) {
        this.$router.push({
          path: '/follow/setting',
          query: {
            traderId: userId,
            contractIdx: this.contractIdx,
            nickName: nickName || 'STARQUEEN ID' + userId
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .wrap{
    width: 345px;
    margin: 0 auto;
    padding-top: 12px;
    .top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .top_left{
        a{
          display: flex;
        }
        .header{
          width: 38px;
          height: 38px;
          border-radius: 50%;
        }
        p{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-left: 8px;
          color: #070707;
          font-size: 16px;
          line-height: 38px;
          // .name{
          //   color: #070707;
          //   font-size: 16px;
          // }
          // .has_name{
          //   font-size: 14px;
          //   color: #a0a0a0;
          // }
        }
      }
      
      button{
        width: 58px;
        height: 28px;
        border: solid 1px #007AFF;
        color: #007AFF;
        border-radius: 4px;
        font-size: 14px;
        a{
          color: #007AFF;
        }
      }
    }
    .disabled{
      border: solid 1px #C6CBD3 !important;
      color: #C6CBD3 !important;
    }
    .right{
      border-bottom: solid 1px #f1f1f1;
      margin-left: 58px;
      padding-bottom: 10px;
      .items{
        display: flex;
        flex-wrap: wrap;
        li{
          width: 33%;
          p:nth-child(1) {
            padding-top: 20px;
            color: #8c8c8c;
            font-size: 12px;
          }
          p:nth-child(2) {
            padding-top: 8px;
            color: #515151;
            font-size: 14px;
            &.green{
              color: #00D183;
            }
            &.red{
              color: #FF3A30;
            }
          }
          
        }
      }
      .tags{
        margin-top: 12px;
        display: flex;
        li{
          margin-right: 8px;
          height: 20px;
          line-height: 20px;
          padding-left: 8px;
          padding-right: 8px;
          font-size: 10px;
          color: #a8a8a8;
          border-radius: 2px;
          background-color: #f3f3f3;
        }
      }
    }
  }
</style>
