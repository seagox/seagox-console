<template>
    <div>
        <div class="searchView">
            <el-form label-width="80px">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="年度">
                            <el-date-picker
                                v-model="searchForm.year"
                                placeholder="选择年"
                                align="center"
                                type="year"
                                value-format="yyyy"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button
                            icon="el-icon-search"
                            style="margin-left:15px"
                            type="primary"
                            @click.native="handleSearch"
                            >查询
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="报告列表" name="first">
                    <hr />
                    <div class="toolView">
                        <el-button icon="el-icon-plus" size="small" type="text" @click="showAddDialog"
                            >上传报告</el-button
                        >
                        <el-button icon="el-icon-minus" size="small" type="text" @click="deleteSubmit">删除</el-button>
                    </div>
                    <el-table
                        ref="multipleTable"
                        :data="opinionTableData"
                        border
                        height="300"
                        highlight-current-row
                        stripe
                    >
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                        <el-table-column align="center" label="年度" prop="year"></el-table-column>
                        <el-table-column align="center" label="意见分类" prop="classifyName"></el-table-column>
                        <el-table-column align="center" label="意见报告" prop="reportName">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.reportName }}</span>
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
                        <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
                        <el-table-column align="center" label="修改报告" width="185">
                            <template slot-scope="scope">
                                <el-upload
                                    :action="action"
                                    :before-upload="beforeUpload(scope.row)"
                                    :headers="headers"
                                    :on-success="successHandleEdit"
                                    :show-file-list="false"
                                    accept=".doc,.docx,.pdf"
                                >
                                    <el-button size="small" type="primary">选择文件</el-button>
                                </el-upload>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            :current-page.sync="pageNo"
                            :total="total"
                            background
                            layout="total, prev, pager, next"
                            @current-change="handleCurrentChange"
                        >
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="曾经办" name="second">
                    <hr />
                    <el-table :data="jbOpinionTableData" border height="300" highlight-current-row stripe>
                        <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                        <el-table-column align="center" label="年度" prop="year"></el-table-column>
                        <el-table-column align="center" label="意见分类" prop="classifyName"></el-table-column>
                        <el-table-column align="center" label="意见报告" prop="reportName">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.reportName }}</span>
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
                        <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            :current-page.sync="pageNo"
                            :total="total"
                            background
                            layout="total, prev, pager, next"
                            @current-change="handleCurrentChange"
                        >
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="addFormVisible" title="新增" width="750px">
            <el-form ref="addForm" :model="addForm" :rules="formRules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="年度">
                            <el-date-picker v-model="addForm.year" placeholder="选择年" type="year" value-format="yyyy">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="意见分类" prop="OpinionClassify">
                            <el-select v-model="addForm.classifyId" placeholder="请选择">
                                <el-option
                                    v-for="item in classifyOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="意见报告" prop="fileUrl">
                            <el-upload
                                :action="action"
                                :headers="headers"
                                :on-success="successHandle"
                                :show-file-list="false"
                                accept=".doc,.docx,.pdf"
                            >
                                <el-button type="primary">选择文件</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="fileName">
                            <el-input v-model="addForm.fileName" disabled></el-input>
                            <span style="color: red">支持word/pdf文件上传</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            _databaseId: '',
            action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
            headers: {
                Authorization: localStorage.getItem('Authorization')
            },
            userId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            pageNo: 1,
            total: 0,
            addFormVisible: false,
            addForm: {
                year: new Date().getFullYear().toString(),
                classifyId: 2,
                fileName: '',
                fileUrl: ''
            },
            editForm: {
                id: null,
                fileName: '',
                fileUrl: ''
            },
            formRules: {
                fileName: [{ required: true, message: '请选择上传的意见报告', trigger: 'change' }],
                fileUrl: [{ required: true, message: ' ', trigger: 'change' }]
            },
            searchForm: {
                year: ''
            },
            activeName: 'first',
            opinionTableData: [],
            jbOpinionTableData: [],
            classifyOptions: [],
            status: 0
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.queryByPage()
        this.getDbOpinionClassify()
    },
    methods: {
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                flag: 2,
                year: this.searchForm.year,
                status: this.status,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/authority/getDbOpinionList', { params }).then(res => {
                if (res.data.code === 200) {
                    that.opinionTableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
        },
        queryJbByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                flag: 2,
                year: this.searchForm.year,
                userId: this.userId,
                jb: 'jb',
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/authority/getDbOpinionList', { params }).then(res => {
                if (res.data.code === 200) {
                    that.jbOpinionTableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
        },
        handleSearch() {
            this.pageNo = 1
            if (this.activeName === 'first') {
                this.queryByPage()
            } else {
                this.queryJbByPage()
            }
        },
        handleCurrentChange(val) {
            if (this.activeName === 'first') {
                this.queryByPage()
            } else {
                this.queryJbByPage()
            }
        },
        getDbOpinionClassify() {
            let that = this
            const params = {
                flag: 2,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/authority/getDbOpinionClassify', { params }).then(res => {
                if (res.data.code === 200) {
                    that.classifyOptions = res.data.data
                }
            })
        },
        //显示新增界面
        showAddDialog() {
            this.addFormVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
        },
        //新增
        addSubmit() {
            let that = this
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    let params = {
                        userId: this.userId,
                        companyId: this.companyId,
                        classifyId: this.addForm.classifyId,
                        year: this.addForm.year,
                        reportName: this.addForm.fileName,
                        reportUrl: this.addForm.fileUrl,
                        category: '审议报告',
                        _databaseId: this._databaseId
                    }
                    that.$axios.post('cloud/authority/addDbOpinion', params).then(res => {
                        if (res.data.code === 200) {
                            that.$message.success('新增成功')
                            that.addFormVisible = false
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //编辑
        editSubmit() {
            let that = this
            let params = {
                id: this.editForm.id,
                reportName: this.editForm.fileName,
                reportUrl: this.editForm.fileUrl,
                flag: 2,
                _databaseId: this._databaseId
            }
            that.$axios.post('cloud/authority/updateDbOpinion', params).then(res => {
                if (res.data.code === 200) {
                    that.$message.success('修改成功')
                    that.queryByPage()
                } else {
                    that.$message.error(res.data.message)
                }
            })
        },
        deleteSubmit() {
            const _selectData = this.$refs.multipleTable.selection
            if (_selectData.length <= 0) {
                this.$message({
                    message: '请选择至少一条审议报告',
                    type: 'warning'
                })
                return
            }
            let that = this
            let idArray = []
            for (let i = 0; i < _selectData.length; i++) {
                idArray.push(_selectData[i].id)
            }
            const ids = idArray.join(',')
            let param = {
                ids: ids,
                _databaseId: this._databaseId
            }
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                that.$axios.post('cloud/authority/deleteDbOpinion', param).then(res => {
                    if (res.data.code === 200) {
                        that.$message.success('删除成功')
                        that.pageNo = 1
                        that.queryByPage()
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            })
        },
        handleClick(tab, event) {
            this.pageNo = 1
            this.year = null
            if (tab.name === 'first') {
                this.activeName = 'first'
                this.queryByPage()
            } else {
                this.activeName = 'second'
                this.queryJbByPage()
            }
        },
        handleCommand(command, row) {
            let url = row.reportUrl
            let fileName = row.reportName
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
        },
        beforeUpload(row) {
            this.editForm.id = row.id
        },
        successHandle(res, file, fileList) {
            if (res.code === 200) {
                this.$message.success('导入成功')
                this.addForm.fileName = file.name
                this.addForm.fileUrl = res.data
            } else {
                this.$message.error(res.message)
            }
        },
        successHandleEdit(res, file, fileList) {
            if (res.code === 200) {
                this.editForm.fileName = file.name
                this.editForm.fileUrl = res.data
                this.editSubmit()
            } else {
                this.$message.error(res.message)
            }
        }
    }
}
</script>
<style scoped>
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
