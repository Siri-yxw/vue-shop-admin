<template>
  <div class="role_content">
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
          <el-row>
              <el-col>
                  <el-button type="primary">添加角色</el-button>
              </el-col>
          </el-row>
          <el-table
            :data="rolesTableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row :class="[index1===0?'':'bd_top','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                  <el-col :span = 5 ><el-tag closable  @close="closeTag(scope.row,item1.id)">{{item1.authName}}</el-tag><span class="el-icon-caret-right" v-if="item1.children.length!=0"></span></el-col>
                  <el-col :span = 19>
                    <el-row :class="[index2===0?'':'bd_top','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                      <el-col :span = 5><el-tag type="success" closable  @close="closeTag(scope.row,item2.id)">{{item2.authName}}</el-tag><span class="el-icon-caret-right" v-if="item2.children.length!=0"></span></el-col>
                      <el-col :span = 19>
                        <el-tag type="warning" closable  @close="closeTag(scope.row,item3.id)"  v-for="(item3,index3) in item2.children">{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column
              label="#"
              prop="id"
              width = "80px">
            </el-table-column>
            <el-table-column
              label="角色名称"
              prop="roleName"
              width = "200px">
            </el-table-column>
            <el-table-column
              label="角色描述"
              prop="roleDesc">
            </el-table-column>
            <el-table-column label="操作" width = "350px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除
                    </el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
                    </el-button>
                </template>
            </el-table-column>
          </el-table>
      </el-card>
      <el-dialog
  title="分配权限"
  :visible.sync="isShowSetRightDialog"
  width="60%"
  :before-close="handleClose">
  <el-tree :data="rightsList" :props="treeProps" node-key="id" default-expand-all show-checkbox  :default-checked-keys = "defKeys" ref = "treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isShowSetRightDialog = false">取 消</el-button>
    <el-button type="primary" @click="assignRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesTableData: [],
      isShowSetRightDialog: false,
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: 0
    }
  },
  created() {
    this.getRolesTableData()
  },
  methods: {
    async getRolesTableData() {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.rolesTableData = res.data
    },
    closeTag(role, rightId) {
      this.$confirm('此操作将永久删除权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `/roles/${role.id}/rights/${rightId}`
          )
          if (res.meta.status != 200) return this.$message.error(res.meta.msg)
          role.children = res.data
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
      this.getDefKeys(role, this.defKeys)
      console.log(this.defKeys)
      this.isShowSetRightDialog = true
    },
    getDefKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getDefKeys(item, arr)
      })
    },
    async assignRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const rids = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids }
      )
      console.log(res)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('更新权限成功！')
      this.getRolesTableData()
      this.isShowSetRightDialog = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.defKeys = []
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.bd_top {
  border-top: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>


