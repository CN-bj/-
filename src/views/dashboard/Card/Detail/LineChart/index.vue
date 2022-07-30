<template>
  <div class="echarts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineChart",
  mounted() {
    //1.创建 echarts 实例
    let lineCharts = echarts.init(this.$refs.charts);
    //2.配置 echarts 折线图
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      series: [
        {
          type: "line",
          //曲线平滑
          smooth:true,
          data: [30, 20, 55, 18,60,7,58],
          //拐点样式设置
          itemStyle: {
            opacity: 0,
          },
          //线条样式
          lineStyle: {
            color: "purple",
          },
          //填充颜色设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      //布局模式
      grid: {
        left: 0,
        top: 10,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
.echarts {
  width: 100%;
  height: 100%;
}
</style>