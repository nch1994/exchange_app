<template>
  <div class="mask">
    <div class="items">
      <img src="@/static/img/close.png" class="close" @click="close()" alt="">
      <p class="title">{{type === 'login' ? $t('mine.safe.modifyLogin') : $t('mine.safe.modifyAsset') }}</p>
      
      <div class="item">
        <input v-model="oldPwd" type="password" :placeholder="$t('input.oldPassword')">
      </div>
      <div class="item">
        <input v-model="newPwd" type="password" :placeholder="$t('input.newPassword')">
      </div>
      <div class="item">
        <input v-model="confirmPwd" type="password" :placeholder="$t('input.confirmPwd')">
      </div>
      <button type="button" class="btn" @click="confirm">{{ $t('global.confirm') }}</button>
    </div>
  </div>
</template>
<script>
import reg from '@/utils/reg';
import { mapActions } from 'vuex';
import { getCookie, decryptByDES } from '@/utils/utils';
import md5 from 'md5';
export default {
  name: 'ModifyLayer',
  props: ['type'],
  data () {
    return {
      oldPwd: '',
      newPwd: '',
      confirmPwd: '',
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions(['modifyPassword']),
    validate () {
      const regs = this.type === 'login' ? reg.registerNewPassword : reg.number;
      const toast = this.type === 'login' ? this.$t('notice.registerNewPwd') : this.$t('notice.asset');
      if (this.oldPwd.length < 1) {
        this.$toast(this.$t('notice.oldPwd'));
        return false;
      }
      if (!regs.test(this.newPwd)) {
        this.$toast(toast);
        return false;
      }
      if (this.newPwd !== this.confirmPwd) {
        this.$toast(this.$t('notice.confirmPwd'));
        return false;
      }
    },
    close() {
      this.$emit('hideForget');
      this.oldPwd = '';
      this.newPwd = '';
      this.confirmPwd = '';
    },
    confirm () {
      if (this.validate() === false) return;
      const type = this.type === 'login' ? 0 : 1;
      const data = {
        userId: decryptByDES(getCookie('token')),
        type,
        newPassword: md5(this.newPwd),
        originalPassword: md5(this.oldPwd),
      }
      this.modifyPassword(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        this.$emit('hideForget');
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
      })
    }
  }
}
</script>
<style lang="less" scoped>
.mask{
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  .title{
    height: 48px;
    line-height: 48px;
    padding-left: 17px;
  }
  .close{
    width: 20px;
    height: 20px;
    position: absolute;
    top: 16px;
    right: 16px;
  }
  .items{
    z-index: 20;
    width: 340px;
    height: auto;
    background-color: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 16px;
    transform: translate(-50%, -50%);
    div.item {
      width: 300px;
      height: 47px;
      border-bottom: solid 1px #F0F0F0;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      input{
        width: 200px;
        margin-top: 19px;
        border: none;
        outline: none;
        font-size: 14px;
        color: #000000;
      }
      img{
        width: 16px;
        height: 16px;
      }
      .send{
        color: #007AFF;
        font-size: 14px;
      }
    }
    .btn{
      width: 300px;
    }
  }
}
  
</style>
