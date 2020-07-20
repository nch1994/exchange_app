<template>
  <div id="klineCharts" style="width:100%;height:240px" />
</template>
<script>
import Highcharts from 'highcharts/highstock';
import axios from 'axios';
import { filterPoint } from '@/utils/utils';
let timer = null;
let newData = [];
let closeValue = 0;
export default {
  props: ['okex'],
  data() {
    return {
    }
  },
  watch: {
    okex: function(newVal) {
      if (newVal) {
        if (timer) clearTimeout(timer);
        newData = [];
        this.getChart()
      }
    }
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    if (timer) clearTimeout(timer);
  },
  methods: {
    getData() {
      if (timer) clearInterval(timer);
      axios({
        url: 'https://tinance.pro/appApi.json?action=kline&symbol=1&step=60',
        method: 'get',
      }).then((data) => {
        // 开高低收
        newData = data.data.data.slice(-50);
        closeValue = filterPoint(newData[49][4], 1);
        this.getChart();
        timer = setInterval(() => {
          this.getData();
        }, 5000)
      })
    },
    getChart() {
      Highcharts.setOptions({
        global: {
          useUTC: false
        }
      });
      if (!this.okex) return;
      Highcharts.stockChart('klineCharts', {
        rangeSelector : { enabled: false },
        title : { text : null },
        chart: {
          spacingRight: 50,
        },
        scrollbar: { enabled: false },
        navigator: { enabled: false },
        credits: { enabled: false },
        tooltip: {
          dateTimeLabelFormats: {
            minute: '%H:%M',
            hour: '%H:%M',
          }
        },
        series : [{
          type : 'candlestick',
          name : 'price',
          data : newData,
          color: 'red',
          lineColor: 'red',
          upColor: 'green',
          upLineColor: 'green',
          navigatorOptions: {
            color: Highcharts.getOptions().colors[0]
          },
          dataGrouping : {
            enabled: false
          }
        }],
        yAxis: {
          opposite: false,
          tickAmount: 4,
          showLastLabel: 2,
          endOnTick: true,
          allowDecimals: false,
          plotLines: [{
            value: closeValue,
            width: 1,
            color: 'gray',
            dashStyle: 'dash',
            label: {
              text: '<p>'+closeValue+'</p>',
              align: 'right',
              textAlign: 'center',
              y: 4,
              x: 24
            }
          }],
        },
      });
    }
  }
}
</script>