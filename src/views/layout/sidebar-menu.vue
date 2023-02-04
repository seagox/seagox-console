<template>
    <div>
        <div class="el-menu-custom" v-for="(item, index) in data" :key="index">
            <el-submenu :index="item.url" v-if="item.children" :class="isCollapse && item.level == 0 ? 'is-Close' : ''">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span slot="title">{{ item.name }}</span>
                </template>
                <template>
                    <siderbar-menu-item :data="item.children"></siderbar-menu-item>
                </template>
            </el-submenu>
            <el-menu-item :index="item.url" v-else>
                <i :class="item.icon"></i>
                <span slot="title" class="line">
                    {{ item.name }}
                </span>
            </el-menu-item>
        </div>
    </div>
</template>

<script>
export default {
    name: 'siderbar-menu-item',
    props: {
        data: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    computed: {
        isCollapse() {
            return this.$store.state.isCollapse
        }
    }
}
</script>
<style lang="scss" scoped>
.is-Close {
    /deep/.el-submenu__title {
        span {
            display: none;
        }
        .el-submenu__icon-arrow {
            display: none;
        }
    }
}
</style>
