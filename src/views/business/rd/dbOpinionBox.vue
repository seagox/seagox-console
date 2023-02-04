<template>
    <div>
        <div class="searchView">
            <el-form label-width="80px">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="年度">
                            <el-date-picker
                                v-model="searchForm.year"
                                placeholder="选择年"
                                type="year"
                                align="center"
                                value-format="yyyy"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="意见内容">
                            <el-input v-model="searchForm.content" clearable placeholder="请输入意见内容"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button
                            icon="el-icon-search"
                            style="margin-left:15px"
                            type="primary"
                            @click.native="handleSearch"
                            >查询
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="意见列表" name="first">
                    <hr />
                    <div class="toolView">
                        <el-button icon="el-icon-plus" size="small" type="text" @click="showAddDialog"
                            >发表意见</el-button
                        >
                    </div>
                    <el-table :data="opinionTableDataOne" border height="300" highlight-current-row stripe>
                        <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                        <el-table-column align="center" label="意见分类" prop="classifyName"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" label="意见内容" prop="content">
                            <template slot-scope="scope">
                                <el-link @click="showContent(scope.row.content)">{{ scope.row.content }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="意见类别" prop="category"></el-table-column>
                        <el-table-column align="center" label="代表姓名" prop="dbName"></el-table-column>
                        <el-table-column align="center" label="意见提交时间" prop="createTime"></el-table-column>
                        <el-table-column align="center" label="操作" width="185">
                            <template slot-scope="scope">
                                <el-link icon="el-icon-edit" @click="showEditDialog(scope.row, 'edit')"></el-link>
                                <el-link @click="deleteSubmit(scope.row)"><i class="el-icon-delete"></i></el-link>
                                <el-link @click="showEditDialog(scope.row, 'view')"
                                    ><i class="el-icon-view"></i>
                                </el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            :current-page.sync="pageNo"
                            :total="total"
                            background
                            layout="total, prev, pager, next"
                            @current-change="handleCurrentChange"
                        >
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="已反馈" name="second">
                    <hr />
                    <el-table
                        :data="opinionTableDataTwo"
                        border
                        height="300"
                        highlight-current-row
                        stripe
                        @row-click="handle"
                    >
                        <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                        <el-table-column align="center" label="意见分类" prop="classifyName"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" label="意见内容" prop="content">
                            <template slot-scope="scope">
                                <el-link @click="showContent(scope.row.content)">{{ scope.row.content }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="意见类别" prop="category"></el-table-column>
                        <el-table-column align="center" label="代表姓名" prop="dbName"></el-table-column>
                        <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
                        <el-table-column align="center" label="操作" width="185">
                            <template slot-scope="scope">
                                <el-link @click="showEditDialog(scope.row, 'view')"
                                    ><i class="el-icon-view"></i>
                                </el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            :current-page.sync="pageNo"
                            :total="total"
                            background
                            layout="total, prev, pager, next"
                            @current-change="handleCurrentChange"
                        >
                        </el-pagination>
                    </div>
                    <span>整改部门</span>
                    <hr />
                    <!--列表-->
                    <el-table :data="relLogTableData" border highlight-current-row stripe>
                        <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                        <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                        <el-table-column
                            :formatter="statusFormatter"
                            align="center"
                            label="完成情况"
                            prop="status"
                        ></el-table-column>
                        <el-table-column
                            :show-overflow-tooltip="true"
                            align="center"
                            label="反馈意见内容"
                            prop="feedbackContent"
                        >
                            <template slot-scope="scope">
                                <el-link @click="showContent(scope.row.feedbackContent)"
                                    >{{ scope.row.feedbackContent }}
                                </el-link>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="反馈提交时间" prop="updateTime"></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!--新增-->
        <el-dialog :close-on-click-modal="false" :visible.sync="addFormVisible" title="新增" width="850px">
            <el-form ref="addForm" :model="addForm" :rules="formRules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="代表姓名" prop="name">
                            <el-input v-model="addForm.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="基本构成" prop="jbgc">
                            <el-input v-model="addForm.jbgc" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="addForm.sex" disabled>
                                <el-option
                                    v-for="item in sexOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="addForm.phone" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="现任职务" prop="position">
                            <el-input v-model="addForm.position" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="所在单位" prop="departmentName">
                            <el-input v-model="addForm.departmentName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="意见分类" prop="OpinionClassify">
                            <el-select v-model="addForm.classifyId" placeholder="请选择">
                                <el-option
                                    v-for="item in classifyOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="具体意见" prop="content">
                            <el-input
                                v-model="addForm.content"
                                :autosize="{ minRows: 5, maxRows: 20 }"
                                placeholder="请输入内容"
                                type="textarea"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联名代表" prop="lmdb">
                            <el-button size="medium" type="primary" @click="handleDb">
                                添加代表
                            </el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-select v-model="addForm.jointly" disabled filterable multiple placeholder=" ">
                            <el-option v-for="item in dbTableData" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑-->
        <el-dialog :close-on-click-modal="false" :visible.sync="editFormVisible" title="编辑" width="850px">
            <el-form ref="editForm" :model="editForm" :rules="formRules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="代表姓名" prop="name">
                            <el-input v-model="editForm.userInfo.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="基本构成" prop="jbgc">
                            <el-input v-model="editForm.userInfo.jbgc" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="editForm.userInfo.sex" disabled>
                                <el-option
                                    v-for="item in sexOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="editForm.userInfo.phone" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="现任职务" prop="position">
                            <el-input v-model="editForm.userInfo.position" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="所在单位" prop="departmentName">
                            <el-input v-model="editForm.userInfo.departmentName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="意见分类" prop="OpinionClassify">
                            <el-select v-model="editForm.classifyId" placeholder="请选择">
                                <el-option
                                    v-for="item in classifyOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="具体意见" prop="content">
                            <el-input
                                v-model="editForm.content"
                                :autosize="{ minRows: 5, maxRows: 20 }"
                                placeholder="请输入内容"
                                type="textarea"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="viewVisible">
                        <el-form-item label="联名代表" prop="lmdb">
                            <el-button size="medium" type="primary" @click="handleDb">
                                添加代表
                            </el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18" v-if="viewVisible">
                        <el-select v-model="editForm.jointly" disabled filterable multiple placeholder=" ">
                            <el-option v-for="item in dbTableData" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="24" v-if="!viewVisible">
                        <el-form-item label="联名代表" prop="lmdb">
                            <el-select v-model="editForm.jointly" disabled filterable multiple placeholder=" ">
                                <el-option
                                    v-for="item in dbTableData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button v-if="viewVisible" type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showContentVisible" title="内容" width="500px">
            <el-input
                v-model="content"
                :autosize="{ minRows: 10, maxRows: 20 }"
                placeholder="请输入内容"
                type="textarea"
            >
            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showContentVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showDbVisible" title="联名代表" width="750px">
            <div class="searchView">
                <el-form label-width="80px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="代表姓名">
                                <el-input v-model="searchDbForm.name" clearable placeholder="请输入部门名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="代表团">
                                <el-input
                                    v-model="searchDbForm.delegation"
                                    clearable
                                    placeholder="请输入部门名称"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-button
                                icon="el-icon-search"
                                style="margin-left:15px"
                                type="primary"
                                @click.native="handleSearchDb"
                                >查询
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <el-table ref="multipleDbTable" :data="dbTableData" border height="300" highlight-current-row stripe>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                <el-table-column align="center" label="代表届次" prop="jieName"></el-table-column>
                <el-table-column align="center" label="代表证号" prop="delegateNo"></el-table-column>
                <el-table-column align="center" label="代表姓名" prop="name"></el-table-column>
                <el-table-column :formatter="sexFormatter" align="center" label="代表性别" prop="sex"></el-table-column>
                <el-table-column align="center" label="代表团" prop="delegation"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDbVisible = false">取消</el-button>
                <el-button type="primary" @click="relSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            _databaseId: '',
            userId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            pageNo: 1,
            total: 0,
            addFormVisible: false,
            addForm: {
                content: ''
            },
            editFormVisible: false,
            editForm: {
                id: null,
                content: '',
                classifyId: null,
                jointly: null,
                userInfo: {}
            },
            formRules: {
                content: [{ required: true, message: '请输入具体意见', trigger: 'blur' }]
            },
            searchForm: {
                year: '',
                content: ''
            },
            activeName: 'first',
            opinionTableDataOne: [],
            opinionTableDataTwo: [],
            classifyOptions: [],
            sexOptions: [
                {
                    id: 1,
                    name: '男'
                },
                {
                    id: 2,
                    name: '女'
                }
            ],
            showContentVisible: false,
            viewVisible: true,
            status: 0,
            relLogTableData: [],
            content: '',
            showDbVisible: false,
            searchDbForm: {
                name: '',
                delegation: ''
            },
            dbTableData: [],
            jointly: null
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.queryByPage()
        this.getDbOpinionClassify()
        this.getDbList()
    },
    methods: {
        queryByPage() {
            this.relLogTableData = []
            let that = this
            const params = {
                pageNo: this.pageNo,
                flag: 1,
                content: this.searchForm.content,
                year: this.searchForm.year,
                status: this.status,
                userId: this.userId,
                range: 2,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbOpinionList', { params }).then(res => {
                if (res.data.code === 200) {
                    if (this.activeName === 'first') {
                        this.opinionTableDataOne = res.data.data.list
                    } else {
                        this.opinionTableDataTwo = res.data.data.list
                    }
                    this.total = res.data.data.total
                }
            })
        },
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
        handleCurrentChange(val) {
            this.queryByPage()
        },
        getDbOpinionClassify() {
            let that = this
            const params = {
                flag: 1,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbOpinionClassify', { params }).then(res => {
                if (res.data.code === 200) {
                    that.classifyOptions = res.data.data
                }
            })
        },
        getUserInfo(userId, flag, row) {
            let that = this
            const params = {
                id: userId,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbUserInfo', { params }).then(res => {
                if (res.data.code === 200) {
                    if (flag === 'add') {
                        that.addForm = res.data.data
                        that.addForm.classifyId = 4
                    } else {
                        that.editForm.userInfo = res.data.data
                        that.editForm.id = row.id
                        that.editForm.content = row.content
                        that.editForm.classifyId = row.classifyId
                        if (row.jointly) {
                            that.editForm.jointly = JSON.parse(row.jointly)
                        } else {
                            that.editForm.jointly = null
                        }
                    }
                }
            })
        },
        //显示新增界面
        showAddDialog() {
            this.addFormVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
            this.getUserInfo(this.userId, 'add')
        },
        //新增
        addSubmit() {
            let that = this
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    let params = {
                        userId: this.userId,
                        companyId: this.companyId,
                        content: this.addForm.content,
                        classifyId: this.addForm.classifyId,
                        jointly: JSON.stringify(this.addForm.jointly),
                        category: '代表意见',
                        _databaseId: this._databaseId
                    }
                    that.$axios.post('cloud/authority/addDbOpinion', params).then(res => {
                        if (res.data.code === 200) {
                            that.$message.success('新增成功')
                            that.addFormVisible = false
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //显示编辑界面
        showEditDialog(row, flag) {
            if (flag === 'edit') {
                this.viewVisible = true
            } else {
                this.viewVisible = false
            }
            this.getUserInfo(row.userId, 'edit', row)
            this.editFormVisible = true
        },
        //编辑
        editSubmit() {
            let that = this
            let params = {
                id: this.editForm.id,
                content: this.editForm.content,
                classifyId: this.editForm.classifyId,
                jointly: JSON.stringify(this.editForm.jointly),
                _databaseId: this._databaseId
            }
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    that.$axios.post('cloud/authority/updateDbOpinion', params).then(res => {
                        if (res.data.code === 200) {
                            that.$message.success('修改成功')
                            that.editFormVisible = false
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        deleteSubmit(row) {
            let that = this
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                that.$axios.post('cloud/authority/deleteDbOpinion', { id: row.id }).then(res => {
                    if (res.data.code === 200) {
                        that.$message.success('删除成功')
                        that.pageNo = 1
                        that.queryByPage()
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            })
        },
        handleClick(tab, event) {
            if (tab.name === 'first') {
                this.status = 0
                this.queryByPage()
            } else {
                this.status = 1
                this.queryByPage()
            }
        },
        showContent(content) {
            this.content = content
            this.showContentVisible = true
        },
        handle(row, event, column) {
            let that = this
            const params = {
                dbOpinionId: row.id,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbOpinionRelLog', { params }).then(res => {
                if (res.data.code === 200) {
                    that.relLogTableData = res.data.data
                }
            })
        },
        statusFormatter(obj) {
            if (obj.status === 1) {
                return '已完成'
            } else {
                return '未完成'
            }
        },
        handleSearchDb() {
            this.getDbList()
        },
        relSubmit() {
            const _selectData = this.$refs.multipleDbTable.selection
            if (_selectData.length <= 0) {
                if (this.editFormVisible) {
                    this.editForm.jointly = null
                }
                if (this.addFormVisible) {
                    this.addForm.jointly = null
                }
                this.showDbVisible = false
                return
            }
            let dbIdArray = []
            for (let i = 0; i < _selectData.length; i++) {
                dbIdArray.push(_selectData[i].id)
            }
            if (this.editFormVisible) {
                this.editForm.jointly = dbIdArray
            }
            if (this.addFormVisible) {
                this.addForm.jointly = dbIdArray
            }
            this.showDbVisible = false
        },
        getDbList() {
            let that = this
            const params = {
                name: this.searchDbForm.name,
                delegation: this.searchDbForm.delegation,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbList', { params }).then(res => {
                if (res.data.code === 200) {
                    that.dbTableData = res.data.data
                }
            })
        },
        handleDb() {
            this.showDbVisible = true
        },
        sexFormatter(obj) {
            if (obj.sex === 1) {
                return '男'
            } else {
                return '女'
            }
        }
    }
}
</script>
<style scoped>
/* 要求搜索输入框小一点，原有40px,现35 */
.searchView .el-form-item {
    margin-bottom: 15px;
    height: 35px;
}
.searchView .el-form-item__content {
    height: 35px;
    line-height: 35px;
}
.searchView .el-button {
    height: 35px;
    padding-top: 0;
    text-align: center;
    line-height: 35px;
}
.searchView .el-form-item__label {
    text-align: center;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 35px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    height: 35px;
    position: relative;
    right: -1px;
    background: #efefef;
    border-radius: 4px 0 0 4px;
    padding: 0;
}
.searchView .el-input__inner {
    line-height: 34px;
    height: 35px;
    box-sizing: border-box;
}
</style>
