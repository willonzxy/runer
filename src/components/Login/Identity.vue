<template lang="pug">
    section
        div(class="header") 填写跑腿认证资料
        div(class="selfInfo")
            div(class="space-between" style="border-bottom:1px solid #f0f0f0") 
                div(style="flex:1")
                    img(:src=" 'http://120.77.40.82:3000' +avatarUrl" style="width:70%;height:70%;margin:auto")/
                ul(style="flex:3") 
                    li(class="space-between" style="min-height:3rem")
                        div(class="updown-center")
                            img(src="../../assets/man.png" v-if="gender === 1 ")/
                            img(src="../../assets/woman.png" v-else)
                            span(class="bold") {{nickName}}
                        el-button(v-if=" flag === 'none' " @click="updateInfo") 修改
                    li(class="updown-center" style="padding:.5rem 0rem")
                        img(src="../../assets/phone.png")/
                        span(style="margin-left:.3rem;color:green" v-if=" flag === 'canDo' ") 已绑定
                        span(style="margin-left:.3rem" v-if=" flag === 'none' ") 没绑定
                        span(style="margin-left:.3rem;color:gold" v-if=" flag === 'audit' ") 审核中
            div(style="padding:1rem 0rem") 绑定学校: 
                span(style="margin-left:1.5rem") 仲恺农业工程学院

        div(class="insert" v-if=" flag === 'none' ")
            div(class="alert updown-center") 
                div(class="alert-dot")
                span 请绑定您的基本信息
            ul
                li(class="space-between")
                    div(class="label")
                        span 学号:
                    div(class="insert-input")
                        input(type="number" placeholder="学号" v-model="form.identityCode")
                li(class="space-between")
                    div(class="label")
                        span 学生证:
                    div(class="insert-input")
                        input(type="file" id="uploadImg" @change="show") 
                li(class="space-between" v-if="imageUrl")
                    div(class="insert-input" )
                        div(class="upload")
                            img(src="../../assets/plus.png" v-if="!imageUrl")
                            img(:src="imageUrl" v-else)
                       
        el-button(type="success" class="bottom-button bold" @click="submit" :disabled="disabled" v-if="flag === 'none' ") 提交
</template>
<script>
  const URL = {
      AUDIT:'/user/completeInfo/',
      FINDPERSON:'/user/findByPhone/'
  }
  export default {
    data() {
      return {
        imageUrl: '',
        labelPosition:'left',
        id:'',
        flag:'',
        nickName:'',
        gender:'',
        avatarUrl:'',
        disabled:false,
        form:{
            identityCode:''
        }
      }
    },
    methods: {
        updateInfo(){
            this.$router.push({
                name:'updateInfo'
            })
        },
        submit(){
                let formData = new FormData(),that = this,
                    img = document.getElementById('uploadImg').files[0];
                    if(!that.form.identityCode ){
                        that.$message.error('请填写学号')
                        return
                    }else if(!img){
                        that.$message.error('请上传学生证')
                        return
                    }else if(! /\b\d{12}\b/.test(that.form.identityCode)){
                        that.$message.error('请输入12位的学号')
                        return
                    }
                    that.disabled = true;
                    formData.append('identityCode',that.form.identityCode);
                    formData.append('identityUrl',img);
                    
                    that.$axios.post(URL.AUDIT+that.id,formData) //提交验证信息

                    .then(res=>{
                        
                        if(res.data.status===1){  // 提交成功后需要告知管理员

                            that.$message({
                                type:'success',
                                message:res.data.msg
                            })

                            that.$socket.emit('tell_to_gm_audit',sessionStorage.getItem('zhkuTip_phone'),'13189679384',{msg:'',msgId:Date.now()}); //告知管理员要审核
                            
                            that.$router.pop(); // 成功返回上一页

                        }else{
                            that.$message.error(res.data.msg)
                            that.disabled = false
                        }
                        
                    })
        },
        show(){
            let img = document.getElementById('uploadImg').files[0],that = this;
            
            if(img){
                
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
        let that = this,phone = sessionStorage.getItem('zhkuTip_phone');
        that.$axios.get(URL.FINDPERSON+phone).then(res=>{
            let data = res.data;
            if(data.status === 1 ){
                let msg = data.msg[0];
                that.id = msg._id;
                that.flag = msg.flag;
                that.nickName = msg.nickName;
                that.avatarUrl = msg.avatarUrl;
                that.gender = msg.gender;
            }else{
                that.$router.push({
                    name:'login'
                })
            }
        })
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
            input[type=number]{
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



