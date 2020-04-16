<template>
  <el-container class="container">
      <el-header>
          <div class="logo"><img src="../assets/logo.png" alt=""></div>
          <el-button type="info" class="logout_btn" @click="logout()">退出</el-button>
      </el-header>
      <el-container>
          <el-aside :width="isCollapse?'64px':'200px'">
            <div class="toggle_btn" @click="toggleCollapse">|||</div>
            <el-col :span="24">
              <el-menu
                :default-active="defaultNavPath"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#323744"
                text-color="#fff"
                active-text-color="#349BFF"
                :unique-opened="true"
                :collapse="isCollapse"
                :collapse-transition = "false"
                router>
                <el-submenu :index="'/'+item1.path" v-for="(item1,index1) in menusList" :key="item1.id">
                  <template slot="title">
                    <i :class="iconsObj[item1.id]"></i>
                    <span>{{item1.authName}}</span>
                  </template>
                  <el-menu-item :index="'/'+item2.path+''" v-for="(item2,index2) in item1.children" :key="item2.id" @click="saveNavPath('/'+item2.path+'')">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span>{{item2.authName}}</span>
                    </template>
                  </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-aside>
          <el-main><router-view></router-view></el-main>
      </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      menusList: [],
      iconsObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-grid',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-platform'
      },
      isCollapse: false,
      defaultNavPath: ''
    }
  },
  created() {
    this.getMenusList()
    const navPath = window.localStorage.getItem('navPath')
    this.defaultNavPath = navPath
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功！')
    },
    async getMenusList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status != 200) return
      this.menusList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavPath(navPath) {
      window.localStorage.setItem('navPath', navPath)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373c41;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    width: 207px;
    height: 56px;
  }
  .logout_btn {
    height: 35px;
  }
}
.el-aside {
  background-color: #323744;
  .toggle_btn {
    line-height: 30px;
    background-color: #4a5024;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    text-align: center;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf2;
}
.container {
  height: 100%;
}
.el-menu {
  border-right: none;
}
</style>
