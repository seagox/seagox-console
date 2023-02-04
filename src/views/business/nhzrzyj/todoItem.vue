<template>
    <div>
        <div class="searchView">
            <el-form label-width="80px" :inline="true">
                <el-form-item label="标题：">
                    <el-input v-model="searchContent.title" placeholder="请输入标题" clearable> </el-input>
                </el-form-item>
                <el-form-item label="催办：">
                    <el-select
                        v-model="searchContent.isUrge"
                        clearable
                        placeholder="请选择是否催办"
                    >
                        <el-option
                            v-for="item in urgeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select
                        v-model="searchContent.statusData"
                        multiple
                        clearable
                        @change="statusChange"
                        placeholder="请选择状态"
                    >
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别：">
                    <el-select
                        v-model="searchContent.businessType"
                        multiple
                        clearable
                        placeholder="请选择类别"
                    >
                        <el-option
                            v-for="item in businessTypeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属部门">
                    <el-cascader
                        v-model="searchContent.departmentIds"
                        :options="departmentOptions"
                        :props="{ checkStrictly: true, emitPath: false, multiple: true }"
                        clearable
                        filterable
                        placeholder="请选择所属部门"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click.native="handleSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <!--列表-->
            <el-table
                :data="tableData"
                border
                stripe
                @row-dblclick="goDetail"
                max-height="650"
                :cell-style="cellStyle"
                row-key="id"
            >
                <el-table-column prop="isUrge" label="是否催办" align="center" width="80">
                    <template slot-scope="scope">
                        <div v-if="scope.row.urgeNumber !== 0" :style="{ color: 'red' }">催办</div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="标题" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column
                    prop="assigneeName"
                    label="发起人"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="createTime"
                    label="提交时间"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    align="center"
                    :formatter="statusFormatter"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="returnNumber"
                    label="退回次数"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="urgeNumber"
                    label="催办次数"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleProcess(scope.row)">流程查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :page-size="pageSize"
                    :current-page.sync="pageNo"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TodoItem',
    data() {
        return {
            statusOptions: [
                {
                    value: 0,
                    label: '待审'
                },
                {
                    value: 2,
                    label: '驳回'
                },
                {
                    value: 3,
                    label: '撤回'
                }
            ],
            urgeOptions: [
                {
                    value: 0,
                    label: '是'
                },
                {
                    value: 1,
                    label: '否'
                }
            ],
            searchContent: {
                title: '',
                statusData: [],
                businessType: [],
                departmentIds: [],
                isUrge: ''
            },
            tableData: [],
            pageNo: 1,
            total: 0,
            pageSize: 10,
            businessTypeOptions: [],
            departmentOptions: [],
            companyId: Number(localStorage.getItem('companyId'))
        }
    },

    mounted() {
        this.queryByPage()
        this.queryBusinessTypes()
        this.queryDepartmentByCompanyId(this.companyId)
    },
    methods: {
        cellStyle(column) {
            if (column.columnIndex === 0 && column.row.returnNumber > 2) {
                return {
                    color: '#ef0022 !important'
                }
            }
        },
        statusFormatter(obj) {
            if (obj.status === 0) {
                return '待审'
            } else if (obj.status === 2) {
                return '驳回'
            } else {
                return '撤回'
            }
        },
        statusChange(val) {
            this.searchContent.status = val
        },
        goDetail(row) {
            this.$router.push({
                path: '/handleCustomForm',
                query: {
                    id: row.businessKey,
                    formId: row.businessType,
                    title: row.name
                }
            })
        },
        // 流程查看
        handleProcess(row) {
            this.$router.push({
                path: '/flowDisplay',
                query: {
                    businessKey: row.businessKey,
                    businessType: row.businessType,
                    title: row.name
                }
            })
        },
        queryByPage() {
            let params = {
                pageNo: this.pageNo,
                name: this.searchContent.title,
                statusStr: this.searchContent.statusData.join(','),
                businessTypeStr: this.searchContent.businessType.join(','),
                departmentIds: this.searchContent.departmentIds.join(','),
                urgeFlag: this.searchContent.isUrge
            }
            this.$axios.get('cloud/authority/queryTodoItemByPage', { params }).then(res => {
                if (res.data.code === 200) {
                    this.tableData = res.data.data.list
                    this.total = res.data.data.total
                    this.pageSize = res.data.data.pageSize
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        handleSearch() {
            this.queryByPage()
        },
        handleCurrentChange() {
            this.queryByPage()
        },
        queryBusinessTypes() {
            let params = {
                companyId: localStorage.getItem('companyId')
            }
            this.$axios.get('jellyForm/queryBusinessTypes', { params }).then(res => {
                if (res.data.code === 200) {
                    this.businessTypeOptions = res.data.data
                }
            })
        },
        queryDepartmentByCompanyId(companyId) {
            this.$axios.get('department/queryByCompanyId?searchCompanyId=' + companyId).then(res => {
                if (res.data.code == 200) {
                    this.departmentOptions = res.data.data
                }
            })

        }
    }
}
</script>
