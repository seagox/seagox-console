<template>
    <div style="padding: 0px 15px">
        <div class="toolView">
            <el-button
                type="text"
                icon="el-icon-download"
                @click="handleExport"
                size="small"
                v-if="resultMap.exportPath.length != 0"
                >导出</el-button
            >
            <el-button type="text" icon="el-icon-printer" @click="handlePrint" size="small">打印</el-button>
        </div>
        <div class="searchView" v-if="searchSize != 0">
            <el-form label-width="90px">
                <el-row>
                    <el-col :span="24 / offset" v-for="(item, index) in searchJsonList" :key="index">
                        <el-form-item
                            :label="item.desc"
                            v-if="index > offset - 1 && !moreFlag ? false : true && item.status"
                        >
                            <el-input
                                v-model="item.value"
                                :placeholder="'请输入' + item.desc"
                                clearable
                                v-if="item.type === 'input'"
                            >
                            </el-input>
                            <el-select
                                v-model="item.value"
                                :placeholder="'请选择' + item.desc"
                                clearable
                                filterable
                                :multiple="item.multiple"
                                v-if="item.type === 'select'"
                            >
                                <el-option
                                    v-for="item in item.sourceOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                                >
                                </el-option>
                            </el-select>
                            <el-date-picker
                                v-model="item.value"
                                :type="item.dateType.split('|')[0]"
                                :value-format="item.dateType.split('|')[1]"
                                :placeholder="'请选择' + item.desc"
                                clearable
                                align="center"
                                v-if="item.type === 'datePicker'"
                            >
                            </el-date-picker>
                            <el-select
                                v-model="item.value"
                                :placeholder="'请选择' + item.desc"
                                clearable
                                filterable
                                :multiple="item.multiple"
                                v-if="item.type === 'company'"
                            >
                                <el-option
                                    v-for="item in item.sourceOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-select
                                v-model="item.value"
                                :placeholder="'请选择' + item.desc"
                                clearable
                                filterable
                                :multiple="item.multiple"
                                v-if="item.type === 'department'"
                            >
                                <el-option
                                    v-for="item in item.sourceOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-cascader
                                v-model="item.value"
                                :placeholder="'请选择' + item.desc"
                                clearable
                                filterable
                                :props="{
                                    checkStrictly: true,
                                    emitPath: false,
                                    multiple: item.multiple,
                                    value: 'code',
                                    label: 'name'
                                }"
                                v-if="item.type === 'cascader'"
                                :options="item.sourceOptions"
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <div style="margin-left: 15px">
                            <el-button type="primary" icon="el-icon-search" @click.native="handleSearch"
                                >查询</el-button
                            >
                            <el-button icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
                            <el-button
                                type="text"
                                icon="el-icon-arrow-down"
                                @click="moreFlag = true"
                                v-if="searchJsonList.length > offset && !moreFlag"
                            ></el-button>
                            <el-button
                                type="text"
                                icon="el-icon-arrow-up"
                                @click="moreFlag = false"
                                v-else-if="searchJsonList.length > offset && moreFlag"
                            ></el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="report" v-html="html" :style="'height:' + (clientHeight - 225) + 'px'"></div>
        <!-- id="print" -->
        <!-- 上面显示的使用了两个table会出现位置错位所以追加一个table用来打印功能 -->
        <div
            class="report-print"
            v-show="false"
            v-html="printHtml"
            id="print"
            :style="'height:' + (clientHeight - 225) + 'px'"
        ></div>
    </div>
</template>

