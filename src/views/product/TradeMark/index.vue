<template>
  <div>
    <!-- 1.按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加
    </el-button>

    <!-- 
      2.表格组件: 
      data(表格将来要展示的数据), 
      border="true"(添加纵向边框), 
      label(显示的标题), 
      width(对应列的宽度), 
      align(标题对齐的方式), 
      type="index"(显示该行的索引:从 1 开始计算)
      prop:对应列内容的字段名,
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>

      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        width="width"
        align="center"
      >
        <template slot-scope="scope">
          <!-- scope.row:{ "id": 1, "tmName": "尚硅谷", "logoUrl": ..." } -->
          <img :src="scope.row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>

      <!-- Element UI 中的 Table-column Scoped Slot: 自定义列的内容，参数为 { row行, column列, $index序列号 } -->
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      3.分页器组件: 
      current-page: 当前在第几页. 
      page-size: 代表一页展示多少条数据.
      page-sizes: 每页显示个数选择器的选项设置.
      pager-count: 下面的页面按钮显示几个.
      layout: 可以实现分页器布局(->:后面的在最右侧), 
      jumper: Go to;   siezs: 3/page
      total: Total 99 
      @current-change: 当前页改变时会触发(page).(两种写法,如下)
      @size-change: 每页条数发生变化时触发(limit).(两种写法,如下)
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :pager-count="7"
      @current-change="handleCurrentChange"
      @size-change="(limit) => handleSizeChange(limit)"
      layout="prev, pager, next,jumper,->,sizes,total"
    >
    </el-pagination>

    <!-- 
      4.对话框:
      visible.sync: 是否显示该对话框.
      label-width: 设置左侧标题的宽度.
      :model属性: 将表单数据搜集到 tmForm 对象上.
      :rules: 表单验证规则
     -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
         并将 Form-Item 的 prop 属性设置为需校验的字段名即可 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传图片这里不能用 v-model 搜集,因为不是表单元素 -->
          <!-- 
            action: 设置图片上传的地址.
            :on-success: 可以检测到图片是否上传成功,上传成功会执行一次.
            :before-upload: 可以在上传图片之前执行一次.
             -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件,且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAllUpdateTradeMark"
          >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      //代表在分页器的第几页
      page: 2,
      //代表当前页面展示数据条数
      limit: 3,
      //总数据条数
      total: 0,
      //列表展示的数据
      list: [],
      //是否显示对话框
      dialogFormVisible: false,
      //搜集品牌信息,这个对象中的属性名称需要看接口文档的名字,不能随便命名!
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //验证规则
      rules: {
        /* 品牌名称的验证规则 required: true(不能为空) ,
           trigger(什么情况下触发验证规则,常用的blur:失去焦点时触发,change:数据改变时触发) */
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 3 到 5 个字符",
            trigger: "change",
          },
        ],
        //品牌LOGO的验证规则
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  mounted() {
    //获取列表数据方法
    this.getTradeMarkList();
  },
  methods: {
    //获取品牌列表的数据
    async getTradeMarkList() {
      const { page, limit } = this;
      //发起请求
      const res = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (res.code === 200) {
        this.total = res.data.total;
        this.list = res.data.records;
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    //分页器的当前页page改变时触发的函数
    handleCurrentChange(page) {
      this.page = page;
      this.getTradeMarkList();
    },
    //每页条数发生变化时触发(limit)
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTradeMarkList();
    },
    //点击添加按钮显示对话框
    showDialog() {
      //显示对话框
      this.dialogFormVisible = true;
      //每次点击该按钮时,都应该清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //点击修改按钮显示对话框
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      //row: 当前用户选中的这个品牌信息
      //这里用到浅拷贝{...row},如果直接 = row ,那么会修改服务器的数据!
      this.tmForm = { ...row };
    },
    //图片上传成功的回调函数
    handleAvatarSuccess(res, file) {
      //res.data 中只有一个数据,就是该图片的地址
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前的回调函数
    beforeAvatarUpload(file) {
      const isJPGPNG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPGPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGPNG && isLt2M;
    },
    //点击添加按钮或者修改按钮对话框中的确定按钮
    addAllUpdateTradeMark() {
      //当全部验证字段通过
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          //隐藏对话框
          this.dialogFormVisible = false;
          const res = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "上传品牌成功",
            });
            //如果是修改品牌应该在当前页,添加品牌就在第一页
            this.getTradeMarkList(this.tmForm.id ? this.page : 1);
          } else {
            this.$message.error(
              this.tmForm.id ? "修改品牌失败" : "上传品牌失败"
            );
          }
          //当全部验证字段没有通过
        } else {
          alert("验证失败");
          return false;
        }
      });
    },
    //点击删除品牌的按钮
    deleteTradeMark(row) {
      this.$confirm(`确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        //点击确定时执行
        .then(async () => {
          const res = await this.$API.trademark.reqDeleteTradeMark(row.id);
          console.log(res);
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //删除数据后如果当前页面数据条数小于1,那么应该去前一页,如果大于1,则就在当前页面.
            this.getTradeMarkList(
              this.list.length >= 1 ? this.page : this.page - 1
            );
          }
        })
        //点击取消时执行
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
/* 对话框的样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>