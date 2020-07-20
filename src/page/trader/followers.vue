<template>
  <div class="followers">
    <div class="left">
      <img v-if="details.icon" :src="details.icon" alt="">
      <img v-else src="@/static/img/default.png" alt="">
      <ul>
        <li>{{ details.nickName || 'STARQUEEN 用户' + details.userId }}</li>
        <li>{{ $t('homepage.money') }}：{{ details.bond }}</li>
      </ul>
    </div>  
    <div class="right">
      <p>{{ $t('homepage.profit') }}</p>
      <p :class="[details.profit < 0 ? 'red' : 'green']">{{ details.profit }}{{ coinType }}</p>
    </div>
  </div>  
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: ['details', 'contractIdx'],
  data() {
    return {
      coinType: ''
    }
  },
  computed: mapState([
    'contractList'
  ]),
  watch: {
    contractIdx: function(newVal) {
      this.coinType = this.contractList[newVal].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[this.contractIdx].contName.split('/')[0]
    }
  },
  mounted() {
    this.coinType = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[this.contractIdx].contName.split('/')[0]
  }
}
</script>
<style lang="less" scoped>
  .followers{
    width: 316px;
    padding: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
    background-color: #ffffff;
    border-radius: 4px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    .left{
      display: flex;
      align-items: center;
      img{
        width: 50px;
        height: 50px;
        vertical-align: middle;
        border-radius: 50%;
      }
      ul{
        font-size: 14px;
        color: #24324C;
        li:nth-child(1){
          padding-bottom: 6px;
        }
      }
    }
    .right{
      text-align: center;
      font-size: 14px;
      p:nth-child(1){
        padding-bottom: 6px;
      }
    }
  }
  .red{
    color: #FF3A30;
  }
  .green {
    color: #00D183;
  }
</style>
