<template>
    <ul>
       
        <router-link :to="{ name:'orderList' }" tag="li" ><img src="../../assets/gift.png" alt="">我发布的</router-link>
        <router-link :to="{ name:'receiptList' }" tag="li" ><img src="../../assets/car.png" alt="">我配送的</router-link>
        <router-link :to="{ name:'msg' }" tag="li" ><img src="../../assets/info.png" alt="">消息通知<div class="dot" v-if="msgNum">{{msgNum}}</div></router-link>
        <router-link :to="{ name:'identity' }" tag="li" class="mar-top" ><img src="../../assets/identity.png" alt="">跑腿认证</router-link>
        <router-link :to="{ name:'login' }" tag="li" class="mar-top" ><img src="../../assets/info.png" alt="">切换账号</router-link>
        <!-- <li><img src="../../assets/gift.png" alt=""><router-link :to="{name:'orderList'}" tag="span">我发布的</router-link></li>
        <li ><img src="../../assets/car.png" alt="" ><router-link :to="{name:'receiptList'}" tag="span">我配送的</router-link></li>
        <li ><img src="../../assets/info.png" alt=""><span @click="checkMsg">消息通知</span></li> -->
        <!-- <li class="mar-top"><img src="../../assets/identity.png" alt=""><router-link :to="{name:'identity'}" tag="span">跑腿认证</router-link></li> -->
    </ul>
</template>
<script>
export default {
    data(){
        return{
            msgNum:0
        }
    },
    methods:{
        // checkMsg(){
        //     this.msgNum = 0;
        //     this.$route.params.msgNum = 0;
        //     this.$router.push({
        //         name:'msg'
        //     })
        // }
    },
    created(){
        let that = this;
        this.msgNum = this.$route.params.msgNum || 0
    }
}
</script>
<style lang="less" scoped>
    ul{
        background: #F0EFF4;
        li{
            display: flex;
            flex-wrap: row nowrap;
            align-items: center;
            padding:.6rem;
            border-bottom: 1px solid #f0f0f0;
            font-size:.7rem;
            color:#737373;
            background: #fff;
            img{
                margin-right: .3rem;
            }
            &:last-of-type{
                border-bottom:none;
            }
            
        }
    }
    .mar-top{
        margin-top:5px;
    }
    
</style>


