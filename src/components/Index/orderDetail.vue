<template>
    <section>
        <div class="header">
            <div>委托详情</div>
        </div>
        <div class="main" v-if="loaded">
            <div class="selfInfo">
                <div class="img">
                    <img :src="'http://120.77.40.82:3000'+data.selfInfo.avatarUrl"/>
                </div>
                <div class="simpleInfo">
                    <ul>
                        <li class="space-between"> 
                            <div class="bold"> 佣金 
                                 <img src="../../assets/money.png" /> <span style="color:gold">{{data.tips}} 元</span>
                            </div>
                            <div class="type">{{translateType(data.type)}}</div>
                        </li>
                        <li class="updown-center local-site">
                            <img src="../../assets/local.png"/> 仲恺农业工程学院
                        </li>
                        <li class="nickName"> {{data.selfInfo.nickName}}</li>

                        <li class="nickName" style="text-align:right">发布时间: {{formatterDate(data.date)}}</li>
                    </ul>
                </div>
            </div>
            <div class="step-info " >
                <ul>
                    <li>
                        <img src="../../assets/detailInfo.png"/> 跑腿内容:
                        <span> {{data.description}}</span>
                    </li>
                    <li>  
                        <img src="../../assets/gray-car.png"/> 任务地点:
                        <span> {{data.taskSite}}</span>
                    </li>
                    <li>
                        <img src="../../assets/middle-local.png"/> 送达地点:
                        <span> {{data.endSite}}</span>
                    </li>
                    <li>
                        <img src="../../assets/gray-clock.png"/> 送达时间:
                        <span> {{formatterDate(data.limitDate)}}</span>
                    </li>
                </ul>
                <div  class="mar-top my-step" v-if="data.status!==0">
                    <el-steps :active="data.status" finish-status="success">
                        <el-step title="新发布"></el-step>
                        <el-step title="已被抢"></el-step>
                        <el-step title="已搞掂"></el-step>
                        <el-step title="已结算"></el-step>
                    </el-steps>
                </div>
            </div>
            <el-button type="success" class="mar-top" v-if="data.status === 0"> 已下架</el-button>
            <el-button type="success" class="mar-top" @click="getThisOrder(data.orderId,data.description,data.type)" v-if="data.status === 1"> 马上抢单</el-button>
        </div>
    </section>
