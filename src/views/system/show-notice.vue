<template>
    <div class="container">
        <el-main>
            <el-form label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="title" disabled></el-input>
                </el-form-item>
                <el-form-item label="正文">
                    <editor ref="editor" id="text" v-model="content" placeholder="" :enable="false"> </editor>
                </el-form-item>
                <el-form-item v-if="resources.length > 0" label="附件">
                    <el-table :data="resources">
                        <el-table-column prop="name" label="文件名" align="center"></el-table-column>
                        <el-table-column
                            prop="size"
                            label="文件大小"
                            align="center"
                            :formatter="sizeFormatter"
                        ></el-table-column>
                        <el-table-column label="文件下载" align="center">
                            <template slot-scope="scope">
                                <el-link @click="handleFileDownload(scope.row)">下载</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item v-if="relationList.length > 0" label="关联">
                    <el-table :data="relationList">
                        <el-table-column prop="title" label="标题" align="center">
                            <template slot-scope="scope">
                                <el-link @click="pageJump(scope.row)">{{ scope.row.title }}</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </el-main>
    </div>
</template>

<script>
import editor from '@/views/components/quill/editor'
export default {
    components: {
        editor
    },
    data() {
        return {
            title: '',
            content: {},
            resources: [],
            relationList: []
        }
    },
    created() {
        this.queryDetails()
    },
    methods: {
        // 获取详情
        queryDetails() {
            this.$axios.get('notice/queryShowById/' + this.$route.query.id).then(res => {
                if (res.data.code == 200) {
                    this.title = res.data.data.title
                    this.content = JSON.parse(res.data.data.content)
                    if (res.data.data.content != '{}'){
                        this.$refs.editor.setContents(this.content)
                    }
                    this.resources = JSON.parse(res.data.data.resources)
                    if (res.data.data.relationList){
                        this.relationList = res.data.data.relationList
                    }
                }
            })
        },
        // 文件下载
        handleFileDownload(file) {
            let params = {
                url: file.url,
                fileName: file.name
            }
            this.$axios.post('upload/download', params, { responseType: 'blob' }).then(res => {
                let content = res.data
                let blob = new Blob([content])
                if ('download' in document.createElement('a')) {
                    // 非IE下载
                    let elink = document.createElement('a')
                    elink.download = file.name
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, file.name)
                }
            })
        },
        // 附件文件单位格式化
        sizeFormatter(row) {
            if (!row.size) {
                return '0 B'
            }
            var unitArr = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
            var index = 0
            var srcsize = parseFloat(row.size)
            index = Math.floor(Math.log(srcsize) / Math.log(1024))
            var size = srcsize / Math.pow(1024, index)
            if (index != 0) {
                size = size.toFixed(2) //保留的小数位数
            }
            return size + unitArr[index]
        },
        pageJump(row){
            this.$router.push({
                path: '/showNotice',
                query: {
                    id: row.id
                }
            })
        }
    }
}
</script>

<style scoped>
.container {
    padding-top: 15px;
}
</style>
