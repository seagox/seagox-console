<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
export default {
	data() {
		return {
			fullScreenUrls: [
				'/',
				'/login',
				'/home',
				'/flowDesigner',
				'/simplifyDesign',
				'/seniorDesign',
				'/printDesign',
				'/gaugeSetting',
				'/doorSetting'
			]
		}
	},
	watch: {
		$route(to, from) {
			let title = to.meta.title
			if (!title) {
				title = to.query.title
			}
			if (!this.fullScreenUrls.includes(to.path)) {
				this.$store.commit('worktabRoute', {
					to: {
						name: to.name,
						title: title,
						path: to.fullPath
					}
				})
			}
		}
	}
}
</script>
