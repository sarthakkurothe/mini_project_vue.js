import { createRouter, createWebHistory } from 'vue-router'
import UserList from '../views/UserList.vue'
import UserForm from '../views/UserForm.vue'
import PaymentList from '../views/PaymentList.vue'
import PaymentDetail from '../views/PaymentDetail.vue'
import PaymentForm from '../views/PaymentForm.vue'

const routes = [
  { path: '/', redirect: '/users' },
  { path: '/users', component: UserList },
  { path: '/users/new', component: UserForm },
  { path: '/payments', component: PaymentList },
  { path: '/payments/:id', component: PaymentDetail, props: true },
  { path: '/payments/new', component: PaymentForm },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
