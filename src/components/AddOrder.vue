<template>
<section>
     <div class="header">发布跑腿信息</div>
     <el-form :label-position="labelPosition" label-width="80px"  class="mar-top">
            <el-form-item label="委托类型">
                <el-select v-model="formData.type" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="出发点">
                <el-input v-model="formData.taskSite" placeholder="请输入"  clearable></el-input>
            </el-form-item>

            <el-form-item label="送到">
                <el-input v-model="formData.endSite" placeholder="目的地"  clearable></el-input>
            </el-form-item>

            <el-form-item label="简要描述">
                <el-input v-model="formData.description" placeholder="请输入"  clearable></el-input>
            </el-form-item>

            <el-form-item label="佣金(元)">
                  <el-input-number v-model="formData.tips" :min="1" :max="20"></el-input-number>
            </el-form-item>
             <el-form-item label="送达时间">
                <el-select v-model="formData.limitDate" placeholder="请选择">
                    <el-option
                    v-for="item in timeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item style="text-align:right">
                <el-button type="primary" icon="el-icon-upload" @click="submit" >提交</el-button>
            </el-form-item>

    </el-form>
</section>
 
</template>
<script>
const URL = {
    ORDERADD:'/order/add',
    SESSION:'/user/getSession'
}
export default {
  data(){
      return {
        imageUrl: '',
        labelPosition:'left',
        choosed:true,
        formData:{
            tips:'',
            limitDate:'',
            description:'',
            type:'',
            taskSite:'', //与label 对应表示哪一个被选中
            endSite:''
        },
        options: [{
          value: 1000,
          label: '普通'
        }, {
          value: 2000,
          label: '快递'
        }, {
          value: 3000,
          label: '外卖'
        }],
        timeList: [{
          value: 0.25,
          label: '15分钟'
        }, {
          value: 0.5,
          label: '半小时'
        }, {
          value: 1,
          label: '1小时'
        },
        {
          value: 3,
          label: '2小时'
        },
         {
          value: 6,
          label: '6小时'
        },
        {
          value: 24,
          label: '当天'
        }
        ]
      };
  },
  methods:{
      submit(){
          let that = this;
          that.formData.limitDate = Date.now()+1000*60*60*that.formData.limitDate;
          that.formData.consignmentId = sessionStorage.getItem('zhkuTip_id');
          if(that.formData.taskSite.length === 0 && that.formData.taskSite.length>=15){
              that.$message.error('任务点的描述应该少于15字且不能为空')
              return
          }
          if(that.formData.endSite.length === 0 && that.formData.endSite.length>=15){
              that.$message.error('收货地点的描述应该少于15字且不能为空')
              return
          }
          if(that.formData.description.length === 0 && that.formData.description.length>=25){
              that.$message.error('简要的描述应该少于25字且不能为空')
              return
          }
          that.$axios.post(URL.ORDERADD,qs.stringify(that.formData))
          .then(res=>{
              console.log(res);
              if(res.data.status === 1){
                  that.$router.push({
                      name:'index'
                  })
              }
          })
      }
  },
  created(){
      this.$axios.get(URL.SESSION)
      .then(res=>{
          if(res.data.status!==1){
              this.$router.push({
                  name:'login'
              })
          }
      })
  }
}
</script>
<style lang="less" scoped>
    section{
        .header{
            padding: 0.5rem;
            text-align: center;
            background: #4DCADA;
            color:#fff;
            font-size: 600;
        }
        .mar-top{
            margin-top: .6rem;
        }
        .el-form{
            padding: 0rem 1rem;
        }
    }
    
</style>

