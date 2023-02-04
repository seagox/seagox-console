<template>
    <div class="container" v-loading="loading">
        <!--简化版-->
        <div v-if="formDesignType === 1">
            <simplify-form
                    ref="simplifyForm"
                    :action="action"
                    :formModel="formModel"
                    :formCofig="formCofig"
                    :property="property"
                    :calculate="calculate"
                    :textModel="textModel"
            />
        </div>
        <!--高级版-->
        <div v-if="formDesignType === 2">
            <senior-form
                    ref="seniorForm"
                    :action="action"
                    :formModel="formModel"
                    :formCofig="formCofig"
                    :property="property"
                    :calculate="calculate"
            />
        </div>
        <div style="margin-bottom: 20px">
            <el-tabs type="border-card">
                <el-tab-pane label="房租">
                    <el-button type="primary" size="small" icon="el-icon-document" @click="handleCreateHouseBill">生成账单</el-button>
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddHouseBill">新增</el-button>
                    <el-button type="primary" size="small" icon="el-icon-sort" @click="sortByStartDate">按时间排序</el-button>
                    <el-form :model="houseBillTableForm" ref="houseBillTableForm" :rules="houseBillRules" size="small">
                        <el-table
                                :data="houseBillTableForm.houseBillData"
                                style="width: 100%">
                            <el-table-column
                                    prop="period"
                                    width="50"
                                    align="center"
                                    label="期数">
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    align="center"
                                    width="120"
                                    label="收款类型">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'houseBillData.' + scope.$index + '.type'">
                                        <el-select v-model="scope.row.type" filterable placeholder="请选择收款类型">
                                            <el-option key="1" label="首付款" :value="1"></el-option>
                                            <el-option key="2" label="阶段款" :value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="start_date"
                                    align="center"
                                    label="开始日期">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'houseBillData.' + scope.$index + '.start_date'" :rules="houseBillRules.startDate">
                                        <el-date-picker
                                                v-model="scope.row.start_date"
                                                value-format="yyyy-MM-dd"
                                                type="date"
                                                placeholder="选择开始日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="end_date"
                                    align="center"
                                    label="结束日期">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'houseBillData.' + scope.$index + '.end_date'" :rules="houseBillRules.endDate">
                                        <el-date-picker
                                                v-model="scope.row.end_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder="选择结束日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="amount"
                                    align="center"
                                    width="140"
                                    label="收款金额">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'houseBillData.' + scope.$index + '.amount'" :rules="houseBillRules.amount">
                                        <el-input-number v-model="scope.row.amount" :controls="false" :precision="2"></el-input-number>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="real_amount"
                                    align="center"
                                    width="140"
                                    label="实际收款金额">
                            </el-table-column>
                            <el-table-column
                                    prop="receipt_date"
                                    align="center"
                                    label="收款日期">
                                <template slot-scope="scope">
                                    <el-form-item v-if="scope.row.type === 1" :prop="'houseBillData.' + scope.$index + '.receipt_date'">
                                        <el-date-picker
                                                v-model="scope.row.receipt_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder="请选择收款日期">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item v-if="scope.row.type === 2" :prop="'houseBillData.' + scope.$index + '.receipt_date'" :rules="houseBillRules.receiptDate">
                                        <el-date-picker
                                                v-model="scope.row.receipt_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder="请选择收款日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="real_receipt_date"
                                    align="center"
                                    label="实际收款日期">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'houseBillData.' + scope.$index + '.real_receipt_date'">
                                        <el-date-picker
                                                v-model="scope.row.real_receipt_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                disabled
                                                placeholder="请选择实际收款日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <!--<el-table-column prop="status" align="center" label="状态" :formatter="houseBillStatusFormatter"></el-table-column>-->
                            <el-table-column label="操作" align="center" width="75">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="handleDelHouseBill(scope.$index)" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="其它费用">
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddOtherCost">新增</el-button>
                    <el-form :model="otherCostForm" ref="otherCostForm" :rules="otherCostRules" size="small">
                        <el-table
                                :data="otherCostForm.otherCostData"
                                style="width: 100%">
                            <el-table-column
                                    type="index"
                                    width="50">
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    align="center"
                                    label="费用类型">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'otherCostData.' + scope.$index + '.type'" :rules="otherCostRules.type">
                                        <el-select v-model="scope.row.type" filterable placeholder="请选择费用类型">
                                            <el-option key="1" label="押金" :value="1"></el-option>
                                            <el-option key="2" label="保证金" :value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="amount"
                                    align="center"
                                    label="收款金额">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'otherCostData.' + scope.$index + '.amount'" :rules="otherCostRules.amount">
                                        <el-input-number v-model="scope.row.amount" :controls="false" :precision="2"></el-input-number>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="real_amount"
                                    align="center"
                                    label="实际收款金额">
                            </el-table-column>
                            <el-table-column
                                    prop="real_receipt_date"
                                    align="center"
                                    label="实际收款日期">
                                <template slot-scope="scope">
                                    <el-form-item>
                                        <el-date-picker
                                                v-model="scope.row.real_receipt_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                disabled
                                                placeholder="请选择实际收款日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="remark"
                                    align="center"
                                    label="备注">
                                <template slot-scope="scope">
                                    <el-form-item>
                                        <el-input v-model="scope.row.remark"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="75">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="handleDelOtherCost(scope.$index)" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="footer">
            <div class="footer-right">
                <el-dropdown
                        trigger="click"
                        style="margin-right:10px"
                        @command="handleTextCommand"
                        v-if="textModel.flag"
                >
                    <el-button type="primary" icon="el-icon-document"
                    >正文类型<i class="el-icon-arrow-down el-icon--right"></i
                    ></el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="text">标准正文</el-dropdown-item>
                        <el-dropdown-item command="word">Word正文</el-dropdown-item>
                        <el-dropdown-item command="excel">Excel正文</el-dropdown-item>
                        <el-dropdown-item command="pdf">Pdf正文</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button
                        type="primary"
                        icon="el-icon-document"
                        @click="saveForm"
                        v-if="flowFlag === 1"
                        :disabled="disableButtonFlag.temp"
                >暂存</el-button
                >
                <el-button
                        type="primary"
                        icon="el-icon-document-checked"
                        @click="submitForm"
                        :disabled="disableButtonFlag.submit"
                >提交</el-button
                >
            </div>
        </div>
        <!--温馨提示-->
        <el-dialog title="温馨提示" width="500px" :visible.sync="verifyVisible" :close-on-click-modal="false">
            <div
                    v-for="(item, index) in messageArray"
                    :key="index"
                    style="color:#e6a23c;margin-bottom:10px;font-size:16px;"
            >
                <i class="el-icon-warning-outline"></i> {{ item }}
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="verifyVisible = false">取消</el-button>
                <el-button type="primary" @click="verifySubmit">提交</el-button>
            </div>
        </el-dialog>
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
                        :show-header="false"
                        :max-height="450"
                        @selection-change="handleFlowOptionalChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="label"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="flowOptionalVisible = false">取消</el-button>
                <el-button type="primary" @click="flowOptionalSubmit">提交</el-button>
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
                formModel: {},
                calculate: {},
                property: {},
                formId: '',
                verifyVisible: false,
                messageArray: [],
                flowFlag: 2,
                formDesignType: 0,
                formCofig: {},
                approveOptionalVisible: false,
                approveOptionalList: [],
                approveOptionalSelection: [],
                flowOptionalVisible: false,
                flowOptionalList: [],
                flowOptionalSelection: [],
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

                houseBillTableForm: {
                    houseBillData: []
                },

                houseBillRules: {
                    startDate: [{ required: true, message: '请选择开始日期', trigger: 'blur' }],
                    endDate: [{ required: true, message: '请选择结束日期', trigger: 'blur' }],
                    amount: [{ required: true, message: '请输入收款金额', trigger: 'blur' }],
                    receiptDate: [{ required: true, message: '请选择收款日期', trigger: 'blur' }],
                },

                otherCostForm: {
                    otherCostData: []
                },
                otherCostRules: {
                    type: [{ required: true, message: '请选择费用类型', trigger: 'blur' }],
                    amount: [{ required: true, message: '请输入收款金额', trigger: 'blur' }],
                },
            }
        },
        created() {
            this.queryByMark()
        },
        methods: {
            async queryByMark() {
                this.loading = true
                const res = await this.$axios.get('jellyForm/queryByMark/' + this.$history.currentRoute.query.id)
                this.loading = false
                if (res.data.code == 200) {
                    this.formId = res.data.data.id
                    if (res.data.data.hasOwnProperty('flowId') && res.data.data.flowId != null) {
                        this.flowFlag = 1
                    }
                    this.disableButtonFlag = res.data.data.disableButtonFlag
                    for (let i = 0; i < res.data.data.formDesignList.length; i++) {
                        let formDesign = res.data.data.formDesignList[i]
                        this.formDesignType = formDesign.type
                        this.formCofig = JSON.parse(formDesign.excelJson)
                    }

                    this.getContractInfo()
                    this.getContractCode()
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
            verifySubmit() {
                this.verifyVisible = false
                let that = this
                var params = {
                    $formId: that.formId
                }

                //表单验证
                if (this.formDesignType === 1) {
                    let result = this.$refs.simplifyForm.validate()
                    if (!result) {
                        return
                    }
                } else if (this.formDesignType === 2) {
                    let result = this.$refs.seniorForm.validate()
                    if (!result) {
                        return
                    }
                }

                params = Object.assign(params, this.formModel)

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
                })

                if (this.approveOptionalSelection.length > 0) {
                    params['approverOptionalList'] = this.approveOptionalSelection.toString()
                }

                if (this.flowOptionalSelection.length > 0) {
                    params['flowOptionalList'] = this.flowOptionalSelection.toString()
                }

                if (this.houseBillTableForm.houseBillData.length > 0) {
                    params['houseBillList'] = JSON.stringify(this.houseBillTableForm.houseBillData)
                }
                if (this.otherCostForm.otherCostData.length > 0) {
                    params['otherCostList'] = JSON.stringify(this.otherCostForm.otherCostData)
                }

                that.$axios.post('jellyForm/insertCustom', params).then(res => {
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
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            submitForm() {
                let that = this
                var params = {
                    $formId: that.formId
                }
                //表单验证
                if (this.formDesignType === 1) {
                    let result = this.$refs.simplifyForm.validate()
                    if (!result) {
                        return
                    }
                } else if (this.formDesignType === 2) {
                    let result = this.$refs.seniorForm.validate()
                    if (!result) {
                        return
                    }
                }

                params = Object.assign(params, this.formModel)

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

                that.loading = true
                that.$axios.post('jellyForm/insertCustom', params).then(res => {
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
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            approveOptionalSubmit() {
                if (this.approveOptionalSelection.length === 0) {
                    this.$message.warning('请选择节点执行人')
                } else {
                    this.approveOptionalVisible = false
                    this.submitForm()
                }
            },
            flowOptionalSubmit() {
                if (this.flowOptionalSelection.length === 0) {
                    this.$message.warning('请选择流程节点')
                } else {
                    this.flowOptionalVisible = false
                    this.submitForm()
                }
            },
            saveForm() {
                let that = this
                var params = {
                    $formId: that.formId,
                    temporaryStorage: true
                }

                params = Object.assign(params, this.formModel)

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

                if (this.houseBillTableForm.houseBillData.length > 0) {
                    params['houseBillList'] = JSON.stringify(this.houseBillTableForm.houseBillData)
                }
                if (this.otherCostForm.otherCostData.length > 0) {
                    params['otherCostList'] = JSON.stringify(this.otherCostForm.otherCostData)
                }

                if (this.houseBillTableForm.houseBillData.length > 0) {
                    params['houseBillList'] = JSON.stringify(this.houseBillTableForm.houseBillData)
                }
                if (this.otherCostForm.otherCostData.length > 0) {
                    params['otherCostList'] = JSON.stringify(this.otherCostForm.otherCostData)
                }

                that.loading = true
                that.$axios.post('jellyForm/insertCustom', params).then(res => {
                    that.loading = false
                    if (res.data.code == 200) {
                        that.$message.success('保存成功')
                        that.$store.commit('worktabRemove', that.$history.currentRoute.fullPath)
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            handleTextCommand(command) {
                this.textModel.type = command
                if (command === 'text') {
                    // 标准正文
                    this.$set(this.formModel, this.textModel.field, {})
                } else if (command === 'word') {
                    // Word正文
                    this.$set(this.formModel, this.textModel.field, { type: 'word' })
                } else if (command === 'excel') {
                    // Excel正文
                    this.$set(this.formModel, this.textModel.field, { type: 'word' })
                } else if (command === 'pdf') {
                    // Pdf正文
                    this.$set(this.formModel, this.textModel.field, { type: 'pdf' })
                }
            },

            // 获取合同信息
            getContractInfo() {
                this.loading = true
                this.$set(this.formModel, 'assets_contract_info.relet_id', this.$history.currentRoute.query.reletId + '')
                this.$set(this.formModel, 'assets_contract_info.original_id', this.$history.currentRoute.query.originalId + '')
                let params = {
                    id: this.$history.currentRoute.query.originalId
                }
                this.$axios.get('cloud/entrance/getContractInfoById', { params }).then(res => {
                    this.loading = false
                    if (res.data.code == 200) {
                        let data = res.data.data
                        this.$set(this.formModel, 'assets_contract_info.lease_use', data.lease_use + '')
                        this.$set(this.formModel, 'assets_contract_info.customer_type', data.customer_type + '')
                        this.$set(this.formModel, 'assets_contract_info.tenement', data.tenement)
                        this.$set(this.formModel, 'assets_contract_info.id_card', data.id_card)
                        this.$set(this.formModel, 'assets_contract_info.contact_way', data.contact_way)
                        this.$set(this.formModel, 'assets_contract_info.address', data.address)
                        this.$set(this.formModel, 'assets_contract_info.rent_period', data.rent_period)
                        this.$set(this.formModel, 'assets_contract_info.sign_area', data.sign_area)
                        this.$set(this.formModel, 'assets_contract_info.rent_type', data.rent_type)
                        this.$set(this.formModel, 'assets_contract_info.month_rent', data.month_rent)
                        this.$set(this.formModel, 'assets_contract_info.rent_period_type', data.rent_period_type + '')
                        this.$set(this.formModel, 'assets_contract_info.per_period_amount', data.per_period_amount)
                        this.$set(this.formModel, 'assets_contract_info.deposit', data.deposit)
                        this.$set(this.formModel, 'assets_contract_info.earnest_money', data.earnest_money)
                        this.$set(this.formModel, 'assets_contract_info.deposit_pay_time', data.deposit_pay_time)
                        this.$set(this.formModel, 'assets_contract_info.earnest_money_pay_time', data.earnest_money_pay_time)
                        this.$set(this.formModel, 'assets_contract_info.mark_type', data.mark_type)
                        this.$set(this.formModel, 'assets_contract_info.business_id', data.business_id)
                        this.$set(this.formModel, 'assets_contract_info.assets_name', data.assets_name)
                        this.$set(this.formModel, 'assets_contract_info.manage_company_name', data.manage_company_name)
                        this.$set(this.formModel, 'assets_contract_info.area', data.area)
                        this.$set(this.formModel, 'assets_contract_info.assets_id', data.assets_id)
                        this.$set(this.formModel, 'assets_contract_info.repayment_date', data.repayment_date)
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },

            // 生成房租账单
            handleCreateHouseBill() {
                let form = this.formModel
                if (!form['assets_contract_info.month_rent']) {
                    this.$message.warning("请输入月租金")
                    return
                }
                if (!form['assets_contract_info.start_date']) {
                    this.$message.warning("请选择开始日期")
                    return
                }
                if (!form['assets_contract_info.end_date']) {
                    this.$message.warning("请选择结束日期")
                    return
                }
                if (!form['assets_contract_info.rent_period_type']) {
                    this.$message.warning("请选择租金计期方式")
                    return
                }
                if (!form['assets_contract_info.repayment_date']) {
                    this.$message.warning("请输入每月X日内收款")
                    return
                }
                if (form['assets_contract_info.repayment_date'] > 28) {
                    this.$message.warning("【每月X日内收款】不能大于28")
                    return
                }
                this.createHouseBillDetail(form)
            },

            // 生成房租账单明细
            createHouseBillDetail(form) {
                this.$refs.houseBillTableForm.clearValidate()
                this.houseBillTableForm.houseBillData = []
                let startDate = form['assets_contract_info.start_date']
                let endDate
                let lastDate = form['assets_contract_info.end_date']
                let item
                let isFirst = true
                let receiptDate
                let period = 1
                while (lastDate > startDate) {
                    endDate = this.moreDate(this.commonAddMouth(startDate, form['assets_contract_info.rent_period_type'], 0), -1)
                    receiptDate = this.commonAddMouth(startDate, -1 , 0)
                    if (endDate > lastDate) {
                        endDate = lastDate
                    }
                    item = {
                        period: period,
                        type: isFirst ? 1 : 2,
                        start_date: startDate,
                        end_date: endDate,
                        receipt_date: isFirst ? null : receiptDate.substring(0, receiptDate.lastIndexOf("-")) + "-" + this.doHandleMonth(form['assets_contract_info.repayment_date'] + ''),
                        amount: form['assets_contract_info.per_period_amount'],
                        real_amount: null,
                        real_receipt_date: null
                    }
                    this.houseBillTableForm.houseBillData.push(item)
                    startDate = this.moreDate(endDate, 1)
                    isFirst = false
                    period++
                }
            },

            /**
             * 当前日期增加n月
             * @param dateStr 当前日期
             * @param num 月
             * @param type 0:2022-05-30   1：2022-05-30 11:11:11
             * @returns {string}
             */
            commonAddMouth(dateStr, num, type) {
                var monthnum = 0;
                if (typeof (num) == "string") {
                    monthnum = parseInt(num);
                } else {
                    monthnum = num;
                }
                var date = new Date(dateStr);
                //获取原日
                var day = date.getDate();
                //获取原月份
                var month = date.getMonth();
                //设置增加月份
                date.setMonth(date.getMonth() + (monthnum * 1), 1);
                //获取增加的后的月份
                var Jmonth = date.getMonth() + 1;
                //获取增加的后的年份
                var Jyear = date.getFullYear();
                if (Jmonth == 4 || Jmonth == 6 || Jmonth == 9 || Jmonth == 11) {
                    //小月
                    if (day > 30) {
                        day = 30;
                    }
                } else if (Jmonth == 2) {
                    //2月判断是否闰年
                    if (((Jyear % 4) == 0) && ((Jyear % 100) != 0) || ((Jyear % 400) == 0)) {
                        if (day > 29) {
                            day = 29;
                        }
                    }
                    if (day > 28) {
                        day = 28
                    }

                } else {
                    //大月
                    if (day > 31) {
                        day = 31;
                    }
                }
                var tHours = date.getHours();
                var tMinutes = date.getMinutes();
                var tSeconds = date.getSeconds();
                Jmonth = this.doHandleMonth(Jmonth);
                day = this.doHandleMonth(day);
                if (type == "0") {
                    return Jyear + "-" + Jmonth + "-" + day;
                }
                return Jyear + "-" + Jmonth + "-" + day + " " + tHours + ":" + tMinutes + ":" + tSeconds;
            },

            moreDate(someDate, n) {
                var datt = someDate.split('-');//这边给定一个特定时间
                var newDate = new Date(datt[0], datt[1] - 1, datt[2]);
                var befminuts = newDate.getTime() + 1000 * 60 * 60 * 24 * parseInt(n);//前几天用减，后几天用加
                var beforeDat = new Date;
                beforeDat.setTime(befminuts);
                var befMonth = beforeDat.getMonth() + 1;
                var mon = befMonth >= 10 ? befMonth : '0' + befMonth;
                var befDate = beforeDat.getDate();
                var da = befDate >= 10 ? befDate : '0' + befDate;
                var newDate1 = beforeDat.getFullYear() + '-' + mon + '-' + da;
                return newDate1;
            },

            /**
             *  日或月补0
             * @param month
             * @returns {string}
             */
            doHandleMonth(month) {
                var m = month;
                if (month.toString().length == 1) {
                    m = "0" + month;
                }
                return m;
            },

            // 新增房租
            handleAddHouseBill() {
                this.houseBillTableForm.houseBillData.push({
                    period: this.houseBillTableForm.houseBillData.length + 1,
                    type: 2,
                    start_date: null,
                    end_date: null,
                    receipt_date: null,
                    amount: null,
                    real_amount: null,
                    real_receipt_date: null
                })
            },

            // 删除房租
            handleDelHouseBill(index) {
                this.houseBillTableForm.houseBillData.splice(index,1)
            },

            // 按时间排序
            sortByStartDate() {
                if (this.houseBillTableForm.houseBillData.length > 1) {
                    this.houseBillTableForm.houseBillData = this.houseBillTableForm.houseBillData.sort(this.compare('start_date'))
                    for (let i = 0; i < this.houseBillTableForm.houseBillData.length; i++) {
                        this.houseBillTableForm.houseBillData[i].period = i + 1
                    }
                }
            },

            compare(property){
                return function(a,b){
                    var value1 = a[property];
                    var value2 = b[property];
                    if (value1 < value2) {
                        return -1
                    } else if (value1 == value2) {
                        return 0
                    }
                    return 1
                }
            },

            // 其它费用新增
            handleAddOtherCost() {
                this.otherCostForm.otherCostData.push({
                    type: null,
                    amount: null,
                    real_amount: null,
                    real_receipt_date: null,
                    remark: null
                })
            },

            // 其它费用删除
            handleDelOtherCost(index) {
                this.otherCostForm.otherCostData.splice(index,1)
            },

            // 获取合同编码
            getContractCode() {
                this.$axios.get('cloud/entrance/getContractCode').then(res => {
                    if (res.data.code == 200) {
                        this.$set(this.formModel, 'assets_contract_info.contract_code', res.data.data)
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            }
        }
    }
</script>
<style scoped>
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
}
.footer-right {
    position: fixed;
    bottom: 0px;
    right: 15px;
    padding: 10px;
}
</style>
