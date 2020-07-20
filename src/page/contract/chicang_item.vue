<template>
  <div class="kaicang">
    <div class="kaicang_title"> 
      <div class="kaicang_title_left" />
      <div class="kaicang_title_right">
        <router-link :to="{path: '/trading', query: { index: contractIdx }}">
          <span :style="{ color: contractList[contractIdx].rate.indexOf('-') >= 0 ? '#FF3A30' : '#00D183' }">${{ contractList[contractIdx].price }}</span>
          <img v-if="contractList[contractIdx].rate.indexOf('-') >= 0" src="@/static/img/contract/downfire.png" alt="">
          <img v-else src="@/static/img/contract/upfire.png" alt="">
        </router-link>
      </div>
    </div>
    <table class="chicang_top" v-if="myAssetInfo">
      <tr>
        <th>{{ $t('contract.index.rights') }}</th>
        <th>{{ $t('contract.index.earnings') }}</th>
        <th>{{ $t('contract.index.rate') }}</th>
      </tr>
      <tr>
        <td>{{ myAssetInfo.balance || 0 }}</td>
        <td>{{ myAssetInfo.profit || 0 }}</td>
        <td>{{ myAssetInfo.bondRate || 0 }}</td>
      </tr>
    </table>
    <div v-if="holdList.length > 0">
      <div v-for="(item, index) in holdList" :key="index">
        <div class="chicang_title">
          <p><span>{{contractList[contractIdx].contName}}*{{ item.recType === 1 ? $t('global.openMore') : $t('global.openEmpty') }}</span></p>
          <p><span :style="{color: item.rate.indexOf('-') >= 0 ? '#FF3A30' : '#00D183'}">{{ item.rate }}</span>({{ $t('contract.index.earningRate') }})</p>
          <p />
        </div>
        <table class="chicang_bottom">
          <tr>
            <th>{{ $t('contract.index.HoldAmount') }}({{ $t('contract.index.piece') }})</th>
            <th>{{ $t('contract.index.HoldPrice') }}({{ unit }})</th>
            <th>{{ $t('asset.record.earnings') }}({{ unit2 }})</th>
          </tr>
          <tr>
            <td>{{ item.sheet }}</td>
            <td>{{ item.averagePosition }}</td>
            <td>{{ item.profit }}</td>
          </tr>
          <tr>
            <th>{{ $t('contract.index.canBeFlat') }}({{ $t('contract.index.piece') }})</th>
            <th>{{ $t('contract.index.force') }}({{ unit }})</th>
            <th>{{ $t('contract.index.margin') }}({{ unit2 }})</th>
          </tr>
          <tr>
            <td>{{ item.usable }}</td>
            <td>{{ item.predict }}</td>
            <td>{{ item.bond }}</td>
          </tr>
        </table>
        <div class="btn_wrap">
          <button v-if="userId === ''">{{ $t('global.login') }}</button>
          <button v-else-if="contSwitch === 0">{{ $t('global.notopen') }}</button>
          <button v-else-if="item.recType === 0" @click="showConfirm(10, false, item.usable)">{{ $t('global.flatEmpty') }}</button>
          <button v-else-if="item.recType === 1" @click="showConfirm(11, false, item.usable)">{{ $t('global.flatMore') }}</button>

          <button v-if="userId === ''">{{ $t('global.login') }}</button>
          <button v-else-if="contSwitch === 0">{{ $t('global.notopen') }}</button>
          <button v-else-if="item.recType === 0" @click="showConfirm(10, true, item.usable)">{{ $t('contract.index.lightning') }}</button>
          <button v-else-if="item.recType === 1" @click="showConfirm(11, true, item.usable)">{{ $t('contract.index.lightning') }}</button>
          <button v-if="contSwitch === 0">{{ $t('global.notopen') }}</button>
          <button v-else @click="showProfit(item.recId, item.recType, item.averagePosition)">{{ $t('global.stop') }}</button>
          <img src="@/static/img/more2.png" class="more" @click="showShare(item.recType, item.rate, item.averagePosition)" alt="">
        </div>
      </div>
    </div>
    <div v-else>
      <NoData />
    </div>
    <div v-if="isShowLayer">
      <div class="mask">
        <div class="items">
          <img src="@/static/img/close.png" class="close" @click="isShowLayer=false" alt="">
          <p class="title">{{ $t('contract.index.confirmOrder') }}</p>
          <div class="item">
            <label for="">{{ $t('contract.index.trade') }}</label>
            <input :value="recType === 10 ? $t('contract.index.flatEmpty') : $t('contract.index.flatMore')" readonly type="text">
          </div>
          <div class="item">
            <label for="">{{ $t('contract.index.coinType') }}</label>
            <input type="text" :value="contractList[contractIdx].contName" readonly>
          </div>
          <div class="item">
            <label for="">{{ $t('contract.index.currentPrice') }}</label>
            <div class="fire_wrap" @click="setPrice">
              <span :style="{ color: contractList[contractIdx].rate.indexOf('-') >= 0 ? '#FF3A30' : '#00D183' }">${{ contractList[contractIdx].price }}</span>
              <img class="fire" v-if="contractList[contractIdx].rate.indexOf('-') >= 0" src="@/static/img/contract/downfire.png" alt="">
              <img class="fire" v-else src="@/static/img/contract/upfire.png" alt="">
            </div>
          </div>
          <div class="item">
            <label for="">{{ $t('contract.index.entrustPrice') }}</label>
            <input v-if="isLight" :value="$t('contract.index.competitors')" type="text" readonly>
            <input v-else v-model="price" type="text" @input="changePrice()" :placeholder="$t('contract.index.price')">
          </div>
          <div class="item" v-if="!isLight">
            <label for="">{{ $t('contract.index.entrustCount') }}</label>
            <input v-model="amount" type="text" @input="changeCount()" :placeholder="$t('contract.index.count')">
            <span class="all" @click="all">{{ $t('contract.index.all') }}</span>
          </div>
          <div class="item" v-else>
            <label for="">{{ $t('contract.index.entrustCount') }}</label>
            <van-dropdown-menu class="drop-menu">
              <van-dropdown-item v-model="flatIdx" :options="stopPercentList" />
            </van-dropdown-menu>
          </div>
          <p class="notice">{{ $t('contract.index.maxFlat') }}： {{ flatAmount }}</p>
          <button type="button" class="btn" @click="confirm">{{ $t('global.confirm') }}</button>
        </div>
      </div>
    </div>

    <div v-if="isShowStop">
      <div class="mask">
        <div class="items items2">
          <img src="@/static/img/close.png" class="close" @click="isShowStop=false" alt="">
          <ul class="items_list">
            <li v-for="(item, index) in $t('contract.index.stopList')" :key="index" :class="stopIdx === index ? 'active' : ''" @click="changeStopIdx(index)">{{ item }}</li>
          </ul>
          <div class="item">
            <label for="">{{ $t('contract.index.coinType') }}</label>
            <input :value="recType === 0 ? $t('contract.index.flatEmpty') : $t('contract.index.flatMore')" readonly type="text">
          </div>
          <div class="item">
            <label for="">{{ $t('contract.index.triggerPrice') }}</label>
            <input type="text" @input="changePrice2()" v-model="triggerPrice" :placeholder="triggerPriceInput">
          </div>
          <div class="item">
            <label for="">{{ $t('global.amount') }}</label>
            <van-dropdown-menu class="drop-menu">
              <van-dropdown-item v-model="stopPercentIdx" :options="stopPercentList" />
            </van-dropdown-menu>
          </div>
          <div class="item">
            <label for="">{{ $t('contract.index.cycle') }}</label>
            <van-dropdown-menu class="drop-menu">
              <van-dropdown-item v-model="cycleIdx" :options="cycleList" />
            </van-dropdown-menu>
          </div>
          <div class="btn_wrap2">
            <button v-if="hasSetStop" type="button" class="btn" @click="confirmStop()">{{ $t('global.modify') }}</button>
            <button v-else type="button" class="btn" @click="confirmStop()">{{ $t('global.confirm') }}</button>
            <button v-if="hasSetStop" type="button" class="btn" @click="revokeStop()">{{ $t('global.cancel') }}{{ $t('contract.index.stopList')[stopIdx] }}</button>
            <button v-else type="button" class="btn" @click="isShowStop=false">{{ $t('global.cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCookie, filterInputDigit, decryptByDES } from '@/utils/utils';
import NoData from '@/components/empty';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    NoData
  },
  props: ['contractIdx', 'contSwitch', 'holdList', 'myAssetInfo'],
  data () {
    return {
      userId: '',
      isShowLayer: false,
      isLight: false,
      price: '',
      amount: '',
      flatAmount: 0,
      isShowStop: false,
      stopIdx: 0,
      stopPercentList: [{
        text: '10%',
        value: 10
      }, {
        text: '20%',
        value: 20
      }, {
        text: '50%',
        value: 50
      }, {
        text: '100%',
        value: 100
      }],
      flatIdx: 100,
      cycleList: [],
      cycleIdx: 0,
      stopPercentIdx: 50,
      recId: '',
      triggerPrice: '',
      hasSetStop: false,
      averagePosition: 0,
      unit: 'USDT',
      unit2: 'USDT',
      triggerPriceInput: ''
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  watch: {
    contractIdx: function(newVal) {
      this.unit = this.contractList[newVal].contName.indexOf('USDT') > -1 ? 'USDT' : 'USD';
      this.unit2 = this.contractList[newVal].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[newVal].contName.indexOf('(') > -1 ? this.contractList[newVal].contName.match(/\((\S*)\)/)[1] : this.contractList[newVal].contName.split('/')[0];
    }
  },
  mounted() {
    this.price = '';
    this.amount = '';
    this.userId = decryptByDES(getCookie('token')) || '';
    this.unit = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : 'USD';
    this.unit2 = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[this.contractIdx].contName.indexOf('(') > -1 ? this.contractList[this.contractIdx].contName.match(/\((\S*)\)/)[1] : this.contractList[this.contractIdx].contName.split('/')[0];
    this.triggerPriceInput = this.$t('input.stopProfit');
    this.cycleList = [
      {text: this.$t('global.origin.profit'), value: 0},
      {text: `0.25${this.$t('global.hour')}`, value: 0.25},
      {text: `1${this.$t('global.hour')}`, value: 1},
      {text: `4${this.$t('global.hour')}`, value: 4},
      {text: `12${this.$t('global.hour')}`,value: 12}
    ]
  },
  methods: {
    ...mapActions(['setStop', 'queryStop', 'cancelStop']),
    showShare(recType, rate, averagePosition) {
      const status = recType === 1 ? 1: 2; // 开多1 开空2
      const yieRate = rate.substring(0, rate.length-1);  // 收益率
      const contractType = this.contractList[this.contractIdx].contName; //合约类型
      const lastPrices = this.contractList[this.contractIdx].price; // 最新价
      const data = `status=${status}&yieRate=${yieRate}&contractType=${contractType}&lastPrices=$${lastPrices}&averageOpen=$${averagePosition}`;
      window.location.href=`https://h5.starqueen.top/share?${data}`;
    },
    showProfit(recId, recType, averagePosition) {
      this.isShowStop = true;
      this.recType = recType;
      this.recId = recId;
      this.averagePosition = averagePosition;
      this.hasSetStop = false;
      this.cycleIdx = 0;
      const type = this.stopIdx === 0 ? 1 : 0;
      this.triggerPrice = '';
      this.stopPercentIdx = 50;
      this.cycleIdx = 0;
      this.queryStop(`${this.recId}/${type}`).then((res) => {
        if (res) {
          if (res.price) {
            this.triggerPrice = res.price;
            this.stopPercentIdx = res.sheet;
            this.hasSetStop = true;
            this.cycleIdx = parseFloat(res.times) === 0 ? 0 : this.cycleList[this.cycleList.findIndex((element) =>{
              return parseFloat(element.value) === parseFloat(res.times)
            })].value
          }
        }
      })
    },
    setPrice() {
      this.price = this.contractList[this.contractIdx].price
    },
    confirmStop() {
      if (this.triggerPrice.length < 1) {
        this.$toast(this.$t('notice.price'));
        return;
      }
      const data = {
        price: this.triggerPrice,
        recId: this.recId,
        recType: this.stopIdx === 0 ? 1 : 0,
        sheet: this.stopPercentIdx,
        times: this.cycleIdx
      }
      this.setStop(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        this.isShowStop = false;
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'));
      })
    },
    revokeStop() {
      const type = this.stopIdx === 0 ? 1 : 0;
      this.cancelStop(`${this.recId}/${type}`).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        this.triggerPrice = '';
        this.stopPercentIdx = 50;
        this.isShowStop = false;
        this.cycleIdx = 0;
      })
    },
    changeStopIdx(index) {
      this.stopIdx = index;
      this.hasSetStop = false;
      const type = index === 0 ? 1 : 0;
      this.triggerPriceInput = index === 0 ? this.$t('input.stopProfit') : this.$t('input.stopLoss');
      this.triggerPrice = '';
      this.stopPercentIdx = 50;
      this.cycleList = [
        {text: index === 0 ? this.$t('global.origin.profit') : this.$t('global.origin.loss'), value: 0},
        {text: `0.25${this.$t('global.hour')}`, value: 0.25},
        {text: `1${this.$t('global.hour')}`, value: 1},
        {text: `4${this.$t('global.hour')}`, value: 4},
        {text: `12${this.$t('global.hour')}`,value: 12}
      ]
      this.cycleIdx = 0;
      this.queryStop(`${this.recId}/${type}`).then((res) => {
        if (res) {
          if (res.price) {
            this.hasSetStop = true;
            this.triggerPrice = res.price;
            this.stopPercentIdx = res.sheet;
            this.cycleIdx = parseFloat(res.times) === 0 ? 0 : this.cycleList[this.cycleList.findIndex((element) =>{
              return parseFloat(element.value) === parseFloat(res.times)
            })].value
          }
        }
      })
    },
    changePrice2() {
      this.triggerPrice = event.target.value;
      this.triggerPrice = this.triggerPrice.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
      this.triggerPrice = this.triggerPrice.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
      if (this.triggerPrice.indexOf('.') === 0) {
        this.triggerPrice = '0.';
      };
      this.triggerPrice = this.triggerPrice.replace(filterInputDigit(this.contractList[this.contractIdx].contName), '$1$2.$3');
      this.triggerPrice = this.triggerPrice.replace('.', '$#$').replace(/\./g,"").replace('$#$', '.');
      if(this.triggerPrice.indexOf('.') < 0 && this.triggerPrice !== ''){ //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
        this.triggerPrice = parseFloat(this.triggerPrice);
      }
    },
    changePrice() {
      this.price = event.target.value;
      this.price = this.price.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
      this.price = this.price.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
      if (this.price.indexOf('.') === 0) {
        this.price = '0.';
      };
      this.price = this.price.replace(filterInputDigit(this.contractList[this.contractIdx].contName), '$1$2.$3');
      this.price = this.price.replace('.', '$#$').replace(/\./g,"").replace('$#$', '.');
      if(this.price.indexOf('.') < 0 && this.price !== ''){ //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
        this.price = parseFloat(this.price);
      }
    },
    changeCount() {
      this.amount = event.target.value.replace(/\D/g,'');
    },
    all() {
      this.amount = this.flatAmount;
    },
    showConfirm (recType, isLight, usable) {
      this.isShowLayer = true;
      this.recType = recType;
      this.isLight = isLight;
      this.flatAmount = usable;
      this.amount = usable;
    },
    confirm() {
      if (this.isLight) {
        this.price = '';
        if (this.flatAmount * this.flatIdx / 100 > 0 && this.flatAmount * this.flatIdx / 100 < 1) {
          this.$toast(this.$t('notice.triggerCount'));
          return false;
        } else if (this.flatAmount * this.flatIdx / 100 >= 1) {
          this.amount = Math.floor(this.flatAmount * this.flatIdx / 100)
        } else if (this.flatAmount * this.flatIdx / 100 <= 0) {
          this.$toast(this.$t('notice.amount'));
          return false;
        }
      } else {
        if (this.price.length < 1) {
          this.$toast(this.$t('notice.price'));
          return false;
        }
        if (this.amount.length < 1) {
          this.$toast(this.$t('notice.amount'));
          return false;
        }
      }
      this.isShowLayer = false;
      this.$emit('showConfirm', this.price, this.amount, this.recType);
      this.price = '';
      this.amount = '';
    }
  }
}
</script>
<style lang="less" scoped>
.kaicang{
  position: relative;
  margin-top: 40px;
}
.kaicang_title{
  height: 20px;
  padding: 11px 15px 13px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: -40px;
  right: 0;
  .kaicang_title_left{
    display: flex;
    align-items: center;
    height: 20px;
    color: #24324C;
    font-size: 14px;
    font-family: 'Medium';
    img{
      padding-left: 4px;
      width: 11px;
      height: 6px;
    }
  }
  .kaicang_title_right{
    display: flex;
    align-items: center;
    height: 20px;
    color: #FF3A30;
    font-size: 12px;
    font-family: 'Medium';
    img{
      padding-left: 6px;
      width: 12px;
      height: 16px;
    }
  }
}
table{
  width: 316px;
  margin: 0 auto;
  padding-bottom: 10px;
  tr{
    height: 20px;
    line-height: 20px;
    th{
      min-width: 100px;
      color: #B2B8C4;
      font-size: 12px;
      font-family: 'Regular';
      text-align: left;
      font-weight: normal;
      &:nth-child(3){
        text-align: right;
      }
    }
    td{
      color: #3E4551;
      font-size: 14px;
      font-weight: 'Bold';
      text-align: left;
      &:nth-child(3){
        text-align: right;
      }
    }
  }
}
.chicang_title{
  padding-top: 10px;
  display: flex;
  align-items: center;
  height: 24px;
  justify-content: space-between;
  font-size: 12px;
  padding-left: 18px;
  padding-right: 13px;
  color: #B2B8C4;
  font-family: 'Medium';
  p:nth-child(1) {
    span{
      &:nth-child(1) {
        color: #007AFF;
        padding-right: 10px;
      }
      &:nth-child(2) {
        color: #00D183;
      }
    }
  }
}
.chicang_top{
  border-bottom: dashed 1px #EAF5FF;
}
.chicang_bottom{
  padding-bottom: 14px;
}
.btn_wrap{
  padding-bottom: 20px;
  padding-left: 18px;
  padding-right: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button{
    width: 80px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    color: #ffffff;
    text-align: center;
    background-color: #007AFF;
    font-size: 12px;
  }
  .more{
    width: 28px;
    height: 28px;
    vertical-align: middle;
  }
}

