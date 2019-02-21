<template>
   <div class="banner">
       <img src="../../assets/alert.png" alt="" srcset="">
       <div class="info">
           <span>
               跑腿人员,要把货品交到委托人手上喔,然后当面(收/付)款
           </span>
       </div>
   </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
    .banner{
        position: relative;
        display: flex;
        flex-wrap: row nowrap;
        align-items: center;
        padding: .3rem 0rem;
        justify-content: flex-start;
        border-bottom: 1px solid #f0f0f0;
        .info{
            position: absolute;
            z-index:-1;
            right:.3rem;
            color:#99A9BF;
            font-size: .6rem;
        }
    }
</style>

