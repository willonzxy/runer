<template lang="pug">
    section
        div(class="header") 仲友聊
        div(class="main" id="main")
        div(class="insert") 
            input(class="insert-msg" placeholder="每次最多输入30字" v-model="msg" @keyup.enter="add")
            img(src="../assets/arrow.jpg" @click="add")
</template>
<script>
export default {
    data(){
        return{
            msg:''
        }
    },
    methods:{
        add(){
            let that = this;
            if(that.msg.length === 0){
                that.$message.error('消息不能为空');
                return
            }
            if(that.msg.length>30){
                that.$message.error('每次限30字');
                return
            }
            that.$socket.emit('sendChat',that.msg);
            that.msg = '';
        },
        append(m){
            let main = document.getElementById('main'),
                msg = document.createElement('div'),
                info = document.createElement('div'),
                content = document.createElement('div');
                msg.classList.add('msg');
                info.classList.add('info');
                content.classList.add('content');
                info.innerText = this.formatterDate(Date.now());
                content.innerText = m;
                msg.appendChild(info);
                msg.appendChild(content);
                main.appendChild(msg);
                main.scrollTop = main.scrollHeight; 
        },
        formatterDate(row){
            let time = new Date(row);
            let hours = (()=>time.getHours()<10?'0'+ time.getHours():time.getHours())()
            let min = (()=> time.getMinutes()<10?'0'+ time.getMinutes():time.getMinutes())()
            let s = (()=>time.getSeconds()<10?'0'+ time.getSeconds():time.getSeconds())()
            return time.toLocaleDateString().replace(/\//ig,'-')+' '+hours+':'+min+':'+s
        },
    },
    created(){
        let that = this;
        if(!sessionStorage.getItem('zhkuTip_phone')){
            that.$router.push({
                name:'login'
            })
        }
        let css = document.createElement('style');
            css.innerHTML = `.msg{
                            flex-flow: column nowrap;
                            margin: .5rem;
                            padding: .5rem;
                            background: #fff;
                            min-width: 3rem;
                            max-width: 80%;
                            // max-height: 4rem;
                            border-radius: 3rem 3rem 3rem 0rem;
                        }
                        .info{
                            text-align:right;
                            font-size: .7rem;
                            color:#aebfc7;
                        }`
            document.head.appendChild(css);
            that.$socket.on('chatContent',msg=>{
                that.append(msg);
            })
    }
}
</script>
<style lang="less" scoped>
    .full{
        width:100vw;
        height:100vh;
    }
    section{
        .full;
        display: flex;
        flex-flow: column nowrap;
        div{
            display: flex;
            flex-flow: row nowrap;
        }
    }
    .header{
        padding: 0.5rem;
        justify-content: center;
        align-items: center;
        background: #4DCADA;
        color:#fff;
        font-size: 600;
    }
    .main{
        flex:1;
        flex-flow: column nowrap;
        background: #EFEEF6;
        overflow-y: auto;
    }
    .insert{
        justify-content: space-between;
        align-items: center;
        padding: .4rem;
        background: #fff;
        .insert-msg{
            width:85%;
            height:2rem;
            border-radius: 3rem;
            outline: none;
            border:none;
            background:#EFEEF6;
            text-indent: 1rem;
            font-size: 1rem;
        }
        img{
            width:10%;
            height:2rem;
        }
    }
    
</style>

