<template>
  <div class="my-swiper" id="swipers">
    <swiper :options="swiperOption" class="swiper-container">
      <swiper-slide class="swiper-item" v-for="(item, index) in rollList" :key="index">
        <router-link :to="{ path:'/trader', query: {userId: item.userId}}">
          <ul class="bg">
            <li>
              <div class="">
                <img v-if="item.icon" :src="item.icon" alt="">
                <img v-else src="@/static/img/default.png" alt="">
              </div>
              <div><p class="name">{{ item.nickName }}</p><p class="grade">{{ item.lever || 100 }}X{{ item.recText }}{{item.contName}}</p></div>
            </li>
            <li>
              <p class="rate green">{{ item.profit }}({{ item.rate }})</p>
              <p class="time">{{ item.minutes }}</p>
            </li>
          </ul>
        </router-link>
      </swiper-slide>
    </swiper>
    <div class="swiper-pagination" slot="pagination" />
  </div> 
</template>
<script>
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
export default {
  components: { swiper, swiperSlide },
  props: ['rollList'],
  data () {
    return {
      swiperOption: {
        direction: 'horizontal',
        loop: true,
        autoplay: 3000,
        loopAdditionalSlides: 2,
        pagination: ".swiper-pagination"
      }
    }
  },
}
</script>
<style>
  .my-swiper{
    position: relative;
  }
  .swiper-pagination-bullets, .top-wrapper-bullets{
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .swiper-pagination-bullet-active{
    background-color: #ffffff;
  }
  .swiper-pagination-bullet{
    width: 10px;
    height: 4px;
    border-radius: 2px;
    margin-right: 6px;
  }
</style>

<style lang="less" scoped>  
  .bg{
    width: 375px;
    height: 80px;
    background-color: #007AFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    li{
      height: 34px;
      &:nth-child(1) {
        padding-left: 16px;
        display: flex;
        div{
          height: 34px;
          margin-right: 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        img{
          width: 32px;
          height: 32px;
          border: solid 1px #ffffff;
          border-radius: 50%;
        }
        .name{
          color: #ddedfe;
          font-size: 12px;
        }
        .grade{
          color: #ffffff;
          font-size: 14px;
        }
      }
      &:nth-child(2) {
        text-align: right;
        padding-right: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .rate{
          font-size: 12px;
        }
        .green {
          color: #00D183;
        }
        .red{
          color: #FF3A30;
        }
        .time{
          font-size: 12px;
          color: #ddedfe;
        }
      }
    }
  }
</style>
