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
				<div class="title">组织定义</div>
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
			<div>
				<div class="content" @click="handleClick('/taskScheduler')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/job.png')})` }"
					></div>
				</div>
				<div class="title">定时任务</div>
			</div>
		</div>
		<div class="container">
			<div>
				<div class="content" @click="handleClick('/dic')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/dic.png')})` }"
					></div>
				</div>
				<div class="title">数据字典</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/form')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/form.png')})` }"
					></div>
				</div>
				<div class="title">表单管理</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/gauge')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/dashboard.png')})` }"
					></div>
				</div>
				<div class="title">仪表板</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/door')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/door.png')})` }"
					></div>
				</div>
				<div class="title">门户管理</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/menu')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/authority.png')})` }"
					></div>
				</div>
				<div class="title">权限管理</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/log')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/log.png')})` }"
					></div>
				</div>
				<div class="title">操作日记</div>
			</div>
		</div>
		<div class="container">
			<div>
				<div class="content" @click="handleClick('/print')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/print.png')})` }"
					></div>
				</div>
				<div class="title">打印模版</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/flowDefinition')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/flow.png')})` }"
					></div>
				</div>
				<div class="title">流程定义</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/report')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/report.png')})` }"
					></div>
				</div>
				<div class="title">报表管理</div>
			</div>
			<div>
				<div class="content" @click="handleClick('/import')">
					<div
						class="content-icon"
						:style="{ 'background-image': `url(${require('@/assets/plugin/import.png')})` }"
					></div>
				</div>
				<div class="title">导入配置</div>
			</div>
			<div>
				<div class="not-content"><div class="content-icon"></div></div>
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
