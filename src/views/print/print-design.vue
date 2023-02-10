<template>
	<div id="spreadsheet">
		<div class="toolbar">
			<el-button type="primary" icon="el-icon-c-scale-to-original" size="mini" plain @click="handleRowCol"
				>行列</el-button
			>
			<el-button type="primary" icon="el-icon-document" size="mini" plain @click="handleSave">保存</el-button>
			<!-- <el-button type="primary" icon="el-icon-search" size="mini" plain @click="handlePreview">预览</el-button> -->
			<el-button type="primary" icon="el-icon-circle-close" size="mini" plain @click="handleBack">返回</el-button>
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
	</div>
</template>

<script>
import Spreadsheet from 'x-data-spreadsheet'
import zhCN from 'x-data-spreadsheet/dist/locale/zh-cn'
export default {
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
			rowIndex: 0,
			colIndex: 0
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

				this.xs = new Spreadsheet('#spreadsheet', this.option).loadData(this.workbook.data)
				this.xs.on('cell-selected', (cell, rowIndex, colIndex) => {
					this.rowIndex = rowIndex
					this.colIndex = colIndex
				})

				this.xs.cell(this.rowIndex, this.colIndex)
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
			
		},
		handleBack() {
			this.$router.go(-1)
		}
	}
}
</script>

<style scoped>
.toolbar {
	position: fixed;
	top: 6px;
	left: 836px;
}
</style>
