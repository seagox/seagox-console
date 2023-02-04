<template>
    <div>
        <el-dialog 
            title="编辑表格选项" 
            width="900px"
            append-to-body
            :visible.sync="formVisible" 
            :close-on-click-modal="false"
            @close="handleClose"
            >
            <div class="toolView">
                <el-button icon="el-icon-plus" size="small" @click="showAddDialog">新增</el-button>
            </div>
            <el-table 
                :data="tableData"
                border 
                highlight-current-row 
                stripe>
                <el-table-column prop="type" label="类型" align="center" :formatter="typeFormatter"></el-table-column>
                <el-table-column prop="name" label="显示名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="field" label="绑定字段" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.type === 'calculation' ? scope.row.calculation : scope.row.field}}
                    </template>
                </el-table-column>
                <el-table-column prop="required" label="必填" align="center" :formatter="requiredFormatter"></el-table-column>
                <el-table-column prop="summary" label="合计" align="center" :formatter="summaryFormatter"></el-table-column>
                <el-table-column label="操作" align="center" width="185">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showEditDialog(scope.$index, scope.row)" size="small">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" @click="delSubmit(scope.$index)" size="small">删除</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" @click="moveUp(scope.$index)" size="small">上移</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" @click="moveDown(scope.$index)" size="small">下移</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="新增" width='750px' append-to-body :visible.sync ="addVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型" prop="type">
                            <el-select v-model="addForm.type" placeholder="请选择类型" @change="handleTypeChange">
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示名称" prop="name">
                            <el-input v-model="addForm.name" placeholder="请输入显示名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="绑定字段" prop="field">
                            <el-select v-model="addForm.field" placeholder="请选择绑定字段">
                                <el-option
                                    v-for="item in fieldOptions"
                                    :key="item.name"
                                    :label="item.comment"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addForm.type != 'calculation'">
                        <el-form-item label="是否必填">
                            <el-switch v-model="addForm.required"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addForm.type === 'number' || addForm.type === 'calculation'">
                        <el-form-item label="是否合计">
                            <el-switch v-model="addForm.summary"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addForm.type === 'radio' || addForm.type === 'checkbox' || addForm.type === 'select'">
                        <el-form-item label="数据来源" prop="source">
                            <el-select v-model="addForm.source" placeholder="请选择数据来源">
                                <el-option
                                    v-for="item in classifyOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addForm.type === 'business'">
                        <el-form-item label="业务类型" prop="businessType">
                            <el-select v-model="addForm.businessType" placeholder="请选择业务类型" @change="handleBusinessTypeChange">
                                <el-option
                                    v-for="item in businessTypeOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addForm.type === 'business'">
                        <el-form-item label="显示字段" prop="showField">
                            <el-select v-model="addForm.showField" placeholder="请选择显示字段">
                                <el-option
                                    v-for="(item,index) in showFieldOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.prop">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addForm.type === 'calculation'">
                        <el-form-item label="计算公式" prop="calculation">
                            <el-input type="textarea" :rows="3" v-model="addForm.calculation" placeholder="请输入计算公式"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑" width='750px' append-to-body :visible.sync ="editVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型" prop="type">
                            <el-select v-model="editForm.type" placeholder="请选择类型" @change="handleTypeChange">
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示名称" prop="name">
                            <el-input v-model="editForm.name" placeholder="请输入显示名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="绑定字段" prop="field">
                            <el-select v-model="editForm.field" placeholder="请选择绑定字段">
                                <el-option
                                    v-for="item in fieldOptions"
                                    :key="item.name"
                                    :label="item.comment"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="editForm.type != 'calculation'">
                        <el-form-item label="是否必填">
                            <el-switch v-model="editForm.required"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="editForm.type === 'number' || editForm.type === 'calculation'">
                        <el-form-item label="是否合计">
                            <el-switch v-model="editForm.summary"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="editForm.type === 'radio' || editForm.type === 'checkbox' || editForm.type === 'select'">
                        <el-form-item label="数据来源" prop="source">
                            <el-select v-model="editForm.source" placeholder="请选择数据来源">
                                <el-option
                                    v-for="item in classifyOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="editForm.type === 'business'">
                        <el-form-item label="业务类型" prop="businessType">
                            <el-select v-model="editForm.businessType" placeholder="请选择业务类型" @change="handleBusinessTypeChange">
                                <el-option
                                    v-for="item in businessTypeOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="editForm.type === 'business'">
                        <el-form-item label="显示字段" prop="showField">
                            <el-select v-model="editForm.showField" placeholder="请选择显示字段">
                                <el-option
                                    v-for="(item,index) in showFieldOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.prop">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="editForm.type === 'calculation'">
                        <el-form-item label="计算公式" prop="calculation">
                            <el-input type="textarea" :rows="3" v-model="editForm.calculation" placeholder="请输入计算公式"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: ['form', 'fieldOptions'],
    watch: {
        form: {
            handler(newVal){
                if (newVal.type === "table") {
                    this.tableData = newVal.tableData || []
                }
            },
            immediate: true, // 首次加载的时候执行函数
            deep: true // 深入观察,监听数组值，对象属性值的变化
        }
    },
    data() {
        return {
            formVisible: false,
            tableData: [],
            typeOptions: [{
                label: '输入框',
                value: 'input'
            },{
                label: '数字',
                value: 'number'
            },{
                label: '下拉选择',
                value: 'select'
            },{
                label: '开关组件',
                value: 'switch'
            },{
                label: '时间选择',
                value: 'timePicker'
            },{
                label: '日期选择',
                value: 'datePicker'
            },{
                label: '计算公式',
                value: 'calculation'
            },{
                label: '部门组件',
                value: 'department'
            },{
                label: '成员组件',
                value: 'member'
            },{
                label: '业务应用',
                value: 'business'
            }],
            rules: {
                type: [
                    {required: true, message: '请选择类型', trigger: 'change'}
                ],
                name: [
                    {required: true, message: '请输入显示名称', trigger: 'blur'}
                ],
                field: [
                    {required: true, message: '请选择绑定字段', trigger: 'change'}
                ],
                source: [
                    { required: true, message: '请选择数据来源', trigger: 'change' }
                ],
                calculation: [
                    { required: true, message: '请输入计算公式', trigger: 'blur' }
                ],
                showField: [
                    { required: true, message: '请选择显示字段', trigger: 'change' }
                ]
            },
            addVisible: false,
            addForm: {
                type: 'input',
                name: '',
                field: '',
                required: false,
                summary: false,
                source: '',
                calculation: '',
                businessType: '',
                showField: ''
            },
            editVisible: false,
            editForm: {
                type: '',
                name: '',
                field: '',
                required: false,
                summary: false,
                source: '',
                calculation: '',
                businessType: '',
                showField: ''
            },
            currentIndex: -1,
            classifyOptions: [],
            businessTypeOptions: [],
            showFieldOptions: []
        }
    },
    created() {
        this.queryDictionaryClassify()
        this.queryBusinessType()
    },
    methods: {
        async queryDictionaryClassify() {
            let res = await this.$axios.get('dictionaryClassify/queryDisplay')
            if(res.data.code === 200){
                this.classifyOptions = res.data.data
            }
        },
        async queryBusinessType() {
            let res = await this.$axios.get('jellyForm/queryByCompanyId')
            if(res.data.code === 200){
                this.businessTypeOptions = res.data.data
            }
        },
        async handleBusinessTypeChange(value) {
            let res = await this.$axios.get('jellyForm/queryById/' + value)
            if(res.data.code === 200){
                this.showFieldOptions = JSON.parse(res.data.data.tableHeaderJson)
            }
        },

        handleTypeChange(value) {
            if (value === 'calculation') {
                this.$set(this.rules,"field",[])
            } else {
                this.$set(this.rules,"field",[{required: true, message: '请选择绑定字段', trigger: 'change'}])
            }
        },

        showDialog() {
            this.formVisible = true
        },
        typeFormatter(item) {
            if(item.type === 'input') {
                return '输入框'
            } else if(item.type === 'number') {
                return '数字'
            } else if(item.type === 'select') {
                return '下拉选择'
            } else if(item.type === 'switch') {
                return '开关组件'
            } else if(item.type === 'timePicker') {
                return '时间选择'
            } else if(item.type === 'datePicker') {
                return '日期选择'
            } else if(item.type === 'calculation') {
                return '计算公式'
            } else if(item.type === 'department') {
                return '部门组件'
            } else if(item.type === 'member') {
                return '成员组件'
            } else if(item.type === 'business') {
                return '业务应用'
            }
        },
        requiredFormatter(item) {
            if(item.required) {
                return '是'
            } else {
                return '否'
            }
        },
        summaryFormatter(item) {
            if(item.summary) {
                return '是'
            } else {
                return '否'
            }
        },
        fieldFormatter(item) {
            return item.field.toString()
        },
        showAddDialog() {
            this.addVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
        },
        addSubmit() {
            let that = this
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    that.addVisible = false
                    if(that.addForm.type === 'calculation' && that.addForm.field == '') {
                        that.addForm.field = that.addForm.calculation
                    }
                    that.tableData = that.tableData.concat(JSON.parse(JSON.stringify(that.addForm)))
                }
            })
        },
        showEditDialog(index, row) {
            this.editVisible = true
            if (this.$refs.editForm) {
                this.$refs.editForm.resetFields()
            }
            this.editForm = Object.assign({}, row)
            this.currentIndex = index
            if (this.editForm.type === 'radio' 
                || this.editForm.type === 'checkbox' 
                || this.editForm.type === 'select') {
                this.queryDictionaryClassify()
            } else if (this.editForm.type === 'business') {
                this.handleBusinessTypeChange(this.editForm.businessType)
            } else if (this.editForm.type === 'calculation') {
                this.$set(this.rules,"field",[])
            }
        },
        editSubmit() {
            let that = this
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    that.editVisible = false
                    if(that.editForm.type === 'calculation' && that.editForm.field === '') {
                        that.editForm.field = that.editForm.calculation
                    }
                    that.tableData.splice(that.currentIndex,1,JSON.parse(JSON.stringify(that.editForm)))
                }
            })
        },
        delSubmit(index){
            this.tableData.splice(index,1)
        },
        moveUp(index) {
            if (index === 0) {
                return
            }
            this.tableData.splice(index - 1, 0, this.tableData[index])
            this.tableData.splice(index + 1, 1)
        },
        moveDown(index) {
            if (index === (this.tableData.length-1)) {
                return
            }
            this.tableData.splice(index + 2, 0, this.tableData[index])
            this.tableData.splice(index, 1)
        },
        handleClose() {
            if (this.tableData.length === 0) {
                this.$message.error('至少一条数据')
                this.formVisible = true
                return
            }
            this.$emit("submitForm", this.tableData)
        }
    }
}
</script>
