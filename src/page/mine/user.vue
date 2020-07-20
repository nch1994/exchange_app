<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('personal.title') }}</p>
      <span />
    </div>
    <div class="items">
      <div class="header">
        <label for="">{{ $t('personal.header') }}</label>
        <img v-show="header !== ''" :src="header" alt="">
        <img v-show="header === ''" src="@/static/img/default.png" alt="">
        <input type="file" id="front" @change="addHeader()" multiple="false" accept="image/jpg,image/jpeg,image/png,image/bmp">
      </div>
      <div class="item">
        <label for="">{{ $t('personal.nickname') }}</label>
        <input type="text" v-model="nickName" :placeholder="$t('personal.nickNameInput')">
      </div>
      <div class="textarea">
        <label for="">{{ $t('personal.intro') }}</label>
        <textarea name="" v-model="intro" id="" cols="30" rows="10" />
      </div>
    </div>
    <button class="btn" @click="save">{{ $t('personal.save') }}</button>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { getCookie, setCookie, decryptByDES } from '@/utils/utils';
export default {
  data() {
    return {
      curIndex: 0,
      header: '',
      nickName: '',
      intro: ''
    }
  },
  
  mounted() {
    const userInfo = JSON.parse(getCookie('userInfo'));
    this.intro = userInfo.introduce || '';
    this.nickName = userInfo.nickName || '';
    this.header = userInfo.icon || '';
  },
  methods: {
    ...mapActions(['uploadImage', 'updateUserInfo']),
    back () {
      this.$router.go(-1)
    },
    validate () {
      if (this.header.length < 1) {
        this.$toast(this.$t('personal.headerNotice'))
        return false
      }
      if (this.nickName.length < 1) {
        this.$toast(this.$t('personal.nickNameNotice'));
        return false
      }
    },
    addHeader() {
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
        this.header = obj.path
      }).catch((err) => {
        this.$toast(err || this.$t('global.wait'));
      })
    },
    save() {
      if (this.validate() === false) return;
      const userId = decryptByDES(getCookie('token')) || ''
      const data = `userId=${userId}&nickName=${this.nickName}&introduce=${this.intro}&icon=${this.header}`;
      this.updateUserInfo(data).then(() => {
        const userInfo = JSON.parse(getCookie('userInfo'));
        userInfo.nickName = this.nickName;
        userInfo.icon = this.header;
        userInfo.introduce = this.intro;
        setCookie('userInfo', JSON.stringify(userInfo));
        this.$router.go(-1);
        this.$toast(this.$t('global.actionSuccess'));
      }).catch((err) => {
        this.$toast(err || this.$t('global.wait'));
      })
    }
  }
}
</script>
<style lang="less" scoped>
.items{
  width: 340px;
  margin: 20px auto 0;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
}
  .item{
    margin-left: 12px;
    margin-right: 12px;
    border-bottom: solid 1px #F7FAFD;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    label{
      font-size: 12px;
      color: #24324C;
    }
    img{
      width: 50px;
      height: 50px;
      vertical-align: middle;
    }
    input{
      border: none;
      text-align: right;
      font-size: 14px;
    }
  }
  .header{
    height: 68px;
    padding-left: 12px;
    padding-right: 12px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    label{
      font-size: 12px;
      color: #24324C;
    }
    img{
      height: 50px;
      width: 50px;
      border-radius: 50%;
      vertical-align: middle;
    }
    input{
      position: absolute;
      width: 50px;
      height: 50px;
      top: 9px;
      right: 12px;
      opacity: 0;
    }
  }
  .textarea{
    padding-left: 12px;
    padding-right: 12px;
    padding-bottom: 12px;
    display: flex;
    flex-direction: column;
    label{
      line-height: 30px;
      height: 30px;
      font-size: 12px;
      color: #24324C;
    }
    textarea{
      font-size: 14px;
      color: #24324C;
      padding: 10px;
    }
  }
</style>
