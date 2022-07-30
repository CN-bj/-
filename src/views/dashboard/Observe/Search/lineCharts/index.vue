<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="main">
      <span>12321</span>
      <span>17.1</span>
      <i class="el-icon-caret-top" style="color: red"></i>
      <i class="el-icon-caret-bottom" style="color: green"></i>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "lineCharts",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: {
        type: "line",
        //曲线平滑
        smooth: true,
        data: [10, 30, 50, 20, 40, 60, 20, 50, 30, 15],
        //拐点样式设置
        itemStyle: {
          opacity: 0,
        },
        //线条样式
        lineStyle: {
          color: 'orange',
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
                color: 'orange', // 0% 处的颜色
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
      grid:{
        top:20,
        left:0
      }
    });
  },
};
</script>

<style>
.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: gray;
}
.header span {
  padding-right: 10px;
}
.main {
  margin-top: 20px;
}
.main span:nth-child(1) {
  font-size: 25px;
  padding-right: 40px;
}
.charts {
  width: 100%;
  height: 150px;
}
</style>