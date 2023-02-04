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
                    :disabledField="disabledField"
            />
        </div>

        <div style="margin-bottom: 20px">
            <el-tabs type="border-card">
                <el-tab-pane label="房租">
                    <!--变更表单不显示-->
                    <div v-if="!isModifyForm">
                        <el-button type="primary" size="small" icon="el-icon-document" @click="handleCreateHouseBill">生成账单</el-button>
                        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddHouseBill">新增</el-button>
                        <el-button type="primary" size="small" icon="el-icon-sort" @click="sortByStartDate">按时间排序</el-button>
                    </div>
                    <el-form :model="houseBillTableForm" ref="houseBillTableForm" :rules="houseBillRules" size="small">
                        <el-table
                                :data="houseBillTableForm.houseBillData"
                                show-summary
                                :summary-method="({ columns, data }) => getSummaries({ columns, data }, ['amount', 'real_amount'])"
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
                                    <el-form-item v-if="scope.row.status !== 1" :prop="'houseBillData.' + scope.$index + '.type'">
                                        <el-select v-model="scope.row.type" filterable placeholder="请选择收款类型">
                                            <el-option key="1" label="首付款" :value="1"></el-option>
                                            <el-option key="2" label="阶段款" :value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <span v-else>{{scope.row.type === 1 ? '首付款' : scope.row.type === 2 ? '阶段款' : scope.row.type}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="start_date"
                                    align="center"
                                    label="开始日期">
                                <template slot-scope="scope">
                                    <el-form-item v-if="scope.row.status !== 1" :prop="'houseBillData.' + scope.$index + '.start_date'" :rules="houseBillRules.startDate">
                                        <el-date-picker
                                                v-model="scope.row.start_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder="选择开始日期">
                                        </el-date-picker>
                                    </el-form-item>
                                    <span v-else>{{scope.row.start_date}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="end_date"
                                    align="center"
                                    label="结束日期">
                                <template slot-scope="scope">
                                    <el-form-item v-if="scope.row.status !== 1" :prop="'houseBillData.' + scope.$index + '.end_date'" :rules="houseBillRules.endDate">
                                        <el-date-picker
                                                v-model="scope.row.end_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder="选择结束日期">
                                        </el-date-picker>
                                    </el-form-item>
                                    <span v-else>{{scope.row.end_date}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="amount"
                                    align="center"
                                    width="140"
                                    label="收款金额">
                                <template slot-scope="scope">
                                    <el-form-item v-if="scope.row.status !== 1" :prop="'houseBillData.' + scope.$index + '.amount'" :rules="houseBillRules.amount">
                                        <el-input-number v-model="scope.row.amount" :controls="false" :precision="2" @change="setContractExpectAmount"></el-input-number>
                                    </el-form-item>
                                    <span v-else>{{scope.row.amount}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="real_amount"
                                    align="center"
                                    width="140"
                                    :formatter="rounding"
                                    label="实际收款金额">
                            </el-table-column>
                            <el-table-column
                                    prop="receipt_date"
                                    align="center"
                                    label="收款日期">
                                <template slot-scope="scope">
                                    <el-form-item v-if="scope.row.status !== 1 && scope.row.type === 1" :prop="'houseBillData.' + scope.$index + '.receipt_date'">
                                        <el-date-picker
                                                v-model="scope.row.receipt_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder="请选择收款日期">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item v-if="scope.row.status !== 1 && scope.row.type === 2" :prop="'houseBillData.' + scope.$index + '.receipt_date'" :rules="houseBillRules.receiptDate">
                                        <el-date-picker
                                                v-model="scope.row.receipt_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder="请选择收款日期">
                                        </el-date-picker>
                                    </el-form-item>
                                    <span v-if="scope.row.status === 1">{{scope.row.receipt_date}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="real_receipt_date"
                                    align="center"
                                    value-format="yyyy-MM-dd"
                                    label="实际收款日期">
                                <template slot-scope="scope">
                                    <el-form-item v-if="scope.row.status !== 1" :prop="'houseBillData.' + scope.$index + '.real_receipt_date'">
                                        <el-date-picker
                                                v-model="scope.row.real_receipt_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                disabled
                                                placeholder="请选择实际收款日期">
                                        </el-date-picker>
                                    </el-form-item>
                                    <span v-else>{{scope.row.real_receipt_date}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="status" align="center" label="状态" :formatter="houseBillStatusFormatter"></el-table-column>
                            <el-table-column label="操作" align="center" width="75" v-if="!isModifyForm">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.status !== 1" type="text" @click="handleDelHouseBill(scope.$index)" size="small">删除</el-button>
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
                                show-summary
                                :summary-method="({ columns, data }) => getSummaries({ columns, data }, ['amount', 'real_amount'])"
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
                                    <el-form-item v-if="scope.row.status !== 1" :prop="'otherCostData.' + scope.$index + '.type'" :rules="otherCostRules.type">
                                        <el-select v-model="scope.row.type" filterable placeholder="请选择费用类型">
                                            <el-option key="1" label="押金" :value="1"></el-option>
                                            <el-option key="2" label="保证金" :value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <span v-else>{{scope.row.type === 1 ? '押金' : scope.row.type === 2 ? '保证金' : scope.row.type}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="amount"
                                    align="center"
                                    label="收款金额">
                                <template slot-scope="scope">
                                    <el-form-item v-if="scope.row.status !== 1" :prop="'otherCostData.' + scope.$index + '.amount'" :rules="otherCostRules.amount">
                                        <el-input-number v-model="scope.row.amount" :controls="false" :precision="2"></el-input-number>
                                    </el-form-item>
                                    <span v-else>{{scope.row.amount}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="real_amount"
                                    align="center"
                                    :formatter="rounding"
                                    label="实际收款金额">
                            </el-table-column>
                            <el-table-column
                                    prop="real_receipt_date"
                                    align="center"
                                    value-format="yyyy-MM-dd"
                                    label="实际收款日期">
                                <template slot-scope="scope">
                                    <el-form-item v-if="scope.row.status !== 1">
                                        <el-date-picker
                                                v-model="scope.row.real_receipt_date"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                disabled
                                                placeholder="请选择实际收款日期">
                                        </el-date-picker>
                                    </el-form-item>
                                    <span v-else>{{scope.row.real_receipt_date}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="remark"
                                    align="center"
                                    label="备注">
                                <template slot-scope="scope">
                                    <el-form-item v-if="scope.row.status !== 1">
                                        <el-input v-model="scope.row.remark"></el-input>
                                    </el-form-item>
                                    <span v-else>{{scope.row.remark}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="status" align="center" label="状态" :formatter="houseBillStatusFormatter"></el-table-column>
                            <el-table-column label="操作" align="center" width="75">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.status !== 1" type="text" @click="handleDelOtherCost(scope.$index)" size="small">删除</el-button>
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

        <!--资产选择弹窗-->
        <el-dialog
                title="请选择"
                width="900px"
                append-to-body
                :visible.sync="assetsVisible"
                :before-close="closeAssetsVisible"
                :close-on-click-modal="false"
        >
            <div>
                <el-form label-width="90px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="资产名称">
                                <el-input
                                        v-model="assetsSelectCondition.name"
                                        placeholder="请输入资产名称"
                                        clearable>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <div style="margin-left:15px;">
                                <el-button type="primary" icon="el-icon-search" @click.native="assetsHandleSearch">查询</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="table">
                <!--列表-->
                <el-table
                        :data="assetsSelectData"
                        border
                        stripe
                        max-height="450"
                        @cell-dblclick="assetsCellDBClick">
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column prop="manageCompanyName" label="资产单位" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="type" label="资产类别" align="center" :formatter="assetsTypeFormatter" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="资产名称" align="center" show-overflow-tooltip></el-table-column>
                </el-table>
                <!--分页-->
                <div class="pagination">
                    <el-pagination
                            background
                            @current-change="assetsHandleCurrentChange"
                            layout="total, prev, pager, next"
                            :current-page.sync="assetsPage.pageNo"
                            :page-size="assetsPage.pageSize"
                            :total="assetsPage.total">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>

        <!--调用竞价书弹窗-->
        <el-dialog
                title="请选择"
                width="900px"
                append-to-body
                :visible.sync="hireVisible"
                :before-close="closeHireVisible"
                :close-on-click-modal="false"
        >
            <div>
                <el-form label-width="90px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="标的名称">
                                <el-input
                                        v-model="hireSelectCondition.name"
                                        placeholder="请输入标的名称"
                                        clearable>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <div style="margin-left:15px;">
                                <el-button type="primary" icon="el-icon-search" @click.native="hireHandleSearch">查询</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="table">
                <!--列表-->
                <el-table
                        :data="hireSelectData"
                        border
                        stripe
                        max-height="450"
                        @cell-dblclick="hireCellDBClick">
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="标的名称" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="winner_name" label="租户" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="manageCompanyName" label="资产单位" align="center" show-overflow-tooltip></el-table-column>
                </el-table>
                <!--分页-->
                <div class="pagination">
                    <el-pagination
                            background
                            @current-change="hireHandleCurrentChange"
                            layout="total, prev, pager, next"
                            :current-page.sync="hirePage.pageNo"
                            :page-size="hirePage.pageSize"
                            :total="hirePage.total">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>

        <!--不显示，触发计算属性-->
        <div v-show="false">{{computedEndDate}}</div>
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

                // 禁用字段
                disabledField: [],

                // 资产单位属性
                assetsVisible: false,
                assetsSelectCondition: {
                    name: null
                },
                assetsSelectData: [],
                assetsPage: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                // 竞价书属性
                hireVisible: false,
                hireSelectCondition: {
                    name: null
                },
                hireSelectData: [],
                hirePage: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
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

                // 是否更新房租明细
                isUpdateHouseBillFlag: false,
                // 是否更新其它费用明细
                isUpdateOtherCostFlag: false,

                // 是否变更表单
                isModifyForm: false
            }
        },

        computed: {
            computedEndDate() {
                if (this.formModel['assets_contract_info.rent_period'] && this.formModel['assets_contract_info.start_date']) {
                    let endDate = this.moreDate(this.commonAddMouth(this.formModel['assets_contract_info.start_date'], this.formModel['assets_contract_info.rent_period'], 0), -1)
                    this.$set(this.formModel, 'assets_contract_info.end_date', endDate)
                    if (this.formModel['assets_contract_info.rent_period_type']) {
                        this.$set(this.formModel, 'assets_contract_info.total_period', Math.ceil(this.$BigNumber(this.formModel['assets_contract_info.rent_period']).div(this.formModel['assets_contract_info.rent_period_type'])))
                    }
                    return endDate
                }
            }
        },

        watch: {
            // 监听编辑是否有修改 - houseBillTableForm
            houseBillTableForm: {
                handler(val) {
                    if (val) {
                        this.isUpdateHouseBillFlag = true
                    }

                },
                deep: true// 深度监听
            },

            // 监听编辑是否有修改 - otherCostForm
            otherCostForm: {
                handler(val) {
                    if (val) {
                        // 表单中的值发生了改变
                        this.isUpdateOtherCostFlag = true
                    }
                },
                deep: true// 深度监听
            }
        },
        created() {
            if (this.$history.currentRoute.query.originContractId) {
                this.isModifyForm = true
            }
            if (Number(this.$history.currentRoute.query.openType) == 1) {
                this.openHireByCreate()
            } else if (Number(this.$history.currentRoute.query.openType) == 2) {
                this.openAssetsByCreate()
            }
            this.queryByMark()
        },
        methods: {
            async queryByMark() {
                // 调用竞价书设置禁用字段
                if (Number(this.$history.currentRoute.query.openType) == 1) {
                    this.disabledField.push('assets_contract_info.tenement')
                    this.disabledField.push('assets_contract_info.id_card')
                    this.disabledField.push('assets_contract_info.contact_way')
                    this.disabledField.push('assets_contract_info.rent_period')
                    this.disabledField.push('assets_contract_info.month_rent')
                    this.disabledField.push('assets_contract_info.year_increase_rate')
                }
                this.loading = true
                const res = await this.$axios.get('jellyForm/queryByMark/' + this.$history.currentRoute.query.id)
                this.loading = false
                if (res.data.code == 200) {
                    // 变更表字段赋值
                    if (this.isModifyForm) {
                        await this.setFormByOriginContractId(this.$history.currentRoute.query.originContractId, 'assets_contract_modify')
                    } else {
                        this.getContractCode()
                    }

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

                var validFlag = false
                this.$refs.houseBillTableForm.validate(valid => {
                    if (!valid) {
                        this.$message.warning("请检查房租明细是否正确")
                        validFlag = false
                    } else {
                        validFlag = true
                    }
                })
                if (!validFlag) {
                    return
                }

                this.$refs.otherCostForm.validate(valid => {
                    if (!valid) {
                        this.$message.warning("请检查其它费用明细是否正确")
                        validFlag = false
                    } else {
                        validFlag = true
                    }
                })

                if (!validFlag) {
                    return
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

                if (this.houseBillTableForm.houseBillData.length > 0) {
                    params['houseBillList'] = JSON.stringify(this.houseBillTableForm.houseBillData)
                }
                if (this.otherCostForm.otherCostData.length > 0) {
                    params['otherCostList'] = JSON.stringify(this.otherCostForm.otherCostData)
                }
                params['isUpdateHouseBillFlag'] = this.isUpdateHouseBillFlag
                params['isUpdateOtherCostFlag'] = this.isUpdateOtherCostFlag

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
                params['isUpdateHouseBillFlag'] = this.isUpdateHouseBillFlag
                params['isUpdateOtherCostFlag'] = this.isUpdateOtherCostFlag

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

            // =================================================新增合同方法==============================
            // 打开资产弹窗
            openAssetsByCreate() {
                this.assetsVisible = true
                this.queryAssetsInfo()
            },
            async queryAssetsInfo() {
                let params = {
                    name: this.assetsSelectCondition.name,
                    pageNo: this.assetsPage.pageNo,
                    userId: localStorage.getItem('userId'),
                    pageSize: this.assetsPage.pageSize
                }
                this.loading = true
                let res = await this.$axios.get('cloud/entrance/pageIdleAssetsList', {params})
                this.loading = false
                if (res.data.code == 200) {
                    this.assetsPage.total = res.data.data.total
                    this.assetsSelectData = res.data.data.list
                } else {
                    this.$message.error(res.data.message)
                }
            },
            assetsHandleCurrentChange() {
                this.queryAssetsInfo()
            },
            assetsHandleSearch() {
                this.assetsPage.pageNo = 1
                this.queryAssetsInfo()
            },

            assetsCellDBClick(row, column, cell, event) {
                this.$set(this.formModel, 'assets_contract_info.mark_type', 2)
                this.$set(this.formModel, 'assets_contract_info.business_id', row.id)
                this.$set(this.formModel, 'assets_contract_info.assets_id', row.id)
                this.$set(this.formModel, 'assets_contract_info.assets_name', row.name)
                this.$set(this.formModel, 'assets_contract_info.manage_company_name', row.manageCompanyName)
                this.$set(this.formModel, 'assets_contract_info.sign_area', row.build_area)
                this.$set(this.formModel, 'assets_contract_info.area', row.build_area)

                this.assetsVisible = false
            },

            closeAssetsVisible() {
                this.assetsVisible = false
                this.$store.commit('worktabRemove', this.$history.currentRoute.fullPath)
            },

            assetsTypeFormatter(item) {
                if(item.type == 1) {
                    return '房屋及建筑物'
                } else if (item.type == 2) {
                    return '土地'
                } else if (item.type == 3) {
                    return '其他'
                } else {
                    return item.type
                }
            },


            // =================================================调用竞价书方法==============================
            // 打开调用竞价书弹窗
            openHireByCreate() {
                this.hireVisible = true
                this.queryHireInfo()
            },
            async queryHireInfo() {
                let params = {
                    name: this.hireSelectCondition.name,
                    pageNo: this.hirePage.pageNo,
                    pageSize: this.hirePage.pageSize
                }
                this.loading = true
                let res = await this.$axios.get('cloud/entrance/pageBiddingBookList', {params})
                this.loading = false
                if (res.data.code == 200) {
                    this.hirePage.total = res.data.data.total
                    this.hireSelectData = res.data.data.list
                } else {
                    this.$message.error(res.data.message)
                }
            },
            hireHandleCurrentChange() {
                this.queryHireInfo()
            },
            hireHandleSearch() {
                this.hirePage.pageNo = 1
                this.queryHireInfo()
            },

            hireCellDBClick(row, column, cell, event) {
                this.$set(this.formModel, 'assets_contract_info.mark_type', 1)
                this.$set(this.formModel, 'assets_contract_info.business_id', row.id)
                this.$set(this.formModel, 'assets_contract_info.assets_id', row.asset_id)
                this.$set(this.formModel, 'assets_contract_info.contact_way', row.winner_phone)
                this.$set(this.formModel, 'assets_contract_info.rent_period', row.lease_time)
                this.$set(this.formModel, 'assets_contract_info.sign_area', row.buildArea)
                this.$set(this.formModel, 'assets_contract_info.area', row.buildArea)
                this.$set(this.formModel, 'assets_contract_info.month_rent', row.final_price)
                this.$set(this.formModel, 'assets_contract_info.year_increase_rate', row.ndzl)
                this.$set(this.formModel, 'assets_contract_info.assets_name', row.assetsName)
                this.$set(this.formModel, 'assets_contract_info.manage_company_name', row.manageCompanyName)
                this.$set(this.formModel, 'assets_contract_info.rent_type', '1') // 招租方式：线上公开招投标
                this.$set(this.formModel, 'assets_contract_info.customer_type', row.winner_type ?  row.winner_type + "" : null)
                // 1: 个人; 2: 企业
                if (+row.winner_type === 1) {
                    this.$set(this.formModel, 'assets_contract_info.tenement', row.winner_name)
                    this.$set(this.formModel, 'assets_contract_info.id_card', row.winner_card)
                } else if (+row.winner_type === 2) {
                    this.$set(this.formModel, 'assets_contract_info.legal_name', row.winner_fr_name)
                    this.$set(this.formModel, 'assets_contract_info.tenement', row.winner_company)
                    this.$set(this.formModel, 'assets_contract_info.id_card', row.winner_fr_card)
                    this.$set(this.formModel, 'assets_contract_info.id_shehuicard', row.winner_xydm)
                }

                this.hireVisible = false
            },

            closeHireVisible() {
                this.hireVisible = false
                this.$store.commit('worktabRemove', this.$history.currentRoute.fullPath)
            },

            // 房租账单状态
            houseBillStatusFormatter(row) {
                if (row.status == 1) {
                    return '已收款'
                } else if (row.status == 2) {
                    return '未收款'
                } else if (row.status == 3) {
                    return '逾期'
                }
                return row.status
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

                this.setContractExpectAmount()
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
                this.setContractExpectAmount()
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

            getSummaries(param, summaryArray) {
                const { columns, data } = param
                const sums = []
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计'
                        return
                    }

                    if (summaryArray.indexOf(column.property) != -1) {
                        const values = data.map(item => item[column.property])
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr)
                                if (!isNaN(value)) {
                                    prev = this.$BigNumber(prev)
                                    return isNaN(Number(prev.plus(curr).toString())) ? '0.00' : Number(prev.plus(curr).toString()).toFixed(2)
                                } else {
                                    return isNaN(Number(prev)) ? '0.00' : Number(prev).toFixed(2)
                                }
                            }, 0)
                        } else {
                            sums[index] = ''
                        }
                    } else {
                        sums[index] = ''
                    }
                })
                return sums
            },

            // 获取房租明细
            getHouseBill(contractId) {
                let params = {
                    contractId: contractId
                }
                this.$axios.get('cloud/entrance/getContractHouseBill', { params }).then(res => {
                    if (res.data.code == 200) {
                        this.houseBillTableForm.houseBillData = res.data.data
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },

            // 获取其它费用明细
            getOtherCost(contractId) {
                let params = {
                    contractId: contractId
                }
                this.$axios.get('cloud/entrance/getContractOtherCost', { params }).then(res => {
                    if (res.data.code == 200) {
                        this.otherCostForm.otherCostData = res.data.data
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },

            // 设置表单数据
            async setFormByOriginContractId(contractId, tableName) {
                let params = {
                    id: contractId
                }
                this.loading = true
                const res = await this.$axios.get('cloud/entrance/getContractInfoById', { params })
                this.loading = false
                if (res.data.code === 200) {
                    this.getHouseBill(contractId)
                    this.getOtherCost(contractId)
                    this.isUpdateHouseBillFlag = true
                    this.isUpdateOtherCostFlag = true
                    let data = JSON.parse(JSON.stringify(res.data.data))
                    if (data) {
                        for (let key in data) {
                            if (key == 'id' && tableName === 'assets_contract_modify') {
                                this.$set(this.formModel, tableName + '.' + "origin_contract_id", data[key])
                            } else {
                                this.$set(this.formModel, tableName + '.' + key, data[key])
                            }
                        }
                    }
                } else {
                    this.$message.error(res.data.message)
                }
            },

            rounding(row,column) {
                if (!isNaN(Number(row[column.property]))) {
                    return Number(row[column.property]).toFixed(2)
                }
            },

            // 设置预期金额
            setContractExpectAmount() {
                let result = 0
                this.houseBillTableForm.houseBillData.forEach(item => {
                    result += item.amount ? Number(item.amount) : 0
                })
                if (this.isModifyForm) {
                    this.$set(this.formModel, 'assets_contract_modify.contract_expect_amount', result.toFixed(2))
                } else {
                    this.$set(this.formModel, 'assets_contract_info.contract_expect_amount', result.toFixed(2))
                }
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
