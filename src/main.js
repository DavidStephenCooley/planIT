import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory }from 'vue-router';
import routes from './router/routes';

let router = createRouter({
    history: createWebHistory(),
    routes: routes
});

let app = createApp(App)
app.use(router);
app.mount('#app')
