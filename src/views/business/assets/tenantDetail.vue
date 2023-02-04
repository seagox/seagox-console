<template>
    <div>
        <div class="font-class">
            基本信息
        </div>
        <div>
            <el-form
                style="margin-top: 10px"
                :model="baseForm"
                label-width="100px"
                ref="detailForm"
                :inline="true"
                class="demo-form-inline">
                <el-row>
                    <el-form-item prop="code" label="编码">
                        <el-input v-model.trim="baseForm.code" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="tenement" label="名称">
                        <el-input v-model.trim="baseForm.tenement" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="customer_type" label="用户类型">
                        <el-input v-if="baseForm.customer_type == 2" value="企业" disabled></el-input>
                        <el-input v-else value="个人" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="createTime" label="创建日期">
                        <el-input v-model.trim="baseForm.createTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="grade" label="用户等级">
                        <el-input value="普通用户" disabled></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div class="font-class">
            联系信息
        </div>
        <div class="cur-table-class">
            <el-table :data="contactTable" border highlight-current-row stripe>
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机" align="center"></el-table-column>
                <el-table-column prop="email" label="电子邮箱" align="center"></el-table-column>
                <el-table-column prop="is_default" label="默认联系人" align="center">
                    <template slot-scope="scope">
                        {{scope.row.is_default == 1 ? "是" : "否"}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="font-class">
            关联资产
        </div>
        <div class="cur-table-class">
            <el-table :data="assetsTable" border highlight-current-row stripe>
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="assets_name" label="资产名称" align="center"></el-table-column>
                <el-table-column prop="start_date" label="合同开始日期" align="center"></el-table-column>
                <el-table-column prop="end_date" label="合同结束日期" align="center"></el-table-column>
                <el-table-column prop="assetsStatus" label="状态" align="center">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="font-class">
            银行账户
        </div>
        <div class="cur-table-class">
            <el-table :data="bankTable" border highlight-current-row stripe>
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="account_name" label="账户户名" align="center"></el-table-column>
                <el-table-column prop="bank" label="开户银行" align="center"></el-table-column>
                <el-table-column prop="bank_account" label="银行账号" align="center"></el-table-column>
            </el-table>
        </div>
        <div class="font-class" v-if="baseForm.customer_type == 1">
            身份信息（个人）
        </div>
        <div v-if="baseForm.customer_type == 1">
            <el-form
                style="margin-top: 10px"
                :model="baseForm"
                label-width="130px"
                ref="detailForm"
                :inline="true"
                class="demo-form-inline">
                <el-row>
                    <el-form-item prop="tenement" label="姓名">
                        <el-input v-model.trim="baseForm.tenement" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="id_card" label="身份证">
                        <el-input v-model.trim="baseForm.id_card" disabled></el-input>
                    </el-form-item>
                    <div>
                        <el-form-item label="证件图片">
                            <el-upload class="avatar-uploader"
                                       v-if="baseForm.winner_yyzz"
                                       :action="''"
                                       :auto-upload="false"
                                       :show-file-list="false">
                                <img :src="baseForm.winner_idcard_z" class="avatar">
                            </el-upload>
                            <el-upload class="avatar-uploader"
                                       v-if="baseForm.winner_yyzz"
                                       :action="''"
                                       :auto-upload="false"
                                       :show-file-list="false">
                                <img :src="baseForm.winner_idcard_f" class="avatar">
                            </el-upload>
                        </el-form-item>
                    </div>
                </el-row>
            </el-form>
        </div>
        <div class="font-class" v-if="baseForm.customer_type == 2">
            身份信息（企业）
        </div>
        <div v-if="baseForm.customer_type == 2">
            <el-form
                style="margin-top: 10px"
                :model="baseForm"
                label-width="130px"
                ref="detailForm"
                :inline="true"
                class="demo-form-inline">
                <el-row>
                    <el-form-item prop="tenement" label="企业名称">
                        <el-input v-model.trim="baseForm.tenement" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="id_shehuicard" label="统一社会信用代码">
                        <el-input v-model.trim="baseForm.id_shehuicard" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="legal_name" label="法人名称">
                        <el-input v-model.trim="baseForm.legal_name" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="id_card" label="法人身份证号">
                        <el-input v-model.trim="baseForm.id_card" disabled></el-input>
                    </el-form-item>
                    <div>
                        <el-form-item label="证件图片">
                            <el-upload class="avatar-uploader"
                                       v-if="baseForm.winner_idcard_f"
                                       :action="''"
                                       :auto-upload="false"
                                       :show-file-list="false">
                                <img :src="baseForm.winner_yyzz" class="avatar">
                            </el-upload>
                            <el-upload class="avatar-uploader"
                                       v-if="baseForm.winner_idcard_f"
                                       :action="''"
                                       :auto-upload="false"
                                       :show-file-list="false">
                                <img :src="baseForm.winner_idcard_z" class="avatar">
                            </el-upload>
                            <el-upload class="avatar-uploader"
                                       v-if="baseForm.winner_idcard_f"
                                       :action="''"
                                       :auto-upload="false"
                                       :show-file-list="false">
                                <img :src="baseForm.winner_idcard_f" class="avatar">
                            </el-upload>
                        </el-form-item>
                    </div>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                _databaseId: null,
                baseForm: {
                    code: null,
                    tenement: null,
                    customer_type: null,
                    createTime: null,
                    grade: null,
                    id_card: null,
                    id_shehuicard: null,
                    legal_name: null,
                },
                contactTable: [],
                assetsTable: [],
                bankTable: [],
            }
        },
        created() {
            this._databaseId = localStorage.getItem('_databaseId')
            this.queryByDetail()
        },
        methods: {
            queryByDetail() {
                let that = this
                let params = {
                    contractIds: this.$history.currentRoute.query.contractIds,
                    assetsIds: this.$history.currentRoute.query.assetsIds,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/queryTenantDetail', params).then(res => {
                    if (res.data.code == 200) {
                        this.baseForm = res.data.data.baseDetail
                        this.contactTable = res.data.data.contactList
                        this.assetsTable = res.data.data.assetsList
                        this.bankTable = res.data.data.accountList
                    } else {
                        that.$message.error('查询失败！')
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .font-class {
        margin-top: 10px;
        margin-bottom: 5px;
        height: 40px;
        width: 100%;
        background-color: #9CC2E6;
        line-height: 40px;
        text-indent: 2em
    }

    .cur-table-class {
        padding-left: 20px;
        padding-right: 20px;
    }

    .avatar {
        width: 500px;
        height: 300px;
    }
</style>