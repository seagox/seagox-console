<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
            <el-button type="danger" icon="el-icon-success" @click="oneKeyVisible=true" size="small" style="float: right;margin-right: 20px">一键存储</el-button>
        </div>
        <div class="searchView">
            <el-form label-width="65px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="名称">
                            <el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="备注">
                            <el-input v-model="searchForm.remark" clearable placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            @click.native="handleSearch"
                            style="margin-left: 15px"
                        >查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <!--列表-->
            <el-table :data="tableData" border highlight-current-row stripe>
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="executeSubmit(scope.row)">执行</el-button>
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
        <!--新增界面-->
        <el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model.trim="addForm.remark" type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="请输入备注"></el-input>
                </el-form-item>
                <div class="toolView">
                    <el-button icon="el-icon-plus" @click="showParamAddDialog" size="small">新增</el-button>
                </div>
                <div class="table">
                    <el-table :data="addForm.config" border highlight-current-row stripe max-height="500">
                        <el-table-column prop="field" label="字段" align="center"></el-table-column>
                        <el-table-column prop="desc" label="说明" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="showParamEditDialog(scope.$index, scope.row)" size="small">编辑</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" @click="paramDelSubmit(scope.$index)" size="small">删除</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" @click="moveUp(scope.$index)" size="small">上移</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" @click="moveDown(scope.$index)" size="small">下移</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model.trim="editForm.remark" type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="请输入备注"></el-input>
                </el-form-item>
                <div class="toolView">
                    <el-button icon="el-icon-plus" @click="showParamAddDialog" size="small">新增</el-button>
                </div>
                <div class="table">
                    <el-table :data="editForm.config" border highlight-current-row stripe max-height="500">
                        <el-table-column prop="field" label="字段" align="center"></el-table-column>
                        <el-table-column prop="desc" label="说明" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="showParamEditDialog(scope.$index, scope.row)" size="small">编辑</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" @click="paramDelSubmit(scope.$index)" size="small">删除</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" @click="moveUp(scope.$index)" size="small">上移</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" @click="moveDown(scope.$index)" size="small">下移</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新增" width="500px" :visible.sync="addParamVisible" :close-on-click-modal="false">
            <el-form :model="addParamForm" label-width="80px" :rules="formRules" ref="addParamForm">
                <el-form-item label="字段" prop="field">
                    <el-input v-model="addParamForm.field" placeholder="请输入字段"></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="desc">
                    <el-input
                        v-model="addParamForm.desc"
                        placeholder="请输入说明"
                        maxlength="5"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addParamVisible = false">取消</el-button>
                <el-button type="primary" @click="addParamSubmit">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑" width="500px" :visible.sync="editParamVisible" :close-on-click-modal="false">
            <el-form :model="editParamForm" label-width="80px" :rules="formRules" ref="editParamForm">
                <el-form-item label="字段" prop="field">
                    <el-input v-model="editParamForm.field" placeholder="请输入字段"></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="desc">
                    <el-input
                        v-model="editParamForm.desc"
                        placeholder="请输入说明"
                        maxlength="5"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editParamVisible = false">取消</el-button>
                <el-button type="primary" @click="editParamSubmit">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="参数" width="500px" :visible.sync="executeVisible" :close-on-click-modal="false">
            <el-form label-width="80px">
                <el-form-item :label="item.desc" v-for="(item, index) in executeJson" :key="index">
                    <el-input
                        v-model="item.value"
                        :placeholder="'请输入' + item.desc"
                        clearable>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="executeVisible = false">取消</el-button>
                <el-button type="primary" @click="executeParamSubmit">执行</el-button>
            </div>
        </el-dialog>
        <el-dialog title="一键储存" width="500px" :visible.sync="oneKeyVisible" :close-on-click-modal="false">
            <el-form label-width="80px" :model="oneKeyForm">
                <el-form-item label="年份">
                    <el-input type="number" v-model.trim="oneKeyForm.date_year" :placeholder="'请输入年份'" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="oneKeyVisible = false">取消</el-button>
                <el-button type="primary" @click="handleOneKey">执行</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                pageNo: 1,
                total: 0,
                addFormVisible: false,
                addForm: {
                    name: '',
                    remark: '',
                    config: []
                },
                editFormVisible: false,
                editForm: {
                    id: '',
                    name: '',
                    remark: '',
                    config: []
                },
                formRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    remark: [{required: true, message: '请输入备注', trigger: 'blur'}],
                    field: [{required: true, message: '请输入字段', trigger: 'blur'}],
                    desc: [{required: true, message: '请输入说明', trigger: 'blur'}]
                },
                addParamVisible: false,
                addParamForm: {
                    field: '',
                    desc: ''
                },
                editParamVisible: false,
                editParamForm: {
                    field: '',
                    desc: ''
                },
                currentParamIndex: -1,
                executeVisible: false,
                executeJson: [],
                currentRowId: '',
                searchForm: {
                    name: '',
                    remark: ''
                },
                oneKeyVisible: false,
                oneKeyForm: {
                    date_year: null
                }
            }
        },
        created() {
            this.queryByPage()
        },
        methods: {
            async queryByPage() {
                const params = {
                    pageNo: this.pageNo,
                    name: this.searchForm.name,
                    remark: this.searchForm.remark
                }
                let res = await this.$axios.get('jellyProcedure/queryByPage', {params})

                if (res.data.code == 200) {
                    this.tableData = res.data.data.list
                    this.total = res.data.data.total
                }
            },
            handleSearch() {
                this.pageNo = 1
                this.queryByPage()
            },
            handleCurrentChange() {
                this.queryByPage()
            },
            showAddDialog() {
                this.addFormVisible = true
                if (this.$refs.addForm) {
                    this.$refs.addForm.resetFields()
                }
            },
            addSubmit() {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        var params = {
                            name: this.addForm.name,
                            remark: this.addForm.remark,
                            config: JSON.stringify(this.addForm.config)
                        }
                        this.$axios.post('jellyProcedure/insert', params).then(res => {
                            if (res.data.code == 200) {
                                this.$message.success('新增成功')
                                this.addFormVisible = false
                                this.queryByPage()
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            showEditDialog(row) {
                this.editForm = Object.assign({}, row)
                this.editForm.config = JSON.parse(this.editForm.config)
                this.editFormVisible = true
                if (this.$refs.editForm) {
                    this.$refs.editForm.resetFields()
                }
            },
            editSubmit() {
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        var params = {
                            id: this.editForm.id,
                            name: this.editForm.name,
                            remark: this.editForm.remark,
                            config: JSON.stringify(this.editForm.config)
                        }
                        this.$axios.post('jellyProcedure/update', params).then(res => {
                            if (res.data.code == 200) {
                                this.$message.success('修改成功')
                                this.editFormVisible = false
                                this.queryByPage()
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            deleteSubmit(row) {
                this.$confirm('亲，确认要删除吗？', '提示', {type: 'warning'}).then(() => {
                    this.$axios.post('jellyProcedure/delete/' + row.id, {}).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('删除成功')
                            this.pageNo = 1
                            this.queryByPage()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                })
            },
            executeSubmit(row) {
                this.currentRowId = row.id
                let config = JSON.parse(row.config)
                if (config.length == 0) {
                    this.$axios.post('jellyProcedure/execute/' + row.id, {}).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('执行成功')
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                } else {
                    this.executeJson = config
                    this.executeVisible = true
                }

            },
            executeParamSubmit() {
                let params = {}
                for (var i = 0; i < this.executeJson.length; i++) {
                    params[this.executeJson[i].field] = this.executeJson[i].value
                }
                this.$axios.post('jellyProcedure/execute/' + this.currentRowId, params).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('执行成功')
                        this.executeVisible = false
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },
            showParamAddDialog() {
                this.addParamVisible = true
                if (this.$refs.addParamForm) {
                    this.$refs.addParamForm.resetFields()
                }
            },
            addParamSubmit() {
                this.$refs.addParamForm.validate(valid => {
                    if (valid) {
                        this.addParamVisible = false
                        if (this.addFormVisible) {
                            this.addForm.config = this.addForm.config.concat(JSON.parse(JSON.stringify(this.addParamForm)))
                        } else {
                            this.editForm.config = this.editForm.config.concat(JSON.parse(JSON.stringify(this.addParamForm)))
                        }
                    }
                })
            },
            editParamSubmit() {
                this.$refs.editParamForm.validate(valid => {
                    if (valid) {
                        this.editParamVisible = false
                        if (this.addFormVisible) {
                            this.addForm.config.splice(
                                this.currentParamIndex,
                                1,
                                JSON.parse(JSON.stringify(this.editParamForm))
                            )
                        } else {
                            this.editForm.config.splice(
                                this.currentParamIndex,
                                1,
                                JSON.parse(JSON.stringify(this.editParamForm))
                            )
                        }
                    }
                })
            },
            showParamEditDialog(index, row) {
                this.editParamVisible = true
                if (this.$refs.editParamForm) {
                    this.$refs.editParamForm.resetFields()
                }
                this.editParamForm = Object.assign({}, row)
                this.currentParamIndex = index
            },
            paramDelSubmit(index) {
                if (this.addParamVisible) {
                    this.addForm.config.splice(index, 1)
                } else {
                    this.editForm.config.splice(index, 1)
                }
            },
            moveUp(index) {
                if (index === 0) {
                    return
                }
                if (this.addParamVisible) {
                    this.addForm.config.splice(index - 1, 0, this.addForm.config[index])
                    this.addForm.config.splice(index + 1, 1)
                } else {
                    this.editForm.config.splice(index - 1, 0, this.editForm.config[index])
                    this.editForm.config.splice(index + 1, 1)
                }
            },
            moveDown(index) {
                if (this.addParamVisible) {
                    if (index === this.addForm.config.length - 1) {
                        return
                    }
                    this.addForm.config.splice(index + 2, 0, this.addForm.config[index])
                    this.addForm.config.splice(index, 1)
                } else {
                    if (index === this.editForm.config.length - 1) {
                        return
                    }
                    this.editForm.config.splice(index + 2, 0, this.editForm.config[index])
                    this.editForm.config.splice(index, 1)
                }

            },
            handleOneKey() {
                this.$confirm('确定要执行全部储存过程？', '提示', {type: 'warning'}).then(() => {
                    this.$axios.post('jellyProcedure/executeAll/' + this.oneKeyForm.date_year).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('执行成功')
                            this.oneKeyVisible = false
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                })
            }
        }
    }
</script>
