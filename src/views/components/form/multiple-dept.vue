<template>
    <el-dialog title="部门选择" width='750px' :visible.sync ="dialogVisible" :close-on-click-modal="false" append-to-body>
        <el-row>
            <el-col :span="10">
                <el-row style="height:400px;border:1px solid #ccc;border-radius:6px;padding-top:10px;">
                    <el-tree 
                        :data="deptTreeData"
                        default-expand-all
                        :expand-on-click-node="false"
                        style="height:100%;overflow:auto;"
                        show-checkbox
                        node-key="id"
                        @check-change="handleCheckChange"
                        ref="left">
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
            <el-col :span="4" style="height:400px;text-align:center;line-height:200px;">
                <el-row>
                    <el-button type="primary" icon="el-icon-right" circle @click="handleRight" :disabled="rightDisabled"></el-button>
                    <br/>
                    <el-button type="primary" icon="el-icon-back" circle @click="handleLeft" :disabled="leftDisabled"></el-button>
                </el-row>
            </el-col>
            <el-col :span="10" style="height:400px;border:1px solid #ccc;border-radius:6px;">
                <el-table 
                    :data="checkedGridData" 
                    :show-header="false" 
                    height="400" 
                    highlight-current-row
                    @selection-change="handleSelectionChange">
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
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                deptTreeData: [],
                unCheckedGridData: [],
                checkedGridData: [],
                rightDisabled: true,
                leftDisabled: true,
                multipleSelection: [],
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
                this.$nextTick(() => {
                    this.$refs.left.setCheckedKeys(value)
                    this.checkedGridData = this.$refs.left.getCheckedNodes()
                })
            },
            handleCheckChange(data, checked, indeterminate) {
                if(this.$refs.left.getCheckedKeys().length > 0) {
                    this.rightDisabled = false
                } else {
                    this.rightDisabled = true
                }
            },
            handleRight() {
                let checkedNodes = this.$refs.left.getCheckedNodes()
                for(let i=0;i<checkedNodes.length;i++) {
                    let node = checkedNodes[i]
                    if(node.companyId) {
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
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
                if(val.length > 0) {
                    this.leftDisabled = false
                } else {
                    this.leftDisabled = true
                }
            },
            handleLeft() {
                for(let i=0;i<this.multipleSelection.length;i++) {
                    let selectNode = this.multipleSelection[i]
                    for(let j=0;j<this.checkedGridData.length;j++) {
                        if(selectNode.id == this.checkedGridData[j].id) {
                           this.checkedGridData.splice(j,1)
                           break
                        }
                    }
                }
                this.$refs.left.setCheckedNodes(this.checkedGridData)
            },
            handleDetermine() {
                let result = []
                for(let j=0;j<this.checkedGridData.length;j++) {
                    result.push(String(this.checkedGridData[j].id))
                }
                this.$emit('confirm', this.type, this.field, result)
                this.dialogVisible = false
            }
        }
    }
</script>
