<template lang="pug">
    section
        div(class="header") 修改个人资料
        
        div(class="selfInfo")
            div(class="space-between" ) 
                div(style="flex:1")
                    img(:src="'http://120.77.40.82:3000'+ avatarUrl" style="width:70%;height:70%;margin:auto")/
                ul(style="flex:3") 
                    li(class="space-between" style="min-height:3rem")
                        div(class="updown-center")
                            img(src="../../assets/man.png" v-if="gender === 1 ")/
                            img(src="../../assets/woman.png" v-else)
                            span(class="bold") {{nickname}}
        div(class="insert")
            div(class="alert updown-center") 
                div(class="alert-dot")
                span 请输入您想修改的信息

            ul
                li(class="space-between")
                    div(class="label")
                        span 昵称:
                    div(class="insert-input")
                        input(type="text" placeholder="昵称" v-model="form.nickname")
                li(class="space-between")
                    div(class="label")
                        span 性别:
                    div(class="insert-input")
                        el-radio(v-model="form.gender" label = '1') 男
                        el-radio(v-model="form.gender" label = '2') 女
                li(class="space-between")
                    div(class="label")
                        span 头像:
                    div(class="insert-input")
                        input(type="file" id="uploadImg" @change="show") 
                li(class="space-between" v-if="imageUrl")
                    div(class="insert-input" )
                        div(class="upload")
                            img(src="../../assets/plus.png" v-if="!imageUrl")
                            img(:src="imageUrl" v-else)
                        //- input(type="file")
        el-button(type="success" class="bottom-button bold" @click="submit" ) 提交
</template>
<script>
  const URL = {
      UPDATE:'/user/updateInfo/',
      FINDPERSON:'/user/findByPhone/'
  }
  export default {
    data() {
      return {
        imageUrl: '',
        labelPosition:'left',
        id:'',
        flag:'',
        nickname:'',
        gender:'',
        avatarUrl:'',
        form:{
            nickname:'',
            gender:''
        }
      }
    },
    methods: {
        init(){
            let that = this,phone = sessionStorage.getItem('zhkuTip_phone');
            that.$axios.get(URL.FINDPERSON+phone).then(res=>{
                let data = res.data;
                if(data.status === 1 ){
                    let msg = data.msg[0];
                    that.id = msg._id;
                    that.flag = msg.flag;
                    that.nickname = msg.nickName;
                    that.avatarUrl = msg.avatarUrl;
                    that.gender = msg.gender;
                    that.form.gender = msg.gender+'';
                }else{
                    that.$router.push({
                        name:'login'
                    })
                }
            })
        },
        submit(){
                let formData = new FormData(),that = this,
                    img = document.getElementById('uploadImg').files[0];
                    if(!that.form.nickname ){
                        that.form.nickname = that.nickname;
                    }else if(that.form.nickname.length >= 7){
                        that.$message.error('昵称最大长度为7')
                        return
                    }
                    
                    formData.append('nickname',that.form.nickname);
                    formData.append('gender',+that.form.gender);
                            
                    img?formData.append('identityUrl',img):''; //可以不添加照片
                    
                    that.$axios.post(URL.UPDATE+that.id,formData) // 提交修改信息

                    .then(res=>{
                        
                        if(res.data.status===1){ 

                            that.$message({
                                type:'success',
                                message:res.data.msg
                            })

                            that.init();

                        }else{
                            that.$message.error(res.data.msg)
                           
                        }
                        
                    })
        },
        show(){
            let img = document.getElementById('uploadImg').files[0],that = this;
            
            if(img.type){
                
                if(img.type !== 'image/png' && img.type !== 'image/jpeg'){
                    that.$message.error('仅支持png、jpg的图片格式')
                    that.disabled = true;
                    return;
                }

                if(img.size / 1024 /1024 > 2){
                    that.$message.error('请上传2M或以下的图片')
                    that.disabled = true;
                    return;
                }

                try{
                    that.imageUrl = URL.createObjectURL(img) 
                }catch(err){
                    console.log(err);
                    that.imageUrl = webkitURL.createObjectURL(img)
                }

                that.disabled = false;
                
            }else{
                that.imageUrl = '';

            }
            
        }

    },
    created(){
        this.init();
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
        color:#BCBCBC;
        div{
            .only-flex;
        }
    }
    ul{
        margin-left:.3rem;
        list-style-type: none;
        .full
    }
    .header{
            padding: 0.5rem;
            justify-content: center;
            background: #4DCADA;
            color:#fff;
            font-size: 600;
    }
    .selfInfo{
        .flex(@col);
        margin-bottom: 1rem;
        padding: 1rem;
        background: #fff;
        border-bottom:1px solid #D4D4D5;
    }
    .insert{
        padding: 1rem;
        .flex(@col);
        background: #fff;
        border-top:1px solid #D4D4D5;
        border-bottom:1px solid #D4D4D5;
        .alert{
            .flex();
            .bold;
            color:#DB7A3A;
            .alert-dot{
                width:.3rem;
                height:.9rem;
                margin-right: .3rem;
                background: #FF4200;

            }
        }
        li{
            padding: 1.3rem 0rem 1rem;
            border-bottom: 1px solid #efefef;
            &:last-of-type{
                border: none;
            }
            input{
                .full;
                outline: none;
                border:none;
                font-size:1rem;
            }
            span{
                .bold;
            }
            .label{
                flex: 1;
            }
            .insert-input{
                flex:3;
            }
            .upload{
                border-radius: .1rem;
                overflow: hidden;
                .flex();
                justify-content: center;
                img{
                    width:100%;
                    height:9rem;
                }
            }
        }
    }
    .mar-top{
            margin-top: .6rem;
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
    .bottom-button{
        position: fixed;
        bottom: 0;
        width: 100%;
        border-radius: 0px;
        border: 0px;
        background: #fff;
        color:#4DCADA;
    }
</style>



