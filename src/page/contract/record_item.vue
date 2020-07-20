<template>
  <div class="wrapper">
    <div class="item_title">
      <p>{{ details.recText }}*100 {{details.contractType}}</p>
      <p>
        <span class="item_time">{{details.createTime}}</span>
        <!-- entrusting  canceled  traded -->
        <span style="color: #007AFF;" v-show="details.state === 1">{{ $t('asset.record.entrusting') }}</span>
        <span style="color: #B2B8C4;" v-show="details.state === 2">{{ $t('asset.record.traded') }}</span>
        <span style="color: #FF3A30;" v-show="details.state === 3">{{ $t('asset.record.canceled') }}</span>
      </p>
    </div>
    <table class="item_ul">
      <tr class="item_ul_title">
        <td>{{ $t('asset.record.EntrustAmount') }}({{ $t('asset.record.piece') }})</td>
        <td>{{ $t('asset.record.EntrustPrice') }}({{ unit2 }})</td>
        <td>{{ $t('asset.record.earnings') }}({{ unit }})</td>
      </tr>
      <tr class="item_ul_content">
        <td>{{ details.sheet }}</td>
        <td>{{ details.average }}</td>
        <td>{{ details.profit }}</td>
      </tr>
      <tr class="item_ul_title" v-show="details.state === 2">
        <td>{{ $t('asset.record.volume') }}({{ $t('asset.record.piece') }})</td>
        <td>{{ $t('asset.record.transactionAverage') }}({{ unit2 }})</td>
        <td>{{ $t('asset.record.poundage') }}({{ unit }})</td>
      </tr>
      <tr class="item_ul_content" v-show="details.state === 2">
        <td>{{ details.sheet }}</td>
        <td>{{ details.average }}</td>
        <td>{{ details.serviceCharge }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  props: ['details', 'unit', 'unit2'],
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
  .wrapper{
    padding-left: 12px;
    padding-right: 12px;
    .item_title{
      display: flex;
      height: 24px;
      align-items: center;
      justify-content: space-between;
      color: #007AFF;
      font-size: 12px;
      font-family: 'Medium';
      .item_time{
        color: #B2B8C4;
        padding-right: 5px;
      }
    }
    .item_ul{
      width: 100%;
      tr{
        &.item_ul_title{
          td{
            width: 30%;
            color: #B2B8C4;
            font-size: 12px;
            line-height: 18px;
          }
        }
        &.item_ul_content{
          padding-top: 4px;
          td{
            width: 30%;
            color: #3E4551;
            font-size: 14px;
            font-family: 'DIN Alternate Bold';
            line-height: 24px;
          }
        }
      }
    }
  }
</style>
