<template>
	<div>
		<el-dialog
			class="preview"
			title="页面预览"
			width="90%"
			:visible.sync="previewFormVisible"
			:close-on-click-modal="false"
		>
			<senior-form
				ref="seniorForm"
				:formCofig="formCofig"
				:formModel="form"
				:calculate="calculate"
				:multiple="multiple"
				:property="property"
				:action="action"
			/>
			<div style="color:#909399;margin-top:20px;">
				温馨提示：默认是10行6列，有需要请在“保存”按钮左边设置表格行列
			</div>
		</el-dialog>
	</div>
</template>

<script>
import seniorForm from '@/views/senior/senior-form'
export default {
	components: {
		seniorForm
	},
	data() {
		return {
			action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
			previewFormVisible: false,
			formCofig: {},
			form: {},
			calculate: {},
			multiple: {},
			property: {}
		}
	},
	methods: {
		async queryById() {
            let url = ''
            if (this.$route.query.type && this.$route.query.type === 'print'){
                url = 'jellyPrint/queryById/'
            }else {
                url = 'jellyFormDesign/queryById/'
            }
			const res = await this.$axios.get(url + this.$route.query.id)
			if (res.data.code == 200) {
				if (res.data.data.excelJson) {
					this.formCofig = JSON.parse(res.data.data.excelJson)
					this.previewFormVisible = true
				} else {
					this.$message.error('请先设计表单然后保存')
				}
			}
		},
		showDialog() {
			this.queryById()
		}
	}
}
</script>
