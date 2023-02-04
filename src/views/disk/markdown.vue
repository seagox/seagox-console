<template>
	<div :style="{ margin: '10px', height: clientHeight - 20 + 'px' }">
		<div>
			<el-form :model="form" :inline="true" ref="form" label-width="80px">
				<el-form-item>
					<i class="el-icon-back" @click="cancel" style="font-size:24px;margin-top:8px;"></i>
				</el-form-item>
				<el-form-item>
					<el-input v-model="form.name" placeholder="请输入标题"></el-input>
				</el-form-item>
				<el-form-item style="float:right">
					<el-button type="primary" size="medium" icon="el-icon-document-checked" plain @click="save"
						>保存</el-button
					>
				</el-form-item>
			</el-form>
		</div>
		<mavon-editor
			ref="md"
			v-model="form.text"
			class="editor"
			fontSize="16px"
			:toolbars="toolbars"
			@imgAdd="$imgAdd"
		/>
	</div>
</template>

<script>
export default {
	data() {
		return {
			clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
			form: {
				id: null,
				parentId: null,
				name: '',
				text: '',
				type: 13
			},
			toolbars: {
				bold: true, // 粗体
				italic: true, // 斜体
				header: true, // 标题
				underline: true, // 下划线
				strikethrough: true, // 中划线
				mark: true, // 标记
				superscript: true, // 上角标
				subscript: true, // 下角标
				quote: true, // 引用
				ol: true, // 有序列表
				ul: true, // 无序列表
				link: true, // 链接
				imagelink: true, // 图片链接
				code: true, // code
				table: true, // 表格
				fullscreen: true, // 全屏编辑
				readmodel: true, // 沉浸式阅读
				htmlcode: false, // 展示html源码
				help: true, // 帮助
				/* 1.3.5 */
				undo: true, // 上一步
				redo: true, // 下一步
				trash: true, // 清空
				save: false, // 保存（触发events中的save事件）
				/* 1.4.2 */
				navigation: true, // 导航目录
				/* 2.1.8 */
				alignleft: true, // 左对齐
				aligncenter: true, // 居中
				alignright: true, // 右对齐
				/* 2.2.1 */
				subfield: true, // 单双栏模式
				preview: true // 预览
			}
		}
	},
	created() {
		this.form.id = this.$route.query.id
		this.form.parentId = this.$route.query.parentId
		if (this.$route.query.id) {
			this.queryById()
		}
	},
	methods: {
		async queryById() {
			let res = await this.$axios.get('jellyDisk/queryById/' + this.$route.query.id)
			if (res.data.code == 200) {
				this.form = res.data.data
			}
		},
		$imgAdd(pos, $file) {
			// 第一步.将图片上传到服务器.
			var formdata = new FormData()
			formdata.append('file', $file)
			this.$axios({
				url: 'upload/putObject/oss',
				method: 'post',
				data: formdata,
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: window.localStorage.getItem('Authorization')
				}
			}).then(res => {
				this.$refs.md.$img2Url(pos, res.data.data)
			})
		},
		save() {
			if (!this.form.name) {
				this.$message.error('请输入标题')
				return
			}
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
::v-deep .el-form-item {
	margin-bottom: 10px;
}
::v-deep .el-input {
	width: 280px;
}
::v-deep .el-input__inner {
	border: none;
	background-color: #fff;
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
.editor {
	height: calc(100% - 56px);
	border-radius: 8px;
}
</style>
