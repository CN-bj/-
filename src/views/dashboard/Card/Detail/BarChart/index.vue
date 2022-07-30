<template>
  <div class="echart" ref="chart">柱状图</div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "BarChart",
  mounted() {
    let barChart = echarts.init(this.$refs.chart);
    barChart.setOption({
      xAxis: {
        show: false,
        type:'category',
      },
      yAxis: {
        show: false,
      },
      series: {
        type: "bar",
        data: [15, 20, 25, 15, 30, 20, 18, 30, 35, 25, 22, 30],
      },
      //提示组件
      tooltip:{},
    });
  },
};
</script>

<style>
.echart {
  width: 100%;
  height: 100%;
}
</style>