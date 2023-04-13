<template>
	<div class="container">
		<div class="header">
			<div class="header-left">
				<div class="header-back" @click="toReturn"><i class="el-icon-arrow-left"></i></div>
				<div class="header-title">{{ title }}</div>
			</div>
			<div class="header-right">
				<el-popover placement="bottom" width="300">
					<div>
						<p>右键：添加节点</p>
						<p>点击连接线：删除连接线</p>
						<p>双击连接线：设置连接线文本</p>
						<p>拖动小圆点：节点之间连接</p>
						<p>双击节点：设置节点属性</p>
						<p>节点右键：删除节点</p>
						<p>按住节点：可自由拖拽</p>
					</div>
					<div class="header-question" slot="reference"><i class="el-icon-question"></i></div>
				</el-popover>
				<el-button class="button-publish" @click="handlePublish">发 布</el-button>
			</div>
		</div>
		<div
			id="relation-box"
			:style="{ height: height - 60 + 'px' }"
			@contextmenu.prevent="rightClickOpen($event)"
			@click="rightClickClose"
		>
			<div
				v-for="(item, index) in nodes"
				:key="item.id"
				:id="item.id"
				:class="item.type"
				:style="{ left: item.left + 'px', top: item.top + 'px' }"
				@contextmenu.stop.prevent="nodeRightClickOpen(index, item, $event)"
				@dblclick="handleNodelDblClick(index, item)"
			>
				<div
					v-if="
						item.type == 'start' ||
							item.type == 'end' ||
							item.type == 'approver' ||
							item.type == 'notifier' ||
							item.type == 'condition'
					"
				>
					{{ item.label }}
				</div>
				<i class="el-icon-user type-icon" style="color:#0089FF" v-if="item.type === 'approver'"></i>
				<i class="el-icon-position type-icon" style="color:#FF943E" v-if="item.type === 'notifier'"></i>
				<i class="el-icon-guide type-icon" style="color:#15bc83" v-if="item.type === 'condition'"></i>
				<div v-if="item.type === 'parallelGateWay'">
					<i class="el-icon-plus" style="font-size:24px;font-weight:bold"></i>
				</div>
				<div v-if="item.type === 'exclusiveGateway'">
					<i class="el-icon-close" style="font-size:24px;font-weight:bold"></i>
				</div>
				<div v-if="item.type === 'manualSelection'">
					<i class="el-icon-rank" style="font-size:24px;font-weight:bold"></i>
				</div>
			</div>
		</div>
		<nodeSetting
			ref="nodeSetting"
			:nodeInfo="currentNode"
			:operationAuthority="form.operationAuthority"
			@updateNodeInfo="updateNodeInfo"
		>
		</nodeSetting>
		<condition ref="condition" @updateNodeInfo="updateNodeInfo"> </condition>
		<ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
			<li @click="handleAddNodeClick('approver')">
				<i class="el-icon-user" style="color:#0089FF;font-size:14px;"> 审批任务</i>
			</li>
			<li @click="handleAddNodeClick('notifier')">
				<i class="el-icon-position" style="color:#FF943E;font-size:14px;"> 抄送任务</i>
			</li>
			<li @click="handleAddNodeClick('condition')">
				<i class="el-icon-guide" style="color:#15bc83;font-size:14px;"> 条件分支</i>
			</li>
			<li @click="handleAddNodeClick('exclusiveGateway')">
				<i class="el-icon-close" style="color:#000;font-size:14px;"> 排他网关</i>
			</li>
			<li @click="handleAddNodeClick('parallelGateWay')">
				<i class="el-icon-plus" style="color:#000;font-size:14px;"> 并行网关</i>
			</li>
			<li @click="handleAddNodeClick('manualSelection')">
				<i class="el-icon-rank" style="color:#000;font-size:14px;"> 手动选择</i>
			</li>
		</ul>
		<ul v-show="nodeVisible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
			<li @click="handleDelNode"><i class="el-icon-delete" style="color:#F56C6C;font-size:14px;"> 删 除</i></li>
		</ul>
		<el-dialog title="文本设置" :visible.sync="edgeDialogVisible" width="500px">
			<el-input v-model="connText" placeholder="请输入连接线文本" maxlength="7" show-word-limit></el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click="edgeDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleEdgeText">确 定</el-button>
			</div>
		</el-dialog>
		<!-- <div class="function">
			<div>开始</div>
			<div>审批</div>
			<div>抄送</div>
			<div>结束</div>
		</div> -->
	</div>
