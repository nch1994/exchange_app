<template>
  <div class="">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('noticePage.title') }}</p>
      <span />
    </div>
    <ul class="list">
      <li v-for="(item, index) in list" :key="index" class="item">
        <p class="list_title">{{ $t('noticePage.list.title') }}：{{ item.title }}</p>
        <p class="list_content">{{ item.content }}</p>
        <p class="list_time"><span>{{ $t("global.time") }}：{{ item.createTime }}</span><a v-if="item.h5Url && item.h5Url !== ''" :href="item.h5Url">{{ $t("noticePage.list.details") }}</a></p>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { getCookie, decryptByDES } from '@/utils/utils';
export default {
  data () {
    return {
      list: []
    }
  },
  mounted() {
    const userId = decryptByDES(getCookie('token')) || '';
    this.getMessageList(`${userId}?pageNum=1&pageSize=10`).then((res) => {
      res.list.forEach(element => {
        element.isShow = false;
        element.createTime = element.createTime.substring(5, 16)
      });
      this.list = res.list;
    })
  },
  methods: {
    ...mapActions(['getMessageList']),
    back () {
      this.$router.go(-1)
    },
  }
}
</script>
<style lang="less" scoped>
  .list{
    width: 340px;
    margin: 0 auto;
    .item{
      border-bottom: solid 1px #F7FAFD;
      padding-bottom: 10px;
      padding-top: 10px;
      .list_title{
        font-size: 14px;
        line-height: 24px;
        font-weight: bold;
      }
      .list_content{
        padding-top: 10px;
        padding-bottom: 10px;
        font-size: 14px;
        line-height: 18px;
        img{
          margin-left: 16px;
          width: 18px;
        }
      }
      .list_time{
        font-size: 13px;
        color: #B2B8C4;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
        a{
          color: #007AFF;
        }
      }
    }
  }
</style>
