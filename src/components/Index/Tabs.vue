<template>
   <div>
       <div class="tabs">
           <ul @click="change" id="tabsMenu">
               <li class="active" :data-url="option1">全部</li>
               <li :data-url="option2">普通</li>
               <li :data-url="option3">快递</li>
               <li :data-url="option4">外卖</li>
           </ul>
       </div>
        <div class="main">
        <div v-if="loading" style="text-align:center"><i class="el-icon-loading"></i><p>加载中...</p></div>
        <ul v-else v-for="item in fetchData" :key="item._id">
            <li @click="lookOrderDetail(item._id)">
                <div class="avatar">
                    <img :src="'http://120.77.40.82:3000'+item.selfInfo.avatarUrl" alt="用户头像加载失败" >
                </div>
                <ul>
                    <li>
                        <div>
                            {{item.selfInfo.nickName}}
                            <img v-if="item.selfInfo.gender == 2" src="../../assets/woman.png" alt="sex" >
                            <img v-else src="../../assets/man.png" alt="sex" >
                        </div>
                        <div>
                            <div class="type">{{translateType(item.type)}}</div>
                            <div class="dot" v-if="item.status !==1">详</div>
                            <div class="dot" style="background:red" v-else>抢</div>
                        </div>
                    </li>
                    <li>{{limitWord(item.description,15)}}</li>
                    <li>
                        <p style="color:#368">{{changeStatus(item.status)}}</p>
                        <div>
                            <img src="../../assets/money.png" alt="">
                            <span style="color:gold">{{item.tips}} RMB</span>
                        </div>
                        <div>
                            <img src="../../assets/clock.png" alt="">
                            <span>{{translateStartDate(item.date)}}</span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <img src="../../assets/start.png" alt="">
                            <span>{{limitWord(item.taskSite)}}</span>
                        </div>
                        <div>
                            <img src="../../assets/end.png" alt="">
                            <span>{{limitWord(item.endSite)}}</span>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
   </div>
