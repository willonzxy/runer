<template>
    <section>
        <img src="../../assets/logo1.png" alt="" srcset="">
        <span style="color:#b6c0cc" class="mar-top">仲园跑腿</span>
        <div>
            <input type="text" placeholder="账号" v-model="phone">
            <input type="password" placeholder="密码" v-model="password">
            <div class="layout-between mar-top">
                <div>
                    <input type="checkbox" id="remember" @click="remember">
                    <label for="remember">记住密码</label>
                </div>
                <div>
                    <router-link :to="{name:'register'}" tag="span" >注册 </router-link>
                </div>
                <div>
                    <router-link :to="{name:''}" tag="span" >忘记密码</router-link>
                </div>
            </div>
            <el-button type="primary" class="mar-top" @click="submit">登录</el-button>
        </div>
    </section>
</template>
<script>
const URL = {
    LOGIN:'/user/login',
    SESSION:'/user/getSession',
    LOGINOUT:'/user/loginOut'
}
export default {
    data(){
        return {
            phone:'',
            password:''
        }
    },
    methods:{
        remember(){
            let that = this;
            if(that.phone && that.password){
                localStorage.setItem('tip-phone',that.phone);
                localStorage.setItem('tip-password',that.password);
            }else{
                that.$message.error('请您先把信息填完整')
            }
        },
        submit(){
            
            let that = this;
            that.$socket.emit('disconnect');
            that.$axios.get(URL.LOGINOUT).then(()=>{
                that.$axios.post(URL.LOGIN,qs.stringify({
                    phone:that.phone,
                    password:md5(that.password)
                    })).then(res=>{
                        if(res.data.status === 1){
                            that.$axios.get(URL.SESSION).then(res=>{
                               
                                if(res.data.status === 1){//登录成功缓存个人信息
                                    sessionStorage.setItem('zhkuTip_phone',res.data.msg.phone);
                                    sessionStorage.setItem('zhkuTip_id',res.data.msg._id);
                                    sessionStorage.setItem('zhkuTip_flag',res.data.msg.flag);
                                    sessionStorage.setItem('zhkuTip_nickName',res.data.msg.nickName);
                                    
                                    that.$socket.emit('join',that.phone);
                                    that.$router.push({ //登录成功跳转到首页
                                        name:'home',
                                    })
                                }

                            })
                            
                        }else{
                            that.$message.error(res.data.msg)
                        }
                    })

            })
            
        },
    },
    created(){
        let phone = localStorage.getItem('tip-phone'),password = localStorage.getItem('tip-password'),that = this;
        that.phone = phone;
        that.password = password;
    }
    
}
</script>
<style lang="less" scoped>
    @width:5rem;
    @full:100%;
    section{
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        padding:3.5rem 2rem 2rem;
        color:#333;
        div{
            flex-flow: column nowrap;
            align-items: center;
            font-size: .7rem;
        }

    }
    .mar-top{
        margin-top:.7rem;
    }
    input[type=text],input[type=password]{
        .mar-top;
        width:@full;
        height:@width*0.6;
        font-size: @width*0.2;
        outline: none;
        border: none;
        border-bottom: 1px solid #409EFF;
    }
    img{
        border-radius: 50%;
        width: @width;
        height:@width;
    }
    button{
        outline: none;
        width: @full;
        height:@width*0.6;
    }
    .layout-between{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
    
</style>


