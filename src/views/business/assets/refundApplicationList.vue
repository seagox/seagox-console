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
                :expand-row-keys="expandKeys"
                show-summary
                :summary-method="getSummaries"
                @expand-change="expandChange"
                highlight-current-row>
                <el-table-column type="expand">
                    <template scope="scope">
                        <div>
                            <el-table :data="scope.row.expandRow" v-loading="loading" element-loading-text="加载中...">
                                <el-table-column prop="typeName" align="center" label="申请退款费用类型"></el-table-column>
                                <el-table-column prop="amount" align="center" label="申请退款金额">
                                    <template scope="scope">
                                        <div>{{ scope.row.amount ? scope.row.amount.toFixed(2) : '0.00' }}</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="contractCode" label="合同编号" align="center">
                    <template scope="scope">
                        <div class="contract-class" @click="jumpContract(scope.row)">{{ scope.row.contractCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="identifier" label="单据编号" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="assets_name" label="资产名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="account_name" label="账户户名" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="bank" label="开户银行" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="bank_account" label="银行账号" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="amount" label="退款总金额" align="center" show-overflow-tooltip>
                    <template scope="scope">
                        <div>{{ scope.row.amount ? scope.row.amount.toFixed(2) : '0.00' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="申请退款原因" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="flowStatus" label="状态" align="center" :formatter="statusFormatter" show-overflow-tooltip></el-table-column>
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
                expandKeys: [], // 要展开的行，数值的元素是row的key值
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
                let params = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    name: this.searchForm.keyWord,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/queryRefundList', params).then(res => {
                    if (res.data.code == 200) {
                        that.tableData = res.data.data.list
                        // 插入展开行数据
                        that.tableData.forEach(item => {
                            item.expandRow = []
                        })
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
                } else {
                    return '暂存'
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
                        formId: 29,
                        path: 'refundApplicationView',
                        title: '退款申请单详情',
                        type: row.type,
                        contract: row.contract
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
            expandChange(row, expandRow) {
                // 判断当前展开行是否有数据，没有则将expandKeys设为空
                if (!expandRow.length) {
                    this.expandKeys.shift()
                    this.expandKeys = [];
                    return;
                }
                // 将展开行的f_ID push到expandKeys数组里面
                this.expandKeys = [];
                expandRow.forEach(item => {
                    this.expandKeys.shift()
                    this.expandKeys.push(item.id)
                })
                // 判断是否关闭当前行
                if (expandRow.indexOf(row) == -1) {
                    this.expandKeys.shift()
                    row.expandRow = [];
                    return;
                }
                let params = {
                    infoId: row.id
                }
                this.$axios.get('cloud/entrance/queryRefundDetail', {params}).then(res => {
                    if (res.data.code == 200) {
                        this.loading = true;
                        // 将数据赋值到追加的expandRow中
                        this.tableData.forEach((item, index) => {
                            if (item.id === row.id) {
                                this.tableData[index].expandRow = res.data.data;
                                this.loading = false;
                            }
                        })
                    } else {
                        this.$message.error(res.data.message)
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
                    if (index === 8) {
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
