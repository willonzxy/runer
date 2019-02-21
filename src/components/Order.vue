<template lang="pug">
    section
        div(class="header") 我发布的
        div(class="box" v-for="(item,index) in data" :key="index")
            div(class="msg-info" )
                div(class="img")
                    img(:src="'http://120.77.40.82:3000'+item.avatarUrl")
                div(class="msg-detail")
                    ul
                        li(class="space-between")
                            span(class="bold") {{index+1}}.
                            span(class="time") {{translateStartDate(item.date)}}
                        li(class="updown-center")
                            div(class="type") {{translateType(item.type)}}
                        li(class="updown-center")
                            img(src="../assets/start.png")/ {{item.taskSite}} 
                        li(class="updown-center")
                            img(src="../assets/end.png")/ {{item.endSite}}
                        li(class="updown-center")
                            img(src="../assets/money.png")/ {{item.tips}} 元
                        li(class="updown-center")
                            img(src="../assets/info.png")/ {{item.msg}} 
                        li(class="updown-center")
                            img(src="../assets/identity.png")/ {{item.receiptName}} TA帮您配送
                        li(class="updown-center")
                            img(src="../assets/phone.png")/ 联系电话 {{item.receiptPhone}} 
                        li(class="space-between")
                            div(class="updown-center")
                                img(src="../assets/identity.png")/ 状态    
                            el-button(type="info" size="small"  v-if = "item.status === 0" )  已下架 
                            el-button(type="primary" size="small"  v-if = "item.status === 1" )  新发布
                            el-button(type="primary" size="small"  v-if = "item.status === 2 "  ) TA配送中
                            el-button(type="primary" size="small"  v-if = "item.status === 3 "  ) 我已收到
                            el-button(type="primary" size="small"  v-if = "item.status === 4 "  ) 我已给TA付款
                        li(class="space-between")
                            div(class="updown-center")
                                img(src="../assets/identity.png")/ 操作    
                            el-button(type="info" size="small" @click="soldOut(item.orderId)" v-if = "item.status === 1" ) 下架
                            el-button(type="success" size="small" @click="finishOrder(item.orderId)"  v-if=" item.status ===  2 " ) 我已收到
                            el-button(type="success" size="small" @click="finishPay(item.orderId)"  v-if=" item.status ===  3 && paied === false" ) 给TA结算
                            el-button(type="success" size="small" @click=""  v-if=" item.status ===  4" ) 给TA评价
                            //- el-button(type="primary" @click="finishPay" v-if="paied === true") 确认已转
                            //- el-button(type="warning" size="small" @click="deleteOrder(item.orderId)" v-if="item.status === 4") 删除
        //- el-dialog(title="收款二维码" :visible.sync="dialogVisible" width="90%"  )
        //-     span 请先扫码后按确认
        //-     span /诚信消费
        //-     img(src="../assets/receiptUrl.jpg" class="img-big" alt="收款二维码加载失败" :onerror = " canLook = false")
        //-     span(slot="footer" class="dialog-footer" style="text-align:center")
                
