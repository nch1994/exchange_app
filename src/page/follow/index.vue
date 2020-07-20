<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('follow.title') }}</p>
      <span />
    </div>
    <div @click="isShowList = true" class="button">
      <p>{{ contractList[curIndex].contName }}{{ $t('global.perpetual') }}</p>
      <img src="@/static/img/bottom.png" alt="">
    </div>
    <div class="lists" v-show="followList.length > 0">
      <Item v-for="(item, index) in followList" :key="index" :details="item" :contractIdx="curIndex" />
    </div>
    <div v-show="followList.length < 1">
      <Empty />
    </div>
    <van-popup v-model="isShowList" position="left" :style="{ width: '70%', height: '100%' }">
      <AccountList :curIdx="curIndex" @confirm="changeAccountIdx" @cancel="isShowList = false" />
    </van-popup>
  </div>
</template>
<script>
import AccountList from '@/components/leftList.vue';
import Item from './item.vue';
import { mapState, mapActions } from 'vuex';
import { getCookie, filterPoint, decryptByDES } from '@/utils/utils'
import Empty from '@/components/empty';
export default {
  components: {
    AccountList,
    Item,
    Empty
  },
  data() {
    return {
      isShowList: false,
      curIndex: 0,
      followList: []
    }
  },
  computed: mapState([
    'contractList'
  ]),
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions(['queryAll']),
    back() {
      this.$router.go(-1);
    },
    changeAccountIdx(index) {
      this.curIndex = index;
      this.isShowList = false;
      this.getList();
    },
    getList() {
      const userId = decryptByDES(getCookie('token')) || '';
      const data = `userId=${userId}&contId=${this.contractList[this.curIndex].contId}`
      this.queryAll(data).then((res) => {
        res.forEach((element) => {
          element.nickName = element.nickName || `STARQUEEN 用户${element.traderId}`
          element.bond = element.bond ? filterPoint(element.bond, 4) : 0;
          element.profit = element.profit ? filterPoint(element.profit, 4) : 0;
        });
        this.followList = res;
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .button{
    width: 300px;
    border: solid 1px #F1F1F1;
    border-radius: 2px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 12px auto;
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
