<template>
  <div>
    <p class="title2">{{ $t('option.addEntrust') }}</p>
    <img class="close" src="@/static/img/close.png" @click="close()" alt="">
    <ul class="items">
      <li class="item">
        <label for="">{{ $t('option.orderType') }}</label>
        <div>
          <p>{{ optionList[optionIdx].coinName }}{{ $t('global.margin') }}<span class="transfer" @click="toTransfer()">{{ $t('asset.fund.transfer') }}</span></p>
        </div>
      </li>
      <li class="item">
        <label for="">{{ $t('option.orderCycle') }}</label>
        <div>
          {{ addTime1 }}<span>{{ $t('asset.transfer.to') }}</span>{{ addTime2 }}
        </div>
      </li>
      <li class="item">
        <label for="">{{ $t('option.amount') }}({{ $t('option.copy') }})</label>
        <div>
          <input type="text" :placeholder="copy" :value="sheetValue === 0 ? '' : sheetValue" @input="changeCount()">
          <span>{{ $t('option.copy') }}</span>
        </div>
      </li>
      <li class="item">
        <label for="" />
        <div class="sheetItem">
          <p v-for="(item, index) in sheetList" :key="index" :class="sheetIdx === index ? 'active' : ''" @click="changeSheetIdx(index)">{{ item }}%</p>
        </div>
      </li>
    </ul>
    <button class="btn" @click="addEntrust()">
      <span>{{ type === 1 ? $t('contract.index.rose') : $t('contract.index.fall') }}</span>
      <img v-if="type === 1" src="@/static/img/contract/up.png" alt="">
      <img v-else src="@/static/img/contract/down.png" alt="">
    </button>
  </div>
</template>
<script>
import { filterPoint } from '@/utils/utils';
export default {
  name: 'Index',
  components: {
  },
  props: ['addTime1', 'addTime2', 'maxSheet', 'serviceCharge', 'type', 'optionList', 'optionIdx', 'timeList', 'timeIdx'],
  data () {
    return {
      sheetList: [10, 20, 50, 75, 100],
      sheetIdx: -1,
      sheetValue: 0,
      poundage: 0,
      copy: '',
      radio: 0
    }
  },
  watch: {
    optionIdx: function(newVal) {
      this.copy = `${this.optionList[newVal].coinName === 'USDT' ? this.timeList[this.timeIdx].usdt : this.timeList[this.timeIdx].eth}${this.optionList[newVal].coinName}/${this.$t('option.copy')}`;
    },
    timeIdx: function(newVal) {
      this.copy = `${this.optionList[this.optionIdx].coinName === 'USDT' ? this.timeList[newVal].usdt : this.timeList[newVal].eth}${this.optionList[this.optionIdx].coinName}/${this.$t('option.copy')}`;
    }
  },
  mounted() {
    this.copy = `${this.optionList[this.optionIdx].coinName === 'USDT' ? this.timeList[this.timeIdx].usdt : this.timeList[this.timeIdx].eth}${this.optionList[this.optionIdx].coinName}/${this.$t('option.copy')}`;
    this.radio = this.optionList[this.optionIdx].contId;
  },
  methods: {
    toTransfer() {
      const transferInfo = {
        coinType: this.optionList[this.optionIdx].coinId,
        contId: this.optionList[this.optionIdx].contId
      }
      sessionStorage.setItem('transferInfo', JSON.stringify(transferInfo))
      this.$router.push('/asset/transfer/0')
    },
    changeSheetIdx(index) {
      this.sheetIdx = index;
      this.sheetValue = Math.floor(parseInt(this.maxSheet) * parseInt(this.sheetList[index]) / 100);
      this.poundage = this.sheetValue === '' ? 0 : filterPoint(parseInt(this.sheetValue) * parseFloat(this.serviceCharge), 2);
    },
    changeCount() {
      this.sheetValue = event.target.value.replace(/\D/g,'');
      this.sheetValue = parseInt(this.sheetValue) > parseInt(this.maxSheet) ? this.maxSheet : this.sheetValue;
      this.poundage = this.sheetValue === '' ? 0 : filterPoint(parseInt(this.sheetValue) * parseFloat(this.serviceCharge), 2);
    },
    addEntrust() {
      if (this.sheetValue <= 0) {
        this.$toast(this.$t('notice.addGuess'));
        return false;
      }
      this.$emit('addEntrust', this.sheetValue)
    },
    close() {
      this.$emit('closeOprate')
    }
  },
}
</script>
<style lang="less" scoped>
  .title2 {
    line-height: 48px;
    height: 48px;
    padding-left: 17px;
    font-size: 16px;
    border-top: solid 1px #e1e1e1;
    font-weight: bold;
  }
  .close{
    position: absolute;
    top: 15px;
    right: 15px;
    width: 20px;
  }
  .items{
    width: 340px;
    margin: 10px auto 10px;
    font-size: 13px;
    .item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      &:nth-child(1){
        div{
          border: solid 1px transparent;
          padding-left: 0;
          padding-right: 0;
          width: 240px;
        }
      }
      div{
        width: 220px;
        padding-left: 10px;
        padding-right: 10px;
        height: 24px;
        border: solid 1px #e1e1e1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 2px;
        overflow: hidden;
        input{
          border: none;
        }
        .transfer{
          padding-left: 8px;
          color: #007aff;
        }
        .radios{
          div{
            justify-content: initial;
          }
        }
        &.sheetItem{
          padding: 0;
          width: 240px;
          p{
            width: 20%;
            height: 24px;
            line-height: 24px;
            border-right: solid 1px #e1e1e1;
            text-align: center;
            &:nth-last-child(1) {
              border-right: none;
            }
            &.active{
              background-color: #007aff;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  .btn{
    height: 36px;
    line-height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 45px;
    img{
      width: 20px;
      margin-left: 4px;
    }
  }
</style>
