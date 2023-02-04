<template>
    <div>
        <el-container :style="'height:' + (clientHeight - 110) + 'px'">
            <el-aside width="240px" class="aside" style="padding-left:15px;padding-top:15px;">
                <div class="add-Business" @click="showAddBusinessDialog">
                    <i class="el-icon-circle-plus"></i>
                    <span style="margin-left: 10px">添加业务</span>
                </div>
                <el-table
                    :data="treeData"
                    highlight-current-row
                    :show-header="false"
                    @current-change="handleNodeClick"
                    class="border"
                >
                    <el-table-column show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i class="el-icon-document" style="font-size: 14px"></i>
                            <span style="font-size: 14px; margin-left: 8px">{{ scope.row.name }}</span>
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
            <el-main>
                <div class="ywjbsx">业务基本属性</div>
                <el-form :model="tempRow" label-width="80px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="业务编码">
                                <el-input v-model.trim="tempRow.code" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="业务名称">
                                <el-input v-model.trim="tempRow.name" readonly></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="周期类型">
                                <el-select v-model="tempRow.cycleType" disabled>
                                    <el-option
                                        v-for="item in cycleTypes"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="业务类型">
                                <el-select v-model="tempRow.businessType" disabled>
                                    <el-option
                                        v-for="item in businessTypes"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="toolView">
                    <el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table :data="tableData" border highlight-current-row stripe>
                        <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                        <el-table-column prop="sort" label="序号" align="center"></el-table-column>
                        <el-table-column prop="code" label="阶段编码" align="center"></el-table-column>
                        <el-table-column
                            prop="name"
                            label="阶段名称"
                            align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column prop="version" label="数据版本" align="center"></el-table-column>xzInformName
                        <el-table-column prop="xzInformName" label="小组报告模板" align="center"></el-table-column>
                        <el-table-column prop="scInformName" label="审查报告模板" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
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
                            :total="total"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-container>
        <!--新增界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addBusinessFormVisible" :close-on-click-modal="false">
            <el-form :model="addBusinessForm" label-width="80px" :rules="formRules" ref="addBusinessForm">
                <el-form-item label="业务编码" prop="code">
                    <el-input v-model.trim="addBusinessForm.code" placeholder="请输入业务编码"></el-input>
                </el-form-item>
                <el-form-item label="业务名称" prop="name">
                    <el-input v-model.trim="addBusinessForm.name" placeholder="请输入业务名称"></el-input>
                </el-form-item>
                <el-form-item label="周期类型" prop="cycleType">
                    <el-select v-model="addBusinessForm.cycleType" placeholder="请选择">
                        <el-option v-for="item in cycleTypes" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessType">
                    <el-select v-model="addBusinessForm.businessType" placeholder="请选择">
                        <el-option v-for="item in businessTypes" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBusinessFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addBusinessSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="500px" :visible.sync="editBusinessFormVisible" :close-on-click-modal="false">
            <el-form :model="editBusinessForm" label-width="80px" :rules="formRules" ref="editBusinessForm">
                <el-form-item label="业务编码" prop="code">
                    <el-input v-model.trim="editBusinessForm.code" placeholder="请输入业务编码"></el-input>
                </el-form-item>
                <el-form-item label="业务名称" prop="name">
                    <el-input v-model.trim="editBusinessForm.name" placeholder="请输入业务名称"></el-input>
                </el-form-item>
                <el-form-item label="周期类型" prop="cycleType">
                    <el-select v-model="editBusinessForm.cycleType" placeholder="请选择">
                        <el-option v-for="item in cycleTypes" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessType">
                    <el-select v-model="editBusinessForm.businessType" placeholder="请选择">
                        <el-option v-for="item in businessTypes" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editBusinessFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editBusinessSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :rules="formRules" ref="addForm">
                <el-form-item label="阶段编码" prop="code">
                    <el-input v-model.trim="addForm.code" placeholder="请输入阶段编码"></el-input>
                </el-form-item>
                <el-form-item label="阶段名称" prop="name">
                    <el-input v-model.trim="addForm.name" placeholder="请输入阶段名称"></el-input>
                </el-form-item>
                <el-form-item label="数据版本" prop="version">
                    <el-input v-model.trim="addForm.version" placeholder="请输入数据版本"></el-input>
                </el-form-item>
                <el-form-item label="审查报告模板" prop="scInformId">
                    <el-select v-model="addForm.scInformId">
                        <el-option
                            v-for="item in informs"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="小组报告模板" prop="xzInformId">
                    <el-select v-model="addForm.xzInformId">
                        <el-option
                            v-for="item in informs"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序号" prop="sort">
                    <el-input-number v-model="addForm.sort" placeholder="请输入排序号"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="120px" :rules="formRules" ref="editForm">
                <el-form-item label="阶段编码" prop="code">
                    <el-input v-model.trim="editForm.code" placeholder="请输入阶段编码"></el-input>
                </el-form-item>
                <el-form-item label="阶段名称" prop="name">
                    <el-input v-model.trim="editForm.name" placeholder="请输入阶段名称"></el-input>
                </el-form-item>
                <el-form-item label="数据版本" prop="version">
                    <el-input v-model.trim="editForm.version" placeholder="请输入数据版本"></el-input>
                </el-form-item>
                <el-form-item label="审查报告模板" prop="scInformId">
                    <el-select v-model="editForm.scInformId">
                        <el-option
                            v-for="item in informs"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="小组报告模板" prop="xzInformId">
                    <el-select v-model="editForm.xzInformId">
                        <el-option
                            v-for="item in informs"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序号" prop="sort">
                    <el-input-number v-model="editForm.sort" placeholder="请输入排序号"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            treeData: [],
            addBusinessFormVisible: false,
            addBusinessForm: {
                code: '',
                name: '',
                businessType: '',
                cycleType: ''
            },
            editBusinessFormVisible: false,
            editBusinessForm: {
                id: '',
                code: '',
                name: '',
                businessType: '',
                cycleType: ''
            },
            configId: '',
            tableData: [],
            pageNo: 1,
            total: 0,
            addFormVisible: false,
            addForm: {
                configId: '',
                name: '',
                code: '',
                version: '',
                sort: 1,
                scInformId: '',
                xzInformId: ''
            },
            editFormVisible: false,
            editForm: {
                id: '',
                configId: '',
                name: '',
                code: '',
                version: '',
                sort: '',
                scInformId: '',
                xzInformId: ''
            },
            formRules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
                sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
                cycleType: [{ required: true, message: '请选择周期类型', trigger: 'change' }],
                businessType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
                version: [{ required: true, message: '请输入数据版本', trigger: 'blur' }],
                scInformId: [{ required: true, message: '请选择审查报告模板', trigger: 'change' }],
                xzInformId: [{ required: true, message: '请选择小组报告模板', trigger: 'change' }]
            },
            businessTypes: [],
            cycleTypes: [],
            tempRow: {},
            _databaseId: '',
            informs: []
        }
    },
    mounted() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.queryBusiness()
        this.queryDictByNames('业务类型,周期类型')
        this.queryInformAll()
    },
    methods: {
        queryInformAll() {
            let that = this
            that.$axios.post('/cloud/entrance/queryInformAll').then(res => {
                if (res.data.code == 200) {
                    this.informs = res.data.data
                }
            })
        },
        queryDictByNames(names) {
            let that = this
            let params = {
                names: names
            }
            that.$axios.post('/cloud/entrance/getDictDetailByNames', params).then(res => {
                if (res.data.code == 200) {
                    let datalist = res.data.data
                    for (var i = 0; i < datalist.length; i++) {
                        if (datalist[i].name == '业务类型') {
                            this.businessTypes = datalist[i].list
                        } else if (datalist[i].name == '周期类型') {
                            this.cycleTypes = datalist[i].list
                        }
                    }
                }
            })
        },
        queryBusiness() {
            let that = this
            that.$axios.post('/cloud/entrance/getBusinessConfigList', { _databaseId: this._databaseId }).then(res => {
                if (res.data.code == 200) {
                    that.treeData = res.data.data
                }
            })
        },
        handleNodeClick(row) {
            if (row) {
                this.configId = row.id
                this.tempRow = row
                this.queryByPage()
            }
        },
        handleCommand(command, row) {
            if (command === 'edit') {
                this.editBusinessForm = Object.assign({}, row)
                this.editBusinessFormVisible = true
                if (this.$refs.editBusinessForm) {
                    this.$refs.editBusinessForm.resetFields()
                }
            } else if (command === 'delete') {
                this.deleteBusinessSubmit(row)
            }
        },
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                configId: this.configId,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/getDetailListByConfigId', { params }).then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
        },
        handleCurrentChange(val) {
            this.pageNo = val
            this.queryByPage()
        },
        showAddBusinessDialog() {
            this.addBusinessFormVisible = true
            if (this.$refs.addBusinessForm) {
                this.$refs.addBusinessForm.resetFields()
            }
        },
        addBusinessSubmit() {
            let that = this
            this.$refs.addBusinessForm.validate(valid => {
                if (valid) {
                    that.$axios.post('cloud/entrance/insertBusinessConfig', that.addBusinessForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('新增成功')
                            that.addBusinessFormVisible = false
                            that.queryBusiness()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        editBusinessSubmit() {
            let that = this
            this.$refs.editBusinessForm.validate(valid => {
                if (valid) {
                    that.$axios.post('cloud/entrance/updateBusinessConfig', that.editBusinessForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('修改成功')
                            that.editBusinessFormVisible = false
                            that.queryBusiness()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        deleteBusinessSubmit(row) {
            if (this.configId) {
                let that = this
                this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                    let params = {
                        id: row.id,
                        _databaseId: this._databaseId
                    }
                    that.$axios.post('cloud/entrance/deleteBusinessConfig', params).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('删除成功')
                            that.queryBusiness()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
            } else {
                this.$message.error('请选择业务')
            }
        },
        //显示新增界面
        showAddDialog() {
            if (this.configId) {
                this.addFormVisible = true
                if (this.$refs.addForm) {
                    this.$refs.addForm.resetFields()
                }
                this.addForm.configId = this.configId
            } else {
                this.$message.error('请选择业务')
            }
            this.addForm.sort = this.total + 1
        },
        //新增
        addSubmit() {
            let that = this
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    console.log(that.addForm)
                    that.$axios.post('cloud/entrance/insertBusinessDetail', that.addForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('新增成功')
                            that.addFormVisible = false
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //显示编辑界面
        showEditDialog(row) {
            let that = this
            this.editForm = Object.assign({}, row)
            this.editFormVisible = true
            if (this.$refs.editForm) {
                this.$refs.editForm.resetFields()
            }
        },
        //编辑
        editSubmit() {
            let that = this
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    that.$axios.post('cloud/entrance/updateBusinessDetail', that.editForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('修改成功')
                            that.editFormVisible = false
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        deleteSubmit(row) {
            let that = this
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                that.$axios.post('cloud/entrance/deleteBusinessDetail', { id: row.id }).then(res => {
                    if (res.data.code == 200) {
                        that.$message.success('删除成功')
                        that.pageNo = 1
                        that.queryByPage()
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
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
.add-Business {
    border: 1px dashed #e5e9f2;
    border-radius: 6px;
    text-align: center;
    padding: 8px;
    margin-bottom: 15px;
    cursor: pointer;
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
.ywjbsx {
    margin: 10px 10px 30px 10px;
    padding: 10px;
    border-bottom: 1px solid #ebeef5;
}
</style>
