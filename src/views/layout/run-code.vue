<template>
	<div ref="display"></div>
</template>

<script>
import Vue from 'vue'
export default {
	name: 'runCode',
	data() {
		return {
			id: Math.random()
				.toString(36)
				.slice(-6),
			html: '',
			js: '',
			css: '',
			component: null
		}
	},
	mounted() {
		this.destroyCode()
		this.queryTable()
	},
	beforeDestroy() {
		this.destroyCode()
	},
	methods: {
		async queryTable() {
			const res = await this.$axios.get('metaPage/selectByPath/' + this.$route.query.path)
			if (res.data.code == 200) {
				this.html = res.data.data.html
				this.js = res.data.data.js
				this.css = res.data.data.css
				//挂载节点
				this.renderCode()
			}
		},
		getSource(source, type) {
			const regex = new RegExp(`<${type}[^>]*>`)
			let openingTag = source.match(regex)

			if (!openingTag) return ''
			else openingTag = openingTag[0]

			return source.slice(source.indexOf(openingTag) + openingTag.length, source.lastIndexOf(`</${type}>`))
		},
		// 分割代码
		splitCode() {
			this.js = this.getSource(this.js, 'script').replace(/export default/, 'return ')
			if (this.css) {
				this.css = this.getSource(this.css, 'style')
			}
			this.html = '<div id="jelly">' + this.getSource(this.html, 'template') + '</div>'
		},
		// 挂载
		renderCode() {
			this.splitCode()
			if (this.html !== '' && this.js !== '') {
				const parseStrToFunc = new Function(this.js)()
				parseStrToFunc.template = this.html

				const Component = Vue.extend(parseStrToFunc)
				this.component = new Component().$mount()

				this.$refs.display.appendChild(this.component.$el)
				if (this.css !== '') {
					const style = document.createElement('style')
					style.type = 'text/css'
					style.id = this.id
					style.innerHTML = this.css
					document.getElementsByTagName('head')[0].appendChild(style)
				}
			}
		},
		// 销毁
		destroyCode() {
			const $target = document.getElementById(this.id)
			if ($target) $target.parentNode.removeChild($target)

			if (this.component) {
				this.$refs.display.removeChild(this.component.$el)
				this.component.$destroy()
				this.component = null
			}
		}
	}
}
</script>
