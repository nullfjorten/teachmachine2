//import { createApp } from 'vue/dist/vue.esm-bundler'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
// import OgAa from '@/components/OgAa.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')

// app.component('og-aa', OgAa)