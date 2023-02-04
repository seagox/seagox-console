<template>
	<div>
		<el-dialog
			title="计算公式"
			width="900px"
			append-to-body
			:visible.sync="formVisible"
			:close-on-click-modal="false"
		>
			<codemirrorCalculate v-if="formVisible" v-model="calculate" :options="fieldOptions" />
			<div slot="footer" class="dialog-footer">
				<el-button @click="formVisible = false">取消</el-button>
				<el-button type="primary" @click="calculateSubmit">确认</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import codemirrorCalculate from '@/views/components/codemirror/calculate'
export default {
	components: {
		codemirrorCalculate
	},
	data() {
		return {
			formVisible: false,
			calculate: '',
			fieldOptions: [],
			type: ''
		}
	},
	created() {
		this.queryBusinessField()
	},
	methods: {
		showDialog(type, calculate) {
			this.type = type
			this.calculate = calculate || ''
			this.formVisible = true
		},
		async queryBusinessField() {
			let res = await this.$axios.get('jellyFormDesign/queryBusinessField/' + this.$route.query.id)
			if (res.data.code === 200) {
				let fieldOptions = []
				for (let i = 0; i < res.data.data.length; i++) {
					let fieldObject = res.data.data[i]
					fieldOptions.push({
						name: '${' + fieldObject.tableName + '|' + fieldObject.name + '}',
						comment: fieldObject.tableComment + '·' + fieldObject.remark
					})
				}
				this.fieldOptions = fieldOptions
			}
		},
		calculateSubmit() {
			this.formVisible = false
			this.$emit('calculateSubmit', this.type, this.calculate)
		}
	}
}
</script>

<style scoped>
::v-deep .el-dialog__body {
	padding: 10px 20px;
}
::v-deep .el-textarea__inner {
	padding: 15px 15px;
}
::v-deep .el-tabs__item {
	color: #333 !important;
}
</style>
