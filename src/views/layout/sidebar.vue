<template>
    <div style="height: 100%; position: fixed">
        <el-menu
            :collapse="isCollapse"
            :unique-opened="true"
            @select="selectMenu"
            class="el-menu-vertical"
            ref="menuList"
            :class="MenuBg"
        >
            <el-menu-item index="readme">
                <i class="el-icon-house"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="platform" v-permission="'platformApplication'">
                <i class="el-icon-monitor"></i>
                <span slot="title">平台配置</span>
            </el-menu-item>
            <el-menu-item index="sys" v-permission="'sysApplication'">
                <i class="el-icon-setting"></i>
                <span slot="title">系统配置</span>
            </el-menu-item>
            <sidebar-menu :data="menuList" />
        </el-menu>
    </div>
</template>

<script>
import sidebarMenu from '@/views/layout/sidebar-menu'

export default {
    components: {
        sidebarMenu
    },
    computed: {
        isCollapse() {
            return this.$store.state.isCollapse
        }
    },
    data() {
        return {
            menuList: [],
            MenuBg: 'bg-red',
            color: ''
        }
    },
    created() {
        this.queryMenu()
        this.getBG()
    },
    methods: {
        getBG() {
            let type = 'red'
            this.color = localStorage.getItem('color')
            switch (this.color) {
                case '#DA001C':
                    type = 'red'
                    break
                case '#0574d5':
                    type = 'blue'
                    break
                case '#7115AB':
                    type = 'purple'
                    break
                case '#27C9B9':
                    type = 'cyan'
                    break
                case '#26B476':
                    type = 'green'
                    break
                case '#FFC034':
                    type = 'yellow'
                    break
                case '#FB5F14':
                    type = 'orange'
                    break
                case '#152A7E':
                    type = 'deep-blue'
                    break
            }
            this.MenuBg = 'bg-' + type
        },
        async queryMenu() {
            const res = await this.$axios.get('menu/queryUserMenu')
            if (res.data.code == 200) {
                if (res.data.data) {
                    this.menuList = this.resetmenu(res.data.data, 0)
                }
            }
        },
        resetmenu(data, num) {
            // 1:列表;2:按钮;3:新增页面;4:系统菜单;5:目录;6:仪表板;7:自定义页面;8:报表;9:单页面;
            let menuList = JSON.parse(JSON.stringify(data))
            let menuArray = []
            menuList.forEach(item => {
                if (item.type === 1) {
                    item.url = 'formList?id=' + item.path + '&title=' + item.name
                } else if (item.type === 3) {
                    item.url = 'addCustomForm?id=' + item.path + '&title=' + item.name
                } else if (item.type === 5) {
                    item.url = Math.random().toString(36).slice(-6)
                } else if (item.type === 6) {
                    item.url = 'analysis?id=' + item.path + '&title=' + item.name
                } else if (item.type === 8) {
                    item.url = 'reportList?id=' + item.path + '&title=' + item.name
                } else {
                    item.url = item.path
                }
                if (item.children && item.children.length > 0) {
                    item.children = this.resetmenu(item.children, num + 1)
                }
                //标识第一层用来隐藏
                item.level = num
                if(item.type != 9) {
                    menuArray.push(item)
                }
            })
            return menuArray
        },
        selectMenu(index) {
            if (index.indexOf('runCode') != -1) {
                this.$router.push('/' + index + '&time=' + new Date().getTime())
            } else {
                this.$router.push('/' + index)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-menu li,
::v-deep .el-submenu__title {
    span {
        color: #fff;
    }
}
.bg-red {
    background-image: url('../../assets/theme/red-menu.png');
    background-size: 100% 102%;
    background-repeat: no-repeat;
    background-position: center;
}
.bg-red ::v-deep .el-menu-item.is-active {
    background-color: #fe6a21 !important;
}

::v-deep .el-menu {
    background-color: transparent !important;
    border: 0px solid transparent;
    box-shadow: none;
}
::v-deep li:hover,
::v-deep .el-submenu__title:hover {
    background: rgba(0, 0, 0, 0.2) !important;
}
.bg-blue {
    background-image: url('../../assets/theme/blue-menu.png');
    background-size: 100% 102%;
    background-repeat: no-repeat;
    background-position: center;
}
.bg-blue ::v-deep .el-menu-item.is-active {
    background-color: #14b8fc !important;
}
.bg-purple {
    background-image: url('../../assets/theme/purple-menu.png');
    background-size: 100% 102%;
    background-repeat: no-repeat;
    background-position: center;
}
.bg-purple ::v-deep .el-menu-item.is-active {
    background-color: #c23af5 !important;
}
.bg-green {
    background-image: url('../../assets/theme/green-menu.png');
    background-size: 100% 102%;
    background-repeat: no-repeat;
    background-position: center;
}
.bg-green ::v-deep .el-menu-item.is-active {
    background-color: #edb621 !important;
}
.bg-yellow {
    background-image: url('../../assets/theme/yellow-menu.png');
    background-size: 100% 102%;
    background-repeat: no-repeat;
    background-position: center;
}
.bg-yellow ::v-deep .el-menu-item.is-active {
    background-color: #fb9605 !important;
}
.bg-cyan {
    background-image: url('../../assets/theme/cyan-menu.png');
    background-size: 100% 102%;
    background-repeat: no-repeat;
    background-position: center;
}
.bg-cyan ::v-deep .el-menu-item.is-active {
    background-color: #13a3d9 !important;
}
.bg-orange {
    background-image: url('../../assets/theme/orange-menu.png');
    background-size: 100% 102%;
    background-repeat: no-repeat;
    background-position: center;
}
.bg-orange ::v-deep .el-menu-item.is-active {
    background-color: #fea03b !important;
}
.bg-deep-blue {
    background-image: url('../../assets/theme/deep-blue-menu.png');
    background-size: 100% 102%;
    background-repeat: no-repeat;
    background-position: center;
}
.bg-deep-blue ::v-deep .el-menu-item.is-active {
    background-color: #14b8fc !important;
}

::v-deep .el-menu-vertical:not(.el-menu--collapse) {
    width: 230px;
    height: calc(100% - 60px);
    overflow-y: auto;
    overflow-x: hidden;
    position: fixed;
    top: 60px;
}
::v-deep .el-menu--collapse {
    position: fixed;
    height: calc(100% - 60px);
    top: 60px;
    color: #333;
}
::v-deep .el-menu-vertical::-webkit-scrollbar {
    display: none;
}
::v-deep .el-menu--collapse > div > .el-submenu > .el-submenu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
}
::v-deep .el-menu-item {
    font-size: 13px;
    letter-spacing: 1.5px;
}
::v-deep .el-submenu__title {
    font-size: 13px;
    letter-spacing: 1.5px;
}
::v-deep .is-active {
    color: #fff !important;
}
::v-deep .el-menu-item [class^='el-icon-'] {
    margin-right: 10px;
    font-weight: bold;
    font-size: 15px;
}
::v-deep .el-submenu [class^='el-icon-'] {
    margin-right: 10px;
    font-weight: bold;
    font-size: 15px;
}
::v-deep .el-menu-item:not(.is-active) i {
    color: #fff !important;
}
::v-deep .el-submenu__title:not(.is-active) i {
    color: #fff !important;
}
::v-deep .el-menu--collapse > .el-menu-custom > .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
    display: none;
}
</style>
