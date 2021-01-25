<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入订单"
            v-model="queryInfo.query"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="orderList" border stripe>
        <!-- 第一个组件是索引列的 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)" width="95">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100">
          <!-- 作用域插槽渲染 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="70">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="160">
          <template slot-scope="scope">
            <!--dateFormat这个被定义在main.js全局的过滤器  -->
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <!-- 作用域插槽渲染 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="modifyAddress(scope.row)"
            >
            </el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showLocationProgress(scope.row)"
            >
            </el-button>
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
        :total="total"
      >
      </el-pagination>
      <!-- 修改地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="modifyAddressDialogVisible"
        width="50%"
        @close="modifyAddressDialogClose"
      >
        <el-form
          :model="modifyAddressForm"
          :rules="modifyAddressFormRules"
          ref="modifyAddressFormRef"
          label-width="120px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              :options="cityData"
              v-model="modifyAddressForm.address1"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="modifyAddressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyAddressDialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="modifyAddressHandle"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 显示物流对话框 -->
      <el-dialog
        title="物流进度"
        :visible.sync="showLocationProgressdialogVisible"
        width="50%"
      >
        <el-timeline reverse>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  created() {
    this.getOrderList()
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [],
      modifyAddressDialogVisible: false,
      // 修改的表单数据对象
      modifyAddressForm: {
        address1: [],
        address2: ''
      },
      // 修改表单规则
      modifyAddressFormRules: {
        address1: [
          {
            min: 2,
            max: 20,
            required: true,
            message: '请输入省市区/县',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            min: 2,
            max: 40,
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }
        ]
      },
      //   城市数据
      cityData,
      showLocationProgressdialogVisible: false,
      locationProgressInfo: [],
      activities: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15'
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13'
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11'
        }
      ]
    }
  },
  methods: {
    async getOrderList() {
      console.log(this.cityData)
      console.log(1111)
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getOrderList()
    },
    handleCurrentChange(pageNum) {
      this.queryInfo.pagenum = pageNum
      this.getOrderList()
    },
    modifyAddress() {
      this.modifyAddressDialogVisible = true
    },
    async showLocationProgress() {
      this.showLocationProgressdialogVisible = true
      //   const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      //   if (res.meta.status !== 200) {
      //     return this.$message.error('获取物流进度失败')
      //   }
      //   this.locationProgressInfo = res.data
    },
    // 修改参数对话框关闭
    modifyAddressDialogClose() {
      this.$refs.modifyAddressFormRef.resetFields()
    },
    modifyAddressHandle() {
      this.modifyAddressDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
