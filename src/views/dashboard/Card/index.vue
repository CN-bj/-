<template>
  <!-- 顶部组件 -->
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <!-- 第一个card -->
        <el-card>
          <Detail title="总销售额" count="￥126560">
            <template slot="charts">
              <span style="padding-right: 20px"
                >周同比&nbsp;56.67%
                <i class="el-icon-caret-top" style="color: red"></i>
              </span>
              <span
                >日同比 19.16%<i
                  class="el-icon-caret-bottom"
                  style="color: green"
                ></i
              ></span>
            </template>
            <template slot="footer">
              <span>日销售额￥123456</span>
            </template>
          </Detail>
        </el-card>
      </el-col>

      <!-- 第二个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineChart></LineChart>
            </template>
            <template slot="footer">
              <span>日访问量1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>

      <!-- 第三个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <BarChart></BarChart>
            </template>
            <template slot="footer">
              <span>转化率65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>

      <!-- 第四个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
             <ProgressChart></ProgressChart>
            </template>
            <template slot="footer">
              <span style="padding-right: 20px"
                >周同比&nbsp;56.67%
                <i class="el-icon-caret-top" style="color: red"></i>
              </span>
              <span
                >日同比 19.16%<i
                  class="el-icon-caret-bottom"
                  style="color: green"
                ></i
              ></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail/index.vue";
import LineChart from "./Detail/LineChart";
import BarChart from "./Detail/BarChart";
import ProgressChart from './Detail/ProgressChart';
export default {
  name: "card",
  components: { Detail, LineChart, BarChart,ProgressChart },
};
</script>

<style>
</style>