<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('mine.reward.title') }}</p>
      <span />
    </div>
    <div class="types">
      <p>{{ $t('mine.reward.types') }}：</p>
      <p @click="isShowList = true">{{ contractList[curIndex].contName }}{{ $t('global.perpetual') }}<img src="@/static/img/bottom.png" alt=""></p>
    </div>
    <div class="info">
      <ul>
        <li><p>{{ $t('mine.reward.totalReward') }}</p><p>{{ amount }}</p></li>
        <li><p>{{ $t('mine.reward.todayReward') }}</p><p>{{ todayAmount }}</p></li>
        <li><p>{{ $t('mine.reward.peoples') }}</p><p>{{ inviteNum }}</p></li>
      </ul>
    </div>
    <div class="lists">
      <div class="list">
        <ul class="table" v-if="list.length > 0">
          <li>
            <p>ID</p>
            <p>{{ $t('mine.reward.type') }}</p>
            <p>{{ $t('mine.reward.amount') }}({{ unit }})</p>
            <p>{{ $t('mine.reward.time') }}</p>
          </li>
          <li v-for="(item, index) in list" :key="index">
            <p>{{ item.userId }}</p>
            <p>{{ item.recText }}</p>
            <p>{{ item.amount }}</p>
            <p>{{ item.createTime}}</p>
          </li>
        </ul>
        <div v-else>
          <NoData />
        </div>
      </div>
    </div>
    <van-popup v-model="isShowList" position="left" :style="{ width: '70%', height: '100%' }">
      <AccountList :curIdx="curIndex" @confirm="changeAccountIdx" @cancel="isShowList = false" />
    </van-popup>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { getCookie, filterPoint, decryptByDES } from '@/utils/utils';
import moment from 'moment';
import NoData from '@/components/empty';
import AccountList from '@/components/leftList.vue';
export default {
  name: 'Share',
  components: {
    NoData,
    AccountList
  },
  data () {
    return {
      amount: '',
      cny: '',
      list: [],
      time: '',
      todayAmount: 0,
      inviteNum: 0,
      bgStyle: {
        backgroundImage: "url("+require('@/static/img/fenxiao_bg.jpg')+")"
      },
      isShowList: false,
      curIndex: 0,
      unit: 'USDT'
    }
  },
  computed: mapState([
    'contractList'
  ]),
  mounted() {
    this.time = moment().format('YYYY-MM-DD');
    this.getRewardListfn();
    this.getUserRewardfn();
    this.unit = this.contractList[this.curIndex].contName.indexOf('USDT')> -1 ? 'USDT' : this.contractList[this.curIndex].contName.split('/')[0];
  },
  methods: {
    ...mapActions(['getRewardList', 'getUserReward']),
    back () {
      this.$router.go(-1)
    },
    changeAccountIdx(index) {
      this.curIndex = index;
      this.isShowList = false;
      this.unit = this.contractList[this.curIndex].contName.indexOf('USDT')> -1 ? 'USDT' : this.contractList[this.curIndex].contName.split('/')[0];
      this.getRewardListfn();
      this.getUserRewardfn();
    },
    getRewardListfn() {
      const userId = decryptByDES(getCookie('token'));
      const data = `${userId}?pageNum=1&pageSize=50&contId=${this.contractList[this.curIndex].contId}`
      this.getRewardList(data).then((res) => {
        this.amount = filterPoint(res.sum.amount, 8);
        this.inviteNum = res.sum.inviteNum || 0;
        this.cny = filterPoint(res.sum.cny, 2);
        res.list.list.forEach((element) => {
          element.createTime = moment(element.createTime).format('MM-DD hh:mm');
          element.amount = filterPoint(element.amount, 8)
          element.recText = this.filterRec2(element.recType, element.grade);
        })
        this.list = res.list.list
      })
    },
    getUserRewardfn() {
      const userId = decryptByDES(getCookie('token'));
      const userRewardData = `${userId}?contId=${this.contractList[this.curIndex].contId}`
      this.getUserReward(userRewardData).then((res) => {
        this.todayAmount = res ? filterPoint(res.amount, 8) : filterPoint(0, 8)
      })
    },
    filterRec2(recType, grade) {
      let recText;
      switch (recType) {
      case 1:
        recText = this.$t('global.openMore') + `-${grade}`;
        break;
      case 0:
        recText = this.$t('global.openEmpty') + `-${grade}`;
        break;
      case 11: 
        recText = this.$t('global.flatMore') + `-${grade}`;
        break;
      case 10:
        recText = this.$t('global.flatEmpty') +`-${grade}`;
        break;
      default: 
        break
      }
      return recText
    },
  }
}
</script>
<style lang="less" scoped>
  .info{
    background-color: #ffffff;
    width: 340px;
    height: 66px;
    margin: 0 auto 10px;
    border-radius: 2px;
    background-size: 340px 110px;
    ul {
      padding-left: 12px;
      padding-right: 12px;
      color: #24324c;
      display: flex;
      justify-content: space-between;
      padding-top: 17px;
      font-family: 'Medium';
      text-align: left;
      li{
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        p:nth-child(1) {
          color: #a7afbc;
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
  }
  .types{
    width: 340px;
    height: 50px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    p{
      font-size: 14px;
      color: #24324C;
      font-family: 'Medium';
      &:nth-child(1) {
        margin-right: 12px;
        font-size: 16px;
      }
    }
    img{
      margin-left: 6px;
      vertical-align: middle;
      width: 14px;
    }
  }
  .lists{
    .list{
      background-color: #ffffff;
      width: 340px;
      margin: 0 auto 10px;
      .list_title{
        height: 39px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #24324C;
        border-bottom: solid 1px #F7FAFD;
        p{
          padding-left: 16px;
        }
        div{
          padding-right: 12px;
          span{
            padding-right: 10px;
          }
          img{
            width: 12px;
            height: 12px;
          }
        }
      }
      .table{
        width: 308px;
        margin: 0 auto;
        padding-bottom: 10px;
        li {
          font-size: 12px;
          height: 30px;
          line-height: 30px;
          display: flex;
          &:nth-child(1) {
            font-family: 'Medium';
            color: #24324C;
          }
          color: #9099A7;
          font-family: 'Regular';
          p{
            display: block;
            text-align: center;
            &:nth-child(1) {
              width: 15%;
            }
            &:nth-child(2) {
              width: 20%;
            }
            &:nth-child(3) {
              width: 35%;
            }
            &:nth-child(4) {
              width: 30%;
            }
          }
        }
      }
    }
  }
  
</style>
