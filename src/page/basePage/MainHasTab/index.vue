<template>
  <div>
    <div class="content">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />

      <div class="list-wrap">
        <ul class="list-inner">
          <li v-for="(item, index) in $t('global.tabbar')" :key="index" class="list-item">
            <router-link :to="{name: item.url}" class="router-item">
              <img :src=" '/' + item.url === $route.path ? item.selectImg : item.img" alt="">
              <span :class="'/' + item.url === $route.path ? 'active' : ''">{{ item.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="es6" src="./index.js"></script>

<style lang="less" scoped>
  .list-wrap{
    border-top: solid 1px #d8d8d8;
    position: fixed;
    bottom: 0;
    height: 45px;
    width: 375px;
    .list-inner{
      display: flex;
      justify-content: space-around;
      background-color: #ffffff;
      height: 100%;
      .list-item{
        .router-item{
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 4px;
          img{
            width: 21px;
            height: 21px;
            margin-bottom: 3px;
          }
          span{
            font-size: 8px;
            height: 11px;
            line-height: 11px;
            color: #525254;
            font-weight: 'Medium';
            &.active{
              color: #007AFF;
            }
          }
        }
      }
    }
  }
</style>
