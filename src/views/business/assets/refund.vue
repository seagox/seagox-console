<template>
    <div>
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
            <el-table :data="tableData" border highlight-current-row stripe>
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="receiptsDate" label="收款日期" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="type" label="收款项目" align="center" :formatter="typeFormatter"></el-table-column>
                <el-table-column prop="assetsName" label="资产名称" align="center"></el-table-column>
                <el-table-column prop="contractCode" label="合同编号" align="center">
                    <template scope="scope">
                        <div class="contract-class" @click="jumpContract(scope.row)">{{ scope.row.contractCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="金额" align="center"></el-table-column>
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
                }
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
                    type: 11,
                    name: this.searchForm.keyWord,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/queryByPage', params).then(res => {
                    if (res.data.code == 200) {
                        that.tableData = res.data.data
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
                        path: 'deposit',
                        id: 14,
                        title: '退款单申请单',
                        time: new Date().getTime()
                    }
                })
            },
            typeFormatter(row) {
                if (row.type == 1) {
                    return '押金'
                } else if (row.type == 2) {
                    return '房租'
                } else if (row.type == 3) {
                    return '费用'
                } else if (row.type == 11) {
                    return '退款单'
                } else {
                    return ''
                }
            },
            showEditDialog(row) {
                this.$history.push({
                    path: '/handleCustomForm',
                    query: {
                        id: row.id,
                        formId: row.businessType,
                        title: this.$history.currentRoute.query.title
                    }
                })
            },
            // 跳转合同
            jumpContract(row) {
                this.$history.push({
                    path: '/handleCustomForm',
                    query: {
                        id: row.contract,
                        formId: 9,
                        title: '合同详情-' + row.contractCode
                    }
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
