<template>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabpage">
        <el-tab-pane label="进转出" name="0"></el-tab-pane>
    </el-tabs>
</template>


<script>
  export default {
      name:'DispatchMenus',
      data(){
          return {
              activeName:'0',
              userinfo: global.userinfo
          }
      },
      props:{
          menuindex: Number
      },
      created(){
      },
      mounted(){
          this.activeName = this.menuindex.toString()
      },
      methods:{
        handleClick(tab, event) {
            switch(tab.index){
                case '0':
                    this.$router.push('/business/dispatch/inout')
                    break;
            }
        },
    }
  }
</script>

<style scoped lang="scss">
    .tabpage{
        background: #ffffff;
        padding: 0px 20px;
        margin: -20px -40px 15px -40px;
    }
</style>
<style>
    .tabpage .el-tabs__header{
        margin-bottom: 0px;
    }
    .tabpage .el-tabs__nav-scroll{
        padding: 0px 20px;
    }
</style>
