<template>
    <div>
        <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入查询参数"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            />
          </el-input>
        </el-col>
         <el-col :span="4">
          <el-button type="primary"
          @click="goAddPage"
            >添加商品</el-button
          >
         </el-col>
      </el-row>
        <!-- 商品列表区域 -->
    <el-table :data="goodsList" style="fontSize:12px" border stripe>
      <!-- 第一个组件是索引列的 -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="95">
      </el-table-column>
      <el-table-column prop="goods_number" label="商品数量" width="140">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="70">
      </el-table-column>
      <el-table-column prop="add_time" label="添加时间" width="140">
        <template slot-scope="scope">
          <!--dateFormat这个被定义在main.js全局的过滤器  -->
          {{scope.row.add_time|dateFormat}}
          </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <!-- 作用域插槽渲染 -->
        <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            >
            </el-button
          >
          <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteGoodsById(scope.row.goods_id)"
            >
            </el-button
          >
        </template>
      </el-table-column>
    </el-table>
        <!-- 分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 20, 60, 100]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 删除对话框 -->
    </div>
</template>

<script>
export default {
  created() {
    this.getGoodsList()
  },
  data() {
    return {
      queryInfo:{ query:'', pagenum:1, pagesize:5 },
      // 商品列表
      goodsList:[],
      // 总数据条数
      total:0

    }
  },
  methods:{
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params:this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      return this.$message.success('获取商品列表成功')
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getGoodsList()
    },
    handleCurrentChange(pageNum) {
      this.queryInfo.pagenum = pageNum
      this.getGoodsList()
    },
    async deleteGoodsById(goodsId) {
      const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirm !== 'confirm') return this.$message.info('删除取消')
      const { data: res } = await this.$http.delete(`goods/${goodsId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    goAddPage() {
      this.$router.push('goods/add')
    }
  }

}
</script>

<style lang="less" scoped>

</style>
