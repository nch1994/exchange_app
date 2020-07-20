<template>
  <div class="my-swiper">
    <swiper :options="swiperOption" class="swiper-container">
      <swiper-slide class="swiper-item" v-for="(item, index) of banners" :key="index">
        <a :href="item.url">
          <img class="swiper-img" :src="item.imageUrl">
        </a>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
export default {
  components: { swiper, swiperSlide },
  props: ['banners'],
  data () {
    return {
      swiperOption: {
        direction: 'horizontal',
        loop: true,
        autoplay: 5000,
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 10,
        loopAdditionalSlides: 2
      }
    }
  },
  watch: {
    banners: function() {
      this.swiperOption.spaceBetween = this.banners.length > 1 ? 10 : 100
    }
  },
}
</script>

<style lang="less" scoped>
.my-swiper{
  overflow: hidden;
  width: 375px;
}
.swiper-container {
  margin: 0;
  margin-top: 20px;
  width: 375px;
  height: 130px;
  margin-bottom: 12px;
  overflow: visible !important;
}
.swiper-container .swiper-wrapper .swiper-slide{ width: 340px; border-radius: 4px;}
.swiper-container .swiper-wrapper .swiper-slide img{width: 340px; height: 130px; border-radius: 4px;}
.swiper-container .swiper-wrapper .swiper-slide-prev{ margin-top: 15px; height: 100px!important;}
.swiper-container .swiper-wrapper .swiper-slide-prev img{ height: 100px!important;}
.swiper-container .swiper-wrapper .swiper-slide-next{ margin-top: 15px; height: 100px!important;}
.swiper-container .swiper-wrapper .swiper-slide-next img{ height: 100px!important;}
</style>
