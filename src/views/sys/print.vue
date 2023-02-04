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
				<el-form-item label="数据源" prop="dataSourceValue">
					<el-select v-model="addForm.dataSourceValue" filterable multiple placeholder="请选择数据源">
						<el-option
							v-for="item in dataSourceOptions"
							:key="item.id"
							:label="item.comment"
							:value="String(item.id)"
						>
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
		<el-dialog title="编辑" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="数据源" prop="dataSourceValue">
					<el-select v-model="editForm.dataSourceValue" filterable multiple placeholder="请选择数据源">
						<el-option
							v-for="item in dataSourceOptions"
							:key="item.id"
							:label="item.comment"
							:value="String(item.id)"
						>
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
				dataSource: '',
				dataSourceValue: []
			},
			editFormVisible: false,
			editForm: {
				id: '',
				name: '',
				dataSource: '',
				dataSourceValue: []
			},
			formRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				dataSourceValue: [{ required: true, message: '请选择数据源', trigger: 'change' }]
			},
			dataSourceOptions: []
		}
	},
	created() {
		this.queryByPage()
		this.queryBusinessTable()
	},
	methods: {
		queryByPage() {
			let that = this
			const params = {
				pageNo: this.pageNo
			}
			that.$axios.get('jellyPrint/queryByPage', { params }).then(res => {
				if (res.data.code == 200) {
					that.tableData = res.data.data.list
					that.total = res.data.data.total
				}
			})
		},
		async queryBusinessTable() {
			let res = await this.$axios.get('businessTable/queryAll')
			if (res.data.code == 200) {
				this.dataSourceOptions = res.data.data
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
			this.$refs.addForm.validate(valid => {
				if (valid) {
					var params = {
						name: that.addForm.name,
						dataSource: that.addForm.dataSourceValue.toString()
					}
					that.$axios.post('jellyPrint/insert', params).then(res => {
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
			this.$set(this.editForm, 'dataSourceValue', this.editForm.dataSource.split(','))
		},
		editSubmit() {
			let that = this
			this.$refs.editForm.validate(valid => {
				if (valid) {
					var params = {
						id: that.editForm.id,
						name: that.editForm.name,
						dataSource: that.editForm.dataSourceValue.toString()
					}
					that.$axios.post('jellyPrint/update', params).then(res => {
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
			let that = this
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('jellyPrint/delete/' + row.id, {}).then(res => {
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