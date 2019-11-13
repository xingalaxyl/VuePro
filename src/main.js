import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入base.css
import '@/assets/css/base.css'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import '@/utils/ax.js'
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
