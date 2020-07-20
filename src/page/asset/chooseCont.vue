<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ type === 2 ? $t('global.chooseCont') : $t('global.chooseOption') }}</p>
      <span />
    </div>
    <ul class="lists">
      <li v-for="(item, index) in list" :key="index" @click="confirm(index, item.coinId, item.contId)">
        <p>{{ item.contName }}</p>
        <p>
          <img src="@/static/img/right.png" alt="">
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'ChooseCont',
  components: {
  },
  data () {
    return {
      list: [],
      curIndex: 0,
      type: 2
    }
  },
  mounted () {
    this.type = parseInt(this.$route.params.type);
    const contractAccounts = JSON.parse(localStorage.getItem('contractAccounts'));
    if (this.type === 3) {
      this.list = contractAccounts.filter((element) => {
        return element.contId > 100
      })
    } else {
      this.list = contractAccounts.filter((element) => {
        return element.contId <= 100
      })
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    confirm (index, coinId, contId) {
      this.curIndex = index;
      const transferInfo = {
        coinType: coinId,
        contId: contId
      }
      sessionStorage.setItem('transferInfo', JSON.stringify(transferInfo))
      this.$router.push('/asset/transfer/1')
    },
  }
}
</script>
<style lang="less" scoped>
  .lists{
    li{
      display: flex;
      border-bottom: solid 1px #F1F1F1;
      justify-content: space-between;
      font-size: 14px;
      color: #24324C;
      height: 36px;
      align-items: center;
      padding-left: 12px;
      padding-right: 12px;
      img{
        width: 14px;
        height: auto;
        vertical-align: middle;
      }
    }
  }
</style>
