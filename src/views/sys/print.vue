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
						<el-button type="text" size="small" @click="designSubmit(scope.row)">设计</el-button>
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
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
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
				name: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				name: ''
			},
			formRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
			}
		}
	},
	created() {
		this.queryByPage()
	},
	methods: {
		async queryByPage() {
			const params = {
				pageNo: this.pageNo
			}
			let res = await this.$axios.get('jellyPrint/queryByPage', { params })
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
			this.$refs.addForm.validate(valid => {
				if (valid) {
					this.$axios.post('jellyPrint/insert', this.addForm).then(res => {
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
					this.$axios.post('jellyPrint/update', this.editForm).then(res => {
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
		designSubmit(row) {
			//高级版
			this.$router.push({
				path: '/printDesign',
				query: {
					id: row.id,
                    type: 'print'
				}
			})
		},
		deleteSubmit(row) {
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				this.$axios.post('jellyPrint/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						this.$message.success('删除成功')
						this.pageNo = 1
						this.queryByPage()
					} else {
						this.$message.error(res.data.message)
					}
				})
			})
		}
	}
}
</script>