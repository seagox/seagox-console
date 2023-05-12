<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
export default {
	watch: {
		$route(to) {
			let title = to.meta.title
			if (!title) {
				title = to.query.title
			}
			if (to.matched.length > 1) {
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
