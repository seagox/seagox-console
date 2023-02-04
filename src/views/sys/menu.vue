<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
		</div>
		<div class="table">
			<!--列表-->
			<el-table
				:data="tableData"
				border
				:max-height="clientHeight - 210"
				row-key="id"
				:tree-props="{ children: 'children' }"
			>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="菜单名称" header-align="center">
					<template slot-scope="scope">
						<i :class="scope.row.icon"></i>
						{{ scope.row.name }}
					</template>
				</el-table-column>
				<el-table-column label="类型" align="center" :formatter="typeFormatter"></el-table-column>
				<el-table-column
					prop="path"
					label="菜单路径"
					align="center"
					show-overflow-tooltip
					:formatter="pathFormatter"
				></el-table-column>
				<el-table-column prop="sort" label="排序" align="center"></el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<el-switch
							v-model="scope.row.status"
							active-color="#13ce66"
							inactive-color="#ff4949"
							:active-value="1"
							:inactive-value="2"
							@change="statusChange(scope.row, $event)"
						>
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--新增界面-->
		<el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-row>
					<el-col :span="24">
						<el-form-item label="类型" prop="type">
							<el-select v-model="addForm.type" placeholder="请选择类型" @change="typeChange">
								<el-option
									v-for="item in typeOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="名称" prop="name">
							<el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="简称" prop="quickName">
							<el-input v-model="addForm.quickName" placeholder="请输入简称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级菜单" prop="parentId">
							<el-cascader
								v-model="addForm.parentId"
								:options="tableData"
								:props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }"
								clearable
								placeholder="请选择上级"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="addForm.type === 2 || addForm.type === 4 || addForm.type === 7 || addForm.type === 9">
						<el-form-item label="路径" prop="path">
							<el-input v-model="addForm.path" placeholder="请输入路径"></el-input>
						</el-form-item>
					</el-col>
					<el-col
						:span="12"
						v-if="addForm.type === 1 || addForm.type === 3 || addForm.type === 6 || addForm.type === 8"
					>
						<el-form-item label="路径" prop="path">
							<el-select v-model="addForm.path" placeholder="请选择路径" filterable>
								<el-option
									v-for="item in frgOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="图标" prop="icon">
							<el-select v-model="addForm.icon" placeholder="请选择图标" filterable>
								<el-option v-for="icon in icons" :key="icon" :label="icon" :value="icon">
									<i :class="icon"> {{ icon }} </i>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序">
							<el-input-number v-model="addForm.sort" :min="1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-switch v-model="addForm.status" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-row>
					<el-col :span="24">
						<el-form-item label="类型" prop="type">
							<el-select v-model="editForm.type" placeholder="请选择类型" @change="typeChange">
								<el-option
									v-for="item in typeOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="名称" prop="name">
							<el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="简称" prop="quickName">
							<el-input v-model="editForm.quickName" placeholder="请输入简称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级菜单" prop="parentId">
							<el-cascader
								v-model="editForm.parentId"
								:options="tableData"
								:props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }"
								clearable
								placeholder="请选择上级"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="editForm.type === 2 || editForm.type === 4 || editForm.type === 7 || editForm.type === 9">
						<el-form-item label="路径" prop="path">
							<el-input v-model="editForm.path" placeholder="请输入路径"></el-input>
						</el-form-item>
					</el-col>
					<el-col
						:span="12"
						v-if="editForm.type === 1 || editForm.type === 3 || editForm.type === 6 || editForm.type === 8"
					>
						<el-form-item label="路径" prop="path">
							<el-select v-model="editForm.path" placeholder="请选择路径">
								<el-option
									v-for="item in frgOptions"
									:key="item.id"
									:label="item.name"
									:value="String(item.id)"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="图标" prop="icon">
							<el-select v-model="editForm.icon" placeholder="请选择图标" filterable>
								<el-option v-for="icon in icons" :key="icon" :label="icon" :value="icon">
									<i :class="icon"> {{ icon }} </i>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序">
							<el-input-number v-model="editForm.sort" :min="1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-switch v-model="editForm.status" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editSubmit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
			typeOptions: [
				{
					value: 1,
					label: '列表'
				},
				{
					value: 2,
					label: '按钮'
				},
				{
					value: 3,
					label: '新增页面'
				},
				{
					value: 4,
					label: '系统菜单'
				},
				{
					value: 5,
					label: '目录'
				},
				{
					value: 6,
					label: '仪表板'
				},
				{
					value: 7,
					label: '自定义页面'
				},
				{
					value: 8,
					label: '报表'
				},
				{
					value: 9,
					label: '单页面'
				}
			],
			tableData: [],
			addFormVisible: false,
			addForm: {
				companyId: '',
				type: '',
				name: '',
				parentId: '',
				icon: '',
				path: '',
				status: 1,
				sort: 1,
				quickName: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				companyId: '',
				type: '',
				name: '',
				parentId: '',
				icon: '',
				path: '',
				status: 1,
				sort: 1,
				quickName: ''
			},
			formRules: {
				type: [{ required: true, message: '请选择类型', trigger: 'change' }],
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				path: [{ required: true, message: '请输入路径', trigger: 'blur,change' }],
				icon: [{ required: true, message: '请选择图标', trigger: 'change' }],
				quickName: [{ max: 30, message: '简称不超过30个字符', trigger: 'blur' }]
			},
			frgOptions: [],
			icons: [
				'el-icon-delete',
				'el-icon-setting',
				'el-icon-user',
				'el-icon-more-outline',
				'el-icon-star-off',
				'el-icon-zoom-in',
				'el-icon-zoom-out',
				'el-icon-warning-outline',
				'el-icon-phone-outline',
				'el-icon-remove-outline',
				'el-icon-circle-plus-outline',
				'el-icon-circle-check',
				'el-icon-circle-close',
				'el-icon-help',
				'el-icon-minus',
				'el-icon-plus',
				'el-icon-check',
				'el-icon-close',
				'el-icon-picture-outline',
				'el-icon-picture-outline-round',
				'el-icon-upload2',
				'el-icon-download',
				'el-icon-camera',
				'el-icon-video-camera',
				'el-icon-bell',
				'el-icon-bottom-left',
				'el-icon-bottom-right',
				'el-icon-back',
				'el-icon-right',
				'el-icon-bottom',
				'el-icon-top',
				'el-icon-top-left',
				'el-icon-top-right',
				'el-icon-arrow-left',
				'el-icon-arrow-right',
				'el-icon-arrow-down',
				'el-icon-arrow-up',
				'el-icon-d-arrow-left',
				'el-icon-d-arrow-right',
				'el-icon-video-pause',
				'el-icon-video-play',
				'el-icon-refresh',
				'el-icon-refresh-right',
				'el-icon-refresh-left',
				'el-icon-finished',
				'el-icon-sort',
				'el-icon-sort-up',
				'el-icon-sort-down',
				'el-icon-rank',
				'el-icon-view',
				'el-icon-c-scale-to-original',
				'el-icon-date',
				'el-icon-edit',
				'el-icon-edit-outline',
				'el-icon-folder',
				'el-icon-folder-opened',
				'el-icon-folder-add',
				'el-icon-folder-remove',
				'el-icon-folder-delete',
				'el-icon-folder-checked',
				'el-icon-tickets',
				'el-icon-document-remove',
				'el-icon-document-delete',
				'el-icon-document-copy',
				'el-icon-document-checked',
				'el-icon-document',
				'el-icon-document-add',
				'el-icon-printer',
				'el-icon-paperclip',
				'el-icon-takeaway-box',
				'el-icon-search',
				'el-icon-monitor',
				'el-icon-attract',
				'el-icon-mobile',
				'el-icon-scissors',
				'el-icon-umbrella',
				'el-icon-headset',
				'el-icon-brush',
				'el-icon-mouse',
				'el-icon-coordinate',
				'el-icon-magic-stick',
				'el-icon-reading',
				'el-icon-data-line',
				'el-icon-data-board',
				'el-icon-pie-chart',
				'el-icon-data-analysis',
				'el-icon-collection-tag',
				'el-icon-film',
				'el-icon-suitcase',
				'el-icon-suitcase-1',
				'el-icon-receiving',
				'el-icon-collection',
				'el-icon-files',
				'el-icon-notebook-1',
				'el-icon-notebook-2',
				'el-icon-toilet-paper',
				'el-icon-office-building',
				'el-icon-school',
				'el-icon-table-lamp',
				'el-icon-house',
				'el-icon-no-smoking',
				'el-icon-smoking',
				'el-icon-shopping-cart-full',
				'el-icon-shopping-cart-1',
				'el-icon-shopping-cart-2',
				'el-icon-shopping-bag-1',
				'el-icon-shopping-bag-2',
				'el-icon-sold-out',
				'el-icon-sell',
				'el-icon-present',
				'el-icon-box',
				'el-icon-bank-card',
				'el-icon-money',
				'el-icon-coin',
				'el-icon-wallet',
				'el-icon-discount',
				'el-icon-price-tag',
				'el-icon-news',
				'el-icon-guide',
				'el-icon-male',
				'el-icon-female',
				'el-icon-thumb',
				'el-icon-cpu',
				'el-icon-link',
				'el-icon-connection',
				'el-icon-open',
				'el-icon-turn-off',
				'el-icon-set-up',
				'el-icon-chat-round',
				'el-icon-chat-line-round',
				'el-icon-chat-square',
				'el-icon-chat-dot-round',
				'el-icon-chat-dot-square',
				'el-icon-chat-line-square',
				'el-icon-message',
				'el-icon-postcard',
				'el-icon-position',
				'el-icon-turn-off-microphone',
				'el-icon-microphone',
				'el-icon-close-notification',
				'el-icon-bangzhu',
				'el-icon-time',
				'el-icon-odometer',
				'el-icon-crop',
				'el-icon-aim',
				'el-icon-switch-button',
				'el-icon-full-screen',
				'el-icon-copy-document',
				'el-icon-mic',
				'el-icon-stopwatch',
				'el-icon-medal-1',
				'el-icon-medal',
				'el-icon-trophy',
				'el-icon-trophy-1',
				'el-icon-first-aid-kit',
				'el-icon-discover',
				'el-icon-place',
				'el-icon-location',
				'el-icon-location-outline',
				'el-icon-location-information',
				'el-icon-add-location',
				'el-icon-delete-location',
				'el-icon-map-location',
				'el-icon-alarm-clock',
				'el-icon-timer',
				'el-icon-watch-1',
				'el-icon-watch',
				'el-icon-lock',
				'el-icon-unlock',
				'el-icon-key',
				'el-icon-service',
				'el-icon-mobile-phone',
				'el-icon-bicycle',
				'el-icon-truck',
				'el-icon-ship',
				'el-icon-basketball',
				'el-icon-football',
				'el-icon-soccer',
				'el-icon-baseball',
				'el-icon-wind-power',
				'el-icon-light-rain',
				'el-icon-lightning',
				'el-icon-heavy-rain',
				'el-icon-sunrise',
				'el-icon-sunrise-1',
				'el-icon-sunset',
				'el-icon-sunny',
				'el-icon-cloudy',
				'el-icon-partly-cloudy',
				'el-icon-cloudy-and-sunny',
				'el-icon-moon',
				'el-icon-moon-night',
				'el-icon-dish',
				'el-icon-dish-1',
				'el-icon-food',
				'el-icon-chicken',
				'el-icon-fork-spoon',
				'el-icon-knife-fork',
				'el-icon-burger',
				'el-icon-tableware',
				'el-icon-sugar',
				'el-icon-dessert',
				'el-icon-ice-cream',
				'el-icon-hot-water',
				'el-icon-water-cup',
				'el-icon-coffee-cup',
				'el-icon-cold-drink',
				'el-icon-goblet',
				'el-icon-goblet-full',
				'el-icon-goblet-square',
				'el-icon-goblet-square-full',
				'el-icon-refrigerator',
				'el-icon-grape',
				'el-icon-watermelon',
				'el-icon-cherry',
				'el-icon-apple',
				'el-icon-pear',
				'el-icon-orange',
				'el-icon-coffee',
				'el-icon-ice-tea',
				'el-icon-ice-drink',
				'el-icon-milk-tea',
				'el-icon-potato-strips',
				'el-icon-lollipop',
				'el-icon-ice-cream-square',
				'el-icon-ice-cream-round'
			]
		}
	},
	created() {
		this.queryByCompanyId()
	},
	methods: {
		async queryByCompanyId() {
			const res = await this.$axios.get('menu/queryByCompanyId')
			if (res.data.code == 200) {
				this.tableData = res.data.data
			}
		},
		async queryForm() {
			const res = await this.$axios.get('jellyForm/queryByCompanyId')
			if (res.data.code == 200) {
				this.frgOptions = res.data.data
			}
		},
		async queryGauge() {
			const res = await this.$axios.get('gauge/queryByCompanyId')
			if (res.data.code == 200) {
				this.frgOptions = res.data.data
			}
		},
		async queryReport() {
			const res = await this.$axios.get('jellyReport/queryByCompanyId')
			if (res.data.code == 200) {
				this.frgOptions = res.data.data
			}
		},
		typeFormatter(row) {
			if (row.type === 1) {
				return '列表'
			} else if (row.type === 2) {
				return '按钮'
			} else if (row.type === 3) {
				return '新增页面'
			} else if (row.type === 4) {
				return '系统菜单'
			} else if (row.type === 5) {
				return '目录'
			} else if (row.type === 6) {
				return '仪表板'
			} else if (row.type === 7) {
				return '自定义页面'
			} else if (row.type === 8) {
				return '报表'
			} else if (row.type === 9) {
				return '单页面'
			}
		},
		pathFormatter(row) {
			if (row.type === 1 || row.type === 3 || row.type === 6 || row.type === 8) {
				return ''
			} else {
				return row.path
			}
		},
		typeChange(value) {
			if (value === 1 || value === 3) {
				this.queryForm()
			} else if (value === 6) {
				this.queryGauge()
			} else if (value === 8) {
				this.queryReport()
			}
			if (this.addFormVisible) {
				this.addForm.path = ''
			} else {
				this.editForm.path = ''
			}
		},
		statusChange(row, value) {
			let that = this
			var params = {
				id: row.id,
				status: value,
				parentId: row.parent_id
			}
			that.$axios.post('menu/update', params).then(res => {
				if (res.data.code == 200) {
					if (value === 1) {
						that.$message.success('启用成功')
					} else {
						that.$message.success('禁用成功')
					}
				} else {
					that.$message.error(res.data.message)
				}
			})
		},
		showAddDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
		},
		addSubmit() {
			let that = this
			this.$refs.addForm.validate(valid => {
				if (valid) {
					that.$axios.post('menu/insert', that.addForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.addFormVisible = false
							that.queryByCompanyId()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		showEditDialog(row) {
			let that = this
			this.editForm = Object.assign({}, row)
			this.editFormVisible = true
			if (this.$refs.editForm) {
				this.$refs.editForm.resetFields()
			}
			if (this.editForm.type === 1 || this.editForm.type === 3) {
				this.queryForm()
			} else if (this.editForm.type === 6) {
				this.queryGauge()
			} else if (this.editForm.type === 8) {
				this.queryReport()
			}
		},
		editSubmit() {
			let that = this
			this.$refs.editForm.validate(valid => {
				if (valid) {
					var params = {
						icon: that.editForm.icon,
						id: that.editForm.id,
						type: that.editForm.type,
						name: that.editForm.name,
						path: that.editForm.path,
						sort: that.editForm.sort,
						status: that.editForm.status,
						parentId: that.editForm.parentId,
						quickName: that.editForm.quickName
					}
					that.$axios.post('menu/update', params).then(res => {
						if (res.data.code == 200) {
							that.$message.success('修改成功')
							that.editFormVisible = false
							that.queryByCompanyId()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		deleteSubmit(row) {
			let that = this
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('menu/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.pageNo = 1
						that.queryByCompanyId()
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		}
	}
}
</script>
