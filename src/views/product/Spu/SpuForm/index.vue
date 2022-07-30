<template>
  <!-- 添加或者修改spu模块 model属性主要是用来做表单验证的-->
  <el-form ref="form" label-width="80px" :model="spu">
    <!-- 1 -->
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
    </el-form-item>

    <!-- 2. v-model绑定的值与 option 选项的 value 值对应.
         把tradeMarkList数组的id属性绑定给spu对象的tmId属性,用来后续发送服务器请求-->
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spu.tmId">
        <el-option
          v-for="item in tradeMarkList"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 3 -->
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        rows="4"
        placeholder="描述"
        v-model="spu.description"
      ></el-input>
    </el-form-item>

    <!-- 4.图片上传:
      (1)action: 必选参数，上传的地址.
      (2)list-type: 文件列表的类型.
      (3)file-list: 上传的图片列表.
      (4)on-preview: 点击文件列表中已上传的文件时的钩子(图片预览时触发).
      (5)on-remove: 文件列表移除文件时的钩子(图片删除时触发).
      (6)on-success: 图片上传成功时触发
    -->
    <!--  -->
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :file-list="spuImageList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>

    <!-- 5 -->
    <el-form-item label="销售属性">
      <el-select
        :placeholder="`还有${unSelectSaleAttr.length}未选择`"
        v-model="attrIdAndAttrName"
      >
        <el-option
          :label="item.name"
          :value="`${item.id}:${item.name}`"
          v-for="item in unSelectSaleAttr"
          :key="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attrIdAndAttrName"
        @click="addSaleAttr"
        >添加销售属性
      </el-button>
      <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>

        <el-table-column prop="saleAttrName" label="属性名" width="width">
        </el-table-column>

        <el-table-column prop="prop" label="属性值名称列表" width="width">
          <!-- 标签:
               @close: 关闭标签时的事件
          -->
          <template slot-scope="{ row }">
            <el-tag
              :key="tag.id"
              v-for="(tag, index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <!--  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm" -->
            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="addSaleAttrValue(row)"
              >添加
            </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="prop" label="操作" width="width">
          <!-- 删除按钮 -->
          <template slot-scope="{ $index }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="spu.spuSaleAttrList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <!-- 6 -->
    <el-form-item>
      <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
      <!-- 调用父组件 Spu 的自定义函数changeScene,用来传递场景值scene,然后显示初始模块 -->
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  props: ["records"],
  data() {
    return {
      //图片
      dialogImageUrl: "",
      dialogVisible: false,
      //Spu信息
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集spu图片的信息
        spuImageList: [],
        //平台属性与属性值收集
        spuSaleAttrList: [],
      },
      //品牌的信息
      tradeMarkList: [],
      //Spu图片的信息
      spuImageList: [],
      //销售属性
      saleAttrList: [],
      //未选择的销售属性的id和名字
      attrIdAndAttrName: "",
    };
  },
  /* 这里面发请求不能写在 mounted 中,因为子组件已经挂载在父组件身上,当父组件页面加载完毕时子组件的
     mounted就会调用,所以当再次点击添加或者修改按钮时,mounted中的发送请求的函数就不会再执行了,就无法获取数据
     所以采用的是在父组件中通过ref获取到子组件,然后点击按钮时调用子组件的方法getSpuData 再发送请求*/
  methods: {
    //获取spu品牌的请求函数,spu参数从父组件 Spu 中获取到的.
    async getSpuData(spu) {
      //1.获取 Spu 信息
      let spuRes = await this.$API.spu.reqSpu(spu.category3Id);
      if (spuRes.code === 200) {
        this.spu = spuRes.data;
      }

      //2.获取品牌的信息
      let tradeMarkListRes = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkListRes.code === 200) {
        this.tradeMarkList = tradeMarkListRes.data;
      }

      //3.获取 Spu 图片的接口
      let spuImageListRes = await this.$API.spu.reqSpuImageList(
        spu.category3Id
      );
      //由于file-list: 上传的图片列表需要name和url属性才能展示出图片,所以这里遍历添加这两个属性.
      //提交服务器时不需要这两个属性
      if (spuImageListRes.code === 200) {
        let arrList = spuImageListRes.data;
        arrList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = arrList;
      }

      //4.获取 Spu 销售属性的接口
      let baseSaleAttrListRes = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrListRes.code === 200) {
        this.saleAttrList = baseSaleAttrListRes.data;
      }
    },
    //照片墙删除时触发
    handleRemove(file, fileList) {
      //file参数: 代表的是删除的那个图片.
      //fileList: 照片墙删除某一张图片之后,剩余的其他图片
      this.spuImageList = fileList;
    },
    //照片墙预览时触发
    handlePictureCardPreview(file) {
      //将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //照片墙图片上传成功时触发
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    //添加销售属性的回调 (vue开发者工具中查看这些名字)
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      let newSpuSaleAttrList = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSpuSaleAttrList);
      this.attrIdAndAttrName = "";
    },
    //点击button按钮时隐藏button,显示input
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    //input失去焦点时隐藏input,显示button
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() === "") {
        this.$message({ type: "error", message: "属性值不能为空" });
        return;
      }
      //res: 属性值重复返回值为 false,没重复为 true
      let res = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName !== inputValue;
      });
      if (!res) {
        this.$message({ type: "error", message: "属性值不能重复" });
        return;
      }
      let newSpuSaleAttrValueList = {
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      };
      row.spuSaleAttrValueList.push(newSpuSaleAttrValueList);
      //隐藏input
      row.inputVisible = false;
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      //整理参数然后发送服务器请求,对于照片墙新添加的图片没有 imgName,imgUrl这两个参数,所以需要处理.
      this.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.imgUrl,
        };
      });
      const res = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (res.code === 200) {
        this.$message({ type: "success", message: "保存成功" });
        //返回场景0并且需要告诉父组件点击的是添加的保存还是修改的保存,以便于用来保存之后是否在当前页还是在首页.
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      } else {
        this.$message({ type: "error", message: "保存失败" });
      };
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    //父组件spu点击添加spu按钮时发送请求的函数
    async addSpuData(Category3Id) {
      //搜集到父组件传递过来的 Category3Id
      this.spu.category3Id = Category3Id;
      //获取品牌的信息
      let tradeMarkListRes = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkListRes.code === 200) {
        this.tradeMarkList = tradeMarkListRes.data;
      }
      ///获取 Spu 销售属性的接口
      let baseSaleAttrListRes = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrListRes.code === 200) {
        this.saleAttrList = baseSaleAttrListRes.data;
      }
    },
    //取消按钮
    cancel() {
      //切换场景并且传递参数flag,以便于区分是添加还是修改的保存,然后保存之后是返回到第一页还是当前页.
      this.$emit("changeScene", { scene: 0, flag: "" });
      //Object.assign 合并对象的方法,重复的就是后者覆盖前者
      //this._data是当前data中响应式数据
      //this.$options可以获取配置对象,配置对象的data函数执行,结果为空,所以在点击取消之后数据可以清空.
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    //计算出未选择的销售属性,外层item循环一次,内层item1全部循环,
    //假如item1有两个选项为颜色,尺码, 那当item为颜色就不要.item为尺码也不要,item为版本才要,所以只有一个结果选项.
    unSelectSaleAttr() {
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style scoped>
/* 表格中标签样式 */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>