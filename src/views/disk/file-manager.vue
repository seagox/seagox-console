<template>
	<div>
		<el-container :style="'height:' + (clientHeight - 110) + 'px'">
			<el-aside width="210px" class="aside" style="padding-left:15px;padding-top:15px;">
				<el-menu default-active="1" @select="selectMenu">
					<el-menu-item index="1">
						<i class="el-icon-folder"></i>
						<span slot="title">全部文件</span>
					</el-menu-item>
					<el-menu-item index="2">
						<i class="el-icon-picture-outline"></i>
						<span slot="title">图片</span>
					</el-menu-item>
					<el-menu-item index="3">
						<i class="el-icon-document"></i>
						<span slot="title">文档</span>
					</el-menu-item>
					<el-menu-item index="4">
						<i class="el-icon-video-camera"></i>
						<span slot="title">视频</span>
					</el-menu-item>
					<el-menu-item index="5">
						<i class="el-icon-headset"></i>
						<span slot="title">音乐</span>
					</el-menu-item>
					<el-menu-item index="6">
						<i class="el-icon-more"></i>
						<span slot="title">其它</span>
					</el-menu-item>
					<el-menu-item index="7">
						<i class="el-icon-delete"></i>
						<span slot="title">回收站</span>
					</el-menu-item>
					<el-menu-item index="8">
						<i class="el-icon-share"></i>
						<span slot="title">他人分享</span>
					</el-menu-item>
				</el-menu>
			</el-aside>
			<el-main>
				<!--文件列表-->
				<div v-if="menuIndex < 7">
					<div>
						<el-form :inline="true">
							<el-form-item>
								<!--<el-upload-->
								<!--:action="action"-->
								<!--:headers="headers"-->
								<!--:data="uploadParams"-->
								<!--:before-upload="beforeUpload"-->
								<!--:on-success="onSuccess"-->
								<!--:auto-upload="true"-->
								<!--:show-file-list="false">-->
								<!--<el-button size="medium" type="primary" icon="el-icon-upload2">上传</el-button>-->
								<!--</el-upload>-->
								<el-button size="medium" type="primary" icon="el-icon-upload2" @click="upload"
									>上传</el-button
								>
							</el-form-item>
							<el-form-item>
								<el-dropdown @command="handleCommand">
									<el-button type="primary" plain size="medium" class="el-icon-folder-add">
										新 建
									</el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="folder">新建文件夹</el-dropdown-item>
										<el-dropdown-item command="richText">新建在线文档(富文本)</el-dropdown-item>
										<el-dropdown-item command="markdown">新建在线文档(markdown)</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-form-item>
							<div style="float: right; display: flex;">
								<el-input
									v-model="searchContent.name"
									size="medium"
									clearable
									placeholder="请输入文件名称"
									style="width:200px;"
								></el-input>
								<el-button
									style="margin-left:15px"
									type="primary"
									icon="el-icon-search"
									size="medium"
									@click="search"
									>查询</el-button
								>
								<i
									:class="listMode === 'list' ? 'el-icon-menu' : 'el-icon-s-operation'"
									style="margin-left:15px;line-height:32px;font-size:24px;cursor:pointer;color:#afb3bf;"
									@click="changeListMode"
								></i>
							</div>
						</el-form>
						<div v-if="parentId != 0">
							<el-button type="text" @click="backToPrevious">返回上一级</el-button>
							<span style="margin-left: 20px;font-size: 14px;font-weight: 500">{{ path }}</span>
						</div>
					</div>

					<div v-if="listMode === 'list'" class="table">
						<!--列表-->
						<el-table
							:data="tableData"
							:max-height="clientHeight - 190"
							key="tableData"
							row-key="id"
							@row-dblclick="rowDblclick"
							border
							highlight-current-row
							stripe
						>
							<el-table-column label="文件名" show-overflow-tooltip align="center">
								<template slot-scope="scope">
									<div style="text-align: left">
										<img :src="scope.row.src" height="26" width="26" style="float: left" />
										<span style="margin-left: 10px">{{ scope.row.name }}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								prop="capacity"
								label="大小"
								align="center"
								:formatter="sizeFormatter"
								show-overflow-tooltip
							></el-table-column>
							<el-table-column
								prop="updateTime"
								label="修改时间"
								align="center"
								show-overflow-tooltip
							></el-table-column>
							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<el-dropdown
										placement="bottom-start"
										@command="handleFileCommand($event, scope.row)"
									>
										<span class="el-dropdown-link">
											<i class="el-icon-more"></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item
												icon="el-icon-share"
												command="share"
												v-if="scope.row.userId == userId"
												>分享</el-dropdown-item
											>
											<el-dropdown-item
												v-if="
													!(
														scope.row.type == 1 ||
														scope.row.type == 9 ||
														scope.row.type == 13
													)
												"
												icon="el-icon-download"
												command="download"
												>下载</el-dropdown-item
											>
											<el-dropdown-item
												icon="el-icon-delete"
												command="delete"
												v-if="scope.row.userId == userId"
												>删除</el-dropdown-item
											>
											<el-dropdown-item icon="el-icon-document" command="rename"
												>重命名</el-dropdown-item
											>
										</el-dropdown-menu>
									</el-dropdown>
								</template>
							</el-table-column>
						</el-table>
					</div>

					<!--缩列图-->
					<div v-else style="width: 100%;">
						<div v-if="tableData.length" style="display:flex;justify-content:flex-start;flex-wrap:wrap;">
							<div
								class="file-card"
								v-for="(item, index) in tableData"
								:key="index"
								@dblclick="clickFile(item)"
							>
								<el-dropdown
									placement="bottom-start"
									@command="handleFileCommand($event, item)"
									style="position:relative;left:112px;"
								>
									<span class="el-dropdown-link">
										<i class="el-icon-more"></i>
									</span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item
											icon="el-icon-share"
											command="share"
											v-if="item.userId == userId"
											>分享</el-dropdown-item
										>
										<el-dropdown-item
											icon="el-icon-download"
											command="download"
											v-if="!(item.type == 1 || item.type == 9 || item.type == 13)"
											>下载</el-dropdown-item
										>
										<el-dropdown-item
											icon="el-icon-delete"
											command="delete"
											v-if="item.userId == userId"
											>删除</el-dropdown-item
										>
										<el-dropdown-item icon="el-icon-document" command="rename"
											>重命名</el-dropdown-item
										>
									</el-dropdown-menu>
								</el-dropdown>
								<div class="file-card-content">
									<div>
										<el-image
											class="file-card-icon"
											:preview-src-list="[item.link]"
											:src="
												item.link +
													'?x-oss-process=image/resize,w_148,h_148/auto-orient,1/quality,q_90/format,jpg'
											"
											v-if="item.type === 2"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/txt.svg"
											v-else-if="item.type === 8"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/excel.svg"
											v-else-if="item.type === 4"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/word.svg"
											v-else-if="item.type === 3"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/pdf.svg"
											v-else-if="item.type === 6"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/ppt.svg"
											v-else-if="item.type === 5"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/video.svg"
											v-else-if="item.type === 10"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/zip.svg"
											v-else-if="item.type === 7"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/share.svg"
											v-else-if="item.type === 1 && item.toUserIds"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/folder.svg"
											v-else-if="item.type === 1 && !item.toUserIds"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/document.svg"
											v-else-if="item.type === 9"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/music.svg"
											v-else-if="item.type === 11"
										/>
										<img
											class="file-card-icon"
											src="@/assets/fileType/md.svg"
											v-else-if="item.type === 13"
										/>
										<img class="file-card-icon" src="@/assets/fileType/other.svg" v-else />
									</div>
									<el-tooltip :content="item.name">
										<div class="file-name">{{ item.name }}</div>
									</el-tooltip>
								</div>
							</div>
						</div>
						<div v-else style="margin-top: 100px; text-align: center">
							<img src="@/assets/empty.png" />
						</div>
					</div>
				</div>
				<!--回收站-->
				<div v-else-if="menuIndex === 7">
					<div class="table">
						<!--列表-->
						<el-table
							:data="recycleTableData"
							:max-height="clientHeight - 190"
							key="recycleTableData"
							row-key="id"
							border
							highlight-current-row
							stripe
						>
							<el-table-column label="文件名" show-overflow-tooltip align="center">
								<template slot-scope="scope">
									<div style="text-align: left">
										<img :src="scope.row.src" height="26" width="26" style="float: left" />
										<span style="margin-left: 10px">{{ scope.row.name }}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								prop="capacity"
								label="大小"
								align="center"
								:formatter="sizeFormatter"
								show-overflow-tooltip
							></el-table-column>
							<el-table-column
								prop="createTime"
								label="删除时间"
								align="center"
								show-overflow-tooltip
							></el-table-column>
							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<el-button type="text" size="small" @click="revertFile(scope.row)">还原</el-button>
									<el-divider direction="vertical"></el-divider>
									<el-button type="text" size="small" @click="delRecycleFile(scope.row)"
										>删除</el-button
									>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
				<!--他人分享-->
				<div v-if="menuIndex === 8">
					<div>
						<el-form :inline="true" v-if="parentId != 0">
							<el-form-item>
								<el-button size="medium" type="primary" icon="el-icon-upload2" @click="upload"
									>上传</el-button
								>
							</el-form-item>
							<el-form-item>
								<el-dropdown @command="handleCommand">
									<el-button type="primary" plain size="medium" class="el-icon-folder-add">
										新 建
									</el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="folder">新建文件夹</el-dropdown-item>
										<el-dropdown-item command="richText">新建在线文档(富文本)</el-dropdown-item>
										<el-dropdown-item command="markdown">新建在线文档(markdown)</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-form-item>
							<div style="float: right; display: flex;">
								<el-input
									v-model="searchContent.name"
									size="medium"
									clearable
									placeholder="请输入文件名称"
									style="width:200px;"
								></el-input>
								<el-button
									style="margin-left:15px"
									type="primary"
									icon="el-icon-search"
									size="medium"
									@click="search"
									>查询</el-button
								>
								<i
									:class="listMode === 'list' ? 'el-icon-menu' : 'el-icon-s-operation'"
									style="margin-left:15px;line-height:32px;font-size:24px;cursor:pointer;color:#afb3bf;"
									@click="changeListMode"
								></i>
							</div>
						</el-form>
						<div v-if="parentId != 0">
							<el-button type="text" @click="backToPrevious">返回上一级</el-button>
							<span style="margin-left: 20px;font-size: 14px;font-weight: 500">{{ path }}</span>
						</div>
					</div>

					<div v-if="listMode === 'list'" class="table">
						<!--列表-->
						<el-table
							:data="shareTableData"
							:max-height="clientHeight - 190"
							key="shareTableData"
							row-key="id"
							@row-dblclick="rowDblclick"
							border
							highlight-current-row
							stripe
						>
							<el-table-column label="文件名" show-overflow-tooltip align="center">
								<template slot-scope="scope">
									<div style="text-align: left">
										<img :src="scope.row.src" height="26" width="26" style="float: left" />
										<span style="margin-left: 10px">{{ scope.row.name }}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								prop="capacity"
								label="大小"
								align="center"
								:formatter="sizeFormatter"
								show-overflow-tooltip
							></el-table-column>
							<el-table-column
								prop="shareUserName"
								label="分享人"
								align="center"
								show-overflow-tooltip
							></el-table-column>
							<el-table-column
								prop="shareTime"
								label="分享时间"
								align="center"
								show-overflow-tooltip
							></el-table-column>
							<el-table-column label="操作" align="center">
								<template slot-scope="scope" v-if="scope.row.type !== 1">
									<el-dropdown
										placement="bottom-start"
										@command="handleFileCommand($event, scope.row)"
									>
										<span class="el-dropdown-link">
											<i class="el-icon-more"></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item
												icon="el-icon-download"
												command="download"
												v-if="
													!(
														scope.row.type == 1 ||
														scope.row.type == 9 ||
														scope.row.type == 13
													)
												"
												>下载</el-dropdown-item
											>
										</el-dropdown-menu>
									</el-dropdown>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</el-main>
		</el-container>

		<!--新增文件夹界面-->
		<el-dialog title="新增文件夹" width="550px" :visible.sync="addFolderVisible" :close-on-click-modal="false">
			<el-form :model="addForm" :rules="folderFormRules" ref="addFolderForm">
				<el-form-item prop="name">
					<el-input v-model.trim="addForm.name" placeholder="请输入文件夹名称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFolderVisible = false">取消</el-button>
				<el-button type="primary" @click="addFolderSubmit">提交</el-button>
			</div>
		</el-dialog>

		<!--重命名-->
		<el-dialog title="重命名" width="550px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" :rules="folderFormRules" ref="editForm">
				<el-form-item prop="name">
					<el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editFormSubmit">提交</el-button>
			</div>
		</el-dialog>

		<!--分享界面-->
		<el-dialog title="分享" width="750px" :visible.sync="shareVisible" :close-on-click-modal="false">
			<div style="text-align:center">
				<el-transfer
					style="text-align:left;display:inline-block"
					:titles="['未选列表', '已选列表']"
					filterable
					:props="{
						key: 'userId',
						label: 'userName'
					}"
					filter-placeholder="请输入用户名"
					v-model="userSelection"
					:data="userList"
				>
				</el-transfer>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="shareVisible = false">取消</el-button>
				<el-button type="primary" @click="commitShare">提交</el-button>
			</div>
		</el-dialog>
		<global-uploader></global-uploader>
	</div>
