<template lang="pug">
    section
        div(class="header") 消息通知
        div(class="box" v-for="(item,index) in data" :key="index")
            div(class="msg-info" )
                div(class="img")
                    img(:src=" 'http://120.77.40.82:3000'+ item.avatarUrl")
                div(class="msg-detail")
                    ul
                        li(class="space-between")
                            span(class="bold") {{item.nickName}} :
                            span(class="time") {{formatterDate(item.date)}}
                        li(class="msg-content" v-if="item.type === '2req' && item.orderStatus === 1 ") 请求获取快递信息
                             span(style="color:red") {{item.msg}} 
                        li(class="msg-content" v-else-if="item.type === '2res' ") 快递详情
                             span(style="color:red") {{item.msg}}
                        li(class="msg-content" v-else) 
                             span(style="color:red") {{item.msg}} 
                             
                        li(style="text-align:right")
                            el-button(type="danger" size="small" @click="deleteMsg(item._id)") 删除信息
                            el-button(type="primary" size="small" v-if="item.type === '2req' && item.orderStatus === 1  "  @click="resovle(item.orderId,item.resId,item.resPhone)") 确认
                            el-button(type="warning" size="small" v-if="item.type === '2req' && item.orderStatus === 1 "  @click="reject(item.orderId,item.resId,item.resPhone)") 拒绝
