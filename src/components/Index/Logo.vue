<template>
<header>
    <nav class="fix-top">
        <img src="../../assets/symbol.png" alt="">
        <span>仲园跑腿</span>
    </nav>
    <div class="block">

    </div>
</header>

</template>
<script>
export default {

}
</script>
<style lang="less" scoped>
    nav{
        height:auto;
        background: #4CCCD9;
        color:#fff;
        padding: .5rem .1rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .fix-top{
        position: fixed;
        width: 100%;
        top:0px;
        z-index:3;
    }
    .block{
        height:2.7rem;
    }
</style>

