<template>
    <div class="container hqReportFk-page">
        <div class="table">
            <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
                <el-tab-pane label="未整改" name="first">
                    <div class="toolView">
                        <el-button style="font-size:14px" size="small" round type="plain" @click="showZgDia"
                            >提交整改</el-button
                        >
                        <el-button style="font-size:14px" size="small" round type="plain" @click="getlogTableData"
                            >查看审核流程</el-button
                        >
                    </div>
                    <el-table
                        ref="multipleFirst"
                        :data="tableDataFirst"
                        border
                        height="300"
                        highlight-current-row
                        stripe
                    >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column align="center" label="意见概要" prop="yjContent"></el-table-column>
                        <el-table-column align="center" label="报告类型" prop="reportType"></el-table-column>
                        <el-table-column align="center" label="预审报告">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand1($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.ysReportName }}</span>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="view" icon="el-icon-view">查看 </el-dropdown-item>
                                        <el-dropdown-item command="download" icon="el-icon-download"
                                            >下载
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="整改说明">
                            <template slot-scope="scope">
                                <span class="el-dropdown-link">
                                    <span>{{ scope.row.zgOpinion }}</span>
                                    <br v-if="scope.row.fileName != ' ' && scope.row.fileName != null" />
                                </span>
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
                        <el-table-column align="center" label="发表时间" prop="zgDate"></el-table-column>
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
                <el-tab-pane label="已整改" name="second">
                    <div class="toolView">
                        <el-button style="font-size:14px" size="small" round type="plain" @click="revoke"
                            >撤销</el-button
                        >
                        <el-button style="font-size:14px" size="small" round type="plain" @click="getlogTableData"
                            >查看审核流程</el-button
                        >
                    </div>
                    <el-table
                        ref="multipleSecond"
                        :data="tableDataSecond"
                        border
                        height="300"
                        highlight-current-row
                        stripe
                    >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column align="center" label="意见概要" prop="yjContent"></el-table-column>
                        <el-table-column align="center" label="报告类型" prop="reportType"></el-table-column>
                        <el-table-column align="center" label="预审报告">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand1($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.ysReportName }}</span>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="view" icon="el-icon-view">查看 </el-dropdown-item>
                                        <el-dropdown-item command="download" icon="el-icon-download"
                                            >下载
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="整改说明">
                            <template slot-scope="scope">
                                <span class="el-dropdown-link">
                                    <span>{{ scope.row.zgOpinion }}</span>
                                    <br v-if="scope.row.fileName != ' ' && scope.row.fileName != null" />
                                </span>
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
                        <el-table-column align="center" label="发表时间" prop="zgDate"></el-table-column>
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
                <el-tab-pane label="被退回" name="four">
                    <div class="toolView">
                        <el-button style="font-size:14px" size="small" round type="plain" @click="showZgDia1"
                            >提交整改</el-button
                        >
                        <el-button style="font-size:14px" size="small" round type="plain" @click="getlogTableData"
                            >查看审核流程</el-button
                        >
                    </div>
                    <el-table ref="multipleFour" :data="tableDataFour" border height="300" highlight-current-row stripe>
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column align="center" label="意见概要" prop="yjContent"></el-table-column>
                        <el-table-column align="center" label="报告类型" prop="reportType"></el-table-column>
                        <el-table-column align="center" label="预审报告">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand1($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.ysReportName }}</span>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="view" icon="el-icon-view">查看 </el-dropdown-item>
                                        <el-dropdown-item command="download" icon="el-icon-download"
                                            >下载
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="整改说明">
                            <template slot-scope="scope">
                                <span class="el-dropdown-link">
                                    <span>{{ scope.row.zgOpinion }}</span>
                                    <br v-if="scope.row.fileName != ' ' && scope.row.fileName != null" />
                                </span>
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
                        <el-table-column align="center" label="发表时间" prop="zgDate"></el-table-column>
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
                <el-tab-pane label="曾经办" name="third">
                    <div class="toolView">
                        <el-button style="font-size:14px" size="small" round type="plain" @click="getlogTableData"
                            >查看审核流程</el-button
                        >
                    </div>
                    <el-table
                        ref="multipleThird"
                        :data="tableDataThird"
                        border
                        height="300"
                        highlight-current-row
                        stripe
                    >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column align="center" label="意见概要" prop="yjContent"></el-table-column>
                        <el-table-column align="center" label="报告类型" prop="reportType"></el-table-column>
                        <el-table-column align="center" label="预审报告">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand1($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.ysReportName }}</span>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="view" icon="el-icon-view">查看 </el-dropdown-item>
                                        <el-dropdown-item command="download" icon="el-icon-download"
                                            >下载
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="整改说明">
                            <template slot-scope="scope">
                                <span class="el-dropdown-link">
                                    <span>{{ scope.row.zgOpinion }}</span>
                                    <br v-if="scope.row.fileName != ' ' && scope.row.fileName != null" />
                                </span>
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
                        <el-table-column align="center" label="发表时间" prop="createTime"></el-table-column>
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
        <el-dialog
            :visible.sync="logDialog"
            center
            title="审核流程"
            :append-to-body="true"
            width="60%"
            :close-on-click-modal="false"
        >
            <el-table ref="multipleLog" :data="logTableData" border height="300" highlight-current-row stripe>
                <el-table-column align="center" label="操作次序" type="index" width="100"></el-table-column>
                <el-table-column align="center" label="操作人员" prop="name"></el-table-column>
                <el-table-column align="center" label="审核岗位" prop="roleName"></el-table-column>
                <el-table-column align="center" label="审核状态" prop="status"></el-table-column>
                <el-table-column align="center" label="审核意见" prop="reason"></el-table-column>
                <el-table-column align="center" label="操作时间" prop="createTime"></el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    :current-page.sync="logPageNo"
                    :total="logTotal"
                    background
                    layout="total, prev, pager, next"
                    @current-change="handleDetailChange"
                >
                </el-pagination>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="reportDialog"
            center
            title="提交整改"
            :append-to-body="true"
            width="30%"
            :close-on-click-modal="false"
        >
            <el-form ref="reportForm" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="整改说明" prop="name">
                            <el-input v-model="reportForm.zgOpinion" type="textarea" :rows="3"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="18">
                        <el-form-item label="整改文件" prop="fileUrl">
                            <el-input v-model="reportForm.fileName" disabled></el-input>
                            <span style="color: red">支持word/pdf文件上传</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-upload
                            class="avatar-uploader"
                            :action="action"
                            :headers="headers"
                            :on-success="successHandle"
                            :before-upload="beforeUpload"
                            accept=".doc,.docx,.pdf"
                            :show-file-list="false"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="submitZg">确 定 </el-button>
                <el-button size="small" @click="goback" type="default">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            reportForm: {
                zgOpinion: '',
                fileName: '',
                fileUrl: ''
            },
            reportDialog: false,
            logDialog: false,
            activeName: 'first',
            logTableData: [],
            tableDataFirst: [],
            tableDataSecond: [],
            tableDataThird: [],
            tableDataFour: [],
            total: 0,
            pageNo: 1,
            logPageNo: 1,
            logTotal: 0,
            ids: [],
            seachForm: {
                companyId: Number(localStorage.getItem('companyId')),
                userId: Number(localStorage.getItem('userId')),
                _databaseId: localStorage.getItem('_databaseId')
            }
        }
    },
    created() {
        this.getFirstList()
    },
    methods: {
        goback() {
            this.reportForm.zgOpinion = ''
            this.reportForm.fileUrl = ''
            this.reportForm.fileName = ''
            this.reportDialog = false
        },
        beforeUpload(file) {
            console.log(file)
        },
        successHandle(res, file, fileList) {
            if (res.code === 200) {
                this.$message.success('导入成功')
                this.reportForm.fileName = file.name
                this.reportForm.fileUrl = res.data
            } else {
                this.$message.error(res.message)
            }
        },
        //撤销
        revoke() {
            let _selectData = this.$refs.multipleSecond.selection
            if (_selectData.length <= 0) {
                this.$message.warning({ message: '请至少选择一条数据！' })
                return
            }
            this.$confirm(`确定要撤销所选数据吗？`, '提示', { type: 'warning' }).then(() => {
                let idss = []
                for (let i = 0; i < _selectData.length; i++) {
                    idss.push(_selectData[i].id)
                }
                const ids = idss.join(',')
                let param = {
                    ids: ids,
                    status: 2,
                    fileName: ' ',
                    accountId: this.seachForm.userId
                }
                this.$axios.post('cloud/entrance/revoke', param).then(res => {
                    this.$message.success({ message: '撤销成功' })
                    this.handleClick()
                })
            })
        },
        //显示整改框
        showZgDia() {
            this.ids = []
            this.reportForm.zgOpinion = ''
            this.reportForm.fileUrl = ''
            this.reportForm.fileName = ''
            let _selectData = this.$refs.multipleFirst.selection
            if (_selectData.length <= 0) {
                this.$message({
                    message: '请至少选择一条数据！',
                    type: 'warning'
                })
                return
            }
            let idss = []
            for (let i = 0; i < _selectData.length; i++) {
                idss.push(_selectData[i].id)
            }
            this.ids = idss.join(',')
            this.reportDialog = true
        },
        showZgDia1() {
            let _selectData = this.$refs.multipleFour.selection
            if (_selectData.length != 1) {
                this.$message({
                    message: '请选择一条数据！',
                    type: 'warning'
                })
                return
            }
            this.ids = _selectData[0].id
            this.reportForm.zgOpinion = _selectData[0].zgOpinion
            this.reportForm.fileUrl = _selectData[0].fileUrl
            this.reportForm.fileName = _selectData[0].fileName
            this.reportDialog = true
        },
        //提交整改
        submitZg() {
            let param = {
                ids: this.ids,
                status: 3,
                zgDate: 1,
                accountId: this.seachForm.userId,
                fileName: this.reportForm.fileName,
                fileUrl: this.reportForm.fileUrl,
                zgOpinion: this.reportForm.zgOpinion
            }
            this.$axios.post('cloud/entrance/submitZg', param).then(res => {
                this.$message.success({ message: '提交成功' })
                this.reportDialog = false
                this.handleClick()
            })
        },
        handleCommand1(command, row) {
            if (command === 'download') {
                console.log(row)
                window.location.href =
                    window.platform.url +
                    'cloud/download/downloadXzOpinionReport?xzReportId=' +
                    row.id +
                    '&year=' +
                    row.year +
                    '&_databaseId=' +
                    this.seachForm._databaseId
            } else if (command === 'view') {
                window.open(
                    this.$axios.defaults.baseURL +
                        'upload/preview?url=' +
                        encodeURIComponent(
                            window.platform.url +
                                'cloud/download/downloadXzOpinionReport?xzReportId=' +
                                row.id +
                                '&year=' +
                                row.year +
                                '&_databaseId=' +
                                this.seachForm._databaseId
                        ) +
                        '&fileName=' +
                        encodeURIComponent(row.ysReportName)
                )
            }
        },
        getFirstList() {
            let param = {
                pageNo: this.pageNo,
                _databaseId: this.seachForm._databaseId,
                status: 2,
                accountId: Number(localStorage.getItem('userId'))
            }
            this.$axios.post('cloud/entrance/getHqReportFk', param).then(res => {
                this.tableDataFirst = res.data.data.list
                this.total = res.data.data.total
            })
        },
        getSecondList() {
            let param = {
                pageNo: this.pageNo,
                _databaseId: this.seachForm._databaseId,
                status: 3,
                accountId: Number(localStorage.getItem('userId'))
            }
            this.$axios.post('cloud/entrance/getHqReportFk', param).then(res => {
                this.tableDataSecond = res.data.data.list
                this.total = res.data.data.total
            })
        },
        getThirdList() {
            let param = {
                pageNo: this.pageNo,
                _databaseId: this.seachForm._databaseId,
                accountId: this.seachForm.userId,
                cjbCode: 3
            }
            this.$axios.post('cloud/entrance/getHqReportFk', param).then(res => {
                this.tableDataThird = res.data.data.list
                this.total = res.data.data.total
            })
        },
        getFourList() {
            let param = {
                pageNo: this.pageNo,
                _databaseId: this.seachForm._databaseId,
                status: 4
            }
            this.$axios.post('cloud/entrance/getHqReport', param).then(res => {
                this.tableDataFour = res.data.data.list
                this.total = res.data.data.total
            })
        },
        handleClick() {
            if (this.activeName == 'first') {
                this.pageNo = 1
                this.getFirstList()
            } else if (this.activeName == 'second') {
                this.pageNo = 1
                this.getSecondList()
            } else if (this.activeName == 'third') {
                this.pageNo = 1
                this.getThirdList()
            } else if (this.activeName == 'four') {
                this.pageNo = 1
                this.getFourList()
            }
        },
        handleSearch() {
            this.pageNo = 1
            this.handleClick()
        },
        handleCurrentChange(val) {
            this.pageNo = val
            this.handleClick()
        },
        handleDetailChange(val) {
            this.logPageNo = val
            this.getlogTableData()
        },
        getlogTableData() {
            let _selectData = []
            if (this.activeName == 'first') {
                _selectData = this.$refs.multipleFirst.selection
            } else if (this.activeName == 'second') {
                _selectData = this.$refs.multipleSecond.selection
            } else if (this.activeName == 'third') {
                _selectData = this.$refs.multipleThird.selection
            } else if (this.activeName == 'four') {
                _selectData = this.$refs.multipleFour.selection
            }

            if (_selectData.length != 1) {
                this.$message.warning({ message: '请选择一条数据！' })
                return
            }
            let param = {
                pageNo: this.logPageNo,
                _databaseId: this.seachForm._databaseId,
                rid: _selectData[0].id
            }
            this.$axios.post('cloud/entrance/getLogInfo', param).then(res => {
                this.logTableData = res.data.data.list
                this.logTotal = res.data.data.total
                this.logDialog = true
            })
        },
        handleCommand(command, row) {
            console.log(command)
            console.log(row)
            let url
            let fileName

            url = row.fileUrl
            fileName = row.fileName

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
.hqReportFk-page .searchView {
    padding-top: 0 !important;
    padding-left: 15px !important;
    margin-top: 0px !important;
    height: 36px !important;
    overflow: hidden !important;
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
.hqReportFk-page .el-tabs__header .el-tabs__item.is-active {
    border-bottom: 1px solid #e4e7ed;
    background: #efefef;
}
.hqReportFk-page .toolView {
    margin-bottom: 5px;
    padding-left: 0;
}
.container {
    padding: 15px;
}
</style>
