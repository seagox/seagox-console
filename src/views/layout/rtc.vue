<template>
	<div class="container" :style="{ width: clientWidth + 'px', height: clientHeight + 'px' }">
		<div
			v-if="!isPhone"
			:style="{ width: clientWidth + 'px', 'max-height': clientHeight - 175 + 'px', overflow: 'auto' }"
		>
			<grid-layout
				:layout.sync="streamList"
				:col-num="3"
				:row-height="clientWidth / 4"
				:is-draggable="true"
				:is-resizable="false"
				:is-mirrored="false"
				:responsive="false"
				:vertical-compact="true"
				:margin="[0, 0]"
				:use-css-transforms="true"
			>
				<grid-item
					v-for="(item, index) in streamList"
					:x="item.x"
					:y="item.y"
					:w="item.w"
					:h="item.h"
					:i="item.i"
					:key="index"
					:style="{ width: clientWidth / 3 + 'px' }"
				>
					<div v-html="item.stream" style="width: 100%; height: 100%" v-show="item.cameraFlag"></div>
					<div
						v-show="!item.cameraFlag"
						style="
                        width: 100%;
                        height: 100%;
                        background: #ddd;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid #aaa;
                    "
					>
						<i class="el-icon-video-camera" style="font-size: 100px; color: #aaa" />
					</div>
					<div class="alias" :id="item.alias">{{ item.alias }}</div>
				</grid-item>
			</grid-layout>
		</div>
		<div class="content" v-else :style="{ 'max-height': clientHeight - 175 + 'px', overflow: 'auto' }">
			<div
				:style="{ width: clientWidth / 2 + 'px', height: clientWidth / 2 + 'px', position: 'relative' }"
				v-for="(item, i) in streamList"
				:key="i"
			>
				<div v-html="item.stream" style="width: 100%; height: 100%" v-show="item.cameraFlag"></div>
				<div
					v-show="!item.cameraFlag"
					style="
                        width: 100%;
                        height: 100%;
                        background: #ddd;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid #aaa;
                    "
				>
					<i class="el-icon-video-camera" style="font-size: 100px; color: #aaa" />
				</div>
				<div class="alias">{{ item.alias }}</div>
				<i class="el-icon-camera" v-if="isPhone && item.userId === userId" @click="switchDevice"></i>
			</div>
		</div>
		<div :style="{ width: clientWidth + 'px', display: 'flex', 'justify-content': 'center' }" v-if="!isPhone">
			<div class="footer" v-if="cameraList.length != 0">
				<div class="feature" @click="handleCamera">
					<i class="el-icon-video-camera" v-if="cameraFlag"></i>
					<i class="el-icon-picture-outline-round" v-else></i>
					<span>摄像头</span>
				</div>
				<div class="feature-leave" @click="leaveRoom">
					<i class="el-icon-switch-button"></i>
					<span>挂断</span>
				</div>
				<div class="feature" @click="handlePhone">
					<i class="el-icon-microphone" v-if="phoneFlag"></i>
					<i class="el-icon-turn-off-microphone" v-else></i>
					<span>麦克风</span>
				</div>
			</div>
		</div>
		<div :style="{ width: clientWidth + 'px', display: 'flex', 'justify-content': 'center' }" v-else>
			<div class="footer-phone" v-if="cameraList.length != 0">
				<div class="feature" @click="handleCamera">
					<i class="el-icon-video-camera" v-if="cameraFlag"></i>
					<i class="el-icon-picture-outline-round" v-else></i>
					<span>摄像头</span>
				</div>
				<div class="feature-leave" @click="leaveRoom">
					<i class="el-icon-switch-button"></i>
					<span>挂断</span>
				</div>
				<div class="feature" @click="handlePhone">
					<i class="el-icon-microphone" v-if="phoneFlag"></i>
					<i class="el-icon-turn-off-microphone" v-else></i>
					<span>麦克风</span>
				</div>
			</div>
		</div>
		<!--加入会议-->
		<el-dialog
			title="加入会议"
			:width="width"
			:visible.sync="aliasFormVisible"
			:close-on-click-modal="false"
			:show-close="false"
		>
			<el-form :model="aliasForm" :rules="formRules" ref="aliasForm">
				<el-form-item label="昵称" prop="alias">
					<el-input v-model.trim="aliasForm.alias" clearable placeholder="请输入昵称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="aliasSubmit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import TRTC from 'trtc-js-sdk'
