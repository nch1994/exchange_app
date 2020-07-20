<template>
  <div class="content">
    <div class="contract_title">
      <div class="kaicang_title">
        <div class="kaicang_title_left" @click="showContractChoose = true">
          <span>{{ contractList[contractIdx].contName }}</span>
          <img src="@/static/img/contract/bottom.png" alt="">
        </div>
      </div>
      <div class="navtop_right">
        <router-link :to="{path: '/trading', query: { index: contractIdx }}">
          <img src="@/static/img/contract/types.png" alt="">
        </router-link>
        <router-link :to="{path: `/contract/record/${contractIdx}`}">
          <img src="@/static/img/asset/record.png" alt="">
        </router-link>
      </div>
      
    </div>
    <div class="contract_info">
      <ul class="contract_types_info">
        <li v-for="(item, index) in $t('contract.index.types')" :key="index" :class="curIndex === index ? 'active' : ''" @click="changeIdx(index)">
          <span>{{item}}</span>
          <span />
        </li>
      </ul>
      <div v-show="curIndex === 0 || curIndex === 1">
        <kaicangItem :contSwitch="contSwitch" @showConfirm="subEntrustFn" :canFlatMore="canFlatMore" :canFlatEmpty="canFlatEmpty" :contractIdx="contractIdx" :assetInfo="myAssetInfo" :curIndex="curIndex" />
      </div>
      <div v-show="curIndex === 2">
        <ChicangItem :contractIdx="contractIdx" :contSwitch="contSwitch" :myAssetInfo="myAssetInfo" :holdList="holdList" @showConfirm="subEntrustFn" />
      </div>
    </div>
    <div class="contract_entrust" v-show="curIndex !== 2">
      <Bottom :recordIdx="recordIdx" :entrustList="entrustList" :stopRecordList="stopRecordList" :contractIdx="contractIdx" @cancelStop="cancelStopfn" @changeRecordIdx="changeRecordIdx" />
    </div>
    <div v-show="showConfirm" class="">
      <ConfirmKaicang @cancle="showConfirm = false" @confirm="confirm" />
    </div>
    <div v-show="showSuccess">
      <SuccessNotice @cancel="showSuccess=false" />
    </div>
    <van-popup v-model="showContractChoose" position="left" :style="{ width: '70%', height: '100%' }">
      <AccountList :curIdx="contractIdx" @confirm="changeContractIdx" @cancel="showContractChoose = false" />
    </van-popup>
  </div>
</template>
<script>
import KaicangItem from './kaicang_item.vue'
import ChicangItem from './chicang_item.vue'
import ConfirmKaicang from './confirm_kaicang.vue'
import SuccessNotice from './success_notice.vue'
import AccountList from '@/components/leftList.vue';
import Bottom from './bottom'
import { mapActions, mapState } from 'vuex';
import { getCookie, baseUrl, filterRecType, filterPoint, filterDigit, decryptByDES, filterDigitPoundage } from '@/utils/utils';
import numeral from 'numeral'
import moment from 'moment'

let contractSource = null;
let contractSourceTimer = null;

