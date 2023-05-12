<template>
    <div>
        <div id="relationbox">
            <div
                v-for="item in nodes"
                :key="item.keyId"
                :id="item.keyId"
                class="kkkkkk"
                :style="{
                    left: item.left + 'px',
                    top: item.top + 'px'
                }"
            >
                <div class="table-name" :title="item.remark + '-' + item.name">{{ item.remark }}-{{ item.name }}</div>
                <div class="table-list">
                    <el-scrollbar style="height: 200px; overflow-y: auto; overflow-x: hidden">
                        <div
                            v-for="(items, index) in item.authority"
                            :key="index"
                            class="list-item"
                            :title="items.name + ':' + items.type + '(' + items.length + ')-' + items.remark"
                        >
                            {{ items.name }} : {{ items.type }}({{ items.length }})-{{ items.remark }}
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { jsPlumb } from 'jsplumb'

export default {
    name: 'app',
    data() {
        return {
            jsPlumbInstance: '',
            jsPlumbSetting: {
                Connector: ['Straight'],
                Endpoint: ['Blank', { radius: 6 }],
                EndpointStyle: {
                    stroke: '#888',
                    fill: '#fff'
                },
                PaintStyle: { stroke: '#000', strokeWidth: 2 },
                Overlays: [['Arrow', { width: 10, length: 10, location: 1 }]]
            },
            jsPlumbConnectOptions: {
                isSource: true,
                isTarget: true,
                ConnectionsDetachable: false,
                anchor: 'AutoDefault'
            },
            nodes: [],
            edges: [],
            clientWidth: 0
        }
    },
    created() {},
    mounted() {
        this.queryModel()
    },
    methods: {
        queryModel() {
            let that = this
            that.$axios.get('businessTable/queryModel').then(res => {
                if (res.data.code == 200) {
                    that.nodes = res.data.data.nodesList
                    that.edges = res.data.data.edgesList
                    let winclude = parseInt(document.getElementById('relationbox').clientWidth / 300)
                    that.nodes.forEach((key, index) => {
                        that.$set(that.nodes[index], 'left', (index % winclude) * 300 + 10)
                        that.$set(that.nodes[index], 'top', parseInt(index / winclude) * 350 + 10)
                    })
                    that.drawLines()
                }
            })
        },
        drawLines() {
            let that = this
            this.$nextTick().then(() => {
                jsPlumb.ready(() => {
                    this.jsPlumbInstance = jsPlumb.getInstance()
                    this.jsPlumbInstance.importDefaults(this.jsPlumbSetting)
                    this.edges.forEach(item => {
                        this.jsPlumbInstance.connect(item, this.jsPlumbConnectOptions)
                    })
                    this.nodes.forEach(key => {
                        this.jsPlumbInstance.draggable(key.keyId)
                    })
                    // 重绘
                    this.jsPlumbInstance.repaintEverything()
                })
            })
        }
    }
}
</script>
<style scoped>
#relationbox {
    height: 100vh;
    overflow-y: auto;
    position: relative;
    background-image: url('../../assets/dot.png');
    background-repeat: repeat;
}
.kkkkkk {
    position: absolute;
    /* display: inline-block; */
    /* margin: 20px; */
    border: 2px solid #0c3d68;
    width: 250px;
    border-radius: 8px;
    background-color: #fff;
    cursor: pointer;
    z-index: 99999;
    overflow: hidden;
}
::v-deep .el-scrollbar__wrap {
    overflow-x: hidden !important;
}
/* .kkkkkk:hover {
    border: 2px solid #26ff0080;
} */
.table-name {
    text-align: center;
    line-height: 45px;
    background-color: #0c3d68;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.table-list {
    height: 200px;
    width: 250px;
}
.list-item {
    padding: 0 10px;
    font-size: 12px;
    width: 230px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
