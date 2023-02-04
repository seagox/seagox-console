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
        path: '/editor',
        name: 'editor',
        component: () => import('@/views/disk/editor')
    },
    {
        path: '/markdown',
        name: 'markdown',
        component: () => import('@/views/disk/markdown')
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
        path: '/rtc',
        name: 'rtc',
        component: () => import('@/views/layout/rtc'),
        meta: {
            title: '音视频'
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
                name: 'platform',
                path: '/platform',
                component: () => import('@/views/layout/platform'),
                meta: {
                    title: '平台配置'
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
                name: 'procedure',
                path: '/procedure',
                component: () => import('@/views/platform/procedure'),
                meta: {
                    title: '存储过程'
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
                name: 'sys',
                path: '/sys',
                component: () => import('@/views/layout/sys-application'),
                meta: {
                    title: '系统配置'
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
            },
            {
                name: 'contact',
                path: '/contact',
                component: () => import('@/views/system/contact'),
                meta: {
                    title: '通讯录'
                }
            },
            {
                name: 'departmentManager',
                path: '/departmentManager',
                component: () => import('@/views/system/department'),
                meta: {
                    title: '部门管理'
                }
            },
            {
                name: 'roleManager',
                path: '/roleManager',
                component: () => import('@/views/system/role'),
                meta: {
                    title: '角色管理'
                }
            },
            {
                name: 'userManager',
                path: '/userManager',
                component: () => import('@/views/system/user'),
                meta: {
                    title: '用户管理'
                }
            },
            {
                name: 'publicNotice',
                path: '/publicNotice',
                component: () => import('@/views/system/public-notice'),
                meta: {
                    keepAlive: true,
                    title: '发布公告'
                }
            },
            {
                name: 'showNotice',
                path: '/showNotice',
                component: () => import('@/views/system/show-notice'),
                meta: {
                    keepAlive: true,
                    title: '消息详情'
                }
            },
            {
                name: 'managementNotice',
                path: '/managementNotice',
                component: () => import('@/views/system/management-notice'),
                meta: {
                    title: '通知管理'
                }
            },
            {
                name: 'message',
                path: '/message',
                component: () => import('@/views/system/message'),
                meta: {
                    title: '消息中心'
                }
            },
            {
                name: 'addCustomForm',
                path: '/addCustomForm',
                component: () => import('@/views/form/add-custom-form'),
                meta: {
                    keepAlive: true
                }
            },
            {
                name: 'editCustomForm',
                path: '/editCustomForm',
                component: () => import('@/views/form/edit-custom-form'),
                meta: {}
            },
            {
                name: 'handleCustomForm',
                path: '/handleCustomForm',
                component: () => import('@/views/form/handle-custom-form'),
                meta: {
                    keepAlive: true
                }
            },
            {
                name: 'formList',
                path: '/formList',
                component: () => import('@/views/form/form-list'),
                meta: {
                    keepAlive: true
                }
            },
            {
                name: 'reportList',
                path: '/reportList',
                component: () => import('@/views/form/report-list'),
                meta: {
                    keepAlive: true
                }
            },
            {
                name: 'analysis',
                path: '/analysis',
                component: () => import('@/views/form/analysis'),
                meta: {
                    keepAlive: true
                }
            },
            {
                name: 'file',
                path: '/file',
                component: () => import('@/views/disk/file-manager'),
                meta: {
                    keepAlive: true,
                    title: '文件库'
                }
            },
            {
                name: 'todoItem',
                path: '/todoItem',
                component: () => import('@/views/work/todo-item'),
                meta: {
                    keepAlive: true,
                    title: '待办事项'
                }
            },
            {
                name: 'readyItem',
                path: '/readyItem',
                component: () => import('@/views/work/ready-item'),
                meta: {
                    keepAlive: true,
                    title: '待发事项'
                }
            },
            {
                name: 'doneItem',
                path: '/doneItem',
                component: () => import('@/views/work/done-item'),
                meta: {
                    keepAlive: true,
                    title: '已办事项'
                }
            },
            {
                name: 'copyItem',
                path: '/copyItem',
                component: () => import('@/views/work/copy-item'),
                meta: {
                    keepAlive: true,
                    title: '抄送事项'
                }
            },
            {
                name: 'selfItem',
                path: '/selfItem',
                component: () => import('@/views/work/self-item'),
                meta: {
                    keepAlive: true,
                    title: '我发起的'
                }
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    //base: 'yat-web',
    routes
})

import store from '@/store/index'

router.beforeEach((to, from, next) => {
    if (window.platform) {
        document.title = window.platform.title
    } else {
        document.title = localStorage.getItem('title')
    }
    var authorization = localStorage.getItem('Authorization')
    if (authorization) {
        if (!store.state.isAddRouter) {
            store.commit('handleAddRouter', true)
            // 动态路由
            let dyRoutes = JSON.parse(localStorage.getItem('routes'))
            if (dyRoutes) {
                for (let i = 0; i < dyRoutes.length; i++) {
                    let dyRoute = dyRoutes[i]
                    if (dyRoute.type === 9) {
                        router.addRoute({
                            name: dyRoute.path,
                            path: encodeURI('/' + dyRoute.path),
                            component: resolve => require([`@/views/${dyRoute.path}`], resolve),
                            meta: {
                                title: dyRoute.name
                            }
                        })
                    } else {
                        let pathStr = dyRoute.path
                        let queryStr = pathStr.split('?')[1]
                        let keyObj = {}
                        if (queryStr != '' && queryStr != undefined && queryStr != null) {
                            let list = queryStr.split('&')
                            list.forEach(element => {
                                let queryObj = element.split('=')
                                keyObj[queryObj[0]] = queryObj[1]
                            })
                            dyRoute.path = pathStr.split('?')[0]
                            dyRoute.query = keyObj
                        }
                        router.addRoute('home', {
                            name: dyRoute.path,
                            path: encodeURI('/' + dyRoute.path),
                            component: resolve => require([`@/views/${dyRoute.path}`], resolve),
                            query: dyRoute.query,
                            meta: {
                                title: dyRoute.name
                            }
                        })
                    }
                }
                next({ ...to, replace: true })
            } else {
                next()
            }
        } else {
            next()
        }
    } else {
        if (to.path === '/' || to.path === '/login' || to.path === '/wps' || to.path === '/rtc') {
            next()
        } else {
            next('/login')
        }
    }
})

Vue.prototype.$history = router
export default router
