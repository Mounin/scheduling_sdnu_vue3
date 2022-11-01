import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

import ElementPlus from 'element-plus'
const app = createApp(App)


// app.use(async (ctx, next) => {
//     ctx.set("Access-Control-Allow-Origin", '*')
//     ctx.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
//     ctx.set("Access-Control-Allow-Headers", "X-Requested-With,Content-Type")
// })

app.use(router)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })

app.mount('#app')
