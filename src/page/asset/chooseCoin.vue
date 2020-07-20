<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('global.chooseCoin') }}</p>
      <span />
    </div>
    <ul class="lists">
      <li v-for="(item, index) in list" :key="index" @click="confirm(index, item.coinType)">
        <p>{{ item.enName }}</p>
        <p>
          <span v-show="item.enName === 'USDT'">OMNI</span>
          <img src="@/static/img/right.png" alt="">
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'ChooseCoin',
  components: {
  },
  data () {
    return {
      list: [],
      curIndex: 0
    }
  },
  mounted () {
    const accountDetails = JSON.parse(localStorage.getItem('accountDetails'));
    accountDetails.forEach(element => {
      if (element.enName.indexOf('USDT') > -1) {
        element.enName = element.enName.substring(0, 4);
      }
    });
    this.list = accountDetails;
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    confirm (index, coinType) {
      this.curIndex = index;
      const coinContracts= JSON.parse(localStorage.getItem('coinContracts'));
      if (parseInt(this.$route.params.type) === 1) {
        this.$router.push(`/asset/charge/${this.list[index].coinType}`)
      } else if (parseInt(this.$route.params.type) === 2){
        this.$router.push(`/asset/withdraw/${this.list[index].coinType}`)
      } else {
        const transferInfo = {
          coinType: coinType,
          contId: coinContracts[index].contractAccountList[0].contId
        }
        sessionStorage.setItem('transferInfo', JSON.stringify(transferInfo))
        this.$router.push(`/asset/transfer/0`)
      }
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
