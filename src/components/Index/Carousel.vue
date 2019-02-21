<template>
    <el-carousel trigger="click" height="150px" arrow="always">
      <el-carousel-item v-for="(item,index) in picList" :key="index">
          <img :src="item.url" alt="图片加载失败">
      </el-carousel-item>
    </el-carousel>
</template>
<script>
export default {
    data(){
        return{
            picList:[
                    { url:require('../../assets/banner3.png') },
                    { url:require('../../assets/banner2.png') },
                    { url:require('../../assets/banner1.png') }
                ]
        }
    }
}
</script>
<style lang="less" scoped>

    .el-carousel__item h3 {
        text-align: center;
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }
    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
    img{
        width:100%;
        height:100%;
    }
    
</style>