</template>
<script>
const URL = {
    GETSESSION:'/user/getSession',
    PULLMSG:'/msg/list',
    PERSONID:'/user/findByPhone/',
    DEL:'/msg/del/',
    UPDATESTATUS:'/order/updateInfo/',
    FINDBYORDERID:'/order/findByOrderId/'
}
export default {
    data(){
        return {
            data:[{
                avatarUrl:'',
                nickName:'',
                date:'',
                msg:'',
                _id:'',
                resPhone:'',
                orderId:'',
                resId:'',
                type:'', //消息类型,
                orderStatus:''
            }]
        }
    },
    methods:{
        getSession(){
            return this.$axios.get(URL.GETSESSION).then(res=>{
                if(res.data.status === 1){
                    return res.data.msg;
                }else{
                    return undefined
                }
            });
        },
         formatterDate(row){
            let time = new Date(row);
            let hours = (()=>time.getHours()<10?'0'+ time.getHours():time.getHours())()
            let min = (()=> time.getMinutes()<10?'0'+ time.getMinutes():time.getMinutes())()
            let s = (()=>time.getSeconds()<10?'0'+ time.getSeconds():time.getSeconds())()
            return time.toLocaleDateString().replace(/\//ig,'-')+' '+hours+':'+min+':'+s
        },
        resovle(orderId,resId,resPhone){//告诉接单者，我同意你接单,并修改订单状态
            let sInfo = prompt('请您输入快递信息'); //输入一些私密信息
            if(sInfo){
                let that = this;
                that.$socket.emit('send_pmsg',sessionStorage.getItem('zhkuTip_phone'),resPhone,{msg:sInfo,msgId:Date.now()},'2res');

                that.$message({  //刷新订单情况
                        type:'success',
                        message:'OK,系统已经帮您告知他了'
                    })

                that.$axios.post(URL.UPDATESTATUS+orderId,qs.stringify({status:2,receiptId:resId,goOff:Date.now()}))//已被抢状态 

                .then(res=>{
                    that.pullMsg();
                })
                .catch(err=>{
                    
                    that.$message({  //刷新订单情况
                        type:'error',
                        message:'哎呀，服务器出了点问题'
                    })
                    
                })

            }else{
                that.$message({  //刷新订单情况
                    type:'error',
                    message:'请您输入快递信息'
                })
            }
            
        },
        reject(orderId,resId,resPhone){
            let that = this;
            that.$socket.emit('send_pmsg',sessionStorage.getItem('zhkuTip_phone'),resPhone,{msg:'不好意思，Ta拒接了您的请求',msgId:Date.now()},'2reject');
            that.$socket.on('pmsg_res',res=>{
                if(res.flag){
                    that.$message({  //刷新订单情况
                        type:'success',
                        message:'OK,系统已经帮您告知他了'
                    })
                }}
            )
            that.pullMsg();
        },
        pullMsg(){
            let that = this,infoQ = [],infoCollection = [];
            that.getSession().then(person=>{
                
               
                if(person){
            
                    let fd = that.$axios.get(URL.PULLMSG+'?receiptId='+person.phone).then(msg=>{//当前关于当前用户的消息
                        return msg.data;
                    })

                    fd.then(msg=>{  //消息数组
                        msg.data.list.forEach(item=>{
                            infoQ.push(
                                    that.$axios.get(URL.PERSONID+item.consignmentId).then(receipt=>{ //分别查找出 消息发送者的信息
                                        if(receipt.data.msg.length>0){
                                            let avatarUrl = receipt.data.msg[0].avatarUrl;
                                            // /**头像处理 */
                                            // if(!/^http:\/\/|^https:\/\//.test(avatarUrl)){//判断是否是网络资源   /^http:|^https:(?=\/\/)/.exec(str)也可以

                                            //     avatarUrl = require(avatarUrl); //不是就是本地资源处理本地资源
                                            // }

                                            that.$axios.get(URL.FINDBYORDERID+item.orderId)
                                            .then(res=>res.data.msg[0])
                                            .then(order=>{

                                                let receipter = receipt.data.msg[0];

                                                infoCollection.push({
                                                    avatarUrl:avatarUrl,
                                                    nickName:receipter.nickName,
                                                    resPhone:receipter.phone,
                                                    resId:receipter._id,
                                                    date:item.date,
                                                    msg:item.msg,
                                                    _id:item._id,
                                                    orderId:item.orderId,
                                                    orderStatus:order.status,
                                                    type:item.type //消息类型
                                                })
                                            })

                                            




                                        }else{
                                            return  
                                        }
                                        
                                    })
                            )
                        })

                        Promise.all(infoQ).then(()=>{
                            that.data = infoCollection;
                        })
                    })

                }else{
                    alert('系统提示:\n\n您还没登录');
                }
            })
        },
        deleteMsg(id){
            console.log(id);
            let that = this;
            that.$axios.get(URL.DEL+id).then(res=>{
                console.log(res);
                that.pullMsg();
            })
            
        }
    },
    created(){
        this.pullMsg();
    }
}
</script>
<style lang="less" scoped>
    @col:column;
    .full{
        width: 100%;
        height:100%;
    }
    .only-flex{
        display: flex;
    }
    .flex(@row:row){
        display: flex;
        flex-flow: @row nowrap;
    }
    section{
        width: 100vw;
        height:100vh;
        background: #EFEFF3;
         div{
            .only-flex;
           
        }
        .box{
            .flex(@col);
            padding:.5rem;
        }
    }
    .mar-top{
        margin-top: .6rem;
    }
    .msg-info{
        .mar-top;
        padding: .2rem .8rem .2rem .2rem;
        background: #fff;
        border-radius: 5px;
        font-size: .6rem;
        
        .img{
            flex: 1;
            
            img{
                width:3.4rem;
                height:3.4rem;
                border-radius: 50%;
                margin:.3rem auto;
            }
        }
        .msg-detail{
            flex: 2;
            .msg-content{
                color:#778685;
                word-break: break-all;
            }
        }
        ul{
            width: 100%;
            list-style-type: none;
            li{
                padding: .3rem 0rem;
            }
        }
        .bold{
            font-weight: bold;
            font-size: 1rem;
        }
    }
    .space-between{
        .flex;
        justify-content: space-between;
    }
    .header{
        padding: 0.5rem;
        justify-content: center;
        background: #4DCADA;
        color:#fff;
        font-size: 600;
    }
    .fontsize(@rem:.6rem,@color:#fff){
        color:@color;
        font-size: @rem;
    }
    .time{
        .fontsize(.5rem,#4BCBDA);
    }
</style>


