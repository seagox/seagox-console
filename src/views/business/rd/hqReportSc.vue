<template>
    <div class="container wlc">
        <div class="table">
            <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
                <el-tab-pane label="审查意见" name="first"></el-tab-pane>
                <el-tab-pane label="审查报告" name="second"></el-tab-pane>
            </el-tabs>
            <div class="searchView">
                <el-form label-width="80px">
                    <el-row :gutter="10">
                        <el-col :span="3">
                            <el-form-item label="审查年度">
                                <el-date-picker
                                    v-model="searchForm.year"
                                    :clearable="false"
                                    align="center"
                                    placeholder="审查年度"
                                    type="year"
                                    value-format="yyyy"
                                    @change="getOptions(1)"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="业务类型">
                                <el-select
                                    v-model="searchForm.businessConfigId"
                                    placeholder="请选择业务类型"
                                    @change="getOptions(2)"
                                >
                                    <el-option
                                        v-for="item in businessConfigs"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="审查阶段">
                                <el-select
                                    v-model="searchForm.businessDetailId"
                                    placeholder="请选择审查阶段"
                                    @change="getOptions(3)"
                                >
                                    <el-option
                                        v-for="item in businessDetails"
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
                        <el-col :span="5">
                            <el-form-item label="意见来源" v-if="activeName === 'first'">
                                <el-select v-model="searchForm.source" placeholder="意见来源" @change="getOptions(5)">
                                    <el-option
                                        v-for="item in optionsSource"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="意见内容" v-if="activeName === 'first'">
                                <el-input
                                    v-model="searchForm.content"
                                    clearable
                                    placeholder="请输入意见内容"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" v-if="activeName === 'first'">
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
            <div class="toolView">
                <el-button
                    v-if="activeName === 'first'"
                    style="font-size:14px"
                    size="small"
                    round
                    type="plain"
                    @click="scbgShow"
                    >生成报告</el-button
                >
                <el-button
                    v-if="activeName === 'second'"
                    style="font-size:14px"
                    size="small"
                    round
                    type="plain"
                    @click="bgOperation(-33)"
                    >删除</el-button
                >
            </div>
            <el-table
                v-if="activeName === 'first'"
                :key="2"
                ref="multipleTable2"
                :row-key="getRowKey"
                :data="tableData2"
                border
                highlight-current-row
                stripe
            >
                <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column>
                <el-table-column align="center" label="审查年度" prop="year"></el-table-column>
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
                <el-table-column align="center" label="意见来源" prop="source"></el-table-column>
                <el-table-column align="center" label="提交人" prop="userName"></el-table-column>
                <el-table-column align="center" label="发表时间" prop="createTime"></el-table-column>
                <el-table-column align="center" label="意见类别" prop="type">
                    <template slot-scope="scope">
                        <div :style="{ color: 'red' }">
                            {{
                                scope.row.type === '1' ? '符合性情况' : scope.row.type === '2' ? '违规问题' : '建议意见'
                            }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" prop="type" width="300">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.type === '1'" size="small" @click="updateType(scope.row, '1')"
                            >设为符合
                        </el-button>
                        <el-button
                            :disabled="scope.row.type === '2'"
                            size="small"
                            type="danger"
                            @click="updateType(scope.row, '2')"
                            >设为问题
                        </el-button>
                        <el-button
                            :disabled="scope.row.type === '3'"
                            size="small"
                            type="warning"
                            @click="updateType(scope.row, '3')"
                            >设为建议
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                v-if="activeName === 'second'"
                :key="3"
                :data="tableData3"
                ref="multipleTable3"
                border
                highlight-current-row
                stripe
            >
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column align="center" label="审查年度" prop="year"></el-table-column>
                <el-table-column align="center" label="审查类型" prop="scTypeName"></el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    label="意见概要"
                    prop="content"
                ></el-table-column>
                <el-table-column align="center" label="审查报告" prop="reportName">
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
                <el-table-column align="center" label="意见来源" prop="source"></el-table-column>
                <el-table-column align="center" label="报告人" prop="userName"></el-table-column>
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
                    <el-col :span="12">
                        <el-form-item label="报告名称" prop="reportName">
                            <el-input v-model="scbgForm.reportName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="scbg">生成报告</el-button>
                <el-button @click="showScbgVisible = false">关闭</el-button>
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
                departmentCode: undefined,
                content: undefined,
                source: 1,
                businessConfigId: undefined,
                businessDetailId: undefined
            },
            businessConfigs: [],
            businessDetails: [],
            optionsDepartment: [],
            optionsSource: [
                {
                    id: 1,
                    name: '意见批注'
                }
            ],
            activeName: 'first',
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
                businessDetailId: undefined
            },
            formRules: {
                outline: [{ required: true, message: '请输入意见概要', trigger: 'blur' }]
            },
            tableData2: [],
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
        this.queryConfig()
    },
    methods: {
        getOptions(flag) {
            let that = this
            if (flag === 2) {
                const params = {
                    _databaseId: this._databaseId,
                    configId: this.searchForm.businessConfigId
                }
                that.$axios.get('cloud/entrance/getDetailListByConfigId', { params }).then(res => {
                    if (res.data.code === 200) {
                        that.businessDetails = res.data.data
                        if (this.businessDetails && this.businessDetails.length > 0) {
                            this.searchForm.businessDetailId = this.businessDetails[0].id
                            if (this.activeName === 'first') {
                                this.queryPage()
                            } else {
                                this.queryReportPage()
                            }
                        } else {
                            if (this.activeName === 'first') {
                                this.tableData2 = []
                                this.total = 0
                            } else {
                                this.tableData3 = []
                                this.total = 0
                            }
                        }
                    }
                })
            } else {
                if (this.activeName === 'first') {
                    this.queryPage()
                } else {
                    this.queryReportPage()
                }
            }
        },
        queryDepartments() {
            let that = this
            const params = {
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/authority/queryDepartmentByIds', { params }).then(res => {
                if (res.data.code === 200) {
                    this.optionsDepartment = res.data.data
                }
            })
        },
        queryConfig() {
            let that = this
            const params = {
                _databaseId: this._databaseId
            }
            that.$axios.post('cloud/entrance/getBusinessConfigList', params).then(res => {
                if (res.data.code === 200) {
                    that.businessConfigs = res.data.data
                    if (this.businessConfigs && this.businessConfigs.length > 0) {
                        this.searchForm.businessConfigId = this.businessConfigs[0].id
                        params.configId = this.businessConfigs[0].id
                        that.$axios.get('cloud/entrance/getDetailListByConfigId', { params }).then(res => {
                            if (res.data.code === 200) {
                                that.businessDetails = res.data.data
                                if (this.businessDetails && this.businessDetails.length > 0) {
                                    this.searchForm.businessDetailId = this.businessDetails[0].id
                                    this.queryPage()
                                } else {
                                    this.tableData2 = []
                                    this.total = 0
                                }
                            }
                        })
                    } else {
                        this.tableData2 = []
                        this.total = 0
                    }
                }
            })
        },
        queryPage() {
            let that = this
            debugger
            const params = {
                _databaseId: this._databaseId,
                year: this.searchForm.year,
                departmentCode: this.searchForm.departmentCode,
                businessConfigId: this.searchForm.businessConfigId,
                businessDetailId: this.searchForm.businessDetailId,
                content: this.searchForm.content,
                source: this.searchForm.source,
                pageNo: this.pageNo,
                pageSize: 10
            }
            that.$axios.get('cloud/authority/getNoProGrOpinionList', { params }).then(res => {
                if (res.data.code === 200) {
                    this.tableData2 = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        queryReportPage() {
            let that = this
            const params = {
                _databaseId: this._databaseId,
                userId: this.userId,
                year: this.searchForm.year,
                departmentCode: this.searchForm.departmentCode,
                businessConfigId: this.searchForm.businessConfigId,
                businessDetailId: this.searchForm.businessDetailId,
                pageSize: 10,
                pageNo: this.pageNo
            }
            that.$axios.get('cloud/authority/getNoProHqReportList', { params }).then(res => {
                if (res.data.code === 200) {
                    this.tableData3 = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        handleClick(tab, event) {
            if (tab.name === 'first') {
                this.queryPage()
            }
            if (tab.name === 'second') {
                this.queryReportPage()
            }
        },
        handleCurrentChange() {
            this.queryPage()
        },
        showContent(content) {
            this.content = content
            this.showContentVisible = true
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
            debugger
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
            this.scbgForm.scTypeName = selectData[0].scTypeName
            this.scbgForm.businessConfigId = selectData[0].businessConfigId
            this.scbgForm.businessDetailId = selectData[0].businessDetailId
            this.scbgForm.reportName = selectData[0].year + selectData[0].scTypeName + '总报告' + '.docx'
            this.showScbgVisible = true
        },
        scbg() {
            let params = {
                _databaseId: this._databaseId,
                userId: this.userId,
                username: this.username,
                year: this.searchForm.year,
                departmentCode: this.searchForm.departmentCode,
                outline: this.scbgForm.outline,
                reportName: this.scbgForm.reportName,
                ids: this.scbgForm.ids,
                businessConfigId: this.scbgForm.businessConfigId,
                businessDetailId: this.scbgForm.businessDetailId,
                status: 6
            }
            let that = this
            this.$refs.scbgForm.validate(valid => {
                if (valid) {
                    that.$axios.post('cloud/authority/generateHqOpinionReport', params).then(res => {
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
            that.$axios.post('cloud/authority/updateHqbgStatus', params).then(res => {
                if (res.data.code === 200) {
                    this.$message.success('删除成功')
                    this.queryReportPage()
                }
            })
        },
        handleSearch() {
            if (this.activeName === 'first') {
                this.queryPage()
            } else if (this.activeName === 'second') {
                this.queryPage()
            }
        },
        getRowKey(row) {
            return row.id
        }
    }
}
</script>

<style scoped>
.container {
    padding: 15px;
}
.el-table__body tr.current-row td:not(.is-center) {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}

.wlc .report {
    padding: 15px;
    overflow: auto;
}
.wlc .searchView {
    padding-top: 10px !important;
    padding-left: 0 !important;
    margin-top: 0px !important;
    height: 36px !important;
    overflow: hidden !important;
}
.wlc .table {
    padding: 10px 0;
}
.wlc .el-tabs__header .el-tabs__item.is-active {
    border-bottom: 1px solid #e4e7ed;
    background: #efefef;
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
.wlc .toolView {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-left: 0;
}
</style>
