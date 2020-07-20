<template>
  <div :class="['wrapper']">
    <div class="items">
      <p @click="showContractList = !showContractList;showTypesList = false;showStatusList = false;">
        {{ contractList[contractIdx].contName }}
        <img src="@/static/img/bottom.png">
      </p>
      <ul v-show="showContractList && showList">
        <li v-for="(item, index) in contractList" :key="index" :class="contractIdx === index ? 'active' : ''" @click="changeContractIdx(index)">{{item.contName}}</li>
      </ul>
    </div>
    <div class="items">
      <p @click="showContractList = false;showTypesList = !showTypesList;showStatusList = false;">
        {{ typesList[typesIdx] }}
        <img src="@/static/img/bottom.png">
      </p>
      <ul v-show="showTypesList && showList">
        <li v-for="(item, index) in typesList" :key="index" :class="typesIdx === index ? 'active' : ''" @click="changeTypesIdx(index)">{{ item }}</li>
      </ul>
    </div>
    <div class="items">
      <p @click="showContractList = false;showTypesList = false;showStatusList = !showStatusList;">
        {{ statusList[statusIdx] }}
        <img src="@/static/img/bottom.png">
      </p>
      <ul v-show="showStatusList && showList">
        <li v-for="(item, index) in statusList" :key="index" :class="statusIdx === index ? 'active' : ''" @click="changeStatusIdx(index)">{{ item }}</li>
      </ul>
    </div>
    <div class="mask" v-show="showContractList || showTypesList || showStatusList" @click="hideLayer()" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: [
    'showList',
    'contractIdx',
    'typesList',
    'typesIdx',
    'statusList',
    'statusIdx'
  ],
  data () {
    return {
      showContractList: false,
      showTypesList: false,
      showStatusList: false
    }
  },
  computed: {
    ...mapState(['contractList'])
  },
  methods: {
    hideLayer() {
      this.showContractList = false;
      this.showTypesList = false;
      this.showStatusList = false;
    },
    changeContractIdx(index) {
      this.showContractList = false;
      this.$emit('changeContractIdx', index);
    },
    changeTypesIdx(index) {
      this.showTypesList = false;
      this.$emit('changeTypesIdx', index);
    },
    changeStatusIdx(index) {
      this.showStatusList = false;
      this.$emit('changeStatusIdx', index);
    }
  }
}
</script>
<style lang="less" scoped>
  .mask{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .wrapper{
    height: auto;
    display: flex;
    justify-content: space-between;
    padding-left: 11px;
    padding-right: 12px;
    .items{
      position: relative;
      p{
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        color: #24324C;
        font-family: 'Medium';
        padding-left: 6px;
        position: relative;
        width: 91px;
        border: solid 1px #C6CBD3;
        border-radius: 2px;
        display: flex;
        align-items: center;
        img{
          width: 11px;
          height: 6px;
          position: absolute;
          right: 9px;
          top: 10px;
        }
      } 
      ul{
        padding-top: 5px;
        padding-bottom: 5px;
        position: absolute;
        width: 97px;
        border: solid 1px #C6CBD3;
        top: 26px;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        background-color: #ffffff;
        z-index: 100;
        li{
          height: 20px;
          line-height: 20px;
          padding-left: 6px;
          color: #24324C;
          font-size: 12px;
          &.active{
            color: #007AFF;
          }
        }
      }
    }
  }
</style>
