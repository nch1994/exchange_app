<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ coinInfo.enName }}</p>
      <span />
    </div>
    <div class="info">
      <div class="bg" :style="bgStyle">
        <div class="bg_left">
          <img :src="coinInfo.icon" alt="">
          <span>{{ coinInfo.enName }}</span>
        </div>
        <div class="bg_right">
          <p>{{ $t('asset.wallet.convert') }}: {{ coinInfo.cny }}(CNY)</p>
          <p>{{ $t('asset.wallet.available') }}: {{ coinInfo.balance }}</p>
          <p>{{ $t('asset.wallet.freeze') }}: 0.00000000 </p>
        </div>
      </div>
      <ul class="oprate">
        <li v-for="(item, index) in navList" @click="toOprate(index)" :key="index">
          <div class="routes">
            <span>{{item}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="lists" v-if="tradeRecords.length > 0">
      <van-list v-model="loading" :finished="finished" :finished-text="$t('global.noMore')" @load="getRecords">
        <ul class="list" v-for="(item, index) in tradeRecords" :key="index" @click="toFundsDetails(item)">
          <li><p>{{ item.categoryTitle }}</p><img src="@/static/img/right.png"></li>
          <li>
            <p>{{ $t('global.amount') }}</p>
            <p>{{ $t('global.status') }}</p>
            <p>{{ $t('global.time') }}</p>
          </li>
          <li>
            <p>{{ item.amount }}</p>
            <p>{{ item.statusText}}</p>
            <p>{{ item.gmtCreate }}</p>
          </li>
        </ul>
      </van-list>
    </div>
    <div v-else>
      <NoData />
    </div>
  </div>
</template>
<script>
import { getCookie, decryptByDES, filterPoint } from '@/utils/utils';
import NoData from '@/components/empty';
import { mapActions } from 'vuex'
export default {
  components: {
    NoData
  },
  data () {
    return {
      userId: '',
      isShow: true,
      coinInfo: {},
      tradeRecords: [],
      id: 1,
      bgStyle: {
        backgroundImage: "url("+require('@/static/img/asset/bg.jpg')+")"
      },
      finished: false,
      loading: false,
      currentPage: 1,
      navList: [this.$t('asset.charge.title'), this.$t('asset.withdraw.title'), this.$t('asset.transfer.title')]
    }
  },
  mounted() {
    const { name} = this.$route.params;
    const accountDetails = JSON.parse(localStorage.getItem('accountDetails')) || [];
    const index = accountDetails.findIndex((element) => {
      return name.toUpperCase() === element.enName.toUpperCase();
    })
    this.id = index < 0 ? accountDetails[0].coinType : accountDetails[index].coinType
    this.userId = decryptByDES(getCookie('token')) || '';
    this.getRecords();
    const coinInfo = JSON.parse(localStorage.getItem('coinInfo') || []);
    this.coinInfo = coinInfo;
  },
  methods: {
    ...mapActions(['getTradeRecords']),
    toOprate(index) {
      if (index === 0) {
        this.$router.push(`/asset/charge/${this.id}`)
      } else if (index === 1) {
        this.$router.push(`/asset/withdraw/${this.id}`)
      } else if (index === 2) {
        const coinContracts= JSON.parse(localStorage.getItem('coinContracts'));
        let index2 = coinContracts.findIndex((element) => {
          return parseInt(element.coinType) === parseInt(this.id);
        })
        index2 = index2 < 0 ? 0 : index2;
        const transferInfo = {
          coinType: this.id,
          contId: coinContracts[index2].contractAccountList[0].contId
        }
        sessionStorage.setItem('transferInfo', JSON.stringify(transferInfo))
        this.$router.push(`/asset/transfer/0`)
      }
    },
    getRecords() {
      this.finished = false;
      this.loading = true;
      const data = `userId=${this.userId}&category=0&pageNum=${this.currentPage}&pageSize=10&coinType=${this.id}`;
      this.getTradeRecords(data).then((res) => {
        this.loading = false;
        this.finished = res.isLastPage;
        this.currentPage = this.currentPage + 1;
        res.list.forEach((element) => {
          element.coinName2 = element.coinName.split('(')[0];
          element.amount = filterPoint(element.amount, 8)
          if (parseInt(element.category) === 1) {
            element.categoryText = this.$t('asset.withdraw.title');
            element.categoryTitle = this.$t('asset.withdraw.title');
            if (parseInt(element.status) === 0) {
              element.statusText = this.$t("asset.wallet.inreview");
            } else if (parseInt(element.status) === 1) {
              element.statusText = this.$t('asset.wallet.completed');
            } else if (parseInt(element.status) === -1) {
              element.statusText = this.$t('asset.wallet.refused');
            }
          } else if (parseInt(element.category) === 2) {
            element.categoryText = this.$t('asset.charge.title');
            element.categoryTitle = this.$t('asset.charge.title');
            if (element.status === 1) {
              element.statusText = this.$t('asset.wallet.completed');
            } else {
              element.statusText = this.$t('asset.wallet.confirm');
            }
          } else if (parseInt(element.category) === 3) {
            element.categoryText = this.$t('asset.transfer.title');
            element.types = parseInt(element.contractType) > 100 ? this.$t('asset.transfer.option') : this.$t('asset.transfer.contract');
            element.statusText = this.$t('asset.wallet.completed');
            if (element.fundsTransfer === 1) {
              element.direction = `${this.$t('asset.transfer.wallet')} ${this.$t('asset.transfer.to')} ${element.contName}${element.types}`;
              element.categoryTitle = `${this.$t('asset.transfer.title')}${this.$t('global.out')}${element.contractType > 100 ? this.$t('asset.transfer.option') : this.$t('asset.transfer.contract')}`;
            } else {
              element.direction = `${element.contName}${element.types} ${this.$t('asset.transfer.to')} ${this.$t('asset.transfer.wallet')}`;
              element.categoryTitle = `${element.contractType > 100 ? this.$t('asset.transfer.option') : this.$t('asset.transfer.contract')}${this.$t('asset.transfer.title')}${this.$t('global.in')}`;
            }
          }
        });
        this.tradeRecords = this.tradeRecords.concat(res.list);
      })
    },
    toFundsDetails(details) {
      localStorage.setItem('record', JSON.stringify(details));
      this.$router.push(`/asset/funds/record/${details.recordId}`)
    },
    toTransfer() {
      const { contId, coinType} = this.$route.query;
      const transferInfo = {
        coinType: coinType,
        contId: contId
      }
      sessionStorage.setItem('transferInfo', JSON.stringify(transferInfo))
      this.$router.push('/asset/transfer/1')
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
  .info{
    position: relative;
    height: 125px;
    margin-bottom: 15px;
  }
.bg{
  display: flex;
  justify-content: space-between;
  width: 340px;
  height: 100px;
  border-radius: 2px;
  background-color: #007AFF;
  margin: 10px auto;
  font-family: 'Medium';
  background-size: 340px 150px;
  background-position: center;
  position: relative;
  .bg_left{
    padding-top: 10px;
    padding-left: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    font-size: 12px;
    line-height: 16px;
    img{
      width: 28px;
      height: auto;
      margin-bottom: 8px;
      border-radius: 50%;
      border: solid 1px #ffffff;
    }
  }
  .bg_right{
    padding-right: 15px;
    padding-top: 13px;
    line-height: 16px;
    font-size: 12px;
    color: #ffffff;
    text-align: right;
  }
  .bg_bottom{
    position: absolute;
    bottom: 10px;
    right: 12px;
    height: 24px;
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 12px;
    font-family: 'Medium';
    img{
      width: 24px;
      height: 24px;
      margin-right: 3px;
    }
  }
}
.oprate{
  font-family: 'Medium';
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  position: absolute;
  bottom: 0;
  width: 284px;
  height: 50px;
  left: 26px;
  align-items: center;
  justify-content: space-around;
  background-color: #ffffff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  li{
    .routes{
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #24324C;
      img{
        width: 32px;
        height: 24px;
        margin-right: 10px;
      }
    }
  }
}
.list{
  width: 375px;
  height: 90px;
  font-family: 'Medium';
  margin: 0 auto;
  border-bottom: solid 1px #f1f1f1;
  background-color: #ffffff;
  &:nth-last-child(1) {
    border-bottom: none;
  }
  li{
    width: 340px;
    margin: 0 auto;
    align-items: center;
    display: flex;
    &:nth-child(1){
      padding-top: 11px;
      height: 24px;
      justify-content: space-between;
      margin-bottom: 4px;
      font-family: 'Bold';
      font-size: 14px;
      img{
        width: 11px;
        height: 11px;
      }
    }
    &:nth-child(2){
      margin-bottom: 4px;
      color: #A7AFBC;
      font-size: 12px;
    }
    &:nth-child(3){
      color: #24324C;
      font-size: 12px;
      font-family: Bold;
    }
    p:nth-child(1){
      width: 127px;
      text-align: left;
    }
    p:nth-child(2){
      width: 107px;
      text-align: left;
    }
    p:nth-child(3){
      width: 107px;
      text-align: right;
    }
  }
}

</style>
