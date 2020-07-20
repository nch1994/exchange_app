<template>
  <div class="mask">
    <div class="wrapper">
      <p class="title">{{ $t('followAgree.title') }}</p>
      <p class="notice">{{ $t('followAgree.notice1') }}</p>
      <p class="check" @click="checked1 = !checked1">
        <img v-show="checked1" src="@/static/img/selected.png" alt="">
        <img v-show="!checked1" src="@/static/img/select.png" alt="">
        {{ $t('followAgree.known') }}
      </p>
      <p class="notice">{{ $t('followAgree.notice2') }}</p>
      <p class="check" @click="checked2 = !checked2">
        <img v-show="checked2" src="@/static/img/selected.png" alt="">
        <img v-show="!checked2" src="@/static/img/select.png" alt="">
        {{ $t('followAgree.known') }}
      </p>
      <p class="notice">{{ $t('followAgree.notice3') }}</p>
      <p class="check" @click="checked3 = !checked3">
        <img v-show="checked3" src="@/static/img/selected.png" alt="">
        <img v-show="!checked3" src="@/static/img/select.png" alt="">
        {{ $t('followAgree.known') }}
      </p>
      <button :class="[checked1 && checked2 && checked3 ? 'active' : '', 'btn', 'confirm']" @click="confirm()">{{ $t('followAgree.agree') }}</button>
      <button class="btn cancel" @click="cancel()">{{ $t('followAgree.wait') }}</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checked1: false,
      checked2: false,
      checked3: false
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="less" scoped>
  .mask{
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    .wrapper{
      width: 340px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ffffff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
      border-radius: 8px;
      .title{
        height: 48px;
        line-height: 48px;
        padding-left: 17px;
      }
      .notice{
        font-size: 14px;
        color: #9099A7;
        line-height: 20px;
        padding-left: 12px;
        padding-right: 12px;
      }
      .check{
        padding-bottom: 10px;
        padding-left: 12px;
        height: 30px;
        display: flex;
        align-items: center;
        img{
          width: 20px;
          height: 20px;
          vertical-align: middle;
          margin-right: 6px;
        }
        font-size: 12px;
        color: #24324C;
      }
      .confirm{
        background-color: #e7e9eb;
        pointer-events: none;
        &.active{
          background-color: #007AFF;
          pointer-events: auto;
        }
      }
      .cancel{
        background-color: transparent;
        color: #9099A7;
        border: solid 1px #9099A7;
      }
      .btn{
        width: 310px;
        margin-top: 20px;
        font-size: 15px;
        height: 40px;
        line-height: 40px;
      }
    }
  }
</style>