import VueGridLayout from 'vue-grid-layout'
export default {
	components: {
		GridLayout: VueGridLayout.GridLayout,
		GridItem: VueGridLayout.GridItem
	},
	data() {
		return {
			isPhone: false,
			clientWidth: 0,
			clientHeight: 0,
			userId:
				Math.random()
					.toString(36)
					.slice(-6) + '-test', //用户id --可更改
			roomId: 8888, //房间号--加入相同房间才能聊
			client: '', //客户端服务
			streamList: [], //远方视频流
			localStream: null, //本地流
			sdkAppId: 1400689406, //sdkID
			userSig: '', //签名,
			phoneFlag: true,
			cameraFlag: true,
			aliasFormVisible: false,
			aliasForm: {
				alias: ''
			},
			formRules: {
				alias: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
			},
			width: '80%',
			cameraList: [],
			cameraType: 'user'
		}
	},
	beforeMount() {
		this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth
		this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
	},
	created() {
		this.roomId = parseInt(this.$route.query.roomId) || 8888
		this.judgePhone()
		this.getCameras()
	},
	methods: {
		async getCameras() {
			let cameraList = await TRTC.getCameras()
			if (cameraList.length === 0 && !this.isPhone) {
				this.$message.error('未检测到摄像头')
			} else {
				this.cameraList = cameraList
				if (this.$route.query.alias) {
					this.userId = this.userId.replace('-test', '-' + this.$route.query.alias)
					this.alias = this.$route.query.alias
					this.getUserSig()
				} else {
					this.aliasFormVisible = true
				}
			}
		},
		aliasSubmit() {
			this.$refs.aliasForm.validate(valid => {
				if (valid) {
					this.userId = this.userId.replace('-test', '-' + this.aliasForm.alias)
					this.aliasFormVisible = false
					this.getUserSig()
				}
			})
		},
		judgePhone() {
			//获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
			var info = navigator.userAgent
			//通过正则表达式的test方法判断是否包含“Mobile”字符串
			this.isPhone = /mobile/i.test(info)
			if (this.isPhone) {
				this.width = '90%'
			} else {
				this.width = '550px'
			}
		},
		// 获取用户签名
		async getUserSig() {
			let res = await this.$axios.get('cloud/entrance/getUserSig?userId=' + this.userId)
			if (res.data.code == 200) {
				this.userSig = res.data.data
				this.createClient()
			}
		},
		//创建链接
		createClient() {
			this.client = TRTC.createClient({
				mode: 'rtc',
				sdkAppId: this.sdkAppId,
				userId: this.userId,
				userSig: this.userSig
			})
			//注册远程监听，要放在加入房间前--这里用了发布订阅模式
			this.subscribeStream()
			//初始化后才能加入房间
			this.joinRoom()
			// 公共监听方法----主要是推流方摄像头关闭，音频关闭开启等；下方有说！！
			this.publicMonitor()
		},
		//加入房间
		async joinRoom() {
			let that = this
			await this.client
				.join({ roomId: that.roomId })
				.catch(error => {
					console.error('进房失败 ' + error)
				})
				.then(() => {
					console.log('进房成功')
					//创建本地流
					this.createStream()
					//播放远端流
					this.playStream()
				})
		},
		//创建本地音视频流
		createStream() {
			const localStream = TRTC.createStream({ userId: this.userId, audio: true, video: true })
			this.localStream = localStream
			localStream
				.initialize()
				.catch(error => {
					console.error('初始化本地流失败 ' + error)
				})
				.then(() => {
					console.log('初始化本地流成功')
					// 创建远端流标签，因为id是动态的，所以动态创建，用了v-html
					const stream = `<div id="${'local_stream-' +
						localStream.getId()}"  style="width:100%;height:100%"></div>`

					this.streamList.push({
						userId: localStream.getUserId(),
						stream: stream,
						alias: localStream.getUserId().split('-')[1],
						cameraFlag: true,
						i: this.streamList.length,
						x: 0,
						y: 0,
						w: 1,
						h: 1
					})

					//做了dom操作 需要使用$nextTick(),否则找不到创建的标签无法进行播放
					this.$nextTick(() => {
						// 480p 720p 1080p 1440p 4K
						localStream.setVideoProfile('720p')
						//播放
						localStream.play('local_stream-' + localStream.getId())
					})
					//创建好后才能发布
					this.publishStream(localStream, this.client)
				})
		},
		//发布本地音视频流
		publishStream() {
			this.client
				.publish(this.localStream)
				.catch(error => {
					console.error('本地流发布失败 ' + error)
				})
				.then(() => {
					console.log('本地流发布成功')
				})
		},
		//订阅远端流--加入房间之前
		subscribeStream() {
			this.client.on('stream-added', event => {
				const remoteStream = event.stream
				//订阅远端流
				this.client.subscribe(remoteStream)
			})
		},
		//播放远端流
		playStream() {
			this.client.on('stream-subscribed', event => {
				const remoteStream = event.stream
				console.log('远端流订阅成功：' + remoteStream.getId())
				// 创建远端流标签，因为id是动态的，所以动态创建，用了v-html
				const stream = `<div id="${'remote_stream-' +
					remoteStream.getId()}"  style="width:100%;height:100%"></div>`

				this.streamList.push({
					userId: remoteStream.getUserId(),
					stream: stream,
					alias: remoteStream.getUserId().split('-')[1],
					cameraFlag: true,
					i: this.streamList.length,
					x: this.streamList.length % 3,
					y: parseInt(this.streamList.length / 3),
					w: 1,
					h: 1
				})
				//做了dom操作 需要使用$nextTick(),否则找不到创建的标签无法进行播放
				this.$nextTick(() => {
					//播放
					remoteStream.play('remote_stream-' + remoteStream.getId())
				})
			})
		},
		//退出音视频
		leaveRoom() {
			this.client
				.leave()
				.then(() => {
					// 停止本地流，关闭本地流内部的音视频播放器
					this.localStream.stop()
					// 关闭本地流，释放摄像头和麦克风访问权限
					this.localStream.close()
					this.streamList = null
					this.client = null
					// 退房成功，可再次调用client.join重新进房开启新的通话。
					window.opener = null
					window.open('about:blank', '_top').close()
				})
				.catch(error => {
					console.error('退房失败 ' + error)
					// 错误不可恢复，需要刷新页面。
				})
		},
		//主要检测推流方公共方法内
		publicMonitor() {
			// 新增人员
			this.client.on('peer-join', evt => {
				console.log('加入加入', evt)
			})
			// 删减人员
			this.client.on('peer-leave', evt => {
				//console.log(evt)
				this.streamList.map((item, index) => {
					if (item.userId === evt.userId) {
						this.streamList.splice(index, 1)
					}
				})
			})
			// 推流方关闭音频
			this.client.on('mute-audio', evt => {
				//console.log(evt)
			})
			// 推流方开启音频
			this.client.on('unmute-audio', evt => {
				//console.log(evt)
			})
			// 推流方关闭摄像头
			this.client.on('mute-video', evt => {
				console.log(evt)
				this.streamList.forEach(key => {
					if (key.userId == evt.userId) {
						key.cameraFlag = false
					}
				})
			})
			// 推流方开启摄像头
			this.client.on('unmute-video', evt => {
				//console.log(evt)
				this.streamList.forEach(key => {
					if (key.userId == evt.userId) {
						key.cameraFlag = true
					}
				})
			})
		},
		handlePhone() {
			if (this.phoneFlag) {
				//关闭本地麦克风
				this.phoneFlag = false
				this.localStream.muteAudio()
			} else {
				//开启本地麦克风
				this.phoneFlag = true
				this.localStream.unmuteAudio()
			}
		},
		async handleCamera() {
			if (this.cameraFlag) {
				//关闭本地摄像头
				this.cameraFlag = false
				//this.localStream.muteVideo()
				const videoTrack = this.localStream.getVideoTrack()
				if (videoTrack) {
					await this.localStream.removeTrack(videoTrack)
					// 停止采集，关闭摄像头
					videoTrack.stop()
					this.streamList.forEach(key => {
						if (key.userId == this.userId) {
							key.cameraFlag = false
						}
					})
				}
			} else {
				//开启本地摄像头
				this.cameraFlag = true
				//this.localStream.unmuteVideo()
				const videoStream = TRTC.createStream({ userId: this.userId, audio: false, video: true })
				await videoStream.initialize()
				await this.localStream.addTrack(videoStream.getVideoTrack())
				this.streamList.forEach(key => {
					if (key.userId == this.userId) {
						key.cameraFlag = true
					}
				})
			}
		},
		switchDevice() {
			if (this.cameraType === 'user') {
				// 前置摄像头
				this.cameraType = 'environment'
				this.localStream.switchDevice('video', 'environment')
			} else {
				// 后置摄像头
				this.cameraType = 'user'
				this.localStream.switchDevice('video', 'user')
			}
		}
	}
}
</script>

<style scoped>
.container {
	background-color: #303133;
}
.content {
	display: flex;
	flex-wrap: wrap;
}
.alias {
	position: absolute;
	background-color: #303133;
	color: #fff;
	bottom: 0px;
	padding: 0px 5px;
	font-size: 14px;
}
.el-icon-camera {
	position: absolute;
	right: 3px;
	bottom: 3px;
	color: #fff;
}
.footer {
	position: fixed;
	bottom: 45px;
	width: 450px;
	height: 64px;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
.footer-phone {
	position: fixed;
	bottom: 45px;
	width: 360px;
	height: 64px;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
.feature {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	color: #fff;
}
.feature i {
	font-size: 26px;
	background-color: #606266;
	padding: 15px;
	border-radius: 50%;
	margin-bottom: 10px;
}
.feature span {
	font-size: 14px;
}
.feature-leave {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	color: #fff;
}
.feature-leave i {
	font-size: 26px;
	background-color: #f56c6c;
	padding: 15px;
	border-radius: 50%;
	margin-bottom: 10px;
}
.feature-leave span {
	font-size: 14px;
}
</style>