</template>
<script>
export default {   
     data() {   //唯有在created后才能读取到里面的内容
      return {
        fetchData: '',
        cacheData:{},
        tabsMenuList:'NodeList',
        option1:'/order/list?pageSize=10&pageNum=1',
        option2:'/order/list?pageSize=10&pageNum=1&type=1000',
        option3:'/order/list?pageSize=10&pageNum=1&type=2000',
        option4:'/order/list?pageSize=10&pageNum=1&type=3000',
        firstReq:'',
        loading:true
      };
    },
    computed:{
        
    },
    methods: {
        lookOrderDetail(_id) {
            let routerData = this.fetchData.filter(item=>item._id === _id)[0]._id
            this.$router.push({
                name:'orderDetail',
                // params:{
                //     fetchData:routerData
                // }
                query:{
                    id:routerData
                }
            })
        },
        limitWord(str,len = 5){
            if(str.length >= len){
                return str.substr(0,len)+'...'
            }
            return str
            
        },
        changeStatus(status){
            switch(status){
                case 0:status = '已下架';break;
                case 1:status = '新发布';break;
                case 2:status = '已被抢';break;
                case 3:status = '已搞掂';break;
                case 4:status = '已结算';break;
                default:status = '订单状态错误';break;
            }
            return status
        },
        change(e){      //获取tabs对应得数据
            let that = this;
            if(e.target.localName ===  'li'){
                for(let num = that.tabsMenuList.length;num--;){
                    that.tabsMenuList[num].classList.remove('active');
                }
                e.target.classList.add('active');
                let url = e.target.getAttribute('data-url');
              
                if(url.indexOf('type')>0){ //如果找到了type 证明是分类查找
                    let type = /type=(\d+)/.exec(url)[1];
                    if(that.cacheData[type]){
                        that.fetchData = that.cacheData[type];
                    }else{
                        that.$axios.get(url)
                            .then(res=> {
                                let eventQuenu = [];
                                that.cacheData[type] = res.data.data.list;
                                that.cacheData[type].forEach(element => {
                                        eventQuenu.push(
                                            that.$axios.get('/user/findById/'+element.consignmentId)//找出每个订单的委托人的信息
                                            .then(res=>res.data.msg[0])
                                            .then(res=>{   //个人信息
                                                element.selfInfo = res;
                                                let avatarUrl = element.selfInfo.avatarUrl;
                                                /**头像处理 */
                                                element.selfInfo.avatarUrl = avatarUrl; //不是就是本地资源处理本地资源
                                            })
                                        )
                                        
                                    }); 
                                    
                                    Promise.all(eventQuenu).then(()=>{
                                        that.loading = false;
                                        that.fetchData = that.cacheData[type];
                                    })
                                })
                            .catch(err=>{console.log(err);that.$message.error('数据获取失败')})
                    }
                }else{              //全部订单查找
                    if(that.cacheData.all){
                        that.fetchData = that.cacheData.all;
                        return
                    }
                }
                
            }
            
        },
        translateType(type){
            switch(type){
                case 1000:type = '普通';break;
                case 2000:type = '快递';break;
                case 3000:type = '外卖';break;
                default:type = '其他';break;
            }
            return type
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
        init(){
            let that = this,eventQuenu = [];
            that.$axios.get('/order/list?pageSize=10&pageNum=1')
            .then(res=> {
                that.cacheData.all = res.data.data.list;//订单数据
                that.cacheData.all.forEach(element => {
                    eventQuenu.push(
                        that.$axios.get('/user/findById/'+element.consignmentId)//找出每个订单的委托人的信息
                        .then(res=>res.data.msg[0])
                        .then(res=>{   //个人信息
                            
                            element.selfInfo = res;

                            let avatarUrl = element.selfInfo.avatarUrl;
                            
                            element.selfInfo.avatarUrl = avatarUrl; 
                        })
                    )
                    
                }); 
                
                Promise.all(eventQuenu).then(()=>{
                    that.loading = false;
                    that.fetchData = that.cacheData.all;
                })

                // that.loading = !Boolean(Promise.resolve(fd));
            })
            .catch(err=>{console.log(err);that.$message.error('数据获取失败')})
        }

    },
    mounted(){  //挂载后才能获取元素
        this.tabsMenuList = document.querySelectorAll('#tabsMenu li');
    },
    created(){
        let that = this;
        that.init();
        that.$socket.on('newOrder',()=>{
             that.init();
        })
        
    }  

}
</script>
<style lang="less" scoped>
    .flex{
        display: flex;
    }
    .tabs{
        .flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        border-bottom:1px solid #f0f0f0;
        ul{
            list-style-type: none;
            li{ 
                float: left;
                position: relative;
                padding: .5rem 1.6rem ;
                font-size:.7rem;
                &:nth-of-type(2){
                    margin: 0rem .2rem;
                }   
            }
        }
    }
    .main{
        .flex;
        flex-flow: column nowrap;
        background: #EFEEF6;
        
        flex:1;
        ul{
            list-style-type: none;
            li{
                .flex;
                flex-flow: row nowrap;
                padding: .8rem .8rem 0rem; 
                background: #fff;
                margin-bottom: .2rem;
                .avatar{
                    width:20%;
                    height:100%;
                    img{
                        width:58px;
                        height:58px;
                        border-radius: 50%;
                    }

                }
                ul{
                    width:80%;
                    li{
                        font-size: 1rem;
                        padding: .1rem .3rem; 
                        &:nth-of-type(1){
                            .flex;
                            flex-flow: row nowrap;
                            align-items: center;
                            justify-content: space-between;
                            color:#6C6C6C;
                            div{
                                .flex;
                            }
                            .type{
                                padding: .2rem .4rem;
                                border-radius: 5px;
                                font-size: .5rem;
                                text-align: center;
                                color:#fff;
                                background: #FFA400;
                            }
                            .dot{
                                margin-left:.3rem;
                                padding: .2rem .4rem;
                                border-radius: 50%;
                                font-size: .5rem;
                                color:#fff;
                                background: #FFA400;
                            }
                        }
                        &:nth-of-type(n+2){
                            border-bottom: 1px dashed #f0f0f0;
                            padding: .2rem
                        }
                        &:nth-of-type(n+2){
                            font-size:.7rem;
                        }
                        &:last-of-type{
                            border-bottom: none;
                        }
                        &:nth-of-type(n+3){
                            .flex;
                            justify-content: space-between;
                            align-items: center;
                            div{
                                .flex;
                                align-items: center;
                            }
                        }
                        &:nth-of-type(4){
                            justify-content: flex-start;
                            div:nth-of-type(2){
                                margin-left:4rem;
                            }
                        }

                    }
                }
            }
        }
    }
    
    .active{
        color: #4CCCD9;
        border-bottom: 1px solid #4CCCD9;
    }

   

</style>

