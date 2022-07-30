<template>
  <el-card style="margin: 10px 0">
    <!-- 销售额模块头部 -->
    <div class="header">
      <!-- 左侧两个tab , v-model绑定值，选中选项卡的 name-->
      <el-tabs v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>

      <!-- 右侧年月日 -->
      <div class="spans">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- 日期选择组件 value-format:指定获得的日期格式,不需要绑定什么 -->
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy年-M月-d日"
        >
        </el-date-picker>
      </div>
    </div>
    <!-- 销售额模块主体 -->
    <div class="body">
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <h3>门店{{ title }}排名</h3>
          <ul class="lis">
            <li>
              <span>1</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span>2</span>
              <span>麦当劳</span>
              <span>235687</span>
            </li>
            <li>
              <span>3</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span>4</span>
              <span>海底捞</span>
              <span>123456</span>
            </li>
            <li>
              <span>5</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span>6</span>
              <span>汉堡王</span>
              <span>123456</span>
            </li>
            <li>
              <span>7</span>
              <span>真功夫</span>
              <span>123456</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      //默认选中销售额
      activeName: "sale",
      //柱形图
      barCharts: null,
      //日期选择器
      date: [],
    };
  },
  //
  computed: {
    title() {
      //切换时标题也变化
      return this.activeName === "sale" ? "销售额" : "访问量";
    },
    //拿到数据
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch: {
    title() {
      //因为mounted只会执行一次,所以需要监听属性,标题变化就重新赋值.
      this.barCharts.setOption({
        title: {
          text: this.title,
        },
        xAxis: {
          data:
            this.title === "销售额"
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
        series: {
          data:
            this.title === "销售额"
              ? this.listState.orderFullYear
              : this.listState.userFullYear,
        },
      });
    },
    //这里监听的原因是刚上来mounted中加载echarts时没有数据.
    listState(){
      this.barCharts = echarts.init(this.$refs.charts);
    this.barCharts.setOption({
      title: {
        text: "销售额",
      },
      xAxis: {
        type: "category",
        data: this.listState.orderFullYearAxis,
      },
      yAxis: {
        axisLine: {
          show: true,
        },
        axisTick: {
          show: true,
        },
      },
      series: {
        type: "bar",
        data: this.listState.orderFullYear,
      },
      tooltip: {},
      grid: {
        left: 30,
        right: 40,
        bottom: 20,
      },
    });
    }
  },
  mounted() {
    this.barCharts = echarts.init(this.$refs.charts);
    this.barCharts.setOption({
      title: {
        text: "销售额",
      },
      xAxis: {
        type: "category",
        data: [],
      },
      yAxis: {
        axisLine: {
          show: true,
        },
        axisTick: {
          show: true,
        },
      },
      series: {
        type: "bar",
        data: [],
      },
      tooltip: {},
      grid: {
        left: 30,
        right: 40,
        bottom: 20,
      },
    });
  },
  methods: {
    //设置本日
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
      //this.$set(this.date, 0, day);
      //this.$set(this.date, 1, day);
    },
    //设置本周
    setWeek() {
      //本周星期一是哪一天
      const start = dayjs().day(1).format("YYYY-MM-DD");
      //本周星期六是哪一天
      const end = dayjs().day(6).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //设置本月
    setMonth() {
      //本月第一天
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      //本月最后一天
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      //本年第一天
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      //本年最后一天
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
.el-tabs__item {
  font-size: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
}
.spans span {
  display: inline-block;
  height: 60px;
  line-height: 60px;
  padding: 0 15px;
}
.spans span:hover {
  cursor: pointer;
}
.charts {
  width: 100%;
  height: 300px;
}
.lis {
  width: 100%;
  height: 300px;
}
.lis li {
  display: flex;
  justify-content: space-between;
  height: 45px;
  line-height: 30px;
  list-style: none;
}
.lis li span:nth-child(1) {
  width: 30px;
  height: 30px;
  color: #fff;
  text-align: center;
  line-height: 30px;
  background-color: #333;
  border-radius: 15px;
}
.lis li span:nth-child(2) {
  display: inline-block;
  padding-right: 120px;
}
</style>