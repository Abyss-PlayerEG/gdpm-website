import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { banner } from './utils/banner'
import './style.css'

console.log(
  `%c${banner}`,
  'color: #478CBF; font-family: monospace; font-size: 11px; line-height: 1.4;'
)
console.log(
  '%c🚀 Interested in contributing? Check out our GitHub repo!',
  'color: #48BB78; font-weight: bold; font-size: 13px;'
)

createApp(App).use(router).use(i18n).mount('#app')
