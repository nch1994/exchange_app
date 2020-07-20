<template>
  <div class="empty">
    <img src="@/static/img/nodata.png" alt="">
    <p>{{ $t('global.nodata') }}</p>
  </div>
</template>
 
<script>
export default {
  name: 'Empty',
  data () {
    return {}
  }
}
</script>
<style scoped lang="less">
.empty{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 50px;
  img {
    width: 100px;
    height: auto;
  }
  p{
    color: #B2B8C4;
    font-size: 12px;
  }
}
</style>