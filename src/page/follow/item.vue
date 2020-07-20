<template>
  <div class="details">
    <div class="top">
      <router-link :to="{ path:'/trader', query: {userId: details.userId}}">
        <img v-if="details.icon" :src="details.icon" alt="">
        <img v-else src="@/static/img/default.png" alt="">
        <p>{{ details.nickName }}</p>
      </router-link>
      <button>
        <router-link :to="{ path: '/follow/setting', query: { traderId: details.traderId, contractIdx: contractIdx, nickName: details.nickName } }">{{ $t('follow.edit') }}</router-link>
      </button>
    </div>
    <ul class="center">
      <li>
        <p>{{ $t('follow.totalPrice') }}</p>
        <p>{{ details.bond }}</p>
      </li>
      <li>
        <p>{{ $t('follow.followRate') }}({{ coinType }})</p>
        <p>{{ details.profit }}</p>
      </li>
    </ul>
    <ul class="bottom">
      <li v-show="details.recType === 1">{{ $t('follow.followPrice') }}({{ coinType }})：{{ details.sheet }}</li>
      <li v-show="details.recType === 2">{{ $t('follow.followScale') }}(%)：{{ details.scale }}</li>
      <li>{{ $t('follow.todayFollowPrice') }}({{ coinType }})： {{ details.dailyMax === 1 ? $t('followEdit.unlimit') : details.dailyMax}}</li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  props: ['details', 'contractIdx'],
  data() {
    return {
      coinType: ''
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  watch: {
    contractIdx(newVal) {
      this.coinType = this.contractList[newVal].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[newVal].contName.split('/')[0]
    }
  },
  mounted() {
    this.coinType = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[this.contractIdx].contName.split('/')[0]
  }
}
</script>
<style lang="less" scoped>
  .details{
    width: 340px;
    height: auto;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
    margin-bottom: 10px; 
    .top{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      height: 60px;
      a{
        display: flex;
        img{
          width: 48px;
          height: 48px;
          vertical-align: middle;
          margin-right: 8px;
          border-radius: 50%;
        }
        p{
          display: flex;
          flex-direction: column;
          font-size: 14px;
          padding-bottom: 4px;
          font-family: 'Medium';
          line-height: 48px;
          color: #24324C;
          // .name{
          //   color: #24324C;
          //   font-size: 14px;
          //   padding-bottom: 4px;
          //   font-family: 'Medium';
          // }
          // .hasName{
          //   color: #A7AFBC;
          //   font-size: 12px;
          // }
        }
      }
      button{
        width: 70px;
        height: 32px;
        background-color: #007AFF;
        line-height: 32px;
        color: #ffffff;
        border-radius: 4px;
        font-size: 14px;
        a{
          display: block;
          color: #ffffff;
          text-align: center;
        }
      }
    }
    .center{
      display: flex;
      justify-content: space-between;
      padding-top: 8px;
      padding-bottom: 8px;
      border-bottom: dashed 1px #F7FAFD;
      li{
        width: 50%;
        text-align: center;
        p{
          &:nth-child(1) {
            color: #A7AFBC;
            font-size: 14px;
            padding-bottom: 6px;
          }
          &:nth-child(2) {
            color: #24324C;
            font-size: 16px;
          }
        }
      }
    }
    .bottom{
      padding: 12px;
      li{
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: #24324C;
      }
    }
  }
</style>
