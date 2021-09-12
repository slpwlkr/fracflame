import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'
import axios from 'axios'

const app = createApp(App)

const instance = axios.create({
  baseURL: 'localhost:3000',
  timeout: 3000
})

instance.interceptors.request.use(
  config => {
    console.log(config)
  }
)

app.use(router)
app.use(store, key)

app.mount('#app')
