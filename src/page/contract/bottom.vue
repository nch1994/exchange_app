<template>
  <div class="contract_entrust">
    <div class="contract_entrust_title">
      <ul class="contract_entrust_title_left">
        <li v-for="(item, index) in $t('contract.index.recordsType')" :class="recordIdx === index ? 'active' : ''" :key="index" @click="changeIdx(index)">
          <span>{{item}}</span>
          <span />
        </li>
      </ul>
    </div>
    <div v-show="recordIdx === 0">
      <ul class="contract_entrust_list" v-if="entrustList.length > 0">
        <li v-for="(item, index) in entrustList" :key="index">
          <p><span>{{ item.contName }} {{ item.recText }}</span><span style="color: #3e4551;">{{ item.createTime }}</span> <span @click="cancle(item.recId)">{{ $t('contract.index.action') }}</span></p>
          <table>
            <tr>
              <th>{{ $t('contract.index.entrustCount') }} ({{ $t('asset.record.piece') }})</th>
              <th>{{ $t('contract.index.entrustPrice') }} ({{ unit2 }})</th>
              <th>{{ $t('contract.index.margin') }}({{unit}})</th>
            </tr>
            <tr>
              <td>{{ item.sheet }}</td>
              <td>{{ item.average }}</td>
              <td>{{ item.bond }}</td>
            </tr>
            <tr>
              <th>{{ $t('asset.record.volume') }}({{ $t('asset.record.piece') }})</th>
              <th>{{ $t('asset.record.transactionAverage') }}({{ unit2 }})</th>
              <th>{{ $t('contract.index.poundage') }}({{ unit }})</th>
            </tr>
            <tr>
              <td>0</td>
              <td>{{ transactionAverage }}</td>
              <td>{{ poundage }}</td>
            </tr>
          </table>
        </li>
      </ul>
      <div v-else>
        <NoData />
      </div>
    </div>
    <div v-show="recordIdx === 1">
      <ul v-show="stopRecordList.length > 0">
        <li v-for="(item, index) in stopRecordList" :key="index" class="stoplist_item">
          <div class="stoplist_title">
            <p>{{ item.recText }}*{{ item.timesText }}</p>
            <p @click="revoke(item.recId, item.recType)">{{ $t('global.revoke') }}</p>
          </div>
          <ul class="stoplist_info">
            <li><p>{{ $t('contract.index.coinType') }}</p><p>{{ item.contName2 }}</p></li>
            <li><p>{{ $t('contract.index.triggerPrice') }}</p><p>{{ item.price }}</p></li>
            <li><p>{{ $t('contract.index.entrustCount') }}</p><p>{{ item.sheet }}%</p></li>
          </ul>
        </li>
      </ul>
      <div v-show="stopRecordList.length === 0">
        <NoData />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { filterDigit, filterPoint, filterDigitPoundage } from '@/utils/utils';
