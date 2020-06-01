<template>
  <div class="goods_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <tree_table 
      :data="goodsCateData"
      :columns="columns"
      border
      :expand-type='false'
      :selection-type='false'
      show-index
      index-text="#"
      :show-row-hover="false">
      <template slot="isok" scope="scope">
        <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted ===false"></i>
        <i class="el-icon-error" style="color:lightgreen" v-else></i>
      </template>
      <template slot="level" scope="scope">
        <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
      </template>
      <template slot="do" scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" >编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" >删除</el-button>
      </template>
      </tree_table>
      <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="queryInfo.pagesize"
      @current-change="currentChange">
      </el-pagination>
    </el-card>
    <el-dialog
    title="添加分类"
    :visible.sync="addCateDialogVisible"
    width="60%"
    @close = "closeAddCateDialog">
    <el-form ref="addCateFormRef" :model="addCateForm" label-width="80px" :rules="addCateRules" >
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类" >
        <el-cascader
          expand-trigger="hover"
          :options="cateList"
          :props="cascaderProps"
          v-model="selectedCates"
          clearable
          change-on-select
          @change="handleCateChange">
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addCateDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCateConfirmBtn">确 定</el-button>
    </span>
  </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsCateData: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'do'
        }
      ],
      queryInfo: {
        pagesize: 5,
        pagenum: 1
      },
      total: 0,
      addCateDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      cateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCates: []
    }
  },
  created() {
    this.getGoodsCateData()
  },
  methods: {
    async getGoodsCateData() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) return this.$messeage.error(res.meta.msg)
      this.goodsCateData = res.data.result
      this.total = res.data.total
    },
    currentChange(index) {
      this.queryInfo.pagenum = index
      this.getGoodsCateData()
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$messeage.error(res.meta.msg)
      this.cateList = res.data
    },
    addCate() {
      this.getCateList()
      this.addCateDialogVisible = true
    },
    handleCateChange() {
      if (this.selectedCates.length > 0) {
        this.addCateForm.cat_pid = this.selectedCates[
          this.selectedCates.length - 1
        ]
        this.addCateForm.cat_level = this.selectedCates.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateConfirmBtn() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$messeage.error(res.meta.msg)
        this.getGoodsCateData()
        // this.$messeage.success(res.meta.msg)
        this.addCateDialogVisible = false
      })
    },
    closeAddCateDialog() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedCates = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>
<style lang="less">
.goods_container {
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
    .el-row {
      margin-bottom: 15px;
    }
  }
  .el-cascader {
    width: 100%;
  }
}
</style>


