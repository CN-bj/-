<template>
  <!-- 三级联动组件 -->
  <!-- 
    行内表单:
    inline: 行内表单,代表一行可以放多个表单元素.
  -->
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="CateForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="CateForm.category1id"
          @change="getCategory1List"
          :disabled="!show"
        >
          <el-option
            :label="item1.name"
            :value="item1.id"
            v-for="item1 in list1"
            :key="item1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="CateForm.category2id"
          @change="getCategory2List"
          :disabled="!show"
        >
          <el-option
            :label="item2.name"
            :value="item2.id"
            v-for="item2 in list2"
            :key="item2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="CateForm.category3id"
          @change="getCategory3List"
          :disabled="!show"
        >
          <el-option
            :label="item3.name"
            :value="item3.id"
            v-for="item3 in list3"
            :key="item3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:['show'],
  data() {
    return {
      //一级分类的数据
      list1: [],
      //二级分类的数据
      list2: [],
      //二级分类的数据
      list3: [],
      //搜集id
      CateForm: {
        category1id: "",
        category2id: "",
        category3id: "",
      },
    };
  },
  mounted() {
    //调用获取一级分类的回调函数
    this.getCategoryList();
  },
  methods: {
    //一级分类的回调函数
    async getCategoryList() {
      const res = await this.$API.attr.reqCategory1List();
      if (res.code === 200) {
        this.list1 = res.data;
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    //二级分类的回调函数
    async getCategory1List() {
      this.list2 = [];
      this.list3 = [];
      this.CateForm.category2id = "";
      this.CateForm.category3id = "";
      //父组件 Attr 中的自定义回调，把id参数传递过去
      const { category1id } = this.CateForm;
      this.$emit("getCategoryId", { CategoryId: category1id, level: 1 });
      const res = await this.$API.attr.reqCategory2List(
        this.CateForm.category1id
      );
      if (res.code === 200) {
        this.list2 = res.data;
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    //三级分类的回调函数
    async getCategory2List() {
      this.list3 = [];
      this.CateForm.category3id = "";
      const { category2id } = this.CateForm;
      this.$emit("getCategoryId", { CategoryId: category2id, level: 2 });
      const res = await this.$API.attr.reqCategory3List(
        this.CateForm.category2id
      );
      if (res.code === 200) {
        this.list3 = res.data;
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    getCategory3List() {
      const { category3id } = this.CateForm;
      this.$emit("getCategoryId", { CategoryId: category3id, level: 3 });
    },
  },
};
</script>

<style>
</style>