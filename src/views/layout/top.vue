<template>
    <div class="header" :class="headerClass">
        <div class="sidebar-logo-container">
            <el-avatar class="sidebar-logo" :src="logo" @error="errorHandler">
                <img src="@/assets/avatar.png" />
            </el-avatar>
            <h1 class="sidebar-title">{{ alias }}</h1>
            <!-- 产品提需求放开收缩功能 -->
            <div class="hamburger-container">
                <div>
                    <i class="el-icon-s-operation" @click="handleCollapse" style="font-size: 20px; color: #fff"></i>
                </div>
            </div>
        </div>
        <!-- <div class="sidebar-logo-container-link" v-else>
            <el-avatar class="sidebar-logo" :src="logo" @error="errorHandler">
                <img src="@/assets/avatar.png" />
            </el-avatar>
        </div> -->
        <div class="navbar">
            <div class="navbar-right">
                <!-- <el-tooltip content="通讯录">
					<i
						class="el-icon-collection"
						style="font-size:24px;cursor:pointer;margin-left:15px;"
						@click="handleAddressBook"
					></i>
				</el-tooltip> -->
                <div v-html="topContent"></div>
                <el-tooltip content="聊天">
                    <i
                        class="el-icon-chat-round"
                        style="font-size: 24px; cursor: pointer; margin-left: 15px"
                        v-if="chatFlag"
                        @click="handleChat"
                    ></i>
                </el-tooltip>
                <el-badge
                    :hidden="messageNumber === 0"
                    :value="messageNumber"
                    :max="99"
                    :style="{
                        'margin-left': '15px',
                        'margin-right': messageNumber === 0 ? '15px' : '30px',
                        cursor: 'pointer'
                    }"
                >
                    <el-tooltip content="通知">
                        <i class="el-icon-bell" style="font-size: 24px; color: #fff" @click="handleMessage"></i>
                    </el-tooltip>
                </el-badge>
                <el-upload
                    class="user-logo"
                    :action="action"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <el-avatar class="user-logo" shape="square" :src="avatar" @error="errorHandler">
                        <img src="@/assets/avatar.png" />
                    </el-avatar>
                </el-upload>
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <span style="margin-left: 6px; color: #fff">{{ name }}</span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-connection" command="meeting" v-if="meetingFlag"
                            >发起会议</el-dropdown-item
                        >
                        <el-dropdown-item icon="el-icon-office-building" command="company" v-if="switchCompany"
                            >切换单位</el-dropdown-item
                        >
                        <el-dropdown-item icon="el-icon-lock" command="password">修改密码</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-discover" command="theme">切换主题</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-switch-button" command="loginout">退出登陆</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!--修改密码界面-->
        <el-dialog title="修改密码" width="520px" :visible.sync="passVisible" :close-on-click-modal="false">
            <el-form :model="passForm" label-width="80px" :rules="passFormRules" ref="passForm">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input
                        type="password"
                        v-model="passForm.oldPassword"
                        clearable
                        placeholder="请输入旧密码"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input
                        type="password"
                        v-model="passForm.newPassword"
                        clearable
                        placeholder="请输入新密码"
                        show-password
                    ></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="morePass">
                    <el-input
                        type="password"
                        v-model="passForm.morePass"
                        clearable
                        placeholder="请输入确认密码"
                        show-password
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="passVisible = false">取消</el-button>
                <el-button type="primary" @click.native="passSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--切换单位-->
        <el-dialog title="切换单位" width="520px" :visible.sync="companyVisible" :close-on-click-modal="false">
            <el-select v-model="companyId" placeholder="请选择单位">
                <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="companyVisible = false">取消</el-button>
                <el-button type="primary" @click.native="changeCompanySubmit">确定</el-button>
            </div>
        </el-dialog>
        <!--切换主题-->
        <el-dialog title="切换主题" width="750px" :visible.sync="themeVisible" :close-on-click-modal="false">
            <!-- <el-color-picker v-model="color" :predefine="predefine"></el-color-picker> -->
            <div class="color-box">
                <div v-for="(item, index) in colorList" :key="index" class="color-item">
                    <img :src="require('@/assets/theme/' + item.type + '.png')" />
                    <div class="color-title">
                        <div class="color-title">
                            <el-radio v-model="color" :label="item.color">{{ item.title }}</el-radio>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="themeVisible = false">取消</el-button>
                <el-button type="primary" @click.native="changeColor">确定</el-button>
            </div>
        </el-dialog>
        <!--发起会议-->
        <el-dialog title="发起会议" width="520px" :visible.sync="meetingVisible" :close-on-click-modal="false">
            <el-select v-model="meetingValues" placeholder="请选择用户" multiple clearable>
                <el-option v-for="item in memberList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="meetingVisible = false">取消</el-button>
                <el-button type="primary" @click.native="meetingSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import md5 from 'md5'
