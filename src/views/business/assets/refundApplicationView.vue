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

            <!--退款明细-->
            <div style="margin-bottom: 20px">
                <el-tabs type="border-card">
                    <el-tab-pane label="退款明细">
                        <el-button
                            v-if="temporaryStorage"
                            type="primary"
                            size="small"
                            icon="el-icon-plus"
                            style="margin-bottom: 5px"
                            @click="handleAddFee">
                            新增
                        </el-button>
                        <el-form :model="otherCostForm" ref="otherCostForm" size="small">
                            <!--可编辑-->
                            <el-table
                                v-if="temporaryStorage"
                                :data="otherCostForm.otherCostData"
                                show-summary
                                :summary-method="getSummaries"
                                style="width: 100%">
                                <el-table-column prop="type" align="center" label="申请退款费用类型">
                                    <template slot-scope="scope" v-if="queryTag">
                                        <el-form-item :prop="'otherCostData.' + scope.$index + '.type'">
                                            <el-select v-model="scope.row.name" @change="typeChange($event, scope.$index)" filterable placeholder="请选择费用类型">
                                                <el-option
                                                    v-for="(item, index) in feeDetailList"
                                                    :key="item.source_id"
                                                    :label="item.label"
                                                    :value="item.source_id"
                                                    :disabled="item.choose"
                                                    v-if="changeChoose">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="amount" align="center" label="申请退款金额">
                                    <template slot-scope="scope">
                                        <el-form-item :prop="'otherCostData.' + scope.$index + '.amount'">
                                            <el-input-number v-model="scope.row.amount" :controls="false" :precision="2" disabled></el-input-number>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="75">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="handleDelFee(scope.$index)" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--不可编辑-->
                            <el-table
                                v-else
                                :data="otherCostForm.otherCostData"
                                show-summary
                                :summary-method="getSummaries"
                                style="width: 100%">
                                <el-table-column prop="typeName" align="center" label="申请退款费用类型"></el-table-column>
                                <el-table-column prop="amount" align="center" label="申请退款金额"></el-table-column>
                            </el-table>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
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
                    <el-button type="primary"><i class="el-icon-document"></i> 联查</el-button>
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
                >流程查看
                </el-button
                >
                <el-button
                    type="primary"
                    icon="el-icon-printer"
                    @click="handlePrint"
                    v-if="form.form && form.form.detailExportPath"
                    :disabled="disableButtonFlag.print"
                >打印
                </el-button
                >
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    @click="handleDelete"
                    v-if="(flowFlag === 1 && flowStatus === 1) || (flowFlag === 1 && temporaryStorage)"
                    :disabled="disableButtonFlag.delete"
                >删除
                </el-button
                >
                <el-button
                    type="primary"
                    icon="el-icon-refresh-left"
                    @click="showRevoke"
                    v-if="flowFlag === 1 && (flowStatus === 2 || flowStatus === 4)"
                    :disabled="disableButtonFlag.recall"
                >撤回
                </el-button
                >
                <el-button
                    type="primary"
                    icon="el-icon-document-checked"
                    @click="handleApproval"
                    v-if="flowFlag === 1 && (flowStatus === 3 || flowStatus === 4)"
                    :disabled="disableButtonFlag.audit"
                >审批
                </el-button
                >
                <el-button
                    type="primary"
                    icon="el-icon-document-checked"
                    @click="handleAbandon"
                    v-if="flowFlag === 1 && abandonFlag"
                    :disabled="disableButtonFlag.abandon"
                >弃审
                </el-button
                >
                <!--保存-->
                <el-button
                    type="primary"
                    icon="el-icon-document"
                    @click="submitForm(3)"
                    v-if="flowFlag === 1 && temporaryStorage"
                    :disabled="disableButtonFlag.temp"
                >暂存
                </el-button
                >
                <el-button
                    type="primary"
                    icon="el-icon-document-checked"
                    @click="submitForm(2)"
                    v-if="flowFlag === 1 && temporaryStorage"
                    :disabled="disableButtonFlag.submit"
                >提交
                </el-button
                >
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
                                }}
                            </el-dropdown-item>
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
                >提交
                </el-button
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
            <print-form :formModel="form" :formCofig="printJson" :property="property"/>
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
                        >编辑
                        </el-button
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
                revokeForm: {reason: ''},
                formRules: {
                    reason: [{required: true, message: '请输入理由', trigger: 'blur'}],
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}]
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
                addCommonWordsForm: {name: ''},
                editCommonWordsVisible: false,
                editCommonWordsForm: {name: ''},
                commonWordsVisible: false,
                commonWordsData: [],
                textModel: {flag: false, type: 'text'},
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
                feeDetailList: [],
                otherCostForm: {
                    otherCostData: []
                },
                changeChoose: true,
                queryTag: false
            }
        },
        created() {
            this._databaseId = localStorage.getItem('_databaseId')
            this.reportDetail()
            this.queryCommonWordsAll()
            this.getOtherCost()
        },

        methods: {
            async reportDetail() {
                this.loading = true
                var params = {
                    id: this.$history.currentRoute.query.id,
                    formId: this.$history.currentRoute.query.formId
                }
                let res = await this.$axios.get('jellyForm/queryDetail', {params})
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

                if (this.otherCostForm.otherCostData.length > 0) {
                    params['costData'] = JSON.stringify(this.otherCostForm.otherCostData)
                }
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
                this.$confirm('亲，确认要删除吗？', '提示', {type: 'warning'}).then(() => {
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
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (index === 1) {
                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] += ' 元';
                        } else {
                            sums[index] = 'N/A';
                        }
                    }
                })

                return sums;
            },
            getOtherCost() {
                let params = {
                    infoId: this.$history.currentRoute.query.id
                }
                this.$axios.get('cloud/entrance/queryRefundDetail', {params}).then(res => {
                    if (res.data.code == 200) {
                        this.otherCostForm.otherCostData = res.data.data
                        this.$nextTick(() => {
                            this.queryRentDetail(this.$history.currentRoute.query.contract)
                        })

                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },
            // 查询
            queryRentDetail(contract) {
                this.contract = contract
                let that = this
                let params = {
                    contract: contract,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/queryNeedRefund', params).then(res => {
                    if (res.data.code == 200) {
                        that.feeDetailList = res.data.data
                        that.otherCostForm.otherCostData.forEach(value => {
                            let sourceName = value.source == 1 ? '线下收款' : '线上收款'
                            let label
                            if (value.type == 5) {
                                label = sourceName + ' - ' + value.typeName + ' - 期数' + value.period + ' - 金额' + value.amount
                            } else if (value.type == 6 || value.type == 7) {
                                label = sourceName + ' - ' + value.typeName + ' - ' + value.amount
                            } else {
                                // 应收单
                                label = sourceName + ' - ' + value.typeName + ' - 金额' + value.amount
                            }
                            let obj = {
                                source_id: value.source_id,
                                amount: value.amount,
                                type: value.type,
                                period: value.period,
                                typeName: value.typeName,
                                sourceName: sourceName,
                                source: value.source,
                                label: label,
                                name: label
                            }
                            value.name = label
                            value.label = label
                            that.feeDetailList.push(obj)
                        })
                        that.feeDetailList.map(val => {
                            let label
                            if (val.type == 5) {
                                label = val.sourceName + ' - ' + val.typeName + ' - 期数' + val.period + ' - 金额' + val.amount
                            } else if (val.type == 6 || val.type == 7) {
                                label = val.sourceName + ' - ' + val.typeName + ' - ' + val.amount
                            } else {
                                // 应收单
                                label = val.sourceName + ' - ' + val.typeName + ' - 金额' + val.amount
                            }
                            val.label = label
                            val.name = label
                            val.choose = false
                        })
                        if (that.feeDetailList.length == 0) {
                            that.$message.warning('该合同不存在需要退款数据！')
                        }
                        // 遍历是否已经被选择
                        this.selectChangeJudge()
                        this.queryTag = true
                    } else {
                        that.$message.error('退款明细查询失败！')
                    }
                })
            },
            // 遍历是否已经被选择
            selectChangeJudge() {
                this.feeDetailList.forEach(item => {
                    item.choose = false
                    this.otherCostForm.otherCostData.forEach(cost => {
                        if (item.source_id == cost.source_id) {
                            item.choose = true
                        }
                    })
                })
            },
            // 新增费用明细
            handleAddFee() {
                this.changeChoose = false
                if (this.feeDetailList.length == 0) {
                    this.$message.warning('该合同不存在需要退款数据！')
                    return
                }
                let canChoose = null
                for (let index = 0; index < this.feeDetailList.length; index++) {
                    if (!this.feeDetailList[index].choose) {
                        canChoose = this.feeDetailList[index]
                        this.$set(this.feeDetailList[index], 'choose', true)
                        break
                    }
                }
                if (!canChoose) {
                    this.$message.warning('暂无数据！')
                    this.changeChoose = true
                    return;
                }
                this.$forceUpdate()
                this.otherCostForm.otherCostData.push({
                    source_id: canChoose.source_id,
                    amount: canChoose.amount,
                    oldAmount: canChoose.oldAmount,
                    type: canChoose.type,
                    source: canChoose.source,
                    name: canChoose.name,
                    label: canChoose.label,
                    period: canChoose.period,
                })
                this.changeChoose = true
            },
            // 删除费用明细
            handleDelFee(index) {
                this.otherCostForm.otherCostData.splice(index, 1)
                this.changeChoose = false
                // 遍历是否已经被选择
                this.selectChangeJudge()
                this.changeChoose = true
            },
            typeChange(val, index) {
                this.changeChoose = false
                this.feeDetailList.forEach(item => {
                    if (item.source_id === val) {
                        this.$set(this.otherCostForm.otherCostData[index], 'source_id', item.source_id)
                        this.$set(this.otherCostForm.otherCostData[index], 'amount', item.amount)
                        this.$set(this.otherCostForm.otherCostData[index], 'name', item.name)
                        this.$set(this.otherCostForm.otherCostData[index], 'oldAmount', item.oldAmount)
                        this.$set(this.otherCostForm.otherCostData[index], 'source', item.source)
                    }
                })
                // 遍历是否已经被选择
                this.selectChangeJudge()
                this.changeChoose = true
            },
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
