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
          show-icon>
        </el-alert>
        <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex">
          <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addGoodsForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number" type="number">
                  <el-input v-model="addGoodsForm.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                  <el-input v-model="addGoodsForm.goods_cat"></el-input>
              </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
        </el-form>
    </el-card>
    </div>
</template>

<script>
export default {
  created() {},
  data() {
    return {
      activeIndex:'0',
      addGoodsForm:{
        goods_name:'',
        goods_price:0,
        goods_number:0,
        goods_weight:0,
        goods_cat:[]

      },
      addGoodsFormRules:{
        goods_name:[
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur',
            min: 1,
            max: 15
          }

        ],
        goods_price:[
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur',
            min: 1,
            max: 15
          }
        ],
        goods_weight:[
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur',
            min: 1,
            max: 15
          }
        ],
        goods_number:[
          {
            required: true,
            essage: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat:[
          {
            required: true,
            message: '请输入商品分类',
            trigger: 'blur'
          }
        ]
      }

    }
  },
  methods: {}
}
</script>

<style lang="less" scope>
.el-step__title{
    font-size: 13px;
}
</style>
