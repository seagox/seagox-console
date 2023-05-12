<template>
    <div style="padding:15px">
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="表" name="table">
                <el-form label-width="60px">
                    <el-row :gutter="15">
                        <el-col :span="4">
                            <el-form-item label="名称">
                                <el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="注释">
                                <el-input v-model="searchForm.remark" clearable placeholder="请输入注释"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-button icon="el-icon-search" @click="handleSearch">查询</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="showAddTableDialog">新增</el-button>
                            <el-button type="primary" @click="goModel">数据模型</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <!--列表-->
                <el-table :data="tableData" border highlight-current-row stripe :max-height="clientHeight - 235">
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="表名" align="center"></el-table-column>
                    <el-table-column prop="remark" label="注释" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showTableDesign(scope.row)">设计表</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" size="small" @click="showEditTableDialog(scope.row)">编辑</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" size="small" @click="delTableSubmit(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="视图" name="view">
                <el-form label-width="60px">
                    <el-row :gutter="15">
                        <el-col :span="4">
                            <el-form-item label="名称">
                                <el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="注释">
                                <el-input v-model="searchForm.remark" clearable placeholder="请输入注释"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-button icon="el-icon-search" @click="handleSearch">查询</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="showAddViewDialog">新增</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <!--列表-->
                <el-table :data="viewData" border highlight-current-row stripe :max-height="clientHeight - 235">
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="视图名" align="center"></el-table-column>
                    <el-table-column prop="remark" label="注释" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showViewDesign(scope.row)">设计视图</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" size="small" @click="showEditViewDialog(scope.row)">编辑</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" size="small" @click="delViewSubmit(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="存储过程" name="procedure">
                <el-form label-width="60px">
                    <el-row :gutter="15">
                        <el-col :span="4">
                            <el-form-item label="名称">
                                <el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="备注">
                                <el-input v-model="searchForm.remark" clearable placeholder="请输入备注"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-button icon="el-icon-search" @click="handleSearch">查询</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="showAddProcedureDialog">新增</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <!--列表-->
                <el-table :data="procedureData" border highlight-current-row stripe :max-height="clientHeight - 275">
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showEditProcedureDialog(scope.row)">编辑</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" size="small" @click="delProcedureSubmit(scope.row)">删除</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" size="small" @click="executeSubmit(scope.row)">执行</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!--新增表界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addTableFormVisible" :close-on-click-modal="false">
            <el-form :model="addTableForm" label-width="80px" :rules="tableRules" ref="addTableForm">
                <el-form-item label="表名" prop="name">
                    <el-input v-model="addTableForm.name" placeholder="请输入表名">
                        <template slot="prepend">{{ mark }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="注释" prop="remark">
                    <el-input v-model="addTableForm.remark" placeholder="请输入注释"></el-input>
                </el-form-item>
                <el-form-item label="初始化">
                    <el-checkbox-group v-model="initialize">
                        <!-- <el-checkbox label="is_valid">是否有效(1:是;2:否;)</el-checkbox> -->
                        <el-checkbox label="is_submit">是否有流程</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addTableFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addTableSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑表界面-->
        <el-dialog title="编辑" width="500px" :visible.sync="editTableFormVisible" :close-on-click-modal="false">
            <el-form :model="editTableForm" label-width="80px" :rules="tableRules" ref="editTableForm">
                <el-form-item label="表名" prop="name">
                    <el-input v-model.trim="editTableForm.name" placeholder="请输入表名"></el-input>
                </el-form-item>
                <el-form-item label="注释" prop="remark">
                    <el-input v-model="editTableForm.remark" placeholder="请输入注释"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editTableFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editTableSubmit">提交</el-button>
            </div>
        </el-dialog>
         <!--新增视图界面-->
        <el-dialog title="新增" width="750px" :visible.sync="addViewFormVisible" :close-on-click-modal="false">
            <el-form :model="addViewForm" label-width="70px" :rules="viewRules" ref="addViewForm">
                <el-form-item label="视图名" prop="name">
                    <el-input v-model="addViewForm.name" placeholder="请输入视图名"></el-input>
                </el-form-item>
                <el-form-item label="注释" prop="remark">
                    <el-input v-model="addViewForm.remark" placeholder="请输入注释"></el-input>
                </el-form-item>
                <el-form-item label="定义" prop="script">
                    <el-input type="textarea" :rows="12" placeholder="请输入定义" v-model="addViewForm.script"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addViewFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addViewSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑视图界面-->
        <el-dialog title="编辑" width="750px" :visible.sync="editViewFormVisible" :close-on-click-modal="false">
            <el-form :model="editViewForm" label-width="70px" :rules="viewRules" ref="editViewForm">
                <el-form-item label="表名" prop="name">
                    <el-input v-model.trim="editViewForm.name" placeholder="请输入表名"></el-input>
                </el-form-item>
                <el-form-item label="注释" prop="remark">
                    <el-input v-model="editViewForm.remark" placeholder="请输入注释"></el-input>
                </el-form-item>
                <el-form-item label="定义" prop="script">
                    <el-input type="textarea" :rows="12" placeholder="请输入定义" v-model="editViewForm.script"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editViewFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editViewSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--新增存储过程界面-->
        <el-dialog title="新增" width="750px" :visible.sync="addProcedureFormVisible" :close-on-click-modal="false">
            <el-form :model="addProcedureForm" label-width="80px" :rules="procedureRules" ref="addProcedureForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="addProcedureForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model.trim="addProcedureForm.remark" type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="请输入备注"></el-input>
                </el-form-item>
                <div class="toolView">
                    <el-button icon="el-icon-plus" @click="showParamAddDialog" size="small">新增</el-button>
                </div>
                <div class="table">
                    <el-table :data="addProcedureForm.config" border highlight-current-row stripe max-height="500">
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
                <el-button @click="addProcedureFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addProcedureSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑存储过程界面-->
        <el-dialog title="编辑" width="750px" :visible.sync="editProcedureFormVisible" :close-on-click-modal="false">
            <el-form :model="editProcedureForm" label-width="80px" :rules="procedureRules" ref="editProcedureForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="editProcedureForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model.trim="editProcedureForm.remark" type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="请输入备注"></el-input>
                </el-form-item>
                <div class="toolView">
                    <el-button icon="el-icon-plus" @click="showParamAddDialog" size="small">新增</el-button>
                </div>
                <div class="table">
                    <el-table :data="editProcedureForm.config" border highlight-current-row stripe max-height="500">
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
                <el-button @click="editProcedureFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editProcedureSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--新增参数界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addParamVisible" :close-on-click-modal="false">
            <el-form :model="addParamForm" label-width="80px" :rules="procedureRules" ref="addParamForm">
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
        <!--编辑参数界面-->
        <el-dialog title="编辑" width="500px" :visible.sync="editParamVisible" :close-on-click-modal="false">
            <el-form :model="editParamForm" label-width="80px" :rules="procedureRules" ref="editParamForm">
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            tableData: [],
            addTableFormVisible: false,
            addTableForm: {
                name: '',
                remark: ''
            },
            editTableFormVisible: false,
            editTableForm: {
                id: '',
                name: '',
                remark: ''
            },
            tableRules: {
                name: [
                    { required: true, message: '请输入表名', trigger: 'blur' },
                    { pattern: /^[a-z_]{1,}$/, message: '只能输入小写英文字母或下划线' }
                ],
                remark: [{ required: true, message: '请输入注释', trigger: 'blur' }]
            },
            initialize: ['company_id', 'user_id'],
            viewData: [],
            addViewFormVisible: false,
            addViewForm: {
                name: '',
                remark: '',
                script: ''
            },
            editViewFormVisible: false,
            editViewForm: {
                id: '',
                name: '',
                remark: '',
                script: ''
            },
            viewRules: {
                name: [
                    { required: true, message: '请输入视图名', trigger: 'blur' },
                    { pattern: /^[a-z_]{1,}$/, message: '只能输入小写英文字母或下划线' }
                ],
                remark: [{ required: true, message: '请输入注释', trigger: 'blur' }],
                script: [{ required: true, message: '请输入定义', trigger: 'blur' }]
            },
            procedureData: [],
            addProcedureFormVisible: false,
            addProcedureForm: {
                name: '',
                remark: '',
                config: []
            },
            editProcedureFormVisible: false,
            editProcedureForm: {
                id: '',
                name: '',
                remark: '',
                config: []
            },
            procedureRules: {
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
            activeName: 'table',
            searchForm: {
                name: '',
                remark: ''
            }
        }
    },
    computed: {
        mark() {
            return localStorage.getItem('mark') + '_'
        }
    },
    created() {
        this.queryTableAll()
        this.queryViewAll()
        this.queryProcedureAll()
    },
    methods: {
        async queryTableAll() {
            let params = {
                name: this.searchForm.name,
                remark: this.searchForm.remark
            }
            let res = await this.$axios.get('businessTable/queryAll', {params})
            if (res.data.code == 200) {
                this.tableData = res.data.data
            }
        },
        async queryViewAll() {
            let params = {
                name: this.searchForm.name,
                remark: this.searchForm.remark
            }
            let res = await this.$axios.get('view/queryAll', {params})
            if (res.data.code == 200) {
                this.viewData = res.data.data
            }
        },
        async queryProcedureAll() {
            let params = {
                name: this.searchForm.name,
                remark: this.searchForm.remark
            }
            let res = await this.$axios.get('procedure/queryAll', {params})
            if (res.data.code == 200) {
                this.procedureData = res.data.data
            }
        },
        handleSearch() {
            if(this.activeName === 'table') {
                this.queryTableAll()
            } else if (this.activeName === 'view') {
                this.queryViewAll()
            } else if (this.activeName === 'procedure') {
                this.queryProcedureAll()
            }
        },
        //显示新增表界面
        showAddTableDialog() {
            this.addTableFormVisible = true
            if (this.$refs.addTableForm) {
                this.$refs.addTableForm.resetFields()
            }
            this.initialize = ['company_id', 'user_id']
        },
        //显示新增视图界面
        showAddViewDialog() {
            this.addViewFormVisible = true
            if (this.$refs.addViewForm) {
                this.$refs.addViewForm.resetFields()
            }
        },
        //显示新增存储过程界面
        showAddProcedureDialog() {
            this.addProcedureFormVisible = true
            if (this.$refs.addProcedureForm) {
                this.$refs.addProcedureForm.resetFields()
            }
        },
        //新增表
        addTableSubmit() {
            let params = this.addTableForm
            params.initialize = this.initialize.toString()
            this.$refs.addTableForm.validate(valid => {
                if (valid) {
                    this.$axios.post('businessTable/insert', params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addTableFormVisible = false
                            this.queryTableAll()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //新增视图
        addViewSubmit() {
            let params = this.addViewForm
            this.$refs.addViewForm.validate(valid => {
                if (valid) {
                    this.$axios.post('view/insert', params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addViewFormVisible = false
                            this.queryViewAll()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //新增存储过程
        addProcedureSubmit() {
            this.$refs.addProcedureForm.validate(valid => {
                if (valid) {
                    var params = {
                        name: this.addProcedureForm.name,
                        remark: this.addProcedureForm.remark,
                        config: JSON.stringify(this.addProcedureForm.config)
                    }
                    this.$axios.post('procedure/insert', params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addProcedureFormVisible = false
                            this.queryProcedureAll()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //显示编辑表界面
        showEditTableDialog(row) {
            this.editTableForm = Object.assign({}, row)
            this.editTableFormVisible = true
            if (this.$refs.editTableForm) {
                this.$refs.editTableForm.resetFields()
            }
        },
        //显示编辑视图界面
        showEditViewDialog(row) {
            this.editViewForm = Object.assign({}, row)
            this.editViewFormVisible = true
            if (this.$refs.editViewForm) {
                this.$refs.editViewForm.resetFields()
            }
        },
        //显示编辑存储过程界面
        showEditProcedureDialog(row) {
            this.editProcedureForm = Object.assign({}, row)
            this.editProcedureForm.config = JSON.parse(this.editProcedureForm.config)
            this.editProcedureFormVisible = true
            if (this.$refs.editProcedureForm) {
                this.$refs.editProcedureForm.resetFields()
            }
        },
        //编辑表
        editTableSubmit() {
            this.$refs.editTableForm.validate(valid => {
                if (valid) {
                    this.$axios.post('businessTable/update', this.editTableForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.editTableFormVisible = false
                            this.queryTableAll()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //编辑视图
        editViewSubmit() {
            this.$refs.editViewForm.validate(valid => {
                if (valid) {
                    this.$axios.post('view/update', this.editViewForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.editViewFormVisible = false
                            this.queryViewAll()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //编辑存储过程
        editProcedureSubmit() {
            this.$refs.editProcedureForm.validate(valid => {
                if (valid) {
                    var params = {
                        id: this.editProcedureForm.id,
                        name: this.editProcedureForm.name,
                        remark: this.editProcedureForm.remark,
                        config: JSON.stringify(this.editProcedureForm.config)
                    }
                    this.$axios.post('procedure/update', params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.editProcedureFormVisible = false
                            this.queryProcedureAll()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //删除表
        delTableSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('businessTable/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.queryTableAll()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        //删除视图
        delViewSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('view/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.queryViewAll()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        //删除存储过程
        delProcedureSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('procedure/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.queryProcedureAll()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        //设计表
        showTableDesign(row) {
            this.$router.push({
                path: '/businessField',
                query: {
                    businessTableId: row.id
                }
            })
        },
        //设计视图
        showViewDesign(row) {
            this.$router.push({
                path: '/viewField',
                query: {
                    viewId: row.id
                }
            })
        },
        goModel() {
            this.$router.push({
                path: '/model'
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
                    if (this.addProcedureFormVisible) {
                        this.addProcedureForm.config = this.addProcedureForm.config.concat(JSON.parse(JSON.stringify(this.addParamForm)))
                    } else {
                        this.editProcedureForm.config = this.editProcedureForm.config.concat(JSON.parse(JSON.stringify(this.addParamForm)))
                    }
                }
            })
        },
        editParamSubmit() {
            this.$refs.editParamForm.validate(valid => {
                if (valid) {
                    this.editParamVisible = false
                    if (this.addProcedureFormVisible) {
                        this.addProcedureForm.config.splice(
                            this.currentParamIndex,
                            1,
                            JSON.parse(JSON.stringify(this.editParamForm))
                        )
                    } else {
                        this.editProcedureForm.config.splice(
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
                this.addProcedureForm.config.splice(index, 1)
            } else {
                this.editProcedureForm.config.splice(index, 1)
            }
        },
        moveUp(index) {
            if (index === 0) {
                return
            }
            if (this.addParamVisible) {
                this.addProcedureForm.config.splice(index - 1, 0, this.addProcedureForm.config[index])
                this.addProcedureForm.config.splice(index + 1, 1)
            } else {
                this.editProcedureForm.config.splice(index - 1, 0, this.editProcedureForm.config[index])
                this.editProcedureForm.config.splice(index + 1, 1)
            }
        },
        moveDown(index) {
            if (this.addParamVisible) {
                if (index === this.addProcedureForm.config.length - 1) {
                    return
                }
                this.addProcedureForm.config.splice(index + 2, 0, this.addProcedureForm.config[index])
                this.addProcedureForm.config.splice(index, 1)
            } else {
                if (index === this.editForm.config.length - 1) {
                    return
                }
                this.editProcedureForm.config.splice(index + 2, 0, this.editProcedureForm.config[index])
                this.editProcedureForm.config.splice(index, 1)
            }
        },
        executeSubmit(row) {
            this.currentRowId = row.id
            let config = JSON.parse(row.config)
            if (config.length == 0) {
                this.$axios.post('procedure/execute/' + row.id, {}).then(res => {
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
            this.$axios.post('procedure/execute/' + this.currentRowId, params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('执行成功')
                    this.executeVisible = false
                } else {
                    this.$message.error(res.data.message)
                }
            })
        }
    }
}
</script>
