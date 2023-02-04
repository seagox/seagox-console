<template>
    <div>
        <top @changeTheme="changeTheme" />
        <sidebar ref="leftmenu" />
        <div
            class="content"
            :style="{
                left: isCollapse ? '64px' : '230px',
                width: isCollapse ? 'calc(100% - 64px)' : 'calc(100% - 230px)'
            }"
        >
            <worktab />
            <div style="height: calc(100% - 49px); overflow: auto">
                <keep-alive>
                    <router-view :ref="key" :key="key" v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import top from '@/views/layout/top'
import sidebar from '@/views/layout/sidebar'
import worktab from '@/views/layout/worktab'
export default {
    components: {
        top,
        sidebar,
        worktab
    },
    computed: {
        key() {
            return this.$route.fullPath
        },
        isCollapse() {
            return this.$store.state.isCollapse
        }
    },
    methods: {
        changeTheme() {
            this.$refs.leftmenu.getBG()
        }
    }
}
</script>
<style scoped>
.content {
    position: absolute;
    top: 60px;
    height: calc(100% - 60px);
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