import NoData from '@/components/empty';
export default {
  components: {
    NoData
  },
  props: ['recordIdx', 'contractIdx', 'entrustList', 'stopRecordList'],
  data () {
    return {
      transactionAverage: 0,
      poundage: 0,
      unit: 'USDT',
      unit2: 'USDT'
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  watch: {
    contractIdx: function(newVal) {
      this.transactionAverage = filterPoint(0, filterDigit(this.contractList[newVal].contName));
      this.poundage = filterPoint(0, filterDigitPoundage(this.contractList[newVal].contName));
      this.unit = this.contractList[newVal].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[newVal].contName.indexOf('(') > -1 ? this.contractList[newVal].contName.match(/\((\S*)\)/)[1] : this.contractList[newVal].contName.split('/')[0]
      this.unit2 = this.contractList[newVal].contName.indexOf('USDT') > -1 ? 'USDT' : 'USD';
    }
  },
  mounted() {
    this.transactionAverage = filterPoint(0, filterDigit(this.contractList[this.contractIdx].contName));
    this.poundage = filterPoint(0, filterDigitPoundage(this.contractList[this.contractIdx].contName));
    this.unit = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[this.contractList].contName.indexOf('(') > -1 ? this.contractList[this.contractIdx].contName.match(/\((\S*)\)/)[1] : this.contractList[this.contractIdx].contName.split('/')[0]
    this.unit2 = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : 'USD';
  },
  methods: {
    ...mapActions(['cancelEntrust']),
    revoke(recId, recType) {
      this.$emit('cancelStop', recId, recType)
    },
    changeIdx(index) {
      this.$emit('changeRecordIdx', index)
    },
    cancle(id) {
      const data = {
        recId: id
      }
      this.cancelEntrust(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
      }).catch(() => {
        this.$toast(msg || this.$t('global.wait'));
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .contract_entrust{
    width: 340px;
    background-color: #ffffff;
    border-radius: 2px;
    margin: 0 auto;
    .contract_entrust_title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 46px;
      border-bottom: solid 1px #EAF5FF;
      .contract_entrust_title_left{
        font-size: 12px;
        color: #24324C;
        font-family: 'Medium';
        display: flex;
        justify-content: space-between;
        padding-left: 15px;
        padding-right: 15px;
        height: 40px;
        li{
          font-size: 14px;
          color: #24324C;
          height: 25px;
          line-height: 25px;
          font-family: 'Semibold';
          padding-top: 7px;
          margin-right: 18px;
          span:nth-child(2) {
            width: 28px;
            height: 2px;
            background-color: transparent;
            border-radius: 1px;
            display: block;
            margin: 2px auto 0;
          }
          &.active{
            font-size: 14px;
            color: #007AFF;
            span:nth-child(2) {
              background-color: #007AFF;
              border-radius: 1px;
            }
          }
        }
      }
      .contract_entrust_title_right{
        padding-right: 18px;
        display: flex;
        align-items: center;
        span{
          margin-right: 6px;
          color: #A7AFBC;
          font-size: 12px;
        }
        img{
          width: 11px;
          height: 11px;
        }
      }
    }
    .contract_entrust_list{
      font-family: 'Medium';
      padding-left: 13px;
      padding-right: 12px;
      padding-top: 5px;
      padding-bottom: 10px;
      border-bottom: dashed 1px #EAF5FF;
      li {
        border-bottom: dashed 1px #EAF5FF;
        padding-top: 4px;
        padding-bottom: 4px;
      }
      p{
        color: #007AFF;
        font-size: 12px;
        font-family: 'Medium';
        text-align: left;
        height: 36px;
        line-height: 36px;
        display: flex;
        justify-content: space-between;
      }
      table{
        width: 316px;
        tr{
          height: 20px;
          line-height: 20px;
          th{
            color: #B2B8C4;
            font-size: 12px;
            text-align: left;
            font-weight: normal;
            &:nth-child(3){
              text-align: right;
            }
          }
          td{
            color: #3E4551;
            font-family: Bold;
            text-align: left;
            font-size: 16px;
            &:nth-child(3){
              text-align: right;
            }
          }
        }
      }
    }
    .stoplist_item{
      border-bottom: dashed 1px #EAF5FF;
      padding: 4px 12px 4px 13px;
    }
    .stoplist_title{
      display: flex;
      justify-content: space-between;
      line-height: 36px;
      height: 36px;
      color: #3e4551;
      font-size: 13px;
      P:nth-child(2) {
        color: #007aff;
      }
    }
    .stoplist_info{
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      li{
        text-align: left;
        &:nth-child(2) {
          text-align: center;
        }
        &:nth-child(3) {
          text-align: right;
        }
        p{
          line-height: 20px;
          &:nth-child(1) {
            color: #b2b8c4;
          }
          &:nth-child(2) {
            color: #3e4551;
          }
        }
      }
    }
  }
</style>
