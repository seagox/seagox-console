<template>
    <div class="header">
        <div class="sidebar-logo-container">
            <el-avatar class="sidebar-logo" :src="logo" @error="errorHandler">
                <img src="@/assets/avatar.png" />
            </el-avatar>
            <h1 class="sidebar-title">{{ alias }}</h1>
        </div>
        <div class="navbar">
            <div class="navbar-right">
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
                        <el-dropdown-item icon="el-icon-office-building" command="company" v-if="switchCompany"
                            >切换单位</el-dropdown-item
                        >
                        <el-dropdown-item icon="el-icon-lock" command="password">修改密码</el-dropdown-item>
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
    </div>
</template>
<script>
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
                        pattern: /(?=.*[a-z])(?=.*\d)(?=.*[^a-z0-9])[\S]{8,}/i,
                        message: '密码必须包含字母、数字和特殊字符，且长度至少8位',
                        trigger: 'blur'
                    },
                    { validator: checkOld, trigger: 'blur' }
                ],
                morePass: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: checkAge, trigger: 'blur' }
                ]
            },
            companyVisible: false,
            companyId: Number(localStorage.getItem('companyId')),
            switchCompany: window.platform.switchCompany
        }
    },
    computed: {
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
    methods: {
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
                    localStorage.setItem('departmentId', res.data.data.departmentId)

                    that.$store.commit('closeAll')
                    that.$router.go(0)
                } else {
                    that.$message.error(res.data.message)
                }
            })
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
    background-color: #409EFF;
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
