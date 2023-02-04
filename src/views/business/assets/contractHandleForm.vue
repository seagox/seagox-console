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

            <div style="margin-bottom: 20px">
                <el-tabs type="border-card" v-if="flowFlag === 1 && temporaryStorage">
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

                <el-tabs type="border-card" v-else>
                    <el-tab-pane label="房租">
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
                                    :formatter="houseBillTypeFormatter"
                                    label="收款类型">
                            </el-table-column>
                            <el-table-column
                                    prop="start_date"
                                    align="center"
                                    label="开始日期">
                            </el-table-column>
                            <el-table-column
                                    prop="end_date"
                                    align="center"
                                    label="结束日期">
                            </el-table-column>
                            <el-table-column
                                    prop="amount"
                                    align="center"
                                    width="140"
                                    :formatter="rounding"
                                    label="收款金额">
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
                            </el-table-column>
                            <el-table-column
                                    prop="real_receipt_date"
                                    align="center"
                                    label="实际收款日期">
                            </el-table-column>
                            <el-table-column
                                    prop="status"
                                    align="center"
                                    label="状态"
                                    :formatter="houseBillStatusFormatter">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="其它费用">
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
                                    :formatter="otherCostTypeFormatter"
                                    label="费用类型">
                            </el-table-column>
                            <el-table-column
                                    prop="amount"
                                    align="center"
                                    :formatter="rounding"
                                    label="收款金额">
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
                                    label="实际收款日期">
                            </el-table-column>
                            <el-table-column
                                    prop="remark"
                                    align="center"
                                    label="备注">
                            </el-table-column>
                            <el-table-column
                                    prop="status"
                                    align="center"
                                    label="状态"
                                    :formatter="houseBillStatusFormatter">
                            </el-table-column>
                        </el-table>
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
                        v-if="flowStatus == 0"
                        type="primary"
                        icon="el-icon-edit"
                        @click="goModifyForm">变更</el-button>
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

                // 房租明细修改次数
                houseBillUpdateCount: 0,
                // 其它费用明细修改次数
                otherCostUpdateCount: 0,
                // 是否更新房租明细
                isUpdateHouseBillFlag: false,
                // 是否更新其它费用明细
                isUpdateOtherCostFlag: false,

                // 是否变更表单
                isModifyForm: false
            }
        },
        created() {
            if (+this.$history.currentRoute.query.formId === 35 || +this.$history.currentRoute.query.formId === 36) {
                this.isModifyForm = true
            }
            this.reportDetail()
            this.queryCommonWordsAll()

            this.getHouseBill()
            this.getOtherCost()
        },

        computed: {
            computedEndDate() {
                if (this.form['assets_contract_info.rent_period'] && this.form['assets_contract_info.start_date']) {
                    let endDate = this.moreDate(this.commonAddMouth(this.form['assets_contract_info.start_date'], this.form['assets_contract_info.rent_period'], 0), -1)
                    this.$set(this.form, 'assets_contract_info.end_date', endDate)
                    if (this.form['assets_contract_info.rent_period_type']) {
                        this.$set(this.form, 'assets_contract_info.total_period', Math.ceil(this.$BigNumber(this.form['assets_contract_info.rent_period']).div(this.form['assets_contract_info.rent_period_type'])))
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
                        if (this.houseBillUpdateCount > 0) {
                            this.isUpdateHouseBillFlag = true
                        }
                        this.houseBillUpdateCount ++
                    }

                },
                deep: true// 深度监听
            },

            // 监听编辑是否有修改 - otherCostForm
            otherCostForm: {
                handler(val) {
                    if (val) {
                        if (this.otherCostUpdateCount > 0) {
                            // 表单中的值发生了改变
                            this.isUpdateOtherCostFlag = true
                        }
                        this.otherCostUpdateCount ++
                    }
                },
                deep: true// 深度监听
            }
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

                if (this.houseBillTableForm.houseBillData.length > 0) {
                    params['houseBillList'] = JSON.stringify(this.houseBillTableForm.houseBillData)
                }
                if (this.otherCostForm.otherCostData.length > 0) {
                    params['otherCostList'] = JSON.stringify(this.otherCostForm.otherCostData)
                }
                params['isUpdateHouseBillFlag'] = this.isUpdateHouseBillFlag
                params['isUpdateOtherCostFlag'] = this.isUpdateOtherCostFlag

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

            getHouseBill() {
                let params = {
                    contractId: this.$history.currentRoute.query.id
                }
                this.$axios.get(this.isModifyForm ? 'cloud/entrance/getContractHouseBillModify' : 'cloud/entrance/getContractHouseBill', { params }).then(res => {
                    if (res.data.code == 200) {
                        this.houseBillTableForm.houseBillData = res.data.data
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },


            getOtherCost() {
                let params = {
                    contractId: this.$history.currentRoute.query.id
                }
                this.$axios.get(this.isModifyForm ? 'cloud/entrance/getContractOtherCostModify' : 'cloud/entrance/getContractOtherCost', { params }).then(res => {
                    if (res.data.code == 200) {
                        this.otherCostForm.otherCostData = res.data.data
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },

            // 生成房租账单
            handleCreateHouseBill() {
                let form = this.form
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

            houseBillTypeFormatter (item) {
                if(item.type == 1) {
                    return '首付款'
                } else if (item.type == 2) {
                    return '阶段款'
                } else {
                    return item.type
                }
            },

            otherCostTypeFormatter(item) {
                if(item.type == 1) {
                    return '押金'
                } else if (item.type == 2) {
                    return '保证金'
                } else {
                    return item.type
                }
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

            // 跳转到变更页面
            goModifyForm() {
                // 检查是否可以变更
                let params = {
                    contract_id: this.form['assets_contract_info.id']
                }
                this.loading = true
                this.$axios.get('cloud/entrance/contractCanModify', { params }).then(res => {
                    this.loading = false
                    if (res.data.code === 200) {
                        if (+this.$history.currentRoute.query.formId === 9) {
                            this.$history.push({
                                path: '/runCode',
                                query: {
                                    path: 'contractAddForm',
                                    id: 35, // 合同变更
                                    originContractId: this.form['assets_contract_info.id'],
                                    title: this.$history.currentRoute.query.title + '变更',
                                    time: new Date().getTime()
                                }
                            })
                        } else if (+this.$history.currentRoute.query.formId === 20) {
                            this.$history.push({
                                path: '/runCode',
                                query: {
                                    path: 'contractAddForm',
                                    id: 36, // 续租合同变更
                                    originContractId: this.form['assets_contract_info.id'],
                                    title: this.$history.currentRoute.query.title + '变更',
                                    time: new Date().getTime()
                                }
                            })
                        }
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
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
                    this.$set(this.form, 'assets_contract_modify.contract_expect_amount', result.toFixed(2))
                } else {
                    this.$set(this.form, 'assets_contract_info.contract_expect_amount', result.toFixed(2))
                }
            }
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
