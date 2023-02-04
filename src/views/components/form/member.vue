<template>
    <el-dialog title="人员选择" width='750px' :visible.sync ="dialogVisible" :close-on-click-modal="false" append-to-body>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-row style="height:400px;border:1px solid #ccc;border-radius:6px;padding-top:10px;" >
                    <el-tree 
                        :data="deptTreeData"
                        default-expand-all
                        :expand-on-click-node="false"
                        style="height:100%;overflow:auto;"
                        node-key="id"
                        @node-click="handleNodeClick">
                        <div slot-scope="{ node, data}">
                            <i class="el-icon-folder-opened" style="margin-right:2px;" v-if="!node.isLeaf && node.expanded"></i>
                            <i class="el-icon-folder" style="margin-right:2px;" v-if="!node.isLeaf && !node.expanded"></i>
                            <i class="el-icon-folder" style="margin-right:2px;" v-if="node.isLeaf && data.alias"></i>
                            <i class="el-icon-document" style="margin-right:2px;" v-if="node.isLeaf && data.companyName"></i>
                            {{ data.label }}
                        </div>
                    </el-tree>
                </el-row>
            </el-col>
            <el-col :span="12" style="height:400px;border:1px solid #ccc;border-radius:6px;">
                <el-table 
                    :data="gridData" 
                    :show-header="false" 
                    height="400" 
                    highlight-current-row
                    @row-dblclick="rowDblClick">
                    <el-table-column property="name"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                deptTreeData: [],
                gridData: [],
                type: '',
                field: ''
            }
        },
        created(){
            this.queryDepartment()
        },
        methods: {
            async queryDepartment() {
                let res = await this.$axios.get('department/queryCompanyDeptLevel')
                if(res.data.code == 200) {
                    this.deptTreeData = res.data.data
                }
            },
            showDialog(type, field, value) {
                this.type = type
                this.field = field
                this.dialogVisible = true
            },
            handleNodeClick(data, node) {
                if(data.companyName) {
                    //部门
                    this.queryByDeptId(data.id)
                } else {
                    //公司
                    this.queryByCompanyId(data.id)
                }
            },
            async queryByDeptId(id) {
                let res = await this.$axios.get('user/queryByDeptId?deptId=' + id)
                if(res.data.code == 200){
                    this.gridData = res.data.data
                }
            },
            async queryByCompanyId(id) {
                let res = await this.$axios.get('user/queryUserByCompanyId?companyId=' + id)
                if(res.data.code == 200){
                    this.gridData = res.data.data
                }
            },
            rowDblClick(row, column, event) {
                this.dialogVisible = false
                this.$emit('confirm', this.type, this.field, String(row.id))
            }
        }
    }
</script>
