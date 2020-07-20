<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('follow.title') }}</p>
      <span />
    </div>
    <div class="wrapper">
      <div class="input">
        <label for="">{{ $t('followEdit.nickname') }}</label>
        <input type="text" :placeholder="$t('followEdit.nicknameInput')" v-model="nickName" readonly>
      </div>
      <div class="input">
        <label for="">{{ $t('followEdit.types') }}</label>
        <input type="text" :value="types" readonly>
      </div>
      <div class="way">
        <p>{{ $t('followEdit.way') }}</p>
        <ul>
          <li v-for="(item, index) in list" :key="index" :class="curIndex === index ? 'active' : ''" @click="changeIdx(index)">{{ item }}</li>
        </ul>
      </div>
      <div v-show="curIndex === 0" class="stepper_wrapper">
        <div class="stepper">
          <p>{{ $t('followEdit.amount') }}</p>
          <van-stepper v-model="value" :input-width="60" max="999999" />
        </div>
        <p class="notice">{{ $t('followEdit.amountNotice') }}</p>
      </div>
      <div v-show="curIndex === 1" class="stepper_wrapper">
        <div class="stepper">
          <p>{{ $t('followEdit.unit') }}</p>
          <van-stepper v-model="value2" :input-width="60" step="10" min="1" max="100" />
          <div class="unlimit">
            <input type="number" maxlength="4" v-model="value2" @input="changeScale()">
            <span>%</span>
          </div>
        </div>
        <p class="notice">{{ $t('followEdit.unitNotice') }}</p>
      </div>
      <div class="stepper_wrapper">
        <div class="stepper">
          <p>{{ $t('followEdit.single') }}</p>
          <van-stepper v-model="value3" :input-width="60" max="20000" />
        </div>
        <p class="notice">{{ $t('followEdit.singleNotice') }}</p>
      </div>
    </div>

    <button class="btn" @click="showAgree" v-show="recId === ''">{{ $t('followEdit.followNow') }}</button>
    <div class="btn_wrap" v-show="recId !== ''">
      <button class="btn cancel" @click="cancel">{{ $t('followEdit.cancel') }}</button>
      <button class="btn" @click="showDialog">{{ $t('followEdit.save') }}</button>
    </div>
    <div v-if="isShowAgree">
      <Agree @confirm="confirm" @cancel="isShowAgree = false" />
    </div>
  </div>
