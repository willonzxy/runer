<template lang="pug">
    div(class="floatDot" @click="addOrder") +
</template>
<script>
const URL = {
    FINDPERSON:'/user/findByPhone/'
}
export default {
    data(){
        return{

        }
    },
    methods:{
        /**
         * 1、检查一下session
         * 2、有就检查一下验证状态
         *      2-1、有认证就跳转发单页
         *      2-2、无就去往验证页
         * 
         * 3、没有就跳转登录页面
         */
        addOrder(){
            let that = this,phone = sessionStorage.getItem('zhkuTip_phone');
            if(!phone){  // 没有登录就要跳转登录页
                that.$router.push({
                    name:'login'
                })
            }
            that.$axios.get(URL.FINDPERSON+phone).then(res=>{
                let data = res.data;
                if(data.status === 1 ){
                    if(data.msg[0].flag === 'canDo'){
                        that.$router.push({
                            name:'addOrder'
                        })
                    }else{
                        that.$router.push({
                            name:'identity'
                        })
                    }

                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .floatDot{
        position:fixed;
        bottom:3rem;
        right:1rem;
        border-radius: 50%;
        background:rgba(0, 0, 0, .3);
        color:#fff;
        font-size: 2.5rem;
        padding: 0rem .6rem .3rem;
        cursor: pointer;
    }
</style>


