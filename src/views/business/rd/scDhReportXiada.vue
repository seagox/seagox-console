<template>
    <div class="container">
        <el-container :style="'height:' + (clientHeight - 125) + 'px'">
            <el-main>
                <div class="searchView">
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
                <div style="border-bottom: 2px solid #e5e9f2; margin: 10px 20px">
                    <el-tabs v-model="status" @tab-click="handleClick">
                        <el-tab-pane label="未下达" name="1"></el-tab-pane>
                        <el-tab-pane label="已下达" name="2"></el-tab-pane>
                        <el-tab-pane label="曾经办" name="3"> </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="toolView" style="padding: 0 10px">
                    <el-button v-if="status == 1" size="mini" type="primary" @click="updateStatus(2)">下达</el-button>
                    <el-button v-if="status == 2" size="mini" type="primary" @click="updateStatus(1)">撤销</el-button>
                    <el-button type="mini" @click="getlogTableData">查看审核流程</el-button>
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table :data="tableData" max-height="500" border stripe highlight-current-row ref="multiple">
                        <el-table-column type="selection" width="55"></el-table-column>
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
            :visible.sync="logDialog"
            center
            title="审核流程"
            :append-to-body="true"
            width="60%"
            :close-on-click-modal="false"
        >
            <el-table ref="multipleLog" :data="logTableData" border height="300" highlight-current-row stripe>
                <el-table-column align="center" label="操作次序" type="index" width="100"></el-table-column>
                <el-table-column align="center" label="操作人员" prop="accountName"></el-table-column>
                <el-table-column align="center" label="审核岗位" prop="roleName"></el-table-column>
                <el-table-column align="center" label="审核状态" prop="status"></el-table-column>
                <el-table-column align="center" label="审核意见" prop="reason"></el-table-column>
                <el-table-column align="center" label="操作时间" prop="createTime"></el-table-column>
            </el-table>
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
            _databaseId: '',
            userId: '',
            userName: '',
            status: '1',
            logDialog: false,
            logTableData: []
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.userId = localStorage.getItem('userId')
        this.userName = localStorage.getItem('name')
        this.queryByPage()
    },
    methods: {
        //页卡切换
        handleClick() {
            this.pageNo = 1
            this.queryByPage()
        },
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
        //查询列表
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                year: this.searchForm.year,
                scType: this.searchForm.scType,
                bgType: this.searchForm.bgType,
                status: this.status,
                _databaseId: this._databaseId
            }
            if (this.status == '3') {
                params.cjb = 1
                params.accountId = this.userId
            }
            that.$axios.post('/cloud/entrance/queryScDhReportList', params).then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
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
        },
        // 下达或撤销
        updateStatus(status) {
            let that = this
            let text = status == 2 ? '下达' : '撤销'
            let _selectData = this.$refs.multiple.selection
            if (_selectData.length <= 0) {
                return that.$message.warning('请至少选择一条数据！')
            }
            this.$confirm('确定要' + text + '所选数据吗？', '提示', { type: 'warning' })
                .then(() => {
                    let idss = []
                    for (let i = 0; i < _selectData.length; i++) {
                        idss.push(_selectData[i].id)
                    }
                    let param = {
                        ids: idss.join(','),
                        status: status,
                        accountId: this.userId,
                        roleName: this.userName,
                        remark: '下达',
                        _databaseId: this._databaseId
                    }
                    this.$axios.post('cloud/entrance/updateScDhReportStatus', param).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success(text + '成功')
                            that.pageNo = 1
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
                .catch(() => {})
        },
        getlogTableData() {
            let that = this
            let _selectData = this.$refs.multiple.selection
            if (_selectData.length != 1) {
                return that.$message.warning('请选择一条数据查看')
            }
            let param = {
                id: _selectData[0].id,
                _databaseId: this._databaseId
            }
            this.$axios.post('cloud/entrance/queryScDhReportLog', param).then(res => {
                if (res.data.code == 200) {
                    this.logTableData = res.data.data
                    this.logDialog = true
                } else {
                    that.$message.error(res.data.message)
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
