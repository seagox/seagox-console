<template>
	<div>
		<el-container :style="'height:' + (clientHeight - 110) + 'px'">
			<el-aside width="240px" class="aside" style="padding-left:15px;padding-top:15px">
				<div class="add-classify" @click="showAddClassifyDialog">
					<i class="el-icon-circle-plus"></i>
					<span style="margin-left:10px;">添加分类</span>
				</div>
				<el-table
					:data="treeData"
					highlight-current-row
					:show-header="false"
					@current-change="handleNodeClick"
					class="border"
					:max-height="clientHeight - 180"
				>
					<el-table-column show-overflow-tooltip>
						<template slot-scope="scope">
							<i class="el-icon-document" style="font-size:14px;"></i>
							<span style="font-size:14px;margin-left:8px;">{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column width="45" align="center">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand($event, scope.row)">
								<span class="el-dropdown-link">
									<i class="el-icon-more"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item icon="el-icon-edit" command="edit">编辑</el-dropdown-item>
									<el-dropdown-item icon="el-icon-delete" command="delete">删除</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</el-aside>
			<el-main>
				<div class="toolView">
					<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
				</div>
				<div class="table">
					<!--列表-->
					<el-table :data="tableData" border highlight-current-row stripe>
						<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
						<el-table-column
							prop="name"
							label="名称"
							align="center"
							show-overflow-tooltip
						></el-table-column>
						<el-table-column prop="code" label="字典值" align="center"></el-table-column>
						<el-table-column prop="sort" label="排序号" align="center"></el-table-column>
						<el-table-column label="状态" align="center">
							<template slot-scope="scope">
								<el-switch
									v-model="scope.row.status"
									:active-value="1"
									:inactive-value="0"
									@change="statusChange($event, scope.row)"
								></el-switch>
							</template>
						</el-table-column>
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
			</el-main>
		</el-container>
		<!--新增界面-->
		<el-dialog title="新增" width="500px" :visible.sync="addClassifyFormVisible" :close-on-click-modal="false">
			<el-form :model="addClassifyForm" label-width="80px" :rules="formRules" ref="addClassifyForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="addClassifyForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="排序号" prop="sort">
					<el-input-number v-model="addClassifyForm.sort" placeholder="请输入排序号"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addClassifyFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addClassifySubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="500px" :visible.sync="editClassifyFormVisible" :close-on-click-modal="false">
			<el-form :model="editClassifyForm" label-width="80px" :rules="formRules" ref="editClassifyForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="editClassifyForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="排序号" prop="sort">
					<el-input-number v-model="editClassifyForm.sort" placeholder="请输入排序号"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editClassifyFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editClassifySubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="字典值" prop="code">
					<el-input v-model="addForm.code" placeholder="请输入字典值"></el-input>
				</el-form-item>
				<el-form-item label="排序号" prop="sort">
					<el-input-number v-model="addForm.sort" placeholder="请输入排序号"></el-input-number>
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
				<el-form-item label="字典值" prop="code">
					<el-input v-model="editForm.code" placeholder="请输入字典值"></el-input>
				</el-form-item>
				<el-form-item label="排序号" prop="sort">
					<el-input-number v-model="editForm.sort" placeholder="请输入排序号"></el-input-number>
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
			clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
			treeData: [],
			addClassifyFormVisible: false,
			addClassifyForm: {
				name: '',
				sort: 1
			},
			editClassifyFormVisible: false,
			editClassifyForm: {
				id: '',
				name: '',
				sort: ''
			},
			classifyId: '',
			tableData: [],
			pageNo: 1,
			total: 0,
			addFormVisible: false,
			addForm: {
				classifyId: '',
				name: '',
				code: 1,
				sort: 1
			},
			editFormVisible: false,
			editForm: {
				id: '',
				classifyId: '',
				name: '',
				code: '',
				sort: ''
			},
			formRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				code: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
				sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
			}
		}
	},
	mounted() {
		this.queryClassify()
	},
	methods: {
		queryClassify() {
			let that = this
			that.$axios.get('dictionaryClassify/queryDisplay').then(res => {
				if (res.data.code == 200) {
					that.treeData = res.data.data
				}
			})
		},
		handleNodeClick(row) {
			if (row) {
				this.classifyId = row.id
				this.queryByPage()
			}
		},
		handleCommand(command, row) {
			if (command === 'edit') {
				this.editClassifyForm = Object.assign({}, row)
				this.editClassifyFormVisible = true
				if (this.$refs.editClassifyForm) {
					this.$refs.editClassifyForm.resetFields()
				}
			} else if (command === 'delete') {
				this.deleteClassifySubmit(row)
			}
		},
		queryByPage() {
			let that = this
			const params = {
				pageNo: this.pageNo,
				classifyId: this.classifyId
			}
			that.$axios.get('dictionaryDetail/queryByPage', { params }).then(res => {
				if (res.data.code == 200) {
					that.tableData = res.data.data.list
					that.total = res.data.data.total
				}
			})
		},
		handleCurrentChange(val) {
			this.queryByPage()
		},
		showAddClassifyDialog() {
			this.addClassifyFormVisible = true
			if (this.$refs.addClassifyForm) {
				this.$refs.addClassifyForm.resetFields()
			}
			this.addClassifyForm.sort = this.treeData.length + 1
		},
		addClassifySubmit() {
			let that = this
			this.$refs.addClassifyForm.validate(valid => {
				if (valid) {
					that.$axios.post('dictionaryClassify/insert', that.addClassifyForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.addClassifyFormVisible = false
							that.queryClassify()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		editClassifySubmit() {
			let that = this
			this.$refs.editClassifyForm.validate(valid => {
				if (valid) {
					that.$axios.post('dictionaryClassify/update', that.editClassifyForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('修改成功')
							that.editClassifyFormVisible = false
							that.queryClassify()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		deleteClassifySubmit(row) {
			if (this.classifyId) {
				let that = this
				this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
					that.$axios.post('dictionaryClassify/delete/' + row.id, {}).then(res => {
						if (res.data.code == 200) {
							that.$message.success('删除成功')
							that.queryClassify()
						} else {
							that.$message.error(res.data.message)
						}
					})
				})
			} else {
				this.$message.error('请选择字典分类')
			}
		},
		//显示新增界面
		showAddDialog() {
			if (this.classifyId) {
				this.addFormVisible = true
				if (this.$refs.addForm) {
					this.$refs.addForm.resetFields()
				}
				this.addForm.classifyId = this.classifyId
			} else {
				this.$message.error('请选择字典分类')
			}
			this.addForm.code = this.total + 1
			this.addForm.sort = this.total + 1
		},
		//新增
		addSubmit() {
			let that = this
			this.$refs.addForm.validate(valid => {
				if (valid) {
					that.$axios.post('dictionaryDetail/insert', that.addForm).then(res => {
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
					that.$axios.post('dictionaryDetail/update', that.editForm).then(res => {
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
				that.$axios.post('dictionaryDetail/delete/' + row.id, {}).then(res => {
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
		// 状态改变
		statusChange(value, row) {
			let that = this
			that.$axios.post('dictionaryDetail/update', row).then(res => {
				if (res.data.code == 200) {
					that.$message.success('修改成功')
				} else {
					that.$message.error(res.data.message)
				}
			})
		}
	}
}
</script>
<style scoped>
::v-deep .el-main {
	border-left: 1px solid #e5e9f2;
	padding: 0px;
	margin-left: 15px;
}
.add-classify {
	border: 1px dashed #e5e9f2;
	border-radius: 6px;
	text-align: center;
	padding: 8px;
	margin-bottom: 15px;
	cursor: pointer;
}
::v-deep .el-table__body tr.current-row td:not(.is-center) {
	border-top-left-radius: 8px !important;
	border-bottom-left-radius: 8px !important;
}
::v-deep .el-aside .el-table__body tr.current-row .is-center {
	border-top-right-radius: 8px !important;
	border-bottom-right-radius: 8px !important;
}
::v-deep .aside .el-table td {
	border-bottom: 0px solid #ebeef5;
}
</style>
