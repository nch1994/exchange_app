<template>
  <div>
    <div class="kaicang_info">
      <div class="kaicang_info_left">
        <ul class="kaicang_info_left_weituo">
          <li v-for="(item, index) in $t('contract.index.weituoTypes')" :key="index" :class="weituoIdx === index ? 'active' : ''" @click="changeIdx(index)">{{item}}</li>
        </ul>
        <div class="kaicang_info_left_ganggan">
          <div @click="showLever()">
            <input type="text" v-model="ganggan" :placeholder="$t('contract.index.leverage')" readonly>
            <p>
              <span>{{ assetInfo.lever || 100 }}X</span>
              <img src="@/static/img/bottom.png" alt="">
            </p>
          </div>
          <ul class="leverItem" v-show="isShowLever">
            <li v-for="(item, index) in leverList" :key="index" :class="leverIdx === index ? 'active' : ''" @click.stop="changeLeverIdx(index)">
              <span>{{ item }}X</span>
              <img v-show="leverIdx === index" src="@/static/img/asset/right.png" class="right" alt="">
            </li>
          </ul>
        </div>
        <div v-show="weituoIdx === 0" class="kaicang_info_left_price">
          <input type="text" v-model="price" @input="changePrice()" :placeholder="$t('contract.index.price')">
          <span>{{ contractList[contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : 'USD' }}</span>
        </div>
        <div v-show="weituoIdx === 1" class="kaicang_info_left_price">
          <input type="text" :value="contractList[contractIdx].price" placeholder="" readonly>
          <span>{{canuseUnit}}</span>
        </div>
        <div class="kaicang_info_left_number">
          <input type="text" v-model="amount" @input="changeCount()" :placeholder="amountNotice">
          <span />
        </div>
        <div class="kaicang_info_left_animate">
          <van-slider v-model="value" class="custom-bg" active-color="transparent" @input="onChange" inactive-color="transparent">
            <div slot="button" class="custom-button" />
          </van-slider>
        </div>
        <div class="kaicang_info_left_btn kaicang_info_left_green">
          <div :class="amount > canFlatEmpty && curIndex === 1 ? 'disabled' : ''">
            <p v-if="userId === ''" @click="login">{{ $t('global.login') }}</p>
            <p v-else-if="contSwitch === 0">{{ $t('global.notopen') }}</p>
            <p v-else-if="curIndex === 0" @click="showConfirm(1)"><span>{{ $t('contract.index.buy') }}</span><span>{{ $t('contract.index.rose') }}</span></p>
            <p v-else-if="curIndex === 1" @click="showConfirm(10)"><span>{{ $t('contract.index.flatEmpty') }}</span><span>{{ $t('contract.index.rose') }}</span></p>
          </div>
          <p><span class="can">{{ $t('contract.index.canUse') }}</span><span>{{ assetInfo.usable || 0 }}{{ canuseUnit }}</span></p>
          <p v-show="curIndex === 0"><span class="can">{{ $t('contract.index.canOpen') }}</span><span>{{ assetInfo.size || 0 }}{{ $t('contract.index.piece') }}</span></p>
          <p v-show="curIndex === 1"><span class="can">{{ $t('contract.index.canFlat') }}</span><span>{{ canFlatEmpty || 0 }}{{ $t('contract.index.piece') }}</span></p>
        </div>
        <div class="kaicang_info_left_btn kaicang_info_left_red">
          <div :class="amount > canFlatMore && curIndex === 1 ? 'disabled' : ''">
            <p v-if="userId === ''" @click="login">{{ $t('global.login') }}</p>
            <p v-else-if="contSwitch === 0">{{ $t('global.notopen') }}</p>
            <p v-else-if="curIndex === 0" @click="showConfirm(0)"><span>{{ $t('contract.index.sale') }}</span><span>{{ $t('contract.index.fall') }}</span></p>
            <p v-else-if="curIndex === 1" @click="showConfirm(11)"><span>{{ $t('contract.index.flatMore') }}</span><span>{{ $t('contract.index.fall') }}</span></p>
          </div>
          <p><span class="can">{{ $t('contract.index.canUse') }}</span><span>{{ assetInfo.usable || 0 }}{{ canuseUnit }}</span></p>
          <p v-show="curIndex === 0"><span class="can">{{ $t('contract.index.canOpen') }}</span><span>{{ assetInfo.size || 0 }}{{ $t('contract.index.piece') }}</span></p>
          <p v-show="curIndex === 1"><span class="can">{{ $t('contract.index.canFlat') }}</span><span>{{ canFlatMore || 0 }}{{ $t('contract.index.piece') }}</span></p>
        </div>
      </div>
      <div class="kaicang_info_right">
        <div class="kaicang_info_right_title">
          <p>{{ $t('contract.index.price') }}<span>({{ contractList[contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : 'USD' }})</span></p>
          <p>{{ $t('contract.index.count') }}<span>({{ $t('contract.index.piece') }})</span></p>
        </div>
        <ul class="kaicang_info_right_list kaicang_info_right_red">
          <li v-for="(item, index) in depthListAsks" :key="index" @click="setPrice(item.price)">
            <span>{{item.price}}</span>
            <span>{{item.amount}}</span>
            <div :style="{width: item.percent}" />
          </li>
        </ul>
        <div class="kaicang_info_right_green_title" @click="setPrice(contractList[contractIdx].price)">{{ contractList[contractIdx].price }}</div>
        <ul class="kaicang_info_right_list kaicang_info_right_green">
          <li v-for="(item, index) in depthListBids" :key="index" @click="setPrice(item.price)">
            <span>{{item.price}}</span>
            <span>{{item.amount}}</span>
            <div :style="{width: item.percent}" />
          </li>
        </ul>
      </div>
    </div>
    <div class="mask" v-show="isShowLever" @click="isShowLever = false" />
  </div>
</template>
<script>
import { unzip, getCookie, filterPoint, websocketOkex, filterDigit, filterInputDigit, decryptByDES } from '@/utils/utils';
import numeral from 'numeral';
import { mapState, mapActions } from 'vuex';
import axios from 'axios';
let timer = null;
let timerODINDepth = null;
export default {
  props: ['contractIdx', 'assetInfo', 'curIndex', 'contSwitch', 'canFlatEmpty', 'canFlatMore'],
  data () {
    return {
      weituoIdx: 0,
      priceIdx: 0,
      ganggan: '',
      amount: '',
      price: '',
      value: 0,
      userId: '',
      ws: null,//建立的连接
      lockReconnect: false,//是否真正建立连接
      timeoutnum: null,//断开 重连倒计时
      websocketFlag: true,
      depthListBids: new Array(9).fill({price: '--', amount: '--'}),
      depthListAsks: new Array(9).fill({price: '--', amount: '--'}),
      depthPrice: '--',
      canuseUnit: 'USDT',
      priceUnit: '',
      amountNotice: '',
      contractIdx2: '',
      leverList: [10, 20, 50, 75, 100],
      leverIdx: 4,
      isShowLever: false
    }
  },
  computed: {
    ...mapState(['contractList']),
  },
  watch: {
    contractIdx: function(newVal){
      this.websocketFlag = false;
      this.depthListBids = new Array(9).fill({price: '--', amount: '--'});
      this.depthListAsks = new Array(9).fill({price: '--', amount: '--'});
      sessionStorage.removeItem('depthAsks400');
      sessionStorage.removeItem('depthBids400');
      sessionStorage.removeItem('depthListAsks');
      sessionStorage.removeItem('depthListBids');
      this.depthPrice = '--';
      if (timerODINDepth) clearTimeout(timerODINDepth);
      if (this.ws) {
        this.ws.close();
      }
      if (parseFloat(this.contractList[newVal].okex)) {
        this.getOdinDepth()
      } else {
        this.initWebpack()
      }
      this.price = '';
      this.amount = '';
      this.canuseUnit = this.contractList[newVal].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[newVal].contName.indexOf('(') > -1 ? this.contractList[newVal].contName.match(/\((\S*)\)/)[1] : this.contractList[newVal].contName.split('/')[0];
      this.priceUnit = this.contractList[newVal].contName.indexOf('USDT') > -1 ? this.contractList[newVal].contName.split('/')[0] : 'USD';
      this.amountNotice = `${this.$t('contract.index.count')}: ${this.contractList[newVal].sheetValue}${this.priceUnit}/${this.$t('global.unit')}`;
      this.value = 0;
      sessionStorage.removeItem('depthPrice');
      sessionStorage.removeItem('depthListAsks');
      sessionStorage.removeItem('depthListBids');
    },
    curIndex: function() {
      this.price = '';
      this.amount = '';
      this.value = 0
    }
  },
  mounted () {
    this.contractIdx2 = this.$route.query.index ? this.$route.query.index : 0;
    this.userId = decryptByDES(getCookie('token')) || '';
    if (parseFloat(this.contractList[this.contractIdx2].okex)) {
      this.getOdinDepth();
    } else {
      this.initWebpack();
    }
    sessionStorage.removeItem('depthAsks400');
    sessionStorage.removeItem('depthBids400');
    sessionStorage.removeItem('depthListAsks');
    sessionStorage.removeItem('depthListBids');
    this.canuseUnit = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? 'USDT' : this.contractList[this.contractIdx].contName.indexOf('(') > -1 ? this.contractList[this.contractIdx].contName.match(/\((\S*)\)/)[1] : this.contractList[this.contractIdx].contName.split('/')[0];
    this.priceUnit = this.contractList[this.contractIdx].contName.indexOf('USDT') > -1 ? this.contractList[this.contractIdx].contName.split('/')[0] : 'USD';
    this.amountNotice = `${this.$t('contract.index.count')}: ${this.contractList[this.curIndex].sheetValue}${this.priceUnit}/${this.$t('global.unit')}`;
    timer = setInterval(() => {
      const depthListAsks = JSON.parse(sessionStorage.getItem('depthListAsks')) || new Array(9).fill({price: '--', amount: '--'})
      const depthListBids = JSON.parse(sessionStorage.getItem('depthListBids')) || new Array(9).fill({price: '--', amount: '--'})
      this.depthPrice = sessionStorage.getItem('depthPrice') || '--'
      this.depthListAsks = depthListAsks.length > 0 ? depthListAsks : new Array(9).fill({price: '--', amount: '--'});
      this.depthListBids = depthListBids.length > 0 ? depthListBids : new Array(9).fill({price: '--', amount: '--'});
    }, 500)
  },
  beforeDestroy() {
    this.websocketFlag = false;
    clearTimeout(timerODINDepth);
    clearInterval(timer);
    if (this.ws) {
      this.ws.close();
    }
    this.timeoutnum && clearTimeout(this.timeoutnum);
    sessionStorage.removeItem('depthAsks400');
    sessionStorage.removeItem('depthBids400');
    sessionStorage.removeItem('depthListAsks');
    sessionStorage.removeItem('depthListBids');
  },
  methods: {
    ...mapActions(['setLever']),
    changeLever() {
      const data = {
        contId: this.contractList[this.contractIdx].contId,
        lever: this.leverList[this.leverIdx],
        userId: this.userId
      }
      this.setLever(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        this.isShowLever = false;
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'));
      })
    },
    changeLeverIdx(index) {
      this.leverIdx = index;
      this.isShowLever = false;
      this.changeLever();
    },
    setPrice(price) {
      this.price = price;
    },
    showLever() {
      if (this.userId === '') {
        this.$router.push('/login');
        return;
      }
      let index = this.leverList.findIndex((item) => {
        return parseInt(item) === parseInt(this.assetInfo.lever);
      })
      this.leverIdx = index < 0 ? 4 : index;
      this.isShowLever = true;
    },
    initWebpack() {
      if (parseFloat(this.contractList[this.contractIdx].okex)) {
        return;
      }
      this.ws = new WebSocket(websocketOkex);
      this.ws.onopen = this.onopen;
      this.ws.onmessage = this.onmessage;
      this.ws.onclose = this.onclose;
      this.ws.onerror = this.onerror;
    },
    reconnect() {//重新连接
      var that = this;
      if(that.lockReconnect && !this.websocketFlag) {
        return;
      };
      that.lockReconnect = true;
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function () {
        //新连接
        that.initWebpack();
        that.lockReconnect = false;
      }, 5000);
    },
    onopen() {
      var subscribeData = `{"op": "subscribe", "args": ["swap/depth:${this.contractList[this.contractIdx].okex}", "swap/candle60s:${this.contractList[this.contractIdx].okex}"]}`;
      this.ws.send(subscribeData);
    },
    onmessage(evt) {
      if (evt.data instanceof Blob) {
        let reader = new FileReader();
        reader.readAsBinaryString(evt.data);
        const _this = this
        reader.onload = function() {
          if (this.result) {
            if (unzip(this.result) === 'pong') {
              return;
            }
            const { table, data, action } = JSON.parse(unzip(this.result));
            if (table === 'swap/depth') {
              if (Array.isArray(data)) {
                let depthAsks400 = {};
                let depthBids400 = {};
                if (action === 'partial') {
                  data[0].asks.map((item) => {
                    return depthAsks400[item[0]] = item[1]
                  });
                  sessionStorage.setItem('depthAsks400', JSON.stringify(depthAsks400));
                  data[0].bids.map((item) => {
                    return depthBids400[item[0]] = item[1]
                  });
                  sessionStorage.setItem('depthBids400', JSON.stringify(depthBids400));
                } else {
                  _this.setList(data[0])
                }
              }
            }
          }
        }
      }
    },
    getOdinDepth() {
      if (timerODINDepth) clearTimeout(timerODINDepth)
      if (parseFloat(this.contractList[this.contractIdx].okex)) {
        axios({
          url: `https://tinance.pro/appApi.json?action=depth&symbol=${this.contractList[this.contractIdx].okex}&size=9`,
          method: 'get',
        }).then(res => {
          if (res.status === 200) {
            const { data } = res.data;
            let minLength = Math.min(data.asks.length, data.bids.length);
            minLength = minLength > 9 ? 9 : minLength;
            const depthListAsksObj = data.asks.sort().slice(0, minLength).reverse();
            const depthListBidsObj = data.bids.sort().slice(-1 * minLength).reverse();
            let depthListAsks = []
            depthListAsksObj.forEach((element) => {
              if (this.contractList[this.contractIdx].contName.indexOf('BTC') > -1 ) {
                element[1] = Number(element[1]) * 89898
              }
              if (this.contractList[this.contractIdx].contName.indexOf('ETH') > -1) {
                element[1] = Number(element[1]) * 50003
              }
              depthListAsks.push({
                price: filterPoint(element[0], filterDigit(this.contractList[this.contractIdx].contName)),
                amount: Math.floor(Number(element[1]))
              })
            })
            let depthListBids = []
            depthListBidsObj.forEach((element) =>{
              if (this.contractList[this.contractIdx].contName.indexOf('BTC') > -1 ) {
                element[1] = Number(element[1]) * 89898
              }
              if (this.contractList[this.contractIdx].contName.indexOf('ETH') > -1) {
                element[1] = Number(element[1]) * 50003
              }
              depthListBids.push({
                price: filterPoint(element[0], filterDigit(this.contractList[this.contractIdx].contName)),
                amount: Math.floor(Number(element[1]))
              })
            })
            const depthAverageArr = [depthListAsks.slice(-1)[0] ? depthListAsks.slice(-1)[0].price : 0, depthListBids[0] ? depthListBids[0].price : 0];
            let depthPrice = '--';
            if (depthAverageArr.indexOf(0) > -1) {
              depthPrice = depthAverageArr.indexOf(0) === 0 ? depthAverageArr[1] : depthAverageArr[0];
            } else {
              var rand = Math.floor( Math.random() * depthAverageArr.length);
              depthPrice = depthAverageArr[rand];
            }
            depthListBids.forEach((item, index) => {
              item.percent = numeral(numeral(item.amount)._value / (numeral(item.amount)._value + numeral(depthListAsks[index].amount)._value)).format('0%');
              depthListAsks[index].percent = numeral(1 - numeral(item.percent)._value).format('0%');
            })
            sessionStorage.setItem('depthPrice', depthPrice);
            sessionStorage.setItem('depthListAsks', JSON.stringify(depthListAsks));
            sessionStorage.setItem('depthListBids', JSON.stringify(depthListBids));
            timerODINDepth = setTimeout(() => {
              this.getOdinDepth()
            }, 1000)
          }
        })
      }
    },
    onclose() {
      if (this.websocketFlag) {
        this.reconnect();
      }
    },
    onerror() {
      if (this.websocketFlag) {
        this.reconnect();
      }
    },
    changeIdx (index) {
      this.weituoIdx = index;
      if (this.curIndex === 0) {
        this.amount = numeral(this.assetInfo.size)._value * this.value / 100;
      } else if (this.curIndex === 1) {
        const arr = [numeral(this.canFlatEmpty)._value, numeral(this.canFlatMore)._value]
        this.amount = Math.max(...arr) * this.value / 100;
      }
    },
    login() {
      this.$router.push('/login')
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
    showConfirm (recType) {
      if (this.price.length < 1 && this.weituoIdx === 0) {
        this.$toast(this.$t('notice.price'));
        return false;
      }
      if (this.weituoIdx === 1) {
        this.price = ''
      }
      if (this.amount.length < 1) {
        this.$toast(this.$t('notice.amount'));
        return false;
      }
      this.$emit('showConfirm', this.price, this.amount, recType)
    },
    onChange(value) {
      if (this.curIndex === 0 ) {
        this.amount = numeral(this.assetInfo.size)._value * value / 100
      } else if (this.curIndex === 1) {
        const arr = [numeral(this.canFlatEmpty)._value, numeral(this.canFlatMore)._value]
        this.amount = Math.max(...arr) * this.value / 100;
      }
    },
    setList(datas) {
      if (datas) {
        // ask是卖价, bids是买
        let depthAsks400 = JSON.parse(sessionStorage.getItem('depthAsks400'));
        let depthBids400 = JSON.parse(sessionStorage.getItem('depthBids400'));
        if (!depthAsks400 || !depthBids400) {
          return;
        }
        datas.asks.forEach((element) => {
          if (depthAsks400.hasOwnProperty(element[0])) {
            if (parseFloat(element[1]) === 0) {
              delete depthAsks400[element[0]];
            } else if (numeral(element[1])._value !== numeral(depthAsks400[element[0]])._value) {
              depthAsks400[element[0]] = element[1];
            }
          } else {
            depthAsks400[element[0]] = element[1];
          }
        })
        sessionStorage.setItem('depthAsks400', JSON.stringify(depthAsks400));

        datas.bids.forEach((element) => {
          if (depthBids400.hasOwnProperty(element[0])) {
            if (parseFloat(element[1]) === 0) {
              delete depthBids400[element[0]];
            } else if (numeral(element[1])._value !== numeral(depthBids400[element[0]])._value) {
              depthBids400[element[0]] = element[1];
            }
          } else {
            depthBids400[element[0]] = element[1];
          }
        })
        sessionStorage.setItem('depthBids400', JSON.stringify(depthBids400));

        const depthListAsksObj = {};
        
        Object.keys(depthAsks400).sort((a, b) => a - b).slice(0, 40).forEach(function(key) {
          depthListAsksObj[key] = depthAsks400[key];
        });
        let depthListAsks = []
        for (let i in depthListAsksObj) {
          depthListAsks.push({
            price: filterPoint(i, filterDigit(this.contractList[this.contractIdx].contName)),
            amount: numeral(depthListAsksObj[i])._value * Math.floor(Math.random() * 50 + 50),
          })
        }
        depthListAsks = depthListAsks.sort((a, b) => b.price - a.price).filter(element => element.amount > 0).slice(-9);

        const depthListBidsObj = {};
        Object.keys(depthBids400).sort((a, b) => b - a).slice(0, 40).forEach(function(key) {
          depthListBidsObj[key] = depthBids400[key];
        });
        let depthListBids = []
        for (let i in depthListBidsObj) {
          depthListBids.push({
            price: filterPoint(i, filterDigit(this.contractList[this.contractIdx].contName)),
            amount: numeral(depthListBidsObj[i])._value * Math.floor(Math.random() * 50 + 50),
          })
        }
        depthListBids = depthListBids.sort((a, b) => b.price - a.price).filter(element => element.amount > 0).slice(0, 9);
        depthListBids.forEach((item, index) => {
          item.percent = numeral(numeral(item.amount)._value / (numeral(item.amount)._value + numeral(depthListAsks[index].amount)._value)).format('0%');
          depthListAsks[index].percent = numeral(1 - numeral(item.percent)._value).format('0%');
        })
        const depthAverageArr = [depthListAsks.slice(-1)[0].price, depthListBids[0].price];
        var rand = Math.floor( Math.random() * depthAverageArr.length);
        const depthPrice = filterPoint(depthAverageArr[rand], filterDigit(this.contractList[this.contractIdx].contName))
        sessionStorage.setItem('depthPrice', depthPrice);
        sessionStorage.setItem('depthListAsks', JSON.stringify(depthListAsks));
        sessionStorage.setItem('depthListBids', JSON.stringify(depthListBids));
      }
    }
  }
}
</script>
<style lang="less" scoped>
.mask{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.layer{
  background-color: rgba(255, 255, 255, 0);
  width: 100px;
  height: 100px;
}
.disabled{
  opacity: 0.6;
  pointer-events: none;
}
.kaicang_info{
  display: flex;
  .kaicang_info_left{
    height: 380px;
    border-right: solid 1px #EFF8FD;
    width: 139px;
    padding-left: 17px;
    padding-right: 13px;
    .kaicang_info_left_weituo{
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      li{
        font-size: 12px;
        font-family: 'Medium';
        text-align: center;
        color: #C6CBD3;
        border-top: solid 1px #C6CBD3;
        border-bottom: solid 1px #C6CBD3;
        height: 27px;
        line-height: 27px;
        width: 50%;
        &:nth-child(1) {
          border-top-left-radius: 2px;
          border-bottom-left-radius: 2px;
          border-left: solid 1px #C6CBD3;
        }
        &:nth-child(2) {
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
          border-right: solid 1px #C6CBD3;
        }
        &.active{
          color: #007AFF;
          border-top: solid 1px #007AFF;
          border-bottom: solid 1px #007AFF;
          &:nth-child(1) {
            border-left: solid 1px #007AFF;
            border-right: solid 1px #007AFF;
          }
          &:nth-child(2) {
            border-right: solid 1px #007AFF;
            border-left: solid 1px #007AFF;
          }
        }
      }
    }
    .kaicang_info_left_ganggan{
      width: 137px;
      height: 25px;
      border: solid 1px #C6CBD3;
      font-size: 12px;
      position: relative;
      margin-bottom: 10px;
      div{
        display: flex;
        align-items: center;
        height: 25px;
        justify-content: space-between;
        input{
          height: 20px;
          line-height: 20px;
          color: #24324C;
          width: 74px;
          padding-left: 10px;
          border: none;
        }
        p{
          span{
            color: #007AFF;
          }
          img{
            width: 12px;
            padding-left: 2px;
            padding-right: 6px;
          }
        }
      }
    }
    .kaicang_info_left_price{
      width: 137px;
      height: 30px;
      border: solid 1px #C6CBD3;
      font-size: 12px;
      margin-bottom: 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      input{
        height: 15px;
        border: none;
        padding-left: 10px;
        width: 60px;
      }
      span{
        padding-right: 10px;
        color: #C6CBD3;
      }
    }
    .kaicang_info_left_number{
      width: 137px;
      height: 30px;
      display: flex;
      align-items: center;
      font-size: 12px;
      border: solid 1px #C6CBD3;
      border-radius: 2px;
      input{
        height: 12px;
        line-height: 12px;
        width: 97px;
        border: none;
        padding-left: 10px;
      }
      span{
        color: #C6CBD3;
      }
    }
    .kaicang_info_left_animate{
      margin-top: 13px;
      height: 18px;
      position: relative;
      background-image: url('../../static/img/contract/slider_bg.png');
      background-size: 137px 18px;
      width: 137px;
    }
    .kaicang_info_left_btn{
      font-family: 'Regular';
      padding-bottom: 9px;
      div{
        width: 139px;
        height: 36px;
        font-size: 12px;
        border-radius: 4px;
        p{
          width: 100%;
          height: 36px;
          display: flex;
          padding-top: 0;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          span:nth-child(1) {
            padding-right: 18px;
          }
          span:nth-child(2) {
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }
      p{
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #B2B8C4;
        height: 18px;
        line-height: 18px;
        padding-top: 4px;
      }
    }
    .kaicang_info_left_green{
      margin-top: 23px;
      div {
        background-color: #00D183;
      }
    }
    .kaicang_info_left_red{
      div {
        background-color: #FF3A30;
      }
    }
    .kaicang_info_left_logo{
      img{
        width: 66px;
        height: 98px;
        display: block;
        margin: 0 auto;
      }
    }
  }
  .kaicang_info_right{
    width: 134px;
    margin-left: 16px;
    .newPrice{
      display: flex;
      align-items: center;
      font-size: 12px;
      height: 24px;
      justify-content: flex-end;
      img{
        width: 12px;
        padding-left: 6px;
      }
    }
    .kaicang_info_right_title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 17px;
      color: #24324C;
      font-family: 'Medium';
      padding-bottom: 9px;
      font-size: 12px;
      color: #24324C;
      span{
        color: #C6CBD3;
      }
    }
    .kaicang_info_right_list{
      height: 162px;
      li {
        font-family: 'Regular';
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        height: 15px;
        line-height: 15px;
        margin-bottom: 3px;
        position: relative;
        span:nth-child(2){
          color: #B2B8C4;
        }
        div{
          position: absolute;
          right: 0;
          top: 0;
          width: 0;
          height: 100%;
        }
      }
    }
    .kaicang_info_right_red{
      li{
        color: #FF3A30;
        div{
          background-color: rgba(#EC5F45, 0.1);
        }
      }
    }
    .kaicang_info_right_green{
      margin-bottom: 15px;
      li{
        color: #00D183;
        div{
          background-color: rgba(#00D183, 0.1);
        }
      }
    }
    .kaicang_info_right_green_title{
      height: 24px;
      line-height: 24px;
      color: #00D183;
      font-size: 16px;
      font-family: 'Semibold';
      text-align: left;
    }
    .kaicang_info_right_price{
      li{
        display: flex;
        align-items: center;
        height: 17px;
        justify-content: space-between;
        margin-bottom: 7px;
        font-size: 12px;
        span:nth-child(1){
          color: #24324C;
        }
        span:nth-child(2){
          color: #B2B8C4;
        }
      }
    }
  }
}
.can{
  text-align: justify;
  white-space:nowrap; 
}
.custom-bg{
  width: 128px;
}
.custom-button{
  background-image: url('../../static/img/contract/slider.png');
  background-size: 15px 18px;
  width: 15px;
  height: 18px;
  position: absolute;
}
.leverTitle{
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Medium';
}
.leverItem{
  background-color: #ffffff;
  position: absolute;
  top: 27px;
  left: -1px;
  width: 137px;
  background-color: #ffffff;
  z-index: 10;
  border: solid 1px #e1e1e1;
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  li{
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: solid 1px #e7e7e7;
    font-size: 12px;
    color: #2c3e50;
    &:nth-last-child(1) {
      border-bottom: none;
    }
    &.active{
      color: #007aff;
    }
    .right{
      width: 20px;
    }
  }
}
.buttonWrap{
  display: flex;
  justify-content: space-around;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 30px;
  button{
    width: 157px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    border-radius: 4px;
    color: #ffffff;
    font-size: 14px;
    &.confirm{
      background-color: #007AFF;
    }
    &.cancel{
      background-color: #24324C;
    }
  }
}
</style>
