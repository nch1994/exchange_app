<template>
  <div class="mask">
    <div class="prompt">
      <img src="@/static/img/contract/success.png" class="icon" alt="">
      <img src="@/static/img/close.png" class="close" @click="cancel" alt="">
      <p class="text">{{ $t('contract.index.unwindSuccess') }}</p>
      <div class="table_title">
        <p>{{ $t('contract.index.flat') }}*100 BTC/USDT</p>
        <p><span>10/28 12:12</span>{{ $t('contract.index.traded') }}</p>
      </div>
      <table>
        <tr>
          <td>{{ $t('contract.index.EntrustAmount') }}({{ $t('contract.index.piece') }})</td>
          <td>{{ $t('contract.index.EntrustPrice') }}(BTC)</td>
          <td>{{ $t('contract.index.earnings') }}(USDT)</td>
        </tr>
        <tr>
          <td>54342</td>
          <td>3.23423</td>
          <td>7786.43</td>
        </tr>
        <tr>
          <td>{{ $t('contract.index.volume') }}({{ $t('contract.index.piece') }})</td>
          <td>{{ $t('contract.index.transactionAverage') }}(BTC)</td>
          <td>{{ $t('contract.index.poundage') }}(USDT)</td>
        </tr>
        <tr>
          <td>7786</td>
          <td>5.2342</td>
          <td>-0.234</td>
        </tr>
      </table>
    </div>
  </div>  
</template>
<script>
export default {
  name: 'SuccessNotice',
  data () {
    return {}
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>
<style lang="less" scoped>
  .mask{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    .prompt{
      width: 326px;
      padding-top: 25px;
      height: 305px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background-color: #ffffff;
      border-radius: 5px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      img.icon{
        width: 112px;
        height: 112px;
        margin-bottom: 7px;
      }
      img.close{
        width: 16px;
        height: 16px;
        position: absolute;
        top: 11px;
        right: 13px;
      }
      .text{
        height: 28px;
        line-height: 28px;
        color: #007AFF;
        font-size: 20px;
        font-family: 'Semibold';
      }
      .table_title{
        width: 285px;
        display: flex;
        justify-content: space-between;
        font-family: 'Medium';
        color: #007AFF;
        height: 24px;
        align-items: center;
        font-size: 12px;
        span{
          padding-right: 8px;
          color: #B2B8C4;
        }
      }
      table{
        width: 285px;
        font-size: 12px;
        tr{
          height: 20px;
          line-height: 20px;
          td{
            text-align: left;
            &:nth-child(3){
              text-align: right;
            }
          }
          &:nth-child(odd){
            color: #B2B8C4;
          }
          &:nth-child(even){
            color: #24324C;
            font-family: 'Bold';
          }
        }
      }
    }
    
  }
</style>
