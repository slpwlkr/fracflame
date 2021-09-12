import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'
import axios from 'axios'

const app = createApp(App)

axios.defaults.baseURL = 'http://localhost:3000'

app.use(router)
app.use(store, key)

app.mount('#app')
