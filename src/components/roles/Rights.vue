<template>
    <div class="rights_content">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-table
            :data="rightsTableData"
            border
            style="width: 100%">
              <el-table-column
                type="index"
                label="#">
              </el-table-column>
              <el-table-column
                prop="authName"
                label="权限名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="path"
                label="路径"
                width="180">
              </el-table-column>
              <el-table-column
                prop="level"
                label="权限等级">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="info" v-else-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
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
      rightsTableData: []
    }
  },
  created() {
    this.getRightsTableData()
  },
  methods: {
    async getRightsTableData() {
      const { data: res } = await this.$http.get('/rights/list')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.rightsTableData = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>


