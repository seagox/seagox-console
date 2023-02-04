<template>
	<div class="container">
		<!--简化版-->
		<div v-if="formDesignType === 1">
			<simplify-form
				ref="simplifyForm"
				:action="action"
				:formModel="form"
				:formCofig="formCofig"
				:property="property"
				:calculate="calculate"
				:textModel="textModel"
				:disabledField="disabledField"
			/>
		</div>
		<!--高级版-->
		<div v-if="formDesignType === 2">
			<senior-form
				ref="seniorForm"
				:action="action"
				:formModel="form"
				:formCofig="formCofig"
				:property="property"
				:calculate="calculate"
				:multiple="multiple"
				:disabledField="disabledField"
			/>
		</div>
		<div class="footer">
			<div class="footer-right">
				<el-button type="primary" icon="el-icon-document-checked" @click="submitForm">提交</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import seniorForm from '@/views/senior/senior-form'
import simplifyForm from '@/views/simplify/simplify-form'
export default {
	components: {
		seniorForm,
		simplifyForm
	},
	data() {
		return {
			action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
			tableData: [],
			form: {},
			calculate: {},
			multiple: {},
			property: {},
			formDesignType: 0,
			formCofig: {},
			textModel: { flag: false, type: 'text' },
			disabledField: []
		}
	},
	created() {
		this.reportDetail()
	},
	methods: {
		async reportDetail() {
			var params = {
				id: this.$route.query.id,
				formId: this.$route.query.formId
			}
			let res = await this.$axios.get('jellyForm/queryDetail', { params })
			if (res.data.code == 200) {
				this.form = res.data.data

				this.tableData = []
				for (let i = 0; i < this.form.form.formDesignList.length; i++) {
					let formDesign = this.form.form.formDesignList[i]
					this.formDesignType = formDesign.type
					this.formCofig = JSON.parse(formDesign.excelJson)
				}

				Object.keys(this.form).forEach((field, index) => {
					if (this.formDesignType === 1 && field.indexOf('.') > -1) {
						this.$set(this.form, field.split('.')[0] + '|' + field.split('.')[1], this.form[field])
						delete this.form[field]
					}
				})

				this.setFormFieldDisable()

				for (let j = 0; j < this.formCofig.fieldOptions.length; j++) {
					if (this.formCofig.fieldOptions[j].type === 'editor') {
						this.$set(
							this.form,
							this.formCofig.fieldOptions[j].field,
							JSON.parse(this.form[this.formCofig.fieldOptions[j].field])
						)
					}
				}
			}
		},
		submitForm() {
			let that = this
			var params = {
				businessType: this.$route.query.formId,
				businessKey: this.$route.query.id
			}

			//表单验证
			if (this.formDesignType === 1) {
				let result = this.$refs.simplifyForm.validate()
				if (!result) {
					return
				}
			} else if (this.formDesignType === 2) {
				var result = this.$refs.seniorForm.validate()
				if (!result) {
					return
				}
			}

			params = Object.assign(params, this.form)

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
			})

			if (params.hasOwnProperty('flowStatus') && params.flowStatus == 0) {
				params.temporaryStorage = false
				params.status = 1
			} else {
				params.temporaryStorage = true
			}

			params.existProdef = true

			Object.keys(params).forEach((key, index) => {
				if (key.indexOf('|') > -1) {
					params[key.split('|')[0] + '.' + key.split('|')[1]] = params[key]
					delete params[key]
				}
			})

			delete params['form']

			that.$axios.post('jellyForm/updateCustom', params).then(res => {
				if (res.data.code == 200) {
					that.$message.success('编辑成功')
					that.$store.commit('worktabRemove', that.$route.fullPath)
				} else {
					that.$message.error(res.data.message)
				}
			})
		},
		// 设置表单禁用字段
		setFormFieldDisable() {
			let roleIdArr = localStorage.getItem('roleIds').split(',');
			if (roleIdArr.length > 0) {
				let authority = JSON.parse(this.form.form.authority)
				if (authority.hasOwnProperty('disabledField')) {
					let disabledFieldArr = []
					let disabledField = JSON.parse(authority.disabledField)
					for (let roleId in disabledField) {
						if (roleIdArr.indexOf(roleId) != -1) {
							disabledFieldArr = disabledFieldArr.concat(disabledField[roleId])
						}
					}
					this.disabledField = disabledFieldArr
				}
			}
		}
	}
}
</script>
<style scoped>
.container {
	padding: 10px 10px 45px 10px;
}
.footer {
	position: fixed;
	left: 230px;
	bottom: 0px;
	width: 100%;
	background: #fff;
	box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
	height: 65px;
	border-bottom: 1px solid #ebeef5;
	box-sizing: border-box;
	border-top: 1px solid #ebeef5;
}
.footer-right {
	position: fixed;
	bottom: 0px;
	right: 15px;
	padding: 10px;
}
</style>
