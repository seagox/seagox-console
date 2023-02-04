<template>
    <div class="container" v-loading="loading">
        <div>
            <el-form ref="refundForm" :model="refundForm" label-width="100px" :rules="formRules" size="small">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="日期" prop="fill_date">
                            <el-date-picker
                                v-model="refundForm.fill_date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                align="center"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="结算方式" prop="settlement_method">
                            <el-select v-model="refundForm.settlement_method" clearable filterable placeholder="请选择结算方式">
                                <el-option
                                    v-for="item in settlement"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="退款日期" prop="refund_date">
                            <el-date-picker
                                v-model="refundForm.refund_date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                align="center"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="退款账户" prop="refund_account">
                            <el-input v-model.trim="refundForm.refund_account" placeholder="请输入退款账户"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model.trim="refundForm.remark" placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!--退款申请单-->
        <div style="margin-bottom: 20px">
            <el-tabs type="border-card">
                <el-tab-pane label="退款申请单">
                    <el-form :model="applicationForm" ref="applicationForm" size="small">
                        <el-table
                            :data="applicationForm.detailData"
                            show-summary
                            :summary-method="getSummaries"
                            style="width: 100%">
                            <el-table-column prop="contractCode" align="center" label="合同编号"></el-table-column>
                            <el-table-column prop="assets_name" align="center" label="资产名称"></el-table-column>
                            <el-table-column prop="typeNames" align="center" label="退款费用类型"></el-table-column>
                            <el-table-column prop="amount" align="center" label="退款金额"></el-table-column>
                            <el-table-column prop="account_name" align="center" label="账户户名"></el-table-column>
                            <el-table-column prop="bank" align="center" label="开户银行"></el-table-column>
                            <el-table-column prop="bank_account" align="center" label="银行账户"></el-table-column>
                            <el-table-column label="操作" align="center" width="200">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="showDetail(scope.row)">详情</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>

        <div class="footer">
            <div class="footer-right">
                <el-button type="primary" icon="el-icon-document-checked" @click="submitForm">提交</el-button>
            </div>
        </div>

        <!--退款申请单弹窗-->
        <el-dialog
            title="请选择"
            width="1000px"
            :visible.sync="applicationVisible"
            :before-close="beforeClose"
            :close-on-click-modal="false">
            <div class="table">
                <el-button type="primary" icon="el-icon-check" @click.native="HandleChoose" size="small" style="float: right;margin-bottom: 10px">确定</el-button>
                <el-table
                    :data="applicationData"
                    @selection-change="handleSelectionChange"
                    border
                    highlight-current-row
                    stripe
                    max-height="500">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="contractCode" label="合同编号" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="identifier" label="单据编号" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="assets_name" label="资产名称" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="account_name" label="账户户名" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="bank" label="开户银行" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="bank_account" label="银行账号" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="amount" label="退款总金额" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reason" label="申请退款原因" align="center" show-overflow-tooltip></el-table-column>
                </el-table>
                <!--分页-->
                <div class="pagination">
                    <el-pagination
                        background
                        @current-change="applicationHandleCurrentChange"
                        layout="total, prev, pager, next"
                        :current-page.sync="applicationPage.pageNo"
                        :total="applicationPage.total">
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
                loading: false,
                refundForm: {
                    fill_date: null,
                    settlement_method: null,
                    refund_account: null,
                    refund_date: null,
                    detailData: null
                },
                settlement: [],
                formRules: {
                    fill_date: [{required: true, message: '请选择日期类型', trigger: 'change'}],
                    refund_date: [{required: true, message: '请选择日期类型', trigger: 'change'}],
                    settlement_method: [{required: true, message: '请选择结算方式', trigger: 'change'}],
                    refund_account: [{required: true, message: '请输入退款日期', trigger: 'blur'}]
                },
                applicationForm: {
                    detailData: []
                },
                applicationVisible: false,
                applicationData: [],
                selectValues: [],
                applicationPage: {
                    pageNo: 1,
                    total: 0
                }
            }
        },
        created() {
            this._databaseId = localStorage.getItem('_databaseId')
            this.querySettlement()
            this.queryRefundApplication()
        },
        methods: {
            async querySettlement() {
                let res = await this.$axios.get('dictionaryDetail/queryByClassifyId/28')
                if (res.data.code == 200) {
                    this.settlement = res.data.data
                }
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (index === 3) {
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
                            sums[index] = sums[index].toFixed(2) + ' 元';
                        } else {
                            sums[index] = 'N/A';
                        }
                    }
                })
                return sums;
            },
            showDetail(row) {
                this.$history.push({
                    path: '/runCode',
                    query: {
                        id: row.id,
                        formId: 29,
                        path: 'refundApplicationView',
                        title: '退款申请单详情'
                    }
                })
            },
            // 查询审核通过的申请退款单
            queryRefundApplication() {
                let that = this
                let params = {
                    pageNo: this.applicationPage.pageNo,
                    pageSize: this.applicationPage.pageSize,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/queryApproved', params).then(res => {
                    if (res.data.code == 200) {
                        that.applicationData = res.data.data.list
                        that.applicationPage.total = res.data.data.total
                    } else {
                        that.$message.error('查询失败！')
                    }
                })
                this.applicationVisible = true
            },
            // 退款申请单翻页
            applicationHandleCurrentChange() {
                this.queryRefundApplication()
            },
            beforeClose() {
                this.applicationVisible = false
                this.$store.commit('worktabRemove', this.$history.currentRoute.fullPath)
            },
            handleSelectionChange(val) {
                this.selectValues = val
            },
            // 确定
            HandleChoose() {
                this.applicationVisible = false
                this.applicationForm.detailData = this.selectValues
            },
            // 提交
            submitForm() {
                this.$refs.refundForm.validate(valid => {
                    if (valid) {
                        this.refundForm.detailData = JSON.stringify(this.applicationForm.detailData)
                        let that = this
                        that.$axios.post('/cloud/entrance/insertRefund', this.refundForm).then(res => {
                            if (res.data.code == 200) {
                                this.$message.success('新增成功！')
                                that.$store.commit('worktabRemove', that.$history.currentRoute.fullPath)
                            } else {
                                this.$message.error('新增失败！')
                            }
                        })
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