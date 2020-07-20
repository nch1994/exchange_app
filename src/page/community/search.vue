<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('community.search') }}</p>
      <span />
    </div>
    <form action="/">
      <van-search v-model="value" show-action :placeholder="$t('community.searchInput')" @search="onSearch">
        <div slot="action" @click="onSearch">{{ $t('community.search') }}</div>
      </van-search>
    </form>
    <div @click="isShowList = true" class="button">
      <p>{{ contractList[curIndex].contName }}{{ $t('global.perpetual') }}</p>
      <img src="@/static/img/bottom.png" alt="">
    </div>
    <van-popup v-model="isShowList" position="left" :style="{ width: '70%', height: '100%' }">
      <AccountList :curIdx="curIndex" @confirm="changeAccountIdx" @cancel="isShowList = false" />
    </van-popup>

    <div class="lists" v-show="rankList.length > 0">
      <Item v-for="(item, index) in rankList" :key="index" :details="item" :contractIdx="curIndex" :traderId="traderId" />
    </div>
    <div v-show="rankList.length < 1">
      <Empty />
    </div>
  </div>
</template>
<script>
import AccountList from '@/components/leftList.vue';
import { mapState, mapActions } from 'vuex';
import { getCookie, decryptByDES } from '@/utils/utils'
import numeral from 'numeral'
import Empty from '@/components/empty';
import Item from './item.vue';
export default {
  name: 'Search',
  components: {
    AccountList,
    Empty,
    Item
  },
  data() {
    return {
      value: '',
      curIndex: 0,
      isShowList: false,
      rankList: [],
      recId: '',
      traderId: ''
    }
  },
  computed: mapState([
    'contractList'
  ]),
  created() {
    const userId = decryptByDES(getCookie('token')) || '';
    if (userId !== '') {
      const data = `userId=${userId}&contId=${this.contractList[this.curIndex].contId}`;
      this.nickName = this.$route.query.nickName;
      this.queryOnly(data).then((res) => {
        this.recId = res ? res.recId : '';
        if (this.recId !== '') {
          this.traderId = res.traderId
        }
      })
    }
  },
  methods: {
    ...mapActions(['communityRank', 'queryOnly']),
    back () {
      this.$router.go(-1)
    },
    validate () {
      if (this.value.length < 1) {
        this.$toast(this.$t('community.searchNotice'))
        return false
      }
    },
    changeAccountIdx(index) {
      this.curIndex = index;
      this.isShowList = false;
      const userId = decryptByDES(getCookie('token')) || '';
      if (userId !== '') {
        const data = `userId=${userId}&contId=${this.contractList[this.curIndex].contId}`;
        this.nickName = this.$route.query.nickName;
        this.queryOnly(data).then((res) => {
          this.recId = res ? res.recId : '';
          if (this.recId !== '') {
            this.traderId = res.traderId
          }
        })
      }
    },
    onSearch() {
      this.getRankList()
    },
    getRankList() {
      if (this.validate() === false) return
      const data = `${this.contractList[this.curIndex].contId}?userId=${this.value}`
      this.communityRank(data).then((res) => {
        res.forEach((element) => {
          element.profit = numeral(element.profit).format('0.00%');
          element.win = numeral(element.win).format('0.00%');
          element.defeat = numeral(element.defeat).format('0.00%');
          element.tagsArr = element.tags ? element.tags.split(',') : [];
        })
        this.rankList = res;
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .button{
    width: 340px;
    border: solid 1px #F1F1F1;
    border-radius: 2px;
    margin: 0 auto;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p{
      padding-left: 12px;
      font-size: 14px;
    }
    img{
      vertical-align: middle;
      padding-right: 12px;
      width: 16px;
    }
  }
</style>
