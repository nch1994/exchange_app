<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">帮助详情</p>
      <span />
    </div>
    <div class="info">
      <p>如何进行身份认证？</p>
      <div>
        区块链作为支撑比特币的基层技术被大众熟知。区别于传统数据库，区块链本质上是一个以“去中心化”为核心的分布式账本数据系统，通过分布式存储，让所有节点的参与者共同维护一个数据库并彼此监督，以解决信息可信度和准确度的问题。区块链中的信息具有“时间戳”“不可篡改”以及“多方共享”等特点。
        “目前区块链在国外落地比较好，比较成熟的应用主要还是数字货币，国内则主要集中在金融、贸易、医疗、供应链管理、慈善、公共管理等行业。”如是金融研究院高级研究员张楠对《证券日报》记者表示。
        云象区块链董事总经理邓旭对《证券日报》记者分析称，在国外，区块链应用比较成熟的是政府治理、公共应用和金融行业。如美国纳斯达克证券交易所，将区块链应用于企业IPO审核，公司可以把从诞生以来的股权信息、股东权益等信息记录在区块链上，缩短交易所的审核时间。公共领域主要是食品安全溯源、药品溯源等应用。
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Help',
  methods: {
    back () {
      this.$router.go(-1)
    },
  }
}
</script>
<style lang="less" scoped>
  .info{
    width: 340px;
    margin: 0 auto 10px;
    background-color: #ffffff;
    border-radius: 2px;
    text-align: left;
    padding-bottom: 53px;
    margin-top: 17px;
    p{
      padding-left: 22px;
      padding-right: 16px;
      line-height: 30px;
      padding-top: 12px;
      padding-bottom: 5px;
      font-size: 14px;
    }
    div{
      padding-left: 22px;
      padding-right: 16px;
      color: #9099A7;
      font-size: 12px;
      line-height: 30px;
    }
  }
</style>