import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'
export default {
    data() {
        var checkAge = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.passForm.newPassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        var checkOld = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码！'))
            } else if (value == this.passForm.oldPassword) {
                callback(new Error('新密码不能与旧密码一样'))
            } else {
                callback()
            }
        }

        return {
            action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            avatar: localStorage.getItem('avatar'),
            passVisible: false,
            passForm: {
                oldPassword: '',
                newPassword: '',
                morePass: ''
            },
            passFormRules: {
                oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    {
                        pattern: window.platform.passwordStrength == null || window.platform.passwordStrength === 'strong' ? /(?=.*[a-z])(?=.*\d)(?=.*[^a-z0-9])[\S]{8,}/i :
                            (window.platform.passwordStrength === 'medium' ? /(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}/i : /[0-9A-Za-z]{6,}/i),
                        message: window.platform.passwordStrength == null || window.platform.passwordStrength === 'strong' ? '密码必须包含字母、数字和特殊字符，且长度至少8位':
                            (window.platform.passwordStrength === 'medium' ? '密码必须包含字母和数字，且长度至少8位' : '密码必须包含字母或数字，且长度至少6位'),
                        trigger: 'blur'
                    },
                    { validator: checkOld, trigger: 'blur' }
                ],
                morePass: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: checkAge, trigger: 'blur' }
                ]
            },
            messageNumber: 0,
            companyVisible: false,
            companyId: Number(localStorage.getItem('companyId')),
            color: localStorage.getItem('color') != 'undefined' ? localStorage.getItem('color') : '#409eff',
            themeVisible: false,
            predefine: ['#1879fe', '#5d0bc7', '#1700c2', '#1cb6b4', '#35a110', '#f5b017', '#ee6c16', '#ef0022'],
            chatFlag: window.platform.chatFlag,
            switchCompany: window.platform.switchCompany,
            meetingFlag: window.platform.meetingFlag,
            memberList: [],
            meetingVisible: false,
            meetingValues: [],
            topContent: window.platform.topContent,
            colorList: [
                {
                    title: '中国红',
                    color: '#DA001C',
                    type: 'red'
                },
                {
                    title: '海涛蓝',
                    color: '#0574d5',
                    type: 'blue'
                },
                {
                    title: '木槿紫',
                    color: '#7115AB',
                    type: 'purple'
                },
                {
                    title: '松柏青',
                    color: '#27C9B9',
                    type: 'cyan'
                },
                {
                    title: '橄榄绿',
                    color: '#26B476',
                    type: 'green'
                },
                {
                    title: '稻草黄',
                    color: '#FFC034',
                    type: 'yellow'
                },
                {
                    title: '赤茶橘',
                    color: '#FB5F14',
                    type: 'orange'
                },
                {
                    title: '孔雀蓝',
                    color: '#152A7E',
                    type: 'deep-blue'
                }
            ],
            headerClass: 'header-red'
        }
    },
    computed: {
        isCollapse() {
            return this.$store.state.isCollapse
        },
        name() {
            return localStorage.getItem('name')
        },
        companyName() {
            return localStorage.getItem('companyName')
        },
        companyList() {
            return JSON.parse(localStorage.getItem('company'))
        },
        logo() {
            return localStorage.getItem('logo')
        },
        alias() {
            return localStorage.getItem('alias')
        }
    },
    created() {
        this.queryUnRead()
        this.queryDynamic()
        this.getheaderClass()
    },
    methods: {
        getheaderClass() {
            let type = 'red'
            let color = localStorage.getItem('color')
            switch (color) {
                case '#DA001C':
                    type = 'red'
                    break
                case '#0574d5':
                    type = 'blue'
                    break
                case '#7115AB':
                    type = 'purple'
                    break
                case '#27C9B9':
                    type = 'cyan'
                    break
                case '#26B476':
                    type = 'green'
                    break
                case '#FFC034':
                    type = 'yellow'
                    break
                case '#FB5F14':
                    type = 'orange'
                    break
                case '#152A7E':
                    type = 'deep-blue'
                    break
            }
            this.headerClass = 'header-' + type
        },
        //部门或成员数据
        async queryDynamic() {
            let res = await this.$axios.get('jellyForm/queryDynamic?path=member&type=list')
            if (res.data.code === 200) {
                this.memberList = res.data.data
            }
        },
        handleCollapse() {
            this.$store.commit('handleCollapse')
        },
        handleCommand(command) {
            if (command == 'loginout') {
                localStorage.clear()
                this.$router.push('/login')
            } else if (command == 'password') {
                this.passVisible = true
                if (this.$refs.passForm) {
                    this.$refs.passForm.resetFields()
                }
            } else if (command == 'company') {
                this.companyVisible = true
            } else if (command == 'theme') {
                this.themeVisible = true
            } else if (command == 'meeting') {
                this.meetingVisible = true
            }
        },
        passSubmit() {
            let that = this
            this.$refs.passForm.validate(valid => {
                if (valid) {
                    that.$axios.post('user/updatePassword', that.passForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('修改成功')
                            that.$router.push('/login')
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        async queryUnRead() {
            let res = await this.$axios.get('message/queryUnRead')
            if (res.data.code === 200) {
                this.messageNumber = res.data.data
            }
        },
        handleMessage() {
            this.$router.push('/message')
        },
        changeCompanySubmit() {
            let that = this
            that.$axios.post('company/change/' + this.companyId, {}).then(res => {
                if (res.data.code == 200) {
                    that.$message.success('切换成功')
                    localStorage.setItem('alias', res.data.data.alias)
                    localStorage.setItem('logo', res.data.data.logo)
                    localStorage.setItem('mark', res.data.data.mark)
                    localStorage.setItem('companyId', res.data.data.companyId)
                    localStorage.setItem('companyName', res.data.data.companyName)
                    localStorage.setItem('Authorization', res.data.data.tokenType + res.data.data.accessToken)
                    if (res.data.data.permissions) {
                        localStorage.setItem('permissions', res.data.data.permissions.split(','))
                    } else {
                        localStorage.setItem('permissions', 'no')
                    }
                    localStorage.setItem('departmentId', res.data.data.departmentId)

                    that.$router.go(0)
                } else {
                    that.$message.error(res.data.message)
                }
            })
        },
        changeColor() {
            let newColor = this.color || '#409eff'
            var options = {
                newColors: [...forElementUI.getElementUISeries(newColor)]
            }
            client.changer.changeColor(options, Promise).then(() => {
                localStorage.setItem('color', newColor)
                this.settingTheme(newColor)
                this.$emit('changeTheme')
                this.getheaderClass()
                if (this.$route.path == 'readme') {
                }
            })
            this.themeVisible = false
        },
        async settingTheme(color) {
            let params = {
                color: color
            }
            let res = await this.$axios.post('sysTheme/setting', params)
        },
        errorHandler() {
            return true
        },
        handleAvatarSuccess(res, file) {
            if (res.code == 200) {
                localStorage.setItem('avatar', res.data)
                this.avatar = res.data
                this.updateAvatar(res.data)
            }
        },
        async updateAvatar(avatar) {
            let params = {
                avatar: avatar
            }
            let res = await this.$axios.post('/user/updateAvatar', params)
            if (res.data.code != 200) {
                this.$message.error('头像更新失败')
            }
        },
        beforeAvatarUpload(file) {
            const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
            // 图片格式
            const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
            let result = imglist.find(item => item === suffix)
            if (!result) {
                this.$message.error('请上传图片类型')
                return false
            }
        },
        handleAddressBook() {},
        handleChat() {
            let key = 'yVwlsbIrY3q22EnoYYM4nR5zqTmqed05'
            let account = localStorage.getItem('userId')
            let org = localStorage.getItem('companyId')
            let timestamp = Date.now()
            let noncestr = Math.random()
                .toString(36)
                .slice(-6)
            let query = 'account=' + account + '&noncestr=' + noncestr + '&org=' + org + '&timestamp=' + timestamp
            let sign = md5(query + '&key=' + key).toUpperCase()
            window.open(window.platform.chatUrl + '?' + query + '&sign=' + sign)
        },
        meetingSubmit() {
            let that = this
            let roomId = Math.floor(Math.random() * 10000 + 1)
            var params = {
                url: window.location.protocol + '//' + window.location.host + '/rtc?roomId=' + roomId,
                memberValues: this.meetingValues.toString()
            }
            that.$axios.post('message/meeting', params).then(res => {
                if (res.data.code == 200) {
                    that.meetingVisible = false
                    that.$message.success('成功发起会议')
                    let routeUrl = that.$router.resolve({
                        path: '/rtc',
                        query: {
                            roomId: roomId,
                            alias: localStorage.getItem('name')
                        }
                    })
                    window.open(routeUrl.href, '_blank')
                } else {
                    that.$message.error(res.data.message)
                }
            })
        }
    }
}
</script>
<style scoped>
.header {
    box-shadow: unset;
    box-sizing: border-box;
    border: 0px solid transparent;
    width: 100%;
    height: 60px;
    font-size: 18px;
    line-height: 60px;
    background-size: 100% 110%;
    background-repeat: no-repeat;
}
.header-red {
    background-image: url('../../assets/theme/red-head.png');
}
.header-purple {
    background-image: url('../../assets/theme/purple-head.png');
}
.header-cyan {
    background-image: url('../../assets/theme/cyan-head.png');
}
.header-yellow {
    background-image: url('../../assets/theme/yellow-head.png');
}
.header-orange {
    background-image: url('../../assets/theme/orange-head.png');
}
.header-green {
    background-image: url('../../assets/theme/green-head.png');
}
.header-deep-blue {
    background-image: url('../../assets/theme/deep-blue-head.png');
}
.header-blue {
    background-image: url('../../assets/theme/blue-head.png');
}
.sidebar-logo-container {
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;
    padding-left: 15px;
}
.sidebar-logo-container-link {
    position: relative;
    width: 64px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.sidebar-logo {
    width: 36px;
    height: 36px;
    border-radius: 36px;
    background: transparent;
}
.sidebar-title {
    color: #fff;
    font-size: 24px;
    letter-spacing: 10px;
    margin-left: 15px;
    height: 100%;
}
.navbar {
    position: fixed;
    top: 0;
    right: 0;
}
.hamburger-container {
    float: left;
    display: flex;
    padding: 0px 15px;
    cursor: pointer;
}
.navbar-right {
    float: right;
    padding-right: 20px;
    display: flex;
    align-items: center;
}
.navbar-right .el-dropdown-link {
    cursor: pointer;
    height: 60px;
    display: flex;
    align-items: center;
}
.user-logo {
    width: 36px;
    height: 36px;
    border-radius: 36px;
}
.el-dropdown-menu__item {
    text-align: center;
}
.el-icon-arrow-down {
    font-size: 12px;
}
::v-deep .el-badge__content.is-fixed {
    top: 12px;
    right: 12px;
}
::v-deep .el-menu--horizontal {
    width: 960px;
    overflow: auto;
    display: flex;
}
::v-deep .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #fff;
}
.color-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.color-item {
    width: 165px;
    height: 130px;
    background: #ffffff;
    box-shadow: 0px 3px 16px 0px rgba(210, 211, 212, 0.5);
    border-radius: 4px;
    position: relative;
    margin: 5px;
}
.color-item > img {
    width: 100%;
}
.color-title {
    width: 100%;
    position: absolute;
    bottom: -5px;
    text-align: center;
}
</style>
