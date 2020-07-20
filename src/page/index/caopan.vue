<template>
  <ul class="niuren">
    <li class="newren_bottom">
      <div class="rank">
        <p class="name">{{ 2 }}</p>
        <img src="@/static/img/index/rank02.png" class="header" alt="">
      </div>
      <div class="text">
        <div class="intor">
          <img src="@/static/img/index/shouyi.png" alt="">
          <p>{{ $t('home.gains') }}</p>
        </div>
        <p class="usdt">{{ profits[1].mobile }}</p>
        <p class="rate"><span class="orange">{{ profits[1] ? profits[1].rate : '0.00%'}}</span> {{ $t('home.rate') }}</p>
      </div>
    </li>
    <li class="newren_bottom">
      <div class="rank">
        <p class="name">{{ 1 }}</p>
        <img src="@/static/img/index/rank01.png" class="header" alt="">
      </div>
      <div class="text">
        <div class="intor">
          <img src="@/static/img/index/shouyi.png" alt="">
          <p>{{ $t('home.gains') }}</p>
        </div>
        <p class="usdt">{{ profits[0].mobile }}</p>
        <p class="rate"><span class="orange">{{ profits[0] ? profits[0].rate : '0.00%'}}</span> {{ $t('home.rate') }}</p>
      </div>
    </li>
    <li class="newren_bottom">
      <div class="rank">
        <p class="name">{{ 3 }}</p>
        <img src="@/static/img/index/rank03.png" class="header" alt="">
      </div>
      <div class="text">
        <div class="intor">
          <img src="@/static/img/index/shouyi.png" alt="">
          <p>{{ $t('home.gains') }}</p>
        </div>
        <p class="usdt">{{ profits[2].mobile }}</p>
        <p class="rate"><span class="orange">{{ profits[2] ? profits[2].rate : '0.00%'}}</span> {{ $t('home.rate') }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['profits'],
}
</script>
<style lang="less" scoped>
  .niuren{
    display: flex;
    justify-items: baseline;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 2px;
    width: 340px;
    margin: 0 auto;
    padding-bottom: 10px;
    .newren_bottom{
      max-width: 106px;
      &:nth-child(2) {
        .rank{
          .header{
            width: 100px;
          }
        }
        .name {
          line-height: 16px;
        }
      }
    }
    .rank{
      height: 105px;
      width: 102px;
      position: relative;
      .header{
        width: 80px;
        height: auto;
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      .name{
        font-family: 'Medium';
        color: rgba(#ffffff, 1);
        font-size: 12px;
        line-height: 12px;
        text-align: center;
        position: absolute;
        text-align: center;
        z-index: 10;
        bottom: 12px;
        left: 50%;
        transform: translate(-50%, 0%);
      }
    }
    .text{
      .intor{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 9px;
        img{
          width: 8px;
          height: 8px;
          margin-right: 3px;
        }
        p{
          color: #007AFF;
          font-size: 10px;
          font-family: 'Regular'
        }
      }
      .usdt{
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 10px;
        font-family: 'Medium';
        text-align: center;
        color: #20324E;
        font-size: 8px;
        span{
          font-size: 16px;
        }
      }
      .rate{
        margin-top: 7px;
        color: #8D98A7;
        font-size: 8px;
        text-align: center;
        span{
          font-size: 14px;
          &.blue{
            color: #6CB0FF;
          }
          &.yellow{
            color: #FFC62A;
          }
          &.orange{
            color: #FFA95E;
          }
        }
      }
    }
  }
</style>

