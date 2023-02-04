<template>
    <div class="container grOpinionSub-page">
        <div class="searchView" style="min-width: 950px">
            <el-form label-width="80px" :model="searchForm">
                <el-row :gutter="10">
                    <el-col :span="3">
                        <el-form-item label="任务年度">
                            <el-date-picker
                                v-model="searchForm.year"
                                :clearable="false"
                                align="center"
                                placeholder="请选择任务年度"
                                type="year"
                                value-format="yyyy"
                                @change="getOptions(1)"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="审查任务">
                            <el-select v-model="searchForm.taskId" placeholder="请选择审查任务" @change="getOptions(2)">
                                <el-option
                                    v-for="item in optionsTask"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="审查小组">
                            <el-select
                                v-model="searchForm.groupId"
                                placeholder="请选择审查小组"
                                @change="getOptions(3)"
                            >
                                <el-option
                                    v-for="item in optionsGroup"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="意见类型">
                            <el-select
                                v-model="searchForm.opinionType"
                                placeholder="请选择意见类型"
                                @change="getOptions(4)"
                            >
                                <el-option
                                    v-for="item in optionsOpinionType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
                <el-tab-pane label="未提交" name="first"></el-tab-pane>
                <el-tab-pane label="已提交" name="second"></el-tab-pane>
                <el-tab-pane label="曾经办" name="third"></el-tab-pane>
            </el-tabs>
            <div class="toolView">
                <el-button
                    v-if="activeName === 'first'"
                    style="font-size:14px"
                    size="small"
                    round
                    type="plain"
                    @click="subOrRevOpinion(1)"
                    >提交意见
                </el-button>
                <el-button
                    v-if="activeName === 'second'"
                    round
                    size="small"
                    style="color: red;font-size:14px"
                    type="plain"
                    @click="subOrRevOpinion(0)"
                    >撤销
                </el-button>
                <el-button size="small" round type="plain" style="font-size:14px" @click="showProcess"
                    >查看审核流程</el-button
                >
            </div>
            <el-table ref="multipleTable" :data="tableData" border highlight-current-row stripe>
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column align="center" label="报表年度" prop="year"></el-table-column>
                <el-table-column align="center" label="审查类型" prop="scTypeName"></el-table-column>
                <el-table-column align="center" label="报表" prop="reportName"></el-table-column>
                <el-table-column align="center" label="部门" prop="departmentName"></el-table-column>
                <el-table-column align="center" label="项目" prop="projectName">
                    <template slot-scope="scope">
                        <el-link @click="pageJump(scope.row)" v-if="scope.row.taskStatus === '3'">
                            {{ scope.row.projectName }}
                        </el-link>
                        <div v-if="scope.row.taskStatus !== '3'">-</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="意见内容" prop="content">
                    <template slot-scope="scope">
                        <el-link @click="showContent(scope.row.content)">
                            {{
                                scope.row.content.length > 10
                                    ? scope.row.content.substring(0, 7) + '...'
                                    : scope.row.content
                            }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="意见类型" prop="type">
                    <template slot-scope="scope">
                        <div :style="{ color: 'red' }">
                            {{
                                scope.row.type === '1' ? '符合性情况' : scope.row.type === '2' ? '违规问题' : '建议意见'
                            }}
                        </div>
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
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showContentVisible" title="意见内容" width="40%">
            <el-input
                v-model="content"
                :autosize="{ minRows: 10, maxRows: 20 }"
                placeholder="请输入内容"
                type="textarea"
            >
            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showContentVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showProcessVisible" title="查看审核流程" width="40%">
            <el-table :data="processTableData" border highlight-current-row stripe>
                <el-table-column align="center" label="操作次序" type="index" width="50"></el-table-column>
                <el-table-column align="center" label="操作人员" prop="roleName"></el-table-column>
                <el-table-column align="center" label="审核状态" prop="status"></el-table-column>
                <el-table-column align="center" label="审核意见" prop="reason">
                    <template slot-scope="scope">
                        {{ scope.row.reason ? scope.row.reason : '-' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作时间" prop="createTime"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showProcessVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            _databaseId: '',
            userId: localStorage.getItem('userId'),
            username: localStorage.getItem('name'),
            searchForm: {
                year: new Date().getFullYear().toString(),
                taskId: undefined,
                groupId: undefined,
                opinionType: undefined
            },
            optionsTask: [],
            optionsGroup: [],
            optionsOpinionType: [
                {
                    value: undefined,
                    label: '全部'
                },
                {
                    value: 1,
                    label: '符合性情况'
                },
                {
                    value: 2,
                    label: '违规问题'
                },
                {
                    value: 3,
                    label: '建议意见'
                }
            ],
            activeName: 'first',
            status: 0,
            tableData: [],
            pageNo: 1,
            total: 0,
            showContentVisible: false,
            content: '',
            showProcessVisible: false,
            processTableData: []
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.getOptions(1)
    },
    methods: {
        getOptions(flag) {
            let that = this
            const params = {
                _databaseId: this._databaseId,
                userId: this.userId,
                year: this.searchForm.year
            }
            if (flag === 1) {
                that.$axios.get('cloud/authority/getOpinionsTask', { params }).then(res => {
                    if (res.data.code === 200) {
                        this.optionsTask = res.data.data
                        if (this.optionsTask && this.optionsTask.length > 0) {
                            this.searchForm.taskId = this.optionsTask[0].id
                            params.taskId = this.optionsTask[0].id
                        } else {
                            this.optionsGroup = []
                            this.searchForm.taskId = undefined
                            this.searchForm.groupId = undefined
                            this.queryPage()
                            return
                        }
                        that.$axios.get('cloud/authority/getOpinionsGroup', { params }).then(res => {
                            if (res.data.code === 200) {
                                this.optionsGroup = res.data.data
                                if (this.optionsGroup && this.optionsGroup.length > 0) {
                                    this.searchForm.groupId = this.optionsGroup[0].id
                                } else {
                                    this.searchForm.groupId = undefined
                                }
                                this.queryPage()
                            }
                        })
                    }
                })
            } else if (flag === 2) {
                params.taskId = this.searchForm.taskId
                that.$axios.get('cloud/authority/getOpinionsGroup', { params }).then(res => {
                    if (res.data.code === 200) {
                        this.optionsGroup = res.data.data
                        if (this.optionsGroup && this.optionsGroup.length > 0) {
                            this.searchForm.groupId = this.optionsGroup[0].id
                        } else {
                            this.searchForm.groupId = undefined
                        }
                        this.queryPage()
                    }
                })
            } else {
                this.queryPage()
            }
        },
        queryPage() {
            let that = this
            const params = {
                _databaseId: this._databaseId,
                userId: this.userId,
                year: this.searchForm.year,
                taskId: this.searchForm.taskId,
                groupId: this.searchForm.groupId,
                opinionType: this.searchForm.opinionType,
                pageSize: 10,
                pageNo: this.pageNo,
                status: this.status,
                flag: 'gryjtj'
            }
            that.$axios.get('cloud/authority/getGrOpinionList', { params }).then(res => {
                if (res.data.code === 200) {
                    if (res.data.data) {
                        this.tableData = res.data.data.list
                        this.total = res.data.data.total
                    } else {
                        this.tableData = []
                        this.total = 0
                    }
                }
            })
        },
        handleClick(tab, event) {
            if (tab.name === 'first') {
                this.status = 0
            }
            if (tab.name === 'second') {
                this.status = 1
            }
            if (tab.name === 'third') {
                this.status = -1
            }
            this.queryPage()
        },
        handleCurrentChange() {
            this.queryPage()
        },
        showContent(content) {
            this.content = content
            this.showContentVisible = true
        },
        subOrRevOpinion(flag) {
            let selectData = this.$refs.multipleTable.selection
            if (selectData.length <= 0) {
                this.$message({ message: '请选择至少一条意见进行提交', type: 'warning' })
                return
            }
            let params = {
                _databaseId: this._databaseId,
                userId: this.userId,
                username: this.username,
                status: flag
            }
            let idsArray = []
            for (let i = 0; i < selectData.length; i++) {
                idsArray.push(selectData[i].id)
            }
            params.ids = idsArray.toString()
            let that = this
            that.$axios.post('cloud/authority/updateGrOpinionStatus', params).then(res => {
                if (res.data.code === 200) {
                    if (flag === 1) {
                        this.$message.success('提交成功')
                    } else {
                        this.$message.success('已撤销')
                    }
                    this.queryPage()
                }
            })
        },
        showProcess() {
            let selectData = this.$refs.multipleTable.selection
            if (selectData.length !== 1) {
                this.$message({ message: '请选择一条意见进行查看', type: 'warning' })
                return
            }
            let that = this
            let params = {
                _databaseId: this._databaseId,
                opinionId: selectData[0].id
            }
            that.$axios.post('cloud/authority/getGrOpinionLog', params).then(res => {
                if (res.data.code === 200) {
                    this.processTableData = res.data.data
                    this.showProcessVisible = true
                }
            })
        },
        pageJump(row) {
            this.$history.push({
                path: '/runCode',
                query: {
                    path: 'reportShow',
                    title: row.menuTitle,
                    scMenuId: row.scMenuId,
                    urlReportId: row.reportId,
                    year: row.year,
                    departmentCode: row.departmentCode
                }
            })
        }
    }
}
</script>

<style scoped>
.grOpinionSub-page .searchView {
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
.grOpinionSub-page .el-tabs__header .el-tabs__item.is-active {
    border-bottom: 1px solid #e4e7ed;
    background: #efefef;
}
.grOpinionSub-page .toolView {
    margin-bottom: 5px;
    padding-left: 0;
}
.container {
    padding: 5px;
}
</style>
