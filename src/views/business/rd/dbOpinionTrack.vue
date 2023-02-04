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
                                <el-form-item label="查看范围">
                                    <el-select v-model="searchForm.range" placeholder="请选择">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col v-if="flag === 1" :span="8">
                                <el-form-item label="意见内容">
                                    <el-input
                                        v-model="searchForm.content"
                                        clearable
                                        placeholder="请输入意见内容"
                                    ></el-input>
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
                    <!--列表-->
                    <el-table
                        v-if="flag === 2"
                        :data="opinionTableData"
                        border
                        height="300"
                        highlight-current-row
                        stripe
                        @row-click="handle"
                    >
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
                        <el-table-column
                            :formatter="statusFormatter"
                            align="center"
                            label="完成情况"
                            prop="status"
                        ></el-table-column>
                        <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
                        <el-table-column align="center" label="反馈提交时间" prop="updateTime"></el-table-column>
                    </el-table>
                    <el-table
                        v-if="flag === 1"
                        :data="opinionTableData"
                        border
                        height="300"
                        highlight-current-row
                        stripe
                        @row-click="handle"
                    >
                        <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                        <el-table-column align="center" label="年度" prop="year"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" label="意见内容" prop="content">
                            <template slot-scope="scope">
                                <el-link @click="showContent(scope.row.content)">{{ scope.row.content }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="代表姓名" prop="dbName"></el-table-column>
                        <el-table-column
                            :formatter="statusFormatter"
                            align="center"
                            label="完成情况"
                            prop="status"
                        ></el-table-column>
                        <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
                        <el-table-column align="center" label="反馈提交时间" prop="updateTime"></el-table-column>
                        <el-table-column align="center" label="操作" width="185">
                            <template slot-scope="scope">
                                <el-link @click="showDialog(scope.row)"
                                    ><i class="el-icon-view el-icon--right"></i>
                                </el-link>
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
                </div>
                <div class="table">
                    <span>整改部门</span>
                    <hr />
                    <!--列表-->
                    <el-table v-if="flag === 2" :data="relLogTableData" border highlight-current-row stripe>
                        <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                        <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                        <el-table-column
                            :formatter="statusFormatter"
                            align="center"
                            label="完成情况"
                            prop="status"
                        ></el-table-column>
                        <el-table-column align="center" label="反馈报告" prop="feedbackReportName">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.feedbackReportName }}</span>
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
                        <el-table-column align="center" label="反馈提交时间" prop="updateTime"></el-table-column>
                    </el-table>
                    <el-table v-if="flag === 1" :data="relLogTableData" border highlight-current-row stripe>
                        <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
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
                        <el-table-column align="center" label="反馈提交时间" prop="updateTime"></el-table-column>
                    </el-table>
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
                    <el-button type="primary" @click="showContentVisible = false">关闭</el-button>
                </div>
            </el-dialog>
            <!--显示-->
            <el-dialog :close-on-click-modal="false" :visible.sync="showFormVisible" width="850px">
                <el-form ref="editForm" :model="showForm" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="代表姓名" prop="name">
                                <el-input v-model="showForm.userInfo.name" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="基本构成" prop="jbgc">
                                <el-input v-model="showForm.userInfo.jbgc" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="性别" prop="sex">
                                <el-select v-model="showForm.userInfo.sex" disabled>
                                    <el-option
                                        v-for="item in sexOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系电话" prop="phone">
                                <el-input v-model="showForm.userInfo.phone" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="现任职务" prop="position">
                                <el-input v-model="showForm.userInfo.position" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="所在单位" prop="departmentName">
                                <el-input v-model="showForm.userInfo.departmentName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="意见分类" prop="OpinionClassify">
                                <el-select v-model="showForm.classifyId" placeholder="请选择">
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
                        <el-col :span="24">
                            <el-form-item label="具体意见" prop="content">
                                <el-input
                                    v-model="showForm.content"
                                    :autosize="{ minRows: 5, maxRows: 20 }"
                                    placeholder="请输入内容"
                                    type="textarea"
                                >
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="联名代表" prop="lmdb">
                                <el-select v-model="showForm.jointly" disabled filterable multiple placeholder=" ">
                                    <el-option
                                        v-for="item in dbTableData"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showFormVisible = false">取消</el-button>
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
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            userId: localStorage.getItem('userId'),
            folderList: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                parentId: 'parentId'
            },
            options: [
                {
                    value: 1,
                    label: '所有'
                },
                {
                    value: 2,
                    label: '仅看自己'
                }
            ],
            searchForm: {
                year: '',
                range: 1,
                content: ''
            },
            flag: 2,
            classifyId: 2,
            opinionTableData: [],
            relLogTableData: [],
            pageNo: 1,
            total: 0,
            showContentVisible: false,
            content: '',
            showFormVisible: false,
            showForm: {
                id: null,
                content: '',
                classifyId: null,
                jointly: null,
                userInfo: {}
            },
            classifyOptions: [],
            sexOptions: [
                {
                    id: 1,
                    name: '男'
                },
                {
                    id: 2,
                    name: '女'
                }
            ],
            dbTableData: []
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.getDbOpinionClassify()
        this.queryByPage()
        this.getDbList()
    },
    methods: {
        getDbList() {
            let that = this
            that.$axios.get('cloud/entrance/getDbList').then(res => {
                if (res.data.code === 200) {
                    that.dbTableData = res.data.data
                }
            })
        },
        getDbOpinionClassify() {
            let that = this
            that.$axios.get('cloud/entrance/getDbOpinionClassify').then(res => {
                if (res.data.code === 200) {
                    that.folderList = res.data.data
                }
            })
        },
        getDbOpinionClassify1() {
            let that = this
            const params = {
                flag: 1,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbOpinionClassify', { params }).then(res => {
                if (res.data.code === 200) {
                    that.classifyOptions = res.data.data
                }
            })
        },
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                userId: this.userId,
                flag: this.flag,
                classifyId: this.classifyId,
                range: this.searchForm.range,
                content: this.searchForm.content,
                year: this.searchForm.year,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbOpinionList', { params }).then(res => {
                if (res.data.code === 200) {
                    that.opinionTableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
        },
        handle(row, event, column) {
            let that = this
            const params = {
                dbOpinionId: row.id,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbOpinionRelLog', { params }).then(res => {
                if (res.data.code === 200) {
                    that.relLogTableData = res.data.data
                }
            })
        },
        handleNodeClick(data) {
            this.opinionTableData = []
            this.relLogTableData = []
            this.flag = data.flag
            if (data.parentId) {
                this.classifyId = data.id
            } else {
                this.classifyId = data.children[0].id
            }
            if (this.flag === 2) {
                this.searchForm.content = null
            }
            this.queryByPage()
        },
        handleSearch() {
            this.relLogTableData = []
            this.pageNo = 1
            if (this.flag === 2) {
                this.searchForm.content = null
            }
            this.queryByPage()
        },
        handleCurrentChange(val) {
            this.queryByPage()
        },
        statusFormatter(obj) {
            if (obj.status === 1) {
                return '已完成'
            } else {
                return '未完成'
            }
        },
        handleCommand(command, row) {
            let url
            let fileName
            if (row.reportUrl) {
                url = row.reportUrl
            } else {
                url = row.feedbackReportUrl
            }
            if (row.reportName) {
                fileName = row.reportName
            } else {
                fileName = row.feedbackReportName
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
        showContent(content) {
            this.content = content
            this.showContentVisible = true
        },
        //显示编辑界面
        showDialog(row) {
            this.getDbOpinionClassify1()
            this.getUserInfo(row.userId, row)
            this.showFormVisible = true
        },
        getUserInfo(userId, row) {
            let that = this
            const params = {
                id: userId,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbUserInfo', { params }).then(res => {
                if (res.data.code === 200) {
                    that.showForm.userInfo = res.data.data
                    that.showForm.id = row.id
                    that.showForm.content = row.content
                    that.showForm.classifyId = row.classifyId
                    if (row.jointly) {
                        that.showForm.jointly = JSON.parse(row.jointly)
                    } else {
                        that.showForm.jointly = null
                    }
                }
            })
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
