<template>
    <div class="container" v-loading="loading">
        <div>
            <el-form ref="refundForm" :model="refundForm" label-width="100px" size="small">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="日期" prop="fill_date">
                            <el-date-picker
                                disabled
                                v-model="refundForm.fill_date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                align="center"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="结算方式" prop="settlement_method">
                            <el-select v-model="refundForm.settlementMethod" disabled clearable filterable>
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
                                disabled
                                v-model="refundForm.refund_date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                align="center"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="退款账户" prop="refund_account">
                            <el-input v-model.trim="refundForm.refund_account" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="合同编号" prop="contractCode">
                            <el-input v-model.trim="refundForm.contractCode" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="资产名称" prop="assets_name">
                            <el-input v-model.trim="refundForm.assets_name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="退款费用类型" prop="typeNames">
                            <el-input v-model.trim="refundForm.typeNames" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="退款金额" prop="amount">
                            <el-input v-model.trim="refundForm.amount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="账户户名" prop="account_name">
                            <el-input v-model.trim="refundForm.account_name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="开户银行" prop="bank">
                            <el-input v-model.trim="refundForm.bank" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="银行账户" prop="bank_account">
                            <el-input v-model.trim="refundForm.bank_account" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model.trim="refundForm.remark" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
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
                    detailData: null,
                    settlementMethod: null,
                    contractCode: null,
                    assets_name: null,
                    typeNames: null,
                    amount: null,
                    account_name: null,
                    bank: null,
                    bank_account: null
                },
                settlement: [],
            }
        },
        created() {
            this.querySettlement()
            this.queryRefundFormDetail()
        },
        methods: {
            async querySettlement() {
                let res = await this.$axios.get('dictionaryDetail/queryByClassifyId/28')
                if (res.data.code == 200) {
                    this.settlement = res.data.data
                }
            },
            // 查询审核通过的申请退款单
            queryRefundFormDetail() {
                let that = this
                let params = {
                    infoId: this.$history.currentRoute.query.id,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/queryRefundFormDetail', params).then(res => {
                    if (res.data.code == 200) {
                        that.refundForm = res.data.data
                    } else {
                        that.$message.error('查询失败！')
                    }
                })
            },
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