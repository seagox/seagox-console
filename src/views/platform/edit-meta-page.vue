<template>
	<div>
        <div style="margin:15px;">
            <el-tabs class="border-card" v-model="activeName" type="border-card" @tab-click="tabClick">
                <el-tab-pane label="template" name="template">
                    <codemirrorVue
                        ref="codemirror"
                        v-model="form.html"
                        placeholder="请输入template脚本"
                        v-if="activeName === 'template'"
                        :height="height"
                    />
                </el-tab-pane>
                <el-tab-pane label="script" name="script">
                    <codemirrorVue
                        ref="codemirror"
                        v-model="form.js"
                        placeholder="请输入script脚本"
                        v-if="activeName === 'script'"
                        :height="height"
                    />
                </el-tab-pane>
                <el-tab-pane label="style" name="style">
                    <codemirrorVue
                        ref="codemirror"
                        v-model="form.css"
                        placeholder="请输入style脚本"
                        v-if="activeName === 'style'"
                        :height="height"
                    />
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="footer">
			<div class="footer-right">
                <el-button type="primary" icon="el-icon-circle-check" @click="handleSave">保 存</el-button>
            </div>
        </div>
	</div>
</template>

<script>
import codemirrorVue from '@/views/components/codemirror/vue'
export default {
	components: {
		codemirrorVue
	},
	data() {
		return {
			form: {
				id: '',
				html: '',
				js: '',
				css: ''
			},
			activeName: 'template',
			height: (document.documentElement.clientHeight || document.body.clientHeight) - 280
		}
	},
	created() {
		this.queryById()
	},
	methods: {
        async queryById() {
            let res = await this.$axios.get('metaPage/queryById/' + this.$route.query.id)
			if (res.data.code == 200) {
				this.form = res.data.data
                this.$nextTick(() => {
					if (this.activeName === 'template') {
						this.$refs.codemirror.editor.setValue(this.form.html || '')
					} else if (this.activeName === 'script') {
						this.$refs.codemirror.editor.setValue(this.form.js || '')
					} else if (this.activeName === 'style') {
						this.$refs.codemirror.editor.setValue(this.form.css || '')
					}
				})
			}
        },
        tabClick() {
			this.$nextTick(() => {
				this.$refs.codemirror.editor.setSize('auto', 510)
			})
		},
		handleSave() {
			this.$axios.post('metaPage/update', this.form).then(res => {
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
