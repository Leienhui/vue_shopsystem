<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="authoritesList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="300"
        ></el-table-column>
        <el-table-column prop="path" label="路径" width="300"></el-table-column>
        <el-table-column prop="level" label="权限等级" width="300">
          <!-- 自定义插槽 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级权限</el-tag>
            <el-tag type="success"  v-if="scope.row.level==='1'">二级权限</el-tag>
            <el-tag type="warning"  v-if="scope.row.level==='2'">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有的权限列表
      authoritesList: []
    }
  },
  created() {
    this.getAuthoritesList()
  },
  methods: {
    //   获取权限列表
    async getAuthoritesList() {
      const { data: res } = await this.$http.get('rights/list ')
      // console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取权限失败')
      //   给权限列表赋值
      this.authoritesList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
