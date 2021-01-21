<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
          <el-dialog
            title="添加角色"
            :visible.sync="addRoleDialogVisible"
            width="30%"
            @close="addRoleFormClose"
          >
            <el-form
              :model="addRoleForm"
              :rules="addRoleFormRules"
              ref="addRoleFormRef"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addRoleForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addRoleForm.roleDesc"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addRoleDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <el-table :data="roleList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格系统 -->
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['rowbdBottom', index1 === 0 ? 'rowbdTop' : '','vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeAuthorityById(scope.row,item1.id)">{{ item1.authName }}</el-tag
                ><i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="['rowbdBottom', index2 === 0 ? '' : 'rowbdTop','vcenter']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag closable @close="removeAuthorityById(scope.row,item2.id)"  type="success">{{ item2.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeAuthorityById(scope.row,item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300">
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEidtRoleInfo(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delRoleInfo(scope.row.id)"
              >删除</el-button
            >
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetAuthoritiesDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogVisible = false"
    >
      <el-form
        ref="editRoleFormRef"
        :model="editRoleForm"
        :rules="editRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述" width="180">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRolesEdit()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showSetAuthoritiesDialogVisible"
      width="50%"
      @close="clearSetAuthoritiesArr"
      >
      <!-- 树形控件 -->
      <!-- 1、:data指定数据源
      2、props：指定:data数据源的嵌套字段
      3、ref:这个组件的引用4、 -->
      <el-tree
        :data="allAuthoritiesList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
        >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetAuthoritiesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setAuthoritiesForRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      roleList: [],
      addRoleDialogVisible: false,
      //   添加表单的数据
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      delDialogVisible: false,
      // 分配角色对话框是否可见
      showSetAuthoritiesDialogVisible:false,
      // 所有权限列表
      allAuthoritiesList:[],
      // 属性控件的属性绑定对象
      treeProps:{
        // children指定肚子嵌套的字段
        children:'children',
        // label用于指定控件看见的那个字段
        label:'authName'
      },
      // 默认选中的节点id数组
      defKeys:[],
      // 即将分配权限的id值
      roleId:''

    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //   获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    // 添加角色
    async addRole() {
      const { data: res } = await this.$http.post('roles', this.addRoleForm)
      if (res.meta.status !== 201) return this.$message.error('添加角色失败')
      this.addRoleDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
    addRoleFormClose() {
      this.addRoleDialogVisible = false
      //   重置表单
      this.$refs.addRoleFormRef.resetFields()
    },
    // 根据id查询角色
    async showEidtRoleInfo(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('显示角色失败')
      this.editRoleForm = res.data
    },
    // 更新数据
    async updateRolesEdit() {
      const { data: res } = await this.$http.put(
        `roles/${this.editRoleForm.roleId}`,
        this.editRoleForm
      )
      if (res.meta.status !== 200) this.$message.error('修改角色信息失败')
      this.editDialogVisible = false
      this.getRolesList()
      this.$message.success('修改角色信息成功')
    },
    // 删除角色信息
    delRoleInfo(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRolesList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 根据id删除权限
    removeAuthorityById(role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          role.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 展示分配角色的对话框
    async showSetAuthoritiesDialog(role) {
      this.roleId = role.id
      // 获取所有权限
      const { data:res } = await this.$http.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分配权限列表失败')
      }
      this.allAuthoritiesList = res.data
      this.$message.success('获取分配权限列表成功')
      this.recursionGetId(role, this.defKeys)
      this.showSetAuthoritiesDialogVisible = true
    },
    // 通过递归的形式获取三级权限id,并将三级权限id给节点数组
    recursionGetId(node, arr) {
      // 节点不包含children属性，则说明是最后一层
      if (!node.children) return arr.push(node.id)
      // 如果不是最后一层，则循环他的children字段
      node.children.forEach(item => this.recursionGetId(item, arr)
      )
    },
    // 关闭权限的时候，将节点数组中多余的id去掉
    clearSetAuthoritiesArr() {
      this.defKeys = []
    },
    // 点击确定的时候为角色授权
    async setAuthoritiesForRole() {
      // 拿到全选和半选的树形控件复选框
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes()]
      // 将获取到的数组以逗号的形式分隔
      const idStr = keys.join(',')
      const { data:res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids:idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.showSetAuthoritiesDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-top: 7px;
  margin-right: 7px;
}
.rowbdTop {
  border-top: 1px solid #eee;
}
.rowbdBottom {
  border-bottom: 1px solid #eee;
}
.vcenter{
display: flex;
align-items:center;
}
</style>