</template>
<script>
import myStep from '@/components/Index/Step'
const URL = {
    ORDERFINDBYID:'/order/findById/',
    PERSONFINDBYID:'/user/findById/',
    UPDATESTATUS:'/order/updateInfo/'
}
export default {
    components:{
        myStep
    },
    data(){
        return {
            data:'',
            loaded:false,
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
        paddingRouterParams(){
            let id = this.$route.query.id,that = this;
            that.$axios.get(URL.ORDERFINDBYID+id)
            .then(order=>{
                let personId = order.data.msg[0].consignmentId;//委托人id
                that.$axios.get(URL.PERSONFINDBYID+personId)
                .then(res=>{ 
                    let data = order.data.msg[0]; //订单信息
                    data.selfInfo = res.data.msg[0];//委托人信息
                    let avatarUrl = res.data.msg[0].avatarUrl;
                    /**头像处理 */
                    //if(!/^http:\/\/|^https:\/\//.test(avatarUrl)){//判断是否是网络资源   /^http:|^https:(?=\/\/)/.exec(str)也可以
                        data.selfInfo.avatarUrl = avatarUrl; //不是就是本地资源处理本地资源
                    //}

                    that.data = data;
                    that.loaded = true;
                    if(order.data.msg[0].status !== 1){
                        that.disable = true;
                    }
                })
            })
        },
         formatterDate(row){
            let time = new Date(row);
            let hours = (()=>time.getHours()<10?'0'+ time.getHours():time.getHours())()
            let min = (()=> time.getMinutes()<10?'0'+ time.getMinutes():time.getMinutes())()
            let s = (()=>time.getSeconds()<10?'0'+ time.getSeconds():time.getSeconds())()
            return time.toLocaleDateString().replace(/\//ig,'-')+' '+hours+':'+min+':'+s
        },
        getThisOrder(orderId,description,type){ //告诉发单者，我要接单 ,快递类型需要主人确认
            let that = this;
            let from = sessionStorage.getItem('zhkuTip_phone');
            let fromId = sessionStorage.getItem('zhkuTip_id');
            let to = that.data.selfInfo.phone;
            if(from == to){
                that.$message.error('这是您自己的单喔,不能对其进行抢单操作')
                return 
            }

            if(type===2000){
                type='2req';
            }    

            that.$socket.emit('send_pmsg',from,to,{orderId,msg:description,msgId:Date.now()},type); //后台处理消息类型
            
            that.$socket.on('pmsg_res',res=>{
                
                if(res.flag){
                    
                    if(type === '2req' ){
                    
                        that.$message({
                            type:'success',
                            message:'已成功告知TA,您要接单,但因为是快递任务涉及手机尾号等私密信息,需要等待对方确认，请稍后',
                            duration:5000
                        })

                    }else{ //非快递业务，直接发送，直接修改订单状态

                        that.$message({
                            type:'success',
                            message:'已成功告知TA,您要接单'
                        })

                        that.$axios.post(URL.UPDATESTATUS+orderId,qs.stringify({status:2,receiptId:fromId,goOff:Date.now()}))//已被抢状态 
                        .then(res=>{
                            
                            that.paddingRouterParams(); //刷新订单情况
                        })
                        .catch(err=>{
                            
                            alert('订单状态修改失败');
                            that.paddingRouterParams();
                        })
                    }
                    
                }else{
                    that.$message.error('服务器出现错误,无法跟进您的操作')
                }
                
            });

            

            

        }
    },
    created(){ // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可  
        this.paddingRouterParams();
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
        .flex(@col);
        background: #EFEFF3;
        div{
            .only-flex;
        }
    }
    .header{
        padding: 0.5rem;
        background: #4DCADA;
        justify-content: center;
        color:#fff;
        font-size: 600;
    }
    .main{
        .flex(@col);
        padding: .5rem;
    }
    ul{
        margin-left:.3rem;
        list-style-type: none;
        .full
    }
    .mar-top{
        margin-top: 1rem;
    }
    .selfInfo{
        
        padding: .2rem;
        background: #fff;
        border-radius: 5px;
        .img{
            flex: 1;
            
            img{
                width:80%;
                height:70%;
                border-radius: 50%;
                margin:0 auto;
            }
        }
        .simpleInfo{
            flex: 2;
        }
        li{
            padding: .3rem 0rem;
        }
        
    }
    .my-step{
        .flex(@col);
        margin-left:.6rem;
      
        // align-items:center;
        font-size: .7rem;
    }
    .local-site{
        .fontsize(.2rem,#CACACA);
    }
    .bold{
        color:#000;
        font-weight: bold;
    }
    .space-between{
        .flex;
        justify-content: space-between;
    }
    .updown-center{
        .flex;
        align-items: center;
    }
    .fontsize(@rem:.6rem,@color:#fff){
        color:@color;
        font-size: @rem;
    }
    .type{
        padding: .2rem .4rem;
        border-radius: 5px;
        font-size: .5rem;
        text-align: center;
        color:#fff;
        background: #FFA400;
    }
    .nickName{
        .fontsize(.5rem,#4BCBDA);
    }
    .step-info{
        margin-top: 1rem;
        background: #fff;
        border-radius: 5px;
        .flex(@col);
        li{
            .updown-center;
            .fontsize(.8rem, #333);
            padding: .5rem 0rem;
            border-bottom: 1px solid #f0f0f0;
            &:last-of-type{
                border: none;
            }
            span{
                margin-left:.4rem;
            }
            
        }
    }
</style>


