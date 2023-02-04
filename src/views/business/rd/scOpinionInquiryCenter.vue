<template>
    <div class="container sc-Opinion-Inquiry-Center">
        <el-container :style="'height:' + (clientHeight - 125) + 'px'">
            <el-main>
                <div class="searchView">
                    <el-form :model="searchForm" label-width="80px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="审查年度">
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
                                <el-form-item label="业务类型">
                                    <el-select
                                        v-model="searchForm.businessConfigId"
                                        clearable
                                        @change="businessConfigChange"
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
                            <el-col :span="6">
                                <el-form-item label="审查阶段">
                                    <el-select v-model="searchForm.businessDetailId" clearable>
                                        <el-option
                                            v-for="item in businessDetails"
                                            :key="item.id + ''"
                                            :label="item.name"
                                            :value="item.id + ''"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="意见类别">
                                    <el-select v-model="searchForm.type" clearable>
                                        <el-option
                                            v-for="item in types"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="查看范围">
                                    <el-select v-model="searchForm.fanwei" clearable>
                                        <el-option
                                            v-for="item in fanweis"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="意见内容">
                                    <el-input clearable v-model.trim="searchForm.content"></el-input>
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
                        <el-table-column prop="year" label="审查年度" width="80" align="center"></el-table-column>
                        <el-table-column
                            prop="scType"
                            label="审查类型"
                            align="center"
                            :formatter="scTypeFormtter"
                        ></el-table-column>
                        <el-table-column align="center" label="报表" prop="reportName">
                            <template slot-scope="scope">
                                <el-link @click="pageJump(scope.row)">
                                    {{ scope.row.reportName }}
                                </el-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="content" label="意见内容" align="center"></el-table-column>
                        <el-table-column
                            prop="createTime"
                            label="发表时间"
                            width="160"
                            align="center"
                        ></el-table-column>
                        <el-table-column
                            prop="scType"
                            label="意见类别"
                            align="center"
                            :formatter="typeFormtter"
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
        <el-dialog width="100%" :visible.sync="reportShow" :close-on-click-modal="false">
            <div class="report" v-html="html" :style="'height:' + (clientHeight - 300) + 'px'"></div>
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
                type: '',
                fanwei: '1',
                businessConfigId: '',
                businessDetailId: '',
                content: ''
            },
            types: [
                { id: '1', name: '符合性意见' },
                { id: '2', name: '违规意见' },
                { id: '3', name: '建议意见' }
            ],
            fanweis: [
                { id: '1', name: '全部' },
                { id: '2', name: '自己' }
            ],
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            tableData: [],
            pageNo: 1,
            total: 0,

            _databaseId: '',
            userId: '',
            userName: '',
            businessConfigs: [],
            businessDetails: [],
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
            html: ''
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.userId = localStorage.getItem('userId')
        this.userName = localStorage.getItem('name')
        this.queryByPage()
        this.queryBusinessConfigs()
    },
    methods: {
        //查询 业务配置
        queryBusinessConfigs() {
            let that = this
            that.$axios.post('/cloud/entrance/getBusinessConfigList', { _databaseId: this._databaseId }).then(res => {
                if (res.data.code == 200) {
                    that.businessConfigs = res.data.data
                }
            })
        },
        //搜索框业务配置切换事件
        businessConfigChange() {
            if (this.searchForm.businessConfigId) {
                this.searchForm.businessDetailId = ''
                this.queryBusinessDetailList()
            }
        },
        //搜索条件查询业务配置的审查阶段
        queryBusinessDetailList() {
            let that = this
            const params = {
                configId: this.searchForm.businessConfigId,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/getDetailListByConfigId', { params }).then(res => {
                if (res.data.code == 200) {
                    that.businessDetails = res.data.data
                }
            })
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
                type: this.searchForm.type,
                businessConfigId: this.searchForm.businessConfigId,
                businessDetailId: this.searchForm.businessDetailId,
                content: this.searchForm.content,
                fanwei: this.searchForm.fanwei,
                accountId: this.userId,
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/inquiryCenterQueryScOpinion', params).then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
        },
        scTypeFormtter(row) {
            return row.businessConfigName + '-' + row.businessDetailName
        },
        typeFormtter(row) {
            if (row.type === '1') {
                return '符合性意见'
            } else if (row.type === '2') {
                return '违规意见'
            } else if (row.type === '3') {
                return '建议意见'
            }
        },
        pageJump(row) {
            this.reportShow = true
            this.queryListById(row)
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
                    '<table border="1" cellpadding="0" cellspacing="0" bordercolor="#fff" style="border-collapse:collapse;table-layout:fixed;position:absolute;left:0;top:0" width="100%">'

                html = html + '<tbody>'
                var thead =
                    '<table border="1" cellpadding="0" cellspacing="0" bordercolor="#fff" style="border-collapse:collapse;table-layout:fixed;background:#fff;position:sticky;left:0;top:0;z-index:100" width="100%">'
                thead = thead + '<tbody >'
                let freezerow = 0
                if (workbook.data.freeze != null && workbook.data.freeze != undefined && workbook.data.freeze != '') {
                    var freezeReg = /\d+/g
                    freezerow = Number(workbook.data.freeze.match(freezeReg)[0])
                }
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

                            //trHtml = trHtml + `<td rowspan=${td.rowspan} colspan=${td.colspan} style='${styleStr}'>`
                            trHtml =
                                trHtml +
                                `<td rowspan=${td.rowspan} colspan=${td.colspan} style='${styleStr}' id="{{$index}}-${j}">`
                            trHtml = trHtml + td.text
                            trHtml = trHtml + '</td>'
                        }
                    }
                    trHtml = trHtml + '</tr>'
                    if (trText) {
                        html = html + trText
                        if (i < freezerow - 1) {
                            //假定固定到的行数为前三行，集成修改该部分
                            thead = thead + trText
                        }
                    } else {
                        html = html + trHtml
                        if (i < freezerow - 1) {
                            thead = thead + trHtml
                        }
                    }
                }
                html = html + '</tbody>'
                html = html + '</table>'
                thead = thead + '</tbody>'
                thead = thead + '</table>'
                //方法二
                this.html = this.$template.render(thead, resultMap) + this.$template.render(html, resultMap)
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
.sc-Opinion-Inquiry-Center .report {
    padding: 15px;
    overflow: auto;
}
/* 为了报表表格中不为居中对齐的格式数据不贴边 */
.report table tr td {
    padding: 0 2px;
}
.report-gn {
    float: right;
    margin-right: 120px;
}
.report-gn-item {
    margin: 10px;
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
