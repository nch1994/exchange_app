<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{name}}地址</p>
      <span />
    </div>
    
    <div v-show="num === 0" class="empty">
      <img src="@/static/img/empty.png" alt="">
      <p>无地址记录</p>
    </div>
    <ul class="items" />
    <button class="btn" @click="toAdd(name)">添加地址</button>
  </div>
</template>
<script>
export default {
  name: 'Address',
  data () {
    return {
      name: '',
      num: 0
    }
  },
  mounted () {
    this.name = this.$route.query.name
    this.num = parseInt(this.$route.query.num)
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    toAdd (name) {
      this.$router.push({
        query: {
          name
        },
        path: 'add'
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .empty{
    width: 340px;
    height: 340px;
    background-color: #ffffff;
    border-radius: 2px;
    margin: 0 auto;
    img{
      width: 109px;
      height: 103px;
      margin: 97px auto 0;
    }
    p{
      height: 30px;
      line-height: 30px;
      color: #9099A7;
      font-size: 12px;
    }
  }
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
      &:nth-last-child(1) {
        border-bottom: none;
      }
    }
  }
</style>
