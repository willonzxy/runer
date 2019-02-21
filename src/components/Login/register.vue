<template>
    <section>
        <img src="../../assets/logo1.png" alt="" srcset="">
        <span style="color:#b6c0cc" class="mar-top">仲园跑腿-注册</span>
        <div>
            <input type="text" placeholder="昵称"  v-model="form.nickName">
            <input type="number" placeholder="手机号" v-model="form.phone" >
            <input type="password" placeholder="密码" v-model="form.password" >
            <input type="password" placeholder="再次输入密码" v-model="form.passwordA" >
            <div class="layout-between mar-top">
                <div>
                    <router-link :to="{name:'login'}" tag="span" >登录 </router-link>
                </div>
                <div>
                    <router-link :to="{name:''}" tag="span" >忘记密码</router-link>
                </div>
            </div>
            <el-button type="primary" class="mar-top" @click="register">注册</el-button>
        </div>
    </section>
</template>
<script>
const URL = {
    RESIGSTER:'/user/add',
    
}
export default {
    data(){
        return {
            form:{
                phone:'',
                password:'',
                passwordA:'',
                nickName:''
            }
            
        }
    },
    methods:{
        register(){
            let that = this;
            if(/^1[3-9]\d{9}$/.test(that.form.phone)){
                if(that.form.password === that.form.passwordA){
                    delete that.form.passwordA;
                    that.form.password = md5(that.form.password);
                    that.$axios.post(URL.RESIGSTER,qs.stringify(that.form))
                    .then(res=>{
                        let data = res.data;
                        if(data.status === 1){
                            that.$message({
                                type:'success',
                                message:data.msg
                            })
                            that.$router.push({
                                name:'login'
                            })
                        }else{
                            that.$message.error(data.msg)
                        }
                    })
                }else{
                    that.$message.error('您输入的密码不一致')
                }
            }else{
                that.$message.error('您输入的手机号不合法')
            }
            
        },
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
    input[type=text],input[type=password],input[type=number],input[type=file]{
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


