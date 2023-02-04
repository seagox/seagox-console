<template>
	<div>
		<el-container :style="'height:' + (clientHeight - 110) + 'px'">
			<el-aside width="250px" class="aside" style="padding-left:15px;padding-top:15px;">
				<div class="add-classify" @click="showAddTableDialog">
					<i class="el-icon-circle-plus"></i>
					<span style="margin-left:10px;">添加页面</span>
				</div>
				<el-table
					:data="tableData"
					highlight-current-row
					:show-header="false"
					@current-change="handleNodeClick"
					class="border"
					:max-height="clientHeight - 180"
				>
					<el-table-column show-overflow-tooltip>
						<template slot-scope="scope">
							<i class="el-icon-document" style="font-size:14px;"></i>
							<span style="font-size:14px;margin-left:8px;">{{scope.row.path}}</span>
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
			<el-main v-if="activeFlag" style="padding-right:15px">
				<div class="toolView">
					<el-button
						type="text"
						icon="el-icon-circle-check"
						@click="handleSave"
						size="medium"
						>保 存</el-button
					>
				</div>
				<el-tabs
					class="border-card"
					v-model="activeName"
					type="border-card"
					@tab-click="tabClick"
				>
					<el-tab-pane label="template" name="template">
						<codemirrorVue
							ref="codemirror"
							v-model="activeRow.html"
							placeholder="请输入template脚本"
							v-if="activeName === 'template'"
							:height="height"
						/>
					</el-tab-pane>
					<el-tab-pane label="script" name="script">
						<codemirrorVue
							ref="codemirror"
							v-model="activeRow.js"
							placeholder="请输入script脚本"
							v-if="activeName === 'script'"
							:height="height"
						/>
					</el-tab-pane>
					<el-tab-pane label="style" name="style">
						<codemirrorVue
							ref="codemirror"
							v-model="activeRow.css"
							placeholder="请输入style脚本"
							v-if="activeName === 'style'"
							:height="height"
						/>
					</el-tab-pane>
				</el-tabs>
			</el-main>
			<el-main v-else>
				<el-empty :image-size="200" style="height:100%;color:#5e6d82;" description="请点击左侧"></el-empty>
			</el-main>
		</el-container>
		<!--新增界面-->
		<el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="路径" prop="path">
					<el-input v-model="addForm.path" placeholder="请输入路径"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addTableSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="路径" prop="path">
					<el-input v-model="editForm.path" placeholder="请输入路径"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editTableSubmit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import codemirrorVue from '@/views/components/codemirror/vue'
export default {
	components: {
		codemirrorVue
	},
	data() {
		return {
			clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
			tableData: [],
			addFormVisible: false,
			addForm: {
				name: '',
				path: '',
				html: '',
				js: '',
				css: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				name: '',
				path: '',
				html: '',
				js: '',
				css: ''
			},
			rules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				path: [{ required: true, message: '请输入路径', trigger: 'blur' }]
			},
			activeFlag: false,
			activeRow: {},
			activeName: 'template',
			height: (document.documentElement.clientHeight || document.body.clientHeight) - 236
		}
	},
	mounted() {
		this.queryTable()
	},
	methods: {
		queryTable() {
			let that = this
			that.$axios.get('metaPage/queryByCompanyId').then(res => {
				if (res.data.code == 200) {
					that.tableData = res.data.data
				}
			})
		},
		handleNodeClick(row) {
			this.activeFlag = true
			this.activeRow = row || {}
			this.$nextTick(() => {
				if (row) {
					this.$refs.codemirror.editor.setSize('auto', 510)
					if (this.activeName === 'template') {
						this.$refs.codemirror.editor.setValue(this.activeRow.html || '')
					} else if (this.activeName === 'script') {
						this.$refs.codemirror.editor.setValue(this.activeRow.js || '')
					} else if (this.activeName === 'style') {
						this.$refs.codemirror.editor.setValue(this.activeRow.css || '')
					}
				} else {
					this.activeFlag = false
				}
			})
		},
		tabClick() {
			this.$nextTick(() => {
				this.$refs.codemirror.editor.setSize('auto', 510)
			})
		},
		handleCommand(command, row) {
			if (command === 'edit') {
				this.editForm = Object.assign({}, row)
				this.editFormVisible = true
				if (this.$refs.editForm) {
					this.$refs.editForm.resetFields()
				}
			} else if (command === 'delete') {
				this.deleteTableSubmit(row)
			}
		},
		showAddTableDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
		},
		addTableSubmit() {
			let that = this
			let params = that.addForm
			this.$refs.addForm.validate(valid => {
				if (valid) {
					that.$axios.post('metaPage/insert', params).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.addFormVisible = false
							that.queryTable()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		editTableSubmit() {
			let that = this
			this.$refs.editForm.validate(valid => {
				if (valid) {
					that.$axios.post('metaPage/update', that.editForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('修改成功')
							that.editFormVisible = false
							that.queryTable()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		deleteTableSubmit(row) {
			let that = this
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('metaPage/delete/' + row.id, { path: row.path }).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.activeFlag = false
						that.activeRow = {}
						that.queryTable()
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		},
		handleSave() {
			if (!this.activeRow.html) {
				this.$message.error('请输入template脚本')
				return
			}
			if (!this.activeRow.js) {
				this.$message.error('请输入script脚本')
				return
			}
			this.$axios.post('metaPage/update', this.activeRow).then(res => {
				if (res.data.code == 200) {
					this.$message.success('保存成功')
				} else {
					this.$message.error(res.data.message)
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
::v-deep .is-without-controls .el-input .el-input__inner {
	text-align: left;
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
.add-classify {
	border: 1px dashed #e5e9f2;
	border-radius: 6px;
	text-align: center;
	padding: 8px;
	margin-bottom: 15px;
	cursor: pointer;
}
.border-card {
	margin-left: 15px;
	border-radius: 8px;
}
::-webkit-scrollbar {
	width: 4px;
	height: 4px;
}
::-webkit-scrollbar-thumb {
	width: 4px;
	background: #ccc;
}
::-webkit-scrollbar-track {
	width: 4px;
	background: #eee;
}
</style>
