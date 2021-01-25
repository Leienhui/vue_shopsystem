<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="categroy_option">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCategoryKeys"
            :options="goodsCategoryList"
            :props="categoryProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  class="attr_vals"
                  @close="tagCloseHandler(scope.row,index)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="isShowInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="isModifyParamsDialogVisible(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delParamsHandler(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  class="attr_vals"
                  @close="tagCloseHandler(scope.row,index)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="isShowInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="isModifyParamsDialogVisible(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delParamsHandler(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="addParamsDialogVisible"
      width="70%"
      @close="addParamsDialogClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsHandle">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="modifyParamsDialogVisible"
      width="70%"
      @close="modifyParamsDialogClose"
    >
      <el-form
        :model="modifyParamsForm"
        :rules="modifyParamsFormRules"
        ref="modifyParamsFormRef"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="modifyParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyParamsHandle">确 定</el-button>
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
      goodsCategoryList: [],
      //   级联选择框的配置对象
      categoryProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   级联选择框双向绑定到的数组
      selectedCategoryKeys: [],
      //   被激活的页签名称
      activeName: 'many',
      //   动态参数数据
      manyTableData: [],
      //   静态属性数据
      onlyTableData: [],
      addParamsDialogVisible: false,
      // 添加参数的数据对象
      addParamsForm: {
        attr_name: ''
      },
      // 添加参数的表单规则
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字符',
            trigger: 'blur'
          }
        ]
      },
      modifyParamsDialogVisible: false,
      // 修改的表单数据对象
      modifyParamsForm: {},
      // 修改表单规则
      modifyParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
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
    },
    handleChange() {
      this.getParamsData()
    },
    // 点击标签事件
    handleTabClick(event) {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectedCategoryKeys.length !== 3) {
        this.selectedCategoryKeys = []
        this.manyTableData = []
        this.onlyTableData = []
      } else {
        //   根据所选分类id和当前所处的面板获取对应的参数
        const {
          data: res
        } = await this.$http.get(
          `categories/${this.checkedThreeCategoryId}/attributes`,
          { params: { sel: this.activeName } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败')
        }
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.trim() ? item.attr_vals.split(',') : []
          if (item.attr_vals.length !== 0) {
            item.attr_vals = item.attr_vals.filter(item => item !== '')
          }
          console.log(item.attr_vals)
          // 解决数据双向绑定数据联动
          item.inputVisible = false
          item.inputValue = ''
        })
        this.$message.success('获取参数列表成功')
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      }
    },
    addParamsDialogClose() {
      this.$refs.addParamsFormRef.resetFields()
    },
    addParamsHandle() {
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('表单验证失败')
        }
        const {
          data: res
        } = await this.$http.post(
          `categories/${this.checkedThreeCategoryId}/attributes`,
          { attr_name: this.addParamsForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.$message.success('添加参数成功')
        this.addParamsDialogVisible = false
        this.getParamsData()
      })
    },
    async isModifyParamsDialogVisible(attrId) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.checkedThreeCategoryId}/attributes/${attrId}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      this.modifyParamsForm = res.data
      this.modifyParamsDialogVisible = true
    },
    // 修改参数对话框关闭
    modifyParamsDialogClose() {
      this.$refs.modifyParamsFormRef.resetFields()
    },
    modifyParamsHandle() {
      this.$refs.modifyParamsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('表单验证失败')
        }
        const { data: res } = await this.$http.put(
          `categories/${this.checkedThreeCategoryId}/attributes/${this.modifyParamsForm.attr_id}`,
          {
            attr_name: this.modifyParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) return this.$message.error('修改参数失败')
        this.$message.success('修改参数成功')
        this.modifyParamsdDialogVisible = false
        this.getParamsData()
      })
    },
    async delParamsHandler(row) {
      await this.$http.delete(
        `categories/${row.cat_id}/attributes/${row.attr_id}`
      )
      this.getParamsData()
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        this.saveParams_attr_vals(row)
      // this.getParamsData()
      }
    },
    isShowInput(row) {
      row.inputVisible = true
      // 文本框自动获得焦点
      // $nextTick()当页面上元素被重新渲染之后，才会指定回调中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    tagCloseHandler(row, index) {
      row.attr_vals.splice(index, 1)
      this.saveParams_attr_vals(row)
      this.getParamsData()
    },
    async saveParams_attr_vals(row) {
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      const { data:res } = await this.$http.put(`categories/${this.checkedThreeCategoryId}/attributes/${row.attr_id}`, { attr_name:row.attr_name, attr_sel:row.attr_sel, attr_vals:row.attr_vals.join(',') })
      if (res.meta.status !== 200) return this.$message.error('修改参数失败')
      this.$message.success('修改参数成功')
      row.inputVisible = false
    }
  },
  computed: {
    isBtnDisabled() {
      return this.selectedCategoryKeys.length !== 3
    },
    // 当前选中的三级分类id
    checkedThreeCategoryId() {
      if (this.selectedCategoryKeys.length === 3) {
        return this.selectedCategoryKeys[2]
      } else {
        return null
      }
    },
    // 动态计算标题
    titleText() {
      if (this.activeName === 'many') {
        return '添加动态参数'
      } else {
        return '添加静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.categroy_option {
  margin: 15px 0;
}
.attr_vals {
  margin-right: 15px;
}
.input-new-tag {
  width: 120px;
  margin-right: 10px;
  vertical-align: bottom;
}
</style>
