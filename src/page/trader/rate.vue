<template>
  <div class="rates">
    <ul class="earnings">
      <li><p>{{ $t('community.totalRate') }}</p><p :class="details.profit.indexOf('-') !== -1 ? 'red' : 'green'">{{ details.profit || 0 }}</p></li>
      <li><p>{{ $t('community.weekRate') }}</p><p>{{ details.win || 0 }}</p></li>
      <li><p>{{ $t('community.maxBack') }}</p><p>{{ details.defeat }}</p></li>
      <li><p>{{ $t('community.tradeDays') }}</p><p>{{ details.days || 0 }}</p></li>
      <li><p>{{ $t('community.tradeTimes') }}</p><p>{{ details.number || 0 }}</p></li>
      <li><p>{{ $t('community.totalFlow') }}</p><p>{{ details.peoples || 0 }}</p></li>
    </ul>
    <p class="notice">{{ $t('homepage.notice') }} 6%</p>
  </div>
</template>
<script>
export default {
  props: ['details']
}
</script>
<style lang="less" scoped>
.rates{
  width: 340px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
  padding-bottom: 12px;
  border-radius: 4px;
  .earnings{
    padding: 0 12px 12px 12px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li{
      padding-top: 18px;
      width: 33%;
      &:nth-child(3n+1) {
        text-align: left;
      }
      &:nth-child(3n+2) {
        text-align: center;
      }
      &:nth-child(3n) {
        text-align: right;
      }
      p:nth-child(1) {
        color: #A7AFBC;
        font-size: 12px;
        padding-bottom: 10px;
      }
      p:nth-child(2) {
        color: #24324C;
        font-size: 14px;
        font-family: 'Bold';
        &.red{
          color: #fa6a46;
        }
        &.green {
          color: #41b37d;
        }
      }
    }
  }
  .notice{
    font-size: 12px;
    color: #9099A7;
    padding-left: 12px;
  }
}

  
</style>
