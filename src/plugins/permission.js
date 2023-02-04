import Vue from 'vue'

const permission = {
    install (Vue, options){
        Vue.directive('permission', {
            inserted(el, binding, vnode){
                let permissions = localStorage.getItem("permissions")
                if (permissions) {
                    const permissionList = permissions.split(',')
                    if (!permissionList || !permissionList.includes(binding.value)) {
                        el.parentNode.removeChild(el)
                    }
                }
            }
        })
    }
}

Vue.use(permission)