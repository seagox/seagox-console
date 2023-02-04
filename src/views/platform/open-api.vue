<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
		</div>
		<div class="table">
			<!--列表-->
			<el-table :data="tableData" border>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="appid" label="appid" align="center"></el-table-column>
				<el-table-column prop="secret" label="secret" align="center"></el-table-column>
				<el-table-column prop="remark" label="备注" align="center"></el-table-column>
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
		<el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-form-item label="appid" prop="appid">
					<el-input v-model="addForm.appid" placeholder="请输入appid"></el-input>
				</el-form-item>
				<el-form-item label="secret" prop="secret">
					<el-input v-model="addForm.secret" placeholder="请输入secret"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark"  type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="请输入备注"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-form-item label="appid" prop="appid">
					<el-input v-model="editForm.appid" placeholder="请输入appid"></el-input>
				</el-form-item>
				<el-form-item label="secret" prop="secret">
					<el-input v-model="editForm.secret" placeholder="请输入secret"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark"  type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="请输入备注"></el-input>
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
				appid: '',
				secret: '',
				remark: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				appid: '',
				secret: '',
				remark: ''
			},
			formRules: {
				appid: [
					{ required: true, message: '请输入appid', trigger: 'blur' },
					{ min: 16, max: 16, message: 'appid长度要16字符', trigger: 'blur' }
				],
				secret: [
					{ required: true, message: '请输入secret', trigger: 'blur' },
					{ min: 32, max: 32, message: 'secret长度要32字符', trigger: 'blur' }
				],
				remark: [
					{ required: true, message: '请输入备注', trigger: 'blur' }
				]
			}
		}
	},
	created() {
		this.queryByPage()
	},
	methods: {
		handleCurrentChange() {
			this.queryByPage()
		},
		queryByPage() {
			let that = this
			const params = {
				pageNo: this.pageNo
			}
			that.$axios.get('jellyOpenApi/queryByPage', { params }).then(res => {
				if (res.data.code == 200) {
					that.tableData = res.data.data.list
					that.total = res.data.data.total
				}
			})
		},
		showAddDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
		},
		addSubmit() {
			let that = this
			this.$refs.addForm.validate(valid => {
				if (valid) {
					that.$axios.post('jellyOpenApi/insert', that.addForm).then(res => {
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
			let that = this
			this.editForm = Object.assign({}, row)
			this.editFormVisible = true
			if (this.$refs.editForm) {
				this.$refs.editForm.resetFields()
			}
		},
		editSubmit() {
			let that = this
			this.$refs.editForm.validate(valid => {
				if (valid) {
					that.$axios.post('jellyOpenApi/update', that.editForm).then(res => {
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
				that.$axios.post('jellyOpenApi/delete/' + row.id, {appid: row.appid}).then(res => {
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