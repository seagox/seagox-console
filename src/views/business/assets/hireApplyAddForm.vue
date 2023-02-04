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
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddDetail">新增</el-button>
            <el-form :model="detailTableForm" ref="detailTableForm" :rules="detailRules" size="small">
                <el-table
                        :data="detailTableForm.detailData"
                        border
                        stripe
                        style="width: 100%">
                    <el-table-column fixed align="center" label="序号" type="index" width="50"></el-table-column>
                    <el-table-column fixed align="center" label="资产名称" prop="assets_name" width="200"></el-table-column>
                    <el-table-column align="center" label="资产坐落" prop="location" width="200"></el-table-column>
                    <el-table-column align="center" label="原产权单位" prop="owner" width="200"></el-table-column>
                    <el-table-column align="center" label="建筑面积（㎡）" prop="build_area" width="180"></el-table-column>
                    <el-table-column align="center" label="使用面积（㎡）" prop="use_area" width="180"></el-table-column>
                    <el-table-column align="center" label="土地面积（㎡）" prop="land_area" width="180"></el-table-column>
                    <el-table-column align="center" label="原承租户名称" prop="original_tenant_name" width="200">
                        <template slot-scope="scope">
                            <el-form-item :prop="'detailData.' + scope.$index + '.original_tenant_name'" :rules="detailRules.original_tenant_name">
                                <el-input type="textarea" v-model="scope.row.original_tenant_name" clearable placeholder="请输入原承租户名称"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="原租赁用途" prop="original_use" width="200">
                        <template slot-scope="scope">
                            <el-form-item :prop="'detailData.' + scope.$index + '.original_use'" :rules="detailRules.original_use">
                                <el-input type="textarea" v-model="scope.row.original_use" clearable placeholder="请输入原租赁用途"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="限制用途或经营范围" prop="remark" width="300"></el-table-column>
                    <el-table-column align="center" label="起拍保底价（元/月）" prop="starting_price" width="160">
                        <template slot-scope="scope">
                            <el-form-item :prop="'detailData.' + scope.$index + '.starting_price'" :rules="detailRules.starting_price">
                                <el-input-number v-model="scope.row.starting_price" :controls="false" :precision="2" placeholder="请输入起拍保底价"></el-input-number>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="租赁期限（月）" prop="lease_time" width="200">
                        <template slot-scope="scope">
                            <el-form-item :prop="'detailData.' + scope.$index + '.lease_time'" :rules="detailRules.lease_time">
                                <el-input-number v-model="scope.row.lease_time" :controls="false" :precision="0" placeholder="请输入租赁期限（月）"></el-input-number>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="其它要求" prop="other_require" width="300">
                        <template slot-scope="scope">
                            <el-form-item>
                                <el-input type="textarea" v-model="scope.row.other_require" clearable placeholder="请输入其它要求"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="75">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleDelDetail(scope.$index)" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
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
                        :show-header="true"
                        :max-height="450"
                        @selection-change="handleApproveOptionalChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="全选" prop="name"></el-table-column>
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
                        @selection-change="assetsHandleSelectionChange"
                        max-height="450">
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column
                            type="selection"
                            width="50"
                            align="center">
                    </el-table-column>
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
                <div slot="footer" class="dialog-footer" style="text-align: right; margin-top: 20px">
                    <el-button @click="closeAssetsVisible">取消</el-button>
                    <el-button type="primary" @click="assetsConfirm">确定</el-button>
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
                assetsMultipleSelection: [],

                detailTableForm: {
                    detailData: []
                },
                detailRules: {
                    starting_price: [{ required: true, message: '请输入起拍保底价', trigger: 'blur' }],
                    lease_time: [{ required: true, message: '请输入租赁期限', trigger: 'blur' }],
                    original_tenant_name: [{ max: 30, message: '原承租户名称不超过30个字符', trigger: 'blur' }],
                    original_use: [{ max: 30, message: '原租赁用途不超过30个字符', trigger: 'blur' }],
                },

                // 是否更新招租明细
                isUpdateDetailFlag: false,
            }
        },

        watch: {
            // 监听编辑是否有修改 - detailTableForm
            detailTableForm: {
                handler(val) {
                    if (val) {
                        this.isUpdateDetailFlag = true
                    }

                },
                deep: true// 深度监听
            }
        },

        created() {
            this.openAssetsByCreate()
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

                if (this.detailTableForm.detailData.length > 0) {
                    params['detailList'] = JSON.stringify(this.detailTableForm.detailData)
                }
                params['isUpdateDetailFlag'] = this.isUpdateDetailFlag

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
                this.$refs.detailTableForm.validate(valid => {
                    if (!valid) {
                        this.$message.warning("请检查资产明细是否正确")
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

                if (this.detailTableForm.detailData.length > 0) {
                    params['detailList'] = JSON.stringify(this.detailTableForm.detailData)
                }
                params['isUpdateDetailFlag'] = this.isUpdateDetailFlag

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

                if (this.detailTableForm.detailData.length > 0) {
                    params['detailList'] = JSON.stringify(this.detailTableForm.detailData)
                }
                params['isUpdateDetailFlag'] = this.isUpdateDetailFlag

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
                let excludeIds = this.detailTableForm.detailData.map(item => {return item.assets_id}).join()
                let params = {
                    name: this.assetsSelectCondition.name,
                    excludeIds: excludeIds,
                    pageNo: this.assetsPage.pageNo,
                    pageSize: this.assetsPage.pageSize
                }
                this.loading = true
                let res = await this.$axios.get('cloud/entrance/getXzAndDqAssetsList', {params})
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

            assetsConfirm() {
                let obj
                this.assetsMultipleSelection.forEach(item => {
                    obj = {}
                    obj.assets_id = item.id
                    obj.assets_name = item.name
                    obj.location = item.location
                    obj.owner = item.owner
                    obj.build_area = item.build_area
                    obj.use_area = item.use_area
                    obj.land_area = item.land_area
                    obj.remark = item.remark
                    this.detailTableForm.detailData.push(obj)
                })
                this.assetsVisible = false
            },


            closeAssetsVisible() {
                this.assetsVisible = false
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

            assetsHandleSelectionChange(value) {
                this.assetsMultipleSelection = value
            },

            // =================================================明细操作方法==============================
            // 打开资产弹窗
            handleAddDetail() {
                this.openAssetsByCreate()
            },

            handleDelDetail(index) {
                this.detailTableForm.detailData.splice(index, 1)
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
