<template>
    <div class="container" v-loading="loading">
        <div :style="{ width: approvalVisible ? 'calc(100% - 324px)' : '100%' }">
            <!--简化版-->
            <div v-if="formDesignType === 1">
                <simplify-form
                        ref="simplifyForm"
                        :action="action"
                        :formModel="form"
                        :formCofig="formCofig"
                        :property="property"
                        :calculate="calculate"
                        :disabled="disabled"
                        :editable="editable"
                        :hidden="hidden"
                        :textModel="textModel"
                />
            </div>
            <!--高级版-->
            <div v-if="formDesignType === 2">
                <senior-form
                        ref="seniorForm"
                        :action="action"
                        :formModel="form"
                        :formCofig="formCofig"
                        :property="property"
                        :calculate="calculate"
                        :multiple="multiple"
                        :disabled="disabled"
                        :editable="editable"
                        :hidden="hidden"
                />
            </div>

            <el-card style="margin-bottom:20px;" v-if="flowFlag === 1">
                <div slot="header">处理人意见区</div>
                <el-table :data="historyJson" :show-header="false" style="width:100%" max-height="300">
                    <el-table-column prop="assigneeName"></el-table-column>
                    <el-table-column prop="status" :formatter="statusFormatter"></el-table-column>
                    <el-table-column prop="comment" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="endTime"></el-table-column>
                </el-table>
            </el-card>
        </div>
        <div class="footer">
            <div class="footer-right">
                <el-dropdown
                        @command="handleRelateSearch($event)"
                        v-if="relateSearchData"
                        trigger="click"
                        style="margin-left:10px; margin-right: 10px"
                >
                    <el-button type="primary"> <i class="el-icon-document"></i> 联查 </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <template v-for="(item, index) in relateSearchData">
                            <el-dropdown-item :command="item" :key="index">{{ item.title }}</el-dropdown-item>
                        </template>
                    </el-dropdown-menu>
                </el-dropdown>

                <!--提交-->
                <el-button
                        type="primary"
                        icon="el-icon-connection"
                        @click="handleProcess"
                        v-if="flowFlag === 1 && !temporaryStorage"
                        :disabled="disableButtonFlag.seaView"
                >流程查看</el-button
                >
                <el-button
                        type="primary"
                        icon="el-icon-printer"
                        @click="handlePrint"
                        v-if="form.form && form.form.detailExportPath"
                        :disabled="disableButtonFlag.print"
                >打印</el-button
                >
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        @click="handleDelete"
                        v-if="(flowFlag === 1 && flowStatus === 1) || (flowFlag === 1 && temporaryStorage)"
                        :disabled="disableButtonFlag.delete"
                >删除</el-button
                >
                <el-button
                        type="primary"
                        icon="el-icon-refresh-left"
                        @click="showRevoke"
                        v-if="flowFlag === 1 && (flowStatus === 2 || flowStatus === 4)"
                        :disabled="disableButtonFlag.recall"
                >撤回</el-button
                >
                <el-button
                        type="primary"
                        icon="el-icon-document-checked"
                        @click="handleApproval"
                        v-if="flowFlag === 1 && (flowStatus === 3 || flowStatus === 4)"
                        :disabled="disableButtonFlag.audit"
                >审批</el-button
                >
                <el-button
                        type="primary"
                        icon="el-icon-document-checked"
                        @click="handleAbandon"
                        v-if="flowFlag === 1 && abandonFlag"
                        :disabled="disableButtonFlag.abandon"
                >弃审</el-button
                >
                <!--保存-->
                <el-button
                        type="primary"
                        icon="el-icon-document"
                        @click="submitForm(3)"
                        v-if="flowFlag === 1 && temporaryStorage"
                        :disabled="disableButtonFlag.temp"
                >暂存</el-button
                >
                <el-button
                        type="primary"
                        icon="el-icon-document-checked"
                        @click="submitForm(2)"
                        v-if="flowFlag === 1 && temporaryStorage"
                        :disabled="disableButtonFlag.submit"
                >提交</el-button
                >
                <el-button
                        v-if="auditFlag"
                        type="primary"
                        icon="el-icon-circle-check"
                        @click="audit"
                        :disabled="disableButtonFlag.submit"
                >通过</el-button>
                <el-button
                        v-if="auditFlag"
                        type="primary"
                        icon="el-icon-circle-close"
                        @click="back"
                        :disabled="disableButtonFlag.submit"
                >退回</el-button>
            </div>
        </div>
        <!--流程审批-->
        <div class="approval" v-if="approvalVisible">
            <el-form :model="handleForm" label-width="0px">
                <el-form-item>
                    <el-radio-group v-model="handleForm.status">
                        <el-radio :label="1">同意</el-radio>
                        <el-radio :label="2">不同意</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-dropdown trigger="click" @command="handleCommand">
						<span class="el-dropdown-link">
							审批意见
						</span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="item" v-for="(item, index) in commonWords" :key="index">{{
                                index + 1 + '、' + item
                                }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <i class="el-icon-setting" style="margin-left:10px" @click="showCommonWordsDialog"></i>
                    <el-input type="textarea" :rows="10" placeholder="请输入处理意见" v-model="handleForm.comment">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-radio-group v-model="handleForm.rejectType" v-if="handleForm.status === 2">
                        <el-radio :label="2" :disabled="disableButtonFlag.backFront">退回到上个节点</el-radio>
                        <el-radio :label="1" :disabled="disableButtonFlag.backStart">退回到初始节点</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="approvalVisible = false">取消</el-button>
                <el-button
                        type="primary"
                        @click="submitForm(1)"
                        :disabled="handleForm.status === 2 && disableButtonFlag.backFront && disableButtonFlag.backStart"
                >提交</el-button
                >
            </div>
        </div>
        <!--审批自选-->
        <el-dialog title="请选择" width="500px" :visible.sync="approveOptionalVisible" :close-on-click-modal="false">
            <div>
                <el-table
                        :data="approveOptionalList"
                        style="width: 100%"
                        :show-header="false"
                        :max-height="450"
                        @selection-change="handleApproveOptionalChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="name"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="approveOptionalVisible = false">取消</el-button>
                <el-button type="primary" @click="approveOptionalSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--流程自选-->
        <el-dialog title="请选择" width="500px" :visible.sync="flowOptionalVisible" :close-on-click-modal="false">
            <div>
                <el-table
                        :data="flowOptionalList"
                        style="width: 100%"
                        :show-header="true"
                        :max-height="450"
                        @selection-change="handleFlowOptionalChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="全选" prop="label"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="flowOptionalVisible = false">取消</el-button>
                <el-button type="primary" @click="flowOptionalSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--打印-->
        <div id="print" style="display:none;" v-if="form.form && form.form.detailExportPath">
            <print-form :formModel="form" :formCofig="printJson" :property="property" />
        </div>
        <!--撤回-->
        <el-dialog title="撤回" width="500px" :visible.sync="revokeVisible" :close-on-click-modal="false">
            <el-form :model="revokeForm" label-width="60px" :rules="formRules" ref="revokeForm">
                <el-form-item label="理由" prop="reason">
                    <el-input
                            v-model="revokeForm.reason"
                            type="textarea"
                            :rows="5"
                            :maxlength="200"
                            show-word-limit
                            clearable
                            placeholder="请输入理由"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="revokeVisible = false">取消</el-button>
                <el-button type="primary" @click="handleRevoke">提交</el-button>
            </div>
        </el-dialog>
        <!--审批意见列表-->
        <el-dialog title="审批意见" width="500px" :visible.sync="commonWordsVisible" :close-on-click-modal="false">
            <el-row style="margin-bottom:10px">
                <el-button @click="showCommonWordsAddDialog" size="small">新增</el-button>
            </el-row>
            <el-table :data="commonWordsData" style="width: 100%">
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showCommonWordsEditDialog(scope.row)"
                        >编辑</el-button
                        >
                        <el-button type="text" size="small" @click="deleteCommonWordsSubmit(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer"></div>
        </el-dialog>
        <!--新增审批意见-->
        <el-dialog title="新增" width="500px" :visible.sync="addCommonWordsVisible" :close-on-click-modal="false">
            <el-form :model="addCommonWordsForm" label-width="60px" :rules="formRules" ref="addCommonWordsForm">
                <el-form-item label="名称" prop="name">
                    <el-input
                            v-model="addCommonWordsForm.name"
                            type="textarea"
                            :rows="5"
                            :maxlength="50"
                            show-word-limit
                            clearable
                            placeholder="请输入名称"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addCommonWordsVisible = false">取消</el-button>
                <el-button type="primary" @click="addCommonWordsSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑审批意见-->
        <el-dialog title="编辑" width="500px" :visible.sync="editCommonWordsVisible" :close-on-click-modal="false">
            <el-form :model="editCommonWordsForm" label-width="60px" :rules="formRules" ref="editCommonWordsForm">
                <el-form-item label="名称" prop="name">
                    <el-input
                            v-model="editCommonWordsForm.name"
                            type="textarea"
                            :rows="5"
                            :maxlength="50"
                            show-word-limit
                            clearable
                            placeholder="请输入名称"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editCommonWordsVisible = false">取消</el-button>
                <el-button type="primary" @click="editCommonWordsSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--警告-->
        <el-dialog class="warn-dialog" title="警告" width="500px" :visible.sync="warnVisible" :close-on-click-modal="false">
            <div slot="title" class="header-title">
                <span style="font-weight: bold">警告&nbsp;</span>
                <i class="el-icon-warning" style="color: orange"></i>
            </div>
            <el-table
                    :data="warnTableData"
                    :show-header="false"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="content"
                        label="内容">
                    <template slot-scope="scope">
                        <div style="font-size: 14px" v-html="scope.row.content"></div>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="warnVisible = false">取消</el-button>
                <el-button type="primary" @click="handleWarnSubmit">继续</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
                tableData: [],
                form: {},
                calculate: {},
                multiple: {},
                property: {},
                disabled: [],
                editable: [],
                hidden: [],
                handleForm: {
                    status: 1,
                    comment: '',
                    rejectType: 2
                },
                historyJson: [],
                flowFlag: 2,
                abandonFlag: false,
                tableDynamic: {},
                approvalVisible: false,
                flowStatus: 0,
                temporaryStorage: false,
                relateSearchData: [],
                formDesignType: 0,
                formCofig: {},
                approveOptionalVisible: false,
                approveOptionalList: [],
                approveOptionalSelection: [],
                flowOptionalVisible: false,
                flowOptionalList: [],
                flowOptionalSelection: [],
                printJson: {},
                revokeVisible: false,
                revokeForm: { reason: '' },
                formRules: {
                    reason: [{ required: true, message: '请输入理由', trigger: 'blur' }],
                    name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
                },
                commonWords: [
                    '同意',
                    '交相关部门处理',
                    '拟同意',
                    '按单位相关规章制度办理',
                    '保留意见',
                    '同意，按规定办理',
                    '按流程办理'
                ],
                addCommonWordsVisible: false,
                addCommonWordsForm: { name: '' },
                editCommonWordsVisible: false,
                editCommonWordsForm: { name: '' },
                commonWordsVisible: false,
                commonWordsData: [],
                textModel: { flag: false, type: 'text' },
                loading: false,
                disableButtonFlag: {
                    temp: false,
                    submit: false,
                    audit: false,
                    seaView: false,
                    abandon: false,
                    backFront: false,
                    backStart: false,
                    delete: false
                },
                warnVisible: false,
                warnTableData: [],
                warnParams: null,
                historyData: [{
                    leaser: '二五仔',
                    startDate: '2022-10-18',
                    endDate: '2022-10-20',
                    status: '出租中'
                },{
                    leaser: '打工人',
                    startDate: '2022-10-18',
                    endDate: '2022-10-20',
                    status: '出租中11'
                }],

                auditFlag: false
            }
        },
        created() {
            this.reportDetail()
            this.queryCommonWordsAll()
        },
        methods: {
            async reportDetail() {
                this.loading = true
                var params = {
                    id: this.$history.currentRoute.query.id,
                    formId: this.$history.currentRoute.query.formId
                }
                let res = await this.$axios.get('jellyForm/queryDetail', { params })
                this.loading = false
                if (res.data.code == 200) {
                    this.relateSearchData = JSON.parse(res.data.data.form.relateSearchJson)
                    this.temporaryStorage = res.data.data.temporaryStorage || false
                    this.historyJson = JSON.parse(res.data.data.form.historyJson)
                    if (res.data.data.form.hasOwnProperty('flowId') && res.data.data.form.flowId != null) {
                        this.flowFlag = 1
                    }
                    this.disableButtonFlag = res.data.data.form.disableButtonFlag
                    this.form = res.data.data
                    if (res.data.data["assets_contract_info.status"] == 0) {
                        this.auditFlag = true
                    } else {
                        this.auditFlag = false
                    }
                    this.flowStatus = res.data.data.flowStatus
                    this.abandonFlag = res.data.data.abandonFlag
                    this.disabled = []
                    this.editable = []
                    this.hidden = []
                    if (this.flowFlag != 1 || (this.flowStatus != 1 && !this.temporaryStorage)) {
                        Object.keys(this.form).forEach((field, index) => {
                            this.disabled.push(field)
                        })
                        if (res.data.data.authority) {
                            let authorityArray = JSON.parse(res.data.data.authority)
                            for (let j = 0; j < authorityArray.length; j++) {
                                let item = authorityArray[j]
                                if (item.authority === 1) {
                                    if (item.field) {
                                        this.editable.push(item.tableName + '.' + item.field)
                                    } else {
                                        this.editable.push(item.tableName)
                                    }
                                } else if (item.authority === 3) {
                                    if (item.field) {
                                        this.hidden.push(item.tableName + '.' + item.field)
                                    } else {
                                        this.hidden.push(item.tableName)
                                    }
                                }
                            }
                        }
                    }

                    this.tableData = []
                    for (let i = 0; i < this.form.form.formDesignList.length; i++) {
                        let formDesign = this.form.form.formDesignList[i]
                        this.formDesignType = formDesign.type
                        this.formCofig = JSON.parse(formDesign.excelJson)
                    }
                    if (this.form.form.printJson) {
                        this.printJson = JSON.parse(this.form.form.printJson)
                    }

                    Object.keys(this.form).forEach((field, index) => {
                        if (this.formDesignType === 1 && field.indexOf('.') > -1) {
                            this.$set(this.form, field.split('.')[0] + '|' + field.split('.')[1], this.form[field])
                            delete this.form[field]
                        }
                        //this.disabled.push(field)
                    })

                    if (this.formDesignType === 1) {
                        for (let j = 0; j < this.formCofig.fieldOptions.length; j++) {
                            if (this.formCofig.fieldOptions[j].type === 'editor') {
                                this.$set(
                                    this.form,
                                    this.formCofig.fieldOptions[j].field,
                                    JSON.parse(this.form[this.formCofig.fieldOptions[j].field])
                                )
                            }
                        }
                    }
                }
            },
            handleApproveOptionalChange(val) {
                let approveOptionalSelection = []
                for (let i = 0; i < val.length; i++) {
                    approveOptionalSelection.push(val[i].id)
                }
                this.approveOptionalSelection = approveOptionalSelection
            },
            handleFlowOptionalChange(val) {
                let flowOptionalSelection = []
                for (let i = 0; i < val.length; i++) {
                    flowOptionalSelection.push(val[i].id)
                }
                this.flowOptionalSelection = flowOptionalSelection
            },
            handleProcess() {
                this.$history.push({
                    path: '/flowDisplay',
                    query: {
                        businessKey: this.$history.currentRoute.query.id,
                        businessType: this.$history.currentRoute.query.formId,
                        title: this.$history.currentRoute.query.title
                    }
                })
            },
            handleCommand(command) {
                this.handleForm.comment = command
            },
            statusFormatter(row) {
                if (row.status == 1) {
                    return '同意'
                } else if (row.status == 2) {
                    return '不同意'
                } else if (row.status == 3) {
                    return '已阅'
                } else if (row.status == 4) {
                    return '撤回'
                } else if (row.status == 5) {
                    return '重新发起'
                } else if (row.status == 6) {
                    return '弃审'
                } else if (row.status == 7) {
                    return '关闭'
                } else if (row.status == 8) {
                    return '激活'
                }
            },
            //撤回界面
            showRevoke() {
                this.revokeVisible = true
                if (this.$refs.revokeForm) {
                    this.$refs.revokeForm.resetFields()
                }
            },
            //撤回
            handleRevoke() {
                let that = this
                var params = {
                    businessType: this.$history.currentRoute.query.formId,
                    businessKey: this.$history.currentRoute.query.id,
                    reason: this.revokeForm.reason
                }
                this.$refs.revokeForm.validate(valid => {
                    if (valid) {
                        that.$axios.post('flow/revoke', params).then(res => {
                            if (res.data.code == 200) {
                                that.revokeVisible = false
                                that.$message.success('撤回成功')
                                that.$store.commit('worktabRemove', that.$history.currentRoute.fullPath)
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            //弃审
            handleAbandon() {
                var params = {
                    businessType: this.$history.currentRoute.query.formId,
                    businessKey: this.$history.currentRoute.query.id
                }
                let that = this
                that.loading = true
                that.$axios.post('flow/abandon', params).then(res => {
                    that.loading = false
                    if (res.data.code == 200) {
                        that.$message.success('弃审成功')
                        that.$store.commit('worktabRemove', that.$history.currentRoute.fullPath)
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            //显示审批框
            handleApproval() {
                if (this.disableButtonFlag.backFront && !this.disableButtonFlag.backStart) {
                    this.handleForm.rejectType = 1
                }
                this.approvalVisible = true
            },
            //打印
            handlePrint() {
                print.printPage('print', 'auto')
            },
            //删除
            handleDelete() {
                let that = this
                var params = {
                    businessType: this.$history.currentRoute.query.formId,
                    businessKey: this.$history.currentRoute.query.id
                }
                that.$axios.post('jellyForm/deleteCustom', params).then(res => {
                    if (res.data.code == 200) {
                        that.$message.success('删除成功')
                        that.$store.commit('worktabRemove', that.$history.currentRoute.fullPath)
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            //联查
            handleRelateSearch(command) {
                let query = {
                    title: command.title,
                    time: Date.now()
                }
                for (let i = 0; i < command.query.length; i++) {
                    let item = command.query[i]
                    let pattern = /\#\{(.*?)\}/g
                    var matches = item.target.match(pattern)
                    if (matches) {
                        for (let i = 0; i < matches.length; i++) {
                            let matche = matches[i]
                            let field = matche.substring(2, matche.length - 1)
                            item.target = item.target.replace(matche, this.form[field])
                        }
                    }
                    query[item.source] = item.target
                }
                let search = {}
                for (let i = 0; i < command.search.length; i++) {
                    let item = command.search[i]
                    let pattern = /\#\{(.*?)\}/g
                    var matches = item.target.match(pattern)
                    if (matches) {
                        for (let i = 0; i < matches.length; i++) {
                            let matche = matches[i]
                            let field = matche.substring(2, matche.length - 1)
                            item.target = item.target.replace(matche, this.form[field])
                        }
                    }
                    search[item.source] = item.target
                }
                query.search = search
                this.$history.push({
                    path: command.path,
                    query: query
                })
            },
            approveOptionalSubmit() {
                if (this.approveOptionalSelection.length === 0) {
                    this.$message.warning('请选择节点执行人')
                } else {
                    this.approveOptionalVisible = false
                    this.submitForm(1)
                }
            },
            flowOptionalSubmit() {
                if (this.flowOptionalSelection.length === 0) {
                    this.$message.warning('请选择流程节点')
                } else {
                    this.flowOptionalVisible = false
                    this.submitForm(1)
                }
            },
            //1:审批、2:提交、3:暂存
            submitForm(type) {
                this.approvalVisible = false
                let that = this
                var params = {
                    businessType: this.$history.currentRoute.query.formId,
                    businessKey: this.$history.currentRoute.query.id
                }
                let temporaryStorage = false
                if (type === 1) {
                    //审批
                    params.status = this.handleForm.status
                    params.comment = this.handleForm.comment
                    params.rejectType = this.handleForm.rejectType
                    params.isAudit = true
                    var result = false
                    if (this.formDesignType == 1) {
                        result = this.$refs.simplifyForm.validate()
                    } else {
                        result = this.$refs.seniorForm.validate()
                    }
                    if (!result) {
                        return
                    }
                } else if (type === 2) {
                    //提交
                    params.status = 1
                    var result = false
                    if (this.formDesignType == 1) {
                        result = this.$refs.simplifyForm.validate()
                    } else {
                        result = this.$refs.seniorForm.validate()
                    }
                    if (!result) {
                        return
                    }
                } else if (type === 3) {
                    //暂存
                    temporaryStorage = true
                    params.status = 1
                    if (this.flowFlag === 1 && this.flowStatus === 1) {
                        params.existProdef = true
                    }
                }

                params = Object.assign(params, this.form)

                Object.keys(params).forEach((key, index) => {
                    let property = this.property[key]
                    if (property) {
                        if (
                            (property.type === 'checkbox' ||
                                property.type === 'select' ||
                                property.type === 'department' ||
                                property.type === 'member' ||
                                property.type === 'business' ||
                                property.type === 'cascader') &&
                            property.multiple
                        ) {
                            params[key] = params[key].toString()
                        }
                        if (
                            property.type === 'picture' ||
                            property.type === 'upload' ||
                            property.type === 'table' ||
                            property.type === 'area'
                        ) {
                            params[key] = JSON.stringify(params[key])
                        }
                    }
                    if (params[key] instanceof Array || params[key] instanceof Object) {
                        params[key] = JSON.stringify(params[key])
                    }
                    if (key.indexOf('|') > -1) {
                        params[key.split('|')[0] + '.' + key.split('|')[1]] = params[key]
                        delete params[key]
                    }
                })

                if (this.approveOptionalSelection.length > 0) {
                    params['approverOptionalList'] = this.approveOptionalSelection.toString()
                }

                if (this.flowOptionalSelection.length > 0) {
                    params['flowOptionalList'] = this.flowOptionalSelection.toString()
                }

                // 避免form表单temporaryStorage覆盖
                params.temporaryStorage = temporaryStorage

                delete params['form']

                that.loading = true
                that.$axios.post('jellyForm/updateCustom', params).then(res => {
                    that.loading = false
                    if (res.data.code == 200) {
                        that.$message.success('提交成功')
                        that.$store.commit('worktabRemove', that.$history.currentRoute.fullPath)
                    } else if (res.data.code == 10004) {
                        // 审批人自选
                        that.approveOptionalList = JSON.parse(res.data.message)
                        that.approveOptionalVisible = true
                    } else if (res.data.code == 10009) {
                        // 流程手动选择
                        that.flowOptionalList = JSON.parse(res.data.message)
                        that.flowOptionalVisible = true
                    } else if (res.data.code == 10011) {
                        // 提示窗
                        that.warnTableData = JSON.parse(res.data.message)
                        that.warnParams = params
                        that.warnVisible = true
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            async queryCommonWordsAll() {
                let res = await this.$axios.get('commonWords/queryAll')
                if (res.data.code == 200) {
                    this.commonWordsData = res.data.data
                    let commonWords = []
                    for (let i = 0; i < this.commonWordsData.length; i++) {
                        commonWords.push(this.commonWordsData[i].name)
                    }
                    commonWords.push('同意')
                    commonWords.push('交相关部门处理')
                    commonWords.push('按单位相关规章制度办理')
                    commonWords.push('保留意见')
                    commonWords.push('同意，按规定办理')
                    commonWords.push('按流程办理')
                    this.commonWords = commonWords
                }
            },
            showCommonWordsDialog() {
                this.queryCommonWordsAll()
                this.commonWordsVisible = true
            },
            showCommonWordsAddDialog() {
                this.addCommonWordsVisible = true
                if (this.$refs.addCommonWordsForm) {
                    this.$refs.addCommonWordsForm.resetFields()
                }
            },
            addCommonWordsSubmit() {
                let that = this
                this.$refs.addCommonWordsForm.validate(valid => {
                    if (valid) {
                        that.$axios.post('commonWords/insert', that.addCommonWordsForm).then(res => {
                            if (res.data.code == 200) {
                                that.$message.success('新增成功')
                                that.addCommonWordsVisible = false
                                that.queryCommonWordsAll()
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            showCommonWordsEditDialog(row) {
                this.editCommonWordsForm = Object.assign({}, row)
                this.editCommonWordsVisible = true
                if (this.$refs.editCommonWordsForm) {
                    this.$refs.editCommonWordsForm.resetFields()
                }
            },
            editCommonWordsSubmit() {
                let that = this
                this.$refs.editCommonWordsForm.validate(valid => {
                    if (valid) {
                        that.$axios.post('commonWords/update', that.editCommonWordsForm).then(res => {
                            if (res.data.code == 200) {
                                that.$message.success('修改成功')
                                that.editCommonWordsVisible = false
                                that.queryCommonWordsAll()
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                })
            },
            deleteCommonWordsSubmit(row) {
                let that = this
                this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                    that.$axios.post('commonWords/delete/' + row.id, {}).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('删除成功')
                            that.queryCommonWordsAll()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
            },

            handleWarnSubmit() {
                let that = this
                var params = that.warnParams
                params.verified = true // 是否已经验证
                that.loading = true
                that.$axios.post('jellyForm/updateCustom', params).then(res => {
                    that.loading = false
                    if (res.data.code == 200) {
                        that.$message.success('提交成功')
                        that.$store.commit('worktabRemove', that.$history.currentRoute.fullPath)
                        that.warnVisible = false
                    } else if (res.data.code == 10004) {
                        // 审批人自选
                        that.approveOptionalList = JSON.parse(res.data.message)
                        that.approveOptionalVisible = true
                        that.warnVisible = false
                    } else if (res.data.code == 10009) {
                        // 流程手动选择
                        that.flowOptionalList = JSON.parse(res.data.message)
                        that.flowOptionalVisible = true
                        that.warnVisible = false
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },

            audit() {
                let params = {
                    userId: localStorage.getItem('userId'),
                    companyId: localStorage.getItem('companyId'),
                    ids: this.$history.currentRoute.query.id,
                    status: 1
                }
                this.loading = true
                this.$axios.get('cloud/entrance/batchUpdateContractStatus', { params }).then(res => {
                    this.loading = false
                    if (res.data.code === 200) {
                        this.$message.success("审核成功")
                        this.$history.go(-1)
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },

            back() {
                let params = {
                    userId: localStorage.getItem('userId'),
                    companyId: localStorage.getItem('companyId'),
                    ids: this.$history.currentRoute.query.id,
                    status: 2
                }
                this.loading = true
                this.$axios.get('cloud/entrance/batchUpdateContractStatus', { params }).then(res => {
                    this.loading = false
                    if (res.data.code === 200) {
                        this.$message.success("退回成功")
                        this.$history.go(-1)
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },

            sendRentInfo() {}
        }
    }
</script>

<style scoped>
::v-deep .el-dialog__body {
    padding: 5px 20px 0px 20px;
}
.approval {
    position: fixed;
    top: 0;
    right: 0;
    width: 324px;
    height: 100%;
    z-index: 2000;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0 8px 10px -5px rgb(0 0 0 / 20%), 0 16px 24px 2px rgb(0 0 0 / 14%), 0 6px 30px 5px rgb(0 0 0 / 12%);
    padding: 15px;
}
.container {
    padding: 5px 0px 45px 5px;
}
.footer {
    position: fixed;
    left: 230px;
    bottom: 0px;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    height: 65px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    border-top: 1px solid #ebeef5;
    z-index: 2000;
}
.footer-right {
    position: fixed;
    bottom: 0px;
    right: 15px;
    padding: 10px;
}
::v-deep .warn-dialog .el-dialog__header {
    background: #f3f1f1;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 18px 18px 10px 18px;
}
::v-deep .warn-dialog .el-dialog__footer {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding-bottom: 10px
}
</style>
