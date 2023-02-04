import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/plugins/axios'
import '@/plugins/permission'
import '@/css/main.css'

import echarts from '@/utils/echarts'
Vue.prototype.$echarts = echarts

import template from '@/utils/art-template'
Vue.prototype.$template = template

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

import uploader from 'vue-simple-uploader'
Vue.use(uploader)

import { BigNumber } from 'bignumber.js'
Vue.prototype.$BigNumber = BigNumber

import editor from '@/views/components/quill/editor'
import TableColumn from '@/views/components/form/table-column'
import AddSimplifyForm from '@/views/form/add-simplify-form'
import EditSimplifyForm from '@/views/form/edit-simplify-form'
import SimplifyForm from '@/views/simplify/simplify-form'

Vue.component('editor', editor)
Vue.component('TableColumn', TableColumn)
Vue.component('AddSimplifyForm', AddSimplifyForm)
Vue.component('EditSimplifyForm', EditSimplifyForm)
Vue.component('SimplifyForm', SimplifyForm)

import SeniorForm from '@/views/senior/senior-form'
import PrintForm from '@/views/print/print-form'

Vue.component('SeniorForm', SeniorForm)
Vue.component('PrintForm', PrintForm)

import ExcelMember from '@/views/components/form/member'
Vue.component('ExcelMember', ExcelMember)

import ElementUI from 'element-ui'
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$store = store
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
