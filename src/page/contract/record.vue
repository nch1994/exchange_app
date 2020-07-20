<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('contract.index.history') }}</p>
      <span />
    </div>
    <div class="center">
      <div class="record_top">
        <RecordTop
          :showList="showList"
          :contractIdx="contractIdx" @changeContractIdx="changeContractIdx"
          :typesList="$t('asset.record.typesList')" :typesIdx="typesIdx" @changeTypesIdx="changeTypesIdx"
          :statusList="$t('asset.record.statusList')" :statusIdx="statusIdx" @changeStatusIdx="changeStatusIdx"
        />
      </div>
      <div class="record_lists" v-if="entrustList.length > 0">
        <van-list v-model="loading" :finished="finished" :finished-text="$t('global.noMore')" @load="getList">
          <div class="record_item" v-for="(item, index) in entrustList" :key="index">
            <RecordItem :details="item" :unit="unit" :unit2="unit2" />
          </div>
        </van-list>
      </div>
      <div v-else>
        <NoData />
      </div>
    </div>
  </div>
</template>
<script>
import RecordTop from './record_top'
import RecordItem from './record_item'
import { getCookie, filterRecType, filterPoint, filterDigit, decryptByDES, filterDigitPoundage } from '@/utils/utils';
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import NoData from '@/components/empty';

export default {
  name: 'AssetRecord',
  components: {
    RecordTop,
    RecordItem,
    NoData
  },
  data() {
    return {
      contractIdx: 0, // 合约
      typesIdx: 0, // 类型 开/平
      statusIdx: 0,  // 状态
      showList: true,
      entrustList: [],
      currentPage: 1,
      unit: 'USDT',
      unit2: 'USDT',
      pageSize: 10,
      finished: false,
      loading: false
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  watch: {
  },
  mounted() {
    // state 0是历史，1委托，2完成，3取消 不传是全部
    // recType  1开仓 2 平仓
    this.contractIdx = this.$route ? parseInt(this.$route.params.contractIdx) : 0;
    this.currentPage = 1;
    this.entrustList = [];
    this.getList();
    this.unit = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[this.contractIdx].contName.indexOf('(') > -1 ? this.contractList[this.contractIdx].contName.match(/\((\S*)\)/)[1] : this.contractList[this.contractIdx].contName.split('/')[0]
    this.unit2 = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : 'USD';
  },
  methods: {
    ...mapActions(['getEntrust']),
    back () {
      this.$router.push('/contract');
    },
    getList() {
      const userId = decryptByDES(getCookie('token'));
      const contId = this.contractList[this.contractIdx].contId;
      const recType = this.typesIdx === 0 ? 1 : 2;
      const state = this.statusIdx === 0 ? '' : this.statusIdx;
      const entrustData = this.statusIdx === 0 ? `userId=${userId}&contId=${contId}&recType=${recType}&pageNum=${this.currentPage}&pageSize=${this.pageSize}` : `userId=${userId}&contId=${contId}&recType=${recType}&state=${state}&pageNum=${this.currentPage}&pageSize=${this.pageSize}`;
      this.finished = false;
      this.loading = true;
      this.getEntrust(entrustData).then((res) => {
        res.list.forEach((element) => {
          element.createTime = moment(element.createTime).format("MM-DD hh:mm");
          element.profit = element.profit ? filterPoint(element.profit, filterDigitPoundage(element.contName)) : filterPoint(0, filterDigitPoundage(element.contName))
          element.profit = element.state === 2 ? element.profit : filterPoint(0, filterDigitPoundage(element.contName));
          element.sheet = element.sheet ? element.sheet : 0;
          element.average = element.average ? filterPoint(element.average, filterDigit(element.contName)) : filterPoint(0, filterDigit(element.contName));
          element.settle = element.settle ? filterPoint(element.settle, filterDigitPoundage(element.contName)) : filterPoint(0, filterDigitPoundage(element.contName));
          element.serviceCharge = element.serviceCharge ? filterPoint(element.serviceCharge, filterDigitPoundage(element.contName)) : filterPoint(0, filterDigitPoundage(element.contName));
          element.recText = filterRecType(element.recType) || '';
        })
        this.loading = false;
        this.finished = res.isLastPage;
        this.entrustList = this.entrustList.concat(res.list);
        this.currentPage = this.currentPage + 1;
      }).catch((err) => {
        console.log(err);
      })
    },
    changeContractIdx(index) {
      this.contractIdx = index;
      this.currentPage = 1;
      this.entrustList = [];
      this.getList();
      this.unit = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[this.contractIdx].contName.indexOf('(') > -1 ? this.contractList[this.contractIdx].contName.match(/\((\S*)\)/)[1] : this.contractList[this.contractIdx].contName.split('/')[0]
      this.unit2 = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : 'USD';
    },
    changeTypesIdx(index) {
      this.typesIdx = index;
      this.currentPage = 1;
      this.entrustList = [];
      this.getList();
    },
    changeStatusIdx(index) {
      this.statusIdx = index;
      this.currentPage = 1;
      this.entrustList = [];
      this.getList();
    },
    reSetData(dataList, num) {
      let arr = [];
      let len = dataList.length;
      for (let i = 0; i < len; i += num) {
        arr.push(dataList.slice(i, i + num));
      }
      return arr;
    }
  }
}
</script>
<style lang="less" scoped>
  .center{
    width: 340px;
    height: auto;
    margin: 11px auto 18px;
    border-radius: 2px;
    .record_top{
      background-color: #ffffff;
      padding-top: 12px;
      padding-bottom: 11px;
      border-bottom: solid 1px #F7FAFD;
    }
    .record_lists{
      background-color: #ffffff;
      .record_item{
        padding-top: 8px;
        padding-bottom: 10px;
        border-bottom: solid 1px #F7FAFD;
      }
    }
  }
</style>
