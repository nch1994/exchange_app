<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('asset.wallet.recordDetails') }}</p>
      <span />
    </div>
    
    <div class="status"><p>{{ record.amount }}<span> {{ record.coinName2 }}</span></p><span>{{ record.statusText }}</span></div>
    <ul>
      <li class="item"><label>{{ $t('asset.wallet.type') }}</label><p>{{ record.categoryText }}</p></li>
      <li class="item" v-if="record.category === 1"><label>{{ $t('asset.wallet.address') }}</label><p>{{ record.address }}</p></li>
      <li class="item" v-if="record.category === 1"><label>{{ $t('asset.withdraw.poundage') }}</label><p>{{ record.poundage }}</p></li>
      <li class="item" v-if="record.category === 2"><label>{{ $t('asset.wallet.progress') }}</label><p>{{ record.rechargeProgress }}</p></li>
      <li class="item" v-if="record.category === 1 || record.category === 2"><label>HASH</label><p>{{ record.transactionId }}</p></li>
      <li class="item" v-if="record.coinName === 'EOS' && record.category !== 3"><label>MEMO</label><p>{{ record.memo }}</p></li>
      <li class="item" v-if="record.category === 3"><label>{{ $t('asset.wallet.direction') }}</label><p>{{ record.direction }}</p></li>
      <li class="item"><label>{{ $t('global.time') }}</label><p>{{ record.gmtCreate }}</p></li>
    </ul>
  </div>
</template>
<script>
import {  } from '@/utils/utils';
export default {
  data () {
    return {
      record: {
      }
    }
  },
  mounted() {
    this.record = JSON.parse(localStorage.getItem('record'));
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
  .status{
    display: flex;
    padding-left: 15px;
    padding-right: 15px;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    line-height: 48px;
    font-size: 18px;
    span{
      font-size: 12px;
    }
  }
  .item{
    border-bottom: solid 1px #f1f1f1;
    display: block;
    padding: 10px 15px 0;
    label{
      font-size: 12px;
      color: #A7AFBC;
    }
    p{
      word-wrap:break-word;
      padding-top: 6px;
      padding-bottom: 6px;
      line-height: 20px;
      font-size: 14px;
      color: #24324C;
    }
  }
</style>
