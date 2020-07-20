<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">地址管理</p>
      <span />
    </div>
    <ul class="items">
      <li v-for="(item, index) in list" :key="index" @click="toList(item.type, item.num)">
        <p>{{item.type}}</p>
        <div>
          <span>{{item.num}}</span>
          <img src="@/static/img/right.png" alt="" srcset="">
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Address',
  data () {
    return {
      list: [{
        'type': 'BTC',
        'num': 0
      }, {
        'type': 'ETH',
        'num': 1
      }]
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    toList (name, num) {
      this.$router.push({
        query: {
          name,
          num
        },
        path: 'address/list'
      })
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
      div{
        img{
          width: 10px;
          height: 10px;
          margin-left: 16px;
        }
      }
      &:nth-last-child(1) {
        border-bottom: none;
      }
    }
  }
</style>
