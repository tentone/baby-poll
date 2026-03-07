import './main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router.js'
import { v4 as uuidv4 } from 'uuid';

const clientId = localStorage.getItem("clientId");
if (!clientId) {
    localStorage.setItem("clientId", uuidv4());
}

const app = createApp(App)
app.use(router)
app.mount('#app')
