<template>
  <div class="depth_info">
    <ul class="depth_info_title">
      <li><span class="sale">{{ $t('global.buy1') }}</span><span>{{ $t('global.amount') }}({{ $t('global.unit') }})</span></li>
      <li>{{ $t('global.price') }}({{unit}})</li>
      <li><span>{{ $t('global.amount') }}({{ $t('global.unit') }})</span><span class="sale">{{ $t('global.sale1') }}</span></li>
    </ul>
    <div class="depth_info_list">
      <ul class="depth_info_right_list depth_info_right_green">
        <li v-for="(item, index) in depthListBids" :key="index">
          <span class="price green">{{item.price}}</span>
          <span class="amount">{{item.amount}}</span>
          <span class="sale">{{ index+1 }}</span>
          <div :style="{width: item.percent}" />
        </li>
      </ul>
      <ul class="depth_info_right_list depth_info_right_red">
        <li v-for="(item, index) in depthListAsks" :key="index">
          <span class="sale">{{ index+1 }}</span>
          <span class="amount">{{item.amount}}</span>
          <span class="price red">{{item.price}}</span>
          <div :style="{width: item.percent}" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
let timer = null;
import { mapState } from 'vuex';
export default {
  props: ['curIndex'],
  data() {
    return{
      depthListBids: new Array(12).fill({price: '--', amount: '--'}),
      depthListAsks: new Array(12).fill({price: '--', amount: '--'}),
      unit: 'USDT'
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  watch: {
    curIndex: function(newVal) {
      this.curIndex = newVal;
      this.unit = this.contractList[newVal].contName.indexOf('USDT') > -1 ? 'USDT' : 'USD';
    }
  },
  mounted() {
    sessionStorage.removeItem('depthAsks400');
    sessionStorage.removeItem('depthBids400');
    sessionStorage.removeItem('depthListAsks');
    sessionStorage.removeItem('depthListBids');
    this.unit = this.contractList[this.curIndex].contName.indexOf('USDT') > -1 ? 'USDT' : 'USD';
    timer = setInterval(() => {
      const depthListAsks = JSON.parse(sessionStorage.getItem('depthListAsks')) || new Array(12).fill({price: '--', amount: '--'})
      const depthListBids = JSON.parse(sessionStorage.getItem('depthListBids')) || new Array(12).fill({price: '--', amount: '--'})
      this.depthListAsks = depthListAsks.length > 0 ? depthListAsks : new Array(12).fill({price: '--', amount: '--'});
      this.depthListBids = depthListBids.length > 0 ? depthListBids : new Array(12).fill({price: '--', amount: '--'});;
    }, 500);
  },
  beforeDestroy() {
    this.timeout = null;
    clearInterval(timer);
    sessionStorage.removeItem('depthAsks400');
    sessionStorage.removeItem('depthBids400');
    sessionStorage.removeItem('depthListAsks');
    sessionStorage.removeItem('depthListBids');
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
  .depth_info{
    padding-left: 12px;
    padding-right: 12px;
    .depth_info_title{
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      li{
        display: flex;
        span.sale{
          width: 30px;
        }
        &:nth-last-child(1){
          .sale{
            text-align: right;
          }
        }
      }
    }
    .depth_info_list{
      padding-top: 5px;
      display: flex;
      justify-content: space-between;
      .depth_info_right_list{
        width: 360px;
        color: #c5cbce;
        font-size: 14px;
        position: relative;
        .price{
          position: absolute;
        }
        li{
          position: relative;
          height: 30px;
          line-height: 30px;
          div{
            position: absolute;
            top: 0;
            width: 0;
            height: 100%;
          }
        }
        &.depth_info_right_red{
          .price{
            left: 0;
            color: #ff3a30;
          }
          div{
            left: 0;
            background-color: rgba(#EC5F45, 0.1);
          }
          span{
            position: absolute;
          }
          .sale{
            right: 0;
            color: #2c3e50;
          }
          .amount{
            right: 30px;
          }
        }
        &.depth_info_right_green{
          div{
            right: 0;
            background-color: rgba(#00D183, 0.1);
          }
          span{
            text-align: left;
            position: absolute;
          }
          .price{
            right: 0;
            color: #00D183;
          }
          .sale{
            left: 0;
            color: #2c3e50;
          }
          .amount{
            left: 30px;
          }
        }
        
      }
    }
    
  }
</style>
