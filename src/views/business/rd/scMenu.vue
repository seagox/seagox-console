<template>
    <div>
        <el-container :style="'height:' + (clientHeight - 110) + 'px'">
            <el-aside width="250px" class="aside" style="padding-left:15px;padding-top:15px;">
                <div class="add-classify" @click="showAddTableDialog">
                    <i class="el-icon-circle-plus"></i>
                    <span style="margin-left: 10px">添加菜单配置</span>
                </div>
                <el-table
                    :data="tableData"
                    highlight-current-row
                    :show-header="false"
                    @current-change="handleNodeClick"
                    class="border"
                    row-key="id"
                >
                    <el-table-column show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i class="el-icon-document" style="font-size: 15px" v-if="!scope.row.children"></i>
                            <span style="font-size: 15px; margin-left: 8px" v-if="!scope.row.children">{{
                                scope.row.name
                            }}</span>
                            <span style="font-size: 15px" v-if="scope.row.children">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="45" align="center">
                        <template slot-scope="scope">
                            <el-dropdown @command="handleCommand($event, scope.row)">
                                <span class="el-dropdown-link">
                                    <i class="el-icon-more"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-edit" command="edit">编辑</el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-delete" command="delete">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </el-aside>
            <el-main v-if="activeFlag">
                <div class="toolView">
                    <el-row :gutter="15">
                        <el-col :span="8">
                            <el-button type="primary" icon="el-icon-circle-check" @click="handleSave">保 存</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div style="margin-left: 15px">
                    <el-form :model="activeRow" label-width="120px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="业务类型: ">
                                    <el-select v-model="activeRow.businessConfigId" @change="businessConfigChange">
                                        <el-option
                                            v-for="item in businessConfigs"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="显示审查助手: ">
                                    <el-switch
                                        v-model="activeRow.isSczs"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-value="1"
                                        inactive-value="2"
                                    >
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="显示区划选择:">
                                    <el-switch
                                        v-model="activeRow.isQhxz"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-value="1"
                                        inactive-value="2"
                                    >
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="指定年份:">
                                    <el-date-picker
                                        v-model="activeRow.year"
                                        type="year"
                                        value-format="yyyy"
                                        placeholder="请选择年度"
                                        align="center"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="显示年份选择:">
                                    <el-switch
                                        v-model="activeRow.isYear"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-value="1"
                                        inactive-value="2"
                                    >
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <!--<el-col :span="6">
                                <el-form-item label="显示阶段选择:">
                                    <el-switch
                                        v-model="activeRow.isXsjd"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-value="1"
                                        inactive-value="2"
                                    >
                                    </el-switch>
                                </el-form-item>
                            </el-col>-->
                            <el-col :span="12">
                                <el-form-item label="指定阶段:">
                                    <el-select v-model="activeRow.businessDetailId">
                                        <el-option
                                            v-for="item in zdjds"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="审查目录:" prop="path">
                                    <el-tree
                                        :data="menuData"
                                        show-checkbox
                                        node-key="id"
                                        ref="tree"
                                        check-strictly
                                        :default-expand-all="true"
                                        style="margin-top: 15px; max-height: 420px; overflow: auto"
                                    >
                                        <div slot-scope="{ node, data }">
                                            {{ data.name }}
                                        </div>
                                    </el-tree>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-main>
        </el-container>
        <!--新增界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
                <el-form-item label="父节点" prop="parentId">
                    <el-select v-model="addForm.parentId" placeholder="请选择父节点" clearable>
                        <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addTableSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
                <el-form-item label="父节点" prop="parentId">
                    <el-select v-model="editForm.parentId" placeholder="请选择父节点" clearable>
                        <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editTableSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            tableData: [],
            addFormVisible: false,
            addForm: {
                parentId: '',
                name: ''
            },
            editFormVisible: false,
            editForm: {
                id: '',
                parentId: '',
                name: ''
            },
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            },
            activeFlag: false,
            activeRow: {},
            businessConfigs: [],
            zdjds: [],
            menuData: [],
            _databaseId: ''
        }
    },
    mounted() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.queryTable()
        this.queryBusiness()
    },
    methods: {
        //查询业务
        queryBusiness() {
            let that = this
            that.$axios.post('/cloud/entrance/getBusinessConfigList', { _databaseId: this._databaseId }).then(res => {
                if (res.data.code == 200) {
                    that.businessConfigs = res.data.data
                }
            })
        },
        queryTable() {
            let that = this
            that.$axios.get('/cloud/entrance/getScMenuList').then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data
                }
            })
        },
        handleNodeClick(row) {
            if (row.children) {
                this.activeFlag = false
                this.activeRow = {}
            } else {
                this.activeFlag = true
                this.activeRow = row || {}
                this.activeRow.parentId = row.parentId
                this.initmainTreeData()
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedKeys([])
                })
                if (this.activeRow.scConfigIds) {
                    this.$nextTick(() => {
                        this.$refs.tree.setCheckedKeys(this.activeRow.scConfigIds.split(','))
                    })
                }
                if (this.activeRow.businessConfigId) {
                    this.zdjds = []
                    this.queryBusinessDetailList()
                }
            }
        },
        handleCommand(command, row) {
            if (command === 'edit') {
                this.editForm = Object.assign({}, row)
                this.editFormVisible = true
                if (this.$refs.editForm) {
                    this.$refs.editForm.resetFields()
                }
            } else if (command === 'delete') {
                this.deleteTableSubmit(row)
            }
        },
        showAddTableDialog() {
            this.addFormVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
        },
        addTableSubmit() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.$axios.post('/cloud/entrance/insertScMenu', this.addForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addFormVisible = false
                            this.queryTable()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        editTableSubmit() {
            if (this.editForm.id == this.editForm.parentId) {
                this.$message.error('父节点不能自己')
            } else {
                var params = {
                    id: this.editForm.id,
                    parentId: this.editForm.parentId,
                    name: this.editForm.name
                }
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        this.$axios.post('/cloud/entrance/updateScMenu', params).then(res => {
                            if (res.data.code == 200) {
                                this.$message.success('修改成功')
                                this.editFormVisible = false
                                this.queryTable()
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
                    }
                })
            }
        },
        deleteTableSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('/cloud/entrance/deleteScMenu', { id: row.id }).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.activeFlag = false
                        this.activeRow = {}
                        this.queryTable()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        handleSave() {
            this.activeRow.scConfigIds = this.$refs.tree.getCheckedKeys().join(',')
            this.$axios.post('/cloud/entrance/updateScMenuDetail', this.activeRow).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('保存成功')
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        businessConfigChange() {
            this.initmainTreeData()
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys([])
            })
            if (this.activeRow.scConfigIds) {
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedKeys(this.activeRow.scConfigIds.split(','))
                })
            }
            this.zdjds = []
            this.activeRow.businessDetailId = ''
            this.queryBusinessDetailList()
        },
        queryBusinessDetailList() {
            let that = this
            const params = {
                configId: this.activeRow.businessConfigId,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/getDetailListByConfigId', { params }).then(res => {
                if (res.data.code == 200) {
                    that.zdjds = res.data.data
                }
            })
        },
        //查询目录
        initmainTreeData() {
            let params = {
                businessConfigId: this.activeRow.businessConfigId
            }
            this.$axios.post('cloud/entrance/getTreeByBusinessConfigId', params).then(res => {
                this.menuData = res.data.data
            })
        }
    }
}
</script>
<style scoped>
.el-main {
    border-left: 1px solid #e5e9f2;
    padding: 0px;
    margin-left: 15px;
}
.is-without-controls .el-input .el-input__inner {
    text-align: left;
}
.el-table__body tr.current-row td:not(.is-center) {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}
.el-aside .el-table__body tr.current-row .is-center {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
}
.aside .el-table td {
    border-bottom: 0px solid #ebeef5;
}
.add-classify {
    border: 1px dashed #e5e9f2;
    border-radius: 6px;
    text-align: center;
    padding: 8px;
    margin-bottom: 15px;
    cursor: pointer;
}
</style>
