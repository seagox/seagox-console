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
        <!--费用明细-->
        <div style="margin-bottom: 20px">
            <el-tabs type="border-card">
                <el-tab-pane label="费用明细">
                    <el-button type="primary" size="small" icon="el-icon-plus" style="margin-bottom: 5px" @click="handleAddFee">新增</el-button>
                    <el-form :model="otherCostForm" ref="otherCostForm" size="small">
                        <el-table :data="otherCostForm.otherCostData" style="width: 100%">
                            <el-table-column prop="type" align="center" label="费用类型">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'otherCostData.' + scope.$index + '.type'">
                                        <el-select v-model="scope.row.type" @change="typeChange($event, scope.$index)" filterable placeholder="请选择费用类型">
                                            <el-option
                                                v-for="(item, index) in feeDetailList"
                                                :key="item.id"
                                                :label="item.typeName + ' - ' + item.amount"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="amount" align="center" label="收款金额">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'otherCostData.' + scope.$index + '.amount'">
                                        <el-input-number v-model="scope.row.amount" :controls="false" :precision="2"></el-input-number>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="75">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="handleDelFee(scope.$index)" size="small">删除</el-button>
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
                >暂存
                </el-button
                >
                <el-button
                    type="primary"
                    icon="el-icon-document-checked"
                    @click="submitForm"
                    :disabled="disableButtonFlag.submit"
                >提交
                </el-button
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
        <!--合同选择弹窗-->
        <el-dialog
            title="请选择"
            width="900px"
            append-to-body
            :visible.sync="ysVisible"
            :before-close="closeYsVisible"
            :close-on-click-modal="false"
        >
            <div>
                <el-form label-width="90px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="租户:">
                                <el-input
                                    v-model="ysSelectCondition.name"
                                    placeholder="请输入租户"
                                    clearable>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <div style="margin-left:15px;">
                                <el-button type="primary" icon="el-icon-search" @click.native="ysHandleSearch">查询</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="table">
                <!--列表-->
                <el-table
                    :data="ysSelectData"
                    border
                    stripe
                    max-height="450"
                    @cell-dblclick="ysCellDBClick">
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column prop="makeDate" label="订立日期" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="code" label="合同编号" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="tenement" label="租户" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="assetsName" label="资产名称" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" label="资产地址" align="center" show-overflow-tooltip></el-table-column>
                </el-table>
                <!--分页-->
                <div class="pagination">
                    <el-pagination
                        background
                        @current-change="ysHandleCurrentChange"
                        layout="total, prev, pager, next"
                        :current-page.sync="ysPage.pageNo"
                        :total="ysPage.total">
                    </el-pagination>
                </div>
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
                // 禁用字段
                disabledField: [],
                // 资产单位属性
                ysVisible: false,
                ysSelectCondition: {
                    name: null
                },
                ysSelectData: [],
                ysPage: {
                    pageNo: 1,
                    total: 0
                },
                _databaseId: null,
                contract: null,
                feeDetailList: [],
                otherCostForm: {
                    otherCostData: []
                }
            }
        },
        created() {
            this._databaseId = localStorage.getItem('_databaseId')
            if (this.$history.currentRoute.query.hasOwnProperty('openType') && this.$history.currentRoute.query.openType == 'form') {
                this.queryByMark()
            } else {
                this.openYsByCreate()
            }
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
                    if (this.$history.currentRoute.query.hasOwnProperty('openType') && this.$history.currentRoute.query.openType == 'form') {
                        this.initForm()
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
                // 房租集合
                if (this.otherCostForm.otherCostData.length > 0) {
                    params['houseBillList'] = JSON.stringify(this.otherCostForm.otherCostData)
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
                    this.$set(this.formModel, this.textModel.field, {type: 'word'})
                } else if (command === 'excel') {
                    // Excel正文
                    this.$set(this.formModel, this.textModel.field, {type: 'word'})
                } else if (command === 'pdf') {
                    // Pdf正文
                    this.$set(this.formModel, this.textModel.field, {type: 'pdf'})
                }
            },
            queryRentDetail(contract) {
                this.contract = contract
                let that = this
                let params = {
                    contract: contract,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/queryFeeDetail', params).then(res => {
                    if (res.data.code == 200) {
                        that.feeDetailList = res.data.data
                        if (that.feeDetailList.length == 0) {
                            that.$message.warning('该合同不存在未收费用！')
                        }
                    } else {
                        that.$message.error('费用明细查询失败！')
                    }
                })
            },
            // 新增费用明细
            handleAddFee() {
                if (this.feeDetailList.length == 0) {
                    this.$message.warning('该合同不存在未收费用！')
                    return
                }
                this.otherCostForm.otherCostData.push({
                    id: this.feeDetailList[0].id,
                    type: this.feeDetailList[0].typeName + ' - ' +this.feeDetailList[0].amount,
                    amount: this.feeDetailList[0].amount,
                    oldAmount: this.feeDetailList[0].oldAmount,
                    name: this.feeDetailList[0].name,
                    receipt_date: this.formModel['assets_receipts_info.receipts_date'],
                    contract: this.contract,
                })
            },
            // 删除费用明细
            handleDelFee(index) {
                this.otherCostForm.otherCostData.splice(index, 1)
            },
            typeChange(val, index) {
                this.feeDetailList.forEach(item => {
                    if (item.id === val) {
                        this.$set(this.otherCostForm.otherCostData[index], 'amount', item.amount)
                        this.$set(this.otherCostForm.otherCostData[index], 'name', item.name)
                        this.$set(this.otherCostForm.otherCostData[index], 'oldAmount', item.oldAmount)
                    }
                })
            },
            // =================================================新增应收单==============================
            // 打开合同弹窗
            openYsByCreate() {
                this.ysVisible = true
                this.queryHtInfo()
            },
            async queryHtInfo() {
                let params = {
                    name: this.ysSelectCondition.name,
                    pageNo: this.ysPage.pageNo,
                    pageSize: 10,
                    _databaseId: this._databaseId
                }
                this.loading = true
                let res = await this.$axios.get('cloud/authority/queryYsHtList', {params})
                this.loading = false
                if (res.data.code == 200) {
                    this.ysPage.total = res.data.data.total
                    this.ysSelectData = res.data.data.list
                } else {
                    this.$message.error(res.data.message)
                }
            },
            ysHandleCurrentChange() {
                this.queryHtInfo()
            },
            ysHandleSearch() {
                this.ysPage.pageNo = 1
                this.queryHtInfo()
            },
            ysCellDBClick(row, column, cell, event) {
                this.queryRentDetail(row.id)
                this.$set(this.formModel, 'assets_receipts_info.contract', row.id)
                if (row.address) {
                    this.$set(this.formModel, 'assets_receipts_info.remarks', row.assetsName + ';' + row.address + ';' + row.code)
                } else {
                    this.$set(this.formModel, 'assets_receipts_info.remarks', row.assetsName + ';' + row.code)
                }
                this.queryByMark()
                this.ysVisible = false
            },
            closeYsVisible() {
                this.ysVisible = false
                this.$store.commit('worktabRemove', this.$history.currentRoute.fullPath)
            },
            // 初始化数据
            initForm() {
                let query = this.$history.currentRoute.query
                this.$set(this.formModel, 'assets_receipts_info.type', query.type)
                this.$set(this.formModel, 'assets_receipts_info.contract', query.contract + '')
                this.$set(this.formModel, 'assets_receipts_info.receipts_company', query.receiptsCompany)
                this.$set(this.formModel, 'assets_receipts_info.receipts_bank', query.receiptsBank)
                this.$set(this.formModel, 'assets_receipts_info.receipts_account', query.receiptsAccount)
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
