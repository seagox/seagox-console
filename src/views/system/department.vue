<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
		</div>
		<div class="searchView">
			<el-form label-width="80px">
				<el-row>
					<el-col :span="6">
						<el-form-item label="所属单位">
							<el-cascader
								v-model="searchForm.companyId"
								:options="treeData"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择所属单位"
							>
							</el-cascader>
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
			<el-table :data="tableData" border default-expand-all row-key="id" :tree-props="{ children: 'children' }">
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="名称"></el-table-column>
				<el-table-column prop="code" label="编号" align="center"></el-table-column>
				<el-table-column prop="companyName" label="单位名称" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--新增界面-->
		<el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-row>
					<el-col :span="24">
						<el-form-item label="名称" prop="name">
							<el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属单位" prop="companyId">
							<el-cascader
								v-model="addForm.companyId"
								:options="treeData"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择所属单位"
								@change="companyChange"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级部门" prop="parentId">
							<el-cascader
								v-model="addForm.parentId"
								:options="deptData"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择上级"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="部门主管" prop="directorValue">
							<el-select v-model="addForm.directorValue" multiple filterable placeholder="请选择部门主管">
								<el-option
									v-for="item in userOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="分领导" prop="chargeLeaderValue">
							<el-select
								v-model="addForm.chargeLeaderValue"
								multiple
								filterable
								placeholder="请选择分领导"
							>
								<el-option
									v-for="item in userOptions"
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
					<el-col :span="24">
						<el-form-item label="名称" prop="name">
							<el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属单位" prop="companyId">
							<el-cascader
								v-model="editForm.companyId"
								:options="treeData"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择所属单位"
								@change="companyChange"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级部门" prop="parentId">
							<el-cascader
								v-model="editForm.parentId"
								:options="deptData"
								:props="{ checkStrictly: true, emitPath: false }"
								clearable
								placeholder="请选择上级"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="部门主管" prop="directorValue">
							<el-select
								v-model="editForm.directorValue"
								multiple
								filterable
								placeholder="请选择部门主管"
							>
								<el-option
									v-for="item in userOptions"
									:key="item.id"
									:label="item.name"
									:value="String(item.id)"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="分管领导" prop="chargeLeaderValue">
							<el-select
								v-model="editForm.chargeLeaderValue"
								multiple
								filterable
								placeholder="请选择分管领导"
							>
								<el-option
									v-for="item in userOptions"
									:key="item.id"
									:label="item.name"
									:value="String(item.id)"
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
	</div>
</template>

<script>
export default {
	data() {
		return {
			searchForm: {
				companyId: ''
			},
			treeData: [],
			tableData: [],
			deptData: [],
			userOptions: [],
			addFormVisible: false,
			addForm: {
				companyId: '',
				name: '',
				parentId: '',
				directorValue: [],
				chargeLeaderValue: []
			},
			editFormVisible: false,
			editForm: {
				id: '',
				companyId: '',
				name: '',
				parentId: '',
				directorValue: [],
				chargeLeaderValue: []
			},
			formRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				companyId: [{ required: true, message: '请选择所属单位', trigger: 'change' }]
			}
		}
	},
	created() {
		this.queryCompany()
		this.queryByCompanyId()
		this.queryUser()
	},
	methods: {
		companyChange(val) {
			this.queryParentByCompanyId(val)
			if (this.addFormVisible) {
				this.addForm.parentId = ''
			}
		},
		async queryCompany() {
			let res = await this.$axios.get('company/queryByCompanyId')
			if (res.data.code == 200) {
				this.treeData = res.data.data
			}
		},
		async queryParentByCompanyId(companyId) {
			let res = await this.$axios.get('department/queryByCompanyId?searchCompanyId=' + companyId)
			if (res.data.code == 200) {
				this.deptData = res.data.data
			}
		},
		async queryByCompanyId() {
			if (this.searchForm.companyId) {
				let res = await this.$axios.get(
					'department/queryByCompanyId?searchCompanyId=' + this.searchForm.companyId
				)
				if (res.data.code == 200) {
					this.tableData = res.data.data
				}
			} else {
				let res = await this.$axios.get('department/queryByCompanyId')
				if (res.data.code == 200) {
					this.tableData = res.data.data
				}
			}
		},
		async queryUser() {
			let res = await this.$axios.get('user/queryAll')
			if (res.data.code == 200) {
				this.userOptions = res.data.data
			}
		},
		handleSearch() {
			this.queryByCompanyId()
		},
		showAddDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
		},
		addSubmit() {
			let that = this
			var params = {
				companyId: this.addForm.companyId,
				name: this.addForm.name,
				parentId: this.addForm.parentId,
				director: this.addForm.directorValue.toString(),
				chargeLeader: this.addForm.chargeLeaderValue.toString()
			}
			this.$refs.addForm.validate(valid => {
				if (valid) {
					that.$axios.post('department/insert', params).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.addFormVisible = false
							that.queryByCompanyId()
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
			if (this.editForm.director) {
				this.$set(this.editForm, 'directorValue', this.editForm.director.split(','))
			} else {
				this.$set(this.editForm, 'directorValue', [])
			}
			if (this.editForm.chargeLeader) {
				this.$set(this.editForm, 'chargeLeaderValue', this.editForm.chargeLeader.split(','))
			} else {
				this.$set(this.editForm, 'chargeLeaderValue', [])
			}
			this.queryParentByCompanyId(this.editForm.companyId)
		},
		editSubmit() {
			let that = this
			if (this.editForm.id != this.editForm.parentId) {
				var params = {
					id: this.editForm.id,
					companyId: this.editForm.companyId,
					name: this.editForm.name,
					parentId: this.editForm.parentId,
					director: this.editForm.directorValue.toString(),
					chargeLeader: this.editForm.chargeLeaderValue.toString()
				}
				this.$refs.editForm.validate(valid => {
					if (valid) {
						that.$axios.post('department/update', params).then(res => {
							if (res.data.code == 200) {
								that.$message.success('修改成功')
								that.editFormVisible = false
								that.queryByCompanyId()
							} else {
								that.$message.error(res.data.message)
							}
						})
					}
				})
			} else {
				this.$message.error('不能选择自己为上级部门')
			}
		},
		deleteSubmit(row) {
			let that = this
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('department/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.pageNo = 1
						that.queryByCompanyId()
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		}
	}
}
</script>