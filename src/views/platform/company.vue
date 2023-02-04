<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
		</div>
		<div class="table">
			<!--列表-->
			<el-table
				:data="tableData"
				border
				highlight-current-row
				stripe
				default-expand-all
				row-key="id"
				:tree-props="{ children: 'children' }"
			>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="mark" label="标识" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" align="center"></el-table-column>
				<el-table-column prop="alias" label="简称" align="center"></el-table-column>
				<el-table-column label="logo" align="center">
					<template slot-scope="scope">
						<el-image
							style="width:45px;height:45px;border-radius:45px;"
							:src="scope.row.logo"
							:preview-src-list="[scope.row.logo]"
						>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
						<el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--新增界面-->
		<el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-col :span="12">
					<el-form-item label="标识" prop="mark">
						<el-input v-model.trim="addForm.mark" clearable placeholder="请输入标识"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="名称" prop="name">
						<el-input v-model.trim="addForm.name" clearable placeholder="请输入名称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="简称" prop="alias">
						<el-input v-model.trim="addForm.alias" clearable placeholder="请输入简称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="上级" prop="parentId">
						<el-cascader
							v-model="addForm.parentId"
							:options="tableData"
							:props="{ checkStrictly: true, emitPath: false }"
							clearable
							placeholder="请选择上级"
						>
						</el-cascader>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="logo" prop="logo">
						<el-upload
							class="avatar-uploader"
							:action="action"
							:headers="headers"
							:show-file-list="false"
							:on-success="handleUploadSuccess"
							:before-upload="beforeUpload"
						>
							<img v-if="addForm.logo" :src="addForm.logo" class="avatar" />
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-col :span="24">
					<el-form-item label="名称" prop="name">
						<el-input v-model.trim="editForm.name" clearable placeholder="请输入名称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="简称" prop="alias">
						<el-input v-model.trim="editForm.alias" clearable placeholder="请输入简称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="上级" prop="parentId">
						<el-cascader
							v-model="editForm.parentId"
							:options="tableData"
							:props="{ checkStrictly: true, emitPath: false }"
							clearable
							placeholder="请选择上级"
						>
						</el-cascader>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="logo" prop="logo">
						<el-upload
							class="avatar-uploader"
							:action="action"
							:headers="headers"
							:show-file-list="false"
							:on-success="handleUploadSuccess"
							:before-upload="beforeUpload"
						>
							<img v-if="editForm.logo" :src="editForm.logo" class="avatar" />
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
				</el-col>
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
			action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
			headers: {
				Authorization: window.localStorage.getItem('Authorization')
			},
			tableData: [],
			addFormVisible: false,
			addForm: {
				mark: '',
				name: '',
				alias: '',
				parentId: '',
				logo: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				mark: '',
				name: '',
				alias: '',
				parentId: '',
				logo: ''
			},
			formRules: {
				mark: [
					{ required: true, message: '请输入标识', trigger: 'blur' },
					{ pattern: /^[a-z]{1,}$/, message: '只能输入小写英文字母' }
				],
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				alias: [{ required: true, message: '请输入简称', trigger: 'blur' }],
				logo: [{ required: true, message: '请上传logo', trigger: 'blur' }]
			}
		}
	},
	created() {
		this.queryAll()
	},
	methods: {
		async queryAll() {
			let res = await this.$axios.get('company/queryAll')
			if (res.data.code == 200) {
				this.tableData = res.data.data
			}
		},
		handleUploadSuccess(res, file) {
			if (res.code === 200) {
				if (this.addFormVisible) {
					this.addForm.logo = res.data
				} else {
					this.editForm.logo = res.data
				}
			} else {
				this.$message.error(res.message)
			}
		},
		beforeUpload(file) {
			const suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
			const filelist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
			let result = filelist.find(item => item === suffix)
			if (!result) {
				this.$message.error('请上传图片类型')
				return false
			}
			const isLtSize = file.size / 1024 / 1024 < 10
			if (!isLtSize) {
				this.$message.error('上传头像图片大小不能超过10MB')
				return false
			}
			return true
		},
		//显示新增界面
		showAddDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
		},
		//新增
		addSubmit() {
			let that = this
			this.$refs.addForm.validate(valid => {
				if (valid) {
					that.$axios.post('company/insert', that.addForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.addFormVisible = false
							that.queryAll()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		//显示编辑界面
		showEditDialog(row) {
			let that = this
			this.editForm = Object.assign({}, row)
			this.editFormVisible = true
			if (this.$refs.editForm) {
				this.$refs.editForm.resetFields()
			}
		},
		//编辑
		editSubmit() {
			let that = this
			this.$refs.editForm.validate(valid => {
				if (valid) {
					that.$axios.post('company/update', that.editForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('修改成功')
							that.editFormVisible = false
							that.queryAll()
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
				that.$axios.post('company/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.queryAll()
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		}
	}
}
</script>