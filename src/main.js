// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* 基础组件 */
import Vue from 'vue'
import App from './App'
import router from './router'

/* vue-socket.io 通信组件 */
import VueSocketio from 'vue-socket.io'

/* element 组件 */
import { Carousel, CarouselItem, Message, Steps, Button, Step, Form, FormItem, Input, Radio, Select, Option, InputNumber, Dialog, Upload, Notification } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

/** axios 组件 以及全局默认post header */
import axios from 'axios'

/** qs跨域避开信使组件 withCredentials添加跨域凭证 使跨域请求可以带上cookie */
import qs from 'qs'
import md5 from 'js-md5'
window.qs = qs
window.md5 = md5
// axios.defaults.baseURL = 'http://192.168.90.21:3001'
// axios.defaults.baseURL = 'http://localhost:3001'
// axios.defaults.withCredentials = true

Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Select)
Vue.use(Option)
Vue.use(InputNumber)
Vue.use(Dialog)
Vue.use(Upload)
Vue.component(Notification.name, Notification)
Vue.component(Message.name, Message)
Vue.prototype.$message = Message
Vue.prototype.$axios = axios
Vue.prototype.$notify = Notification
Vue.use(VueSocketio, 'http://120.77.40.82:3000')
// Vue.use(VueSocketio, 'http://localhost:3001')
Vue.config.productionTip = false

let eventHub = new Vue()

window.eventHub = eventHub

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
