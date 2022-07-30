<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80px">
      </el-table-column>

      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>

      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>

      <el-table-column prop="prop" label="默认图片" width="110px">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="重量(KG)" width="width">
      </el-table-column>

      <el-table-column prop="price" label="价格(元)" width="80px">
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <!-- 上架 -->
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            v-if="row.isSale === 0"
            @click="onSale(row)"
          ></el-button>
          <!-- 下架 -->
          <el-button
            type="success"
            icon="el-icon-bottom"
            size="mini"
            v-else
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuDetail(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :page-count="7"
      :total="total"
      layout="prev, pager, next,jumper, ->,sizes,total"
      @current-change="changePage"
      @size-change="changeSize"
    >
    </el-pagination>

    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
              style="margin-right: 10px"
              >{{ item.attrId }}--{{ item.valueId }}
            </el-tag>
          </template>
        </el-col>
      </el-row>
     
      <!-- 轮播图 -->
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="500px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      //代表当前第几页
      page: 1,
      //代表当前页面有几条数据
      limit: 10,
      //sku列表的数据
      records: [],
      //总数
      total: 0,
      //sku详情数据
      skuInfo: {},
      //显示与隐藏抽屉
      drawer: false,
    };
  },
  mounted() {
    //调用获取sku列表数据的方法
    this.getList();
  },
  methods: {
    //获取sku列表数据的方法
    async getList() {
      const { page, limit } = this;
      const res = await this.$API.sku.reqList(page, limit);
      if (res.code === 200) {
        this.total = res.data.total;
        this.records = res.data.records;
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    //改变当前页的回调
    changePage(page) {
      this.page = page;
      this.getList();
    },
    //改变每页展示多少条数据的回调
    changeSize(limit) {
      this.limit = limit;
      this.getList();
    },
    //上架的回调
    async onSale(row) {
      const res = await this.$API.sku.reqOnSale(row.id);
      if (res.code === 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      } else {
        this.$message({ type: "error", message: "上架失败" });
      }
    },
    //下架的回调
    async cancelSale(row) {
      const res = await this.$API.sku.reqCancelSale(row.id);
      if (res.code === 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      } else {
        this.$message({ type: "error", message: "下架失败" });
      }
    },
    //修改的回调
    edit() {
      this.$message("正在开发中");
    },
    //sku详情的回调##
    async getSkuDetail(row) {
      //显示抽屉
      this.drawer = true;
      const res = await this.$API.sku.reqSkuDetail(row.id);
      if (res.code === 200) {
        this.skuInfo = res.data;
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
  },
};
</script>

<style scoped>
/* 从浏览器中找到的该类名，抽屉效果的样式 */
.el-col-5 {
  font-size: 20px;
  text-align: right;
}
.el-col {
  margin: 10px;
}

/* 轮播图样式 */
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

</style>