export default {
  name: 'Contract',
  components: {
    KaicangItem,
    ConfirmKaicang,
    ChicangItem,
    SuccessNotice,
    AccountList,
    Bottom
  },
  data () {
    return {
      contractIdx: 0,
      curIndex: 0,
      showConfirm: false,
      showSuccess: false,
      showContractChoose: false,
      recordIdx: 0,
      entrustList: [],
      holdList: [],
      contSwitch: 0,
      canFlatMore: 0,
      canFlatEmpty: 0,
      myAssetInfo: {
        balance: 0
      },
      stopRecordList: []
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  watch: {
    contractIdx: function(newVal) {
      this.contSwitch = this.contractList[newVal].contSwitch || 0;
    }
  },
  mounted() {
    const userId = decryptByDES(getCookie('token')) || '';
    const index = this.contractList.findIndex((item) => {
      return item.contName === this.$route.query.name;
    })
    this.contractIdx = index < 0 ? 0 : index;
    this.contSwitch = this.contractList[this.contractIdx].contSwitch || 0;
    if (userId !== '') {
      this.getContractSource()
      this.getStopRecordList();
    }
  },
  beforeDestroy() {
    if (contractSource) {
      contractSource.close();
    }
    clearTimeout(contractSourceTimer);
  },
  methods: {
    ...mapActions(['getAsset', 'getEntrust', 'subEntrust', 'getStopList', 'cancelStop']),
    changeIdx (index) {
      this.curIndex = index;
      this.getStopRecordList();
    },
    changeRecordIdx (index) {
      this.recordIdx = index;
      this.getStopRecordList();
    },
    cancelStopfn(recId, recType) {
      this.cancelStop(`${recId}/${recType}`).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        this.getStopRecordList();
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'));
      })
    },
    subEntrustFn(average, sheet, recType) {
      const contId = this.contractList[this.contractIdx].contId
      const userId = decryptByDES(getCookie('token'));
      // recType 1开多 0开空 11平多 10平空
      const subEntrustData = { average, sheet, recType, userId, contId };
      this.subEntrust(subEntrustData).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'));
      })
    },
    getStopRecordList() {
      const userId = decryptByDES(getCookie('token')) || '';
      if (userId === '') return;
      if (this.recordIdx === 0) return;
      const contId = this.contractList[this.contractIdx].contId;
      const data = `${userId}/${contId}?pageNum=1&pageSize=10`;
      this.getStopList(data).then((res) => {
        res.list = res.list.filter((element) => {
          return parseInt(element.deleted) === 0
        })
        res.list.forEach((element) => {
          element.recText = element.recType === 1 ? `${this.$t('global.profit')}` : `${this.$t('global.loss')}`;
          element.timesText = element.times === 0 ?  `${this.$t('global.original')}` : `${element.times}${this.$t('global.hour')}`;
          element.price = filterPoint(element.price || 0, filterDigit(element.contName));
          element.openText = filterRecType(element.openType);
          element.contName2 = `${element.contName}*${element.openText}`;
        })
        this.stopRecordList = res.list;
      })
    },
    getContractSource() {
      const _this = this;
      const userId = decryptByDES(getCookie('token')) || ''
      contractSource = new EventSource(`${baseUrl}sse/getContract?contId=${this.contractList[this.contractIdx].contId}&userId=${userId}`);
      contractSource.onmessage = function (event) {
        const {assets, entrust, hold } = JSON.parse(event.data)
        entrust.forEach((element) => {
          element.createTime = moment(element.createTime).format('MM-DD hh:mm');
          element.recText = filterRecType(element.recType);
          element.bond = element.bond ? filterPoint(element.bond, filterDigitPoundage(element.contName)) : filterPoint(0, filterDigitPoundage(element.contName));
          element.serviceCharge = element.serviceCharge ? filterPoint(element.serviceCharge, filterDigitPoundage(element.contName)) : filterDigitPoundage(0, filterDigit(element.contName));
          element.average = element.average ? filterPoint(element.average, filterDigit(element.contName)) : filterPoint(0, filterDigit(element.contName));
        })
        hold.forEach(element => {
          element.averagePosition = element.average ? filterPoint(element.average, filterDigit(element.contName)) : filterPoint(0, filterDigit(element.contName)); // 持仓均价
          element.profit = element.profit ? filterPoint(element.profit, filterDigitPoundage(element.contName)) : filterPoint(0, filterDigitPoundage(element.contName)); // 未实现盈亏 收益
          element.rate = numeral(element.rate).format('0.00%'); // 收益率
          element.predict = element.predict ? filterPoint(element.predict, filterDigit(element.contName)) : filterPoint(0, filterDigit(element.contName));  // 预估强平价
          element.bond = element.bond ? filterPoint(element.bond, filterDigitPoundage(element.contName)) : filterPoint(0, filterDigitPoundage(element.contName)); // 保证金
          if (element.recType === 1) { // 可平量
            _this.canFlatMore = element.usable || 0
          } else if (element.recType === 0) {
            _this.canFlatEmpty = element.usable || 0
          }
        });
        assets.balance = assets.balance ? filterPoint(assets.balance, filterDigitPoundage(assets.contName || 'BTC')) : filterPoint(0, filterDigitPoundage(assets.contName || 'BTC'));
        assets.settle = assets.settle ? filterPoint(assets.settle, filterDigitPoundage(assets.contName || 'BTC')) : filterPoint(0, filterDigitPoundage(assets.contName || 'BTC'));
        assets.bondRate = numeral(assets.bondRate).format('0.00%'); // 收益率
        assets.usable = _this.contractList[_this.contractIdx].contName.indexOf('USDT') > -1 ? filterPoint(assets.usable, filterDigitPoundage(assets.contName || 'BTC')) : filterPoint(assets.usable, filterDigitPoundage(assets.contName || 'BTC'));
        assets.profit = assets.profit ? filterPoint(assets.profit, filterDigitPoundage(assets.contName || 'BTC')) : filterPoint(0, filterDigitPoundage(assets.contName || 'BTC'));
        _this.myAssetInfo = assets;
        _this.holdList = hold;
        _this.entrustList = entrust;
        _this.$forceUpdate()
      };
      contractSource.onerror = function (err) {
        if (err.currentTarget.readyState === 2) {
          contractSourceTimer = setTimeout(() => {
            _this.getContractSource()
            clearTimeout(contractSourceTimer);
          }, 3000)
        }
      }
    },
    confirm () {
      this.showConfirm = false;
      this.showSuccess = true;
    },
    changeContractIdx(index) {
      this.contractIdx = index;
      this.showContractChoose = false;
      this.canFlatMore = 0;
      this.canFlatEmpty = 0;
      const userId = decryptByDES(getCookie('token')) || '';
      if (userId !== '') {
        contractSource.close()
        this.getContractSource()
        this.getStopRecordList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .content{
    padding-bottom: 60px;
  }
  .kaicang_title{
    height: 20px;
    padding: 11px 15px 13px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .kaicang_title_left{
      display: flex;
      align-items: center;
      height: 20px;
      color: #24324C;
      font-size: 14px;
      font-family: 'Medium';
      img{
        padding-left: 4px;
        width: 11px;
        height: 6px;
      }
    }
  }
  .contract_title{
    padding-top: 13px;
    padding-left: 18px;
    padding-bottom: 11px;
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    font-family: 'Semibold';
    img{
      width: 16px;
      height: 16px;
      margin-right: 7px;
    }
    .navtop_right{
      a{
        padding-right: 10px;
      }
      font-size: 12px;
      color: #24324C;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding-right: 7px;
    }
  }
  .contract_info{
    width: 340px;
    background-color: #ffffff;
    margin: 0 auto 10px;
    .contract_types_info{
      display: flex;
      justify-content: space-between;
      padding-left: 15px;
      padding-right: 15px;
      height: 40px;
      border-bottom: solid 1px #F7FAFD;
      margin-bottom: 12px;
      li{
        font-size: 16px;
        color: #24324C;
        height: 25px;
        line-height: 25px;
        font-family: 'Semibold';
        padding-top: 7px;
        span:nth-child(2) {
          width: 28px;
          height: 2px;
          background-color: transparent;
          border-radius: 1px;
          display: block;
          margin: 7px auto 0;
        }
        &.active{
          font-size: 18px;
          color: #007AFF;
          span:nth-child(2) {
            background-color: #007AFF;
            border-radius: 1px;
          }
        }
      }
    }
  }
  
  
</style>
