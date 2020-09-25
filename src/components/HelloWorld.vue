<template>
    <el-container class="container">

      <el-header>
        禁止商用，提倡互帮互助，打击各种收费代抢
      </el-header>

      <el-container>

        <el-aside width="50">
          <el-menu
            :default-active="$route.path"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
          >
            <el-menu-item index="/Load" route="/Load">
              <i class="el-icon-menu"></i>
              <span slot="title">抢号</span>
            </el-menu-item>
            <el-menu-item index="/List" route="/List">
              <i class="el-icon-menu"></i>
              <span slot="title">搜号</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>

      </el-container>

      <el-footer>
        @xoyo.xuyutech.top
      </el-footer>

    </el-container>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container{
    height: 100%;
    width: 100%;
  }
  .el-header, .el-footer {
    background-color: #545c64;
    color: #fff;
    text-align: center;
    line-height: 60px;
  }
  .el-menu{
    height: 100%;
  }
</style>
