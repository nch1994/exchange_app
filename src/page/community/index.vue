<template>
  <div class="content">
    <Top :rollList="rollList" />
    <ul class="list_title">
      <li class="list_title_left"><span>{{ $t('community.title') }}</span></li>
      <li class="list_title_right"><router-link to="/follow">{{ $t('community.flowManage') }}<img src="@/static/img/right.png"></router-link></li>
    </ul>
    <div class="more_wrap">
      <div @click="isShowList = true" class="button">
        <p>{{ contractList[curIndex].contName }}{{ $t('global.perpetual') }}</p>
        <img src="@/static/img/bottom.png" alt="">
      </div>
      <router-link to="/community/search" class="more">{{ $t('community.more') }}</router-link>
    </div>
    
    <div class="lists" v-show="rankList.length > 0">
      <Item v-for="(item, index) in rankList" :key="index" :details="item" :contractIdx="curIndex" :traderId="traderId" />
    </div>
    <div v-show="rankList.length < 1">
      <Empty />
    </div>
    <van-popup v-model="isShowList" position="left" :style="{ width: '70%', height: '100%' }">
      <AccountList :curIdx="curIndex" @confirm="changeAccountIdx" @cancel="isShowList = false" />
    </van-popup>
  </div>
</template>
<script>
import Top from './top.vue';
import Item from './item.vue';
import { mapActions, mapState } from 'vuex';
import numeral from 'numeral'
import { filterRecType, getCookie, decryptByDES } from '@/utils/utils';
import AccountList from '@/components/leftList.vue';
import moment from 'moment';
import Empty from '@/components/empty.vue';
let timer = null;
export default {
  components: {
    Top,
    Item,
    AccountList,
    Empty
  },
  data() {
    return {
      rollList: [],
      contId: 1,
      curIndex: 0,
      isShowList: false,
      rankList: [],
      traderId: '',
      recId: ''
    }
  },
  computed: mapState([
    'contractList'
  ]),
  mounted() {
    this.getRollList();
    timer = setInterval(() => {
      let currentTime = moment(moment().format('H:mm:ss'), 'hh:mm:ss');
      let nextTime = moment(Number(moment().format('H')) + 1 + ':00:00', 'hh:mm:ss');
      const diff = moment(nextTime).diff(moment(currentTime), 'second');
      if (parseInt(diff) === 1) {
        this.getRollList();
        this.getRankList();
      }
    }, 1000)
    this.getRankList();
    const userId = decryptByDES(getCookie('token')) || '';
    if (userId !== '') {
      const data = `userId=${userId}&contId=${this.contractList[this.curIndex].contId}`;
      this.nickName = this.$route.query.nickName;
      this.queryOnly(data).then((res) => {
        this.recId = res ? res.recId : '';
        if (this.recId !== '') {
          this.traderId = res.traderId
        }
      })
    }
  },
  beforeDestroy() {
    clearInterval(timer)
  },
  methods: {
    ...mapActions(['communityRoll', 'communityRank', 'queryOnly']),
    changeAccountIdx(index) {
      this.curIndex = index;
      this.isShowList = false;
      this.traderId = '';
      this.getRankList();
      const userId = decryptByDES(getCookie('token')) || '';
      if (userId !== '') {
        const data = `userId=${userId}&contId=${this.contractList[index].contId}`;
        this.nickName = this.$route.query.nickName;
        this.queryOnly(data).then((res) => {
          this.recId = res ? res.recId : '';
          if (this.recId !== '') {
            this.traderId = res.traderId
          }
        })
      }
    },
    getRollList() {
      const lang = localStorage.getItem('lang') || 'zh';
      this.communityRoll().then((res) => {
        res.forEach(element => {
          element.rate = numeral(element.rate).format('0.00%');
          if (element.minutes >= 60) {
            if (element.minutes % 60 === 0) {
              element.minutes = lang === 'zh' ? Math.floor(element.minutes / 60) + '小时前' : 'before' + Math.floor(element.minutes / 60) + 'hour';
            } else {
              element.minutes = lang === 'zh' ? Math.floor(element.minutes / 60) + '小时' + (element.minutes) % 60 + '分钟前' : 'before' + Math.floor(element.minutes / 60) + 'hour' + (element.minutes) % 60 + 'min'
            }
          }
          element.nickName = element.nickName || `STARQUEEN 用户${element.userId}`
          element.recText = filterRecType(element.recType);
        });
        this.rollList = res;
      })
    },
    getRankList() {
      this.communityRank(this.contractList[this.curIndex].contId).then((res) => {
        res.forEach((element) => {
          element.profit = numeral(element.profit).format('0.00%');
          element.win = numeral(element.win).format('0.00%');
          element.defeat = numeral(element.defeat).format('0.00%');
          element.tagsArr = element.tags ? element.tags.split(',') : [];
        })
        this.rankList = res;
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .content{
    padding-bottom: 60px;
  }
  .more_wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 340px;
    height: 50px;
    margin: 0 auto;
    .button{
      width: 240px;
      border: solid 1px #F1F1F1;
      border-radius: 2px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
    .more{
      font-size: 12px;
      color: #24324C;
    }
  }
  
  .list_title{
    width: 345px;
    border-bottom: solid 1px #e8e8e8;
    margin: 0 auto 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 58px;
    .list_title_left{
      span:nth-child(1){
        color: #333333;
        font-size: 18px;
        padding-right: 20px;
      }
      span:nth-child(2){
        color: #999999;
        font-size: 12px;
      }
    }
    .list_title_right{
      font-size: 14px;
      color: #999999;
      img{
        margin-left: 4px;
        width: 12px;
        height: 12px;
        vertical-align: middle;
      }
      a{
        color: #999999;
      }
    }
  }
</style>
