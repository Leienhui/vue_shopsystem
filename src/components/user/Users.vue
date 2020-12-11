<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户需要用dialog这个对话框 -->
          <el-button type="text" @click="addDialogVisible = true"
            >添加用户</el-button
          >
          <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="30%"
            @close="addCloseDialog"
          >
            <!-- 内容主体区域 -->
            <!-- 表单校验
            1、:model=>数据绑定对象
            2、:rules=>验证规则对象
            3、ref=>引用对象
            4、prop=>指定具体的校验规则
            5、v-model=>绑定数据绑定对象（:model绑定的属性）
             -->
            <el-form
              :model="addForm"
              :rules="addFormRules"
              ref="addFormRef"
              label-width="70px"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
    </el-card>
    <!-- 用户列表区域 -->
    <el-table :data="userList" style="width: 100%" border stripe>
      <!-- 第一个组件是索引列的 -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话" width="180">
      </el-table-column>
      <el-table-column prop="role_name" label="角色" width="180">
      </el-table-column>
      <el-table-column label="状态" width="180">
        <!-- 作用域插槽
        1、slot-scope="scope"接收当前的数据
        2、scope.row获得当前行数据
         -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <!-- 作用域插槽渲染 -->
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              circle
            >
            </el-button
          ></el-tooltip>
          <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editCloseDialog"
          >
            <!-- 内容主体区域 -->
            <!-- 表单校验
            1、:model=>数据绑定对象
            2、:rules=>验证规则对象
            3、ref=>引用对象
            4、prop=>指定具体的校验规则
            5、v-model=>绑定数据绑定对象（:model绑定的属性）
             -->
            <el-form
              :model="editForm"
              :rules="editFormRules"
              ref="editFormRef"
              label-width="70px"
            >
              <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
          </el-dialog>
          <el-tooltip class="item" effect="dark" content="删除" placement="top"
            ><el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="delUser(scope.row.id)"
            ></el-button
          ></el-tooltip>
          <!-- 分配角色与权限管理有关联 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="分配角色"
            placement="top"
            ><el-button
              size="mini"
              type="warm"
              icon="el-icon-setting"
              circle
            ></el-button
          ></el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校验规则
    const validatorEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    const validatorPhone = function (rule, value, callback) {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 用户列表
      userList: [],
      // 数据条数
      total: 0,
      // 控制对话框显示与隐藏
      addDialogVisible: false,
      // 添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        // 自定义校验规则
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
            validator: validatorEmail
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
            validator: validatorPhone
          }
        ]
      },
      // 修改对话框相关操作
      editDialogVisible: false,
      // 修改的用户信息,也是查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        // 自定义校验规则
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
            validator: validatorEmail
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
            validator: validatorPhone
          }
        ]
      }
    }
  },
  created() {
    // 获取用户列表
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // 发起ajax网路请求,解构出data重命名为res
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的值
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 状态的检测
    async userStateChange(userRow) {
      const { data: res } = await this.$http.put(
        `users/${userRow.id}/state/${userRow.mg_state}`
      )
      if (res.meta.status !== 200) {
        userRow.mg_state = !userRow.mg_state
        return this.$message.error('更新用户状态失败')
      }
      return this.$message.success('更新用户状态成功')
    },
    // 监听对话框的关闭事件
    addCloseDialog() {
      // 重置表单
      // (重置表单的的步骤=>1、添加事件 2、给事件添加函数 3、this.$refs.addFormRef(拿到表单的引用对象).resetFields())
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser() {
      // 表单预校验
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('用户验证失败')
        // 发起网络请求添加用户
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        // 隐藏对话框
        this.addDialogVisible = false
        // 重新获取用户列表
        this.getUserList()
      })
    },
    // 显示修改用户信息
    async showEditDialog(id) {
      // 根据id查询用户信息
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户验证失败')
      }
      // 查询成功，保存查询到的用户信息
      this.editForm = res.data
    },
    // 发起网络请求修改用户数据
    editUserInfo() {
      // 表单预校验
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('用户验证失败')
        // 校验成功发起ajax请求
        console.log(this.editForm.mobile)
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200) return this.$message.error('用户修改失败')
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新列表
        this.getUserList()
        return this.$message.success('用户修改成功')
      })
    },
    // 关闭修改对话框
    editCloseDialog() {
      // 重置对话框
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    // 删除用户信息
    async delUser(id) {
      console.log(id)
      await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data:res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
          this.getUserList()
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

<style  scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1) !important;
}
</style>
