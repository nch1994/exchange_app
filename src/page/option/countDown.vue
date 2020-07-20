<template>
  <div>{{ minute }}:{{ second }}</div>
</template>

<script>
export default {
  props: ['target'],
  data() {
    return {
      minute: '00',
      second: '00'
    }
  },
  mounted() {
    let target = this.target;
    setInterval(() => {
      target = target - 1;
      this.minute = this.fixedZero(`${parseInt(target / 60) <= 0 ? 0 : parseInt(target / 60)}`),
      this.second = this.fixedZero(`${target % 60 <= 0 ? 0 : target % 60}`)
    }, 1000)
  },
  methods: {
    fixedZero(val) {
      return val * 1 < 10 ? `0${val}` : val;
    }
  }
}
  
</script> 
