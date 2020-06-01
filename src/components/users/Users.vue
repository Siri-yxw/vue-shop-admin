<template>
    <div class="user_container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-col :span='10'>
                <el-input placeholder="请输入内容" class="input-with-select" v-model="paramsObj.query" clearable @clear = "clearQuery">
                    <el-button slot="append" icon="el-icon-search" @click="serch"></el-button>
                </el-input>
            </el-col>
            <el-button type="primary" class="add_user_btn" @click="addUser">添加用户</el-button>
            <el-table
            :data="userList"
            style="width: 100%"
            stripe
            border
            >
                <el-table-column
                  type="index"
                  width="50"
                  label="#">
                </el-table-column>
                <el-table-column
                  label="姓名"
                  property="username"
                  width="120">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.username }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="邮箱"
                  property="email"
                  width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.email }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="电话"
                  property="mobile"
                  width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.mobile }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="角色"
                  property="role_name"
                  width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.role_name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="80">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="操作" >
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"  @click="handleEditUser(scope.row.id)">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                    @click="handleDeleteUser(scope.row.id)">
                    </el-button>
                    <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                        <el-button type="warning" icon="el-icon-setting" size="mini"
                        @click="handleSettingUser(scope.$index, scope.row)">
                        </el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="paramsObj.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
      </el-card>
      <!-- 添加用户 -->
      <el-dialog title="添加用户" :visible.sync="addDialogFormVisible" @close = "closeAddDialog">
      <el-form :model="addUserForm" ref="addUserFormRef" :rules="addUserRules" label-position="left" label-width="80px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="EditDialogVisible"
      @close = "closeEditDialog" 
      >
      <el-form :model="editUserForm" :rules="editUserRules" ref="editUserFormRef" label-position="left" label-width="80px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username" >
            <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
  title="分配角色"
  :visible.sync="isShouwHandleSettingUserDialog"
  width="60%"
  :before-close="handleClose"
  @close = "closeSettingUserDialog">
  <div>当前用户：{{userInfo.role_name}}</div>
  <div>当前角色:{{userInfo.username}}</div>
  <div>
    <span>分配新角色:</span>
    <el-select v-model="selectedRoleId" placeholder="请选择">
      <el-option
        v-for="item in usersOptions"
        :key="item.id"
        :label="item.roleName"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isShouwHandleSettingUserDialog = false">取 消</el-button>
    <el-button type="primary" @click="confirmSetUserBtn">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (reg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (reg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      userList: [],
      paramsObj: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addDialogFormVisible: false,
      EditDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur', required: true }],
        mobile: [{ validator: checkMobile, trigger: 'blur', required: true }]
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editUserRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur', required: true }],
        mobile: [{ validator: checkMobile, trigger: 'blur', required: true }]
      },
      isShouwHandleSettingUserDialog: false,
      usersOptions: [],
      userInfo: {},
      roleDesc: '',
      rid: '',
      selectedRoleId: ''
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.paramsObj
      })
      if (res.meta.status != 200) return this.$message(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 分页
    async handleSizeChange(val) {
      this.paramsObj.pagesize = +`${val}`
      this.getUsersList()
    },
    async handleCurrentChange(val) {
      this.paramsObj.pagenum = `${val}`
      this.getUsersList()
    },
    async userStateChange(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (res.meta.status != 200) {
        row.mg_state = !row.mg_state
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success()
      }
    },
    serch() {
      this.getUsersList()
    },
    clearQuery() {
      this.getUsersList()
    },
    addUser() {
      this.addDialogFormVisible = true
    },
    closeAddDialog() {
      this.$refs['addUserFormRef'].resetFields()
    },
    addUserConfirm() {
      this.$refs['addUserFormRef'].validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/users', this.addUserForm)
        // console.log(res, 'res')
        if (res.meta.status != 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        console.log(this.$message)
        this.addDialogFormVisible = false
        this.getUsersList()
      })
    },
    // 编辑用户
    async handleEditUser(id) {
      this.EditDialogVisible = true
      const { data: res } = await this.$http.get(`/users` + `/${id}`)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.editUserForm = res.data
    },
    closeEditDialog() {
      this.$refs['editUserFormRef'].resetFields()
    },
    editUserConfirm() {
      this.$refs['editUserFormRef'].validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          '/users' + '/' + this.editUserForm.id,
          { email: this.editUserForm.email, mobile: this.editUserForm.mobile }
        )
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改成功')
        this.EditDialogVisible = false
        this.getUsersList()
      })
    },
    // 删除用户
    async handleDeleteUser(id) {
      const delConfirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (delConfirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/users' + '/' + id)
      if (res.meta.status != 200) return $message.error(res.meta.msg)
      this.getUsersList()
      this.$message.info('删除成功')
    },
    // 分配角色
    async handleSettingUser(index, row) {
      this.userInfo = row
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.usersOptions = res.data
      this.isShouwHandleSettingUserDialog = true
    },
    async confirmSetUserBtn() {
      if (!this.selectedRoleId)
        return this.$message.error('请选择要分配的权限！')
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('分配角色成功！')
      this.getUsersList()
      this.isShouwHandleSettingUserDialog = false
    },
    closeSettingUserDialog() {
      ;(this.selectedRoleId = ''), (this.userInfo = {})
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
<style lang="less" scoped>
.user_container {
  .el-card {
    margin-top: 20px;
    .add_user_btn {
      margin-left: 10px;
    }
    .el-table {
      margin-top: 20px;
    }
    .el-pagination {
      margin-top: 15px;
    }
  }
}
</style>


