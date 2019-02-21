import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Home from '@/components/Home'
import Login from '@/components/Login'
import OrderDetail from '@/components/Index/orderDetail'
import Msg from '@/components/Msg'
import OrderList from '@/components/Order'
import ReceiptList from '@/components/Receipt'
import AddOrder from '@/components/AddOrder'
import Register from '@/components/Login/Register'
import Identity from '@/components/Login/Identity'
import UpdateInfo from '@/components/Login/UpdateInfo'
import Chat from '@/components/Chat'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'index', component: Index },
    { path: '/home', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    { path: '/orderDetail', name: 'orderDetail', component: OrderDetail },
    { path: '/msg', name: 'msg', component: Msg },
    { path: '/orderlist', name: 'orderList', component: OrderList },
    { path: '/receiptlist', name: 'receiptList', component: ReceiptList },
    { path: '/addorder', name: 'addOrder', component: AddOrder },
    { path: '/register', name: 'register', component: Register },
    { path: '/identity', name: 'identity', component: Identity },
    { path: '/updateinfo', name: 'updateInfo', component: UpdateInfo },
    { path: '/chat', name: 'chat', component: Chat }
  ]
})
