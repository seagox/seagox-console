<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-download" @click="handleExport" size="small">导出</el-button>
        </div>
        <div class="searchView">
            <el-form :model="searchForm" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="租户名称">
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
                highlight-current-row>
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="code" label="编码" align="center">
                    <template scope="scope">
                        <div class="contract-class">{{ scope.row.code }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="customer_type" label="用户类型" align="center" :formatter="userTypeFormatter" show-overflow-tooltip></el-table-column>
                <el-table-column prop="tenement" label="姓名/企业名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="contact_way" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="grade" label="用户等级" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        普通用户
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建日期" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="assetsStatus" label="资产状态" align="center" show-overflow-tooltip></el-table-column>
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
        <el-dialog title="请选择" width="500px" :visible.sync="addTenantVisible" :close-on-click-modal="false">
            <el-form>

            </el-form>
        </el-dialog>
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
                loading: true,
                addTenantVisible: false,
                addForm: {}
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
                    type: this.searchForm.type,
                    name: this.searchForm.keyWord,
                    contract: this.$history.currentRoute.query.contract,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/queryTenantList', params).then(res => {
                    if (res.data.code == 200) {
                        that.tableData = res.data.data.list
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
                this.$history.push({
                    path: '/runCode',
                    query: {
                        contractIds: row.ids,
                        assetsIds: row.assetsIds,
                        path: 'tenantDetail',
                        title: '租户详情-' + row.tenement,
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
            // 用户类型转换
            userTypeFormatter(row) {
                if (row.customer_type == 1) {
                    return '个人'
                } else if (row.customer_type == 2) {
                    return '企业'
                }
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
