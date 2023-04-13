<template>
	<div class="container">
		<el-steps :active="active" finish-status="success" align-center>
			<el-step title="基础设置"></el-step>
			<el-step title="模板设置"></el-step>
			<el-step title="搜索条件"></el-step>
		</el-steps>
		<el-form
			:model="form"
			:rules="rules"
			ref="ruleForm"
			label-width="100px"
			style="margin-top:20px;"
			v-show="active === 0"
		>
			<el-col :span="12">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="form.name" placeholder="请输入名称"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="图标" prop="icon">
                    <div class="inside-input">
                        <div class="iconView">
                            <div v-html="form.icon"></div>
                        </div>
                        <i class="el-icon-document-copy iconE" @click="handleIconDialog"></i>
                    </div>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="颜色" prop="color">
					<el-color-picker v-model="form.color" :predefine="predefine"></el-color-picker>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="模板引擎" prop="dataSource">
					<el-select v-model="form.dataSource" filterable placeholder="请选择模板引擎">
						<el-option
							v-for="item in datasetOptions"
							:key="item.id"
							:label="item.name"
							:value="String(item.id)"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="24">
				<el-form-item label="导出模版">
					<el-upload
						:limit="1"
						:action="action"
						:headers="headers"
						:file-list="form.exportPath"
						list-type="picture-card"
						:before-upload="beforeUpload"
						:class="form.exportPath.length === 1 ? 'upload-disabled' : ''"
						:on-success="handleFileSuccess"
					>
						<i class="el-icon-plus"></i>
						<div slot="file" slot-scope="{ file }">
							<img class="el-upload-list__item-thumbnail" src="@/assets/fileType/excel.svg" />
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
		<div v-show="active === 1">
			<el-form :inline="true" :model="textForm" style="margin-top:5px;">
                <el-form-item label="表">
                    <el-select v-model="textForm.tableId" placeholder="请选择表" filterable @change="handleTableChange">
                        <el-option
                            v-for="item in tableOptions"
                            :key="item.id"
                            :label="item.remark + '(' + item.name + ')'"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段">
                    <el-select v-model="textForm.field" placeholder="请选择字段" filterable>
                        <el-option
                            v-for="item in fieldOptions"
                            :key="item.name"
                            :label="item.remark + '(' + item.name + ')'"
                            :value="item.name"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button icon="el-icon-plus" @click="setCellText">插入</el-button>
            </el-form>
			<div id="spreadsheet"></div>
		</div>
		<div v-show="active === 2" class="table">
			<div class="toolView" style="margin-bottom:15px">
				<el-button icon="el-icon-plus" @click="showSearchAddDialog" size="small">新增</el-button>
			</div>
			<el-table :data="searchTableData" border highlight-current-row stripe max-height="500">
				<el-table-column prop="field" label="字段" align="center"></el-table-column>
				<el-table-column prop="type" label="类型" align="center" :formatter="typeFormatter"></el-table-column>
				<el-table-column prop="desc" label="说明" align="center"></el-table-column>
				<el-table-column prop="status" label="状态" align="center" :formatter="statusFormatter"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="showSearchEditDialog(scope.$index, scope.row)" size="small"
							>编辑</el-button
						>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" @click="searchDelSubmit(scope.$index)" size="small">删除</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" @click="moveUp(scope.$index)" size="small">上移</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" @click="moveDown(scope.$index)" size="small">下移</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div style="margin-top:15px;float:right;">
			<el-button type="primary" v-if="active == 1" @click="settingFormVisible = true">行列</el-button>
			<el-button @click="handleLast" v-if="active != 0">上一步</el-button>
			<el-button type="primary" @click="handleNext" v-if="active != 2">下一步</el-button>
			<el-button type="primary" @click="submitForm">保存</el-button>
		</div>
		<el-dialog title="新增" width="500px" :visible.sync="addSearchVisible" :close-on-click-modal="false">
			<el-form :model="addSearchForm" label-width="80px" :rules="searchRules" ref="addSearchForm">
				<el-form-item label="字段" prop="field">
					<el-input v-model="addSearchForm.field" placeholder="请输入字段"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="addSearchForm.type" placeholder="请选择类型" @change="handleTypeChange">
						<el-option
							v-for="item in typeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="说明" prop="desc">
					<el-input
						v-model="addSearchForm.desc"
						placeholder="请输入说明"
						maxlength="5"
						show-word-limit
					></el-input>
				</el-form-item>
				<el-form-item label="数据源" prop="source" filterable v-if="addSearchForm.type === 'select'">
					<el-select
						v-model="addSearchForm.source"
						placeholder="请选择数据源"
						clearable
						@change="sourceChange"
						filterable
					>
						<el-option v-for="item in formatterOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="数据源" prop="source" filterable v-if="addSearchForm.type === 'cascader'">
					<el-select v-model="editSearchForm.source" placeholder="请选择数据源" clearable filterable>
						<el-option
							v-for="item in tableOptions"
							:key="item.id"
							:label="item.remark + '(' + item.name + ')'"
							:value="item.id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="规则" prop="rule" v-if="addSearchForm.type === 'cascader'">
					<el-input v-model="addSearchForm.rule" placeholder="请输入规则"></el-input>
				</el-form-item>
				<el-form-item
					label="是否多选"
					v-if="
						addSearchForm.type === 'select' ||
							addSearchForm.type === 'company' ||
							addSearchForm.type === 'department' ||
							addSearchForm.type === 'cascader'
					"
				>
					<el-switch v-model="addSearchForm.multiple"></el-switch>
				</el-form-item>
				<el-form-item label="日期类型" v-if="addSearchForm.type === 'datePicker'" prop="dateType">
					<el-select v-model="addSearchForm.dateType" placeholder="请选择日期类型">
						<el-option label="年" value="year|yyyy"></el-option>
						<el-option label="年-月" value="month|yyyy-MM"></el-option>
						<el-option label="年-月-日" value="date|yyyy-MM-dd"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否显示">
					<el-switch v-model="addSearchForm.status"> </el-switch>
				</el-form-item>
				<el-form-item label="默认值" prop="defaultValue">
					<el-input v-model="addSearchForm.defaultValue" placeholder="请输入默认值" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addSearchVisible = false">取消</el-button>
				<el-button type="primary" @click="addSearchSubmit">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="编辑" width="500px" :visible.sync="editSearchVisible" :close-on-click-modal="false">
			<el-form :model="editSearchForm" label-width="80px" :rules="searchRules" ref="editSearchForm">
				<el-form-item label="字段" prop="field">
					<el-input v-model="editSearchForm.field" placeholder="请输入字段"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="editSearchForm.type" placeholder="请选择类型" @change="handleTypeChange">
						<el-option
							v-for="item in typeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="说明" prop="desc">
					<el-input
						v-model="editSearchForm.desc"
						placeholder="请输入说明"
						maxlength="5"
						show-word-limit
					></el-input>
				</el-form-item>
				<el-form-item label="数据源" prop="source" filterable v-if="editSearchForm.type === 'select'">
					<el-select
						v-model="editSearchForm.source"
						placeholder="请选择数据源"
						clearable
						@change="sourceChange"
						filterable
					>
						<el-option v-for="item in formatterOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="数据源" prop="source" filterable v-if="editSearchForm.type === 'cascader'">
					<el-select v-model="editSearchForm.source" placeholder="请选择数据源" clearable filterable>
						<el-option
							v-for="item in tableOptions"
							:key="item.id"
							:label="item.remark + '(' + item.name + ')'"
							:value="item.id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="规则" prop="rule" v-if="editSearchForm.type === 'cascader'">
					<el-input v-model="editSearchForm.rule" placeholder="请输入规则"></el-input>
				</el-form-item>
				<el-form-item
					label="是否多选"
					v-if="
						editSearchForm.type === 'select' ||
							editSearchForm.type === 'company' ||
							editSearchForm.type === 'department' ||
							editSearchForm.type === 'cascader'
					"
				>
					<el-switch v-model="editSearchForm.multiple"></el-switch>
				</el-form-item>
				<el-form-item label="日期类型" v-if="editSearchForm.type === 'datePicker'" prop="dateType">
					<el-select v-model="editSearchForm.dateType" placeholder="请选择日期类型">
						<el-option label="年" value="year|yyyy"></el-option>
						<el-option label="年-月" value="month|yyyy-MM"></el-option>
						<el-option label="年-月-日" value="date|yyyy-MM-dd"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否显示">
					<el-switch v-model="editSearchForm.status"> </el-switch>
				</el-form-item>
				<el-form-item label="默认值" prop="defaultValue">
					<el-input v-model="editSearchForm.defaultValue" placeholder="请输入默认值" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editSearchVisible = false">取消</el-button>
				<el-button type="primary" @click="editSearchSubmit">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="设置" width="500px" :visible.sync="settingFormVisible" :close-on-click-modal="false">
			<el-form ref="settingForm" :model="workbook" :rules="rules" label-width="60px">
				<el-form-item label="行" prop="row">
					<el-input v-model="workbook.row" type="number" placeholder="请输入行"></el-input>
				</el-form-item>
				<el-form-item label="列" prop="col">
					<el-input v-model="workbook.col" type="number" placeholder="请输入列"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="settingFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="settingFormVisible = false">保存</el-button>
			</div>
		</el-dialog>
        <!--图标选择界面-->
        <el-dialog title="图标选择" width="950px" :visible.sync="iconFormVisible" :close-on-click-modal="false">
			<el-form label-width="65px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="名称">
							<el-input v-model="searchIconName" clearable placeholder="请输入名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="3">
						<el-button
							type="primary"
							icon="el-icon-search"
							@click.native="handleCurrentChange"
							style="margin-left: 15px"
						>查询</el-button
						>
					</el-col>
				</el-row>
			</el-form>
            <el-scrollbar style="height:100%">
                <el-row>
                    <el-col
                        :span="4"
                        v-for="(item, index) in iconData"
                        :key="index"
                        style="margin-bottom: 15px; cursor: pointer;padding-right:15px;box-sizing:border-box"
                    >
                        <el-card shadow="hover">
                            <div @click="handleIconClick(item)" style="display:flex;align-items: center;">
                                <i v-html="item.content" style="display:flex;align-items: center;"></i>
                                <span style="margin-left:15px;">{{ item.name }}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-scrollbar>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :current-page.sync="pageNo"
                    :page-size.sync="pageSize"
                    :total="total"
                >
                </el-pagination>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import Spreadsheet from 'x-data-spreadsheet'
