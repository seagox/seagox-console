<template>
	<div>
		<el-dialog
			title="显隐规则"
			width="900px"
			append-to-body
			:visible.sync="formVisible"
			:close-on-click-modal="false"
		>
			<div class="toolView">
				<el-button icon="el-icon-plus" size="small" @click="addLogic">新增</el-button>
			</div>
			<el-table :data="tableData" border highlight-current-row stripe>
				<el-table-column prop="value" label="值" align="center">
					<template slot-scope="scope">
						<el-select v-model="scope.row.value" clearable filterable placeholder="请选择值">
							<el-option
								v-for="item in data.options"
								:key="item.code"
								:label="item.name"
								:value="item.code"
							>
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="type" label="类型" align="center">
					<template slot-scope="scope">
						<el-select v-model="scope.row.type" clearable placeholder="请选择类型">
							<el-option
								v-for="item in typeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="target" label="字段" align="center">
					<template slot-scope="scope">
						<el-select v-model="scope.row.target" filterable multiple clearable placeholder="请选择字段">
							<el-option
								v-for="item in fieldOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="75">
					<template slot-scope="scope">
						<el-button type="text" @click="delLogic(scope.$index)" size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="formVisible = false">取消</el-button>
				<el-button type="primary" @click="logicSubmit">确认</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	props: ['data', 'fieldOptions'],
	watch: {
		data: {
			handler(newVal) {
				this.tableData = newVal.logic || []
			},
			immediate: true,
			deep: true
		}
	},
	data() {
		return {
			formVisible: false,
			tableData: [],
			typeOptions: [
				{
					label: '显示',
					value: 'show'
				},
				{
					label: '隐藏',
					value: 'hidden'
				}
			]
		}
	},
	methods: {
		showDialog() {
			this.formVisible = true
		},
		addLogic() {
			this.tableData.push({
				value: '',
				type: '',
				target: []
			})
		},
		delLogic(index) {
			this.tableData.splice(index, 1)
		},
		logicSubmit() {
			let valueArray = []
			for (let i = 0; i < this.tableData.length; i++) {
				let item = this.tableData[i]
				if (valueArray.indexOf(item.value) > -1) {
					this.$message.error('值不能有相同')
					return
				}
				if (!item.value) {
					this.$message.error('值不能为空')
					return
				}
				if (!item.type) {
					this.$message.error('类型不能为空')
					return
				}
				if (item.target.length === 0) {
					this.$message.error('字段不能为空')
					return
				}
				valueArray.push(item.value)
			}
			this.formVisible = false
			this.$set(this.data, 'logic', this.tableData)
		}
	}
}
</script>

<style scoped>
::v-deep .el-dialog__body {
	padding: 10px 20px;
}
</style>
