<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="./../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollpase">|||</div>
        <!-- 一级菜单 -->
        <!-- router：为整个侧边栏开启路由模式 -->
        <!-- default-active设置为高亮 -->
        <!--    :default-active="activePath"  -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <el-submenu
            v-for="item in menuList"
            :index="item.id + ''"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconfontObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <!--在开启路由模式的情况下，将 index:作为跳转地址 -->
            <el-menu-item
              v-for="subItem in item.children"
              :index="'/' + subItem.path"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="iconfont icon-caidan"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  // 组件的私有数据
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 一级菜单字体图标
      iconfontObj: {
        // 以数据id作为键，以字体图标作为值
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-quanxianguanli',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-dingdanguanli',
        145: 'iconfont icon-shujutongji'
      },
      // 是否展开侧边栏的判断
      isCollapse: false
      // 判断被激活的链接地址
      // activePath: ''
    }
  },
  // 生命周期函数
  created() {
    //   获取左侧菜单
    this.getMenuList()
    // this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清空sessionStorage
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //   获取左侧菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //   获取到所有的左侧菜单数据
      this.menuList = res.data
    },
    toggleCollpase() {
      this.isCollapse = !this.isCollapse
    }
    // // 获取导航的激活状态
    // saveNavState(activePath) {
    //   // 将这个状态保存在sessionStorage中
    //   window.sessionStorage.setItem('activePath', activePath)
    //   this.activePath = activePath
    // }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  > div {
    display: flex;
    height: 50px;
    align-items: center;
    margin-left: 15px;
    > img {
      height: 100%;
      border-radius: 50%;
      box-sizing: border-box;
    }
    > span {
      color: #fff;
      font-size: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0px;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    letter-spacing: 0.3em;
    text-align: center;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  padding-right: 10px;
}
</style>
