<template>
  <div class="loading">
    <van-loading class="loading-icon" color="#007AFF" type="spinner" size="30px" />
  </div>
</template>
 
<script>
export default {
  name: 'Loading',
  data () {
    return {}
  }
}
</script>
<style scoped lang="less">
.loading{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.3);
  .loading-icon{
    z-index: 10;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>