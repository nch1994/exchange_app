<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('homepage.title') }}</p>
      <span />
    </div>
    
    <Top :userInfo="userInfo" />
    <div @click="isShowList = true" class="button">
      <p>{{ contractList[curIndex].contName }}{{ $t('global.perpetual') }}</p>
      <img src="@/static/img/bottom.png" alt="">
    </div>
    <div>
      <Rate v-for="(item, index) in followList" :key="index" :details="item" />
    </div>
    <ul class="button_wrap">
      <li v-for="(item, index) in list2" :key="index" @click="changeIdx(index)" :class="curIndex2 === index ? 'active' : ''">{{ item }}</li>
    </ul>
    <div v-show="curIndex2 === 0 && holds.length > 0">
      <Holds v-for="(item, index) in holds" :key="index" :details="item" />
    </div>
    <div v-show="curIndex2 === 1 && followerList.length > 0">
      <Followers v-for="(item, index) in followerList" :key="index" :details="item" :contractIdx="curIndex" />
    </div>
    <div v-show="curIndex2 === 0 && holds.length < 1 || curIndex2 === 1 && followerList.length < 1">
      <Empty />
    </div>
    <van-popup v-model="isShowList" position="left" :style="{ width: '70%', height: '100%' }">
      <AccountList :curIdx="curIndex" @confirm="changeAccountIdx" @cancel="isShowList = false" />
    </van-popup>
  </div>
</template>
<script>
import Top from './top.vue'
import AccountList from '@/components/leftList.vue';
import Rate from './rate.vue';
import Holds from './holds.vue'
import Followers from './followers.vue'
import Empty from '@/components/empty.vue';
import { mapState, mapActions } from 'vuex';
import { filterRecType, filterPoint } from '@/utils/utils';
import numeral from 'numeral';
import moment from 'moment'
export default {
  components: {
    Top,
    AccountList,
    Rate,
    Holds,
    Empty,
    Followers
  },
  data() {
    return {
      curIndex: 0,
      isShowList: false,
      list2: [],
      curIndex2: 0,
      followList: [],
      holds: [],
      followerList: [],
      userId: '',
      userInfo: {}
    }
  },
  computed: mapState([
    'contractList'
  ]),
  mounted() {
    this.userId = this.$route.query.userId;
    this.list2 = this.$t('homepage.lists')
    this.getFollow();
    this.getFollowers();
    this.getHolds();
    const data = {
      userId: this.userId
    }
    this.getUserInfo(data).then((res) => {
      this.userInfo = res
    })
  },
  methods: {
    ...mapActions(['communityRank', 'followHistory', 'followFollower', 'getUserInfo']),
    getFollow() {
      const data = `${this.contractList[this.curIndex].contId}?userId=${this.userId}`
      this.communityRank(data).then((res) => {
        res.forEach((element) => {
          element.profit = numeral(element.profit).format('0.00%');
          element.win = numeral(element.win).format('0.00%');
          element.defeat = numeral(element.defeat).format('0.00%');
        })
        this.followList = res;
      })
    },
    getHolds() {
      const data = `userId=${this.userId}&contId=${this.contractList[this.curIndex].contId}`;
      this.followHistory(data).then((res) => {
        res.forEach((element) => {
          element.rate = numeral(element.rate).format('0.00%');
          element.recText = filterRecType(element.recType);
          element.createTime = moment(element.createTime).format('MM-DD hh:mm');
          element.closePrice = element.closePrice ? filterPoint(element.closePrice, 2) : '0.00';
          element.openPrice = element.openPrice ? filterPoint(element.openPrice, 2) : '0.00';
        });
        this.holds = res;
      })
    },
    getFollowers() {
      const data = `userId=${this.userId}&contId=${this.contractList[this.curIndex].contId}`;
      this.followFollower(data).then((res) => {
        res.forEach((element) => {
          element.profit = filterPoint(element.profit, 4);
          element.bond = filterPoint(element.bond, 4)
          element.profit = filterPoint(element.profit, 4)
        })
        this.followerList = res;
      })
    },
    back() {
      this.$router.go(-1);
    },
    changeAccountIdx(index) {
      this.curIndex = index;
      this.isShowList = false;
      this.getFollow()
      this.getFollowers();
      this.getHolds();
    },
    changeIdx(index) {
      this.curIndex2 = index;
    }
  }
}
</script>
<style lang="less" scoped>
  .button{
    width: 300px;
    border: solid 1px #F1F1F1;
    border-radius: 2px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 12px auto;
    p{
      padding-left: 12px;
      font-size: 14px;
    }
    img{
      vertical-align: middle;
      padding-right: 12px;
      width: 16px;
    }
  }
  .earnings{
    width: 316px;
    margin: 0 auto;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
    li{
      &:nth-child(1) {
        text-align: left;
      }
      &:nth-child(2) {
        text-align: center;
      }
      &:nth-child(3) {
        text-align: right;
      }
      p:nth-child(1) {
        color: #A7AFBC;
        font-size: 12px;
        padding-bottom: 10px;
      }
      p:nth-child(2) {
        color: #24324C;
        font-size: 14px;
      }
    }
  }
  .button_wrap{
    height: 32px;
    width: 280px;
    color: #007AFF;
    border: solid 1px #007AFF;
    border-radius: 4px;
    display: flex;
    line-height: 32px;
    margin: 16px auto;
    li{
      width: 50%;
      text-align: center;
      font-size: 14px;
      &.active{
        color: #ffffff;
        background-color: #007AFF;
      }
    }
  }
</style>
