<template>
  <div class="left">
    <!-- <p class="title">{{ $t('contract.index.choose') }}</p> -->
    <p class="subTitle">{{ $t('global.usdtSwap') }}</p>
    <ul>
      <li v-for="(item, index) in contractList1" :key="index" @click.stop="changeIdx(index)">
        <p>{{item.contName}}{{ $t('global.perpetual') }}</p>
        <img v-show="curIndex === index" src="@/static/img/asset/right.png" class="right" alt="">
      </li>
    </ul>
    <p class="subTitle">{{ $t('global.coinSwap') }}</p>
    <ul>
      <li v-for="(item, index) in contractList2" :key="index" @click.stop="changeIdx(index + contractList1.length)">
        <p>{{item.contName}}{{ $t('global.perpetual') }}</p>
        <img v-show="curIndex === index + contractList1.length" src="@/static/img/asset/right.png" class="right" alt="">
      </li>
    </ul>
    <p class="subTitle" v-if="contractList3.length > 0">{{ $t('global.diffSwap') }}</p>
    <ul>
      <li v-for="(item, index) in contractList3" :key="index" @click.stop="changeIdx(index + contractList1.length + contractList2.length)">
        <p>{{item.contName}}{{ $t('global.perpetual') }}</p>
        <img v-show="curIndex === index + contractList1.length + contractList2.length" src="@/static/img/asset/right.png" class="right" alt="">
      </li>
    </ul>
    <div class="btn_wrap">
      <button @click="cancel">{{ $t('global.cancel') }}</button>
      <button @click="confirm">{{ $t('global.confirm') }}</button>
      <span class="line" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  props: {
    curIdx: {
      type: Number,
      default: 0
    }
  },
  data () {
    return{
      curIndex: 0,
      contractList1: [],
      contractList2: [],
      contractList3: []
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  mounted () {
    let contractList = this.contractList;
    if (this.$route.path !== '/contract' && this.$route.path !== '/trading') {
      contractList = contractList.filter((element) => {
        return element.contId < 41;
      })
    }
    this.curIndex = this.curIdx;
    this.contractList1 = contractList.filter((element) => {
      return element.coinId === 1 // 保证金
    })
    this.contractList2 = contractList.filter((element) => {
      return element.coinId > 1 && element.contId < 41 // 币本位
    })
    this.contractList3 = contractList.filter((element) => {
      return element.contId > 40
    })
  },
  methods: {
    changeIdx(index) {
      this.curIndex = index;
    },
    cancel() {
      this.$emit('cancel');
      this.curIndex = this.curIdx;
    },
    confirm() {
      this.$emit('confirm', this.curIndex);
    }
  }
}
</script>
<style lang="less" scoped>
  .left{
    background-color: #ffffff;
    padding-top: 4px;
    position: relative;
    z-index: 100;
    .title{
      height: 40px;
      line-height: 40px;
      padding-left: 17px;
    }
    .subTitle{
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      padding-left: 12px;
      color: #007AFF;
    }
    ul{
      li{
        height: 40px;
        line-height: 40px;
        border-bottom: solid 1px #F7FAFD;
        position: relative;
        p{
          color: #24324C;
          font-size: 12px;
          font-family: 'Semibold';
          padding-left: 12px;
        }
        .right{
          position: absolute;
          top: 10px;
          right: 44px;
          width: 18px;
          height: 18px;
          margin-left: 12px;
        }
      }
    }
    .btn_wrap{
      display: flex;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 260px;
      border-top: solid 1px #F7FAFD;
      button{
        width: 50%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #24324C;
        font-family: 'Medium';
        &:nth-child(2){
          border-left: solid 1px #F7FAFD;
          background-color: #007AFF;
          color: #ffffff;
        }
      }
      .line{
        position: absolute;
        width: 1px;
        height: 18px;
        top: 13px;
        left: 50%;
        background-color: #F7FAFD;
        transform: translate(-50%, 0);
      }
    }
  }
</style>
