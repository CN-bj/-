<template>
  <div class="echarts" ref="charts">sdadas</div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgressChart",
  mounted() {
    let progressCharts = echarts.init(this.$refs.charts);
    progressCharts.setOption({
      xAxis: {
        show: false,
        //最小值和最大值,不加进度条不会跟着数据变化
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        //均分,让柱状图变成y轴的
        type: "category",
      },
      series: {
        type: "bar",
        data: [78],
        //柱状图的宽度
        barWidth: 15,
        color: "yellowgreen",
        //背景颜色设置
        showBackground: true,
        backgroundStyle: {
          color: "#eee",
        },
        //文本
        label: {
          show: true,
          //改变文本内容
          formatter: "|",
          position: "right",
        },
      },
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>