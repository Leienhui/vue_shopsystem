<template>
    <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <el-row>
        <el-button type="primary" @click="showAddGoodsCategory">添加分类</el-button>
        </el-row>
        <!-- 表格区域 -->
        <tree-table class="tree-table" :data="goodsCategoryList" :columns="treeTableColumns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
          <!-- 这个作用域插槽是isValid模板使用 -->
          <template slot="isValid" slot-scope="scope">
            <i class="el-icon-success"   v-if="scope.row.cat_deleted===false" style="color:lightGreen"></i>
            <i class="el-icon-error"   v-else style="color:red"></i>
          </template>
          <template slot="order" slot-scope="scope">
            <el-tag type="primary" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
          <template slot="operate" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditGoodsCategoryDialog(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delGoodsCategory(scope.row)">删除</el-button>
          </template>
        </tree-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      width="70%"
      @close="clearAddCategoryFormClose"
      >
      <el-form :model="addGoodsCategoryForm"
      :rules="addGoodsCategoryFormRules"
      ref="addGoodsCategoryFormRef"
      label-width="100px" >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addGoodsCategoryForm.cat_name" ></el-input>
          </el-form-item>
          <el-form-item label="父级分类"
          >
          <!-- 级联选择器 -->
          <!-- 1.options绑定数据源
          2.props配置选项
          3.v-model:将双向绑定的值保存起来
          4. -->
            <el-cascader
               v-model="selectedKeys"
               :options="goodsParentCategoryList"
               :props="cascader"
               clearable
               @change="parentGoodsCategoryHandleChange">
            </el-cascader>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsCategory" > 确 定</el-button>
    </span>
  </el-dialog>
  <!-- 修改对话框 -->
    <el-dialog
        title="修改分类"
        :visible.sync="editCategoryDialogVisible"
        width="70%"
        @close="editCategoryFormClose"
        >
        <el-form :model="editGoodsCategoryForm"
        :rules="editGoodsCategoryFormRules"
        ref="editGoodsCategoryFormRef"
        label-width="100px" >
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="editGoodsCategoryForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGoodsCategory" > 确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
  created() {
    this.getGoodCategoryList()
  },
  data() {
    return {
      // 商品分类的列表
      goodsCategoryList: [],
      treeTableColumns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列自定义为模板列
          type: 'template',
          // 指定模板名称
          template: 'isValid',
          prop: 'cat_deleted'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
          prop: 'cat_level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate',
          prop: 'cat_level'
        }
      ],
      // 添加分类
      addCategoryDialogVisible: false,
      // 添加分类表单数据源
      addGoodsCategoryForm: {
        // 将要添加分类的名称
        cat_name: '',
        // 将要添加分类的id
        cat_pid: 0,
        // 将要添加分类的等级
        cat_level: 0
      },
      // 添加分类表单校验规则
      addGoodsCategoryFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
            min: 2
          }
        ]
      },
      // 货物的父级分类列表(指定选项)
      goodsParentCategoryList: [],
      // 级联选择器的配置对象
      cascader: {
        // 次级菜单的展开方式
        expandTrigger: 'hover',
        // 指定选项的值为选项对象的某个属性值
        value: 'cat_pid',
        // 指定选项标签为选项对象的某个属性值
        label: 'cat_name',
        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      },
      // 级联选择器双向数据绑定的值(选中的父级分类的id数组)
      selectedKeys: [],
      // 编辑货物列表
      editCategoryDialogVisible:false,
      // 编辑表单的数据源
      editGoodsCategoryForm:{
        cat_name:''
      },
      // 编辑表单的规则
      editGoodsCategoryFormRules:{
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
            min: 2
          }
        ]
      }
    }
  },
  methods: {
    async getGoodCategoryList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.goodsCategoryList = res.data
      console.log(this.goodsCategoryList)
    },
    // 监听pagesize的改变
    handleSizeChange(pagesize) {
      this.queryParams.pagesize = pagesize
      this.getGoodCategoryList()
    },
    // 监听pagenum的改变
    handleCurrentChange(pagenum) {
      this.queryParams.pagenum = pagenum
      this.getGoodCategoryList()
    },
    showAddGoodsCategory() {
      this.addCategoryDialogVisible = true
      this.getGoodsParentCategoryList()
    },
    async getGoodsParentCategoryList() {
      // 获取前两级父级数据
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品父级列表失败')
      }
      this.goodsParentCategoryList = res.data
    },
    // 选择项发生变化触发
    parentGoodsCategoryHandleChange() {
      // 如果选择数组中的长度大于0,说明选中父级分类,否则就没有任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类id
        this.addGoodsCategoryForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前商品分类的等级赋值
        this.addGoodsCategoryForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类id
        this.addGoodsCategoryForm.cat_pid = 0
        // 为当前商品分类的等级赋值
        this.addGoodsCategoryForm.cat_level = 0
      }
    },
    // 确认添加分类
    addGoodsCategory() {
      this.$refs.addGoodsCategoryFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请重新输入')
        const { data: res } = await this.$http.post(
          'categories',
          this.addGoodsCategoryForm
        )
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        console.log(res.data)
        this.$message.success('添加分类成功')
        this.getGoodCategoryList()
        this.addCategoryDialogVisible = false
      })
    },
    // 监听对话框的关闭事件
    clearAddCategoryFormClose() {
      this.$refs.addGoodsCategoryFormRef.resetFields()
      this.selectedKeys = []
      this.addGoodsCategoryForm.cat_name = ''
      this.addGoodsCategoryForm.cat_pid = 0
      this.addGoodsCategoryForm.cat_level = 0
    },
    // 展示修改商品分类对话框
    showEditGoodsCategoryDialog(goods) {
      this.editCategoryDialogVisible = true
      // 将该行的数据回退到表单中
      this.editGoodsCategoryForm = goods
      console.log(goods)
    },
    // 关闭修改列表
    editCategoryFormClose() {
      this.editCategoryDialogVisible = false
    },
    // 点击确认更新表单
    editGoodsCategory() {
      // 发起ajax请求
      this.$refs.editGoodsCategoryFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入分类名称')
        const { data:res } = await this.$http.put(`categories/${this.editGoodsCategoryForm.cat_id}`, { cat_name:this.editGoodsCategoryForm.cat_name })
        if (res.meta.status !== 200) return this.$message.error('修改分类失败')
        this.$message.success(res.meta.msg)
        this.getGoodCategoryList()
        this.editCategoryDialogVisible = false
      })
    },
    // 显示删除弹框
    delGoodsCategory(delCategoryInfo) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${delCategoryInfo.cat_id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getGoodCategoryList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>
