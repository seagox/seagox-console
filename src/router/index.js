import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决报错
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        name: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/layout/login')
    },
    {
        name: 'gaugeSetting',
        path: '/gaugeSetting',
        component: () => import('@/views/sys/gauge-setting'),
        meta: {
            title: '仪表板设计'
        }
    },
    {
        name: 'doorSetting',
        path: '/doorSetting',
        component: () => import('@/views/sys/door-setting'),
        meta: {
            title: '门户设计'
        }
    },
    {
        path: '/simplifyDesign',
        name: 'simplifyDesign',
        component: () => import('@/views/simplify/simplify-design'),
        meta: {
            title: '表单设计'
        }
    },
    {
        path: '/seniorDesign',
        name: 'seniorDesign',
        component: () => import('@/views/senior/senior-design'),
        meta: {
            title: '表单设计'
        }
    },
    {
        path: '/printDesign',
        name: 'printDesign',
        component: () => import('@/views/print/print-design'),
        meta: {
            title: '打印模版'
        }
    },
    {
        path: '/flowDesigner',
        name: 'flowDesigner',
        component: () => import('@/views/flow/flow-designer'),
        meta: {
            title: '流程设计'
        }
    },
    {
        path: '/flowDisplay',
        name: 'flowDisplay',
        component: () => import('@/views/flow/flow-display'),
        meta: {
            title: '流程查看'
        }
    },
    {
        name: 'home',
        path: '/home',
        component: () => import('@/views/layout/home'),
        children: [
            {
                name: 'readme',
                path: '/readme',
                component: () => import('@/views/layout/readme'),
                meta: {
                    title: '首页'
                }
            },
            {
                name: 'company',
                path: '/company',
                component: () => import('@/views/platform/company'),
                meta: {
                    title: '单位管理'
                }
            },
            {
                name: 'businessTable',
                path: '/businessTable',
                component: () => import('@/views/platform/business-table'),
                meta: {
                    title: '数据建模'
                }
            },
            {
                name: 'businessField',
                path: '/businessField',
                component: () => import('@/views/platform/business-field'),
                meta: {
                    title: '设计表'
                }
            },
            {
                name: 'metaFunction',
                path: '/metaFunction',
                component: () => import('@/views/platform/meta-function'),
                meta: {
                    title: '元函数'
                }
            },
            {
                name: 'metaPage',
                path: '/metaPage',
                component: () => import('@/views/platform/meta-page'),
                meta: {
                    title: '元页面'
                }
            },
            {
                name: 'templateEngine',
                path: '/templateEngine',
                component: () => import('@/views/platform/template-engine'),
                meta: {
                    title: '模版引擎'
                }
            },
            {
                name: 'openApi',
                path: '/openApi',
                component: () => import('@/views/platform/open-api'),
                meta: {
                    title: 'openApi'
                }
            },
            {
                name: 'businessRule',
                path: '/businessRule',
                component: () => import('@/views/platform/business-rule'),
                meta: {
                    title: '规则脚本'
                }
            },
            {
                name: 'taskScheduler',
                path: '/taskScheduler',
                component: () => import('@/views/platform/task-scheduler'),
                meta: {
                    title: '定时任务'
                }
            },
            {
                name: 'test',
                path: '/test',
                component: () => import('@/views/platform/test'),
                meta: {
                    title: '测试页面'
                }
            },
            {
                name: 'dic',
                path: '/dic',
                component: () => import('@/views/sys/dic'),
                meta: {
                    title: '数据字典'
                }
            },
            {
                name: 'formDesign',
                path: '/formDesign',
                component: () => import('@/views/sys/form-design'),
                meta: {
                    title: '表单设计'
                }
            },
            {
                name: 'tableColumn',
                path: '/tableColumn',
                component: () => import('@/views/sys/table-column'),
                meta: {
                    title: '表格表头'
                }
            },
            {
                name: 'form',
                path: '/form',
                component: () => import('@/views/sys/form'),
                meta: {
                    title: '表单管理'
                }
            },
            {
                name: 'addForm',
                path: '/addForm',
                component: () => import('@/views/sys/add-form'),
                meta: {
                    keepAlive: true,
                    title: '添加表单'
                }
            },
            {
                name: 'editForm',
                path: '/editForm',
                component: () => import('@/views/sys/edit-form'),
                meta: {
                    keepAlive: true,
                    title: '编辑表单'
                }
            },
            {
                name: 'gauge',
                path: '/gauge',
                component: () => import('@/views/sys/gauge'),
                meta: {
                    title: '仪表板'
                }
            },
            {
                name: 'door',
                path: '/door',
                component: () => import('@/views/sys/door'),
                meta: {
                    title: '门户管理'
                }
            },
            {
                name: 'menu',
                path: '/menu',
                component: () => import('@/views/sys/menu'),
                meta: {
                    title: '权限管理'
                }
            },
            {
                name: 'log',
                path: '/log',
                component: () => import('@/views/sys/log'),
                meta: {
                    title: '操作日记'
                }
            },
            {
                name: 'print',
                path: '/print',
                component: () => import('@/views/sys/print'),
                meta: {
                    title: '打印模版'
                }
            },
            {
                name: 'flowDefinition',
                path: '/flowDefinition',
                component: () => import('@/views/sys/flow-definition'),
                meta: {
                    title: '流程定义'
                }
            },
            {
                name: 'report',
                path: '/report',
                component: () => import('@/views/sys/report'),
                meta: {
                    title: '报表管理'
                }
            },
            {
                name: 'addReport',
                path: '/addReport',
                component: () => import('@/views/sys/add-report'),
                meta: {
                    title: '添加报表'
                }
            },
            {
                name: 'editReport',
                path: '/editReport',
                component: () => import('@/views/sys/edit-report'),
                meta: {
                    title: '编辑报表'
                }
            },
            {
                name: 'inform',
                path: '/inform',
                component: () => import('@/views/sys/inform'),
                meta: {
                    title: '报告模板'
                }
            },
            {
                name: 'import',
                path: '/import',
                component: () => import('@/views/sys/import'),
                meta: {
                    title: '导入配置'
                }
            },
            {
                name: 'runCode',
                path: '/runCode',
                component: () => import('@/views/layout/run-code'),
                meta: {
                    keepAlive: true
                }
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    //base: 'console',
    routes
})

router.beforeEach((to, from, next) => {
    if (window.platform) {
        document.title = window.platform.title
    } else {
        document.title = localStorage.getItem('title')
    }
    var authorization = localStorage.getItem('Authorization')
    if (authorization) {
        next()
    } else {
        if (to.path === '/' || to.path === '/login') {
            next()
        } else {
            next('/login')
        }
    }
})

Vue.prototype.$history = router
export default router
