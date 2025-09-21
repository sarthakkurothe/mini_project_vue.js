import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { MotionPlugin } from '@vueuse/motion'; // make sure this package is installed
import './style.css'; // tailwind / css

const app = createApp(App);

app.use(router);
app.use(MotionPlugin); // register v-motion directive

app.mount('#app');
