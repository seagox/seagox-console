<template>
    <div>
        <el-container :style="'height:' + (clientHeight - 110) + 'px'">
            <el-aside width="240px" class="aside" style="padding-left: 15px; padding-top: 15px">
                <div class="add-classify" @click="showAddRuleDialog">
                    <i class="el-icon-circle-plus"></i>
                    <span style="margin-left: 10px">添加规则</span>
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
                                    <el-dropdown-item icon="el-icon-copy-document" command="copy"
                                        >复制</el-dropdown-item
                                    >
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </el-aside>
            <el-main>
                <div class="toolView">
                    <el-button type="text" icon="el-icon-plus" @click="showAddRuleDetailDialog" size="small"
                        >新增</el-button
                    >
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table :data="tableData" border highlight-current-row stripe>
                        <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                        <el-table-column
                            prop="remark"
                            label="字段名称"
                            align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column prop="col" label="对应列" align="center" width="200"></el-table-column>
                        <el-table-column label="操作" align="center" width="200">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="showEditRuleDetailDialog(scope.row)"
                                    >编辑</el-button
                                >
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" size="small" @click="deleteRuleDetailSubmit(scope.row)"
                                    >删除</el-button
                                >
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
        <el-dialog title="新增" width="750px" :visible.sync="addRuleFormVisible" :close-on-click-modal="false">
            <el-form :model="addRuleForm" label-width="90px" :rules="ruleFormRules" ref="addRuleForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="编码" prop="code">
                            <el-input v-model="addRuleForm.code" placeholder="请输入编码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="addRuleForm.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数据模型" prop="dataSource">
                            <el-select v-model="addRuleForm.dataSource" filterable placeholder="请选择数据模型">
                                <el-option
                                    v-for="item in tableOptions"
                                    :key="item.id"
                                    :label="item.remark + ' - ' + item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="起始行" prop="startLine">
                            <el-input-number
                                v-model="addRuleForm.startLine"
                                :controls="false"
                                :precision="0"
                                :min="1"
                                :max="9999"
                            >
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="校验规则" prop="verifyRuleId">
                            <el-select
                                v-model="addRuleForm.verifyRuleId"
                                filterable
                                placeholder="请选择云函数规则"
                                clearable
                            >
                                <el-option
                                    v-for="item in verifyMetaFunctionOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="处理规则" prop="handleRuleId">
                            <el-select
                                v-model="addRuleForm.handleRuleId"
                                filterable
                                placeholder="请选择云函数规则"
                                clearable
                            >
                                <el-option
                                    v-for="item in handleMetaFunctionOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="导入模版" prop="templateSource">
                            <el-upload
                                :limit="1"
                                :action="action"
                                :headers="headers"
                                :file-list="addRuleForm.templateSource"
                                list-type="picture-card"
                                :before-upload="beforeUpload"
                                :class="addRuleForm.templateSource.length === 1 ? 'upload-disabled' : ''"
                                :on-success="handleFileSuccess"
                            >
                                <i class="el-icon-plus"></i>
                                <div slot="file" slot-scope="{ file }">
                                    <img class="el-upload-list__item-thumbnail" src="@/assets/fileType/excel.svg" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-delete" @click="handleFileDownload(file)">
                                            <i class="el-icon-download"></i>
                                        </span>
                                        <span class="el-upload-list__item-delete" @click="handleFileRemove(file)">
                                            <i class="el-icon-delete"></i>
                                        </span>
                                    </span>
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRuleFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addRuleSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="750px" :visible.sync="editRuleFormVisible" :close-on-click-modal="false">
            <el-form :model="editRuleForm" label-width="90px" :rules="ruleFormRules" ref="editRuleForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="编码" prop="code">
                            <el-input v-model="editRuleForm.code" placeholder="请输入规则编码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="editRuleForm.name" placeholder="请输入规则名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数据模型" prop="dataSource">
                            <el-select v-model="editRuleForm.dataSource" filterable placeholder="请选择数据模型">
                                <el-option
                                    v-for="item in tableOptions"
                                    :key="item.id"
                                    :label="item.remark + ' - ' + item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="起始行" prop="startLine">
                            <el-input-number
                                v-model="editRuleForm.startLine"
                                :controls="false"
                                :precision="0"
                                :min="1"
                                :max="9999"
                            >
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="校验规则" prop="verifyRuleId">
                            <el-select
                                v-model="editRuleForm.verifyRuleId"
                                filterable
                                placeholder="请选择云函数规则"
                                clearable
                            >
                                <el-option
                                    v-for="item in verifyMetaFunctionOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="处理规则" prop="handleRuleId">
                            <el-select
                                v-model="editRuleForm.handleRuleId"
                                filterable
                                placeholder="请选择云函数规则"
                                clearable
                            >
                                <el-option
                                    v-for="item in handleMetaFunctionOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="导出模版" prop="templateSource">
                            <el-upload
                                :limit="1"
                                :action="action"
                                :headers="headers"
                                :file-list="editRuleForm.templateSource"
                                list-type="picture-card"
                                :before-upload="beforeUpload"
                                :class="editRuleForm.templateSource.length === 1 ? 'upload-disabled' : ''"
                                :on-success="handleFileSuccess"
                            >
                                <i class="el-icon-plus"></i>
                                <div slot="file" slot-scope="{ file }">
                                    <img class="el-upload-list__item-thumbnail" src="@/assets/fileType/excel.svg" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-delete" @click="handleFileDownload(file)">
                                            <i class="el-icon-download"></i>
                                        </span>
                                        <span class="el-upload-list__item-delete" @click="handleFileRemove(file)">
                                            <i class="el-icon-delete"></i>
                                        </span>
                                    </span>
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editRuleFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editRuleSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增" width="750px" :visible.sync="addFieldFormVisible" :close-on-click-modal="false">
            <el-form :model="addFieldForm" label-width="75px" :rules="ruleDetailFormRules" ref="addFieldForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="字段" prop="field">
                            <el-select v-model="addFieldForm.field" filterable placeholder="请选择字段">
                                <el-option
                                    v-for="item in fieldOptions"
                                    :key="item.id"
                                    :label="item.remark"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="对应列" prop="col">
                            <el-select v-model="addFieldForm.col" filterable placeholder="请选择对应列">
                                <el-option v-for="item in letterOptions" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <div class="toolView">
                            <el-button type="text" icon="el-icon-plus" @click="showAnnotationDialog" size="small"
                                >新增</el-button
                            >
                        </div>
                        <div class="table">
                            <!--列表-->
                            <el-table :data="addFieldForm.rule" border highlight-current-row stripe>
                                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                                <el-table-column label="规则" align="center">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.rule" placeholder="请输入规则注解"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="100">
                                    <template slot-scope="scope">
                                        <el-button
                                            type="text"
                                            size="small"
                                            @click="deleteAnnotationSubmit(scope.$index)"
                                            >删除</el-button
                                        >
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFieldFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addFieldSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="750px" :visible.sync="editFieldFormVisible" :close-on-click-modal="false">
            <el-form :model="editFieldForm" label-width="75px" :rules="ruleDetailFormRules" ref="editFieldForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="字段" prop="field">
                            <el-select v-model="editFieldForm.field" filterable placeholder="请选择字段">
                                <el-option
                                    v-for="item in fieldOptions"
                                    :key="item.id"
                                    :label="item.remark"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="对应列" prop="col">
                            <el-select v-model="editFieldForm.col" filterable placeholder="请选择对应列">
                                <el-option v-for="item in letterOptions" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <div class="toolView">
                            <el-button type="text" icon="el-icon-plus" @click="showAnnotationDialog" size="small"
                                >新增</el-button
                            >
                        </div>
                        <div class="table">
                            <!--列表-->
                            <el-table :data="editFieldForm.rule" border highlight-current-row stripe>
                                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                                <el-table-column label="规则" align="center">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.rule" placeholder="请输入规则注解"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="100">
                                    <template slot-scope="scope">
                                        <el-button
                                            type="text"
                                            size="small"
                                            @click="deleteAnnotationSubmit(scope.$index)"
                                            >删除</el-button
                                        >
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFieldFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editFieldSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--选择规则界面-->
        <el-dialog title="新增" width="500px" :visible.sync="ruleTypeVisible" :close-on-click-modal="false">
            <el-form :model="ruleTypeForm" label-width="75px" :rules="ruleDetailFormRules" ref="ruleTypeForm">
                <el-form-item label="规则" prop="ruleTypeId">
                    <el-select v-model="ruleTypeForm.ruleTypeId" filterable placeholder="请选择规则">
                        <el-option v-for="item in ruleTypes" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ruleTypeSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleTypeForm: {
                ruleTypeId: ''
            },
            ruleTypeVisible: false,
            ruleTypes: [
                { name: '不为空', value: '@NotNull(message = "必须不为null")' },
                { name: '长度', value: '@Length(max = 11,min = 7,message = "长度必须大于等于7或小于等于11")' },
                { name: '最小值', value: '@Min(0)' },
                { name: '最大值', value: '@Max(0)' },
                { name: '小数最小值', value: '@DecimalMin(0.0)' },
                { name: '小数最大值', value: '@DecimalMax(0.0)' },
                { name: '指定范围', value: '@Range(max = 80,min = 18,message = "必须大于等于18或小于等于80")' },
                { name: '正则表达式', value: '@Pattern(regexp = "d{11}",message = "必须为数字，并且长度为11")' },
                { name: '替换', value: '@Replace("字典")' },
                { name: '日期', value: '@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")' },
                { name: '小数', value: '@Decimal' }
            ],
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            treeData: [],
            tableOptions: [],
            fieldOptions: [],
            letterOptions: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
                'AA',
                'AB',
                'AC',
                'AD',
                'AE',
                'AF',
                'AG',
                'AH',
                'AI',
                'AJ',
                'AK',
                'AL',
                'AM',
                'AN',
                'AO',
                'AP',
                'AQ',
                'AR',
                'AS',
                'AT',
                'AU',
                'AV',
                'AW',
                'AX',
                'AY',
                'AZ',
                'BA',
                'BB',
                'BC',
                'BD',
                'BE',
                'BF',
                'BG',
                'BH',
                'BI',
                'BJ',
                'BK',
                'BL',
                'BM',
                'BN',
                'BO',
                'BP',
                'BQ',
                'BR',
                'BS',
                'BT',
                'BU',
                'BV',
                'BW',
                'BX',
                'BY',
                'BZ',
                'CA',
                'CB',
                'CC',
                'CD',
                'CE',
                'CF',
                'CG',
                'CH',
                'CI',
                'CJ',
                'CK',
                'CL',
                'CM',
                'CN',
                'CO',
                'CP',
                'CQ',
                'CR',
                'CS',
                'CT',
                'CU',
                'CV',
                'CW',
                'CX',
                'CY',
                'CZ',
                'DA',
                'DB',
                'DC',
                'DD',
                'DE',
                'DF',
                'DG',
                'DH',
                'DI',
                'DJ',
                'DK',
                'DL',
                'DM',
                'DN',
                'DO',
                'DP',
                'DQ',
                'DR',
                'DS',
                'DT',
                'DU',
                'DV',
                'DW',
                'DX',
                'DY',
                'DZ'
            ],
            addRuleFormVisible: false,
            addRuleForm: {
                code: '',
                name: '',
                dataSource: '',
                startLine: 2,
                handleRuleId: '',
                templateSource: [],
                verifyRuleId: ''
            },
            editRuleFormVisible: false,
            editRuleForm: {
                id: '',
                code: '',
                name: '',
                dataSource: '',
                startLine: 2,
                handleRuleId: '',
                templateSource: [],
                verifyRuleId: ''
            },
            ruleFormRules: {
                code: [
                    { required: true, message: '请输入规则编码', trigger: 'blur' },
                    { max: 30, message: '请输入30个以内字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入规则名称', trigger: 'blur' },
                    { max: 50, message: '请输入50个以内字符', trigger: 'blur' }
                ],
                dataSource: [{ required: true, message: '请选择数据模型', trigger: 'change' }],
                startLine: [{ required: true, message: '请输入起始行', trigger: 'blur' }],
                templateSource: [{ required: true, message: '请选择导入模板', trigger: 'change' }]
            },
            ruleId: '',
            dataSourceId: '',
            tableData: [],
            pageNo: 1,
            total: 0,
            addFieldFormVisible: false,
            addFieldForm: {
                ruleId: '',
                field: '',
                col: '',
                rule: []
            },
            editFieldFormVisible: false,
            editFieldForm: {
                id: '',
                ruleId: '',
                field: '',
                col: '',
                rule: []
            },
            ruleDetailFormRules: {
                field: [{ required: true, message: '请选择字段', trigger: 'change' }],
                col: [{ required: true, message: '请选择对应列', trigger: 'change' }],
                ruleTypeId: [{ required: true, message: '请选择对应规则', trigger: 'change' }]
            },
            verifyMetaFunctionOptions: [],
            handleMetaFunctionOptions: []
        }
    },
    created() {
        this.queryRules()
        this.queryBusinessTable()
        this.queryMetaFunction()
    },
    methods: {
        async queryRules() {
            let res = await this.$axios.get('importRule/queryAll')
            if (res.data.code === 200) {
                this.treeData = res.data.data
            }
        },
        async queryBusinessTable() {
            let res = await this.$axios.get('businessTable/queryAll')
            if (res.data.code === 200) {
                this.tableOptions = res.data.data
            }
        },
        async queryMetaFunction() {
            let verifyParams = { type: 3 }
            let verifyRes = await this.$axios.get('metaFunction/queryByCompanyId', { verifyParams })
            if (verifyRes.data.code === 200) {
                this.verifyMetaFunctionOptions = verifyRes.data.data
            }
            let handleParams = { type: 4 }
            let handleRes = await this.$axios.get('metaFunction/queryByCompanyId', { handleParams })
            if (handleRes.data.code === 200) {
                this.handleMetaFunctionOptions = handleRes.data.data
            }
        },
        async queryFieldByTableId(tableId) {
            let res = await this.$axios.get('businessField/queryByTableId/' + tableId)
            if (res.data.code === 200) {
                this.fieldOptions = res.data.data
            }
        },
        showAddRuleDialog() {
            this.addRuleFormVisible = true
            if (this.$refs.addRuleForm) {
                this.$refs.addRuleForm.resetFields()
            }
        },
        addRuleSubmit() {
            var params = {
                code: this.addRuleForm.code,
                name: this.addRuleForm.name,
                dataSource: this.addRuleForm.dataSource,
                startLine: this.addRuleForm.startLine,
                handleRuleId: this.addRuleForm.handleRuleId,
                verifyRuleId: this.addRuleForm.verifyRuleId,
                templateSource: JSON.stringify(this.addRuleForm.templateSource)
            }
            this.$refs.addRuleForm.validate(valid => {
                if (valid) {
                    this.$axios.post('importRule/insert', params).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success('新增成功')
                            this.addRuleFormVisible = false
                            this.queryRules()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
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
            const params = {
                pageNo: this.pageNo,
                ruleId: this.ruleId
            }
            this.$axios.get('importRuleDetail/queryByPage', { params }).then(res => {
                if (res.data.code === 200) {
                    this.tableData = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        handleCommand(command, row) {
            if (command === 'edit') {
                if (this.$refs.editRuleForm) {
                    this.$refs.editRuleForm.resetFields()
                }
                this.editRuleForm = Object.assign({}, row)
                this.editRuleForm.templateSource = JSON.parse(this.editRuleForm.templateSource)
                this.editRuleFormVisible = true
            } else if (command === 'delete') {
                this.deleteRuleSubmit(row)
            } else if (command === 'copy') {
                this.$axios.post('importRule/copy/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('复制成功')
                        this.queryRules()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            }
        },
        editRuleSubmit() {
            var params = {
                id: this.editRuleForm.id,
                code: this.editRuleForm.code,
                name: this.editRuleForm.name,
                dataSource: this.editRuleForm.dataSource,
                startLine: this.editRuleForm.startLine,
                handleRuleId: this.editRuleForm.handleRuleId,
                verifyRuleId: this.editRuleForm.verifyRuleId,
                templateSource: JSON.stringify(this.editRuleForm.templateSource)
            }
            this.$refs.editRuleForm.validate(valid => {
                if (valid) {
                    this.$axios.post('importRule/update', params).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success('修改成功')
                            this.editRuleFormVisible = false
                            this.queryRules()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        deleteRuleSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('importRule/delete/' + row.id, {}).then(res => {
                    if (res.data.code === 200) {
                        this.$message.success('删除成功')
                        this.queryRules()
                    } else {
                        this.$message.error(res.data.message)
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
                    this.queryFieldByTableId(this.dataSourceId)
                }
                this.addFieldFormVisible = true
                if (this.$refs.addFieldForm) {
                    this.$refs.addFieldForm.resetFields()
                }
                this.addFieldForm.ruleId = this.ruleId
            } else {
                this.$message.error('请选择规则')
            }
        },
        //新增
        addFieldSubmit() {
            var params = {
                ruleId: this.addFieldForm.ruleId,
                field: this.addFieldForm.field,
                col: this.addFieldForm.col,
                rule: JSON.stringify(this.addFieldForm.rule)
            }
            this.$refs.addFieldForm.validate(valid => {
                if (valid) {
                    this.$axios.post('importRuleDetail/insert', params).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success('新增成功')
                            this.addFieldFormVisible = false
                            this.queryRuleDetailByPage()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //显示编辑界面
        showEditRuleDetailDialog(row) {
            if (this.dataSourceId) {
                this.queryFieldByTableId(this.dataSourceId)
            }
            this.editFieldForm = Object.assign({}, row)
            this.editFieldForm.rule = JSON.parse(this.editFieldForm.rule)
            this.editFieldFormVisible = true
            if (this.$refs.editFieldForm) {
                this.$refs.editFieldForm.resetFields()
            }
            this.editFieldForm.ruleId = this.ruleId
        },
        //编辑
        editFieldSubmit() {
            var params = {
                id: this.editFieldForm.id,
                ruleId: this.editFieldForm.ruleId,
                field: this.editFieldForm.field,
                col: this.editFieldForm.col,
                rule: JSON.stringify(this.editFieldForm.rule)
            }
            this.$refs.editFieldForm.validate(valid => {
                if (valid) {
                    this.$axios.post('importRuleDetail/update', params).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success('修改成功')
                            this.editFieldFormVisible = false
                            this.queryRuleDetailByPage()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        deleteRuleDetailSubmit(row) {
            this.$confirm('亲，确认要删除吗', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('importRuleDetail/delete/' + row.id, {}).then(res => {
                    if (res.data.code === 200) {
                        this.$message.success('删除成功')
                        this.pageNo = 1
                        this.queryRuleDetailByPage()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        beforeUpload(file) {
            let pattern = /.(xls|xlsx)$/g
            if (!pattern.test(file.name)) {
                this.$message.error('只能上传xls、xlsx文件')
                return false
            }
            const fileSize = file.size / 1024 / 1024 < 10
            if (!fileSize) {
                this.$message.error('上传文件大小不能超过 10MB')
                return false
            }
            return true
        },
        handleFileSuccess(res, file) {
            if (res.code === 200) {
                if (this.addRuleFormVisible) {
                    let fileArray = this.addRuleForm.templateSource
                    fileArray.push({
                        type: 'excel',
                        name: file.name,
                        size: file.size,
                        url: res.data
                    })
                    this.addRuleForm.templateSource = fileArray
                } else {
                    let fileArray = this.editRuleForm.templateSource
                    fileArray.push({
                        type: 'excel',
                        name: file.name,
                        size: file.size,
                        url: res.data
                    })
                    this.editRuleForm.templateSource = fileArray
                }
            } else {
                this.$message.error(res.message)
            }
        },
        handleFileDownload(file) {
            let params = {
                url: file.url,
                fileName: file.name
            }
            this.$axios.post('upload/download', params, { responseType: 'blob' }).then(res => {
                let content = res.data
                let blob = new Blob([content])
                if ('download' in document.createElement('a')) {
                    // 非IE下载
                    let elink = document.createElement('a')
                    elink.download = file.name
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, file.name)
                }
            })
        },
        handleFileRemove() {
            if (this.addRuleFormVisible) {
                this.addRuleForm.templateSource = []
            } else {
                this.editRuleForm.templateSource = []
            }
        },
        showAnnotationDialog() {
            this.ruleTypeVisible = true
        },
        deleteAnnotationSubmit(index) {
            if (this.addFieldFormVisible) {
                this.addFieldForm.rule.splice(index, 1)
            } else {
                this.editFieldForm.rule.splice(index, 1)
            }
        },
        ruleTypeSubmit() {
            this.ruleTypeVisible = false
            if (this.addFieldFormVisible) {
                this.addFieldForm.rule.push({
                    rule: this.ruleTypeForm.ruleTypeId
                })
            } else {
                this.editFieldForm.rule.push({
                    rule: this.ruleTypeForm.ruleTypeId
                })
            }
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
::v-deep .upload-disabled .el-upload--picture-card {
    display: none;
}
</style>
