<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
		</div>
		<div class="table">
			<!--列表-->
			<el-table :data="tableData" border>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
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
		<el-dialog title="新增" width="550px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="authority">
					<el-select v-model="addForm.authority" multiple placeholder="请选择角色">
						<el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="addForm.type">
						<el-radio :label="1">仪表盘</el-radio>
						<el-radio :label="2">云页面</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="页面" prop="viewId" v-if="addForm.type == 1">
					<el-select v-model="addForm.viewId" placeholder="请选择页面" clearable filterable>
						<el-option v-for="item in gaugeOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="页面" prop="viewId" v-else>
					<el-select v-model="addForm.viewId" placeholder="请选择页面" clearable filterable>
						<el-option v-for="item in metaPageOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="550px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="authority">
					<el-select v-model="editForm.authority" multiple placeholder="请选择角色">
						<el-option
							v-for="item in roleOptions"
							:key="item.id"
							:label="item.name"
							:value="String(item.id)"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="editForm.type">
						<el-radio :label="1">仪表盘</el-radio>
						<el-radio :label="2">云页面</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="页面" prop="viewId" v-if="editForm.type == 1">
					<el-select v-model="editForm.viewId" placeholder="请选择页面" clearable filterable>
						<el-option v-for="item in gaugeOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="页面" prop="viewId" v-else>
					<el-select v-model="editForm.viewId" placeholder="请选择页面" clearable filterable>
						<el-option v-for="item in metaPageOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
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
			addFormVisible: false,
			addForm: {
				name: '',
				authority: [],
				type: 1,
				viewId: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				name: '',
				authority: [],
				type: 1,
				viewId: ''
			},
			formRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				authority: [{ required: true, message: '请选择角色', trigger: 'change' }],
				viewId: [{ required: true, message: '请选择页面', trigger: 'change' }]
			},
			metaPageOptions: [],
			gaugeOptions: [],
			roleOptions: []
		}
	},
	created() {
		this.queryRoleByCompanyId()
		this.queryMetaPageByCompanyId()
		this.queryByPage()
	},
	methods: {
		async queryMetaPageByCompanyId() {
			let res = await this.$axios.get('metaPage/queryByCompanyId')
			if (res.data.code == 200) {
				this.metaPageOptions = res.data.data
			}
		},
		async queryGaugeByCompanyId() {
			let res = await this.$axios.get('gauge/queryByCompanyId')
			if (res.data.code == 200) {
				this.gaugeOptions = res.data.data
			}
		},
		async queryRoleByCompanyId() {
			let res = await this.$axios.get('role/queryAll')
			if (res.data.code == 200) {
				this.roleOptions = res.data.data
			}
		},
		async queryByPage() {
			const params = {
				pageNo: this.pageNo
			}
			let res = await this.$axios.get('door/queryByPage', { params })
			if (res.data.code == 200) {
				this.tableData = res.data.data.list
				this.total = res.data.data.total
			}
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
			let that = this
			var params = {
				name: this.addForm.name,
				type: this.addForm.type,
				viewId: this.addForm.viewId,
				authority: this.addForm.authority.toString()
			}
			this.$refs.addForm.validate(valid => {
				if (valid) {
					that.$axios.post('door/insert', params).then(res => {
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
			if (this.editForm.authority) {
				this.$set(this.editForm, 'authority', this.editForm.authority.split(','))
			} else {
				this.$set(this.editForm, 'authority', [])
			}
		},
		editSubmit() {
			let that = this
			var params = {
				id: this.editForm.id,
				name: this.editForm.name,
				type: this.editForm.type,
				viewId: this.editForm.viewId,
				authority: this.editForm.authority.toString()
			}
			this.$refs.editForm.validate(valid => {
				if (valid) {
					that.$axios.post('door/update', params).then(res => {
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
				that.$axios.post('door/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.pageNo = 1
						that.queryByPage()
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		}
	}
}
</script>