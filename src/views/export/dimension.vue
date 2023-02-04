<template>
    <div class="container">
        <el-container :style="'height:' + (clientHeight - 110) + 'px'">
            <el-aside width="420px" class="aside" style="padding-left:15px;padding-top:15px">
                <div class="add-classify">
                    <span style="margin-left:10px;">ODS表</span>
                </div>
                <el-table
                    :data="odsTableList"
                    highlight-current-row
                    :show-header="false"
                    @current-change="handleNodeClick"
                    class="border">
                    <el-table-column show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i class="el-icon-document" style="font-size:14px;"></i>
                            <span style="font-size:14px;margin-left:8px;">{{ scope.row.comment }} - {{scope.row.name }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-aside>
            <el-main>
                <div class="toolView">
                    <el-button type="text" icon="el-icon-plus" @click="handleAdd()" size="small">新增</el-button>
                </div>
                <div class="table">
                    <el-table :data="dimensionData" border highlight-current-row stripe>
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column label="维度名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="实体表字段编码" prop="odmFieldCode" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="实体表字段名称" prop="odmFieldName" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="维度表" prop="dimSourceName" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="维度表编码字段" prop="dimFieldCode" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="维度表名称字段" prop="dimFieldName" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="维度表年度字段" prop="dimFieldYear" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
            </el-main>
        </el-container>
        <el-dialog title="新增" width="550px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="130px" :rules="formRules" ref="addForm">
                <el-form-item label="维度名称" prop="name">
                    <el-input v-model.trim="addForm.name" placeholder="请输入维度名称"></el-input>
                </el-form-item>
                <el-form-item label="实体表字段编码" prop="odmCodeField">
                    <el-select v-model="addForm.odmCodeField" placeholder="请选择实体表字段编码">
                        <el-option
                            v-for="item in odsTableFiles"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实体表字段名称" prop="odmNameField">
                    <el-select v-model="addForm.odmNameField" placeholder="请选择实体表字段名称">
                        <el-option
                            v-for="item in odsTableFiles"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="维度表" prop="dimSource">
                    <el-select v-model="addForm.dimSource" @change="tableChange" placeholder="请选择维度表">
                        <el-option
                            v-for="item in dimTableList"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="维度表编码字段" prop="dimCodeField">
                    <el-select v-model="addForm.dimCodeField" placeholder="请选择维度表编码字段">
                        <el-option
                            v-for="item in dimTableFiles"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="维度表名称字段" prop="dimNameField">
                    <el-select v-model="addForm.dimNameField" placeholder="请选择维度表名称字段">
                        <el-option
                            v-for="item in dimTableFiles"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="维度表年度字段" prop="dimYearField">
                    <el-select v-model="addForm.dimYearField" placeholder="请选择维度表年度字段">
                        <el-option
                            v-for="item in dimTableFiles"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑" width="550px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="130px" :rules="formRules" ref="editForm">
                <el-form-item label="维度名称" prop="name">
                    <el-input v-model.trim="editForm.name" placeholder="请输入维度名称"></el-input>
                </el-form-item>
                <el-form-item label="实体表字段编码" prop="odmCodeField">
                    <el-select v-model="editForm.odmCodeField" placeholder="请选择实体表字段编码">
                        <el-option
                            v-for="item in odsTableFiles"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实体表字段名称" prop="odmNameField">
                    <el-select v-model="editForm.odmNameField" placeholder="请选择实体表字段名称">
                        <el-option
                            v-for="item in odsTableFiles"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="维度表" prop="dimSource">
                    <el-select v-model="editForm.dimSource" @change="tableChange" placeholder="请选择维度表">
                        <el-option
                            v-for="item in dimTableList"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="维度表编码字段" prop="dimCodeField">
                    <el-select v-model="editForm.dimCodeField" placeholder="请选择维度表编码字段">
                        <el-option
                            v-for="item in dimTableFiles"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="维度表名称字段" prop="dimNameField">
                    <el-select v-model="editForm.dimNameField" placeholder="请选择维度表名称字段">
                        <el-option
                            v-for="item in dimTableFiles"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="维度表年度字段" prop="dimYearField">
                    <el-select v-model="editForm.dimYearField" placeholder="请选择维度表年度字段">
                        <el-option
                            v-for="item in dimTableFiles"
                            :key="item.id"
                            :label="item.name + '(' + item.comment + ')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
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
                odsTableList: [],
                odsTableFiles: [],
                currentODSId: null,
                dimensionData: [],
                dimTableList: [],
                dimTableFiles: [],
                pageNo: 1,
                total: 0,
                addFormVisible: false,
                addForm: {
                    name: null,
                    odmSource: null,
                    odmCodeField: null,
                    odmNameField: null,
                    dimSource: null,
                    dimCodeField: null,
                    dimNameField: null,
                    dimYearField: null
                },
                editFormVisible: false,
                editForm: {
                    id: null,
                    name: null,
                    odmSource: null,
                    odmCodeField: null,
                    odmNameField: null,
                    dimSource: null,
                    dimCodeField: null,
                    dimNameField: null,
                    dimYearField: null
                },
                formRules: {
                    name: [{required: true, message: '请输入维度名称', trigger: 'blur'}],
                    odmCodeField: [{required: true, message: '请选择实体表字段编码', trigger: 'change'}],
                    odmNameField: [{required: true, message: '请选择实体表字段名称', trigger: 'change'}],
                    dimSource: [{required: true, message: '请选择维度表', trigger: 'change'}],
                    dimCodeField: [{required: true, message: '请选择维度表编码字段', trigger: 'change'}],
                    dimNameField: [{required: true, message: '请选择维度表名称字段', trigger: 'change'}]
                }
            }
        },
        created() {
            this.queryODSTableByType()
            this.queryDIMTableByType()
        },
        methods: {
            queryODSTableByType() {
                let that = this
                that.$axios.post('businessTable/queryByType/ods', {}).then(res => {
                    if (res.data.code === 200) {
                        that.odsTableList = res.data.data
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            queryDIMTableByType() {
                let that = this
                that.$axios.post('businessTable/queryByType/dim', {}).then(res => {
                    if (res.data.code === 200) {
                        that.dimTableList = res.data.data
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            handleNodeClick(row) {
                this.currentODSId = row.id
                this.queryByPage(row.id)
                this.queryOdsFiles(row.id)
            },
            queryOdsFiles(id) {
                let that = this
                that.$axios.get('businessField/queryByTableId/' + id).then(res => {
                    if (res.data.code === 200) {
                        that.odsTableFiles = res.data.data
                    }
                })
            },
            handleCurrentChange() {
                this.queryByPage(this.currentODSId)
            },
            queryByPage(odsId) {
                let that = this
                const params = {
                    pageNo: this.pageNo,
                    odsId: odsId
                }
                that.$axios.get('exportDimension/queryByPage', {params}).then(res => {
                    if (res.data.code === 200) {
                        that.dimensionData = res.data.data.list
                        that.total = res.data.data.total
                    }
                })
            },
            tableChange(id) {
                let that = this
                that.$axios.get('businessField/queryByTableId/' + id).then(res => {
                    if (res.data.code === 200) {
                        that.dimTableFiles = res.data.data
                    }
                })
            },
            handleAdd() {
                if (!this.currentODSId) {
                    this.$message.warning('请先选择ODS表！')
                    return
                }
                this.addFormVisible = true
                if (this.$refs.addForm) {
                    this.$refs.addForm.resetFields()
                }
            },
            addSubmit() {
                let that = this
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        that.$set(that.addForm, 'odmSource', that.currentODSId)
                        that.$axios.post('exportDimension/insert', that.addForm).then(res => {
                            if (res.data.code === 200) {
                                that.$message.success('新增成功！')
                                that.addFormVisible = false
                                that.queryByPage(this.currentODSId)
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            handleEdit(row) {
                this.tableChange(row.dimSource)
                if (this.$refs.editForm) {
                    this.$refs.editForm.resetFields()
                }
                this.editForm = Object.assign({}, row)
                this.editFormVisible = true
            },
            editSubmit() {
                let that = this
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        that.$axios.post('exportDimension/update', that.editForm).then(res => {
                            if (res.data.code === 200) {
                                that.$message.success('编辑成功！')
                                that.editFormVisible = false
                                that.queryByPage(this.currentODSId)
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            handleDel(row) {
                let that = this
                this.$confirm('亲，确认要删除吗', '提示', {type: 'warning'}).then(() => {
                    that.$axios.post('exportDimension/delete/' + row.id, {}).then(res => {
                        if (res.data.code === 200) {
                            that.$message.success('删除成功')
                            that.pageNo = 1
                            that.queryByPage(this.currentODSId)
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
::v-deep .el-main {
    border-left: 1px solid #e5e9f2;
    padding: 0px;
    margin-left: 15px;
}

::v-deep .is-without-controls .el-input .el-input__inner {
    text-align: left;
}

.add-classify {
    border: 1px dashed #e5e9f2;
    border-radius: 6px;
    text-align: center;
    padding: 8px;
    margin-bottom: 15px;
}

::v-deep .el-table__body tr.current-row td:not(.is-center) {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}

::v-deep .el-aside .el-table__body tr.current-row .is-center {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
}

::v-deep .aside .el-table td {
    border-bottom: 0px solid #ebeef5;
}
</style>