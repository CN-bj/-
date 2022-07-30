<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene === 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 初始页面 -->
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSpu"
          :disabled="!Category3Id"
          >添加SPU</el-button
        >

        <el-table style="width: 100%" border :data="records">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <!-- 四个按钮 -->
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="showDiaLog(row)"
              ></el-button>

              <el-popconfirm
                title="这是一段内容确定删除吗?"
                @confirm="deleteSpu(row)"
                style="margin-left: 10px"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                >
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          layout="prev, pager, next,jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene === 1"
        @changeScene="changeScene"
        ref="SpuForm"
      ></SpuForm>
      <SkuForm
        v-show="scene === 2"
        ref="SkuForm"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>

    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table
        :data="skuList"
        style="width: 100%"
        border
        v-loading="loading"
      >
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="width"
        ></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuForm/index.vue";
import SpuForm from "./SpuForm/index.vue";
export default {
  name: "Spu",
  data() {
    return {
      //从 CategorySelect 组件中传递过来的 id 存储在这里
      Category1Id: "",
      Category2Id: "",
      Category3Id: "",
      //控制CategorySelect组件中三级联动的使用与禁止.
      show: true,
      //分页器当前第几页
      page: 1,
      //每页展示多少条数据
      limit: 3,
      //spu列表的数据
      records: [],
      //分页器一共需要展示多少条数据
      total: 0,
      //切换页面显示与隐藏(0:Spu初始模块,   1:添加或者修改spu模块,    2:添加Sku模块)
      scene: 0,
      //控制展示隐藏 Dialog 的属性
      dialogTableVisible: false,
      //点击查看当前spu的全部sku列表的按钮时传递的该spu信息
      spu: {},
      //请求回来的sku列表数据
      skuList: [],
      //加载效果
      loading: true,
    };
  },
  components: { SkuForm, SpuForm },
  methods: {
    //从 cpmponents下的/CategorySelect 组件中传递过来的参数
    getCategoryId({ CategoryId, level }) {
      if (level === 1) {
        this.Category1Id = CategoryId;
        this.Category2Id = "";
        this.Category3Id = "";
      } else if (level === 2) {
        this.Category2Id = CategoryId;
        this.Category3Id = "";
      } else {
        this.Category3Id = CategoryId;
        this.getSpuList();
      }
    },
    //获取spu列表的函数
    async getSpuList() {
      const res = await this.$API.spu.reqSpuList(
        this.page,
        this.limit,
        this.Category3Id
      );
      try {
        this.records = res.data.records;
        this.total = res.data.total;
      } catch (error) {
        alert(error);
      }
    },
    //分页器的当前页page改变时触发的函数
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    //每页条数发生变化时触发(limit)
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //添加Spu的回调
    addSpu() {
      this.scene = 1;
      //通知子组件发送请求
      this.$refs.SpuForm.addSpuData(this.Category3Id);
    },
    //修改Spu的回调 getSpuData(该函数在子组件 SpuForm 中)
    updateSpu(row) {
      this.scene = 1;
      this.$refs.SpuForm.getSpuData(row);
    },
    //自定义事件的回调,用来接收子组件SpuForm传递过来的场景值0,然后显示该初始模块,flag为了区分是添加还是修改的保存.
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag === "添加") {
        this.getSpuList();
      } else {
        this.getSpuList(this.page);
      }
    },
    //自定义事件的回调,用来接收子组件SkuForm传递过来的场景值0.
    changeScenes(scene) {
      this.scene = scene;
    },
    //删除spu的回调
    async deleteSpu(row) {
      const res = await this.$API.spu.reqDeleteSpu(row.id);
      console.log(res);
      if (res.code === 200) {
        this.$message({ type: "success", message: "删除成功" });
        //如果当前页只有一个数据,那么删除成功应该返回上一页,如果不止一个数据,就还在当前页面.
        this.getSpuList(this.records > 1 ? this.page : this.page - 1);
      } else {
        this.$message({ type: "error", message: "删除失败" });
      }
    },
    //添加sku按钮的回调,把参数传给子组件 skuForm 中的 getSku 方法. row 中包含有(id和Category3Id)
    addSku(row) {
      this.scene = 2;
      this.$refs.SkuForm.getSku(this.Category1Id, this.Category2Id, row);
    },
    //点击查看当前spu的全部sku列表的回调
    async showDiaLog(row) {
      //显示Dialog对话框
      this.dialogTableVisible = true;
      //把当前点击的spu信息保存到spu中
      this.spu = row;
      //发送请求获取到sku列表数据用于展示.
      const res = await this.$API.sku.reqSkuList(row.id);
      if (res.code === 200) {
        this.skuList = res.data;
        //隐藏loading
        this.loading = false;
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    //关闭 Dialog 前的回调,本身带有一个参数done,done 用于关闭 Dialog.
    close(done) {
      this.loading = true;
      this.skuList = [];
      done();
    },
  },
};
</script>

<style>
</style>