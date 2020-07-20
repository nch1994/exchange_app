<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('leader.title') }}</p>
      <span />
    </div>
    <div class="top">
      <div class="share">
        <p>{{ $t('leader.share') }}</p>
        <van-switch @change="changeShare()" size="18px" active-color="#007aff" :value="isShare" />
      </div>
      <p class="notice">{{ $t('leader.notice') }}</p>
    </div>
    <div class="types">
      <p>{{ $t('leader.types') }}</p>
      <p @click="isShowList = true">{{ contractList[curIndex].contName }}{{ $t('global.perpetual') }}<img src="@/static/img/bottom.png" alt=""></p>
    </div>
    <div class="details">
      <p>{{ $t('leader.number') }}：<span>{{details.peoples}}</span></p>
      <p>{{ $t('leader.amount') }}：<span>{{ details.numbers }}</span></p>
      <p>{{ $t('leader.holds') }}：<span>{{details.sheet}}</span></p>
    </div>
    <ul class="earnings">
      <li><p>{{ $t('leader.todayEarnings') }}</p><p>{{ details.today }}</p></li>
      <li><p>{{ $t('leader.yesterdayEarnings') }}</p><p>{{ details.yesterday }}</p></li>
      <li><p>{{ $t('leader.totalEarnings') }}</p><p>{{ details.profit }}</p></li>
    </ul>
    <p class="title2">{{ $t('leader.earningsDetails') }}</p>
    <van-popup v-model="isShowList" position="left" :style="{ width: '70%', height: '100%' }">
      <AccountList :curIdx="curIndex" @confirm="changeAccountIdx" @cancel="isShowList = false" />
    </van-popup>
    <div class="lists" v-show="leaderList.length > 0">
      <ul class="earnings" v-for="(item, index) in leaderList" :key="index">
        <li><p>{{ $t('leader.nickName') }}</p><p>{{ item.nickName }}</p></li>
        <li><p>{{ $t('leader.time') }}</p><p>{{ item.createTime }}</p></li>
        <li><p>{{ $t('leader.earnings') }}</p><p>{{ item.royalty }}</p></li>
      </ul>
    </div>
    <div v-show="leaderList.length < 1">
      <Empty />
    </div>
  </div>
</template>
<script>
import AccountList from '@/components/leftList.vue';
import Empty from '@/components/empty.vue';
import { mapState, mapActions } from 'vuex';
import { getCookie, filterPoint, decryptByDES } from '@/utils/utils';
import moment from 'moment';
export default {
  components: {
    AccountList,
    Empty
  },
  data () {
    return {
      isShare: false,
      isShowList: false,
      curIndex: 0,
      details: {},
      leaderList: []
    }
  },
  computed: mapState([
    'contractList'
  ]),
  mounted() {
    const data = decryptByDES(getCookie('token'));
    this.queryLead(data).then((res) => {
      this.isShare = res === 1 ? true : false;
    })
    this.getList()
  },
  methods: {
    ...mapActions(['setLead', 'queryLead', 'leadCount']),
    changeShare() {
      const data = {
        userId: decryptByDES(getCookie('token')),
        follow: this.isShare ? 0 : 1
      }
      this.setLead(data).then(() => {
        this.isShare = !(this.isShare)
        this.$toast(this.$t('global.actionSuccess'));
      }).catch((msg) => {
        console.error(msg)
        this.$toast(msg || this.$t('global.wait'))
      })
    },
    changeAccountIdx(index) {
      this.curIndex = index;
      this.isShowList = false;
      this.getList();
    },
    back () {
      this.$router.go(-1)
    },
    getList() {
      const userId = decryptByDES(getCookie('token'));
      const data = `userId=${userId}&contId=${this.contractList[this.curIndex].contId}`;
      this.leadCount(data).then((res) => {
        res.record.forEach((element) => {
          element.nickName = element.nickName || `STARQUEEN 用户${element.userId}`
          element.createTime = moment(element.createTime).format('MM-DD hh:mm');
          element.royalty = element.royalty ? filterPoint(element.royalty, 4) : 0.0000
        });
        res.count.today = res.count.today ? filterPoint(res.count.today, 4) : '0.0000'
        res.count.yesterday = res.count.yesterday ? filterPoint(res.count.yesterday, 4) : '0.0000'
        res.count.profit = res.count.profit ? filterPoint(res.count.profit, 4) : '0.0000'
        this.details = res.count;
        this.leaderList = res.record;
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .top{
    width: 340px;
    margin: 0 auto;
    padding: 12px 0;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
    .share{
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
    .notice{
      padding-top: 12px;
      font-size: 12px;
      line-height: 16px;
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
  .details{
    width: 340px;
    margin: 0 auto;
    padding-bottom: 10px;
    font-size: 14px;
    color: #24324C;
    display: flex;
    justify-content: space-between;
    span{
      color: #00D183;
    }
  }
  .title2{
    padding-left: 17px;
    font-size: 16px;
    color: #24324C;
    font-family: 'Medium';
    height: 36px;
    line-height: 36px;
  }
  .earnings{
    width: 340px;
    margin: 0 auto;
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
    li{
      width: 33%;
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
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: #24324C;
        font-size: 14px;
      }
    }
  }
  .lists{
    ul{
      &:nth-last-child(1) {
        border-bottom: none;
      }
      border-bottom: solid 1px #F7FAFD;
    }
  }
</style>