import zhCN from 'x-data-spreadsheet/dist/locale/zh-cn'
export default {
	data() {
		return {
			action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
			headers: {
				Authorization: window.localStorage.getItem('Authorization')
			},
			active: 0,
			form: {
				name: '',
				icon: '',
				color: '#1879fe',
				dataSource: '',
				templateSource: '',
				searchJson: '',
				exportPath: []
			},
			searchTableData: [],
			addSearchVisible: false,
			addSearchForm: {
				type: '',
				field: '',
				desc: '',
				source: '',
				rule: '',
				status: true,
				defaultValue: ''
			},
			editSearchVisible: false,
			editSearchForm: {
				type: '',
				field: '',
				desc: '',
				source: '',
				rule: '',
				status: true,
				defaultValue: ''
			},
			searchRules: {
				type: [{ required: true, message: '请选择类型', trigger: 'change' }],
				field: [{ required: true, message: '请输入字段', trigger: 'blur' }],
				desc: [{ required: true, message: '请输入说明', trigger: 'blur' }],
				source: [{ required: true, message: '请选择数据源', trigger: 'change' }],
				dateType: [{ required: true, message: '请选择日期类型', trigger: 'change' }],
				rule: [{ required: true, message: '请输入规则', trigger: 'blur' }]
			},
			currentSearchIndex: -1,
			typeOptions: [
				{
					label: '输入框',
					value: 'input'
				},
				{
					label: '下拉选择',
					value: 'select'
				},
				{
					label: '日期选择',
					value: 'datePicker'
				},
				{
					label: '单位选择',
					value: 'company'
				},
				{
					label: '部门选择',
					value: 'department'
				},
				{
					label: '级联选择',
					value: 'cascader'
				}
			],
			formatterOptions: [],
			tableOptions: [],
			datasetOptions: [],
			rules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				icon: [{ required: true, message: '请输入图标', trigger: 'blur' }],
				color: [{ required: true, message: '请选择颜色', trigger: 'blur' }],
				dataSource: [{ required: true, message: '请选择数据源', trigger: 'change' }],
				row: [
					{ required: true, message: '请输入行', trigger: 'blur' },
					{ pattern: /^(1|[1-9]\d?|100)$/, message: '范围在1-100', trigger: 'blur' }
				],
				col: [
					{ required: true, message: '请输入列', trigger: 'blur' },
					{ pattern: /^(1|[1-9]\d?|26)$/, message: '范围在1-20', trigger: 'blur' }
				]
			},
			predefine: ['#1879fe', '#5d0bc7', '#1700c2', '#1cb6b4', '#35a110', '#f5b017', '#ee6c16', '#ef0022'],
			excelOption: {
				showBottomBar: false,
				row: {
					height: 32,
					len: 200
				},
				col: {
					width: 120,
					len: 130
				}
			},
			workbook: {
				row: 10,
				col: 6,
				data: {},
				module: {}
			},
			xs: null,
			rowIndex: 0,
			colIndex: 0,
			settingFormVisible: false,
            iconFormVisible: false,
            pageSize: 30,
            pageNo: 1,
            total: 0,
            searchIconName: '',
            iconData: [],
			fieldOptions: [],
			textForm: {
                tableId: '',
                field: ''
            }
		}
	},
	created() {
		this.queryFormatter()
		this.queryTable()
		this.queryDataSet()
	},
	mounted() {
		Spreadsheet.locale('zh-cn')
	},
	methods: {
		async queryFormatter() {
			let res = await this.$axios.get('dictionaryClassify/queryDisplay')
			if (res.data.code === 200) {
				this.formatterOptions = res.data.data
			}
		},
		async queryTable() {
			let res = await this.$axios.get('businessTable/queryAll')
			if (res.data.code === 200) {
				this.tableOptions = res.data.data
			}
		},
		async queryFieldByTableId(tableId) {
            let res = await this.$axios.get('businessField/queryByTableId/' + tableId)
            if (res.data.code === 200) {
                this.fieldOptions = res.data.data
            }
        },
		async queryDataSet() {
			let res = await this.$axios.get('templateEngine/queryByCompanyId')
			if (res.data.code == 200) {
				this.datasetOptions = res.data.data
			}
		},
		beforeUpload(file) {
			let pattern = /.(xls|xlsx)$/g
			if (!pattern.test(file.name)) {
				this.$message.error('只能上传xls/xlsx文件')
				return false
			}
			const fileSize = file.size / 1024 / 1024 < 10
			if (!fileSize) {
				this.$message.error('上传文件大小不能超过 10MB')
				return false
			}
			return true
		},
		handleFileSuccess(res, file, fileList) {
			if (res.code === 200) {
				let fileArray = this.form.exportPath

				fileArray.push({
					name: file.name,
					size: file.size,
					url: res.data
				})
				this.form.exportPath = fileArray
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
		handleFileRemove(file) {
			this.form.listExportPath = []
		},
		handleLast() {
			this.active--
		},
		handleNext() {
			if (this.active === 0) {
				this.$refs['ruleForm'].validate(valid => {
					if (valid) {
						this.active++
					}
				})
				if (!this.xs) {
					this.xs = new Spreadsheet('#spreadsheet', this.excelOption).loadData(this.workbook.data)
					this.xs.on('cell-selected', (cell, rowIndex, colIndex) => {
						this.rowIndex = rowIndex
						this.colIndex = colIndex
					})
				}
			} else if (this.active === 1) {
				this.active++
			}
		},
		submitForm() {
			let that = this
			this.workbook.data = this.xs.getData()[0]
			this.$refs['ruleForm'].validate(valid => {
				if (valid) {
					var params = {
						name: that.form.name,
						icon: that.form.icon,
						color: that.form.color,
						templateSource: JSON.stringify(that.workbook),
						dataSource: that.form.dataSource,
						searchJson: JSON.stringify(this.searchTableData),
						exportPath: JSON.stringify(that.form.exportPath)
					}

					that.$axios.post('jellyReport/insert', params).then(function(response) {
						if (response.data.code == 200) {
							that.$message.success('新增成功')
							that.$store.commit('worktabRemove', that.$route.fullPath)
						} else {
							that.$message.error(response.data.message)
						}
					})
				}
			})
		},
		showSearchAddDialog() {
			this.addSearchVisible = true
			if (this.$refs.addSearchForm) {
				this.$refs.addSearchForm.resetFields()
			}
		},
		addSearchSubmit() {
			let that = this
			this.$refs.addSearchForm.validate(valid => {
				if (valid) {
					that.searchTableData = that.searchTableData.concat(JSON.parse(JSON.stringify(that.addSearchForm)))
					that.addSearchVisible = false
				}
			})
		},
		showSearchEditDialog(index, row) {
			this.editSearchVisible = true
			if (this.$refs.editSearchForm) {
				this.$refs.editSearchForm.resetFields()
			}
			this.editSearchForm = Object.assign({}, row)
			this.currentSearchIndex = index
		},
		editSearchSubmit() {
			let that = this
			this.$refs.editSearchForm.validate(valid => {
				if (valid) {
					that.editSearchVisible = false
					that.searchTableData.splice(
						that.currentSearchIndex,
						1,
						JSON.parse(JSON.stringify(that.editSearchForm))
					)
				}
			})
		},
		searchDelSubmit(index) {
			this.searchTableData.splice(index, 1)
		},
		typeFormatter(row) {
			if (row.type === 'input') {
				return '输入框'
			} else if (row.type === 'radio') {
				return '单选框'
			} else if (row.type === 'checkbox') {
				return 'checkbox'
			} else if (row.type === 'select') {
				return '下拉选择'
			} else if (row.type === 'datePicker') {
				return '日期选择'
			} else if (row.type === 'company') {
				return '单位选择'
			} else if (row.type === 'department') {
				return '部门选择'
			} else if (row.type === 'cascader') {
				return '级联选择'
			}
		},
		sourceChange(value) {
			let that = this
			that.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + value).then(res => {
				if (res.data.code == 200) {
					if (that.addHeaderVisible) {
						that.addSearchForm.sourceOptions = res.data.data
					} else {
						that.editSearchForm.sourceOptions = res.data.data
					}
				}
			})
		},
		moveUp(index) {
			if (index === 0) {
				return
			}
			this.searchTableData.splice(index - 1, 0, this.searchTableData[index])
			this.searchTableData.splice(index + 1, 1)
		},
		moveDown(index) {
			if (index === this.searchTableData.length - 1) {
				return
			}
			this.searchTableData.splice(index + 2, 0, this.searchTableData[index])
			this.searchTableData.splice(index, 1)
		},
		handleTypeChange() {
			if (this.addSearchVisible) {
				this.addSearchForm.source = ''
			} else {
				this.editSearchForm.source = ''
			}
		},
		statusFormatter(row) {
			if(row.status) {
				return '显示'
			} else {
				return '隐藏'
			}
		},
        queryIconByPage(){
            let that = this
            var params = {
                pageSize: this.pageSize,
                pageNo: this.pageNo,
                name: this.searchIconName
            }
            that.$axios.get('jellySvg/queryByPage', {params}).then(res => {
                if (res.data.code == 200) {
                    this.iconData = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        handleCurrentChange(){
            this.queryIconByPage()
        },
        handleIconDialog(){
            this.queryIconByPage()
            this.iconFormVisible = true
        },
        handleIconClick(item){
            this.form.icon = item.content
            this.iconFormVisible = false
        },
		handleTableChange(value) {
            this.queryFieldByTableId(value)
        },
        setCellText() {
            if(this.textForm.field) {
                this.xs.cellText(this.rowIndex, this.colIndex, '{{$value.' + this.textForm.field + '}}', 0)
                this.xs.reRender()
            }
        }
	}
}
</script>
<style scoped>
.container {
	padding: 15px;
}
::v-deep .upload-disabled .el-upload--picture-card {
	display: none;
}
.inside-input {
    position: relative;
}
.inside-input .iconE {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    color: #c0c4cc;
}
::v-deep .inside-input .el-input--suffix .el-input__inner {
    padding-right: 48px;
}
::v-deep .inside-input .el-select .el-input__suffix .el-icon-arrow-up {
    display: none;
}
::v-deep .inside-input .el-select .el-input__suffix .el-icon-circle-close {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    color: #c0c4cc;
}
.iconView{
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 0px 20px;
    height: 40px;
}
</style>