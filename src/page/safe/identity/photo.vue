<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="backPage">
      <p class="title">{{ $t('mine.safe.upload') }}</p>
      <span />
    </div>
    <ul class="items">
      <li class="item">
        <p>{{ $t('mine.safe.front') }}</p>
        <img :src="userInfo.front || front || defaultFront" alt="">
        <input type="file" id="front" @change="addFront('front')" :disabled="userInfo.front ? true : false" multiple="false" accept="image/jpg,image/jpeg,image/png,image/bmp">
        <label htmlFor="front" style="display: userInfo.front ? 'none' : 'block'">{{ $t('mine.safe.photoRequest') }}</label>
      </li>
      <li class="item">
        <p>{{ $t('mine.safe.back') }}</p>
        <img :src="userInfo.back || back || defaultBack" alt="">
        <input type="file" id="back" @change="addFront('back')" :disabled="userInfo.back ? true : false" multiple="false" accept="image/jpg,image/jpeg,image/png,image/bmp">
        <label style="display: userInfo.back ? 'none' : 'block'" htmlFor="back">{{ $t('mine.safe.photoRequest') }}</label>
      </li>
      <li class="item">
        <p>{{ $t('mine.safe.hand') }}</p>
        <img :src="userInfo.face || face || defaultHand" alt="">
        <input type="file" id="face" @change="addFront('face')" :disabled="userInfo.face ? true : false" multiple="false" accept="image/jpg,image/jpeg,image/png,image/bmp">
        <label style="display: userInfo.face ? 'none' : 'block'" htmlFor="face">{{ $t('mine.safe.photoRequest') }}</label>
      </li>
    </ul>
    <button type="button" class="btn" @click="confirm">提交</button>
  </div>
</template>
<script>
import { getCookie, setCookie, decryptByDES } from '@/utils/utils';
import { mapActions } from 'vuex';
export default {
  name: 'Photo',
  data () {
    return {
      userInfo: '',
      defaultFront: '',
      front: '',
      defaultBack: '',
      back: '',
      defaultHand: '',
      face: ''
    }
  },
  mounted() {
    this.userInfo = JSON.parse(getCookie('userInfo'))
    const lang = localStorage.getItem('lang') || 'zh';
    this.defaultFront = lang === 'zh' ? require('@/static/img/mine/card1.jpg') : require('@/static/img/mine/card4.jpg');
    this.defaultBack = lang === 'zh' ? require('@/static/img/mine/card2.jpg') : require('@/static/img/mine/card5.jpg');
    this.defaultHand = lang === 'zh' ? require('@/static/img/mine/card3.png') : require('@/static/img/mine/card6.jpg');
  },
  methods: {
    ...mapActions(['uploadImage', 'auth']),
    validate () {
      if (this.front.length < 1) {
        this.$toast(this.$t('notice.idNumberFront'));
        return false;
      }
      if (this.back.length < 1) {
        this.$toast(this.$t('notice.idNumberBack'));
        return false;
      }
      if (this.face.length < 1) {
        this.$toast(this.$t('notice.idNumberFace'));
        return false;
      }
    },
    backPage () {
      this.$router.go(-1)
    },
    confirm () {
      if (this.validate() === false) return
      const data = {
        realName: localStorage.getItem('realName'),
        idNumber: localStorage.getItem('idNumber'),
        front: this.front,
        back: this.back,
        face: this.face,
        userId: decryptByDES(getCookie('token'))
      }
      this.auth(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        let userInfo = JSON.parse(getCookie('userInfo'));
        userInfo.realName = localStorage.getItem('realName');
        userInfo.idNumber = localStorage.getItem('idNumber');
        userInfo.front = this.front;
        userInfo.back = this.back;
        userInfo.face = this.face;
        setCookie('userInfo', JSON.stringify(userInfo));
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'));
      })
    },
    addFront (type) {
      let formData = new FormData()
      const inputDOM = event.target.files[0];
      formData.append('file', inputDOM)
      formData.append('folderId', inputDOM.name)
      formData.append('softType', inputDOM.type)
      const picSize = inputDOM.size / 1024 / 1024;
      if ( picSize > 4) {
        this.$toast(this.$t('notice.picSize'));
        return false;
      }
      this.uploadImage(formData).then((obj) => {
        if (type === 'front') {
          this.front = obj.path
        } else if (type === 'back') {
          this.back = obj.path
        } else if (type === 'face') {
          this.face = obj.path
        }
      }).catch((err) => {
        this.$toast(err || this.$t('global.wait'));
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .items {
    width: 340px;
    margin: 0 auto;
  }
  .item {
    width: 100%;
    position: relative;
    margin-bottom: 20px;
    background-color: #ffffff;
    padding-top: 10px;
    &:nth-child(3) {
      img{
        width: 147px;
        height: 150px;
      }
    }
    p{
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #24324C;
      padding-left: 10px;
    }
    img{
      margin: 0 auto;
      width: 320px;
      height: auto;
      display: block;
    }
    input{
      margin: 0 auto;
      width: 100%;
      height: 100%;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
    label{
      text-align: center;
      display: block;
      line-height: 30px;
      font-size: 12px;
      color: #818da4;
    }
  }
</style>
