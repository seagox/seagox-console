<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-download" @click="handleExport" size="small">导出</el-button>
        </div>
        <div class="searchView">
            <el-form :model="searchForm" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="资产名称">
                            <el-input v-model="searchForm.keyWord" clearable placeholder="请输入关键字"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        @click.native="handleSearch"
                        style="margin-left: 15px">
                        查询
                    </el-button>
                    <el-button type="primary" @click.native="handleJumpAdd" style="margin-left: 15px">新增</el-button>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <!--列表-->
            <el-table
                border
                stripe
                row-key="id"
                :data="tableData"
                show-summary
                :summary-method="getSummaries"
                highlight-current-row>
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="contractCode" label="合同编号" align="center">
                    <template scope="scope">
                        <div class="contract-class" @click="jumpContract(scope.row)">{{ scope.row.contractCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="identifier" label="单据编号" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="assets_name" label="资产名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="settlement_method" label="结算方式" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="refund_account" label="退款账户" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="typeNames" label="退款费用类型" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="amount" label="退款金额" align="center" show-overflow-tooltip>
                    <template scope="scope">
                        <div>{{ scope.row.amount ? scope.row.amount.toFixed(2) : '0.00' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="refund_date" label="退款日期" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showEditDialog(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :current-page.sync="pageNo"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                _databaseId: null,
                pageNo: 1,
                total: 0,
                tableData: [],
                searchForm: {
                    keyWord: null,
                },
                loading: true,
            }
        },
        created() {
            this._databaseId = localStorage.getItem('_databaseId')
            this.queryByPage()
        },
        methods: {
            queryByPage() {
                let that = this
                let assets_id = this.$history.currentRoute.query.search ? this.$history.currentRoute.query.search.assets_id : null
                let contract_id = this.$history.currentRoute.query.search ? this.$history.currentRoute.query.search.contract_id : null
                let params = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    name: this.searchForm.keyWord,
                    assets_id: assets_id,
                    contract: contract_id,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/queryRefundFormList', params).then(res => {
                    if (res.data.code == 200) {
                        that.tableData = res.data.data.list
                        that.total = res.data.data.total
                    } else {
                        that.$message.error('查询失败！')
                    }
                })
            },
            statusFormatter(row) {
                if (row.flowStatus == 0) {
                    return '审批中'
                } else if (row.flowStatus == 1) {
                    return '审批通过'
                } else if (row.flowStatus == 2) {
                    return '驳回'
                } else if (row.flowStatus == 3) {
                    return '撤回'
                } else if (row.flowStatus == 4) {
                    return '关闭'
                }
            },
            handleCurrentChange() {
                this.queryByPage()
            },
            //查询按钮
            handleSearch() {
                this.pageNo = 1
                this.queryByPage()
            },
            handleJumpAdd() {
                this.$history.push({
                    path: '/runCode',
                    query: {
                        path: 'offlineCollection',
                        id: 27,
                        title: "收款单",
                        time: new Date().getTime()
                    }
                })
            },
            showEditDialog(row) {
                this.$history.push({
                    path: '/runCode',
                    query: {
                        id: row.id,
                        path: 'refundFormView',
                        title: '退款单详情'
                    }
                })
            },
            // 跳转合同
            jumpContract(row) {
                this.$history.push({
                    path: '/runCode',
                    query: {
                        id: row.contract,
                        formId: 9,
                        path: 'contractHandleForm',
                        title: '合同详情-' + row.contractCode,
                    }
                })
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (index === 7) {
                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] = sums[index].toFixed(2) + ' 元';
                        } else {
                            sums[index] = 'N/A';
                        }
                    }
                })
                return sums;
            },
            handleExport() {
                let search = {
                    name: this.searchForm.keyWord,
                    _databaseId: this._databaseId
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
                this.$axios.post('jellyForm/export', params, {responseType: 'blob'}).then(res => {
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
        }
    }
</script>

<style scoped>
    .contract-class {
        color: #009aff;
    }
</style>
