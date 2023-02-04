<template>
    <div class="container">
        <el-container :style="'height:' + (clientHeight - 125) + 'px'">
            <el-main>
                <div class="searchView">
                    <div class="importBtn">
                        <el-button type="primary" size="small" @click.native="importReport">导入报告</el-button>
                    </div>
                    <el-form :model="searchForm" label-width="80px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="年度">
                                    <el-date-picker
                                        v-model="searchForm.year"
                                        type="year"
                                        value-format="yyyy"
                                        placeholder="请选择年度"
                                        align="center"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="审查类型">
                                    <el-select v-model="searchForm.scType" clearable>
                                        <el-option
                                            v-for="item in scTypes"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="报告类型">
                                    <el-select v-model="searchForm.bgType" clearable>
                                        <el-option
                                            v-for="item in bgTypes"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-button
                                    type="primary"
                                    icon="el-icon-search"
                                    @click.native="handleSearch"
                                    style="margin-left: 15px"
                                    >查询</el-button
                                >
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table :data="tableData" max-height="500" border stripe>
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="year" label="年度" width="80" align="center"></el-table-column>
                        <el-table-column
                            prop="scType"
                            label="审查类型"
                            align="center"
                            :formatter="scTypeFormtter"
                        ></el-table-column>
                        <el-table-column
                            prop="bgType"
                            label="报告类型"
                            align="center"
                            :formatter="bgTypeFormtter"
                        ></el-table-column>
                        <el-table-column prop="fileName" label="报告名称" align="center">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.fileName }}</span>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="view" icon="el-icon-view">查看</el-dropdown-item>
                                        <el-dropdown-item command="download" icon="el-icon-download"
                                            >下载
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="createTime"
                            label="发表时间"
                            width="160"
                            align="center"
                        ></el-table-column>
                        <el-table-column prop="accountName" label="提交人" width="140" align="center"></el-table-column>
                        <el-table-column label="操作" align="center" width="140">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            background
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next"
                            :current-page.sync="pageNo"
                            :total="total"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-container>

        <el-dialog
            :visible.sync="addDialog"
            center
            title="上传报告"
            :append-to-body="true"
            width="30%"
            :close-on-click-modal="false"
        >
            <el-form :model="reportForm" :rules="rules" ref="reportForm" label-width="120px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="年度" prop="year">
                            <el-date-picker
                                v-model="reportForm.year"
                                type="year"
                                value-format="yyyy"
                                placeholder="请选择年度"
                                align="center"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="审查类型" prop="scType">
                            <el-select v-model="reportForm.scType">
                                <el-option v-for="item in scTypes" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="报告类型" prop="bgType">
                            <el-select v-model="reportForm.bgType">
                                <el-option v-for="item in bgTypes" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="报告文件" prop="filePath">
                            <el-input v-model="reportForm.fileName" disabled></el-input>
                            <span style="color: red">支持word文件上传</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-upload
                            class="avatar-uploader"
                            :action="action"
                            :headers="headers"
                            :on-success="successHandle"
                            :before-upload="beforeUpload"
                            accept=".doc,.docx"
                            :show-file-list="false"
                        >
                            <el-button size="small" type="primary">选择文件</el-button>
                        </el-upload>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="submit">确 定 </el-button>
                <el-button size="small" @click="addDialog = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    computed: {
        treeHeight() {
            if (this.mainTreeData.length == 0) return 'width:calc(100% );'
            let no = 0
            getnext(this.mainTreeData, 1)
            function getnext(list, index) {
                list.forEach(key => {
                    if (key.children && key.children.length > 0) {
                        getnext(key.children, index + 1)
                        no = index + 1 > no ? index + 1 : no
                    }
                })
            }
            return 'width:calc( 200% + ' + 16 * no + 'px) ;'
        }
    },
    data() {
        return {
            action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            searchForm: {
                year: '',
                scType: '',
                bgType: ''
            },
            scTypes: [
                { id: '1', name: '年初预算审查' },
                { id: '2', name: '预算调整审查' },
                { id: '3', name: '决算审查' }
            ],
            bgTypes: [
                { id: '1', name: '主任会议审议意见' },
                { id: '2', name: '人代会审议报告' }
            ],
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            tableData: [],
            pageNo: 1,
            total: 0,
            addDialog: false,
            reportForm: {
                year: '',
                scType: '',
                bgType: '',
                filePath: '',
                fileName: '',
                accountId: '',
                status: ''
            },
            rules: {
                year: [{ required: true, message: '请选择报告年度', trigger: 'change' }],
                scType: [{ required: true, message: '请选择审查类型', trigger: 'change' }],
                bgType: [{ required: true, message: '请选择报告类型', trigger: 'change' }],
                filePath: [{ required: true, message: '请选择上传报告文件', trigger: 'change' }]
            },
            _databaseId: '',
            userId: '',
            userName: ''
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.userId = localStorage.getItem('userId')
        this.userName = localStorage.getItem('name')
        this.queryByPage()
    },
    methods: {
        //列表分页切换
        handleCurrentChange(val) {
            this.pageNo = val
            this.queryByPage()
        },
        //查询按钮
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
        //导入报告按钮
        importReport() {
            this.addDialog = true
            if (this.$refs.reportForm) {
                this.$refs.reportForm.resetFields()
            }
            this.reportForm.status = '1'
            this.reportForm.fileName = ''
            this.reportForm.accountId = this.userId
            this.reportForm.roleName = this.userName
        },
        //文件上传前判断
        beforeUpload(file) {
            let pattern = /.(doc|docx)$/g
            if (!pattern.test(file.name)) {
                this.$message.error('只能上传doc/docx文件')
                return false
            }
            const fileSize = file.size / 1024 / 1024 < 10
            if (!fileSize) {
                this.$message.error('上传文件大小不能超过 10MB')
                return false
            }
            return true
        },
        //文件上传成功
        successHandle(res, file, fileList) {
            if (res.code === 200) {
                this.$message.success('导入成功')
                this.reportForm.fileName = file.name
                this.reportForm.filePath = res.data
            } else {
                this.$message.error(res.message)
            }
        },
        //提交报告
        submit() {
            let that = this
            this.$refs.reportForm.validate(valid => {
                if (valid) {
                    that.$axios.post('cloud/entrance/insertScDhReport', that.reportForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('新增成功')
                            that.addDialog = false
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //查询列表
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                year: this.searchForm.year,
                scType: this.searchForm.scType,
                bgType: this.searchForm.bgType,
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/queryScDhReportList', params).then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
        },
        // 删除报告
        deleteSubmit(row) {
            let that = this
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' })
                .then(() => {
                    let params = {
                        id: row.id,
                        _databaseId: this._databaseId
                    }
                    that.$axios.post('cloud/entrance/deleteScDhReport', params).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('删除成功')
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
                .catch(() => {})
        },
        scTypeFormtter(row) {
            if (row.scType === '1') {
                return '年初预算审查'
            } else if (row.scType === '2') {
                return '预算调整审查'
            } else if (row.scType === '3') {
                return '决算审查'
            }
        },
        bgTypeFormtter(row) {
            if (row.bgType === '1') {
                return '主任会议审议意见'
            } else if (row.bgType === '2') {
                return '人代会审议报告'
            }
        },
        handleCommand(command, row) {
            let url = row.filePath
            let fileName = row.fileName

            if (command === 'download') {
                this.getBlob(url, blob => {
                    this.saveAs(blob, fileName)
                })
            } else if (command === 'view') {
                window.open(
                    this.$axios.defaults.baseURL +
                        'upload/preview?url=' +
                        encodeURIComponent(url) +
                        '&fileName=' +
                        encodeURIComponent(fileName)
                )
            }
        },
        getBlob(url, cb) {
            let xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr.responseType = 'blob'
            xhr.onload = function() {
                if (xhr.status === 200) {
                    cb(xhr.response)
                }
            }
            xhr.send()
        },
        saveAs(blob, filename) {
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename)
            } else {
                let link = document.createElement('a')
                let body = document.querySelector('body')

                link.href = window.URL.createObjectURL(blob)
                link.download = filename

                link.style.display = 'none'
                body.appendChild(link)

                link.click()
                body.removeChild(link)
                window.URL.revokeObjectURL(link.href)
            }
        }
    }
}
</script>
<style scoped>
.container {
    padding: 15px;
}
.el-main {
    border-left: 0px solid #e5e9f2;
    padding: 0px;
    margin-left: 15px;
}
.el-table__body tr.current-row td:not(.is-center) {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}
.importBtn {
    border-bottom: 1px solid #e5e9f2;
    margin: 0 0 15px 15px;
    padding: 0 0 10px 0;
}
/* 要求搜索输入框小一点，原有40px,现35 */
.searchView .el-form-item {
    margin-bottom: 15px;
    height: 35px;
}
.searchView .el-form-item__content {
    height: 35px;
    line-height: 35px;
}
.searchView .el-button {
    height: 35px;
    padding-top: 0;
    text-align: center;
    line-height: 35px;
}
.searchView .el-form-item__label {
    text-align: center;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 35px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    height: 35px;
    position: relative;
    right: -1px;
    background: #efefef;
    border-radius: 4px 0 0 4px;
    padding: 0;
}
.searchView .el-input__inner {
    line-height: 34px;
    height: 35px;
    box-sizing: border-box;
}
</style>
