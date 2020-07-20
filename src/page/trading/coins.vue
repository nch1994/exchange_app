<template>
  <div class="price_wrap">
    <p class="usdt" :style="{ color: contractList[curIndex].rate.indexOf('-') >= 0 ? '#FF3A30' : '#00D183'}">${{ contractList[curIndex].price }}</p>
    <p class="cny">
      <span>≈{{ (contractList[curIndex].price * rate).toFixed(4) }}</span>
      <span :style="{ color: contractList[curIndex].rate.indexOf('-') >= 0 ? '#FF3A30' : '#00D183' }">{{ contractList[curIndex].rate }}</span>
    </p>
  </div>
</template>
<script>


import { mapActions, mapState } from 'vuex';
export default {
  props: ['curIndex'],
  data() {
    return {
      rate: 0
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  mounted() {
    this.getRate().then((res) => {
      this.rate = parseFloat(res.rate)
    })
  },
  methods: {
    ...mapActions(['getRate']),
  }
}
</script>
<style lang="less" scoped>
  .price_wrap{
    padding-left: 16px;
    .usdt{
      font-size: 18px;
    }
    .cny{
      height: 30px;
      line-height: 30px;
      span{
        font-size: 12px;
        color: #787b86;
      }
    }
  }
</style>
