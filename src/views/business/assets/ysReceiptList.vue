<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small" v-if="addFlag"
            >新增</el-button
            >
            <el-button type="text" icon="el-icon-download" @click="handleExport" size="small" v-if="exportFlag"
            >导出</el-button
            >
            <el-button type="text" icon="el-icon-lock" @click="openCloseDialog" size="small" v-if="closeFlag"
            >关闭</el-button
            >
            <el-button type="text" icon="el-icon-key" @click="openSubmit" size="small" v-if="openFlag"
            >激活</el-button
            >
            <div style="margin-top: 0px">
                <el-upload
                    style="display: inline; margin-left: 10px; margin-right: 10px"
                    :action="action"
                    :show-file-list="false"
                    accept=".xlsx,.xls"
                    :headers="headers"
                    :before-upload="beforeUpload"
                    :on-success="successHandle"
                >
                    <el-button type="text" icon="el-icon-upload2" size="small">导入</el-button>
                </el-upload>
                <el-button type="text" icon="el-icon-download" @click="downloadModel" size="small">下载模版</el-button>
            </div>
        </div>
        <div class="searchView" v-if="searchJsonList.length != 0">
            <el-form label-width="90px">
                <el-row>
                    <el-col :span="24 / offset" v-for="(item, index) in searchJsonList" :key="index">
                        <el-form-item :label="item.desc" v-if="index > offset - 1 && !moreFlag ? false : true">
                            <el-input
                                v-model="item.value"
                                :placeholder="item.placeholder ? item.placeholder : '请输入' + item.desc"
                                clearable
                                v-if="item.type === 'input'"
                                @input="changeMessage()"
                            >
                            </el-input>
                            <el-select
                                v-model="item.value"
                                :placeholder="item.placeholder ? item.placeholder : '请选择' + item.desc"
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
                                align="center"
                                :placeholder="item.placeholder ? item.placeholder : '请选择' + item.desc"
                                clearable
                                v-if="item.type === 'datePicker'"
                                @input="changeMessage()"
                            >
                            </el-date-picker>
                            <el-select
                                v-model="item.value"
                                :placeholder="item.placeholder ? item.placeholder : '请选择' + item.desc"
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
                                :placeholder="item.placeholder ? item.placeholder : '请选择' + item.desc"
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
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <div style="margin-left:15px;">
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
        <div class="table">
            <!--列表-->
            <el-table
                ref="multipleTable"
                :data="tableData"
                border
                stripe
                @cell-dblclick="cellDBClick"
                max-height="650"
                default-expand-all
                row-key="id"
                @selection-change="handleSelectionChange"
                :tree-props="{ children: 'children' }"
                :span-method="
					({ row, column, rowIndex, columnIndex }) => spanMethod({ row, column, rowIndex, columnIndex }, rect)
				"
                :show-summary="showSummary"
                :summary-method="({ columns, data }) => getSummaries({ columns, data }, summaryArray)"
            >
                <el-table-column width="50" align="center" fixed :render-header="renderHeader">
                    <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column width="45" fixed type="selection" align="center" :reserve-selection="true">
                </el-table-column>
                <table-column
                    v-for="(item, index) in tableHeaderList"
                    :key="index"
                    :element="item"
                    :regions="regions"
                />
                <el-table-column label="操作" align="center" fixed="right" v-if="editFlag || deleteFlag">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top-start" v-if="editFlag">
                            <i
                                class="el-icon-edit"
                                @click="showEditDialog(scope.row)"
                                style="font-size:14px;margin-right:10px"
                            ></i>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top-start" v-if="deleteFlag">
                            <i
                                class="el-icon-delete"
                                @click="deleteSubmit(scope.row)"
                                style="font-size:14px;margin-right:10px"
                            ></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    @size-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page.sync="pageNo"
                    :page-size.sync="pageSize"
                    :page-sizes="[10, 20, 30, 50, 100, 200, 300]"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog title="配置列表栏目" width="750px" :visible.sync="addConfigVisible" :close-on-click-modal="false">
            <div class="table">
                <el-table
                    :data="tableHeaderConfig"
                    border
                    row-key="id"
                    :tree-props="{ children: 'children' }"
                    :max-height="450"
                >
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column prop="label" label="标题" align="center"></el-table-column>
                    <el-table-column prop="display" label="显示" align="center">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.display"
                                :active-value="1"
                                :inactive-value="2"
                                @change="displayChange(scope.row)"
                            />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addConfigVisible = false">取消</el-button>
                <el-button type="primary" @click="configSubmit">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="关闭提示" width="550px" :visible.sync="closeVisible" :close-on-click-modal="false">
            <el-form :model="closeForm" label-width="80px" :rules="closeFormRules" ref="closeForm">
                <el-form-item label="关闭原因" prop="reason">
                    <el-input
                        type="textarea"
                        :rows="4"
                        v-model.trim="closeForm.reason"
                        placeholder="请输入关闭原因"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeVisible = false">取消</el-button>
                <el-button type="primary" @click="closeSubmit">确定</el-button>
            </div>
        </el-dialog>

        <add-simplify-form ref="addSimplifyForm" @submit="handleSimplifyForm" />
        <edit-simplify-form ref="editSimplifyForm" @submit="handleSimplifyForm" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            action: this.$axios.defaults.baseURL + 'cloud/authority/ysImport',
            headers: {
                Authorization: localStorage.getItem('Authorization')
            },
            addFlag: false,
            exportFlag: false,
            closeFlag: false,
            openFlag: false,
            editFlag: false,
            deleteFlag: false,
            flowFlag: false,
            generateType: 'dialog',
            searchJsonList: [],
            tableData: [],
            pageNo: 1,
            pageSize: 100,
            total: 0,
            tableHeaderList: [],
            formId: '',
            addConfigVisible: false,
            tableHeaderConfig: [],
            rect: {
                needMergeArr: [],
                rowMergeArrs: []
            },
            routerScript: null,
            regions: {},
            moreFlag: false,
            showSummary: false,
            summaryArray: [],
            offset: 3,
            // 关闭属性
            closeVisible: false,
            closeForm: {
                reason: ''
            },
            closeFormRules: {
                reason: [{ required: true, message: '请输入关闭原因', trigger: 'blur' }]
            },
            multipleSelection: [],
            loading: false
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
        this.queryById(1)
    },
    methods: {
        spanMethod({ row, column, rowIndex, columnIndex }, rect) {
            if (rect.needMergeArr.indexOf(column.property) > -1) {
                return this.mergeAction(column.property, rowIndex, column, rect)
            }
        },
        mergeAction(val, rowIndex, colData, rect) {
            let _row = rect.rowMergeArrs[val].rowArr[rowIndex]
            let _col = _row > 0 ? 1 : 0
            return [_row, _col]
        },
        rowMergeHandle(arr, data) {
            if (!Array.isArray(arr) && !arr.length) return false
            if (!Array.isArray(data) && !data.length) return false
            let needMerge = {}
            arr.forEach(i => {
                needMerge[i] = {
                    rowArr: [],
                    rowMergeNum: 0
                }
                data.forEach((item, index) => {
                    if (index === 0) {
                        needMerge[i].rowArr.push(1)
                        needMerge[i].rowMergeNum = 0
                    } else {
                        if (item[i] === data[index - 1][i]) {
                            needMerge[i].rowArr[needMerge[i].rowMergeNum] += 1
                            needMerge[i].rowArr.push(0)
                        } else {
                            needMerge[i].rowArr.push(1)
                            needMerge[i].rowMergeNum = index
                        }
                    }
                })
            })
            return needMerge
        },
        renderHeader(h, { column, $index }) {
            return [
                h(
                    'el-tooltip',
                    {
                        props: {
                            content: (function() {
                                return '配置列表栏目'
                            })(),
                            placement: 'top'
                        }
                    },
                    [
                        h('span', {
                            class: {
                                'el-icon-setting': true
                            },
                            style: {
                                'font-size': '16px'
                            },
                            on: {
                                click: this.settingColumn
                            }
                        })
                    ]
                )
            ]
        },
        settingColumn() {
            this.addConfigVisible = true
        },
        async displayChange(row) {
            var params = {
                tableColumnId: row.id,
                display: row.display
            }
            await this.$axios.post('tableColumnConfig/insert', params)
        },
        configSubmit() {
            this.addConfigVisible = false
            this.$history.go(0)
        },
        async queryById(type) {
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
            if (this.$history.currentRoute.query.search) {
                Object.assign(search, this.$history.currentRoute.query.search)
            }
            if (search.status){
                search.status = search.status.split(",")
            }
            const params = {
                id: this.$history.currentRoute.query.id,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                search: JSON.stringify(search)
            }
            let res = await this.$axios.post('jellyForm/queryListById', params)
            if (res.data.code == 200) {
                this.addFlag = res.data.data.addFlag
                this.editFlag = res.data.data.editFlag
                this.deleteFlag = res.data.data.deleteFlag
                this.exportFlag = res.data.data.exportFlag
                this.closeFlag = res.data.data.closeFlag
                this.openFlag = res.data.data.openFlag
                this.flowFlag = res.data.data.flowFlag
                this.generateType = res.data.data.generateType

                this.formId = res.data.data.formId
                if (res.data.data.options) {
                    this.routerScript = res.data.data.options
                }
                if (type === 1) {
                    this.searchJsonList = JSON.parse(res.data.data.searchJson)
                    for (let k = 0; k < this.searchJsonList.length; k++) {
                        if (this.searchJsonList[k].type === 'select') {
                            this.queryByClassifyId(this.searchJsonList[k].source, k)
                        } else if (this.searchJsonList[k].type === 'company') {
                            this.queryCompany(k)
                        } else if (this.searchJsonList[k].type === 'department') {
                            this.queryDepartment(k)
                        }
                    }
                }
                this.tableHeaderList = res.data.data.tableHeaderJson
                let tableHeaderConfig = JSON.parse(JSON.stringify(res.data.data.tableHeaderJson))
                for (let i = 0; i < tableHeaderConfig.length; i++) {
                    if (!tableHeaderConfig[i].display) {
                        tableHeaderConfig[i].display = 1
                    }
                }
                this.tableHeaderConfig = tableHeaderConfig
                this.tableData = res.data.data.tableData.list
                this.total = res.data.data.tableData.total

                let needMergeArr = []
                let summaryColumns = []

                this.tableHeaderIterator(this.tableHeaderList, needMergeArr, summaryColumns)
                this.rect.needMergeArr = needMergeArr
                this.rect.rowMergeArrs = this.rowMergeHandle(needMergeArr, this.tableData)

                this.showSummary = summaryColumns.length > 0
                this.summaryArray = summaryColumns
            }
        },
        tableHeaderIterator(tree, needMergeArr, summaryColumns) {
            tree.forEach(node => {
                if (node.summary === 1) {
                    needMergeArr.push(node.prop)
                }
                if (node.total === 1) {
                    summaryColumns.push(node.prop)
                }
                node.children && this.tableHeaderIterator(node.children, needMergeArr, summaryColumns)
            })
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
        handleCurrentChange(val) {
            this.queryById(2)
        },
        handleSearch() {
            // 如果是联查跳转后使用查询条件时，清空跳转查询条件
            if (this.$history.currentRoute.query.search && !this.$history.currentRoute.query.search.hasOwnProperty("keepAlive")) {
                this.$history.currentRoute.query.search = []
            }
            this.queryById(2)
        },
        cellDBClick(row, column, cell, event) {
            if (!this.routerScript) {
                // 退回走编辑页面
                if (row["status"] == 2 && row["user_id"] == localStorage.getItem('userId')) {
                    this.$history.push({
                        path: '/editCustomForm',
                        query: {
                            formId: this.formId,
                            id: row.id,
                            title: this.$history.currentRoute.query.title
                        }
                    })
                } else {
                    this.$history.push({
                        path: '/handleCustomForm',
                        query: {
                            formId: this.formId,
                            id: row.id,
                            title: '应收单详情'
                        }
                    })
                }
            } else {
                try {
                    let script = this.routerScript
                    let func = new Function('that', 'row', script)
                    func(this, row)
                } catch (e) {
                    console.log(e)
                }
            }
        },
        showAddDialog() {
            var addFormId = 1
            if (this.flowFlag) {
                this.$history.push({
                    path: '/addCustomForm',
                    query: {
                        id: addFormId,
                        title: this.$history.currentRoute.query.title,
                        time: new Date().getTime()
                    }
                })
            } else {
                if (this.generateType === 'dialog') {
                    this.$refs.addSimplifyForm.showAddDialog(addFormId)
                } else if (this.generateType === 'view') {
                    this.$history.push({
                        path: '/addCustomForm',
                        query: {
                            id: addFormId,
                            title: this.$history.currentRoute.query.title,
                            time: new Date().getTime()
                        }
                    })
                }
            }
        },
        showEditDialog(row) {
            this.$history.push({
                path: '/editCustomForm',
                query: {
                    formId: this.formId,
                    id: row.id,
                    title: '编辑应收单'
                }
            })
        },
        deleteSubmit(row) {
            let that = this
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                var params = {
                    businessType: this.formId,
                    businessKey: row.id
                }
                that.$axios.post('jellyForm/deleteCustom', params).then(res => {
                    if (res.data.code == 200) {
                        that.$message.success('删除成功')
                        that.queryById(2)
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            })
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
            if (this.$history.currentRoute.query.search) {
                Object.assign(search, this.$history.currentRoute.query.search)
            }
            let load = this.$loading({
                lock: true,
                text: '正在导出...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            let fileName = this.$history.currentRoute.query.title + '.xlsx'
            let params = {
                id: this.$history.currentRoute.query.id,
                search: JSON.stringify(search),
                companyId: localStorage.getItem('companyId'),
                userId: localStorage.getItem('userId')
            }
            this.$axios.post('jellyForm/export', params, { responseType: 'blob' }).then(res => {
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
        getSummaries(param, summaryArray) {
            const { columns, data } = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计'
                    return
                }

                if (summaryArray.indexOf(column.property) != -1) {
                    const values = data.map(item => Number(item[column.property]))
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr)
                            if (!isNaN(value)) {
                                prev = this.$BigNumber(prev)
                                return prev.plus(curr).toString()
                            } else {
                                return prev
                            }
                        }, 0)
                        sums[index] = Number(sums[index]).toFixed(2)
                    } else {
                        sums[index] = ''
                    }
                } else {
                    sums[index] = ''
                }
            })
            return sums
        },
        openCloseDialog() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning('亲，请先选择要关闭的数据')
                return
            }

            this.closeForm = {
                reason: ''
            }
            this.closeVisible = true
        },
        // 关闭流程提交
        closeSubmit() {
            let that = this
            this.$refs.closeForm.validate(valid => {
                if (valid) {
                    let businessKeyArr = this.multipleSelection.map(item => {
                        return item.id
                    })
                    let params = {
                        businessType: this.formId,
                        businessKeys: businessKeyArr.join(),
                        reason: this.closeForm.reason
                    }
                    that.$axios.post('flow/close', params).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('关闭成功')
                            that.$refs.multipleTable.clearSelection()
                            that.queryById(2)
                        } else {
                            that.$message.error(res.data.message)
                        }
                        that.closeVisible = false
                    })
                }
            })
        },
        // 激活流程提交
        openSubmit() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning('亲，请先选择要激活的数据')
                return
            }
            let that = this
            this.$confirm('亲，确认要激活吗？', '提示', { type: 'warning' }).then(() => {
                let businessKeyArr = this.multipleSelection.map(item => {
                    return item.id
                })
                var params = {
                    businessType: this.formId,
                    businessKeys: businessKeyArr.join()
                }
                that.$axios.post('flow/open', params).then(res => {
                    if (res.data.code == 200) {
                        that.$message.success('激活成功')
                        that.$refs.multipleTable.clearSelection()
                        that.queryById(2)
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
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
        // 强制更新
        changeMessage() {
            this.$forceUpdate()
        },
        //处理新增、编辑表单提交
        handleSimplifyForm() {
            this.queryById(1)
        },
        beforeUpload(file) {
            const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
            if (suffix != 'xlsx' && suffix != 'xls') {
                this.$message.error(`只能选择excel文件`)
                return false
            }
            return true
        },
        successHandle(res, file, fileList) {
            if (res.code === 200) {
                this.$message.success('导入成功')
                this.queryById(2)
            } else {
                this.$message.error(res.message)
            }
        },
        downloadModel() {
            let url = window.platform.ysdModelUrl
            let fileName = '应收单导入模板'
            this.getBlob(url, (blob) => {
                this.saveAs(blob, fileName)
            })
        },
        getBlob(url, cb) {
            let xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr.responseType = 'blob'
            xhr.onload = function () {
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
.container {
    padding: 15px;
}
</style>