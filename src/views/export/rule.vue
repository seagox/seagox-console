<template>
    <div>
        <el-container :style="'height:' + (clientHeight - 110) + 'px'">
            <el-aside width="420px" class="aside" style="padding-left:15px;padding-top:15px">
                <div class="add-classify" @click="showAddRuleDialog">
                    <i class="el-icon-circle-plus"></i>
                    <span style="margin-left:10px;">添加规则</span>
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
                            <i class="el-icon-document" style="font-size:14px;"></i>
                            <span style="font-size:14px;margin-left:8px;">{{ scope.row.code }} &nbsp;&nbsp; {{ scope.row.name }}</span>
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
                                    <el-dropdown-item icon="el-icon-copy-document" command="copy">复制</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </el-aside>
            <el-main>
                <div class="toolView">
                    <el-button type="text" icon="el-icon-plus" @click="showAddRuleDetailDialog" size="small">新增</el-button>
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table :data="tableData" border highlight-current-row stripe>
                        <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                        <el-table-column prop="comment" label="字段名称" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="col" label="对应列" align="center" width="200"></el-table-column>
                        <el-table-column prop="type" label="转换类型" align="center" width="200" :formatter="typeFormatter"></el-table-column>
                        <el-table-column label="操作" align="center" width="200">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="showEditRuleDetailDialog(scope.row)">编辑</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" size="small" @click="deleteRuleDetailSubmit(scope.row)">删除</el-button>
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
            </el-main>
        </el-container>
        <!--新增界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addRuleFormVisible" :close-on-click-modal="false">
            <el-form :model="addRuleForm" label-width="80px" :rules="ruleFormRules" ref="addRuleForm">
                <el-form-item label="规则编码" prop="code">
                    <el-input v-model="addRuleForm.code" placeholder="请输入规则编码"></el-input>
                </el-form-item>
                <el-form-item label="规则名称" prop="name">
                    <el-input v-model="addRuleForm.name" placeholder="请输入规则名称"></el-input>
                </el-form-item>
                <el-form-item label="数据源" prop="dataSource">
                    <el-select v-model="addRuleForm.dataSource" filterable placeholder="请选择数据源">
                        <el-option
                            v-for="item in dataSourceOptions"
                            :key="item.id"
                            :label="item.comment + ' - ' + item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收支类型" prop="szCode">
                    <el-select v-model="addRuleForm.szCode" filterable placeholder="请选择收支类型">
                        <el-option
                            v-for="item in szList"
                            :key="item.id"
                            :label="item.code + ' - ' + item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资金性质" prop="scCode">
                    <el-select v-model="addRuleForm.scCode" filterable placeholder="请选择资金性质">
                        <el-option
                            v-for="item in scList"
                            :key="item.id"
                            :label="item.code + ' - ' + item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务规则" prop="businessRuleId">
                    <el-select v-model="addRuleForm.businessRuleId" filterable placeholder="请选择数据源">
                        <el-option
                            v-for="item in preconditionOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRuleFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addRuleSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="500px" :visible.sync="editRuleFormVisible" :close-on-click-modal="false">
            <el-form :model="editRuleForm" label-width="80px" :rules="ruleFormRules" ref="editRuleForm">
                <el-form-item label="规则编码" prop="code">
                    <el-input v-model="editRuleForm.code" placeholder="请输入规则编码"></el-input>
                </el-form-item>
                <el-form-item label="规则名称" prop="name">
                    <el-input v-model="editRuleForm.name" placeholder="请输入规则名称"></el-input>
                </el-form-item>
                <el-form-item label="数据源" prop="dataSource">
                    <el-select v-model="editRuleForm.dataSource" filterable placeholder="请选择数据源">
                        <el-option
                            v-for="item in dataSourceOptions"
                            :key="item.id"
                            :label="item.comment + ' - ' + item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收支类型" prop="szCode">
                    <el-select v-model="editRuleForm.szCode" filterable placeholder="请选择收支类型">
                        <el-option
                            v-for="item in szList"
                            :key="item.id"
                            :label="item.code + ' - ' + item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资金性质" prop="scCode">
                    <el-select v-model="editRuleForm.scCode" filterable placeholder="请选择资金性质">
                        <el-option
                            v-for="item in scList"
                            :key="item.id"
                            :label="item.code + ' - ' + item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务规则" prop="businessRuleId">
                    <el-select v-model="editRuleForm.businessRuleId" filterable placeholder="请选择数据源">
                        <el-option
                            v-for="item in preconditionOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editRuleFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editRuleSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增" width="750px" :visible.sync="addFieldFormVisible" :close-on-click-modal="false">
            <el-form :model="addFieldForm" label-width="80px" :rules="ruleDetailFormRules" ref="addFieldForm">
                <el-form-item label="字段" prop="field">
                    <el-select v-model="addFieldForm.field" filterable placeholder="请选择数据源">
                        <el-option
                            v-for="item in tableFiles"
                            :key="item.id"
                            :label="item.comment"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对应列" prop="col">
                    <el-select v-model="addFieldForm.col" filterable placeholder="请选择数据源">
                        <el-option
                            v-for="item in colList"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转换类型" prop="type">
                    <el-select v-model="addFieldForm.type" filterable placeholder="请选择字段转换类型">
                        <el-option
                            v-for="item in fieldTypes"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转换来源" prop="source" v-if="addFieldForm.type === 2">
                    <el-select v-model="addFieldForm.source" filterable placeholder="请选择字典">
                        <el-option
                            v-for="item in classifyOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addFieldForm.type === 7" label="SQL" prop="sqlSource">
                    <div>注：转换值设为key，获取的值设为value</div>
                    <codemirrorXml ref="codemirror" v-model="addFieldForm.sqlSource" placeholder="请输入SQL"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFieldFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addFieldSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="750px" :visible.sync="editFieldFormVisible" :close-on-click-modal="false">
            <el-form :model="editFieldForm" label-width="80px" :rules="ruleDetailFormRules" ref="editFieldForm">
                <el-form-item label="字段" prop="field">
                    <el-select v-model="editFieldForm.field" filterable placeholder="请选择数据源">
                        <el-option
                            v-for="item in tableFiles"
                            :key="item.id"
                            :label="item.comment"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对应列" prop="col">
                    <el-select v-model="editFieldForm.col" filterable placeholder="请选择数据源">
                        <el-option
                            v-for="item in colList"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转换类型" prop="type">
                    <el-select v-model="editFieldForm.type" filterable placeholder="请选择字段转换类型">
                        <el-option
                            v-for="item in fieldTypes"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转换来源" prop="source" v-if="editFieldForm.type === 2">
                    <el-select v-model="editFieldForm.source" filterable placeholder="请选择字典">
                        <el-option
                            v-for="item in classifyOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="editFieldForm.type === 7" label="SQL" prop="sqlSource">
                    <div>注：转换值设为key，获取的值设为value</div>
                    <codemirrorXml ref="codemirror" v-model="editFieldForm.sqlSource" placeholder="请输入SQL"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFieldFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editFieldSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import codemirrorXml from '@/views/components/codemirror/xml'

    export default {
        components: {
            codemirrorXml
        },
        data() {
            return {
                clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
                treeData: [],
                dataSourceOptions: [],
                tableFiles: [],
                colList: [],
                initialize: ['company_id', 'user_id'],
                addRuleFormVisible: false,
                addRuleForm: {
                    code: '',
                    name: '',
                    dataSource: '',
                    businessRuleId: '',
                    szCode: '',
                    scCode: ''
                },
                editRuleFormVisible: false,
                editRuleForm: {
                    id: '',
                    code: '',
                    name: '',
                    dataSource: '',
                    businessRuleId: '',
                    szCode: '',
                    scCode: ''
                },
                ruleFormRules: {
                    code: [
                        {required: true, message: '请输入规则编码', trigger: 'blur'},
                        {max: 30, message: '请输入30个以内字符', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入规则名称', trigger: 'blur'},
                        {max: 50, message: '请输入50个以内字符', trigger: 'blur'}
                    ],
                    dataSource: [{required: true, message: '请选择数据源', trigger: 'change'}]
                },
                ruleId: '',
                dataSourceId: '',
                tableData: [],
                pageNo: 1,
                total: 0,
                addFieldFormVisible: false,
                addFieldForm: {
                    exportRuleId: '',
                    field: '',
                    col: '',
                    type: 1,
                    source: '',
                    sqlSource: ''
                },
                editFieldFormVisible: false,
                editFieldForm: {
                    id: '',
                    exportRuleId: '',
                    field: '',
                    col: '',
                    type: 1,
                    source: '',
                    sqlSource: ''
                },
                ruleDetailFormRules: {
                    field: [{required: true, message: '请选择字段', trigger: 'change'}],
                    col: [{required: true, message: '请选择对应列', trigger: 'change'}],
                    source: [{required: true, message: '请选择来源', trigger: 'change'}],
                    sqlSource: [{required: true, message: '请填写sql语句', trigger: 'blur'}]
                },
                fieldTypes: [
                    {name: "无", value: 1},
                    {name: "字典", value: 2},
                    {name: "用户", value: 3},
                    {name: "部门", value: 4},
                    {name: "唯一字段", value: 5},
                    {name: "地址", value: 6},
                    {name: "sql获取", value: 7},
                ],
                classifyOptions: [],
                preconditionOptions: [],
                szList: [],
                scList: []
            }
        },
        mounted() {
            let letters = ["A", "B", "C", "D", "E", "F", "G",
                "H", "I", "J", "K", "L", "M", "N",
                "O", "P", "Q", "R", "S", "T", "U",
                "V", "W", "X", "Y", "Z"]
            let colList = ["A", "B", "C", "D", "E", "F", "G",
                "H", "I", "J", "K", "L", "M", "N",
                "O", "P", "Q", "R", "S", "T", "U",
                "V", "W", "X", "Y", "Z"]
            letters.forEach(letter1 => {
                letters.forEach(letter2 => {
                    colList.push(letter1 + letter2)
                })
            })
            this.colList = colList
        },
        created() {
            this.querySZType()
            this.querySC()
            this.queryRules()
            this.queryBusinessTable()
            this.queryDictionaryClassify()
            this.queryBusinessRule()
        },
        methods: {
            querySZType() {
                // 收支类型
                this.$axios.get('dictionaryDetail/queryDisplay?classifyId=18').then(res => {
                    if (res.data.code == 200) {
                        this.szList = res.data.data
                    }
                })
            },
            querySC() {
                // 资金性质
                this.$axios.get('dictionaryDetail/queryDisplay?classifyId=14').then(res => {
                    if (res.data.code == 200) {
                        this.scList = res.data.data
                    }
                })
            },
            queryRules() {
                let that = this
                that.$axios.get('exportRule/queryAll').then(res => {
                    if (res.data.code === 200) {
                        that.treeData = res.data.data
                    }
                })
            },
            async queryBusinessTable() {
                let res = await this.$axios.get('businessTable/queryAll')
                if (res.data.code === 200) {
                    this.dataSourceOptions = res.data.data
                }
            },
            queryFileByTableId(tableId) {
                let that = this
                that.$axios.get('businessField/queryByTableId/' + tableId).then(res => {
                    if (res.data.code === 200) {
                        that.tableFiles = res.data.data
                    }
                })
            },
            showAddRuleDialog() {
                this.addRuleFormVisible = true
                if (this.$refs.addRuleForm) {
                    this.$refs.addRuleForm.resetFields()
                }
                this.initialize = ['company_id', 'user_id']
            },
            handleNodeClick(row) {
                if (row) {
                    this.ruleId = row.id
                    this.dataSourceId = row.dataSource
                    this.pageNo = 1
                    this.queryRuleDetailByPage()
                }
            },
            queryRuleDetailByPage() {
                let that = this
                const params = {
                    pageNo: this.pageNo,
                    ruleId: this.ruleId
                }
                that.$axios.get('exportRuleDetail/queryByPage', {params}).then(res => {
                    if (res.data.code === 200) {
                        that.tableData = res.data.data.list
                        that.total = res.data.data.total
                    }
                })
            },
            handleCommand(command, row) {
                if (command === 'edit') {
                    console.log(row)
                    if (this.$refs.editRuleForm) {
                        this.$refs.editRuleForm.resetFields()
                    }
                    this.editRuleForm = Object.assign({}, row)
                    this.editRuleFormVisible = true
                } else if (command === 'delete') {
                    this.deleteRuleSubmit(row)
                } else if (command === 'copy') {
                    this.$axios.post('exportRule/copyRule/' + row.id, {}).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('复制成功')
                            this.queryRules()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            },
            addRuleSubmit() {
                let that = this
                let params = that.addRuleForm
                params.initialize = this.initialize.toString()
                this.$refs.addRuleForm.validate(valid => {
                    if (valid) {
                        that.$axios.post('exportRule/insert', params).then(res => {
                            if (res.data.code === 200) {
                                that.$message.success('新增成功')
                                that.addRuleFormVisible = false
                                that.queryRules()
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            editRuleSubmit() {
                let that = this
                this.$refs.editRuleForm.validate(valid => {
                    if (valid) {
                        that.$axios.post('exportRule/update', that.editRuleForm).then(res => {
                            if (res.data.code === 200) {
                                that.$message.success('修改成功')
                                that.editRuleFormVisible = false
                                that.queryRules()
                            } else if (res.data.code === 10011) {
                                this.$confirm('您已变更数据源，是否先删要除旧数据源对应列数据？', '提示', {type: 'warning'}).then(() => {
                                    that.deleteRuleDetailByRuleId(that.editRuleForm.id)
                                })
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            // 根据规则id删除所有规则明细
            deleteRuleDetailByRuleId(ruleId) {
                let that = this
                that.$axios.post('exportRuleDetail/deleteByRuleId/' + ruleId, {}).then(res => {
                    if (res.data.code === 200) {
                        that.$message.success('删除成功！')
                        this.queryRuleDetailByPage()
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            deleteRuleSubmit(row) {
                let that = this
                this.$confirm('亲，确认要删除吗？', '提示', {type: 'warning'}).then(() => {
                    that.$axios.post('exportRule/delete/' + row.id, {}).then(res => {
                        if (res.data.code === 200) {
                            that.$message.success('删除成功')
                            that.queryRules()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
            },
            handleCurrentChange() {
                this.queryRuleDetailByPage()
            },
            //显示新增界面
            showAddRuleDetailDialog() {
                if (this.ruleId) {
                    if (this.dataSourceId) {
                        this.queryFileByTableId(this.dataSourceId)
                    }
                    this.addFieldFormVisible = true
                    if (this.$refs.addFieldForm) {
                        this.$refs.addFieldForm.resetFields()
                    }
                    this.addFieldForm.exportRuleId = this.ruleId
                } else {
                    this.$message.error('请选择规则')
                }
            },
            //新增
            addFieldSubmit() {
                let that = this
                this.$refs.addFieldForm.validate(valid => {
                    if (valid) {
                        that.$axios.post('exportRuleDetail/insert', that.addFieldForm).then(res => {
                            if (res.data.code === 200) {
                                that.$message.success('新增成功')
                                that.addFieldFormVisible = false
                                that.queryRuleDetailByPage()
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            //显示编辑界面
            showEditRuleDetailDialog(row) {
                if (this.dataSourceId) {
                    this.queryFileByTableId(this.dataSourceId)
                }
                this.editFieldForm = Object.assign({}, row)
                this.editFieldFormVisible = true
                if (this.$refs.editFieldForm) {
                    this.$refs.editFieldForm.resetFields()
                }
            },
            //编辑
            editFieldSubmit() {
                let that = this
                this.$refs.editFieldForm.validate(valid => {
                    if (valid) {
                        that.$axios.post('exportRuleDetail/update', that.editFieldForm).then(res => {
                            if (res.data.code === 200) {
                                that.$message.success('修改成功')
                                that.editFieldFormVisible = false
                                that.queryRuleDetailByPage()
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            deleteRuleDetailSubmit(row) {
                let that = this
                this.$confirm('亲，确认要删除吗', '提示', {type: 'warning'}).then(() => {
                    that.$axios.post('exportRuleDetail/delete/' + row.id, {}).then(res => {
                        if (res.data.code === 200) {
                            that.$message.success('删除成功')
                            that.pageNo = 1
                            that.queryRuleDetailByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
            },
            typeFormatter(row) {
                let item = this.fieldTypes.find(item => row.type == item.value)
                if (item) {
                    return item.name
                }
                return null
            },
            async queryDictionaryClassify() {
                let res = await this.$axios.get('dictionaryClassify/queryDisplay')
                if (res.data.code === 200) {
                    this.classifyOptions = res.data.data
                }
            },
            async queryBusinessRule() {
                let res = await this.$axios.get('businessRule/queryByCompanyId')
                if (res.data.code == 200) {
                    this.preconditionOptions = res.data.data
                }
            },
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
        cursor: pointer;
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