<template>
  <div class="mask">
    <div class="center">
      <ul>
        <li v-for="(item, index) in accountList" :key="index" @click="changeIdx(index)">
          <p>{{item.contName}}{{ item.contId > 100 ? $t('global.option') : $t('global.perpetual') }}</p>
          <img v-if="curIndex === index" src="@/static/img/asset/right.png" class="right" alt="">
        </li>
      </ul>
      <div class="btn_wrap">
        <button @click="cancel">{{ $t('global.cancel') }}</button>
        <button @click="confirm">{{ $t('global.confirm') }}</button>
        <span class="line" />
      </div>
    </div>
  </div>  
</template>
<script>
export default {
  props: {
    accountList: {
      type: Array,
      default: () => {
        return []
      }
    },
    accountIdx: {
      type: Number,
      default: 0
    }
  },
  data () {
    return{
      curIndex: 0
    }
  },
  mounted () {
    this.curIndex = this.accountIdx;
  },
  methods: {
    changeIdx(index) {
      // this.$emit('changeIdx', index);
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
  .mask{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(#000000, 0.4);
    .center{
      width: 260px;
      height: auto;
      background-color: #ffffff;
      border-radius: 2px;
      padding-top: 4px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      ul{
        min-height: 120px;
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        li{
          height: 40px;
          line-height: 40px;
          border-bottom: solid 1px #F7FAFD;
          position: relative;
          &:nth-last-child(1) {
            border-bottom: none;
          }
          p{
            color: #24324C;
            font-size: 12px;
            font-family: 'Semibold';
            text-align: center;
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
        position: relative;
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
            color: #007AFF;
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
  }
</style>
