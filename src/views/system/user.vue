<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
			<el-upload
				style="display:inline;margin-left:10px;margin-right:10px;"
				:action="action"
				:show-file-list="false"
				accept=".xlsx,.xls"
				:headers="headers"
				:before-upload="beforeUpload"
				:on-success="successHandle"
			>
				<el-button type="text" icon="el-icon-upload2">导入</el-button>
			</el-upload>
			<el-button type="text" icon="el-icon-download" @click="downloadTemplate" size="small">下载模版</el-button>
		</div>
		<div class="searchView">
			<el-form label-width="80px">
				<el-row>
					<el-col :span="6">
						<el-form-item label="所属单位">
							<el-cascader
								v-model="searchForm.companyId"
								:options="companyOptions"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择所属单位"
								@change="handCompanyChange"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="所属部门">
							<el-cascader
								v-model="searchForm.departmentId"
								:options="departmentOptions"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择所属部门"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="姓名">
							<el-input v-model="searchForm.name" clearable placeholder="请输入姓名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-button
							type="primary"
							icon="el-icon-search"
							@click.native="handleSearch"
							style="margin-left:15px"
							>查询</el-button
						>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="table">
			<!--列表-->
			<el-table :data="tableData" border>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column
					prop="companyName"
					label="所属单位"
					align="center"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column prop="departmentName" label="所属部门" align="center"></el-table-column>
				<el-table-column prop="account" label="账号" align="center"></el-table-column>
				<el-table-column prop="name" label="姓名" align="center"></el-table-column>
				<el-table-column prop="sex" label="性别" align="center" :formatter="sexFormatter"></el-table-column>
				<el-table-column prop="position" label="职位" align="center"></el-table-column>
                <el-table-column prop="sort" label="排序" align="center"></el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					align="center"
					:formatter="statusFormatter"
				></el-table-column>
				<el-table-column label="操作" align="center" width="185">
					<template slot-scope="scope">
						<el-button
							type="text"
							size="small"
							@click="showEditDialog(scope.row)"
							v-if="scope.row.account != 'fjctAdmin'"
							>编辑</el-button
						>
						<el-divider direction="vertical" v-if="scope.row.account != 'fjctAdmin'"></el-divider>
						<el-button
							type="text"
							size="small"
							@click="deleteSubmit(scope.row)"
							v-if="scope.row.account != 'fjctAdmin'"
							>删除</el-button
						>
						<el-divider direction="vertical" v-if="scope.row.account != 'fjctAdmin'"></el-divider>
						<el-button
							type="text"
							size="small"
							@click="showResetDialog(scope.row)"
							v-if="scope.row.account != 'fjctAdmin'"
							>重置密码</el-button
						>
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
		<el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="账号" prop="account">
							<el-input v-model="addForm.account" placeholder="请输入账号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="密码" prop="password">
							<el-input
								v-model="addForm.password"
								show-password
								placeholder="请输入密码"
								clearable
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="addForm.name" placeholder="请输入姓名" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别" prop="sex">
							<el-radio-group v-model="addForm.sex">
								<el-radio :label="item.value" v-for="(item, index) in sexOptions" :key="index">{{
									item.label
								}}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属单位" prop="companyId">
							<el-cascader
								v-model="addForm.companyId"
								:options="companyOptions"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择所属单位"
								@change="handCompanyChange"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="部门" prop="departmentId">
							<el-cascader
								v-model="addForm.departmentId"
								:options="departmentOptions"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择部门"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="职位" prop="position">
							<el-input v-model="addForm.position" placeholder="请输入职位" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序号" prop="sort">
							<el-input-number v-model="addForm.sort" placeholder="请输入排序号"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="角色" prop="roleValue">
							<el-select v-model="addForm.roleValue" multiple placeholder="请选择角色">
								<el-option
									v-for="item in roleOptions"
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
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="账号" prop="account">
							<el-input v-model="editForm.account" placeholder="请输入账号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="editForm.name" placeholder="请输入姓名" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="职位" prop="position">
							<el-input v-model="editForm.position" placeholder="请输入职位" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别" prop="sex">
							<el-radio-group v-model="editForm.sex">
								<el-radio :label="item.value" v-for="(item, index) in sexOptions" :key="index">{{
									item.label
								}}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属单位" prop="companyId">
							<el-cascader
								v-model="editForm.companyId"
								:options="companyOptions"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择所属单位"
								@change="handCompanyChange"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="部门" prop="departmentId">
							<el-cascader
								v-model="editForm.departmentId"
								:options="departmentOptions"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择部门"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select v-model="editForm.status" placeholder="请选择状态">
								<el-option label="启用" :value="1"> </el-option>
								<el-option label="禁用" :value="2"> </el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序号" prop="sort">
							<el-input-number v-model="editForm.sort" placeholder="请输入排序号"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="角色" prop="roleValue">
							<el-select v-model="editForm.roleValue" multiple placeholder="请选择角色">
								<el-option
									v-for="item in roleOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id + ''"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--重置密码-->
		<el-dialog title="重置密码" width="500px" :visible.sync="resetFormVisible" :close-on-click-modal="false">
			<el-form :model="resetForm" label-width="80px" :rules="formRules" ref="resetForm">
				<el-form-item label="新密码" prop="password">
					<el-input v-model="resetForm.password" placeholder="请输入新密码" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetFormVisible = false">取消</el-button>
				<el-button type="primary" @click="resetSubmit">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			action: this.$axios.defaults.baseURL + 'user/import',
			headers: {
				Authorization: localStorage.getItem('Authorization')
			},
			searchForm: {
				companyId: '',
				departmentId: '',
				name: ''
			},
			tableData: [],
			companyOptions: [],
			departmentOptions: [],
			roleOptions: [],
			pageNo: 1,
			total: 0,
			sexOptions: [
				{
					value: 1,
					label: '男'
				},
				{
					value: 2,
					label: '女'
				}
			],
			addFormVisible: false,
			addForm: {
				account: '',
				password: '',
				name: '',
				sex: '',
				companyId: '',
				departmentId: '',
				position: '',
				sort: 0,
				roleValue: []
			},
			editFormVisible: false,
			editForm: {
				id: '',
				account: '',
				name: '',
				sex: '',
				companyId: '',
				departmentId: '',
				position: '',
				status: '',
				sort: 0,
				roleValue: []
			},
			formRules: {
				account: [
					{ required: true, message: '请输入账号', trigger: 'blur' },
					{ min: 2, message: '长度至少2个字符', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{
						pattern: /(?=.*[a-z])(?=.*\d)(?=.*[^a-z0-9])[\S]{8,}/i,
						message: '密码必须包含字母、数字和特殊字符，且长度至少8位',
						trigger: 'blur'
					}
				],
				name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
				sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
				companyId: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
				departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
				sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
			},
			resetFormVisible: false,
			resetForm: {
				id: '',
				password: ''
			}
		}
	},
	created() {
		this.queryCompany()
		this.queryByPage()
		this.queryRoleByCompanyId()
	},
	methods: {
		async queryCompany() {
			let res = await this.$axios.get('company/queryByCompanyId')
			if (res.data.code == 200) {
				this.companyOptions = res.data.data
			}
		},
		async queryDepartmentByCompanyId(companyId) {
			let res = await this.$axios.get('department/queryByCompanyId?searchCompanyId=' + companyId)
			if (res.data.code == 200) {
				this.departmentOptions = res.data.data
			}
		},
		async queryRoleByCompanyId() {
			let res = await this.$axios.get('role/queryAll')
			if (res.data.code == 200) {
				this.roleOptions = res.data.data
			}
		},
		handCompanyChange(val) {
			if (this.addFormVisible) {
				this.addForm.departmentId = ''
			} else if (this.editFormVisible) {
				this.editForm.departmentId = ''
			}
			if (val) {
				this.queryDepartmentByCompanyId(val)
			} else {
				this.departmentOptions = []
			}
		},
		queryByPage() {
			let that = this
			const params = {
				pageNo: this.pageNo,
				searchCompanyId: this.searchForm.companyId,
				departmentId: this.searchForm.departmentId,
				name: this.searchForm.name
			}
			that.$axios.get('user/queryByPage', { params }).then(res => {
				if (res.data.code == 200) {
					that.tableData = res.data.data.list
					that.total = res.data.data.total
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
		sexFormatter(obj) {
			if (obj.sex === 1) {
				return '男'
			} else {
				return '女'
			}
		},
		statusFormatter(obj) {
			if (obj.status === 1) {
				return '启用'
			} else {
				return '禁用'
			}
		},
		showAddDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
			this.addForm.departmentId = ''
		},
		addSubmit() {
			let that = this
			var params = {
				account: this.addForm.account,
				password: this.addForm.password,
				name: this.addForm.name,
				sex: this.addForm.sex,
				companyId: this.addForm.companyId,
				departmentId: this.addForm.departmentId,
				position: this.addForm.position,
				roleIds: this.addForm.roleValue.toString(),
				sort: this.addForm.sort
			}
			this.$refs.addForm.validate(valid => {
				if (valid) {
					that.$axios.post('user/insert', params).then(res => {
						if (res.data.code == 200) {
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
		showEditDialog(row) {
			this.editForm = Object.assign({}, row)
			this.editFormVisible = true
			if (this.$refs.editForm) {
				this.$refs.editForm.resetFields()
			}
			this.queryDepartmentByCompanyId(this.editForm.companyId)
			if (this.editForm.roleIds) {
				this.$set(this.editForm, 'roleValue', this.editForm.roleIds.split(','))
			} else {
				this.$set(this.editForm, 'roleValue', [])
			}
		},
		editSubmit() {
			let that = this
			var params = {
				id: this.editForm.id,
				account: this.editForm.account,
				name: this.editForm.name,
				sex: this.editForm.sex,
				companyId: this.editForm.companyId,
				departmentId: this.editForm.departmentId,
				position: this.editForm.position,
				roleIds: this.editForm.roleValue.toString(),
				status: this.editForm.status,
				sort: this.editForm.sort
			}

			this.$refs.editForm.validate(valid => {
				if (valid) {
					that.$axios.post('user/update', params).then(res => {
						if (res.data.code == 200) {
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
				that.$axios.post('user/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.pageNo = 1
						that.queryByPage()
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		},
		showResetDialog(row) {
			this.resetFormVisible = true
			if (this.$refs.resetForm) {
				this.$refs.resetForm.resetFields()
			}
			this.resetForm = {
				id: row.id,
				password: ''
			}
		},
		resetSubmit() {
			let that = this
			this.$refs.resetForm.validate(valid => {
				if (valid) {
					that.$axios.post('user/resetPassword', that.resetForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('重置成功')
							that.resetFormVisible = false
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		beforeUpload(file) {
			const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
			if (suffix != 'xlsx' && suffix != 'xls') {
				this.$message.error(`只能选择excel文件`)
				return false
			}
			return true
		},
		successHandle(res, file, fileList) {
			if (res.code === 200) {
				this.$message.success('导入成功')
				this.queryByPage()
			} else {
				this.$message.error(res.message)
			}
		},
		downloadTemplate() {
			let params = {
				templateName: 'userModel.xlsx'
			}
			this.$axios.post('upload/downloadTemplate', params, { responseType: 'blob' }).then(res => {
				let content = res.data
				let blob = new Blob([content])
				if ('download' in document.createElement('a')) {
					// 非IE下载
					let elink = document.createElement('a')
					elink.download = '用户模版.xlsx'
					elink.style.display = 'none'
					elink.href = URL.createObjectURL(blob)
					document.body.appendChild(elink)
					elink.click()
					URL.revokeObjectURL(elink.href) // 释放URL 对象
					document.body.removeChild(elink)
				} else {
					// IE10+下载
					navigator.msSaveBlob(blob, '用户模版.xlsx')
				}
			})
		}
	}
}
</script>
<style scoped>
::v-deep .aside {
	border: 1px solid #ccc;
	border-radius: 4px;
	padding-top: 15px;
}
::v-deep .el-main {
	border: 1px solid #ccc;
	border-radius: 4px;
	padding: 0px;
	margin-left: 10px;
}
</style>
