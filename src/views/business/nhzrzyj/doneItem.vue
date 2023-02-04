<template>
    <div>
        <div class="searchView">
            <el-form label-width="80px" :inline="true">
                <el-form-item label="标题：">
                    <el-input v-model="searchContent.title" placeholder="请输入标题" clearable> </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click.native="handleSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <!--列表-->
            <el-table :data="tableData" border stripe @row-dblclick="goDetail" max-height="650">
                <el-table-column prop="name" label="标题" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column
                    prop="assigneeName"
                    label="发起人"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="createTime"
                    label="发起时间"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="handleTime"
                    label="处理时间"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="currentToDoPersons"
                    label="当前待办人"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="copyItem(scope.row)">抄送</el-button>
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

        <el-dialog title="人员选择" width='750px' :visible.sync ="dialogVisible" :close-on-click-modal="false" append-to-body>
            <el-row>
                <el-col :span="10">
                    <el-row  style="height:245px;border:1px solid #ccc;border-radius:6px;padding-top:10px;">
                        <el-tree
                            :data="deptTreeData"
                            default-expand-all
                            @node-click="handleNodeClick"
                            :expand-on-click-node="false"
                            style="height:100%;overflow:auto;">
                            <div slot-scope="{ node, data}">
                                <i class="el-icon-folder-opened" style="margin-right:2px;" v-if="!node.isLeaf && node.expanded"></i>
                                <i class="el-icon-folder" style="margin-right:2px;" v-if="!node.isLeaf && !node.expanded"></i>
                                <i class="el-icon-folder" style="margin-right:2px;" v-if="node.isLeaf && data.alias"></i>
                                <i class="el-icon-document" style="margin-right:2px;" v-if="node.isLeaf && data.companyName"></i>
                                {{ data.label }}
                            </div>
                        </el-tree>
                    </el-row>
                    <el-row style="height:245px;border:1px solid #ccc;border-radius:6px;margin-top:8px;">
                        <el-table
                            :data="unCheckedGridData"
                            :show-header="false"
                            height="245"
                            ref="unCheckedGrid"
                            @selection-change="handleUnCheckSelectionChange">
                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <el-table-column property="name"></el-table-column>
                        </el-table>
                    </el-row>
                </el-col>
                <el-col :span="4" style="height:400px;text-align:center;line-height:200px;">
                    <el-row>
                        <el-button type="primary" icon="el-icon-right" circle @click="handleRight"></el-button>
                        <br/>
                        <el-button type="primary" icon="el-icon-back" circle @click="handleLeft"></el-button>
                    </el-row>
                </el-col>
                <el-col :span="10" style="height:500px;border:1px solid #ccc;border-radius:6px;">
                    <el-table
                        :data="checkedGridData"
                        :show-header="false"
                        height="500"
                        highlight-current-row
                        ref="checkedGrid"
                        @selection-change="handleCheckSelectionChange">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column property="name"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDetermine">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'DoneItem',
    data() {
        return {
            searchContent: {
                title: ''
            },
            tableData: [],
            pageNo: 1,
            pageSize: 10,
            total: 0,
            dialogVisible: false,
            deptTreeData: [],
            unCheckedGridData: [],
            checkedGridData: [],
            unCheckedMultipleSelection: [],
            checkedMultipleSelection: [],
            defId: undefined,
            version: undefined,
            businessKey: undefined,
            businessType: undefined,
            title: undefined
        }
    },
    mounted() {
        this.queryByPage()
    },
    methods: {
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
                name: this.searchContent.title
            }
            this.$axios.get('flow/queryDoneItemByPage', { params }).then(res => {
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
        copyItem(row){
            this.defId = row.id
            this.version = row.version
            this.businessKey = row.businessKey
            this.businessType = row.businessType
            this.title = row.name
            this.queryDepartment()
            this.dialogVisible = true
        },
        //人员选择
        async queryDepartment() {
            let res = await this.$axios.get('department/queryCompanyDeptLevel')
            if(res.data.code == 200) {
                this.deptTreeData = res.data.data
            }
        },
        async queryByDeptId(id) {
            let res = await this.$axios.get('user/queryByDeptId?deptId=' + id)
            if(res.data.code == 200){
                this.unCheckedGridData = res.data.data
            }
        },
        async queryByCompanyId(id) {
            let res = await this.$axios.get('user/queryUserByCompanyId?companyId=' + id)
            if(res.data.code == 200){
                this.unCheckedGridData = res.data.data
            }
        },
        showDialog(value) {
            this.unCheckedGridData = []
            this.dialogVisible = true
            this.$nextTick(() => {
                this.checkedGridData = JSON.parse(JSON.stringify(value))
            })
        },
        handleNodeClick(data, node) {
            this.unCheckedGridData = []
            if(data.companyName) {
                //部门
                this.queryByDeptId(data.id)
            } else {
                //公司
                this.queryByCompanyId(data.id)
            }
        },
        handleUnCheckSelectionChange(val) {
            this.unCheckedMultipleSelection = val
        },
        handleCheckSelectionChange(val) {
            this.checkedMultipleSelection = val
        },
        handleLeft() {
            for(var i=0;i<this.checkedMultipleSelection.length;i++) {
                for(let j=0;j<this.checkedGridData.length;j++) {
                    if(this.checkedMultipleSelection[i].id == this.checkedGridData[j].id) {
                        this.checkedGridData.splice(j,1)
                        break
                    }
                }
            }
        },
        handleRight() {
            for(let i=0;i<this.unCheckedMultipleSelection.length;i++) {
                let node = this.unCheckedMultipleSelection[i]
                let flag = true
                for(let j=0;j<this.checkedGridData.length;j++) {
                    if(node.id == this.checkedGridData[j].id) {
                        flag = false
                        break
                    }
                }
                if(flag) {
                    this.checkedGridData.push(node)
                }
            }
        },
        handleDetermine() {
            let result = []
            for(let j=0;j<this.checkedGridData.length;j++) {
                result.push({
                    id: String(this.checkedGridData[j].id),
                    name: this.checkedGridData[j].name
                })
            }

            let params = {
                defId: this.defId,
                memberListStr: JSON.stringify(result),
                version : this.version,
                businessKey : this.businessKey,
                businessType : this.businessType,
                title : this.title
            }
            this.$axios.post('cloud/authority/copyItemFunction', params).then(res => {
                if (res.data.code === 200) {
                    console.log(result)
                    this.$message.success('抄送成功')
                    this.dialogVisible = false
                } else {
                    this.$message.error(res.data.message)
                }
            })
        }
    }
}
</script>
