<template>
	<div>
        <div style="margin:15px;">
            <codemirrorGroovy ref="codemirror" v-model="form.script" placeholder="请输入脚本" :height="height"/>
        </div>
        <div class="footer">
			<div class="footer-right">
                <el-button type="primary" icon="el-icon-circle-check" @click="handleSave">保 存</el-button>
            </div>
        </div>
	</div>
</template>

<script>
import codemirrorGroovy from '@/views/components/codemirror/groovy'
export default {
	components: {
		codemirrorGroovy
	},
	data() {
		return {
			form: {
				id: '',
				script: ''
			},
			height: (document.documentElement.clientHeight || document.body.clientHeight) - 195
		}
	},
	created() {
		this.queryById()
	},
	methods: {
        async queryById() {
            let res = await this.$axios.get('metaFunction/queryById/' + this.$route.query.id)
			if (res.data.code == 200) {
				this.form = res.data.data
                this.$nextTick(() => {
					this.$refs.codemirror.editor.setValue(this.form.script || '')
				})
			}
        },
		handleSave() {
			this.$axios.post('metaFunction/update', this.form).then(res => {
				if (res.data.code == 200) {
					this.$message.success('保存成功')
				} else {
					this.$message.error(res.data.message)
				}
			})
		}
	}
}
</script>
<style scoped>
.footer {
	position: fixed;
	bottom: 0px;
	width: 100%;
	background: #fff;
	box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
	height: 65px;
	border-bottom: 1px solid #ebeef5;
	box-sizing: border-box;
	border-top: 1px solid #ebeef5;
	z-index: 2000;
}
.footer-right {
	position: fixed;
	bottom: 0px;
	right: 15px;
	padding: 10px;
}
</style>
