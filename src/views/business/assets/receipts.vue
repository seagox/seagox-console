<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-delete" @click="handleDelete" size="small">删除</el-button>
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
                @selection-change="handleSelectionChange"
                highlight-current-row>
                <el-table-column type="selection" width="55" reserve-selection :selectable="selectable"></el-table-column>
                <el-table-column type="expand">
                    <template scope="scope">
                        <div>
                            <el-table :data="scope.row.expandRow" v-loading="loading" element-loading-text="加载中...">
                                <el-table-column prop="typeName" align="center" label="业务类型"></el-table-column>
                                <el-table-column prop="amount" align="center" label="支付金额">
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
                <el-table-column prop="assets_name" label="资产名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="tenement" label="租户名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="amount" label="支付金额" align="center" show-overflow-tooltip>
                    <template scope="scope">
                        <div>{{ scope.row.amount ? scope.row.amount.toFixed(2) : '0.00' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="payWay" label="结算方式" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="payment_order" label="支付系统内部订单号" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="payment_time" label="支付时间" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="receipts_account" label="收款账号" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="remarks" label="备注" align="center" show-overflow-tooltip></el-table-column>
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
                    type: null,
                    keyWord: null,
                },
                expandKeys: [], // 要展开的行，数值的元素是row的key值
                loading: true,
                multipleSelection: []
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
                    type: this.searchForm.type,
                    name: this.searchForm.keyWord,
                    assets_id: assets_id,
                    contract: contract_id,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/queryCollectionList', params).then(res => {
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
                if (row.type == 5 || row.type == 6 || row.bType == 'on-line') {
                    this.$history.push({
                        path: '/runCode',
                        query: {
                            id: row.contract,
                            formId: 9,
                            path: 'contractHandleForm',
                            title: '合同详情-' + row.contractCode,
                        }
                    })
                } else {
                    this.$history.push({
                        path: '/runCode',
                        query: {
                            id: row.id,
                            formId: 27,
                            path: 'offlineCollectionView',
                            title: this.$history.currentRoute.query.title,
                            type: row.type
                        }
                    })
                }
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
                let queryType
                if (row.bType == 'offline') {
                    queryType = 'queryDetailByMainId'
                } else if (row.bType == 'on-line') {
                    queryType = 'queryReciptsDetailByMainId'
                }
                let params = {
                    infoId: row.id
                }
                this.$axios.get('cloud/entrance/' + queryType, {params}).then(res => {
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
                    if (index === 6) {
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
            // 是否能勾选
            selectable(row, index) {
                return row.refundStatus == 0
            },
            // 勾选
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 删除
            handleDelete() {
                if (this.multipleSelection.length == 0) {
                    this.$message.warning('请选择需要删除的数据！')
                    return
                }
                this.$confirm('是否确定删除？', '提示', {type: 'warning'}).then(() => {
                    let ids = []
                    this.multipleSelection.forEach(value => {
                        ids.push(value.id)
                    })
                    let that = this
                    let params = {
                        ids: ids.join(",")
                    }
                    that.$axios.post('/cloud/entrance/deleteCollection', params).then(res => {
                        if (res.data.code == 200) {
                            this.queryByPage()
                            this.$message.success('删除成功！')
                        } else {
                            that.$message.error('删除失败，' + res.data.message)
                        }
                    })
                })
            }
        }
    }
</script>

<style scoped>
    .contract-class {
        color: #009aff;
    }
</style>