</template>

<script>
import { setImageUrl } from '@/views/disk/utils'
import Bus from '@/views/components/upload/js/bus'
import globalUploader from '@/views/components/upload/global-uploader'
export default {
	components: {
		globalUploader
	},
	data() {
		return {
			userId: localStorage.getItem('userId'),
			menuIndex: 1,
			recycleTableData: [],
			shareTableData: [],
			fileType: 'all',
			listMode: 'list',
			action: this.$axios.defaults.baseURL + 'jellyDisk/uploadFile',
			headers: {
				Authorization: window.localStorage.getItem('Authorization')
			},
			currentRow: {},
			shareVisible: false,
			userList: [],
			userSelection: [],
			parentId: 0,
			path: '',
			addFolderVisible: false,
			addForm: {
				name: ''
			},
			editFormVisible: false,
			editForm: {},
			folderFormRules: {
				name: [
					{ required: true, message: '请输入名称', trigger: 'blur' },
					{ max: 30, message: '请输入30个以内字符', trigger: 'blur' }
				]
			},
			uploadParams: {
				parentId: 0,
				name: null,
				type: null,
				capacity: null
			},
			clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
			tableData: [],
			searchContent: {
				name: ''
			},
			shareUserName: '',
			shareTime: '',
			shareUserId: null
		}
	},
	created() {
		this.queryUserList()
		this.queryByType(this.fileType)
	},
	mounted() {
		// 文件选择后的回调
		Bus.$on('fileAdded', file => {
			this.uploadParams.parentId = this.parentId
			this.uploadParams.type = this.transferFileType(file)
			this.uploadParams.capacity = file.size
			this.uploadParams.name = file.name
			this.uploadParams.userId = Number(localStorage.getItem('userId'))
			this.uploadParams.companyId = Number(localStorage.getItem('companyId'))
			this.uploadParams.path = this.path + '/'

			let params = JSON.parse(JSON.stringify(this.uploadParams))
			this.$set(file, 'params', params)
			this.$axios.get('jellyDisk/isExist', { params }).then(res => {
				if (res.data.code === 200) {
					if (res.data.data) {
						file.removeFile(file)
						this.$message.error(file.name + '已存在')
					} else {
						if (file.name && file.name.length > 255) {
							file.removeFile(file)
							this.$message.error('文件名不能超过255个字符')
						} else {
							// this.$set(file, 'params', params)
						}
					}
				} else {
					this.$message.error(res.data.message)
				}
			})
		})
		// 文件上传成功的回调
		Bus.$on('fileSuccess', res => {
			if (+res.code === 200) {
				this.$message.success('上传成功！')
				this.queryByType(this.fileType)
			} else {
				this.$message.error(res.message)
			}
		})
	},
	methods: {
		upload() {
			// 设置上传接口地址
			Bus.$emit('setTarget', this.$axios.defaults.baseURL + 'jellyDisk/uploadChunk')

			// 设置合并分片接口地址
			Bus.$emit('setMergeApi', '/jellyDisk/mergeChunks')

			// 打开文件选择框
			Bus.$emit('openUploader', {})
		},
		// 查询回收站数据
		queryRecycle() {
			this.$axios.get('jellyDiskRecycle/queryByUserId').then(res => {
				if (res.data.code === 200) {
					this.recycleTableData = res.data.data
					setImageUrl(this.recycleTableData)
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		// 查询他人分享数据
		queryShare() {
			this.$axios.get('jellyDiskShare/queryByUserId').then(res => {
				if (res.data.code === 200) {
					this.shareTableData = res.data.data
					setImageUrl(this.shareTableData)
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		// 还原文件
		revertFile(row) {
			this.$axios.get('jellyDiskRecycle/revert/' + row.id).then(res => {
				if (res.data.code === 200) {
					this.$message.success('还原成功！')
					this.queryRecycle()
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		// 回收站删除
		delRecycleFile(row) {
			this.$axios.get('jellyDiskRecycle/delete/' + row.id).then(res => {
				if (res.data.code === 200) {
					this.$message.success('删除成功！')
					this.queryRecycle()
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		handleFileCommand(command, row) {
			if (command === 'share') {
				this.openShareVisible(row)
			} else if (command === 'delete') {
				this.delFile(row)
			} else if (command === 'download') {
                this.getBlob(row.link, (blob) => {
                    this.saveAs(blob, row.name)
                })
				// let url = row.link + '?t=' + Math.random()
				// let x = new XMLHttpRequest()
				// x.open('get', url, true)
				// x.responseType = 'blob'
				// x.onload = function(e) {
				// 	let getUrl = window.URL.createObjectURL(x.response)
				// 	let a = document.createElement('a')
				// 	a.href = getUrl
				// 	a.download = name
				// 	a.click()
				// }
				// x.send()
				// window.location.href = row.link
			} else if (command === 'rename') {
				this.editForm = Object.assign({}, row)
				this.editFormVisible = true
				if (this.$refs.editFormVisible) {
					this.$refs.editFormVisible.resetFields()
				}
			}
		},
        getBlob(url, cb) {
            let xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr.responseType = 'blob'
            xhr.onload = function () {
                if (xhr.status === 200) {
                    cb(xhr.response)
                }
            }
            xhr.send()
        },
        saveAs(blob, filename) {
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename)
            } else {
                let link = document.createElement('a')
                let body = document.querySelector('body')

                link.href = window.URL.createObjectURL(blob)
                link.download = filename

                link.style.display = 'none'
                body.appendChild(link)

                link.click()
                body.removeChild(link)
                window.URL.revokeObjectURL(link.href)
            }
        },
		search() {
			this.queryByType(this.fileType)
		},
		// 菜单栏点击事件
		selectMenu(index) {
			index = +index
			this.menuIndex = index
			this.parentId = 0
			this.path = ''
			if (index < 7) {
				if (index === 1) {
					this.fileType = 'all'
				} else if (index === 2) {
					this.fileType = 'image'
				} else if (index === 3) {
					this.fileType = 'document'
				} else if (index === 4) {
					this.fileType = 'video'
				} else if (index === 5) {
					this.fileType = 'music'
				} else {
					this.fileType = 'other'
				}
				this.queryByType(this.fileType)
			} else if (index === 7) {
				this.queryRecycle()
			} else if (index === 8) {
				this.queryShare()
			}
		},
		// 列表缩列图切换
		changeListMode() {
			this.listMode = this.listMode === 'list' ? 'thumbnail' : 'list'
		},
		handleCommand(command) {
			if (command === 'folder') {
				this.addFolderVisible = true
				if (this.$refs.addFolderForm) {
					this.$refs.addFolderForm.resetFields()
				}
			} else if (command === 'richText') {
				this.$router.push({
					path: '/editor',
					query: {
						parentId: this.parentId
					}
				})
			} else if (command === 'markdown') {
				this.$router.push({
					path: '/markdown',
					query: {
						parentId: this.parentId
					}
				})
			}
		},
		// 提交分享
		commitShare() {
			let params = {
				id: this.currentRow.id,
				toUserIds: this.userSelection.join(','),
				companyId: this.companyId
			}
			this.$axios.post('jellyDisk/share', params).then(res => {
				if (res.data.code === 200) {
					this.$message.success('分享成功！')
					this.shareVisible = false
					this.queryByType(this.fileType)
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		// 查询用户
		async queryUserList() {
			let userList = []
			let res = await this.$axios.get('user/queryList')
			if (res.data.code === 200) {
				for (let i = 0; i < res.data.data.length; i++) {
					userList.push({
						userId: String(res.data.data[i].userId),
						userName: res.data.data[i].userName
					})
				}
			}
			this.userList = userList
		},
		// 打开分享弹窗
		openShareVisible(row) {
			if (row.toUserIds) {
				this.userSelection = row.toUserIds.split(',')
			} else {
				this.userSelection = []
			}
			this.currentRow = row
			this.shareVisible = true
		},
		// 删除文件
		delFile(row) {
			this.$axios.get('jellyDisk/moveToRecycle/' + row.id).then(res => {
				if (res.data.code === 200) {
					this.$message.success('删除成功！')
					this.queryByType(this.fileType)
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		// 返回上一级
		backToPrevious() {
			let params = {
				menuIndex: this.menuIndex
			}
			if (this.menuIndex === 8) {
				params.shareUserId = this.shareUserId
			}
			this.$axios.get('jellyDisk/backToPrevious/' + this.parentId, { params }).then(res => {
				if (res.data.code === 200) {
					if (this.menuIndex === 8) {
						this.shareTableData = res.data.data
						setImageUrl(this.shareTableData)
						if (!this.shareTableData[0].shareUserName) {
							this.shareTableData.forEach(item => {
								item.shareUserName = this.shareUserName
								item.shareTime = this.shareTime
							})
							this.parentId = this.shareTableData[0].parentId
							this.path = this.shareTableData[0].path.substr(0, this.shareTableData[0].path.length - 1)
						} else {
							this.parentId = 0
							this.path = ''
						}
					} else {
						this.tableData = res.data.data
						setImageUrl(this.tableData)
						this.parentId = this.tableData[0].parentId
						this.path = this.tableData[0].path.substr(0, this.tableData[0].path.length - 1)
					}
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		// 点击文件
		clickFile(row) {
			let type = row.type
			if (type === 1) {
				if (this.menuIndex === 8) {
					if (row.diskId) {
						this.parentId = row.diskId
						this.shareUserId = row.shareUserId
						this.shareUserName = row.shareUserName
						this.shareTime = row.shareTime
					} else {
						this.parentId = row.id
					}
				} else {
					this.parentId = row.id
				}
				this.path = row.path + row.name
				this.queryByType(this.fileType)
			} else if (type === 2) {
				//this.$openPreview([row.link])
				window.location.href = row.link
			} else if (type === 9) {
				let query = {
					id: row.id
				}
				this.$router.push({ path: '/editor', query: query })
			} else if (type === 3 || type === 4 || type === 5 || type === 6 || type === 8) {
				window.open(
					this.$axios.defaults.baseURL +
						'upload/preview?url=' +
						encodeURIComponent(row.link) +
						'&fileName=' +
						encodeURIComponent(row.name)
				)
			} else if (type === 13) {
				let query = {
					id: row.id
				}
				this.$router.push({ path: '/markdown', query: query })
			}
		},
		rowDblclick(row, column, event) {
			this.clickFile(row)
		},
		// 根据文件类型查询
		queryByType(type) {
			let params = {
				parentId: this.parentId,
				type: type,
				name: this.searchContent.name
			}
			if (this.menuIndex === 8) {
				params.shareUserId = this.shareUserId
			}
			this.$axios.get('jellyDisk/queryFileByUserId', { params }).then(res => {
				if (res.data.code === 200) {
					if (this.menuIndex === 8) {
						this.shareTableData = res.data.data
						this.shareTableData.forEach(item => {
							item.shareUserName = this.shareUserName
							item.shareTime = this.shareTime
						})
						setImageUrl(this.shareTableData)
					} else {
						this.tableData = res.data.data
						setImageUrl(this.tableData)
					}
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		// 提交新增文件
		addFolderSubmit() {
			let that = this
			this.$refs.addFolderForm.validate(valid => {
				if (valid) {
					let params = {
						parentId: that.parentId,
						name: that.addForm.name,
						type: 1
					}
					that.$axios.post('jellyDisk/insert', params).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.queryByType(this.fileType)
						} else {
							that.$message.error(res.data.message)
						}
						that.addFolderVisible = false
					})
				}
			})
		},
		// 上传成功
		onSuccess(res, file, fileList) {
			if (+res.code === 200) {
				this.$message.success('上传成功！')
				this.queryByType(this.fileType)
			} else {
				this.$message.error(res.message)
			}
		},
		// 上传前
		beforeUpload(file) {
			this.uploadParams.parentId = this.parentId
			this.uploadParams.type = this.transferFileType(file)
			this.uploadParams.capacity = file.size
			this.uploadParams.name = file.name
			const isLtSize = file.size / 1024 / 1024 < 100

			if (!isLtSize) {
				this.$message.error('上传文件大小不能超过 100MB!')
			}
			return isLtSize
		},
		// 文件类型转换
		transferFileType(file) {
			if (file.fileType === 'image/jpg' || file.fileType === 'image/jpeg' || file.fileType === 'image/png') {
				return 2 // 图片
			}
			let fileName = file.name
			let pos = fileName.lastIndexOf('.')
			let lastName = fileName.substring(pos, fileName.length)
			let suffix = lastName.toLowerCase()
			if (suffix === '.doc' || suffix === '.docx') {
				return 3 // word
			}
			if (suffix === '.xls' || suffix === '.xlsx') {
				return 4 // excel
			}
			if (suffix === '.ppt' || suffix === '.pptx') {
				return 5 // ppt
			}
			if (suffix === '.pdf') {
				return 6 // pdf
			}
			if (suffix === '.zip' || suffix === '.rar') {
				return 7 // 压缩文件
			}
			if (suffix === '.txt') {
				return 8 // txt
			}
			const videoList = ['.mp4', '.m2v', '.mkv', '.rmvb', '.wmv', '.avi', '.flv', '.mov', '.m4v']
			let isVideo = videoList.find(item => item === suffix)
			if (isVideo) {
				return 10 // 视频
			}
			const musicList = ['.mp3', '.wma', '.rm', '.wav', '.midi', '.ape', '.flac']
			let isMusic = musicList.find(item => item === suffix)
			if (isMusic) {
				return 11 // 视频
			}
			return 12 // 其他
		},
		// 大小格式化
		sizeFormatter(row) {
			if (!row.capacity) {
				return '-'
			}
			var unitArr = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
			var index = 0
			var srcsize = parseFloat(row.capacity)
			index = Math.floor(Math.log(srcsize) / Math.log(1024))
			var size = srcsize / Math.pow(1024, index)
			if (index != 0) {
				size = size.toFixed(2) //保留的小数位数
			}
			return size + unitArr[index]
		},
		editFormSubmit() {
			let that = this
			this.$refs.editForm.validate(valid => {
				if (valid) {
					that.$axios.post('jellyDisk/update', that.editForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('修改成功')
							that.editFormVisible = false
							that.queryByType(that.fileType)
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		}
	}
}
</script>

<style scoped>
::v-deep .el-main {
	padding: 5px 20px;
}
::v-deep .el-menu-item {
	height: 48px;
	line-height: 48px;
}
::v-deep .el-menu-item.is-active {
	border-radius: 12px;
}
::v-deep .el-menu-item:hover {
	border-radius: 12px;
}
::v-deep .el-menu {
	padding-right: 15px;
	height: 100%;
}
::v-deep .table {
	padding: 0px;
}
.file-card {
	width: 136px;
	height: 136px;
	border: 1px solid #dbdfea;
	border-radius: 8px;
	margin-right: 20px;
	margin-bottom: 20px;
}
.file-card-content {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.file-name {
	width: 120px;
	text-align: center;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	font-size: 13px;
}
.file-card-icon {
	width: 84px;
	height: 84px;
	border-radius: 6px;
}
</style>
