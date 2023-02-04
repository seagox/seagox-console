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
				<el-table-column prop="cron" label="表达式" align="center"></el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					align="center"
					:formatter="statusFormatter"
				></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button
							type="text"
							size="small"
							@click="startTaskHandle(scope.row)"
							v-if="scope.row.status != 1"
							>启动</el-button
						>
						<el-divider direction="vertical" v-if="scope.row.status != 1"></el-divider>
						<el-button
							type="text"
							size="small"
							@click="stopTaskHandle(scope.row)"
							v-if="scope.row.status == 1"
							>暂停</el-button
						>
						<el-divider direction="vertical" v-if="scope.row.status == 1"></el-divider>
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
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="表达式" prop="cron">
					<el-input v-model="addForm.cron" placeholder="请输入表达式"></el-input>
				</el-form-item>
				<el-form-item label="规则" prop="script">
					<codemirrorGroovy v-model="addForm.script" placeholder="请输入规则" v-if="formRules" />
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
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="表达式" prop="cron">
					<el-input v-model="editForm.cron" placeholder="请输入表达式"></el-input>
				</el-form-item>
				<el-form-item label="规则" prop="script">
					<codemirrorGroovy v-model="editForm.script" placeholder="请输入规则" v-if="editFormVisible" />
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
import codemirrorGroovy from '@/views/components/codemirror/groovy'
export default {
	components: {
		codemirrorGroovy
	},
	data() {
		return {
			tableData: [],
			pageNo: 1,
			total: 0,
			addFormVisible: false,
			addForm: {
				name: '',
				cron: '',
				script: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				name: '',
				cron: '',
				script: ''
			},
			formRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				cron: [{ required: true, message: '请输入表达式', trigger: 'blur' }],
				script: [{ required: true, message: '请输入规则', trigger: 'blur' }]
			}
		}
	},
	created() {
		this.queryByPage()
	},
	methods: {
		statusFormatter(row) {
			if (row.status === 0) {
				return '未启动'
			} else if (row.status === 1) {
				return '已启动'
			} else {
				return row.status
			}
		},
		handleCurrentChange() {
			this.queryByPage()
		},
		queryByPage() {
			let that = this
			const params = {
				pageNo: this.pageNo
			}
			that.$axios.get('job/queryByPage', { params }).then(res => {
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
					that.$axios.post('job/insert', that.addForm).then(res => {
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
					that.$axios.post('job/update', that.editForm).then(res => {
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
				that.$axios.post('job/delete/' + row.id, {}).then(res => {
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
		startTaskHandle(row) {
			let that = this
			that.$axios.post('job/startJob/' + row.id, {}).then(res => {
				if (res.data.code == 200) {
					that.$message.success('启动成功')
					that.pageNo = 1
					that.queryByPage()
				} else {
					that.$message.error(res.data.message)
				}
			})
		},
		stopTaskHandle(row) {
			let that = this
			that.$axios.post('job/stopJob/' + row.id, {}).then(res => {
				if (res.data.code == 200) {
					that.$message.success('暂停成功')
					that.pageNo = 1
					that.queryByPage()
				} else {
					that.$message.error(res.data.message)
				}
			})
		}
	}
}
</script>