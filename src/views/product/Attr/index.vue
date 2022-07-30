<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 添加属性页面 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!Category3Id"
          @click="addAttr"
          >添加属性
        </el-button>

        <!-- 展示平台属性的表格 -->
        <el-table :data="CateAttrList" style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>

          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>

          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="item in row.attrValueList"
                :key="item.id"
                style="margin: 0px 10px"
                >{{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性值页面 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值
        </el-button>

        <el-button @click="isShowTable = true">取消</el-button>

        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>

          <el-table-column label="属性值名称" prop="prop" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 属性值页面的span和input -->
              <!-- :ref="$index"这样绑定是因为input框不止一个,用$index来区分 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="showSpan(row)"
                @keyup.native.enter="showSpan(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                style="display: block; height: 28px"
                @click="showInput(row, $index)"
              >
                {{ row.valueName }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框,需要注意新版本确认按钮事件为 @confirm -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @confirm="deleteAttrList($index)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                >
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入 lodash 的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      //从 CategorySelect 组件中传递过来的 id 存储在这里
      Category1Id: "",
      Category2Id: "",
      Category3Id: "",
      CateAttrList: [],
      //控制table表格的显示与隐藏
      isShowTable: true,
      //新增属性/修改属性
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          /* //属性值,因为属性值可以有多个,因此用数组
          {
            attrId: 0, //相应的属性名的id
            valueName: "", //相应的属性名的属性值
          }, */
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //3级id
      },
    };
  },
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
        //发起请求获取数据
        this.getAttrList();
      }
    },
    //当接收到三级分类的id后的请求数据的回调函数
    async getAttrList() {
      const { Category1Id } = this;
      const { Category2Id } = this;
      const { Category3Id } = this;
      const res = await this.$API.attr.reqAttrList(
        Category1Id,
        Category2Id,
        Category3Id
      );
      if (res.code === 200) {
        this.CateAttrList = res.data;
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    //添加属性值的回调(添加属性值页面)
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        //当修改属性时，attrInfo有id属性，而attrValueList中的attrId属性刚好就是这个id属性。
        //当添加属性时，attrInfo没有id属性，而attrValueList中的attrId属性就是undefined了。
        attrId: this.attrInfo.id,
        valueName: "",
        //控制input和span的显示与隐藏
        flag: true,
      });
      this.$nextTick(() => {
        //新增属性也自动获取焦点
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性按钮的回调(添加属性页面)
    addAttr() {
      //隐藏
      this.isShowTable = false;
      //清空数据并搜集3级分类id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.Category3Id,
        categoryLevel: 3,
      };
    },
    //修改某一个属性的回调(添加属性页面)
    updateAttr(row) {
      this.isShowTable = false;
      //因为attrInfo数据中还有数组,数组中还有数据,所以这里需要用深拷贝,lodash.
      this.attrInfo = cloneDeep(row);
      //在修改某个属性时，将相应的属性值元素也添加上flag属性以此来控制span和input的显示与隐藏。
      this.attrInfo.attrValueList.forEach((item) => {
        //因为Vue无法探测普通元素新增的属性，这样书写的属性不是响应式的，所以这里用Vue.$set.
        //Vue.$set: 向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。
        this.$set(item, "flag", false); //参数：(对象,新的属性名,属性值);
      });
    },
    //显示span的回调, row 是当前用户添加的新的值.
    showSpan(row) {
      if (row.valueName.trim() === "") {
        this.$message("输入值不能为空!");
        return;
      }
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        /* row是数组新添加的项, row !== item :意思就是 除了 row 之外的其它项,如果值和row相等,
        那么就返回出去,返回值是布尔值,为true,如果是true就说明新添加的row是重复的,就退出不让它添加. */
        if (row !== item) {
          return row.valueName === item.valueName;
        }
      });
      if (isRepat) {
        this.$message("输入值不能重复!");
        return;
      }
      row.flag = false;
    },
    //显示input的回调
    showInput(row, index) {
      row.flag = true;
      /* 切换input时,自动获取焦点,需要注意:对于浏览器而言,页面重绘需要时间.切换input时
         页面不可能立马获取到input,所以用到 $nextTick. */
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //添加属性值页面的删除按钮的回调
    deleteAttrList(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮,进行添加属性或者修改属性的操作
    async addOrUpdateAttr() {
      //整理参数: 1.当值是空时不应该提交服务器; 2.不应该把 flag 属性也提交服务器.
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName !== "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //保存成功之后要显示添加属性页面
        this.isShowTable = true;
        this.$message({ type: "success", message: "保存成功" });
        this.getAttrList();
      } catch (error) {
        alert(error);
        this.$message("保存失败");
      }
    },
  },
};
</script>

<style>
</style>