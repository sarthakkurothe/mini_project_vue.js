import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import UserList from '../views/users/UserList.vue';
import UserForm from '../views/users/UserForm.vue';
import PortfolioList from '../views/Portfolio/PortfolioList.vue';
import PortfolioDetail from '../views/Portfolio/PortfolioDetail.vue';
import PortfolioForm from '../views/Portfolio/PortfolioForm.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/users', name: 'Clients', component: UserList },
  { path: '/users/add', name: 'AddClient', component: UserForm },

  { path: '/portfolios', name: 'Portfolios', component: PortfolioList },
  { path: '/portfolios/add', name: 'AddPortfolio', component: PortfolioForm },
  { path: '/portfolios/:id', name: 'PortfolioDetail', component: PortfolioDetail, props: true },
  { path: '/portfolios/:id/edit', name: 'EditPortfolio', component: PortfolioForm, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