</template>
<script>
import Agree from './agree';
import { mapState, mapActions } from 'vuex';
import { getCookie, decryptByDES } from '@/utils/utils';
import { Dialog } from 'vant';
export default {
  components: {
    Agree
  },
  data () {
    return {
      value: 1,
      value2: 20,
      value3: 20000,
      list: [],
      types: '',
      curIndex: 0,
      isShowAgree: false,
      nickName: '',
      traderId: 0,
      recId: ''
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  mounted() {
    this.list = this.$t('followEdit.ways');
    this.types = this.contractList[this.$route.query.contractIdx].contName;
    this.traderId = this.$route.query.traderId;
    const userId = decryptByDES(getCookie('token')) || '';
    const data = `userId=${userId}&traderId=${this.traderId}&contId=${this.contractList[this.$route.query.contractIdx].contId}`;
    this.nickName = this.$route.query.nickName;
    this.queryOnly(data).then((res) => {
      this.recId = res ? res.recId : '';
      if (this.recId !== '') {
        this.value = res.sheet;
        this.value2 = res.scale;
        this.value3 = res.dailyMax;
        this.curIndex = parseInt(res.recType) - 1;
      }
    })
  },
  methods: {
    ...mapActions(['addFollow', 'queryOnly', 'modifyFollow', 'cancelFollow']),
    changeIdx(index) {
      this.curIndex = index;
    },
    changeScale() {
      if (event.target.value.length > 4) {
        this.value2 = event.target.value.substring(0, 4);
      }
    },
    back () {
      this.$router.go(-1)
    },
    showAgree() {
      if (this.value2 === '' || this.value2 < 1) {
        this.$toast(this.$t('followEdit.scaleNotice'));
        return;
      }
      this.isShowAgree = true
    },
    showDialog() {
      Dialog.confirm({
        title: this.$t('followEdit.dialogTitle'),
        message: this.$t('followEdit.dialogContent'),
        confirmButtonText: this.$t('global.confirm'),
        cancelButtonText: this.$t('global.cancel')
      }).then(() => {
        this.save()
      }).catch(() => {
      });
    },
    confirm() {
      const data = {
        nickName: this.nickName,
        contId: this.contractList[this.$route.query.contractIdx].contId,
        recType: parseInt(this.curIndex) + 1,  // recType  1是固定数量2是比例
        scale: this.value2,
        sheet: this.value,
        dailyMax: this.value3,
        traderId: this.traderId,
        userId: decryptByDES(getCookie('token'))
      }
      this.addFollow(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        this.$router.go(-1);
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'));
      })
    },
    save() {
      const data = {
        nickName: this.nickName,
        contId: this.contractList[this.$route.query.contractIdx].contId,
        recType: parseInt(this.curIndex) + 1,  // recType  1是固定数量2是比例
        scale: this.value2,
        sheet: this.value,
        dailyMax: this.value3,
        traderId: this.traderId,
        userId: decryptByDES(getCookie('token')),
        recId: this.recId
      }
      this.modifyFollow(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        this.$router.go(-1);
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'));
      })
    },
    cancel() {
      const data = {
        recId: this.recId
      }
      this.cancelFollow(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        this.$router.go(-1);
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'));
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .wrapper{
    width: 340px;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
    margin: 0 auto;
  }
  .input{
    margin: 0 12px 0 12px;
    padding-top: 12px;
    padding-bottom: 12px;
    display: flex;
    flex-direction: column;
    border-bottom: solid 1px #F7FAFD;
    label{
      font-size: 12px;
      color: #24324C;
      height: 30px;
      line-height: 30px;
    }
    input{
      font-size: 12px;
      color: #24324C;
      border: none;
    }
  }
  .way{
    margin-left: 12px;
    margin-right: 12px;
    border-bottom: 1px solid #F7FAFD;
    display: flex;
    height: 60px;
    align-items: center;
    p{
      margin-right: 30px;
      font-size: 12px;
      color: #24324C;
    }
    ul{
      display: flex;
      li{
        width: 100px;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        border: solid 1px #007AFF;
        color: #007AFF;
        text-align: center;
        margin-right: 20px;
        border-radius: 4px;
        &:nth-child(2){
          margin-right: 0;
        }
        &.active{
          background-color: #007AFF;
          color: #ffffff;
        }
      }
    }
  }
  .stepper_wrapper{
    border-bottom: 1px solid #F7FAFD;
    margin: 12px 12px 0 12px;
    padding-bottom: 12px;
    .stepper{
      display: flex;
      height: 40px;
      align-items: center;
      justify-content: space-between;
      position: relative;
      p{
        font-size: 12px;
        color: #24324C;
      }
      .unlimit{
        width: 50px;
        position: absolute;
        right: 30px;
        height: 28px;
        display: flex;
        line-height: 28px;
        text-align: center;
        justify-content: center;
        background-color: #f2f3f5;
        border: none;
        input{
          text-align: center;
          width: 100%;
          overflow: hidden;
          background-color: #f2f3f5;
          border: none;
          flex: 1;
          color: #323233;
          font-size: 14px;
        }
      }
    }
    .notice{
      font-size: 12px;
      color: #9099A7;
      line-height: 20px;
    }
  }
  .btn_wrap{
    display: flex;
    justify-content: center;
    margin-top: 40px;
    .btn{
      width: 150px;
      margin: 0;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      &.cancel{
        background-color: transparent;
        border: solid 1px #9099A7;
        color: #9099A7;
        margin-right: 20px;
      }
    }
  }
  
</style>
