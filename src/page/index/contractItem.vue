<template>

  <div class="contract_item">
    <ul class="item_info" @click="toTrading(contName)">
      <li>
        <p class="coin_type">{{ details.contName }}</p>
      </li>
      <li>
        <p :class="[details.rate.indexOf('-') >= 0 ? 'red' : 'green', 'coin_type']">${{ details.price }}</p>
        <p>￥{{ (details.price * rate).toFixed(4)}}</p>
      </li>
      <li>
        <button :class="[details.rate.indexOf('-') >= 0 ? 'red' : 'green', 'btn']">{{ details.rate }}</button>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  props: ['details', 'contName', 'rate'],
  mounted() {
  },
  methods: {
    ...mapActions(['getRate']),
    toTrading(contName) {
      this.$router.push({
        query: { name: contName },
        path: '/trading'
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .contract_item{
    width: 340px;
    height: 50px;
    background-color: #ffffff;
    margin: 0 auto 10px;
    border-radius: 4px;
    .item_info{
      display: flex;
      padding-top: 10px;
      li{
        text-align: left;
        &:nth-child(1){
          margin-left: 10px;
          width: 140px;
          p:nth-child(1){
            color: #24324C;
            font-size: 14px;
            font-family: 'Medium';
            line-height: 36px;
          }
        }
        &:nth-child(2){
          width: 110px;
          p:nth-child(1){
            img{
              width: 15px;
              height: 12px;
              margin-right: 5px;
            }
            color: #00D183;
            font-family: 'Bold';
            font-size: 16px;
            &.green {
              color: #00D183;
            }
            &.red{
              color: #FF3A30;
            }
          }
          p:nth-child(2){
            color: #9099A7;
            font-size: 10px;
            font-family: 'Bold';
          }
        }
        &:nth-child(3){
          .btn{
            width: 68px;
            height: 30px;
            line-height: 30px;
            font-family: 'Medium';
            border-radius: 2px;
            font-size: 14px;
            margin: 0;
            &.green {
              background-color: #00D183;
            }
            &.red{
              background-color: #FF3A30;
            }
          }
        }
      }
    }
  }
  
</style>
