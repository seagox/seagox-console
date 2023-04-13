<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
		</div>
		<div class="table">
			<!--列表-->
			<el-table :data="tableData" border highlight-current-row stripe>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column label="操作" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="handlePreview(scope.row)">预览</el-button>
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
				<el-col :span="24">
					<el-form-item label="名称" prop="name">
						<el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="云函数" prop="dataSource">
						<el-select v-model="addForm.dataSource" filterable placeholder="请选择云函数">
							<el-option
								v-for="item in metaFunctionOptions"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="打印模板" prop="templateSource">
						<el-upload
							:limit="1"
							:action="action"
							:headers="headers"
							:file-list="addForm.templateSource"
							list-type="picture-card"
							:before-upload="beforeUpload"
							:class="addForm.templateSource.length === 1 ? 'upload-disabled' : ''"
							:on-success="handleFileSuccess"
						>
							<i class="el-icon-plus"></i>
							<div slot="file" slot-scope="{ file }">
								<img class="el-upload-list__item-thumbnail" src="@/assets/fileType/word.svg" v-if="file.type === 'word'"/>
								<img class="el-upload-list__item-thumbnail" src="@/assets/fileType/excel.svg" v-else/>
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-delete" @click="handleFileDownload(file)">
										<i class="el-icon-download"></i>
									</span>
									<span class="el-upload-list__item-delete" @click="handleFileRemove(file)">
										<i class="el-icon-delete"></i>
									</span>
								</span>
							</div>
						</el-upload>
					</el-form-item>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-col :span="24">
					<el-form-item label="名称" prop="name">
						<el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="云函数" prop="dataSource">
						<el-select v-model="editForm.dataSource" filterable placeholder="请选择云函数">
							<el-option
								v-for="item in metaFunctionOptions"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="打印模板" prop="templateSource">
						<el-upload
							:limit="1"
							:action="action"
							:headers="headers"
							:file-list="editForm.templateSource"
							list-type="picture-card"
							:before-upload="beforeUpload"
							:class="editForm.templateSource.length === 1 ? 'upload-disabled' : ''"
							:on-success="handleFileSuccess"
						>
							<i class="el-icon-plus"></i>
							<div slot="file" slot-scope="{ file }">
								<img class="el-upload-list__item-thumbnail" src="@/assets/fileType/word.svg" v-if="file.type === 'word'"/>
								<img class="el-upload-list__item-thumbnail" src="@/assets/fileType/excel.svg" v-else/>
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-delete" @click="handleFileDownload(file)">
										<i class="el-icon-download"></i>
									</span>
									<span class="el-upload-list__item-delete" @click="handleFileRemove(file)">
										<i class="el-icon-delete"></i>
									</span>
								</span>
							</div>
						</el-upload>
					</el-form-item>
				</el-col>
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
			action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
			headers: {
				Authorization: window.localStorage.getItem('Authorization')
			},
			tableData: [],
			pageNo: 1,
			total: 0,
			metaFunctionOptions: [],
			addFormVisible: false,
			addForm: {
				name: '',
				dataSource: '',
				templateSource: []
			},
			editFormVisible: false,
			editForm: {
				id: '',
				name: '',
				dataSource: '',
				templateSource: []
			},
			formRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				dataSource: [{ required: true, message: '请选择云函数', trigger: 'change' }],
				templateSource: [{ required: true, message: '请选择打印模板', trigger: 'change' }]
			}
		}
	},
	created() {
		this.queryByPage()
		this.queryMetaFunction()
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
		async queryMetaFunction() {
			const params = {
				type: 5
			}
            let res = await this.$axios.get('metaFunction/queryByCompanyId', {params})
            if (res.data.code === 200) {
                this.metaFunctionOptions = res.data.data
            }
        },
		typeFormatter(row) {
			if(row.type == 1) {
				return 'word'
			} else {
				return 'excel'
			}
		},
		handleCurrentChange() {
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
					var params = {
						name: this.addForm.name,
						dataSource: this.addForm.dataSource,
						templateSource: JSON.stringify(this.addForm.templateSource)
					}
					this.$axios.post('jellyPrint/insert', params).then(res => {
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
			this.editForm.templateSource = JSON.parse(this.editForm.templateSource)
			this.editFormVisible = true
			if (this.$refs.editForm) {
				this.$refs.editForm.resetFields()
			}
		},
		editSubmit() {
			this.$refs.editForm.validate(valid => {
				if (valid) {
					var params = {
						id: this.editForm.id,
						name: this.editForm.name,
						dataSource: this.editForm.dataSource,
						templateSource: JSON.stringify(this.editForm.templateSource)
					}
					this.$axios.post('jellyPrint/update', params).then(res => {
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
		},
		beforeUpload(file) {
			let pattern = /.(docx|xls|xlsx)$/g
			if (!pattern.test(file.name)) {
				this.$message.error('只能上传docx、xls、xlsx文件')
				return false
			}
			const fileSize = file.size / 1024 / 1024 < 10
			if (!fileSize) {
				this.$message.error('上传文件大小不能超过 10MB')
				return false
			}
			return true
		},
		//获取文件类型
		getFileType(suffix) {
			let result = ''
			// 匹配 excel
			const excelist = ['xls', 'xlsx']
			result = excelist.find(item => item === suffix)
			if (result) {
				return 'excel'
			}
			// 匹配 word
			const wordlist = ['docx']
			result = wordlist.find(item => item === suffix)
			if (result) {
				return 'word'
			}
			// 其他 文件类型
			return 'other'
		},
		handleFileSuccess(res, file) {
			if (res.code === 200) {
				var suffix = file.name.split('.')[1].toLocaleLowerCase()
				if(this.addFormVisible) {
					let fileArray = this.addForm.templateSource
					fileArray.push({
						type: this.getFileType(suffix),
						name: file.name,
						size: file.size,
						url: res.data
					})
					this.addForm.templateSource = fileArray
				} else {
					let fileArray = this.editForm.templateSource
					fileArray.push({
						type: this.getFileType(suffix),
						name: file.name,
						size: file.size,
						url: res.data
					})
					this.editForm.templateSource = fileArray
				}
			} else {
				this.$message.error(res.message)
			}
		},
		handleFileDownload(file) {
			let params = {
				url: file.url,
				fileName: file.name
			}
			this.$axios.post('upload/download', params, { responseType: 'blob' }).then(res => {
				let content = res.data
				let blob = new Blob([content])
				if ('download' in document.createElement('a')) {
					// 非IE下载
					let elink = document.createElement('a')
					elink.download = file.name
					elink.style.display = 'none'
					elink.href = URL.createObjectURL(blob)
					document.body.appendChild(elink)
					elink.click()
					URL.revokeObjectURL(elink.href) // 释放URL 对象
					document.body.removeChild(elink)
				} else {
					// IE10+下载
					navigator.msSaveBlob(blob, file.name)
				}
			})
		},
		handleFileRemove() {
			if(this.addFormVisible) {
				this.addForm.templateSource = []
			} else {
				this.editForm.templateSource = []
			}
		},
		handlePreview(row) {
			window.open(window.platform.url + 'upload/print/' + row.id)
        }
	}
}
</script>

<style scoped>
::v-deep .upload-disabled .el-upload--picture-card {
	display: none;
}
</style>
