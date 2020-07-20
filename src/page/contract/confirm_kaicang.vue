<template>
  <div class="mask">
    <div class="bottom">
      <p>{{ $t('contract.index.recordsType[0]') }} BTC {{ $t('global.app') }}-{{ $t('contract.index.open') }}</p>
      <ul>
        <li>
          <span>{{ $t('contract.index.competitors') }}</span>
          <span>5643 USDT</span>
        </li>
        <li>
          <span>{{ $t('contract.index.count') }}（{{ $t('contract.index.piece') }}）</span>
          <span>876543</span>
        </li>
        <li>
          <span>{{ $t('contract.index.currentMargin') }}</span>
          <span>6543232</span>
        </li>
        <li>
          <span>{{ $t('contract.index.leverage') }}</span>
          <span>X100</span>
        </li>
        <li>
          <span>{{ $t('contract.index.rate') }}</span>
          <span>5462%</span>
        </li>
      </ul>
      <div class="button_wrap">
        <button class="btn cancle" @click="cancle">{{ $t('global.cancel') }}</button>
        <button class="btn confirm" @click="confirm">{{ $t('global.confirm') }}</button>
      </div>
    </div>
  </div>  
</template>
<script>


export default {
  data() {
    return {
      
    }
  },
  mounted() {
    
  }, 
  methods: {
    cancle() {
      this.$emit('cancle')
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
  .mask{
    width: 375px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    .bottom{
      position: fixed;
      z-index: 10;
      bottom: 0;
      left: 0;
      width: 375px;
      background-color: #ffffff;
      p{
        padding-top: 16px;
        padding-bottom: 15px;
        padding-left: 19px;
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        font-family: 'Medium';
        color: #24324C;
      }
      ul{
        padding-bottom: 4px;
        padding-left: 19px;
        padding-right: 32px;
        li{
          height: 40px;
          padding-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          span:nth-child(1){
            color: #24324C;
            font-family: 'Medium';
          }
          span:nth-child(2) {
            color: #9099A7;
            font-family: 'Regular';
          }
        }
      }
      .button_wrap{
        display: flex;
        padding-left: 19px;
        padding-right: 26px;
        justify-content: space-between;
        .btn{
          width: 157px;
          border-radius: 4px;
          height: 36px;
          line-height: 36px;
          margin-top: 0;
          &.cancle{
            background-color: #24324C;
          }
          &.confirm{
            background-color: #007AFF;
          }
        }
      }
    }
  }
</style>
