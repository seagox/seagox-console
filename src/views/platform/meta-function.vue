<template>
    <div>
        <div class="searchView">
            <el-form label-width="60px">
                <el-row :gutter="15">
                    <el-col :span="4">
                        <el-form-item label="类型">
                            <el-select
                                v-model="searchForm.type"
                                clearable
                                placeholder="请选择类型"
                            >
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="名称">
                            <el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
					<el-col :span="4">
                        <el-form-item label="路径">
                            <el-input v-model="searchForm.path" clearable placeholder="请输入路径"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button icon="el-icon-search" @click="handleSearch">查询</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                        <el-button type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <!--列表-->
            <el-table :data="tableData" border>
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="path" label="路径" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showConfig(scope.row)">配置</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
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
        <!--新增界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-form-item label="类型" prop="type">
                    <el-select
                        v-model="addForm.type"
                        clearable
                        placeholder="请选择类型"
                    >
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
				<el-form-item label="路径" prop="path">
                    <el-input v-model.trim="addForm.path" placeholder="请输入路径"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-form-item label="名称" prop="name">
                    <el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
				<el-form-item label="路径" prop="path">
                    <el-input v-model.trim="editForm.path" placeholder="请输入路径"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            pageNo: 1,
            total: 0,
            searchForm: {
                name: '',
				path: ''
            },
            addFormVisible: false,
            addForm: {
                name: '',
                path: '',
                type: 1
            },
            editFormVisible: false,
            editForm: {
                id: '',
                name: '',
                path: '',
                type: undefined
            },
            formRules: {
                type: [{ required: true, message: '请选择类型', trigger: 'change' }],
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                path: [{ required: true, message: '请输入路径', trigger: 'blur' }]
            },
            typeOptions: [
                {
                    value: 1,
                    label: '函数'
                },
                {
                    value: 2,
                    label: '业务规则'
                },
                {
                    value: 3,
                    label: '导入验证规则'
                },
                {
                    value: 4,
                    label: '导入处理规则'
                },
                {
                    value: 5,
                    label: '定时任务'
                },
                {
                    value: 6,
                    label: '打印规则'
                },
                {
                    value: 7,
                    label: '下载规则'
                }
            ]
        }
    },
    created() {
        this.queryByPage()
    },
    methods: {
        async queryByPage() {
            const params = {
                pageNo: this.pageNo,
                name: this.searchForm.name,
				path: this.searchForm.path,
                type: this.searchForm.type
            }
            let res = await this.$axios.get('metaFunction/queryByPage', { params })
			if (res.data.code == 200) {
				this.tableData = res.data.data.list
				this.total = res.data.data.total
			}
        },
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
        handleCurrentChange(val) {
            this.queryByPage()
        },
        showAddDialog() {
            this.addFormVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
        },
        addSubmit() {
			this.$refs.addForm.validate(valid => {
				if (valid) {
					this.$axios.post('metaFunction/insert', this.addForm).then(res => {
						if (res.data.code == 200) {
							this.$message.success('新增成功')
							this.addFormVisible = false
							this.queryByPage()
						} else {
							this.$message.error(res.data.message)
						}
					})
				}
			})
        },
        showEditDialog(row) {
            this.editForm = Object.assign({}, row)
            this.editFormVisible = true
            if (this.$refs.editForm) {
                this.$refs.editForm.resetFields()
            }
        },
        editSubmit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$axios.post('metaFunction/update', this.editForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.editFormVisible = false
                            this.queryByPage()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        showConfig(row) {
            this.$router.push({ path: '/editMetaFunction', query: { id: row.id, path: row.path } })
        },
        deleteSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('metaFunction/delete/' + row.id, { path: row.path}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.pageNo = 1
                        this.queryByPage()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        handleDownload() {
            let params = {
                type:"元函数"
            }
            this.$axios.post('upload/exportScript', params, { responseType: 'blob' }).then(res => {
            let content = res.data
            let blob = new Blob([content])
            if ('download' in document.createElement('a')) {
                // 非IE下载
                let elink = document.createElement('a')
                elink.download = "元函数.zip"
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
            } else {
                // IE10+下载
                navigator.msSaveBlob(blob, "元函数.zip")
            }
            })
        }
    }
}
</script>
