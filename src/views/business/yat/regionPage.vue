<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-plus" @click="handleAddStreetDialog" size="small">新增街道</el-button>
            <el-button type="text" icon="el-icon-plus" @click="handleAddCommunityDialog" size="small">新增社区</el-button>
        </div>
        <div class="table">
            <!--列表-->
            <el-table
                border
                stripe
                row-key="key"
                :data="tableData"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                highlight-current-row>
                <el-table-column type="index" label="#" width="80" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="left" show-overflow-tooltip></el-table-column>
                <el-table-column prop="type" label="类别" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleUpdateDialog(scope.row)">修改</el-button>
                        <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="新增街道" width="500px" :visible.sync="streetVisible" :close-on-click-modal="false">
            <el-form :model="streetForm" :rules="formRules" ref="streetForm">
                <el-form-item prop="name" label="街道名称">
                    <el-input v-model.trim="streetForm.name" placeholder="请输入街道名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="streetVisible = false">取消</el-button>
                <el-button type="primary" @click="HandleSubmitStreet">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="更新街道" width="500px" :visible.sync="streetUpdateVisible" :close-on-click-modal="false">
            <el-form :model="streetUpdateForm" :rules="formRules" ref="streetUpdateForm">
                <el-form-item prop="name" label="街道名称">
                    <el-input v-model.trim="streetUpdateForm.name" placeholder="请输入街道名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="streetUpdateVisible = false">取消</el-button>
                <el-button type="primary" @click="HandleUpdateStreet">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新增社区" width="500px" :visible.sync="communityVisible" :close-on-click-modal="false">
            <el-form :model="communityForm" :rules="formRules" ref="communityForm">
                <el-form-item prop="street_id" label="街道名称">
                    <el-select
                        filterable
                        v-model="communityForm.street_id"
                        placeholder="情选择街道">
                        <el-option
                            v-for="item in streetList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="社区名称">
                    <el-input
                        v-model.trim="communityForm.name"
                        :disabled="!communityForm.street_id"
                        placeholder="请输入街道名称">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="communityVisible = false">取消</el-button>
                <el-button type="primary" @click="HandleSubmitCommunity">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="更新社区" width="500px" :visible.sync="communityUpdateVisible" :close-on-click-modal="false">
            <el-form :model="communityUpdateForm" :rules="formRules" ref="communityUpdateForm">
                <el-form-item prop="street_id" label="街道名称">
                    <el-select disabled v-model="communityUpdateForm.street_id" placeholder="情选择街道">
                        <el-option
                            v-for="item in streetList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="社区名称">
                    <el-input
                        v-model.trim="communityUpdateForm.name"
                        :disabled="!communityUpdateForm.street_id"
                        placeholder="请输入街道名称">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="communityUpdateVisible = false">取消</el-button>
                <el-button type="primary" @click="HandleUpdateCommunity">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                streetList: [],
                streetForm: {
                    name: null
                },
                communityForm: {
                    street_id: null,
                    name: null
                },
                streetUpdateForm: {
                    id: null,
                    name: null
                },
                communityUpdateForm: {
                    id: null,
                    street_id: null,
                    name: null
                },
                formRules: {
                    name: [
                        {required: true, message: '请输入街道名称', trigger: 'blur'},
                        {max: 30, message: '请输入30个以内字符', trigger: 'blur'}
                    ],
                    street_id: [{required: true, message: '请选择街道', trigger: 'change'}],
                },
                streetVisible: false,
                streetUpdateVisible: false,
                communityVisible: false,
                communityUpdateVisible: false,
            }
        },
        created() {
            this.queryList()
            this.queryStreet()
        },
        methods: {
            // 查询地区
            queryList() {
                let that = this
                that.$axios.post('/cloud/entrance/queryRegion').then(res => {
                    if (res.data.code == 200) {
                        that.tableData = res.data.data
                    } else {
                        that.$message.error('查询失败！')
                    }
                })
            },
            // 查询街道
            queryStreet() {
                this.$axios.get('/cloud/entrance/queryStreet').then(res => {
                    if (res.data.code == 200) {
                        this.streetList = res.data.data
                    }
                })
            },
            // 街道新增弹窗
            handleAddStreetDialog() {
                this.streetVisible = true
                if (this.$refs.streetForm) {
                    this.$refs.streetForm.resetFields()
                }
            },
            // 提交新增街道
            HandleSubmitStreet() {
                this.$refs.streetForm.validate(valid => {
                    if (valid) {
                        let that = this
                        that.$axios.post('/cloud/entrance/addStreet', that.streetForm).then(res => {
                            if (res.data.code == 200) {
                                this.queryList()
                                this.queryStreet()
                                this.streetVisible = false
                            } else {
                                that.$message.error('新增失败，' + res.data.message)
                            }
                        })
                    }
                })
            },
            // 社区新增弹窗
            handleAddCommunityDialog() {
                this.communityVisible = true
                if (this.$refs.communityForm) {
                    this.$refs.communityForm.resetFields()
                }
            },
            // 提交新增社区
            HandleSubmitCommunity() {
                this.$refs.communityForm.validate(valid => {
                    if (valid) {
                        let that = this
                        that.$axios.post('/cloud/entrance/addCommunity', that.communityForm).then(res => {
                            if (res.data.code == 200) {
                                this.queryList()
                                this.communityVisible = false
                            } else {
                                that.$message.error('新增失败，' + res.data.message)
                            }
                        })
                    }
                })
            },
            // 修改弹窗
            handleUpdateDialog(row) {
                if (row.street_id) {
                    // 修改社区
                    this.communityUpdateVisible = true
                    if (this.$refs.communityUpdateForm) {
                        this.$refs.communityUpdateForm.resetFields()
                    }
                    this.communityUpdateForm = Object.assign({}, row)
                } else {
                    // 修改街道
                    this.streetUpdateVisible = true
                    if (this.$refs.streetUpdateForm) {
                        this.$refs.streetUpdateForm.resetFields()
                    }
                    this.streetUpdateForm = Object.assign({}, row)
                }
            },
            // 修改街道提交
            HandleUpdateStreet() {
                this.$refs.streetUpdateForm.validate(valid => {
                    if (valid) {
                        let that = this
                        let params = {
                            id: that.streetUpdateForm.id,
                            name: that.streetUpdateForm.name
                        }
                        that.$axios.post('/cloud/entrance/updateStreet', params).then(res => {
                            if (res.data.code == 200) {
                                this.queryList()
                                this.streetUpdateVisible = false
                            } else {
                                that.$message.error('更新失败，' + res.data.message)
                            }
                        })
                    }
                })
            },
            // 修改社区提交
            HandleUpdateCommunity() {
                this.$refs.communityUpdateForm.validate(valid => {
                    if (valid) {
                        let that = this
                        let params = {
                            id: that.communityUpdateForm.id,
                            name: that.communityUpdateForm.name,
                            street_id: that.communityUpdateForm.street_id,
                        }
                        that.$axios.post('/cloud/entrance/updateCommunity', params).then(res => {
                            if (res.data.code == 200) {
                                this.queryList()
                                this.communityUpdateVisible = false
                            } else {
                                that.$message.error('更新失败，' + res.data.message)
                            }
                        })
                    }
                })
            },
            // 删除
            handleDelete(row) {
                this.$confirm('确定删除？', '提示', {type: 'warning'}).then(() => {
                    let params = {
                        id: row.id
                    }
                    if (row.street_id) {
                        // 删除社区
                        this.$axios.post('/cloud/entrance/deleteCommunity', params).then(res => {
                            if (res.data.code == 200) {
                                this.queryList()
                                this.$message.success('删除成功！')
                            } else {
                                this.$message.error('删除失败，' + res.data.message)
                            }
                        })
                    } else {
                        // 删除街道
                        this.$axios.post('/cloud/entrance/deleteStreet', params).then(res => {
                            if (res.data.code == 200) {
                                this.queryList()
                                this.$message.success('删除成功！')
                            } else {
                                this.$message.error('删除失败，' + res.data.message)
                            }
                        })
                    }
                })
            }
        }
    }
</script>
