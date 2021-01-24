<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器只允许使用v-model绑定数组 -->
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="goodsCategoryList"
                :props="goodsCategoryProps"
                @change="cascaderHandleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                  :label="item1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headersObj"
              :on-success="picUploadSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="addGoodsForm.goods_introduce"
            >
            </quill-editor>
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog
        title="图片预览"
        :visible.sync="isShowPreviewDialogVisible"
        width="50%"
      >
        <img :src="previewPicPath" alt="" class="previewImg" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  created() {
    this.getGoodsCategoryList()
  },
  data() {
    return {
      activeIndex: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce:'',
        attrs:[]
      },
      addGoodsFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur',
            min: 1,
            max: 15
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur',
            min: 1,
            max: 15
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur',
            min: 1,
            max: 15
          }
        ],
        goods_number: [
          {
            required: true,
            essage: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }
        ]
      },
      goodsCategoryList: [],
      goodsCategoryProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      //   图片上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //   上传图片的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPicPath: '',
      isShowPreviewDialogVisible: false
    }
  },
  methods: {
    async getGoodsCategoryList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.goodsCategoryList = res.data
    },
    cascaderHandleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.thirdCateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.trim()
            ? item.attr_vals.split(',')
            : []
          if (item.attr_vals.length !== 0) {
            item.attr_vals = item.attr_vals.filter((item) => item !== '')
          }
        })
        this.manyTableData = res.data
      }
      if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.thirdCateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性列表失败')
        }
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.trim()
            ? item.attr_vals
            : ''
        })
        this.onlyTableData = res.data
      }
    },
    // 处理预览效果
    handlePreview(e) {
      this.previewPicPath = e.response.data.url
      this.isShowPreviewDialogVisible = true
    },
    // 处理移除图片效果
    handleRemove(e) {
      const filePath = e.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex(
        (item) => item.pic === filePath
      )
      this.addGoodsForm.pics.splice(index, 1)
    },
    picUploadSuccess(e) {
      const picInfo = { pic: e.data.tmp_path }
      this.addGoodsForm.pics.push(picInfo)
      console.log(this.addGoodsForm.pics)
    },
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        // 后台要求提供字符串类型数据，前台要求提供数据类型数据，所以我们需要通过lodash深克隆解决这个问题
        // 所以要在join之前进行深克隆,对克隆的这个数据进行更改即可
        const _addGoodsForm = _.cloneDeep(this.addGoodsForm)
        _addGoodsForm.goods_cat = _addGoodsForm.goods_cat.join(',')
        // 处理动态参数与静态属性
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(',')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        _addGoodsForm.attrs = this.addGoodsForm.attrs
        const { data: res } = await this.$http.post('goods', _addGoodsForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.succuss('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    thirdCateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scope>
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>
