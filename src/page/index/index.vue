<template>
  <div class="content">
    <Swiper :banners="banners" />
    <div class="notice">
      <img src="@/static/img/notice.png" class="icon" alt="">
      <a target="_blank" :href="noticeInfo.h5Url" v-if="noticeInfo.h5Url && noticeInfo.h5Url !== ''"><p>{{ noticeInfo.title }}</p></a>
      <p v-else>{{ noticeInfo.title }}</p>
      <img src="@/static/img/more.png" class="more" @click="toNotice()" alt="">
    </div>
    <div class="title">
      <div class="title_left">
        <img src="@/static/img/index/index01.png" alt="">
        <p>{{ $t('home.title1') }}</p>
      </div>
    </div>
    <Caopan :profits="profits" />
    <div class="title">
      <div class="title_left">
        <img src="@/static/img/index/index02.png" alt="">
        <p>{{ $t('home.title2') }}</p>
      </div>
    </div>
    <div class="">
      <contractItem v-for="(item, index) in contractList2" :key="index" :details="item" :rate="rate" :contName="item.contName" />
    </div>
  </div>
</template>
<script>
import Swiper from './swiper'
import Caopan from './caopan'
import contractItem from './contractItem';
import { mapActions, mapState } from 'vuex';
import { filterPoint } from '@/utils/utils';
import numeral from 'numeral'
export default {
  name: 'Index',
  components: {
    Swiper,
    Caopan,
    contractItem,
  },
  data () {
    return {
      rate: 0,
      contractList2: [],
      banners: [{
        imgUrl: ''
      }],
      profits: [{
        userId: 1,
        profit: 0,
        rate: 0
      }, {
        userId: 2,
        profit: 0,
        rate: 0
      }, {
        userId: 3,
        profit: 0,
        rate: 0
      }],
      noticeInfo: {
        title: '',
        h5Url: ''
      }
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  watch: {
    contractList: function(newVal, oldVal) {
      this.contractList1 = newVal.filter((element) => {
        return element.coinId === 1 // 币本位
      })
      this.contractList2 = newVal.filter((element) => {
        return element.coinId > 1 && element.contId < 41 // 币本位
      })
      if (newVal.length !== oldVal.length) {
        this.getProfitInfo()
      }
    }
  },
  mounted() {
    this.contractList1 = this.contractList.filter((element) => {
      return element.coinId === 1 // 币本位
    })
    this.contractList2 = this.contractList.filter((element) => {
      return element.coinId > 1 && element.contId < 41 // 币本位
    })
    this.getBanner(2).then((res) => {
      this.banners = res;
    });
    this.getProfitInfo();
    this.getRate().then((res) => {
      this.rate = res.rate
    })
    this.getMessageList('0?pageNum=1&pageSize=10').then((res) => {
      this.noticeInfo = res.list[0]
    })
  },
  methods: {
    ...mapActions(['getBanner', 'getProfit', 'kline', 'getRate', 'getMessageList']),
    toNotice() {
      this.$router.push('/notice')
    },
    getProfitInfo() {
      this.getProfit('1').then((res) => {
        res.forEach((item) => {
          item.rate = numeral(item.rate).format('0.00%') || 0;
          item.profit = filterPoint(item.profit, 2) || 0;
        });
        this.profits = res;
      });
    }
  },
}
</script>
<style lang="less" scoped>
.content{
  padding-bottom: 60px;
}
.notice{
  height: 24px;
  display: flex;
  align-items: center;
  .icon{
    width: 20px;
    height: 20px;
    margin-right: 5px;
    margin-left: 18px;
  }
  p{
    font-size: 14px;
    color: #000000;
    width: 270px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin-right: 14px;
    text-align: left;
  }
  .more{
    width: 18px;
    height: 4px;
  }
}
.title{
  height: 22px;
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-left: 17px;
  div.title_left{
    display: flex;
    align-items: center;
    img{
      width: 16px;
      height: 22px;
      margin-right: 7px;
    }
    p{
      color: #24324C;
      font-size: 16px;
      font-family: 'Semibold'
    }
  }
  div.title_right{
    padding-right: 17px;
    img{
      width: 16px;
      height: auto;
    }
    span{
      color: #24324C;
      font-weight: normal;
      font-size: 14px;
    }
  }
}

</style>
