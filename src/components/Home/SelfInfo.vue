<template>
    <div class="selfInfo">
        <img src="../../assets/updateInfo.png" alt="修改" @click="updateDate">
        <div class="introduce" >
            <img v-if="!noSession" :src="'http://120.77.40.82:3000'+info.avatarUrl" alt="未登录" >
            <img v-else  src="../../assets/logo1.png" alt="未登录">
            <div class="name" v-if="!noSession">
                <p v-if="!noSession">{{info.nickName}}</p>
                <p v-else >未登录</p>
                <img v-if="info.gender == 1 " src="../../assets/home-man.png" alt="男" />
                <img v-else src="../../assets/woman.png" alt="女"/>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    data(){
        return{
            info:null,
            loaded:false,
            noSession:true
        }
    },
    methods:{
        updateDate(){
            if(sessionStorage.getItem('zhkuTip_id')){
                this.$router.push({
                    name:'updateInfo'
                })
            }else{
                this.$router.push({
                    name:'login'
                })
            }
        }
    },
    created(){
        let that = this;
        if(that.info){
            return
        }else{
           that.$axios.get('/user/getSession')
           .then(res=>{
               if(res.data.msg){
                    that.info = res.data.msg;
                    that.loaded = true;
                    that.noSession = false;
               }
           })
        }
    }
}
</script>
<style lang="less" scoped>
    @row:row;
    @col:column;
    .flex(@direction:row){
        display: flex;
        flex-flow: @direction nowrap;
    }
    .selfInfo{
        padding: .3rem .6rem 1.3rem;
        background-image:-webkit-linear-gradient(top, #5DCDDB, #86D4DA);  
        background-image:-ms-linear-gradient(top, #5DCDDB, #86D4DA);  
        background-image:-moz-linear-gradient(top, #5DCDDB, #86D4DA);  
        background-image:linear-gradient(top, #5DCDDB, #86D4DA); 
        background:  #5DCDDB;
        color:#fff;
    }
    
    .selfInfo{
        .flex(@col);
        img{
            align-self: flex-end;
        }
    }
    .introduce{
        .flex(@row);
        color:#fff;
        img{
            width:80px;
            height:80px;
            border-radius: 50%;
        }
        .name{
            margin-left: .6rem;
            img{
                width: 20px;
                height:20px;
                margin-top: 5px;
            }
        }
    }
</style>


