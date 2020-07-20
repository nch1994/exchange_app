<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('asset.charge.title') }}</p>
      <span />
    </div>
    
    <div @click="isShowList = true" class="button">
      <p v-if="list.length > 0">{{ list[curIndex].enName }}</p>
      <p>{{ $t('global.chooseCoin') }}></p>
    </div>
    <div class="info" v-show="depositSwitch === 1">
      <div class="code">
        <QrcodeVue v-if="address !== ''" :value="address" :size="111" />
      </div>
      <p>{{ $t('asset.charge.text') }}</p>
      <p>{{address}}</p>
      <button class="btn" @click="confirm" data-clipboard-action="copy" :data-clipboard-text="address">{{ $t('asset.charge.copyAddress') }}</button>
      <div v-if="curIndex === 3">
        <p>{{memo}}</p>
        <button class="btn" @click="confirm" data-clipboard-action="copy" :data-clipboard-text="memo">{{ $t('asset.charge.copyTag') }}</button>
        <p class="notice">*{{ $t('asset.charge.memoNotice') }}</p>
      </div>
    </div>
    <div v-show="depositSwitch === 0" class="switch_notice">{{ $t('notice.isClosed') }}</div>
    <div class="notice">
      <p>{{ $t('asset.charge.notice') }}</p>
      <ul>
        <li>{{ $t('asset.charge.noticeList1')[0] }}{{ unit }}{{ $t('asset.charge.noticeList1')[1] }}{{ unit }}{{ $t('asset.charge.noticeList1')[2] }}</li>
        <li>{{ $t('asset.charge.noticeList2')[0] }}{{ unit }}{{ $t('asset.charge.noticeList2')[1] }}</li>
        <li>{{ $t('asset.charge.noticeList3') }}</li>
        <li>{{ $t('asset.charge.noticeList4') }}</li>
      </ul>
    </div>
    <van-popup v-model="isShowList" position="left" :style="{ width: '70%', height: '100%' }">
      <AccountList :curIdx="curIndex" :list="list" @confirm="changeAccountIdx" @cancel="isShowList = false" />
    </van-popup>
  </div>
</template>
<script>
import QrcodeVue from 'qrcode.vue';
import { mapActions } from 'vuex';
import AccountList from '@/components/coinList.vue';
import { getCookie, decryptByDES } from '@/utils/utils';
export default {
  name: 'Charge',
  components: {
    QrcodeVue,
    AccountList
  },
  data () {
    return {
      list: [],
      address: '',
      curIndex: 0,
      isShowList: false,
      depositSwitch: 0,
      memo: '',
      unit: 'USDT'
    }
  },
  mounted () {
    const accountDetails = JSON.parse(localStorage.getItem('accountDetails'))
    this.list = accountDetails;
    let index = accountDetails.findIndex((element) => {
      return parseFloat(element.coinType) === parseFloat(this.$route.params.index);
    });
    index = index < 0 ? 0 : index;
    this.curIndex = index;
    this.unit = accountDetails[index].enName.indexOf('USDT') > -1 ? 'USDT' : accountDetails[index].enName
    this.depositSwitch = accountDetails[index].depositSwitch;
    if (this.depositSwitch === 1) {
      this.getAddress(accountDetails[index].coinType)
    }
  },
  methods: {
    ...mapActions(['depositAddress']),
    getAddress(coinType) {
      const data = {
        coinType,
        userId: decryptByDES(getCookie('token'))
      }
      this.depositAddress(data).then((res) => {
        this.address = res.address;
        this.memo = res.memo
      })
    },
    back () {
      this.$router.go(-1)
    },
    changeAccountIdx(index) {
      this.curIndex = index;
      this.isShowList = false;
      const accountDetails = JSON.parse(localStorage.getItem('accountDetails'))
      this.unit = accountDetails[index].enName.indexOf('USDT') > -1 ? 'USDT' : accountDetails[index].enName;
      this.depositSwitch = this.list[index].depositSwitch;
      if (this.list[index].depositSwitch === 1) {
        this.getAddress(this.list[index].coinType);
      }
    },
    confirm () {
      let _this = this;
      let clipboard = new this.clipboard(".btn");
      clipboard.on('success', function () {
        _this.$toast(_this.$t('asset.charge.copySuccess'))
      });
      clipboard.on('error', function () {
        _this.$toast(_this.$t('asset.charge.copyFail'))
      });
    },
  }
}
</script>
<style lang="less" scoped>
  .button{
    width: 340px;
    border-bottom: solid 1px #F1F1F1;
    border-radius: 2px;
    margin: 15px auto;
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
  .switch_notice{
    width: 340px;
    height: 200px;
    line-height: 200px;
    margin: 15px auto;
    text-align: center;
    font-size: 14px;
    color: #24324C;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
    border-radius: 4px;
    background-color: #ffffff;
  }
  .info{
    width: 340px;
    height: auto;
    padding-bottom: 5px;
    background-color: #ffffff;
    border-radius: 2px;
    margin: 0 auto;
    padding-top: 13px;
    text-align: center;
    .code{
      width: 111px;
      height: 111px;
      display: block;
      margin: 0 auto 11px;
    }
    p {
      color: #24324C;
      line-height: 17px;
      // height: 17px;
      font-family: 'Regular';
      margin-bottom: 3px;
      font-size: 12px;
      &:nth-child(3) {
        font-family: 'Medium';
      }
      &.notice{
        color: #9099a7;
        padding-right: 18px;
      }
    }
    .btn{
      width: 90px;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      margin-top: 6px;
    }
  }
  .notice{
    padding-left: 18px;
    padding-right: 34px;
    padding-top: 2px;
    text-align: left;
    p{
      font-size: 12px;
      color: #24324C;
      font-family: 'Regular';
      line-height: 42px;
      height: 42px;
    }
    ul{
      li{
        color: #9099A7;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
</style>
