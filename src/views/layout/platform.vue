<template>
	<div>
		<div class="container">
			<div>
				<div class="content" @click="handleClick('/company')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/company.png')})` }"
					></div>
				</div>
				<div class="title">单位管理</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/businessTable')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/model.png')})` }"
					></div>
				</div>
				<div class="title">数据建模</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/metaFunction')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/function.png')})` }"
					></div>
				</div>
				<div class="title">元函数</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/metaPage')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/page.png')})` }"
					></div>
				</div>
				<div class="title">云页面</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/templateEngine')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/template.png')})` }"
					></div>
				</div>
				<div class="title">模版引擎</div>
			</div>
		</div>
		<div class="container">
			<div>
				<div class="content" @click="handleClick('/openApi')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/api.png')})` }"
					></div>
				</div>
				<div class="title">OpenAPI</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/businessRule')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/rule.png')})` }"
					></div>
				</div>
				<div class="title">规则引擎</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/taskScheduler')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/job.png')})` }"
					></div>
				</div>
				<div class="title">定时任务</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/procedure')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/procedure.png')})` }"
					></div>
				</div>
				<div class="title">存储过程</div>
			</div>
			<div>
				<div class="not-content"><div class="content-icon"></div></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {
		handleClick(path) {
			this.$router.push(path)
		}
	}
}
</script>

<style scoped>
.container {
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 20px 0px;
}
.content {
	padding: 28px;
	margin-bottom: 15px;
	border: 1px solid #ececec;
	border-radius: 16px;
	box-shadow: 0 16px 64px 0 rgb(12 31 80 / 12%);
	transition: transform 0.4s;
	cursor: pointer;
}
.not-content {
	padding: 28px;
	margin-bottom: 15px;
}
.content-icon {
	width: 80px;
	padding-bottom: 100%;
	border-radius: 16px;
	background-size: cover;
}
.title {
	font-size: 16px;
	line-height: 18px;
	color: #2b3441;
	text-align: center;
	font-weight: 600;
}
</style>
