<template>
	<div class="container">
		<div class="titlebar">
			<el-form :model="form" :inline="true" ref="form" label-width="80px">
				<el-form-item>
					<i class="el-icon-back" @click="cancel" style="font-size:24px;margin-top:8px;"></i>
				</el-form-item>
				<el-form-item>
					<el-input v-model="form.name" placeholder="请输入标题"></el-input>
				</el-form-item>
				<el-form-item style="float:right;margin-right:25px;">
					<el-button type="primary" size="medium" icon="el-icon-document-checked" plain @click="save"
						>保存</el-button
					>
				</el-form-item>
			</el-form>
		</div>
		<editor
			ref="editor"
			v-model="content"
			style="margin-top:64px;"
			placeholder="请输入正文"
			:height="clientHeight - 108"
		></editor>
	</div>
</template>

<script>
import editor from '@/views/components/quill/editor'
export default {
	components: {
		editor
	},
	data() {
		return {
			clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
			form: {
				id: null,
				parentId: null,
				name: '',
				text: '',
				type: 9
			},
			content: {}
		}
	},
	created() {
		this.form.parentId = this.$route.query.parentId
		this.form.id = this.$route.query.id
		if (this.$route.query.id) {
			this.queryById()
		}
	},
	methods: {
		async queryById() {
			let res = await this.$axios.get('jellyDisk/queryById/' + this.$route.query.id)
			if (res.data.code == 200) {
				this.form = res.data.data
				this.content = JSON.parse(this.form.text)
				this.$refs.editor.setContents(this.content)
			}
		},
		save() {
			if (!this.form.name) {
				this.$message.error('请输入标题')
				return
			}
			this.form.text = JSON.stringify(this.content)
			this.$axios.post('jellyDisk/insertOrUpdate', this.form).then(res => {
				if (res.data.code === 200) {
					this.$message.success('保存成功')
					this.$router.go(-1)
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		cancel() {
			this.$router.go(-1)
		}
	}
}
</script>
<style scoped>
.container {
	height: 100%;
	background-color: #f9fafb;
	overflow-y: auto;
}
.titlebar {
	padding: 10px 10px 0px 10px;
	border-bottom: 1px solid #ebedf0;
	position: fixed;
	width: 100%;
	background-color: #f9fafb;
	z-index: 1000;
}
::v-deep .el-form-item {
	margin-bottom: 10px;
}
::v-deep .el-input {
	width: 280px;
}
::v-deep .el-input__inner {
	border: none;
	background-color: #f9fafb;
}
::v-deep .el-input input::-webkit-input-placeholder {
	color: #8f959e;
	font-size: 20px;
}
::v-deep .el-input input::-moz-input-placeholder {
	color: #8f959e;
	font-size: 20px;
}
::v-deep .el-input input::-ms-input-placeholder {
	color: #8f959e;
	font-size: 20px;
}
</style>
