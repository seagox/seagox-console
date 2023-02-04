<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-plus" @click="handleAddDialog" size="small">新增</el-button>
        </div>
        <div class="searchView">
            <el-form :model="searchForm" label-width="80px">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="标题">
                            <el-input v-model="searchForm.keyWord" clearable placeholder="请输入关键字"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="地区">
                            <el-cascader
                                v-model="searchForm.regionIds"
                                :options="regionList"
                                :props="optionProps"
                                clearable
                                filterable
                                placeholder="请选择地区"
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-button type="primary" icon="el-icon-search" @click.native="queryList" style="margin-left: 15px">
                        查询
                    </el-button>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <!--列表-->
            <el-table border stripe :data="tableData" highlight-current-row>
                <el-table-column type="index" label="#" width="80" align="center"></el-table-column>
                <el-table-column prop="title" label="标题" align="left" show-overflow-tooltip></el-table-column>
                <el-table-column prop="cover" label="封面图" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <img v-if="scope.row.cover" :src="scope.row.cover" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEditDialog(scope.row)" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :current-page.sync="pageNo"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog title="新增公告" width="70%" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" :rules="formRules" ref="addForm" label-width="100px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model.trim="addForm.title" placeholder="请输入标题" clearable></el-input>
                </el-form-item>
                <el-form-item label="地区" prop="region_ids">
                    <el-cascader
                        v-model="addForm.region_ids"
                        :options="regionList"
                        :props="optionProps"
                        clearable
                        filterable
                        placeholder="请选择地区"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="封面图" prop="cover">
                    <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        :action="action"
                        :headers="headers"
                        :before-upload="beforeAvatarUpload"
                        :on-success="handleAvatarSuccess"
                    >
                        <img v-if="addForm.cover" :src="addForm.cover" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <editor ref="editor" id="text" placeholder="" v-model="addForm.content"></editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitAdd">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑公告" width="70%" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" :rules="formRules" ref="editForm" label-width="100px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model.trim="editForm.title" placeholder="请输入标题" clearable></el-input>
                </el-form-item>
                <el-form-item label="地区" prop="region_ids">
                    <el-cascader
                        v-model="editForm.region_ids"
                        :options="regionList"
                        :props="optionProps"
                        clearable
                        filterable
                        placeholder="请选择地区"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="封面图" prop="cover">
                    <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        :action="action"
                        :headers="headers"
                        :before-upload="beforeAvatarUpload"
                        :on-success="handleAvatarSuccess"
                    >
                        <img v-if="editForm.cover" :src="editForm.cover" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <editor ref="editText" id="editId" placeholder="" v-model="editForm.content"></editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitEdit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            _databaseId: null,
            regionList: [],
            optionProps: {
                value: 'id',
                label: 'name',
                children: 'children',
                checkStrictly: false,
                emitPath: false,
                multiple: true
            },
            tableData: [],
            pageNo: 1,
            pageSize: 20,
            total: 0,
            searchForm: {
                keyWord: null,
                regionIds: null
            },
            addFormVisible: false,
            addForm: {
                title: null,
                region_ids: null,
                cover: null,
                content: null
            },
            editFormVisible: false,
            editForm: {
                di: null,
                title: null,
                region_ids: null,
                cover: null,
                content: null
            },
            formRules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { max: 30, message: '请输入30个以内字符', trigger: 'blur' }
                ],
                region_ids: [{ required: true, message: '请选择地区', trigger: 'change' }],
                cover: [{ required: true, message: '请上传图片', trigger: 'change' }],
                content: [{ required: true, message: '请填写内容', trigger: 'blur' }]
            }
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.queryList()
        this.queryRegion()
    },
    methods: {
        // 查询公告列表
        queryList() {
            let that = this
            let regionIds = null
            if (this.searchForm.regionIds) {
                regionIds = this.searchForm.regionIds.join(',')
            }
            let params = {
                _databaseId: this._databaseId,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                name: this.searchForm.keyWord,
                regionIds: regionIds
            }
            that.$axios.post('/cloud/entrance/queryNotice', params).then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                } else {
                    that.$message.error('查询失败！')
                }
            })
        },
        // 翻页
        handleCurrentChange() {
            this.queryList()
        },
        // 查询地区
        queryRegion() {
            let that = this
            that.$axios.post('/cloud/entrance/queryRegion').then(res => {
                if (res.data.code == 200) {
                    that.regionList = res.data.data
                } else {
                    that.$message.error('查询失败！')
                }
            })
        },
        // 新增弹窗
        handleAddDialog() {
            this.addFormVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
            this.addForm.cover = ''
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        handleAvatarSuccess(res, file) {
            this.addForm.cover = res.data
            this.editForm.cover = res.data
        },
        handleSubmitAdd() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    let that = this
                    let params = {
                        title: that.addForm.title,
                        region_ids: that.addForm.region_ids.join(','),
                        cover: that.addForm.cover,
                        content: JSON.stringify(that.addForm.content)
                    }
                    that.$axios.post('/cloud/entrance/addNotice', params).then(res => {
                        if (res.data.code == 200) {
                            that.queryList()
                            this.addFormVisible = false
                            that.$message.success('新增成功！')
                        } else {
                            that.$message.error('更新失败，' + res.data.message)
                        }
                    })
                }
            })
        },
        handleEditDialog(row) {
            let that = this
            that.editFormVisible = true
            if (that.$refs.editForm) {
                that.$refs.editForm.resetFields()
            }
            that.$nextTick(() => {
                that.editForm.id = row.id
                that.editForm.title = row.title
                that.editForm.region_ids = row.region_ids.split(',')
                that.editForm.cover = row.cover
                that.editForm.content = row.content
                that.$refs.editText.setContents(JSON.parse(row.content))
            })
        },
        handleSubmitEdit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    let that = this
                    let params = {
                        id: that.editForm.id,
                        title: that.editForm.title,
                        region_ids: that.editForm.region_ids.join(','),
                        cover: that.editForm.cover,
                        content: JSON.stringify(that.editForm.content)
                    }
                    that.$axios.post('/cloud/entrance/editNotice', params).then(res => {
                        if (res.data.code == 200) {
                            that.queryList()
                            this.editFormVisible = false
                            that.$message.success('新增成功！')
                        } else {
                            that.$message.error('更新失败，' + res.data.message)
                        }
                    })
                }
            })
        }
    }
}
</script>
