<template>
	<div class="readme-container">
		<div class="drag-container" v-if="config.layout && config.layout.length != 0" :style="[config.styles]">
			<gaugeShowComponent :layout="config.layout" @handleEvent="handleEvent" />
		</div>
		<div class="empty" v-if="config.layout.length == 0 && !html">
			<img :src="require('@/assets/theme/' + color + '-welcome.png')" style="width: 762px" v-if="color" />
		</div>
		<div ref="display"></div>
	</div>
</template>

<script>
import Vue from 'vue'
import gaugeShowComponent from '@/views/components/gauge/gauge-show-component'
import china from '@/utils/china.json'
export default {
	components: {
		gaugeShowComponent
	},
	data() {
		return {
			color: '',
			colorInterval: undefined,
			id: Math.random()
				.toString(36)
				.slice(-6),
			html: '',
			js: '',
			css: '',
			component: null,
			config: {
				layout: []
			},
			queryData: {}
		}
	},
	mounted() {
		this.queryAnalysis()
		this.colorInterval = setInterval(() => {
			let type = 'red'
			let color = localStorage.getItem('color')
			switch (color) {
				case '#DA001C':
					type = 'red'
					break
				case '#0574d5':
					type = 'blue'
					break
			}
			this.color = type
		}, 500)
		
		this.destroyCode()
	},
	beforeDestroy() {
		this.destroyCode()
		clearInterval(this.colorInterval)
	},
	methods: {
		async queryAnalysis() {
			let res = await this.$axios.get('door/queryAnalysis')
			if (res.data.code == 200) {
				if (res.data.data) {
					if(res.data.data.type === 'panel') {
						this.config = res.data.data.data
						this.recursionAttribute(this.config.layout)
						this.queryExecute(res.data.data.id)
					} else if (res.data.data.type === 'meta') {
						this.html = res.data.data.data.html
						this.js = res.data.data.data.js
						this.css = res.data.data.data.css
						//挂载节点
						this.renderCode()
					}
				}
			}
		},
		listToTreeByRule(arr, rule) {
			let ruleArray = rule.split('')
			let ruleList = []
			let ruleMap = {}
			for (let i = 0; i < ruleArray.length; i++) {
				if (i == 0) {
					ruleList.push(parseInt(ruleArray[i]))
					ruleMap[ruleArray[i]] = i
				} else {
					ruleList.push(ruleList[i - 1] + parseInt(ruleArray[i]))
					ruleMap[String(ruleList[i - 1] + parseInt(ruleArray[i]))] = i
				}
			}

			let r = []
			let hash = {}
			// 将数组转为Object的形式，value为数组中的id
			for (let i = 0; i < arr.length; i++) {
				let json = arr[i]
				hash[json.value] = json
			}
			// 遍历结果集
			for (let j = 0; j < arr.length; j++) {
				// 单条记录
				let aVal = arr[j]
				// 在hash中取出value为单条记录中pid的值
				let curCode = String(aVal.value)

				let index = ruleMap[curCode.length]

				let curKey = null
				if (index != 0) {
					curKey = curCode.substring(0, ruleList[index - 1])
				}
				let hashVP = hash[curKey]
				// 如果记录的pid存在，则说明它有父节点，将她添加到孩子节点的集合中
				if (hashVP) {
					// 检查是否有children属性
					if (hashVP.hasOwnProperty('children')) {
						let ch = hashVP.children
						ch.push(aVal)
						hashVP.children = ch
					} else {
						let ch = []
						ch.push(aVal)
						hashVP.children = ch
					}
				} else {
					r.push(aVal)
				}
			}
			return r
		},
		recursionAttribute(layout) {
			for (let i = 0; i < layout.length; i++) {
				let item = layout[i]
				this[item.i] = item
				if (item.type === 'tabs') {
					for (let j = 0; j < item.tabs.length; j++) {
						let tab = item.tabs[j]
						if (tab.children) {
							this.recursionAttribute(tab.children)
						}
					}
				} else if (item.type === 'work') {
					this.queryTodoItem(item)
					this.queryDoneItem(item)
					this.queryCopyItem(item)
					this.querySelfItem(item)
					this.queryReadyItem(item)
				} else if (item.type === 'quick') {
					this.queryQuickAccess(item)
				} else {
					if (item.children) {
						this.recursionAttribute(item.children)
					}
				}
			}
		},
		async queryTodoItem(object) {
			let res = await this.$axios.get('flow/queryTodoItem')
			if (res.data.code === 200) {
				this.$set(object, 'todoItem', res.data.data.list)
				this.$set(object, 'todoTotal', res.data.data.total)
			}
		},
		async queryDoneItem(object) {
			let res = await this.$axios.get('flow/queryDoneItem')
			if (res.data.code === 200) {
				this.$set(object, 'doneItem', res.data.data.list)
				this.$set(object, 'doneTotal', res.data.data.total)
			}
		},
		async queryCopyItem(object) {
			let res = await this.$axios.get('flow/queryCopyItem')
			if (res.data.code === 200) {
				this.$set(object, 'copyItem', res.data.data.list)
				this.$set(object, 'copyTotal', res.data.data.total)
			}
		},
		async querySelfItem(object) {
			let res = await this.$axios.get('flow/querySelfItem')
			if (res.data.code === 200) {
				this.$set(object, 'selfItem', res.data.data.list)
				this.$set(object, 'selfTotal', res.data.data.total)
			}
		},
		async queryReadyItem(object) {
			let res = await this.$axios.get('flow/queryReadyItem')
			if (res.data.code === 200) {
				this.$set(object, 'readyItem', res.data.data.list)
				this.$set(object, 'readyTotal', res.data.data.total)
			}
		},
		async queryQuickAccess(object) {
			let res = await this.$axios.get('menu/queryQuickAccess')
			if (res.data.code === 200) {
				let options = []
				if (res.data.data) {
					for (let i = 0; i < res.data.data.length; i++) {
						let item = res.data.data[i]
						if (item.type === 1) {
							item.color = '#00C458'
						} else if (item.type === 2) {
							item.color = '#FC943D'
						} else if (item.type === 3) {
							item.color = '#0089FF'
						} else if (item.type === 4) {
							item.color = '#FB602D'
						} else if (item.type === 7) {
							item.color = '#e6a23c'
						} else {
							item.color = '#FF9F00'
						}
						options.push(item)
					}
				}
				this.$set(object, 'options', options)
			}
		},
		queryExecute(id) {
			if (this.config.queries) {
				for (let i = 0; i < this.config.queries.length; i++) {
					let query = this.config.queries[i]
					if (query.type === 'ds' && query.script) {
						let params = {
							id: id,
							name: query.name
						}
						this.$axios.post('door/execute', params).then(res => {
							if (res.data.code == 200) {
								this.$set(this.queryData, query.name, res.data)
								this.recursionData(this.config.layout, query.name)
							}
						})
					}
				}
			}
		},
		recursionData(layout, appointName) {
			for (let i = 0; i < layout.length; i++) {
				let item = layout[i]
				if (item.type === 'chart') {
					if (item.data && item.data.indexOf(appointName) != -1) {
						try {
							let key = item.data.replace(/{{/g, '').replace(/}}/g, '')
							let chartData = eval(`this.queryData.${key}`)
							if (chartData.length === 0) {
								this.$set(item, 'hasData', false)
							} else {
								this.$set(item, 'hasData', true)
							}
						} catch (e) {
							console.log(e)
						}
						this.handleChart(item)
					}
				} else if (item.type === 'text') {
					if (item.value && item.value.indexOf(appointName) != -1) {
						try {
							let pattern = /\{\{(.*?)\}\}/g
							var matches = item.value.match(pattern)
							let text = item.value
							if (matches) {
								for (let i = 0; i < matches.length; i++) {
									let matche = matches[i]
									let key = matche.replace(/{{/g, '').replace(/}}/g, '')
									text = text.replace(matche, eval(`this.queryData.${key}`))
								}
							}
							this.$set(item, 'text', text.replace(/undefined/g, ''))
						} catch (e) {
							console.log(e)
							this.$set(item, 'text', item.value)
						}
					}
				} else if (item.type === 'select') {
					if (item.data && item.data.indexOf(appointName) != -1) {
						try {
							let key = item.data.replace(/{{/g, '').replace(/}}/g, '')
							this.$set(item, 'options', eval(`this.queryData.${key}`))
						} catch (e) {
							console.log(e)
							this.$set(item, 'options', [])
						}
					}
				} else if (item.type === 'multiSelect') {
					if (item.data && item.data.indexOf(appointName) != -1) {
						try {
							let key = item.data.replace(/{{/g, '').replace(/}}/g, '')
							this.$set(item, 'options', eval(`this.queryData.${key}`))
						} catch (e) {
							console.log(e)
							this.$set(item, 'options', [])
						}
					}
				} else if (item.type === 'cascader') {
					if (item.data && item.data.indexOf(appointName) != -1) {
						try {
							let key = item.data.replace(/{{/g, '').replace(/}}/g, '')
							let result = this.listToTreeByRule(eval(`this.queryData.${key}`), item.levelCode)
							this.$set(item, 'options', result)
						} catch (e) {
							console.log(e)
							this.$set(item, 'options', [])
						}
					}
				} else if (item.type === 'multiCascader') {
					if (item.data && item.data.indexOf(appointName) != -1) {
						try {
							let key = item.data.replace(/{{/g, '').replace(/}}/g, '')
							let result = this.listToTreeByRule(eval(`this.queryData.${key}`), item.levelCode)
							this.$set(item, 'options', result)
						} catch (e) {
							console.log(e)
							this.$set(item, 'options', [])
						}
					}
				} else if (item.type === 'radio') {
					if (item.data && item.data.indexOf(appointName) != -1) {
						try {
							let key = item.data.replace(/{{/g, '').replace(/}}/g, '')
							this.$set(item, 'options', eval(`this.queryData.${key}`))
						} catch (e) {
							console.log(e)
							this.$set(item, 'options', [])
						}
					}
				} else if (item.type === 'checkbox') {
					if (item.data && item.data.indexOf(appointName) != -1) {
						try {
							let key = item.data.replace(/{{/g, '').replace(/}}/g, '')
							this.$set(item, 'options', eval(`this.queryData.${key}`))
						} catch (e) {
							console.log(e)
							this.$set(item, 'options', [])
						}
					}
				} else if (item.type === 'tree') {
					if (item.data && item.data.indexOf(appointName) != -1) {
						try {
							let key = item.data.replace(/{{/g, '').replace(/}}/g, '')
							let result = this.listToTreeByRule(eval(`this.queryData.${key}`), item.levelCode)
							this.$set(item, 'treeData', result)
						} catch (e) {
							console.log(e)
							this.$set(item, 'treeData', [])
						}
					}
				} else if (item.type === 'table') {
					if (item.data && item.data.indexOf(appointName) != -1) {
						try {
							let key = item.data.replace(/{{/g, '').replace(/}}/g, '')
							this.$set(item, 'tabelData', eval(`this.queryData.${key}`))
						} catch (e) {
							console.log(e)
							this.$set(item, 'tabelData', [])
						}
					}
				}
				if (item.type === 'tabs') {
					for (let j = 0; j < item.tabs.length; j++) {
						let tab = item.tabs[j]
						if (tab.children) {
							this.recursionData(tab.children, appointName)
						}
					}
				} else {
					if (item.children) {
						this.recursionData(item.children, appointName)
					}
				}
			}
		},
		handleChart(item) {
			let chartData = []
			try {
				let key = item.data.replace(/{{/g, '').replace(/}}/g, '')
				chartData = eval(`this.queryData.${key}`)
			} catch (e) {}
			this.$nextTick(() => {
				if (item.data) {
					this.$echarts.registerMap('china', china, {})
					if(!document.getElementById(item.i)) {
						return
					}
					var chart = this.$echarts.init(document.getElementById(item.i))
					chart.resize()
					chart.clear()

					var option = {
						title: {
							left: item.titleAlign || 'center',
							text: item.title
						}
					}
					if (item.chartType === 'bar' || item.chartType === 'line') {
						// 柱状图、折线图
						let xAxisData = []
						let seriesMap = {}
						for (let j = 0; j < chartData.length; j++) {
							let type = chartData[j].type || 'direct'
							if (!seriesMap.hasOwnProperty(type)) {
								seriesMap[type] = []
							}
							if (!xAxisData.includes(chartData[j].name)) {
								xAxisData.push(chartData[j].name)
							}
							seriesMap[type].push(chartData[j].value)
						}
						let series = []
						for (let key in seriesMap) {
							series.push({
								name: key === 'direct' ? '' : key,
								type: item.chartType,
								label: {
									show: true
								},
								data: seriesMap[key]
							})
						}

						option.tooltip = {
							trigger: 'axis'
						}
						option.legend = {
							bottom: 10
						}
						option.xAxis = {
							data: xAxisData
						}
						option.yAxis = {}

						option.series = series
					} else if (item.chartType === 'bar-y-category') {
						// 条形图
						let xAxisData = []
						let seriesMap = {}
						for (let j = 0; j < chartData.length; j++) {
							let type = chartData[j].type || 'direct'
							if (!seriesMap.hasOwnProperty(type)) {
								seriesMap[type] = []
							}
							if (!xAxisData.includes(chartData[j].name)) {
								xAxisData.push(chartData[j].name)
							}
							seriesMap[type].push(chartData[j].value)
						}
						let series = []
						for (let key in seriesMap) {
							series.push({
								name: key === 'direct' ? '' : key,
								type: 'bar',
								label: {
									show: true
								},
								data: seriesMap[key]
							})
						}

						option.tooltip = {
							trigger: 'axis'
						}
						option.legend = {}
						option.xAxis = {}
						option.yAxis = {
							data: xAxisData
						}
						option.series = series
					} else if (item.chartType === 'pie') {
						// 饼状图
						option.tooltip = {
							trigger: 'item',
							formatter: '{b} : {c} ({d}%)'
						}
						option.series = [
							{
								type: 'pie',
								radius: '65%',
								label: {
									formatter: '{b} : {c} ({d}%)'
								},
								data: chartData
							}
						]
					} else if (item.chartType === 'pie-doughnut') {
						// 环形图
						option.tooltip = {
							trigger: 'item',
							formatter: '{b} : {c} ({d}%)'
						}
						option.series = [
							{
								type: 'pie',
								radius: ['40%', '70%'],
								label: {
									formatter: '{b} : {c} ({d}%)'
								},
								data: chartData
							}
						]
					} else if (item.chartType === 'funnel' || item.chartType === 'gauge') {
						// 漏斗图、仪表盘
						option.tooltip = {
							trigger: 'item'
						}
						option.series = [
							{
								type: item.chartType,
								mapType: 'china',
								data: chartData
							}
						]
					} else if (item.chartType === 'mix-line-bar') {
						// 折柱混合
						let xAxisData = []
						let seriesData = []
						for (let j = 0; j < chartData.length; j++) {
							xAxisData.push(chartData[j].name)
							seriesData.push(chartData[j].value)
						}

						option.tooltip = {
							trigger: 'axis'
						}
						option.xAxis = {
							data: xAxisData
						}
						option.yAxis = {}
						option.series = [
							{
								type: 'bar',
								label: {
									show: true
								},
								data: seriesData
							},
							{
								type: 'line',
								label: {
									show: true
								},
								data: seriesData
							}
						]
					} else if (item.chartType === 'map') {
						// 地图
						option.tooltip = {
							trigger: 'item'
						}
						option.geo = {
							map: 'china',
							label: {
								show: true,
								color: 'rgba(0,0,0,0.7)'
							}
						}

						option.series = [
							{
								type: 'map',
								geoIndex: 0,
								data: chartData
							}
						]
					}
					chart.setOption(option)
				}
			})
		},
		handleEvent(type, params, row) {
			if (params[type]) {
				if(type === 'rowDblclick') {
					this[params.i].selectedRow = row
				}
				for (let i = 0; i < this.config.queries.length; i++) {
					let query = this.config.queries[i]
					if (query.name === params[type]) {
						try {
							let func = new Function('that', 'params', query.script)
							func(this, params)
						} catch (e) {
							this.$message.error('js脚本错误：' + e)
						}
						break
					}
				}
			} else {
				if(type === 'rowDblclick' && params.type === 'work') {
					this.$router.push({
						path: '/handleCustomForm',
						query: {
							id: row.businessKey,
							formId: row.businessType,
							title: row.name
						}
					})
				}
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

<style scoped>
.readme-container {
	height: 100%;
	overflow: auto;
}
::v-deep .el-card {
	border-radius: 12px;
}
::v-deep .el-scrollbar__wrap {
	overflow-x: hidden;
}
.empty {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.drag-container {
	position: relative;
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	background-color: rgb(240, 242, 245);
}
::-webkit-scrollbar {
	width: 4px;
	height: 4px;
}
::-webkit-scrollbar-thumb {
	width: 4px;
	background: #ccc;
}
::-webkit-scrollbar-track {
	width: 4px;
	background: #eee;
}
</style>
