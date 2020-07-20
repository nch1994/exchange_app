<template>
  <div>
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('option.history') }}</p>
      <span />
    </div>
    <ul class="titles_wrap">
      <li v-for="(item, index) in optionList" :key="index" :class="optionIdx === index ? 'active' : ''" @click="changeOptionIdx(index)">{{ item.coinName }} {{ $t('global.margin') }}</li>
    </ul>
    <div v-if="recordList.length > 0">
      <van-list v-model="loading" :finished="finished" :finished-text="$t('global.noMore')" @load="getRecord">
        <ul class="lists">
          <li v-for="(item, index) in recordList" :key="index" class="list">
            <div class="tops">
              <p class="tops_left">
                <span :style="[{color: item.recType === 1 ? '#00D183' : '#FF3A30'}]">{{ item.recType === 1 ? $t('contract.index.rose') : $t('contract.index.fall') }}</span>
                <span>{{ item.guessName }}*{{ item.cycle }}min</span>
                <span>{{ item.startTime }}:00~{{ item.endTime }}:59</span>
              </p>
              <p class="tops_right">
                <img v-if="item.ratio > 0" src="@/static/img/face01.png">
                <img v-else-if="item.ratio === 0" src="@/static/img/face02.png">
                <img v-else src="@/static/img/face03.png">
              </p>
            </div>
            <ul class="list_info">
              <li class="list_info_item"><p>{{ $t('option.openTime') }}</p><p>{{ item.createTime }}</p></li>
              <li class="list_info_item"><p>{{ $t('option.closeTime') }}</p><p>{{ item.settleTime }}</p></li>
              <li class="list_info_item"><p>{{ $t('global.amount') }}</p><p>{{ item.sheet }}</p></li>
              <li class="list_info_item"><p>{{ $t('option.openPrice') }}</p><p>{{ item.openPrice }}</p></li>
              <li class="list_info_item"><p>{{ $t('option.closePrice') }}</p><p>{{ item.closePrice }}</p></li>
              <li class="list_info_item"><p>{{ $t('option.settle') }}</p><p>{{ item.profit }}</p></li>
            </ul>
          </li>
        </ul>
      </van-list>
    </div>
    <div v-else>
      <Empty />
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { decryptByDES, getCookie, filterPoint, filterOptionDigit } from '@/utils/utils';
import moment from 'moment';
import Empty from '@/components/empty';
export default {
  components: {
    Empty,
  },
  data () {
    return {
      recordList: [],
      finished: false,
      loading: false,
      currentPage: 1,
      optionList: [],
      optionIdx: 0,
      userId: ''
    }
  },
  mounted() {
    this.userId = decryptByDES(getCookie('token'));
    this.guessContract().then((res) => {
      res.forEach((element) => {
        element.coinName = element.coinName.split('(')[0]
      })
      this.optionList = res;
      this.getRecord();
    })
  },
  methods: {
    ...mapActions(['guessEntrust', 'guessContract']),
    back () {
      this.$router.go(-1)
    },
    changeOptionIdx(index) {
      this.optionIdx = index;
      this.currentPage = 1;
      this.finished = false;
      this.recordList = [];
      this.getRecord();
    },
    getRecord() {
      if (this.userId === '') return
      const data = `userId=${this.userId}&guessId=${this.optionList[this.optionIdx].contId}&types=2&pageNum=${this.currentPage}&pageSize=10`;
      this.finished = false;
      this.loading = true;
      this.guessEntrust(data).then((res) => {
        this.loading = false;
        this.finished = res.isLastPage;
        this.currentPage = this.currentPage + 1;
        res.list.forEach(element => {
          element.startTime = moment(Date.parse(new Date(element.settleTime))).subtract(element.cycle, 'minutes').format('HH:mm');
          element.endTime = moment(Date.parse(new Date(element.settleTime))).subtract(1, 'minutes').format('HH:mm');
          element.createTime = moment(element.createTime).format('HH:mm:ss');
          element.settleTime = moment(element.settleTime).format('HH:mm:ss');
          element.openPrice = filterPoint(element.openPrice, 1);
          element.closePrice = filterPoint(element.closePrice, 1);
          element.profit = filterPoint(element.profit, filterOptionDigit(element.guessName));
        });
        this.recordList = this.recordList.concat(res.list);
      })
    }
  }
}
</script>
<style lang="less" scoped>
.lists{
  .list{
    border: solid 1px #e1e1e1;
    width: 320px;
    margin: 6px auto 10px;
    padding: 0 10px 0 10px;
  }
}
  .titles_wrap{
    width: 340px;
    height: 28px;
    border: solid 1px #e1e1e1;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    margin: 14px auto 0;
    li{
      width: 50%;
      text-align: center;
      height: 28px;
      line-height: 28px;
      &.active{
        color: #007aff;
      }
      &:nth-child(1) {
        border-right: solid 1px #e1e1e1;
      }
    }
  }
  .tops{
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    color: #24324C;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tops_left{
      display: flex;
      align-items: center;
      span{
        &:nth-child(2) {
          padding-left: 10px;
          padding-right: 10px;
          
        }
        &:nth-child(1) {
          font-size: 14px;
        }
      }
    }
    .tops_right {
      display: flex;
      align-items: center;
      img{
        width: 16px;
        margin-left: 6px;
      }
    }
    
  }
  .list_info{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li{
      width: 33%;
      text-align: center;
      margin-bottom: 10px;
      &:nth-of-type(3n+1) {
        text-align: left;
      }
      &:nth-of-type(3n) {
        text-align: right;
      }
      p{
        color: #3E4551;
        font-size: 14px;
        &:nth-child(1) {
          color: #B2B8C4;
          font-size: 12px;
          line-height: 16px;
        }
      }
    }
  }
</style>