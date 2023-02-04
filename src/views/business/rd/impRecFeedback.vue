<template>
    <div class="container">
        <el-container :style="'height:' + (clientHeight - 125) + 'px'">
            <el-aside width="300px">
                <div class="add-dept">
                    <span style="margin-left:10px;">意见分类</span>
                </div>
                <el-tree
                    :data="folderList"
                    :expand-on-click-node="false"
                    :props="defaultProps"
                    default-expand-all
                    @node-click="handleNodeClick"
                >
                    <span slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                    </span>
                </el-tree>
            </el-aside>
            <el-main>
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
                    <el-tabs v-if="flag === 2" v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="待反馈" name="first">
                            <hr />
                            <div class="toolView">
                                <el-upload
                                    :action="action"
                                    :headers="headers"
                                    :on-success="successHandleEdit"
                                    :show-file-list="false"
                                    accept=".doc,.docx,.pdf"
                                >
                                    <el-button size="small" type="text" @click="check">批量反馈</el-button>
                                </el-upload>
                            </div>
                            <el-table
                                ref="multipleOpinionTableOne"
                                :data="dfkOpinionTableData"
                                :key="1"
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
                                        <el-dropdown @command="handleCommand($event, scope.row, 'report')">
                                            <span class="el-dropdown-link">
                                                <span>{{ scope.row.reportName }}</span>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="view" icon="el-icon-view"
                                                    >查看
                                                </el-dropdown-item>
                                                <el-dropdown-item command="download" icon="el-icon-download"
                                                    >下载
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                                <el-table-column
                                    :formatter="statusFormatter"
                                    align="center"
                                    label="完成情况"
                                    prop="status"
                                ></el-table-column>
                                <el-table-column align="center" label="操作" width="185">
                                    <template slot-scope="scope">
                                        <el-upload
                                            :action="action"
                                            :headers="headers"
                                            :on-success="
                                                (response, file, fileList) =>
                                                    successHandleEdit(response, file, fileList, scope.row)
                                            "
                                            :show-file-list="false"
                                            accept=".doc,.docx,.pdf"
                                        >
                                            <el-button size="small" type="primary">反馈</el-button>
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
                        <el-tab-pane label="已反馈" name="second">
                            <hr />
                            <div class="toolView">
                                <el-button size="small" type="text" @click="cancelSubmit">取消反馈</el-button>
                            </div>
                            <el-table
                                ref="multipleOpinionTableTwo"
                                :data="yfkOpinionTableData"
                                :key="2"
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
                                        <el-dropdown @command="handleCommand($event, scope.row, 'report')">
                                            <span class="el-dropdown-link">
                                                <span>{{ scope.row.reportName }}</span>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="view" icon="el-icon-view"
                                                    >查看
                                                </el-dropdown-item>
                                                <el-dropdown-item command="download" icon="el-icon-download"
                                                    >下载
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                                <el-table-column
                                    :formatter="statusFormatter"
                                    align="center"
                                    label="完成情况"
                                    prop="status"
                                ></el-table-column>
                                <el-table-column align="center" label="反馈报告" prop="feedbackReportName">
                                    <template slot-scope="scope">
                                        <el-dropdown @command="handleCommand($event, scope.row, 'feedback')">
                                            <span class="el-dropdown-link">
                                                <span>{{ scope.row.feedbackReportName }}</span>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="view" icon="el-icon-view"
                                                    >查看
                                                </el-dropdown-item>
                                                <el-dropdown-item command="download" icon="el-icon-download"
                                                    >下载
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="反馈提交时间"
                                    prop="updateTime"
                                ></el-table-column>
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
                            <hr />
                            <el-table
                                :data="cjbOpinionTableData"
                                :key="3"
                                border
                                height="300"
                                highlight-current-row
                                stripe
                            >
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="年度" prop="year"></el-table-column>
                                <el-table-column align="center" label="意见分类" prop="classifyName"></el-table-column>
                                <el-table-column align="center" label="意见报告" prop="reportName">
                                    <template slot-scope="scope">
                                        <el-dropdown @command="handleCommand($event, scope.row, 'report')">
                                            <span class="el-dropdown-link">
                                                <span>{{ scope.row.reportName }}</span>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="view" icon="el-icon-view"
                                                    >查看
                                                </el-dropdown-item>
                                                <el-dropdown-item command="download" icon="el-icon-download"
                                                    >下载
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                                <el-table-column
                                    :formatter="statusFormatter"
                                    align="center"
                                    label="完成情况"
                                    prop="status"
                                ></el-table-column>
                                <el-table-column align="center" label="反馈报告" prop="feedbackReportName">
                                    <template slot-scope="scope">
                                        <el-dropdown @command="handleCommand($event, scope.row, 'feedback')">
                                            <span class="el-dropdown-link">
                                                <span>{{ scope.row.feedbackReportName }}</span>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="view" icon="el-icon-view"
                                                    >查看
                                                </el-dropdown-item>
                                                <el-dropdown-item command="download" icon="el-icon-download"
                                                    >下载
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="反馈提交时间"
                                    prop="updateTime"
                                ></el-table-column>
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
                    <el-tabs v-if="flag === 1" v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="待反馈" name="first">
                            <hr />
                            <div class="toolView">
                                <el-button size="small" type="text" @click="check">批量反馈</el-button>
                            </div>
                            <el-table
                                ref="multipleOpinionTableThird"
                                :data="dfkOpinionTableData"
                                :key="4"
                                border
                                height="300"
                                highlight-current-row
                                stripe
                            >
                                <el-table-column type="selection" width="55"> </el-table-column>
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <!--<el-table-column align="center" label="年度" prop="year"></el-table-column>-->
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    align="center"
                                    label="意见内容"
                                    prop="content"
                                >
                                    <template slot-scope="scope">
                                        <el-link @click="showContent(scope.row.content)"
                                            >{{ scope.row.content }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="代表姓名" prop="dbName"></el-table-column>
                                <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                                <el-table-column
                                    :formatter="statusFormatter"
                                    align="center"
                                    label="完成情况"
                                    prop="status"
                                ></el-table-column>
                                <el-table-column align="center" label="操作" width="185">
                                    <template slot-scope="scope">
                                        <el-button size="small" type="primary" @click="check2(scope.row)"
                                            >反馈</el-button
                                        >
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
                        <el-tab-pane label="已反馈" name="second">
                            <hr />
                            <div class="toolView">
                                <el-button size="small" type="text" @click="cancelSubmit">取消反馈</el-button>
                            </div>
                            <el-table
                                ref="multipleOpinionTableFore"
                                :data="yfkOpinionTableData"
                                :key="5"
                                border
                                height="300"
                                highlight-current-row
                                stripe
                            >
                                <el-table-column type="selection" width="55"> </el-table-column>
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <!--<el-table-column align="center" label="年度" prop="year"></el-table-column>-->
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    align="center"
                                    label="意见内容"
                                    prop="content"
                                >
                                    <template slot-scope="scope">
                                        <el-link @click="showContent(scope.row.content)"
                                            >{{ scope.row.content }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="代表姓名" prop="dbName"></el-table-column>
                                <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                                <el-table-column
                                    :formatter="statusFormatter"
                                    align="center"
                                    label="完成情况"
                                    prop="status"
                                ></el-table-column>
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    align="center"
                                    label="反馈意见内容"
                                    prop="feedbackContent"
                                >
                                    <template slot-scope="scope">
                                        <el-link @click="showContent(scope.row.feedbackContent)"
                                            >{{ scope.row.feedbackContent }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="反馈提交时间"
                                    prop="updateTime"
                                ></el-table-column>
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
                            <hr />
                            <el-table
                                ref="multipleTable"
                                :data="cjbOpinionTableData"
                                :key="6"
                                border
                                height="300"
                                highlight-current-row
                                stripe
                            >
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <!--<el-table-column align="center" label="年度" prop="year"></el-table-column>-->
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    align="center"
                                    label="意见内容"
                                    prop="content"
                                >
                                    <template slot-scope="scope">
                                        <el-link @click="showContent(scope.row.content)"
                                            >{{ scope.row.content }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="代表姓名" prop="dbName"></el-table-column>
                                <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                                <el-table-column
                                    :formatter="statusFormatter"
                                    align="center"
                                    label="完成情况"
                                    prop="status"
                                ></el-table-column>
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    align="center"
                                    label="反馈意见内容"
                                    prop="feedbackContent"
                                >
                                    <template slot-scope="scope">
                                        <el-link @click="showContent(scope.row.feedbackContent)"
                                            >{{ scope.row.feedbackContent }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="反馈提交时间"
                                    prop="updateTime"
                                ></el-table-column>
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
            </el-main>
            <el-dialog :close-on-click-modal="false" :visible.sync="showContentVisible" title="内容" width="500px">
                <el-input
                    v-model="content"
                    :autosize="{ minRows: 10, maxRows: 20 }"
                    placeholder="请输入内容"
                    type="textarea"
                >
                </el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showContentVisible = false">关闭</el-button>
                    <el-button v-if="submitContentVisible" type="primary" @click="submitContent">反馈</el-button>
                </div>
            </el-dialog>
        </el-container>
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
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            userId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            departmentId: localStorage.getItem('departmentId'),
            folderList: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                parentId: 'parentId'
            },
            searchForm: {
                year: ''
            },
            flag: 2,
            classifyId: 2,
            dfkOpinionTableData: [],
            yfkOpinionTableData: [],
            cjbOpinionTableData: [],
            pageNo: 1,
            total: 0,
            showContentVisible: false,
            content: '',
            classifyOptions: [],
            activeName: 'first',
            status: 0,
            jb: null,
            opinionIds: '',
            editForm: {
                ids: null,
                id: null,
                fileName: '',
                fileUrl: '',
                feedbackContent: ''
            },
            submitContentVisible: false
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.getDbOpinionClassify()
        this.queryByPage()
    },
    methods: {
        getDbOpinionClassify() {
            let that = this
            that.$axios.get('cloud/entrance/getDbOpinionClassify').then(res => {
                if (res.data.code === 200) {
                    that.folderList = res.data.data
                }
            })
        },
        handleNodeClick(data) {
            this.flag = data.flag
            if (data.parentId) {
                this.classifyId = data.id
            } else {
                this.classifyId = data.children[0].id
            }
            if (this.flag === 2) {
                this.searchForm.content = null
            }
            this.activeName = 'first'
            this.queryByPage()
        },
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                userId: this.userId,
                flag: this.flag,
                classifyId: this.classifyId,
                year: this.searchForm.year,
                status: this.status,
                jb: this.jb,
                _databaseId: this._databaseId,
                departmentId: this.departmentId
            }
            that.$axios.get('cloud/entrance/getFkDbOpinionList', { params }).then(res => {
                if (res.data.code === 200) {
                    if (this.activeName === 'first') {
                        this.dfkOpinionTableData = res.data.data.list
                    }
                    if (this.activeName === 'second') {
                        this.yfkOpinionTableData = res.data.data.list
                    }
                    if (this.activeName === 'third') {
                        this.cjbOpinionTableData = res.data.data.list
                    }
                    this.total = res.data.data.total
                }
            })
        },
        handleClick(tab, event) {
            this.pageNo = 1
            this.year = null
            if (tab.name === 'first') {
                this.activeName = 'first'
                this.status = 0
                this.jb = null
            }
            if (tab.name === 'second') {
                this.activeName = 'second'
                this.status = 1
                this.jb = null
            }
            if (tab.name === 'third') {
                this.activeName = 'third'
                this.status = null
                this.jb = 'jb'
            }
            this.queryByPage()
        },
        handleCommand(command, row, flag) {
            let url
            let fileName
            if (flag === 'feedback') {
                fileName = row.feedbackReportName
                url = row.feedbackReportUrl
            } else {
                fileName = row.reportName
                url = row.reportUrl
            }
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
        handleCurrentChange(val) {
            this.queryByPage()
        },
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
        statusFormatter(obj) {
            if (obj.status === 1) {
                return '已完成'
            } else {
                return '未完成'
            }
        },
        cancelSubmit() {
            this.editForm = {}
            let _selectData
            if (this.flag === 2) {
                _selectData = this.$refs.multipleOpinionTableTwo.selection
            } else {
                _selectData = this.$refs.multipleOpinionTableFore.selection
            }
            if (_selectData.length <= 0) {
                this.$message({
                    message: '请选择代表意见',
                    type: 'warning'
                })
                return
            }
            let relLogIdArray = []
            for (let i = 0; i < _selectData.length; i++) {
                relLogIdArray.push(_selectData[i].id)
            }
            this.editForm.ids = relLogIdArray.join(',')
            this.$confirm('亲，确认要取消下达吗？', '提示', { type: 'warning' }).then(() => {
                this.editSubmit()
            })
        },
        showContent(content) {
            this.content = content
            this.showContentVisible = true
        },
        beforeUpload(row) {
            this.editForm = {}
            if (row) {
                this.editForm.id = row.id
            }
        },
        successHandleEdit(res, file, fileList, row) {
            this.editForm = {}
            if (row) {
                this.editForm.id = row.id
            }
            if (res.code === 200) {
                this.editForm.fileName = file.name
                this.editForm.fileUrl = res.data
                this.editSubmit()
            } else {
                this.$message.error(res.message)
            }
        },
        //编辑
        editSubmit() {
            let that = this
            let params = {
                ids: this.editForm.ids,
                id: this.editForm.id,
                feedbackContent: this.editForm.feedbackContent,
                feedbackReportName: this.editForm.fileName,
                feedbackReportUrl: this.editForm.fileUrl,
                feedbackUserId: this.status === 0 ? this.userId : null,
                status: this.status === 0 ? 1 : 0
            }
            that.$axios.post('cloud/authority/updateRelLog', params).then(res => {
                if (res.data.code === 200) {
                    that.$message.success('反馈成功')
                    that.queryByPage()
                } else {
                    that.$message.error(res.data.message)
                }
            })
        },
        check(e) {
            this.editForm = {}
            let _selectData
            if (this.flag === 2) {
                _selectData = this.$refs.multipleOpinionTableOne.selection
            } else {
                _selectData = this.$refs.multipleOpinionTableThird.selection
            }

            if (_selectData.length <= 0) {
                this.$message({
                    message: '请选择代表意见',
                    type: 'warning'
                })
                e.stopPropagation()
                return
            }
            let relLogIdArray = []
            for (let i = 0; i < _selectData.length; i++) {
                relLogIdArray.push(_selectData[i].id)
            }
            this.editForm.ids = relLogIdArray.join(',')
            if (this.flag === 1) {
                this.showContentVisible = true
                this.submitContentVisible = true
                this.content = null
            }
        },
        submitContent() {
            if (!this.content) {
                this.$message({
                    message: '请输入反馈内容代表意见',
                    type: 'warning'
                })
                return
            }
            this.editForm.feedbackContent = this.content
            this.editSubmit()
            this.showContentVisible = false
            this.submitContentVisible = false
        },
        check2(row) {
            this.editForm = {}
            this.editForm.id = row.id
            this.showContentVisible = true
            this.submitContentVisible = true
            this.content = null
        }
    }
}
</script>
<style scoped>
.container {
    padding: 15px;
}

.el-main {
    border-left: 1px solid #e5e9f2;
    padding: 0px;
    margin-left: 15px;
}

.add-dept {
    border: 1px dashed #e5e9f2;
    border-radius: 6px;
    text-align: center;
    padding: 8px;
    margin-bottom: 15px;
    cursor: pointer;
}

.el-table__body tr.current-row td:not(.is-center) {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}

.el-aside .el-table__body tr.current-row .is-center {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
}

.aside .el-table td {
    border-bottom: 0px solid #ebeef5;
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