</template>
<script>
const URL = {
    GETSESSION:'/user/getSession',
    PULLMSG:'/order/list',
    PERSONID:'/user/findByPhone/',
    PERSON:'/user/findById/',
    DEL:'/msg/del/',
    SESSION:'/user/getSession',
    UPDATESTATUS:'/order/updateInfo/',
}
export default {
    data(){
        return {
            dialogVisible:false,
            canLook:true,
            data:[],
            paied:false
        }
    },
    methods:{
        translateType(type){
            switch(type){
                case 1000:type = '普通';break;
                case 2000:type = '快递';break;
                case 3000:type = '外卖';break;
                default:type = '其他';break;
            }
            return type
        },
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
        soldOut(id){
            let that = this;
            that.$axios.post(URL.UPDATESTATUS+id,qs.stringify({
                status:0
            })).then(res=>{
                if(res.data.status === 1){
                    that.$message({
                        type:'success',
                        message:'已下架'
                    })
                    that.pullMsg();
                }else{
                    that.$message.error('修改文档状态失败')
                    that.pullMsg();
                }
            })
        },
        finishOrder(id){
            let that = this;
            that.$axios.post(URL.UPDATESTATUS+id,qs.stringify({
                status:3
            })).then(res=>{
               
                if(res.data.status === 1){
                    that.$message({
                        type:'success',
                        message:'完成配送'
                    })
                    
                    that.pullMsg();
                }else{
                    that.$message.error('修改文档状态失败')
                    that.pullMsg();
                }
            })
        },
        payOrder(id){
            let that = this;
            //that.dialogVisible = true; //弹出二维码
            
        },
        finishPay(id){
            
            let that = this;
            that.$axios.post(URL.UPDATESTATUS+id,qs.stringify({
                status:4
            })).then(res=>{
               
                if(res.data.status === 1){
                    that.$message({
                        type:'success',
                        message:'已给TA结算'
                    })
                    that.paied = true;
                    //that.dialogVisible = false;
                    that.pullMsg();
                }else{
                    that.$message.error('修改文档状态失败')
                    that.pullMsg();
                }
            })
        },
        pullMsg(){
            let that = this,infoCollection = [],infoQ = [];
            that.getSession().then(person=>{
                
                
                if(person){
                  
                    let fd = that.$axios.get(URL.PULLMSG+'?consignmentId='+person._id+'&consignmentIdRead=0').then(order=>{//当前关于当前用户的所有订单信息
                        
                        return order.data;
                    })

                    fd.then(order=>{
                        
                        order.data.list.forEach(item=>{
                            infoQ.push(
                                that.$axios.get(URL.PERSON+item.consignmentId)
                                .then(receipt=>{
                                
                                    receipt = receipt.data.msg[0];
                                   // console.log(receiptUrl);
                                    /**头像处理 */
                                    // if(!/^http:\/\/|^https:\/\//.test(receiptUrl)){//判断是否是网络资源   /^http:|^https:(?=\/\/)/.exec(str)也可以
                                    //     receiptUrl = require(receiptUrl); //不是就是本地资源处理本地资源
                                    // }
                                     infoCollection.push({
                                        nickName:person.nickName,
                                        date:item.date,
                                        msg:item.description,
                                        _id:item._id,
                                        status:item.status,
                                        avatarUrl:person.avatarUrl,
                                        orderId:item.orderId,
                                        taskSite:item.taskSite,
                                        endSite:item.endSite,
                                        tips:item.tips,
                                        type:item.type,
                                        receiptName:receipt.nickName,
                                        receiptPhone:receipt.phone
                                        //receiptUrl:receiptUrl
                                    })
                                })
                           )
                            
                        })
                        
                        Promise.all(infoQ).then(()=>{
                            that.data = infoCollection;
                        })
                        
                    
                    })

                }else{
                    that.$message.error('您还没登录');
                }
            })
        },
        deleteOrder(id){
            let that = this;
            that.$axios.post(URL.UPDATESTATUS+id,qs.stringify({
                    consignmentIdRead:1
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
    .flex-end{
        .flex;
        justify-content: flex-end;
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
        .fontsize(.7rem,#4BCBDA);
    }
    .updown-center{
        .flex;
        align-items: center;
    }
    .type{
        padding: .2rem .4rem;
        border-radius: 5px;
        font-size: .8rem;
        text-align: center;
        color:#fff;
        background: #FFA400;
    }
    @width:100%;
    .el-dialog{
        .img-big{
            width: 80%;
            height:80%;
            
        }
        img{
            width: @width;
            height:@width;
            
        }
    }
    .el-dialog__body{
        text-align: center !important;
    }
    .el-dialog__footer{
        text-align: center !important;
    }
</style>


