<template>
  <!-- 添加Sku模块 -->
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item
            :label="item.attrName"
            v-for="item in skuAttrInfoList"
            :key="item.id"
          >
            <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
              <el-option
                :label="item1.valueName"
                :value="`${item.id}:${item1.id}`"
                v-for="item1 in item.attrValueList"
                :key="item1.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="item.saleAttrName"
            v-for="item in skuSaleAttrList"
            :key="item.id"
          >
            <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
              <el-option
                :label="item1.saleAttrName"
                :value="`${item.id}:${item1.id}`"
                v-for="item1 in item.spuSaleAttrValueList"
                :key="item1.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="skuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="prop" width="width" type="selection">
          </el-table-column>

          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>

          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                v-if="row.isDefault === 0"
                @click="changeDefault(row)"
                >设为默认
              </el-button>
              <el-button
                style="color: green"
                size="mini"
                v-else
                @click="row.isDefault = 0"
                >默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //图片数据
      skuImageList: [],
      //销售属性
      skuSaleAttrList: [],
      //平台属性
      skuAttrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        category3Id: 0,
        price: 0,
        spuId: 0,
        //品牌id
        tmId: 0,
        skuName: "",
        //重量
        weight: "",
        //默认图片
        skuDefaultImg: "",
        //描述
        skuDesc: "",
        //收集平台属性
        skuAttrValueList: [
          {
            /*  平台属性的id
            attrId: 0,
            平台属性值的id
            valueId: 0,  */
          },
        ],
        //收集图片数据
        skuImageList: [
          {
            /* id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0, */
          },
        ],
        //收集销售属性
        skuSaleAttrValueList: [
          {
            /* id: 0,
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0, */
          },
        ],
      },
      spu: {},
      //搜集图片的数据字段:但是需要注意,搜集的数据目前缺少isDefault字段
      imageList: [],
    };
  },
  methods: {
    //获取SkuForm数据的回调
    async getSku(Category1Id, Category2Id, row) {
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;
      //1.获取图片的请求
      const res = await this.$API.sku.reqImageList(row.id);
      if (res.code === 200) {
        let List = res.data;
        //给图片的每一项加上isDefault属性,为了后面的切换是否默认
        List.forEach((item) => {
          item.isDefault = 0;
        });
        this.skuImageList = List;
      } else {
        return Promise.reject(new Error("fail"));
      }

      //2.获取销售属性的请求
      const res1 = await this.$API.sku.reqSaleAttrList(row.id);
      if (res1.code === 200) {
        this.skuSaleAttrList = res1.data;
      } else {
        return Promise.reject(new Error("fail"));
      }

      //3.获取平台属性的请求
      const res2 = await this.$API.sku.reqAttrInfoList(
        Category1Id,
        Category2Id,
        row.category3Id
      );
      if (res2.code === 200) {
        this.skuAttrInfoList = res2.data;
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    //table表格复选框选中取消的事件,selection参数值为当前选中的img的参数,但是缺少发送请求所需要的isDefault参数.
    handleSelectionChange(selection) {
      this.imageList = selection;
    },
    //点击设为默认的按钮的操作
    changeDefault(row) {
      //排他思想,点击前先把每一项设置为状态0
      this.skuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //把选为默认图片的url地址赋值给搜集数据中的skuDefaultImg
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击取消切换场景为0并清空数据.
    cancel() {
      this.$emit("changeScenes", 0);
      Object.assign(this._data, this.$options.data());
    },
    //保存按钮的事件
    async save() {
      const { skuInfo, skuAttrInfoList, skuSaleAttrList,imageList} = this;
      //整理平台属性参数然后添加到skuInfo中
      skuInfo.skuAttrValueList = skuAttrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      
      //整理销售属性参数然后添加到skuInfo中
      skuInfo.skuSaleAttrValueList = skuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);

      //整理图片属性的参数
      skuInfo.skuImageList = imageList.map(item => {
        return {
          spuImgId:item.id,
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
        }
      });
      
      //发送请求
      const res = await this.$API.sku.reqAddSku(skuInfo);
      if (res.code ===200) {
        this.$message({type:"success",message:'保存成功'});
        this.$emit("changeScenes", 0);
      } else {
        this.$message({type:"error",message:'保存失败'});
      }
    },
  },
};
</script>

<style>
</style>