<script>
import print from '@/plugins/print.js'
export default {
    data() {
        return {
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            searchSize: 0,
            searchJsonList: [],
            resultMap: {
                exportPath: []
            },
            regions: {},
            offset: 3,
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
            props: {
                value: 'code',
                label: 'name'
            },
            printHtml: ''
        }
    },
    created() {
        let clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        if (clientWidth > 1440) {
            this.offset = 4
        } else {
            this.offset = 3
        }
        this.regions = JSON.parse(localStorage.getItem('regions'))
        this.queryListById(false)
    },
    methods: {
        async queryListById(searchFlag) {
            var search = {}
            for (var i = 0; i < this.searchJsonList.length; i++) {
                if (Array.isArray(this.searchJsonList[i].value)) {
                    search[this.searchJsonList[i].field] = this.searchJsonList[i].value.toString()
                } else {
                    search[this.searchJsonList[i].field] = this.searchJsonList[i].value
                        ? this.searchJsonList[i].value
                        : ''
                }
            }
            if (this.$route.query.search) {
                Object.assign(search, this.$route.query.search)
            }
            search._flag = !searchFlag
            const params = {
                id: this.$route.query.id,
                search: JSON.stringify(search)
            }
            let res = await this.$axios.post('jellyReport/queryListById', params)
            if (res.data.code == 200) {
                if (!searchFlag) {
                    this.searchJsonList = JSON.parse(res.data.data.searchJson)
                    for (let k = 0; k < this.searchJsonList.length; k++) {
                        if (this.searchJsonList[k].type === 'select') {
                            this.queryByClassifyId(this.searchJsonList[k].source, k)
                        } else if (this.searchJsonList[k].type === 'company') {
                            this.queryCompany(k)
                        } else if (this.searchJsonList[k].type === 'department') {
                            this.queryDepartment(k)
                        } else if (this.searchJsonList[k].type === 'cascader') {
                            this.queryCascader(this.searchJsonList[k].source, this.searchJsonList[k].rule, k)
                        }
                        if (this.searchJsonList[k].status) {
                            this.searchSize += 1
                        }
                    }
                }

                this.resultMap = res.data.data

                var workbook = JSON.parse(res.data.data.templateSource)
                var row = workbook.row
                var col = workbook.col
                var rows = workbook.data.rows
                var cols = workbook.data.cols
                var rowHeight = 32
                var colWidth = 120
                var styles = workbook.data.styles
                var merges = workbook.data.merges

                var html_table =
                    '<table border="1" cellpadding="0" cellspacing="0" bordercolor="#fff" style="border-collapse:collapse;table-layout:fixed;position:absolute;left:0;top:0" width="100%">'

                var html = '<tbody>'
                //方法二生命两个表格

                var thead_table =
                    '<table border="1" cellpadding="0" cellspacing="0" bordercolor="#fff" style="border-collapse:collapse;table-layout:fixed;background:#fff;position:sticky;left:0;top:0;z-index:100" width="100%">'
                var thead = '<tbody>'
                var colgroup = '<colgroup>'
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
                        if(i == 0) {
                            if (cols[j] && cols[j].width) {
                                colgroup = colgroup + `<col width='${cols[j].width}'>`
                            } else {
                                colgroup = colgroup + `<col width='${colWidth}'>`
                            }
                        }
                        td = this.handleMerge(merges, i, j, td)
                        if (td.rowspan != 0 && td.colspan != 0) {
                            td.style['background-color'] = '#fff'
                            td.style['border'] = 'solid 1px #D3D3D3'
                            td.style['white-space'] = 'pre-wrap'
                            td.text = cell.text || '&nbsp;'

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

                html = html_table + colgroup + '</colgroup>' + html + '</tbody>'
                html = html + '</table>'
                thead = thead_table + colgroup + '</colgroup>' + thead + '</tbody>'
                thead = thead + '</table>'
                //方法二
                this.html = this.$template.render(thead, this.resultMap) + this.$template.render(html, this.resultMap)
                this.printHtml = this.$template.render(html, this.resultMap)
            }
        },
        async queryByClassifyId(classifyId, index) {
            let res = await this.$axios.get('dictionaryDetail/queryByClassifyId/' + classifyId)
            if (res.data.code == 200) {
                let item = this.searchJsonList[index]
                item.sourceOptions = res.data.data
                this.$set(this.searchJsonList, index, item)
            }
        },
        async queryCompany(index) {
            let res = await this.$axios.get('company/queryListByCompanyId')
            if (res.data.code == 200) {
                let item = this.searchJsonList[index]
                item.sourceOptions = res.data.data
                this.$set(this.searchJsonList, index, item)
            }
        },
        async queryDepartment(index) {
            let res = await this.$axios.get('department/queryByCompanyId')
            if (res.data.code == 200) {
                let item = this.searchJsonList[index]
                item.sourceOptions = res.data.data
                this.$set(this.searchJsonList, index, item)
            }
        },
        async queryCascader(classifyId, rule, index) {
            let res = await this.$axios.get('businessTable/queryCascader/' + classifyId + '?rule=' + rule)
            if (res.data.code == 200) {
                let item = this.searchJsonList[index]
                item.sourceOptions = res.data.data
                this.$set(this.searchJsonList, index, item)
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
        handleExport() {
            var search = {}
            for (var i = 0; i < this.searchJsonList.length; i++) {
                if (Array.isArray(this.searchJsonList[i].value)) {
                    search[this.searchJsonList[i].field] = this.searchJsonList[i].value.toString()
                } else {
                    search[this.searchJsonList[i].field] = this.searchJsonList[i].value
                        ? this.searchJsonList[i].value
                        : ''
                }
            }
            let load = this.$loading({
                lock: true,
                text: '正在导出...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            let fileName = this.$route.query.title + '.xlsx'
            let params = {
                id: this.$route.query.id,
                search: JSON.stringify(search),
                companyId: localStorage.getItem('companyId'),
                userId: localStorage.getItem('userId')
            }
            this.$axios.post('jellyReport/export', params, { responseType: 'blob' }).then(res => {
                let content = res.data
                let blob = new Blob([content])
                if ('download' in document.createElement('a')) {
                    // 非IE下载
                    let elink = document.createElement('a')
                    elink.download = fileName
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, fileName)
                }
                load.close()
            })
        },
        handleSearch() {
            // 如果是联查跳转后使用查询条件时，清空跳转查询条件
            if (this.$route.query.search) {
                this.$route.query.search = []
            }
            this.queryListById(true)
        },
        //搜索条件重置
        resetForm() {
            for (let i = 0; i < this.searchJsonList.length; i++) {
                let item = this.searchJsonList[i]
                if (Array.isArray(item.value)) {
                    item.value = []
                } else {
                    item.value = ''
                }
                this.$set(this.searchJsonList, i, item)
            }
        },
        //打印
        handlePrint() {
            print.printPage('print', 'auto')
        }
    }
}
</script>
<style scoped>
.report {
    /* padding: 15px; */
    overflow: auto;
    position: relative;
}
.report-print {
    padding: 15px;
    overflow: auto;
    position: relative;
}
/* 为了报表表格中不为居中对齐的格式数据不贴边 */
.report /deep/ td {
    padding: 0 2px;
}
</style>
