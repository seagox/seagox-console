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
				:max-height="clientHeight - 168"
			>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="表名" align="center"></el-table-column>
				<el-table-column prop="remark" label="注释" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column label="操作" align="center" width="160">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showDesign(scope.row)">设计表</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--新增界面-->
		<el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
				<el-form-item label="表名" prop="name">
					<el-input v-model="addForm.name" placeholder="请输入表名">
						<template slot="prepend">{{ mark }}</template>
					</el-input>
				</el-form-item>
				<el-form-item label="注释" prop="remark">
					<el-input v-model="addForm.remark" placeholder="请输入注释"></el-input>
				</el-form-item>
				<el-form-item label="初始化">
					<el-checkbox-group v-model="initialize">
						<!-- <el-checkbox label="is_valid">是否有效(1:是;2:否;)</el-checkbox> -->
						<el-checkbox label="is_submit">是否有流程</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
				<el-form-item label="表名" prop="name">
					<el-input v-model.trim="editForm.name" placeholder="请输入表名"></el-input>
				</el-form-item>
				<el-form-item label="注释" prop="remark">
					<el-input v-model="editForm.remark" placeholder="请输入注释"></el-input>
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
			tableData: [],
			addFormVisible: false,
			addForm: {
				name: '',
				remark: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				name: '',
				remark: ''
			},
			rules: {
				name: [
					{ required: true, message: '请输入表名', trigger: 'blur' },
					{ pattern: /^[a-z_]{1,}$/, message: '只能输入小写英文字母或下划线' }
				],
				remark: [{ required: true, message: '请输入注释', trigger: 'blur' }]
			},
			initialize: ['company_id', 'user_id']
		}
	},
	computed: {
		mark() {
			return localStorage.getItem('mark') + '_'
		}
	},
	created() {
		this.queryAll()
	},
	methods: {
		async queryAll() {
			let res = await this.$axios.get('businessTable/queryAll')
			if (res.data.code == 200) {
				this.tableData = res.data.data
			}
		},
		//显示新增界面
		showAddDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
			this.initialize = ['company_id', 'user_id']
		},
		//新增
		addSubmit() {
			let params = this.addForm
			params.initialize = this.initialize.toString()
			this.$refs.addForm.validate(valid => {
				if (valid) {
					this.$axios.post('businessTable/insert', params).then(res => {
						if (res.data.code == 200) {
							this.$message.success('新增成功')
							this.addFormVisible = false
							this.queryAll()
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
		},
		//编辑
		editSubmit() {
			this.$refs.editForm.validate(valid => {
				if (valid) {
					this.$axios.post('businessTable/update', this.editForm).then(res => {
						if (res.data.code == 200) {
							this.$message.success('修改成功')
							this.editFormVisible = false
							this.queryAll()
						} else {
							this.$message.error(res.data.message)
						}
					})
				}
			})
		},
		deleteSubmit(row) {
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				this.$axios.post('businessTable/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						this.$message.success('删除成功')
						this.queryAll()
					} else {
						this.$message.error(res.data.message)
					}
				})
			})
		},
		showDesign(row) {
			this.$router.push({
				path: '/businessField',
				query: {
					businessTableId: row.id
				}
			})
		}
	}
}
</script>