<template>
	<el-dialog
		title="新增"
		width="750px"
		:visible.sync="formVisible"
		:close-on-click-modal="false"
		@close="handleClose"
	>
		<simplify-form
			ref="simplifyForm"
			:action="action"
			:formModel="formModel"
			:formCofig="formCofig"
			:property="property"
			:calculate="calculate"
			:textModel="textModel"
		/>
		<div slot="footer" class="dialog-footer">
			<el-button @click="formVisible = false">取消</el-button>
			<el-button type="primary" @click="submitForm">提交</el-button>
		</div>
	</el-dialog>
</template>

<script>
import simplifyForm from '@/views/simplify/simplify-form'
export default {
	components: {
		simplifyForm
	},
	data() {
		return {
			formVisible: false,
			action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
			formModel: {},
			formCofig: {},
			property: {},
			calculate: {},
			formId: '',
			textModel: { flag: false, type: 'text' }
		}
	},
	methods: {
		showAddDialog(formId) {
			this.formId = formId
			this.queryByMark(formId)
		},
		async queryByMark(formId) {
			const res = await this.$axios.get('jellyForm/queryByMark/' + formId)
			if (res.data.code == 200) {
				for (let i = 0; i < res.data.data.formDesignList.length; i++) {
					let formDesign = res.data.data.formDesignList[i]
					this.formCofig = JSON.parse(formDesign.excelJson)
					this.formVisible = true
				}
			}
		},
		handleClose() {
			this.$refs.simplifyForm.resetForm()
		},
		submitForm() {
			var params = {
				$formId: this.$route.query.id
			}

			//表单验证
			let result = this.$refs.simplifyForm.validate()
			if (!result) {
				return
			}

			params = Object.assign(params, this.formModel)

			Object.keys(params).forEach((key, index) => {
				let property = this.property[key]
				if (property) {
					if (
						(property.type === 'checkbox' ||
							property.type === 'select' ||
							property.type === 'department' ||
							property.type === 'member' ||
							property.type === 'business' ||
							property.type === 'cascader') &&
						property.multiple
					) {
						params[key] = params[key].toString()
					}
					if (
						property.type === 'picture' ||
						property.type === 'upload' ||
						property.type === 'table' ||
						property.type === 'area'
					) {
						params[key] = JSON.stringify(params[key])
					}
				}
				if (params[key] instanceof Array || params[key] instanceof Object) {
					params[key] = JSON.stringify(params[key])
				}

				if (key.indexOf('|') > -1) {
					params[key.split('|')[0] + '.' + key.split('|')[1]] = params[key]
					delete params[key]
				}
			})

			this.$axios.post('jellyForm/insertCustom', params).then(res => {
				if (res.data.code == 200) {
					this.$message.success('提交成功')
					this.formVisible = false
					this.$emit('submit')
				} else {
					this.$message.error(res.data.message)
				}
			})
		}
	}
}
</script>