<template>
    <div class="container xzOpinionSum-page">
        <div class="searchView">
            <el-form label-width="80px">
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
                        <el-form-item label="审查部门">
                            <el-select
                                v-model="searchForm.departmentCode"
                                clearable
                                filterable
                                placeholder="请选择审查部门"
                                @change="getOptions(4)"
                            >
                                <el-option
                                    v-for="item in optionsDepartment"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
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
                <el-tab-pane label="小组意见" name="first"></el-tab-pane>
                <el-tab-pane label="意见处理" name="second"></el-tab-pane>
                <el-tab-pane label="意见提交" name="third"></el-tab-pane>
                <el-tab-pane label="已提交" name="fourth"></el-tab-pane>
            </el-tabs>
            <el-table
                v-if="activeName === 'first'"
                :key="1"
                ref="multipleTable1"
                :data="xzcyTableData"
                border
                height="150"
                highlight-current-row
                stripe
                @row-click="handle"
            >
                <el-table-column align="center" label="姓名" prop="name"></el-table-column>
                <el-table-column align="center" label="电话" prop="phone">
                    <template slot-scope="scope">
                        {{ scope.row.phone ? scope.row.phone : '-' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="完成状态" prop="status">
                    <template slot-scope="scope">
                        <div :style="{ color: scope.row.status === 0 ? 'red' : 'blue' }">
                            {{ scope.row.status === 0 ? '未审' : '在审' }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="toolView">
                <el-button
                    v-if="activeName === 'first'"
                    style="font-size:14px"
                    size="small"
                    round
                    type="plain"
                    @click="subOrRevOpinion(2)"
                    >采纳
                </el-button>
                <el-button
                    v-if="activeName === 'second'"
                    style="font-size:14px"
                    size="small"
                    round
                    type="plain"
                    @click="subOrRevOpinion(3)"
                    >剔除
                </el-button>
                <el-button
                    v-if="activeName === 'second'"
                    style="font-size:14px"
                    size="small"
                    round
                    type="plain"
                    @click="scbgShow"
                    >生成报告</el-button
                >
                <el-button
                    v-if="activeName === 'third'"
                    style="font-size:14px"
                    size="small"
                    round
                    type="plain"
                    @click="bgOperation(2)"
                    >删除</el-button
                >
                <el-button
                    v-if="activeName === 'third'"
                    style="font-size:14px"
                    size="small"
                    round
                    type="plain"
                    @click="bgOperation(1)"
                    >提交</el-button
                >
                <el-button
                    v-if="activeName === 'fourth'"
                    style="font-size:14px"
                    size="small"
                    round
                    type="plain"
                    @click="bgOperation(3)"
                    >撤销
                </el-button>
            </div>
            <el-table
                v-if="activeName === 'first' || activeName === 'second'"
                :key="2"
                ref="multipleTable2"
                :row-key="getRowKey"
                :data="tableData"
                border
                highlight-current-row
                stripe
            >
                <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column>
                <el-table-column align="center" label="报表年度" prop="year"></el-table-column>
                <el-table-column align="center" label="审查类型" prop="scTypeName"></el-table-column>
                <el-table-column align="center" label="部门" prop="departmentName"></el-table-column>
                <el-table-column align="center" label="报表" prop="reportName">
                    <template slot-scope="scope">
                        <el-link @click="pageJump(scope.row)">
                            {{ scope.row.reportName }}
                        </el-link>
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
                <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
                <el-table-column align="center" label="意见类型" prop="type">
                    <template slot-scope="scope">
                        <div :style="{ color: 'red' }">
                            {{
                                scope.row.type === '1' ? '符合性情况' : scope.row.type === '2' ? '违规问题' : '建议意见'
                            }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="activeName === 'first'" align="center" label="操作" prop="type" width="300">
                    <template slot-scope="scope">
                        <el-button
                            :disabled="scope.row.type === '1'"
                            round
                            size="small"
                            style="font-size:14px"
                            @click="updateType(scope.row, '1')"
                            >设为符合
                        </el-button>
                        <el-button
                            :disabled="scope.row.type === '2'"
                            size="small"
                            round
                            type="danger"
                            style="font-size:14px"
                            @click="updateType(scope.row, '2')"
                            >设为问题
                        </el-button>
                        <el-button
                            :disabled="scope.row.type === '3'"
                            size="small"
                            round
                            style="font-size:14px"
                            type="warning"
                            @click="updateType(scope.row, '3')"
                            >设为建议
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                v-if="activeName === 'third' || activeName === 'fourth'"
                :key="3"
                ref="multipleTable3"
                :data="tableData2"
                border
                highlight-current-row
                stripe
            >
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column align="center" label="审查类型" prop="scTypeName"></el-table-column>
                <el-table-column align="center" label="审查组" prop="taskGroupName"></el-table-column>
                <el-table-column align="center" label="部门" prop="departmentName"></el-table-column>
                <el-table-column align="center" label="意见概要" prop="content">
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
                <el-table-column align="center" label="汇总详情" prop="content">
                    <template slot-scope="scope">
                        <el-link @click="showMx(scope.row.id)">
                            查看详情
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="报告" prop="reportName">
                    <template slot-scope="scope">
                        <el-dropdown @command="handleCommand($event, scope.row)">
                            <span class="el-dropdown-link">
                                <span>{{ scope.row.reportName }}</span>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="view" icon="el-icon-view">查看 </el-dropdown-item>
                                <el-dropdown-item command="download" icon="el-icon-download">下载 </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
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
        <el-dialog :close-on-click-modal="false" :visible.sync="showContentVisible" title="内容" width="40%">
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
        <el-dialog :close-on-click-modal="false" :visible.sync="showScbgVisible" title="生成报告" width="40%">
            <el-form ref="scbgForm" :model="scbgForm" :rules="formRules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="审查类型" prop="scTypeName">
                            <el-input v-model="scbgForm.scTypeName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="意见概要" prop="outline">
                            <el-input
                                v-model="scbgForm.outline"
                                :autosize="{ minRows: 5, maxRows: 20 }"
                                placeholder="请输入内容"
                                type="textarea"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="scbg">生成报告</el-button>
                <el-button @click="showScbgVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showMxVisible" title="明细列表" width="60%">
            <el-table :data="tableData3" :key="4" border highlight-current-row stripe>
                <el-table-column align="center" label="报表年度" prop="year"></el-table-column>
                <el-table-column align="center" label="部门" prop="departmentName"></el-table-column>
                <el-table-column align="center" label="报表" prop="reportName">
                    <template slot-scope="scope">
                        <el-link @click="pageJump(scope.row)">
                            {{ scope.row.reportName }}
                        </el-link>
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
                <el-table-column align="center" label="发表时间" prop="createTime"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showMxVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog width="100%" :visible.sync="reportShow" :close-on-click-modal="false">
            <div class="report" v-html="html" :style="'height:' + (clientHeight - 300) + 'px'"></div>
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
                departmentCode: undefined,
                userId: undefined
            },
            optionsTask: [],
            optionsGroup: [],
            optionsDepartment: [],
            tableData: [],
            activeName: 'first',
            xzcyTableData: [],
            status: 1,
            pageNo: 1,
            total: 0,
            showContentVisible: false,
            content: '',
            showScbgVisible: false,
            scbgForm: {
                outline: undefined,
                scTypeName: undefined,
                businessConfigId: undefined,
                ids: undefined,
                reportName: undefined,
                businessDetailId: undefined,
                departmentCode: undefined
                // taskName: undefined,
                // taskGroupName: undefined
            },
            formRules: {
                outline: [{ required: true, message: '请输入意见概要', trigger: 'blur' }]
            },
            tableData2: [],
            showMxVisible: false,
            tableData3: [],
            reportShow: false,
            letter: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
                'AA',
                'AB',
                'AC',
                'AD',
                'AE',
                'AF',
                'AG',
                'AH',
                'AI',
                'AJ',
                'AK',
                'AL',
                'AM',
                'AN',
                'AO',
                'AP',
                'AQ',
                'AR',
                'AS',
                'AT',
                'AU',
                'AV',
                'AW',
                'AX',
                'AY',
                'AZ',
                'BA',
                'BB',
                'BC',
                'BD',
                'BE',
                'BF',
                'BG',
                'BH',
                'BI',
                'BJ',
                'BK',
                'BL',
                'BM',
                'BN',
                'BO',
                'BP',
                'BQ',
                'BR',
                'BS',
                'BT',
                'BU',
                'BV',
                'BW',
                'BX',
                'BY',
                'BZ',
                'CA',
                'CB',
                'CC',
                'CD',
                'CE',
                'CF',
                'CG',
                'CH',
                'CI',
                'CJ',
                'CK',
                'CL',
                'CM',
                'CN',
                'CO',
                'CP',
                'CQ',
                'CR',
                'CS',
                'CT',
                'CU',
                'CV',
                'CW',
                'CX',
                'CY',
                'CZ',
                'DA',
                'DB',
                'DC',
                'DD',
                'DE',
                'DF',
                'DG',
                'DH',
                'DI',
                'DJ',
                'DK',
                'DL',
                'DM',
                'DN',
                'DO',
                'DP',
                'DQ',
                'DR',
                'DS',
                'DT',
                'DU',
                'DV',
                'DW',
                'DX',
                'DY',
                'DZ'
            ],
            html: '',
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.queryDepartments()
        this.getOptions(1)
    },
    methods: {
        getOptions(flag) {
            let that = this
            const params = {
                _databaseId: this._databaseId,
                userId: this.userId,
                year: this.searchForm.year,
                isLeader: 'true'
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
                            if (this.activeName === 'first') {
                                this.queryXzcy()
                                this.queryPage()
                            } else if (this.activeName === 'second') {
                                this.queryPage()
                            } else {
                                this.queryReportPage()
                            }
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
                                if (this.activeName === 'first') {
                                    this.queryXzcy()
                                    this.queryPage()
                                } else if (this.activeName === 'second') {
                                    this.queryPage()
                                } else {
                                    this.queryReportPage()
                                }
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
                        if (this.activeName === 'first') {
                            this.queryXzcy()
                            this.queryPage()
                        } else if (this.activeName === 'second') {
                            this.queryPage()
                        } else {
                            this.queryReportPage()
                        }
                    }
                })
            } else if (flag === 3) {
                if (this.activeName === 'first') {
                    this.queryXzcy()
                    this.queryPage()
                } else if (this.activeName === 'second') {
                    this.queryPage()
                } else {
                    this.queryReportPage()
                }
            } else {
                if (this.activeName === 'first' || this.activeName === 'second') {
                    this.queryPage()
                } else {
                    this.queryReportPage()
                }
            }
        },
        queryDepartments() {
            let that = this
            const params = {
                _databaseId: this._databaseId,
                userId: this.userId,
                year: this.searchForm.year
            }
            that.$axios.get('cloud/authority/queryDepartmentByIds', { params }).then(res => {
                if (res.data.code === 200) {
                    this.optionsDepartment = res.data.data
                }
            })
        },
        queryXzcy() {
            let that = this
            const params = {
                _databaseId: this._databaseId,
                groupId: this.searchForm.groupId
            }
            that.$axios.get('cloud/authority/getXzcyByGroupId', { params }).then(res => {
                if (res.data.code === 200) {
                    this.xzcyTableData = res.data.data
                }
            })
        },
        queryPage() {
            let that = this
            const params = {
                _databaseId: this._databaseId,
                year: this.searchForm.year,
                accountId: this.searchForm.userId,
                taskId: this.searchForm.taskId,
                groupId: this.searchForm.groupId,
                opinionType: this.searchForm.opinionType,
                pageSize: 10,
                pageNo: this.pageNo,
                status: this.status,
                departmentCode: this.searchForm.departmentCode,
                flag: 'xzyjhz'
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

                    this.searchForm.userId = undefined
                }
            })
        },
        queryReportPage() {
            let that = this
            const params = {
                _databaseId: this._databaseId,
                year: this.searchForm.year,
                taskId: this.searchForm.taskId,
                groupId: this.searchForm.groupId,
                pageSize: 10,
                pageNo: this.pageNo,
                status: this.status,
                departmentCode: this.searchForm.departmentCode
            }
            that.$axios.get('cloud/authority/getXzReportList', { params }).then(res => {
                if (res.data.code === 200) {
                    this.tableData2 = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        handleClick(tab, event) {
            if (this.$refs.multipleTable2) {
                this.$refs.multipleTable2.clearSelection()
            }
            if (tab.name === 'first') {
                this.status = 1
            }
            if (tab.name === 'second') {
                this.status = 2
            }
            if (tab.name === 'third') {
                this.status = 0
                this.queryReportPage()
                return
            }
            if (tab.name === 'fourth') {
                this.status = -1
                this.queryReportPage()
                return
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
            let selectData = this.$refs.multipleTable2.selection
            if (selectData.length <= 0) {
                this.$message({ message: '请选择至少一条意见', type: 'warning' })
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
                    this.$refs.multipleTable2.clearSelection()
                    if (flag === 2) {
                        this.$message.success('采纳成功')
                    } else {
                        this.$message.success('已剔除')
                    }
                    this.queryPage()
                }
            })
        },
        pageJump(row) {
            this.reportShow = true
            this.queryListById(row)
            // this.$history.push({
            //     path: '/reportList',
            //     query: {
            //         id: row.reportId,
            //         title: row.reportName
            //     }
            // })
        },
        async queryListById(row) {
            var search = {
                _flag: true,
                dept_code: row.departmentCode,
                date_year: row.year
            }
            const params = {
                id: row.reportId,
                search: JSON.stringify(search)
            }
            let res = await this.$axios.post('jellyReport/queryListById', params)
            if (res.data.code == 200) {
                var resultMap = res.data.data

                var workbook = JSON.parse(res.data.data.templateSource)
                var row = workbook.row
                var col = workbook.col
                var rows = workbook.data.rows
                var cols = workbook.data.cols
                var rowHeight = 32
                var colWidth = 120
                var styles = workbook.data.styles
                var merges = workbook.data.merges

                var html =
                    '<table border="1" cellpadding="0" cellspacing="0" bordercolor="#fff" style="border-collapse:collapse;table-layout:fixed;" width="100%">'

                html = html + '<tbody>'

                for (let i = 0; i < row; i++) {
                    var trHtml = '<tr>'
                    var trText = ''
                    var cells = {}
                    if (rows[i]) {
                        cells = rows[i].cells
                    }
                    for (var j = 0; j < col; j++) {
                        var cell = cells[j] || {}
                        var td = {
                            rowspan: 1,
                            colspan: 1,
                            style: { width: colWidth + 'px', height: rowHeight + 'px', 'word-break': 'break-all' }
                        }
                        if (rows[i] && rows[i].height) {
                            td.style.height = rows[i].height + 'px'
                        }
                        if (cols[j] && cols[j].width) {
                            td.style.width = cols[j].width + 'px'
                        }
                        td = this.handleMerge(merges, i, j, td)
                        if (td.rowspan != 0 && td.colspan != 0) {
                            td.style['border'] = 'solid 1px #D3D3D3'
                            td.text = cell.text || ' '

                            var start_reg = td.text.match(/\{\{each.*?\}\}/g)
                            var end_reg = td.text.match(/\{\{\/each*?\}\}/g)
                            if (start_reg || end_reg) {
                                trText = td.text
                            }
                            this.getStyles(cell, td, styles)

                            var styleStr = JSON.stringify(td.style)
                            styleStr = styleStr.replace(/{/g, '')
                            styleStr = styleStr.replace(/}/g, '')
                            styleStr = styleStr.replace(/"/g, '')
                            styleStr = styleStr.replace(/,/g, ';')

                            trHtml = trHtml + `<td rowspan=${td.rowspan} colspan=${td.colspan} style='${styleStr}'>`
                            trHtml = trHtml + td.text
                            trHtml = trHtml + '</td>'
                        }
                    }
                    trHtml = trHtml + '</tr>'
                    if (trText) {
                        html = html + trText
                    } else {
                        html = html + trHtml
                    }
                }
                html = html + '</tbody>'
                html = html + '</table>'
                this.html = this.$template.render(html, resultMap)
            }
        },
        // 获取样式
        getStyles(cell, td, styles) {
            if (cell.style || cell.style === 0) {
                var cellStyle = styles[cell.style]
                for (let styleType in cellStyle) {
                    if (styleType === 'bgcolor') {
                        td.style['backgroundColor'] = cellStyle[styleType]
                    } else if (styleType === 'align') {
                        td.style['text-align'] = cellStyle[styleType]
                    } else if (styleType === 'valign') {
                        td.style['vertical-align'] = cellStyle[styleType]
                    } else if (styleType === 'strike') {
                        td.text = '<strike>' + td.text + '</strike>'
                    } else if (styleType === 'underline') {
                        td.style['text-decoration'] = 'underline'
                    } else if (styleType === 'textwrap') {
                        td.style['word-wrap'] = 'break-word'
                        td.style['word-break'] = 'normal'
                    } else if (styleType === 'font') {
                        if (cellStyle[styleType].size) {
                            td.style['font-size'] = cellStyle[styleType].size + 'px'
                        }
                        if (cellStyle[styleType].bold) {
                            td.style['font-weight'] = 'bold'
                        }
                        if (cellStyle[styleType].italic) {
                            td.style['font-style'] = 'italic'
                        }
                        if (cellStyle[styleType].name) {
                            td.style['font-family'] = cellStyle[styleType].name
                        }
                    } else if (styleType === 'border') {
                        if (cellStyle[styleType].top) {
                            var topBorder = cellStyle[styleType].top
                            if (topBorder[0] === 'thick') {
                                td.style['border-top'] = 'solid 3px ' + topBorder[1]
                            } else if (topBorder[0] === 'thin') {
                                td.style['border-top'] = 'solid 1px ' + topBorder[1]
                            } else if (topBorder[0] === 'medium') {
                                td.style['border-top'] = 'solid 2px ' + topBorder[1]
                            } else if (topBorder[0] === 'dashed') {
                                td.style['border-top'] = 'dashed 1px ' + topBorder[1]
                            } else if (topBorder[0] === 'dotted') {
                                td.style['border-top'] = 'dotted 1px ' + topBorder[1]
                            } else if (topBorder[0] === 'double') {
                                td.style['border-top'] = 'double 1px ' + topBorder[1]
                            }
                        }
                        if (cellStyle[styleType].bottom) {
                            var bottomBorder = cellStyle[styleType].bottom
                            if (bottomBorder[0] === 'thick') {
                                td.style['border-bottom'] = 'solid 3px ' + bottomBorder[1]
                            } else if (bottomBorder[0] === 'thin') {
                                td.style['border-bottom'] = 'solid 1px ' + bottomBorder[1]
                            } else if (bottomBorder[0] === 'medium') {
                                td.style['border-bottom'] = 'solid 2px ' + bottomBorder[1]
                            } else if (bottomBorder[0] === 'dashed') {
                                td.style['border-bottom'] = 'dashed 1px ' + bottomBorder[1]
                            } else if (bottomBorder[0] === 'dotted') {
                                td.style['border-bottom'] = 'dotted 1px ' + bottomBorder[1]
                            } else if (bottomBorder[0] === 'double') {
                                td.style['border-bottom'] = 'double 1px ' + bottomBorder[1]
                            }
                        }
                        if (cellStyle[styleType].left) {
                            var leftBorder = cellStyle[styleType].left
                            if (leftBorder[0] === 'thick') {
                                td.style['border-left'] = 'solid 3px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'solid 3px ' + leftBorder[1]
                            } else if (leftBorder[0] === 'thin') {
                                td.style['border-left'] = 'solid 1px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'solid 1px ' + leftBorder[1]
                            } else if (leftBorder[0] === 'medium') {
                                td.style['border-left'] = 'solid 2px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'solid 2px ' + leftBorder[1]
                            } else if (leftBorder[0] === 'dashed') {
                                td.style['border-left'] = 'dashed 1px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'dashed 2px ' + leftBorder[1]
                            } else if (leftBorder[0] === 'dotted') {
                                td.style['border-left'] = 'dotted 1px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'dotted 2px ' + leftBorder[1]
                            } else if (leftBorder[0] === 'double') {
                                td.style['border-left'] = 'double 1px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'double 2px ' + leftBorder[1]
                            }
                        }
                        if (cellStyle[styleType].right) {
                            var rightBorder = cellStyle[styleType].right
                            if (rightBorder[0] === 'thick') {
                                td.style['border-right'] = 'solid 3px ' + rightBorder[1]
                            } else if (rightBorder[0] === 'thin') {
                                td.style['border-right'] = 'solid 1px ' + rightBorder[1]
                            } else if (rightBorder[0] === 'medium') {
                                td.style['border-right'] = 'solid 2px ' + rightBorder[1]
                            } else if (rightBorder[0] === 'dashed') {
                                td.style['border-right'] = 'dashed 1px ' + rightBorder[1]
                            } else if (rightBorder[0] === 'dotted') {
                                td.style['border-right'] = 'dotted 1px ' + rightBorder[1]
                            } else if (rightBorder[0] === 'double') {
                                td.style['border-right'] = 'double 1px ' + rightBorder[1]
                            }
                        }
                    } else {
                        td.style[styleType] = cellStyle[styleType]
                    }
                }
            }
        },
        //合并单元格
        handleMerge(merges, row, col, td) {
            for (var i = 0; i < merges.length; i++) {
                var startMerge = merges[i].split(':')[0]
                var endMerge = merges[i].split(':')[1]
                var col_start_len = startMerge.replace(/[^\d]/g, '').length
                var col_end_len = endMerge.replace(/[^\d]/g, '').length
                var row_start = Number(startMerge.substr(startMerge.length - col_start_len, startMerge.length))
                var row_end = Number(endMerge.substr(endMerge.length - col_end_len, endMerge.length))
                var col_start = this.letter.indexOf(startMerge.substr(0, startMerge.length - col_start_len))

                var col_end = this.letter.indexOf(endMerge.substr(0, endMerge.length - col_end_len))

                if (row >= row_start - 1 && row <= row_end - 1) {
                    if (col >= col_start && col <= col_end) {
                        if (row === row_start - 1 && col === col_start) {
                            td.rowspan = row_end - row_start + 1
                            td.colspan = col_end - col_start + 1
                            td.style.width =
                                Number(td.style.width.substr(0, td.style.width.length - 2)) * td.colspan + 'px'
                            break
                        } else {
                            td.rowspan = 0
                            td.colspan = 0
                            break
                        }
                    }
                }
            }
            return td
        },
        handle(row, event, column) {
            this.searchForm.userId = row.userId
            this.queryPage()
        },
        updateType(row, type) {
            let that = this
            let params = {
                _databaseId: this._databaseId,
                id: row.id,
                type: type
            }
            that.$axios.post('cloud/authority/updateScOpinionType', params).then(res => {
                if (res.data.code === 200) {
                    this.queryPage()
                }
            })
        },
        scbgShow() {
            let selectData = this.$refs.multipleTable2.selection
            if (selectData.length <= 0) {
                this.$message({ message: '请选择至少一条意见', type: 'warning' })
                return
            }
            let idsArray = []
            for (let i = 0; i < selectData.length; i++) {
                idsArray.push(selectData[i].id)
            }
            this.scbgForm.ids = idsArray.toString()
            // this.scbgForm.taskName = selectData[0].taskName
            this.scbgForm.scTypeName = selectData[0].scTypeName
            // this.scbgForm.taskGroupName = selectData[0].taskGroupName
            this.scbgForm.businessConfigId = selectData[0].businessConfigId
            this.scbgForm.businessDetailId = selectData[0].businessDetailId
            this.scbgForm.reportName =
                selectData[0].year + selectData[0].taskName + selectData[0].taskGroupName + '总报告' + '.docx'
            this.showScbgVisible = true
        },
        scbg() {
            let params = {
                _databaseId: this._databaseId,
                userId: this.userId,
                username: this.username,
                year: this.searchForm.year,
                taskId: this.searchForm.taskId,
                groupId: this.searchForm.groupId,
                // scTypeName: this.scbgForm.scTypeName,
                outline: this.scbgForm.outline,
                reportName: this.scbgForm.reportName,
                ids: this.scbgForm.ids,
                businessConfigId: this.scbgForm.businessConfigId,
                businessDetailId: this.scbgForm.businessDetailId,
                // taskName: this.scbgForm.taskName,
                // taskGroupName: this.scbgForm.taskGroupName,
                status: 0
            }
            let that = this
            this.$refs.scbgForm.validate(valid => {
                if (valid) {
                    that.$axios.post('cloud/authority/generateXzOpinionReport', params).then(res => {
                        if (res.data.code === 200) {
                            this.$refs.multipleTable2.clearSelection()
                            this.$message.success('生成成功')
                            this.queryPage()
                            this.showScbgVisible = false
                        }
                    })
                }
            })
        },
        handleCommand(command, row) {
            if (command === 'download') {
                window.location.href =
                    window.platform.url +
                    'cloud/download/downloadXzOpinionReport?xzReportId=' +
                    row.id +
                    '&year=' +
                    this.searchForm.year +
                    '&_databaseId=' +
                    this._databaseId
            } else if (command === 'view') {
                window.open(
                    this.$axios.defaults.baseURL +
                        'upload/preview?url=' +
                        encodeURIComponent(
                            window.platform.url +
                                'cloud/download/downloadXzOpinionReport?xzReportId=' +
                                row.id +
                                '&year=' +
                                this.searchForm.year +
                                '&_databaseId=' +
                                this._databaseId
                        ) +
                        '&fileName=' +
                        encodeURIComponent(row.reportName)
                )
            }
        },
        bgOperation(flag) {
            let selectData = this.$refs.multipleTable3.selection
            if (selectData.length <= 0) {
                this.$message({ message: '请选择至少一条报告', type: 'warning' })
                return
            }
            let idsArray = []
            for (let i = 0; i < selectData.length; i++) {
                idsArray.push(selectData[i].id)
            }
            let params = {
                _databaseId: this._databaseId,
                ids: idsArray.toString(),
                status: flag
            }
            let that = this
            that.$axios.post('cloud/authority/updateXzbgStatus', params).then(res => {
                if (res.data.code === 200) {
                    if (flag === 1) {
                        this.$message.success('提交成功')
                    } else if (flag === 2) {
                        this.$message.success('删除成功')
                    } else {
                        this.$message.success('撤销成功')
                    }
                    this.queryReportPage()
                }
            })
        },
        showMx(id) {
            let that = this
            const params = {
                _databaseId: this._databaseId,
                xzReportId: id,
                year: this.searchForm.year
            }
            that.$axios.get('cloud/authority/getGrOpinionList', { params }).then(res => {
                if (res.data.code === 200) {
                    this.tableData3 = res.data.data
                    this.showMxVisible = true
                }
            })
        },
        getRowKey(row) {
            return row.id
        }
    }
}
</script>

<style scoped>
.xzOpinionSum-page .searchView {
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
.xzOpinionSum-page .el-tabs__header .el-tabs__item.is-active {
    border-bottom: 1px solid #e4e7ed;
    background: #efefef;
}
.xzOpinionSum-page .toolView {
    margin-bottom: 5px;
    padding-left: 0;
}
.container {
    padding: 15px;
}
.el-table__body tr.current-row td:not(.is-center) {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}
.report {
    padding: 15px;
    overflow: auto;
}
</style>