</template>
 
<script>
import { jsPlumb } from 'jsplumb'
import nodeSetting from '@/views/flow/node-setting'
import condition from '@/views/flow/condition'
let lineTimes = null
export default {
	components: {
		nodeSetting,
		condition
	},
	data() {
		return {
			height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
			jsPlumbInstance: '', // 画线实例
			// jsPlumb默认配置
			jsPlumbSetting: {
				// 连线的样式
				//Bezier: 贝塞尔曲线
				//Flowchart: 具有90度转折点的流程线
				//StateMachine: 状态机
				//Straight: 直线
				Connector: ['Flowchart'],
				Endpoint: ['Dot', { radius: 4 }],
				EndpointStyle: {
					stroke: '#888',
					fill: '#fff'
				},
				PaintStyle: { stroke: '#000', strokeWidth: 2 },
				Overlays: [['Arrow', { width: 10, length: 10, location: 1 }]]
			},
			jsPlumbConnectOptions: {
				isSource: true,
				isTarget: true,
				// 动态锚点、提供了4个方向 Continuous、AutoDefault
				anchor: 'AutoDefault'
				// 锚点的位置
				//anchor: ['BottomCenter', 'TopCenter']
			},
			nodes: [
				{
					id: 'start',
					type: 'start',
					label: '开始',
					left: 520,
					top: 30
				},
				{
					id: 'end',
					type: 'end',
					label: '结束',
					left: 520,
					top: 300
				}
			],
			edges: [],
			currentIndex: -1,
			currentNode: {},
			form: {},
			top: 0,
			left: 0,
			visible: false,
			edgeDialogVisible: false,
			connText: '',
			currentConn: {},
			nodeVisible: false
		}
	},
	computed: {
		title() {
			return this.$route.query.title
		}
	},
	mounted() {
		document.onselectstart = function() {
			return false
		}
		this.queryById()
	},
	methods: {
		async queryById() {
			let res = await this.$axios.get('seaDefinition/queryById/' + this.$route.query.id)
			if (res.data.code == 200) {
				this.form = res.data.data
				if (res.data.data.resources) {
					var resource = JSON.parse(res.data.data.resources)
					var nodesMap = resource.nodes
					var nodes = []
					for (let key in nodesMap) {
						nodes.push(nodesMap[key])
					}
					this.nodes = nodes
					this.edges = resource.edges
				}
				this.drawLines()
			}
		},
		drawLines() {
			this.$nextTick().then(() => {
				jsPlumb.ready(() => {
					this.jsPlumbInstance = jsPlumb.getInstance()

					this.jsPlumbInstance.importDefaults(this.jsPlumbSetting)

					this.nodes.forEach(item => {
						if (item.id === 'start') {
							//拖拽
							this.jsPlumbInstance.draggable(item.id, {
								drag(event) {
									if (event.pos[0] < 0) {
										let startNode = document.getElementById(event.el.id)
										startNode.style.left = 0
									}
									if (event.pos[1] < 0) {
										let startNode = document.getElementById(event.el.id)
										startNode.style.top = 0
									}
								}
							})
							//瞄点
							this.jsPlumbInstance.addEndpoint(
								item.id,
								{
									anchors: ['Bottom']
								},
								{
									isSource: true,
									isTarget: false,
									connector: ['Flowchart'],
									maxConnections: -1
								}
							)
						} else if (item.id === 'end') {
							//拖拽
							this.jsPlumbInstance.draggable(item.id, {
								drag(event) {
									if (event.pos[0] < 0) {
										let startNode = document.getElementById(event.el.id)
										startNode.style.left = 0
									}
									if (event.pos[1] < 0) {
										let startNode = document.getElementById(event.el.id)
										startNode.style.top = 0
									}
								}
							})
							//瞄点
							this.jsPlumbInstance.addEndpoint(
								item.id,
								{
									anchors: ['Top']
								},
								{
									isSource: false,
									isTarget: true,
									connector: ['Flowchart'],
									maxConnections: -1
								}
							)
						} else {
							//拖拽
							this.jsPlumbInstance.draggable(item.id, { containment: 'parent' })
							//瞄点
							this.jsPlumbInstance.addEndpoint(
								item.id,
								{
									anchors: ['Top']
								},
								{
									isSource: true,
									isTarget: true,
									connector: ['Flowchart'],
									maxConnections: -1
								}
							)
							this.jsPlumbInstance.addEndpoint(
								item.id,
								{
									anchors: ['Bottom']
								},
								{
									isSource: true,
									isTarget: true,
									connector: ['Flowchart'],
									maxConnections: -1
								}
							)
							this.jsPlumbInstance.addEndpoint(
								item.id,
								{
									anchors: ['Left']
								},
								{
									isSource: true,
									isTarget: true,
									connector: ['Flowchart'],
									maxConnections: -1
								}
							)
							this.jsPlumbInstance.addEndpoint(
								item.id,
								{
									anchors: ['Right']
								},
								{
									isSource: true,
									isTarget: true,
									connector: ['Flowchart'],
									maxConnections: -1
								}
							)
						}
					})
					//连接线
					this.edges.forEach(item => {
						if (item.label) {
							item.overlays = [
								[
									'Label',
									{ label: item.label, location: 0.5, id: 'label', cssClass: 'process-point-label' }
								]
							]
						}
						this.jsPlumbInstance.connect(item, this.jsPlumbConnectOptions)
					})
					//删除新连接或现有连接时触发此事件
					this.jsPlumbInstance.bind('beforeDrop', conn => {
						let allConnections = this.jsPlumbInstance.getAllConnections()
						let repeatFlag = false
						for (let i = 0; i < allConnections.length; i++) {
							if (
								(conn.sourceId === allConnections[i].sourceId &&
									conn.targetId === allConnections[i].targetId) ||
								(conn.sourceId === allConnections[i].targetId &&
									conn.targetId === allConnections[i].sourceId)
							) {
								repeatFlag = true
								break
							}
						}
						if (repeatFlag) {
							return false
						} else {
							this.edges.push({
								source: conn.sourceId,
								target: conn.targetId
							})
							return true
						}
					})
					//单击连接线删除
					this.jsPlumbInstance.bind('click', conn => {
						// 取消上次延时未执行的方法
						clearTimeout(lineTimes)
						let that = this
						lineTimes = setTimeout(function() {
							that.jsPlumbInstance.deleteConnection(conn)
							for (let i = 0; i < that.edges.length; i++) {
								if (that.edges[i].source === conn.sourceId && that.edges[i].target === conn.targetId) {
									that.edges.splice(i, 1)
									break
								}
							}
						}, 300)
					})
					//双击给线添加label
					this.jsPlumbInstance.bind('dblclick', conn => {
						// 取消上次延时未执行的方法
						clearTimeout(lineTimes)
						this.edgeDialogVisible = true
						this.currentConn = conn
						for (let i = 0; i < this.edges.length; i++) {
							if (this.edges[i].source === conn.sourceId && this.edges[i].target === conn.targetId) {
								this.connText = this.edges[i].label
								break
							}
						}
					})

					this.jsPlumbInstance.repaintEverything() // 重绘
				})
			})
		},
		rightClickOpen(e) {
			this.top = e.pageY
			this.left = e.pageX
			this.visible = true
		},
		rightClickClose() {
			this.visible = false
			this.nodeVisible = false
		},
		nodeRightClickOpen(index, item, e) {
			if (
				item.type === 'approver' ||
				item.type === 'notifier' ||
				item.type === 'condition' ||
				item.type === 'parallelGateWay' ||
				item.type === 'exclusiveGateway' ||
				item.type === 'manualSelection'
			) {
				this.currentIndex = index
				this.currentNode = item
				this.top = e.pageY
				this.left = e.pageX
				this.nodeVisible = true
			}
		},
		handleAddNodeClick(command) {
			this.visible = false
			let nodeId = Math.random()
				.toString(36)
				.slice(-6)
			if (command === 'approver') {
				this.nodes.push({
					id: nodeId,
					type: 'approver',
					label: '审批任务',
					top: this.top,
					left: this.left
				})
			} else if (command === 'notifier') {
				this.nodes.push({
					id: nodeId,
					type: 'notifier',
					label: '抄送任务',
					top: this.top,
					left: this.left
				})
			} else if (command === 'condition') {
				this.nodes.push({
					id: nodeId,
					type: 'condition',
					label: '条件分支',
					top: this.top,
					left: this.left
				})
			} else if (command === 'exclusiveGateway') {
				this.nodes.push({
					id: nodeId,
					type: 'exclusiveGateway',
					label: '排他网关',
					top: this.top,
					left: this.left
				})
			} else if (command === 'parallelGateWay') {
				this.nodes.push({
					id: nodeId,
					type: 'parallelGateWay',
					label: '并行网关',
					top: this.top,
					left: this.left
				})
			} else if (command === 'manualSelection') {
				this.nodes.push({
					id: nodeId,
					type: 'manualSelection',
					label: '手动选择',
					top: this.top,
					left: this.left
				})
			}
			this.$nextTick().then(() => {
				//拖拽
				this.jsPlumbInstance.draggable(nodeId, {
					containment: 'parent'
				})
				this.jsPlumbInstance.addEndpoint(
					nodeId,
					{
						anchor: ['Top']
					},
					{
						isSource: true,
						isTarget: true,
						connector: ['Flowchart'],
						maxConnections: -1
					}
				)
				this.jsPlumbInstance.addEndpoint(
					nodeId,
					{
						anchor: ['Bottom']
					},
					{
						isSource: true,
						isTarget: true,
						connector: ['Flowchart'],
						maxConnections: -1
					}
				)
				this.jsPlumbInstance.addEndpoint(
					nodeId,
					{
						anchor: ['Left']
					},
					{
						isSource: true,
						isTarget: true,
						connector: ['Flowchart'],
						maxConnections: -1
					}
				)
				this.jsPlumbInstance.addEndpoint(
					nodeId,
					{
						anchor: ['Right']
					},
					{
						isSource: true,
						isTarget: true,
						connector: ['Flowchart'],
						maxConnections: -1
					}
				)
			})
		},
		handleNodelDblClick(index, item) {
			this.currentIndex = index
			this.currentNode = item
			if (item.type === 'approver' || item.type === 'notifier') {
				this.$refs.nodeSetting.showDialog()
			} else if (item.type === 'condition') {
				this.$refs.condition.showDialog(item)
			}
		},
		handleDelNode() {
			if (
				this.currentNode.type === 'approver' ||
				this.currentNode.type === 'notifier' ||
				this.currentNode.type === 'condition' ||
				this.currentNode.type === 'parallelGateWay' ||
				this.currentNode.type === 'exclusiveGateway' ||
				this.currentNode.type === 'manualSelection'
			) {
				this.jsPlumbInstance.remove(this.currentNode.id)
				for (let i = 0; i < this.nodes.length; i++) {
					if (this.nodes[i].id === this.currentNode.id) {
						this.nodes.splice(i, 1)
						break
					}
				}
				for (let i = 0; i < this.edges.length; i++) {
					if (this.edges[i].source === this.currentNode.id || this.edges[i].target === this.currentNode.id) {
						this.edges.splice(i, 1)
					}
				}
				this.currentIndex = -1
				this.currentNode = {}
				this.nodeVisible = false
			}
		},
		toReturn() {
			this.$router.go(-1)
		},
		handlePublish() {
			let nodes = {}
			let edges = []
			let sourceList = []
			let targetList = []
			let allConnections = this.jsPlumbInstance.getAllConnections()
			let repeatFlag = false
			for (let i = 0; i < allConnections.length; i++) {
				edges.push({
					source: allConnections[i].sourceId,
					target: allConnections[i].targetId,
					label: allConnections[i].getLabel()
				})
				sourceList.push(allConnections[i].sourceId)
				targetList.push(allConnections[i].targetId)
			}
			for (let i = 0; i < this.nodes.length; i++) {
				let nodeItem = this.nodes[i]
				let nodeStyle = document.getElementById(nodeItem.id).style
				if (nodeStyle.top) {
					nodeItem.top = nodeStyle.top.replace('px', '')
				}
				if (nodeStyle.left) {
					nodeItem.left = nodeStyle.left.replace('px', '')
				}
				this.nodes[i] = nodeItem
				nodes[nodeItem.id] = nodeItem
				if (nodeItem.id === 'start') {
					if (sourceList.indexOf(nodeItem.id) === -1) {
						//开始节点未连线
						this.$message.error(nodeItem.label + '节点未连线')
						return
					}
				} else if (nodeItem.id === 'end') {
					if (targetList.indexOf(nodeItem.id) === -1) {
						//结束节点未连线
						this.$message.error(nodeItem.label + '节点未连线')
						return
					}
				} else {
					if (sourceList.indexOf(nodeItem.id) === -1 || targetList.indexOf(nodeItem.id) === -1) {
						//节点未连线
						this.$message.error(nodeItem.label + '节点未连线')
						return
					}
					if ((nodeItem.type === 'approver' || nodeItem.type === 'notifier') && nodeItem.approverType != 7) {
						//审批或抄送节点(发起人自己不用设置条件)
						if (!nodeItem.value || nodeItem.value.length === 0) {
							this.$message.error(nodeItem.label + '节点未设置条件')
							return
						}
					} else if (nodeItem.type === 'condition') {
						//条件分支
						if (!nodeItem.condition) {
							this.$message.error(nodeItem.label + '节点未设置条件')
							return
						}
					}
				}
			}
			var resource = {
				nodes: nodes,
				edges: edges
			}
			var params = {
				id: this.$route.query.id,
				dataSource: this.form.dataSource,
				resource: JSON.stringify(resource)
			}
			this.$axios.post('seaDefinition/update', params).then(res => {
				if (res.data.code == 200) {
					this.$message.success('发布成功')
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		updateNodeInfo(data) {
			this.$set(this.nodes, this.currentIndex, data)
		},
		handleEdgeText() {
			this.edgeDialogVisible = false
			for (let i = 0; i < this.edges.length; i++) {
				if (
					this.edges[i].source === this.currentConn.sourceId &&
					this.edges[i].target === this.currentConn.targetId
				) {
					this.edges[i].label = this.connText != '' ? this.connText : null
					break
				}
			}

			this.jsPlumbInstance.deleteEveryConnection()
			//连接线
			this.edges.forEach(item => {
				if (item.label) {
					item.overlays = [
						['Label', { label: item.label, location: 0.5, id: 'label', cssClass: 'process-point-label' }]
					]
				} else {
					item.overlays = []
				}
				this.jsPlumbInstance.connect(item, this.jsPlumbConnectOptions)
			})
		}
	}
}
</script>
 
<style scoped>
.container {
	background-color: #f7f8fa;
	background-image: url('../../assets/dot.png');
}

.function {
	position: fixed;
	left: 15px;
	top: 50%;
	padding: 24px;
	background-color: #fff;
	border-radius: 20px;
	box-shadow: 0 8px 12px #ebedf0;
}

.header {
	width: 100%;
	height: 60px;
	font-size: 14px;
	color: #fff;
	background: #3296fa;
	display: flex;
	align-items: center;
}

.header > * {
	flex: 1;
	width: 100%;
}

.header-left {
	display: -webkit-box;
	display: flex;
	align-items: center;
}

.header-back {
	display: inline-block;
	width: 60px;
	height: 60px;
	font-size: 22px;
	border-right: 1px solid #1583f2;
	text-align: center;
	cursor: pointer;
}

.header-back .el-icon-arrow-left {
	line-height: 60px;
}

.header-back:hover {
	background: #5af;
}

.header-question {
	display: inline-block;
	width: 60px;
	height: 60px;
	font-size: 22px;
	text-align: center;
	cursor: pointer;
}

.header-question .el-icon-question {
	line-height: 60px;
}

.header-question:hover {
	background: #5af;
}

.header-title {
	width: 0;
	flex: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	padding: 0 15px;
}

.header-right {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	text-align: right;
}

.button-publish {
	min-width: 80px;
	margin-left: 4px;
	margin-right: 15px;
	color: #3296fa;
	border-color: #fff;
	height: 32px;
	line-height: 32px;
	padding: 0px 20px;
}

#relation-box {
	position: relative;
	overflow: auto;
}

::v-deep .process-point-label {
	background: #fff;
	padding: 4px;
}

.start {
	position: absolute;
	border: 2px solid #77c67c;
	width: 92px;
	height: 92px;
	border-radius: 50%;
	text-align: center;
	line-height: 92px;
	background-color: #f1f8f1;
	cursor: pointer;
}

.end {
	position: absolute;
	border: 2px solid #f56c6c;
	width: 92px;
	height: 92px;
	border-radius: 50%;
	text-align: center;
	line-height: 92px;
	background-color: #fef0f0;
	cursor: pointer;
}

.approver {
	position: absolute;
	border: 2px solid #0089ff;
	width: 150px;
	height: 75px;
	border-radius: 8px;
	text-align: center;
	line-height: 75px;
	background-color: #fff;
	cursor: pointer;
}

.notifier {
	position: absolute;
	border: 2px solid#FF943E;
	width: 150px;
	height: 75px;
	border-radius: 8px;
	text-align: center;
	line-height: 75px;
	background-color: #fff;
	cursor: pointer;
}

.condition {
	position: absolute;
	border: 2px solid #15bc83;
	width: 150px;
	height: 75px;
	border-radius: 8px;
	text-align: center;
	line-height: 75px;
	background-color: #fff;
	cursor: pointer;
}

.exclusiveGateway,
.parallelGateWay {
	position: absolute;
	border: 2px solid #000;
	width: 72px;
	height: 72px;
	border-radius: 8px;
	transform: rotate(45deg) scale(0.75);
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fff;
}
.exclusiveGateway i,
.parallelGateWay i {
	transform: rotate(-45deg) scale(1.33) translateY(-8%);
}

.manualSelection {
	position: absolute;
	border: 2px solid #000;
	width: 72px;
	height: 72px;
	border-radius: 8px;
	background-color: #fff;
	cursor: pointer;
	transform: rotate(45deg) scale(0.75);
	display: flex;
	align-items: center;
	justify-content: center;
}

.manualSelection i {
	transform: rotate(-45deg) scale(1.33) translateY(-8%);
}

.contextmenu {
	margin: 0;
	background: #fff;
	z-index: 3000;
	position: absolute;
	list-style-type: none;
	padding: 5px 0;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 400;
	color: #333;
	box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu li {
	margin: 0;
	padding: 7px 16px;
	cursor: pointer;
}

.contextmenu li:hover {
	background: #eee;
}

.type-icon {
	width: 12px;
	height: 12px;
	position: absolute;
	top: 4px;
	left: 4px;
}
</style>
 