.mask{
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  .title{
    padding-bottom: 20px;
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
    width: 100%;
    height: auto;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #ffffff;
    div.item {
      width: 340px;
      height: 47px;
      border-bottom: solid 1px #F0F0F0;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 14px;
      input{
        width: 200px;
        margin-top: 19px;
        border: none;
        outline: none;
        color: #000000;
        text-align: right;
        flex: 1;
      }
      .all{
        color: #007AFF;
        font-size: 14px;
        margin-left: 12px;
      }
      div.fire_wrap{
        padding-top: 19px;
      }
      img.fire{
        width: 12px;
        vertical-align: middle;
      }
    }
    .btn{
      width: 300px;
    }
    .notice{
      width: 340px;
      margin: 0 auto;
      text-align: right;
      font-size: 14px;
      height: 36px;
      line-height: 36px;
      color: #2c3e50;
    }
  }
}
.mask{
  .items2{
    min-height: 450px;
  }
  .items_list{
    display: flex;
    padding-top: 20px;
    li{
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      border-bottom: solid 2px transparent;
      color: #24324C;
      margin-left: 20px;
      margin-right: 10px;
      &.active{
        color: #007AFF;
        border-bottom: solid 2px #007AFF;
      }
    }
  }
  .drop-menu{
    height: 47px;
  }
  .btn_wrap2{
    margin-top: 100px;
    display: flex;
    .btn{
      width: 160px;
      &:nth-last-child(1) {
        background-color: #24324C;
      }
    }
  }
}

</style>
