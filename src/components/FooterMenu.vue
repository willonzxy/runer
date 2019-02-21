<template>
   <ul>
       <router-link :to="{name:'index'}" tag="li">
           <img src="../assets/hand.png" alt="" srcset="">
           <p> 跑腿 </p>
        </router-link>

       <router-link :to="{name:'chat'}" tag="li">
           <img src="../assets/chat.png" alt="" srcset="">
           <p>畅聊</p>
        </router-link>

       <li  @click="clearMsgNum">
           <img v-if="!msgNum" src="../assets/person.png" alt="" srcset="">
            <div v-else class="m-dot">{{msgNum}}</div>
            <p>我的</p>
       </li>
   </ul>
</template>
<script>

export default {
    data(){
        return {
            msgNum:0
        }
    },
    methods:{
        clearMsgNum(){
            let msgNum = this.msgNum;
            this.msgNum = 0;
            this.$router.push({
                name:'home',params:{msgNum:msgNum}
            })
        }
    },
}
</script>
<style lang="less" scoped>
    ul{
        width: 100%;
        background: #F7F7F7;
        li{
            font-size: 0.7rem;
            &:hover{
                color:rgb(40, 161, 121);
            }
        }
        .m-dot{
            margin-top:.3rem;
            margin-bottom: .4rem;
            padding: .2rem 0rem;
            border-radius: 50%;
            font-size: .7rem;
            color:#fff;
            background: #FFA400;
        }
   
    }
    
</style>


