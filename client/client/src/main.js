import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive, { darkTheme } from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import {router} from './common/router'
import { createPinia } from 'pinia'
import { AdminStore } from './stores/AdminStore'
import axios from 'axios'
import './views/css/dark.css'

axios.defaults.baseURL = 'http://localhost:8080';
//引入独立api
const {message,notification,dialog} = createDiscreteApi(['message','dialog','notification'])


const app = createApp(App)
app.provide('axios', axios)
app.provide('message', message)
app.provide('notification', notification)
app.provide('dialog', dialog)
app.provide('server_url',axios.defaults.baseURL)

app.use(naive)
app.use(router)
app.use(createPinia());

const adminStore = AdminStore();

app.use(axios)
//使用拦截器 为操作加上token验证
axios.interceptors.request.use((config)=>{
    config.headers.token = adminStore.token;
    return config
})


app.mount('#app')
