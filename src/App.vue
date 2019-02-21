<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
    name: 'App',
    methods:{
        browserRedirect() {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) ){
                    document.body.innerHTML = '<h2 style="text-align:center;color:#333"> 抱歉！请使用移动终端设备进行访问 </h2>'
                    return
            }
        }
    },
    created(){
        let that = this;
        that.browserRedirect();

        that.$socket.on('pmsg',(from,to,msg,type)=>{//登录成功后监听是否有漏接信息，对用户进行提醒
            if(type === '2res'){
                that.$notify({
                    title:'恭喜',
                    message:'委托人告诉了您,Ta的快递信息,请前往查看',
                    duration:0
                })
                return 
            }
            if(type === '2reject'){
                that.$notify({
                    title:'抱歉',
                    message:'委托人拒接了您的请求，请前往查看',
                    duration:0
                })
                return 
            }
            if(type === '2req'){
                that.$notify({
                    title:'提示',
                    message:'您的快递订单,有人想接单,请前往确认',
                    duration:0
                })
                return 
            }
    
            that.$socket.emit('clientSuccessReceipt',to,msg.msgId);//告诉服务器，我客户端已经接收到信息
        })

        that.$socket.on('hasAudit',()=>{
            that.$notify({
                title:'主人',
                message:'有人叫你去审核啦',
                duration:0
            })
        })
            
    }
}
</script>

<style lang="less">
  *{
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }
    @row:row;
    @col:column;
    .flex(@direction:row){
        display: flex;
        flex-flow: @direction nowrap;
    }
    .container{
        display: flex;
        flex-flow: column nowrap;
        margin: 0px auto;
        min-width: 310px;
    }
    footer{
        position: fixed;
        bottom: 0px;
        width: 100%;
        height:auto;
        border-top:1px solid #f0f0f0;
        background: #fff;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        ul{
            list-style-type: none;
            text-align: center;
            color:#DADADA;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            li{
                padding: .3rem 2.3rem .3rem ;
            }
        }
    }
    .bottom-block{
        height:2.8rem;
    }
    .dot{
        margin-left:.3rem;
        padding: .2rem .4rem;
        border-radius: 50%;
        font-size: .7rem;
        color:#fff;
        background: #FFA400;
    }
    .el-dialog__body{
        text-align: center ;
    }
    .el-dialog__footer{
        text-align: center ;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader{
        margin: .2rem;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-notification{
        min-width: 200px;
    }
    .el-message{
        min-width: 200px;
    }
</style>
