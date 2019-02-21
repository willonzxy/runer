<template lang="pug">
    section
        div(class="header") 我配送的
        div(class="box" v-for="(item,index) in data" :key="index")
            div(class="msg-info" )
                div(class="msg-detail")
                    ul
                        li
                            span(class="bold") {{index+1}}.
                        li(class="space-between")
                            span(class="bold") 帮TA {{item.nickName}}
                            span(class="time") {{translateStartDate(item.date)}}
                        li(class="updown-center")
                            img(src="../assets/start.png")/ {{item.taskSite}} 
                        li(class="updown-center")
                            img(src="../assets/end.png")/ {{item.endSite}} 
                        li(class="updown-center")
                            img(src="../assets/money.png")/ {{item.tips}} 元 
                        li(class="updown-center")
                            img(src="../assets/info.png")/ {{item.msg}} 
                        li(class="updown-center")
                            img(src="../assets/info.png")/ {{formatterDate(item.limitDate)}} 
                        li(class="space-between")
                            div(class="updown-center")
                                img(src="../assets/identity.png")/ 状态
                            el-button(type="primary" size="small"  v-if = "item.status === 2 "  ) 我配送中
                            el-button(type="primary" size="small"  v-if = "item.status === 3 "  ) 我配送完成了
                            el-button(type="primary" size="small"  v-if = "item.status === 4 "  ) TA付款给我了   

                        //- li(class="space-between")
                        //-     div(class="updown-center")
                        //-         img(src="../assets/identity.png")/ 操作
                        //-     //- el-button(type="info" size="small"  v-if = "item.status === 2" ) 取消跑单
                        //-     el-button(type="success" size="small" @click="deleteOrder(item.orderId)" v-if = "item.status === 4" ) 删除
                            
</template>
<script>
const URL = {
    GETSESSION:'/user/getSession',
    PULLMSG:'/order/list',
    PERSONID:'/user/findByPhone/',
    DEL:'/msg/del/',
    SESSION:'/user/getSession',
    UPDATESTATUS:'/order/updateInfo/'
}
export default {
    data(){
        return {
            data:[]
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
        translateStartDate(time){
            let gap = new Date(Date.now() - time),
                min = gap.getMinutes(),
                hour = gap.getHours(),
                day = gap.getDate();
               
            if(min > 0 && hour === 0){
                return min+'分钟前'
            }else if(day>0){
                return day+'天前'
            }else{
                return hour+'小时前'
            }

        },
        formatterDate(row){
            let time = new Date(row);
            let hours = (()=>time.getHours()<10?'0'+ time.getHours():time.getHours())()
            let min = (()=> time.getMinutes()<10?'0'+ time.getMinutes():time.getMinutes())()
            let s = (()=>time.getSeconds()<10?'0'+ time.getSeconds():time.getSeconds())()
            return time.toLocaleDateString().replace(/\//ig,'-')+' '+hours+':'+min+':'+s
        },
        finishOrder(id){
            let that = this;
            that.$axios.post(URL.UPDATESTATUS+id,qs.stringfiy({
                status:4
            })).then(res=>{
                console.log(res);
                if(res.data.status === 1){
                    that.$message({
                        type:'success',
                        message:'完成配送'
                    })
                }else{
                    that.$message.error('修改文档状态失败')
                }
            })
        },
        pullMsg(){
            this.getSession().then(person=>{
                let that = this,infoCollection = [];
                
                if(person){
                  
                    let fd = that.$axios.get(URL.PULLMSG+'?receiptId='+person._id+'&receiptIdRead=0').then(order=>{//当前关于当前用户的所有订单信息
                        
                        return order.data;
                    })

                    fd.then(order=>{
                        
                        order.data.list.forEach(item=>{
                            console.log(item);
                            infoCollection.push({
                                    nickName:person.nickName,
                                    date:item.date,
                                    msg:item.description,
                                    _id:item._id,
                                    status:item.status,
                                    taskSite:item.taskSite,
                                    endSite:item.endSite,
                                    tips:item.tips,
                                    limitDate:item.limitDate,
                                    orderId:item.orderId
                            })
                        
                        })
                        
                        that.data = infoCollection;
                    
                    })

                }else{
                    alert('系统提示:\n\n您还没登录');
                }
            })
        },
        deleteOrder(id){
            let that = this;
            that.$axios.post(URL.UPDATESTATUS+id,qs.stringify({
                    receiptIdRead:1
                })).then(res=>{
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
                border-bottom: 1px dotted #e2dbdb;
                &:last-of-type{
                    border: none;
                }
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
    .updown-center{
        .flex;
        align-items: center;
    }
</style>


