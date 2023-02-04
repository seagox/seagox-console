<template>
	<div id="spreadsheet">
		<div class="toolbar">
			<el-button type="primary" icon="el-icon-c-scale-to-original" size="mini" plain @click="handleRowCol"
				>行列</el-button
			>
			<el-button type="primary" icon="el-icon-document" size="mini" plain @click="handleSave">保存</el-button>
			<el-button type="primary" icon="el-icon-search" size="mini" plain @click="handlePreview">预览</el-button>
			<!-- <el-button type="primary" icon="el-icon-circle-close" size="mini" plain @click="handleBack">返回</el-button> -->
		</div>
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
				<el-button type="primary" @click="handleSettingSave">保存</el-button>
			</div>
		</el-dialog>
		<print-config
			:currentModule="currentModule"
			:dataSheet="dataSheet"
			@submitConfigForm="submitConfigForm"
			@deleteConfigForm="deleteConfigForm"
		/>
		<senior-preview ref="seniorPreview" />
	</div>
</template>

<script>
import Spreadsheet from 'x-data-spreadsheet'
import zhCN from 'x-data-spreadsheet/dist/locale/zh-cn'
import printConfig from '@/views/print/print-config'
import seniorPreview from '@/views/senior/senior-preview'
export default {
	components: {
		printConfig,
		seniorPreview
	},
	data() {
		return {
			option: {
				showBottomBar: false,
				row: {
					height: 32,
					len: 200
				},
				col: {
					width: 120
				}
			},
			workbook: {
				row: 10,
				col: 6,
				data: {},
				module: {}
			},
			settingFormVisible: false,
			rules: {
				row: [
					{ required: true, message: '请输入行', trigger: 'blur' },
					{ pattern: /^(1|[1-9]\d?|100)$/, message: '范围在1-100', trigger: 'blur' }
				],
				col: [
					{ required: true, message: '请输入列', trigger: 'blur' },
					{ pattern: /^(1|[1-9]\d?|26)$/, message: '范围在1-20', trigger: 'blur' }
				]
			},
			xs: null,
			currentModule: {
				type: 'word',
				field: []
			},
			dataSheet: '',
			rowIndex: 0,
			colIndex: 0,
			dataSheet: ''
		}
	},
	created() {
		this.queryById()
	},
	mounted() {
		Spreadsheet.locale('zh-cn')
	},
	methods: {
		async queryById() {
			const res = await this.$axios.get('jellyPrint/queryById/' + this.$route.query.id)
			if (res.data.code === 200) {
				if (res.data.data.excelJson) {
					this.workbook = JSON.parse(res.data.data.excelJson)
				}
				this.dataSheet = res.data.data.dataSource

				this.xs = new Spreadsheet('#spreadsheet', this.option).loadData(this.workbook.data)
				this.xs.on('cell-selected', (cell, rowIndex, colIndex) => {
					if (cell && cell.key && this.workbook.module[cell.key]) {
						this.currentModule = this.workbook.module[cell.key]
					} else {
						this.currentModule = {
							type: 'word',
							field: []
						}
					}
					this.rowIndex = rowIndex
					this.colIndex = colIndex
				})

				var cell = this.xs.cell(this.rowIndex, this.colIndex)
				if (cell && cell.key && this.workbook.module[cell.key]) {
					this.currentModule = this.workbook.module[cell.key]
				}
			}
		},
		handleRowCol() {
			this.settingFormVisible = true
		},
		handleSettingSave() {
			this.settingFormVisible = false
		},
		handleSave() {
			this.workbook.data = this.xs.getData()[0]
			var that = this
			var params = {
				id: that.$route.query.id,
				excelJson: JSON.stringify(that.workbook)
			}
			that.$axios.post('jellyPrint/update', params).then(res => {
				if (res.data.code == 200) {
					that.$message.success('保存成功')
				}
			})
		},
		handlePreview() {
			this.$refs.seniorPreview.showDialog()
		},
		handleBack() {
			this.$router.go(-1)
		},
		submitConfigForm(value) {
			var key = ''
			var cell = this.xs.cell(this.rowIndex, this.colIndex)
			if (cell && cell.key) {
				key = cell.key
			} else {
				key = Math.random()
					.toString(36)
					.slice(-6)
			}
			this.xs.sheet.data.setSelectedCellAttr('align', 'center')
			this.xs.sheet.data.setSelectedCellAttr('bgcolor', '#a1a3a6')
			this.xs.sheet.data.setSelectedCellAttr('key', key)
			if (value.type === 'text') {
				this.xs.cellText(this.rowIndex, this.colIndex, '单行文本').reRender()
			} else if (value.type === 'textarea') {
				this.xs.cellText(this.rowIndex, this.colIndex, '多行文本').reRender()
			} else if (value.type === 'number') {
				this.xs.cellText(this.rowIndex, this.colIndex, '数字').reRender()
			} else if (value.type === 'editor') {
				this.xs.cellText(this.rowIndex, this.colIndex, '富文本').reRender()
			} else if (value.type === 'radio') {
				this.xs.cellText(this.rowIndex, this.colIndex, '单选框').reRender()
			} else if (value.type === 'checkbox') {
				this.xs.cellText(this.rowIndex, this.colIndex, '多选框').reRender()
			} else if (value.type === 'select') {
				this.xs.cellText(this.rowIndex, this.colIndex, '下拉选择').reRender()
			} else if (value.type === 'switch') {
				this.xs.cellText(this.rowIndex, this.colIndex, '开关组件').reRender()
			} else if (value.type === 'timePicker') {
				this.xs.cellText(this.rowIndex, this.colIndex, '时间选择').reRender()
			} else if (value.type === 'datePicker') {
				this.xs.cellText(this.rowIndex, this.colIndex, '日期选择').reRender()
			} else if (value.type === 'picture') {
				this.xs.cellText(this.rowIndex, this.colIndex, '图片上传').reRender()
			} else if (value.type === 'timeRangePicker') {
				this.xs.cellText(this.rowIndex, this.colIndex, '时间范围').reRender()
			} else if (value.type === 'dateRangePicker') {
				this.xs.cellText(this.rowIndex, this.colIndex, '日期范围').reRender()
			} else if (value.type === 'upload') {
				this.xs.cellText(this.rowIndex, this.colIndex, '附件上传').reRender()
			} else if (value.type === 'table') {
				this.xs.cellText(this.rowIndex, this.colIndex, '表格').reRender()
			} else if (value.type === 'calculate') {
				this.xs.cellText(this.rowIndex, this.colIndex, '计算公式').reRender()
			} else if (value.type === 'bill') {
				this.xs.cellText(this.rowIndex, this.colIndex, '流水号').reRender()
			} else if (value.type === 'process') {
				this.xs.cellText(this.rowIndex, this.colIndex, '流程组件').reRender()
			} else if (value.type === 'area') {
				this.xs.cellText(this.rowIndex, this.colIndex, '省市区').reRender()
			} else if (value.type === 'department') {
				this.xs.cellText(this.rowIndex, this.colIndex, '部门组件').reRender()
			} else if (value.type === 'member') {
				this.xs.cellText(this.rowIndex, this.colIndex, '成员组件').reRender()
			} else if (value.type === 'business') {
				this.xs.cellText(this.rowIndex, this.colIndex, '业务应用').reRender()
			}

			this.$set(this.workbook.module, key, JSON.parse(JSON.stringify(this.currentModule)))
		},
		deleteConfigForm() {
			var key = ''
			var cell = this.xs.cell(this.rowIndex, this.colIndex)
			if (cell && cell.key) {
				key = cell.key
				this.xs.sheet.data.setSelectedCellAttr('align', 'left')
				this.xs.sheet.data.setSelectedCellAttr('bgcolor', '#fff')
				this.xs.cellText(this.rowIndex, this.colIndex, '').reRender()
				delete this.workbook.module[key]
				this.currentModule = {
					type: 'word'
				}
			}
		}
	}
}
</script>

<style scoped>
.toolbar {
	position: fixed;
	top: 6px;
	right: 360px;
}
</style>
