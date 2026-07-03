import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { useBanner } from './composables/useBanner'
import './style.css'

// Print banner (language-aware)
useBanner()

createApp(App)
    .use(router)
    .use(i18n)
    .mount('#app')
