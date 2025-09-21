import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { MotionPlugin } from '@vueuse/motion';
import './style.css';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(MotionPlugin);

app.mount('#app');
