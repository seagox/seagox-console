<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
		</div>
		<div class="table">
			<!--列表-->
			<el-table :data="tableData" border highlight-current-row stripe>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
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
					<el-input v-model.trim="addForm.name" clearable placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="菜单" prop="path" style="max-height:400px;overflow:auto">
					<el-tree
						:data="menuData"
						show-checkbox
						node-key="id"
						ref="tree"
						style="margin-top:15px"
					>
						<div slot-scope="{ node, data }">
							{{ data.name }}
						</div>
					</el-tree>
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
					<el-input v-model.trim="editForm.name" clearable placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="菜单" prop="path" style="max-height:400px;overflow:auto">
					<el-tree
						:data="menuData"
						show-checkbox
						node-key="id"
						ref="tree"
						style="margin-top:15px"
					>
						<div slot-scope="{ node, data }">
							{{ data.name }}
						</div>
					</el-tree>
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
				path: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				name: '',
				path: ''
			},
			formRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				path: [{ required: true, message: '请选择菜单权限', trigger: 'blur' }]
			},
			menuData: []
		}
	},
	mounted() {
		this.queryByPage()
		this.queryMenuByCompanyId()
	},
	methods: {
		queryByPage() {
			let that = this
			const params = {
				pageNo: this.pageNo
			}
			that.$axios.get('role/queryByPage', { params }).then(res => {
				if (res.data.code == 200) {
					that.tableData = res.data.data.list
					that.total = res.data.data.total
				}
			})
		},
		async queryMenuByCompanyId() {
			let res = await this.$axios.get('menu/queryByCompanyId?status=1')
			if (res.data.code == 200) {
				this.menuData = res.data.data
			}
		},
		// 翻页
		handleCurrentChange(val) {
			this.queryByPage()
		},
		//显示新增界面
		showAddDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
			this.$nextTick(() => {
				this.$refs.tree.setCheckedKeys([])
			})
		},
		//新增
		addSubmit() {
			let parentArr = this.$refs.tree.getHalfCheckedKeys()
			let childArr = this.$refs.tree.getCheckedKeys()
			this.addForm.path = parentArr.concat(childArr).toString()
			this.$refs.addForm.validate(valid => {
				if (valid) {
					this.$axios.post('role/insert', this.addForm).then(res => {
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
		//显示编辑界面
		showEditDialog(row) {
			this.editForm = Object.assign({}, row)
			this.editFormVisible = true
			if (this.$refs.editForm) {
				this.$refs.editForm.resetFields()
			}

			this.$nextTick(() => {
				let checkedArr = this.editForm.path.split(',')
				checkedArr.forEach(value => {
					this.$refs.tree.setChecked(value, true, false)
				})
			})
		},
		//编辑
		editSubmit() {
			let parentArr = this.$refs.tree.getHalfCheckedKeys()
			let childArr = this.$refs.tree.getCheckedKeys()
			this.editForm.path = parentArr.concat(childArr).toString()
			this.$refs.editForm.validate(valid => {
				if (valid) {
					this.$axios.post('role/update', this.editForm).then(res => {
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
		deleteSubmit(row) {
			let that = this
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('role/delete/' + row.id, {}).then(res => {
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