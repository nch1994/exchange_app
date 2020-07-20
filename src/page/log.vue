<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">资金密码</p>
      <span />
    </div>
    <ul>
      <li>
        <span>访问时间</span>
        <span>设备</span>
      </li>
      <li v-for="(item, index) in log" :key="index">
        <span>{{ item.time }}</span>
        <span>{{ item.equip }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Log',
  data () {
    return {
      log: [{
        'time': '11111',
        'equip': 'IOS'
      }, {
        'time': '11111',
        'equip': 'IOS'
      }]
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
  ul{
    width: 340px;
    margin: 0 auto;
    background-color: #ffffff;
    li{
      width: 311px;
      margin: 0 auto;
      border-bottom: solid 1px #F7FAFD;
      display: flex;
      justify-content: space-between;
      color: #9099A7;
      font-size: 12px;
      height: 40px;
      line-height: 40px;
      &:nth-child(1){
        height: 24px;
        line-height: 24px;
        font-weight: bold;
        color: #24324C;
      }
      &:nth-last-child(1) {
        border-bottom: none;
      }
    }
  }
</style>
