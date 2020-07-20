<template>
  <div class="holds">
    <div class="top">
      <div class="top_left">
        <p class="types">{{ details.contName }} {{ details.lever || 100 }}X {{ details.recText }}</p>
        <ul>
          <li>
            <p>{{ details.openPrice }}</p>
            <p>{{ $t('homepage.openPrice') }}</p>
          </li>
          <li>
            <img src="@/static/img/asset/transfer2.png" alt="">
          </li>
          <li>
            <p>{{ details.closePrice }}</p>
            <p>{{ $t('homepage.flatPrice') }}</p>
          </li>
        </ul>
      </div>
      <div class="top_right">
        <p>{{ details.rate }}</p>
        <p>{{ $t('homepage.rate') }}</p>
      </div>
    </div>
    <ul class="bottom">
      <li>{{ $t('homepage.flatTime') }}：{{ details.createTime }}</li>
      <li>{{ $t('homepage.orderNum') }}：{{ details.recId }}</li>
      <li>{{ $t('homepage.orderType') }}：{{ details.follow ? $t('homepage.follow') : $t('homepage.independent')}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['details'],
}
</script>
<style lang="less" scoped>
.holds{
  width: 316px;
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.01);
  margin: 0 auto;
  background-color: #ffffff;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}
  .top{
    display: flex;
    .top_left{
      flex: 1;
      padding-right: 20px;
      border-right: solid 1px #f1f1f1;
      .types{
        font-size: 14px;
        color: #24324C;
        height: 32px;
        line-height: 32px;
      }
      ul{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        line-height: 20px;
        li{
          &:nth-child(1), &:nth-child(3) {
            text-align: center
          }
          &:nth-child(2){
            img{
              width: 30px;
              height: 30px;
              vertical-align: middle;
            }
          }
        }
      }
    }
    .top_right{
      width: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
  }
  .bottom{
    font-size: 12px;
    margin: 0 auto;
    padding-top: 8px;
    color: #A7AFBC;
    li{
      height: 24px;
      line-height: 24px;
    }
  }
</style>
