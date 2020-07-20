<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <div class="title">{{ type }}</div>
      <span />
    </div>
    <ul class="list">
      <li><p>{{ $t('asset.details.rights') }}</p><p>{{ myAssetInfo.balance || 0 }}</p></li>
      <li><p>{{ $t('asset.details.rate') }}</p><p>{{ myAssetInfo.bondRate || 0 }}</p></li>
      <li><p>{{ $t('asset.details.available') }}</p><p>{{ myAssetInfo.usable || 0 }}</p></li>
      <li><p>{{ $t('asset.details.used') }}</p><p>{{ myAssetInfo.used || 0 }}</p></li>
      <li><p>{{ $t('asset.details.freeze') }}</p><p>{{ myAssetInfo.freeze || 0 }}</p></li>
      <li><p>{{ $t('asset.details.unrealized') }}</p><p>{{ myAssetInfo.profit || 0 }}</p></li>
      <li><p>{{ $t('asset.details.realized') }}</p><p>{{ myAssetInfo.settle || 0 }}</p></li>
      <li />
    </ul>
    <div class="title2">{{ $t('asset.details.bills') }}</div>
    <div class="bottom">
      <div v-if="holdList.length > 0">
        <div v-for="(item, index) in holdList" :key="index">
          <div class="chicang_title">
            <p><span>{{ item.contName }}{{ item.recType === 1 ? $t('global.openMore') : $t('global.openEmpty') }}</span></p>
            <p>{{ $t('contract.index.leverage') }} X{{ item.lever }}</p>
          </div>
          <table class="chicang_bottom">
            <tr>
              <th>{{ $t('contract.index.HoldPrice') }}</th>
              <th>{{ $t('contract.index.HoldAmount') }}</th>
              <th>{{ $t('contract.index.canBeFlat') }}</th>
            </tr>
            <tr>
              <td>{{ item.averagePosition }}</td>
              <td>{{ item.sheet }}</td>
              <td>{{ item.usable }}</td>
            </tr>
            <tr>
              <th>{{ $t('contract.index.force') }}</th>
              <th>{{ $t('contract.index.earnings') }}</th>
              <th>{{ $t('contract.index.earningRate') }}</th>
            </tr>
            <tr>
              <td>{{ item.predict }}</td>
              <td>{{ item.profit }}</td>
              <td>{{ item.rate }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div v-else>
        <NoData />
      </div>
      <ul class="action">
        <li @click="toTransfer()">
          <div><img src="@/static/img/asset/details_huazhuan.png"></div>
          <p>{{ $t('asset.details.transfer') }}</p>
        </li>
        <li @click="toTrading()">
          <div><img src="@/static/img/asset/details_jiaoyi.png"></div>
          <p>{{ $t('asset.details.deal') }}</p>
        </li>
      </ul>
    </div>
    
  </div>
</template>
<script>
let contractSourceTimer, contractSource = null;
import { baseUrl, getCookie, filterPoint, decryptByDES } from '@/utils/utils';
import numeral from 'numeral';
import NoData from '@/components/empty';
export default {
  components: {
    NoData
  },
  data () {
    return {
      myAssetInfo: {},
      type: '',
      userId: '',
      holdList: []
    }
  },
  mounted() {
    const { contName } = this.$route.query;
    const contractAccounts = JSON.parse(localStorage.getItem('contractAccounts')) || [];
    const index = contractAccounts.findIndex((element) => {
      return contName.toUpperCase() === element.contName.toUpperCase();
    })
    this.contId = index < 0 ? contractAccounts[0].contId : contractAccounts[index].contId;
    this.type = index < 0 ? contractAccounts[0].contName : contractAccounts[index].contName;
    this.userId = decryptByDES(getCookie('token')) || '';
    this.getContractSource(this.contId);
  },
  beforeDestroy() {
    clearTimeout(contractSourceTimer);
    contractSource.close();
    contractSource = null;
  },
  methods: {
    toTransfer() {
      const { contName } = this.$route.query;
      const contractAccounts = JSON.parse(localStorage.getItem('contractAccounts'));
      let index = contractAccounts.findIndex((element) => {
        return contName === element.contName;
      })
      index = index < 0 ? 0 : index;
      const transferInfo = {
        coinType: contractAccounts[index].coinId,
        contId: contractAccounts[index].contId
      }
      sessionStorage.setItem('transferInfo', JSON.stringify(transferInfo))
      this.$router.push('/asset/transfer/1')
    },
    toTrading() {
      this.$router.push({path: '/contract', query: { name: this.$route.query.contName }});
    },
    back () {
      this.$router.go(-1)
    },
    getContractSource(contId) {
      const _this = this;
      contractSource = new EventSource(`${baseUrl}sse/getContract?contId=${contId}&userId=${this.userId}`);
      contractSource.onmessage = function (event) {
        const obj = JSON.parse(event.data);
        obj.assets.balance = obj.assets.balance ? filterPoint(obj.assets.balance, 4) : 0;
        obj.assets.settle = obj.assets.settle ? filterPoint(obj.assets.settle, 4) : 0;
        obj.assets.usable = obj.assets.usable ? filterPoint(obj.assets.usable, 4) : 0;
        obj.assets.used = obj.assets.used ? filterPoint(obj.assets.used, 4) : 0;
        obj.assets.freeze = obj.assets.freeze ? filterPoint(obj.assets.freeze, 4) : 0;
        obj.assets.profit = obj.assets.profit ? filterPoint(obj.assets.profit, 4) : 0;
        obj.assets.bondRate = numeral(obj.assets.bondRate).format('0.00%'); // 收益率
        _this.myAssetInfo = obj.assets;

        // 持仓信息
        obj.hold.forEach(element => {
          element.averagePosition = filterPoint(element.average, 4); // 持仓均价
          element.profit = filterPoint(element.profit, 4); // 未实现盈亏 收益
          element.rate = numeral(element.rate).format('0.00%'); // 收益率
          element.predict = filterPoint(element.predict, 4);  // 预估强平价
        });
        _this.holdList = obj.hold;
      };
      contractSource.onerror = function (err) {
        if (err.currentTarget.readyState === 2) {
          contractSourceTimer = setTimeout(() => {
            _this.getcontractSource(contId);
            clearTimeout(contractSourceTimer);
          }, 3000)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .list{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 311px;
    margin: 0 auto;
    background-color: #ffffff;
    padding-top: 15px;
    padding-left: 14px;
    padding-right: 15px;
    padding-bottom: 16px;
  }
  .title2{
    color: #24324C;
    font-size: 20px;
    padding-left: 18px;
    font-weight: bold;
    text-align: left;
    font-family: 'Semibold';
  }
  .bottom{
    background-color: #ffffff;
    width: 340px;
    margin: 0 auto;
  }
  li{
    width: 32%;
    margin-bottom: 20px;
    &:nth-child(7), &:nth-child(8), &:nth-child(9){
      margin-bottom: 0;
    }
    &:nth-of-type(3n) {
      text-align: right;
    }
    p:nth-child(1){
      color: #B2B8C4;
      font-size: 12px;
      margin-bottom: 5px;
      height: 17px;
      line-height: 17px
    }
    p:nth-child(2){
      font-family: 'DIN Alternate Bold';
      color: #24324C;
      font-size: 14px;
      height: 16px;
      line-height: 16px;
    }
  }
  .chicang_bottom{
    padding-bottom: 14px;
  }
  table{
    width: 316px;
    margin: 0 auto;
    padding-bottom: 10px;
    tr{
      height: 20px;
      line-height: 20px;
      th{
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
  .action{
    display: flex;
    justify-content: space-around;
    padding-top: 4px;
    li{
      display: flex;
      flex-direction: column;
      align-items: center;
      div{
        width: 45px;
        height: 44px;
        position: relative;
        box-shadow: 0 0 7px rgba(#007AFF, 0.14);
        border-radius: 4px;
        img{
          height: 24px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      p{
        padding-top: 5px;
        text-align: center;
      }
    }
  }

</style>
