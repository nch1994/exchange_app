<template>
  <div class="left">
    <p class="title">{{ $t('global.chooseCoin') }}</p>
    <ul>
      <li v-for="(item, index) in list" :key="index" @click.stop="changeIdx(index)">
        <img :src="item.icon" class="coin" alt="">
        <p>{{item.enName}}{{ $t('global.coin') }}</p>
        <img v-show="curIndex === index" src="@/static/img/asset/right.png" class="right" alt="">
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
export default {
  props: ['curIdx', 'list'],
  data () {
    return{
      curIndex: 0
    }
  },
  mounted () {
    this.curIndex = this.curIdx;
  },
  methods: {
    changeIdx(index) {
      this.curIndex = index;
    },
    cancel() {
      this.$emit('cancel');
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
    ul{
      li{
        height: 40px;
        line-height: 40px;
        border-bottom: solid 1px #F7FAFD;
        position: relative;
        display: flex;
        align-items: center;
        .coin{
          margin-left: 10px;
          width: 22px;
          height: auto;
        }
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
      width: 100%;
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
