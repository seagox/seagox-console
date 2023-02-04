<template>
    <div
        v-if="loginType"
        :style="{
            width: '100%',
            height: clientHeight + 'px',
            background: 'url(' + backgroundImage + ') no-repeat',
            'background-size': '100% 100%'
        }"
    >
        <el-row>
            <el-col
                :span="6"
                :offset="9"
                :style="{
                    position: 'relative',
                    height: clientHeight + 'px'
                }"
            >
                <div class="form">
                    <div class="title" style="font-size: 28px;">欢 迎 登 录</div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                        <el-form-item prop="account">
                            <el-input
                                v-model="ruleForm.account"
                                placeholder="请输入用户名"
                                prefix-icon="el-icon-user"
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                type="password"
                                v-model="ruleForm.password"
                                placeholder="请输入密码"
                                prefix-icon="el-icon-lock"
                                @keyup.enter.native="onEnter"
                                show-password
                            ></el-input>
                        </el-form-item>
                        <div class="login-btn">
                            <el-button type="primary" @click="submitForm('ruleForm')"> 登 录 </el-button>
                        </div>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
    <div v-else>
        <el-row>
            <el-col :span="13">
                <div
                    :style="{
                        width: '100%',
                        height: clientHeight + 'px',
                        background: 'url(' + backgroundImage + ') no-repeat',
                        'background-size': '100% 100%'
                    }"
                ></div>
            </el-col>
            <el-col
                :span="11"
                :style="{
                    position: 'relative',
                    height: clientHeight + 'px'
                }"
            >
                <div class="form" style="top:0">
                    <div class="title" style="font-size: 36px;">欢 迎 登 录</div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                        <el-form-item prop="account">
                            <el-input
                                v-model="ruleForm.account"
                                placeholder="请输入用户名"
                                prefix-icon="el-icon-user"
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                type="password"
                                v-model="ruleForm.password"
                                placeholder="请输入密码"
                                prefix-icon="el-icon-lock"
                                @keyup.enter.native="onEnter"
                                show-password
                            ></el-input>
                        </el-form-item>
                        <div class="login-btn">
                            <el-button type="primary" @click="submitForm('ruleForm')"> 登 录 </el-button>
                        </div>
                    </el-form>
                </div>
                <div class="footer">Copyright © 福建财通信息科技有限公司. All Rights Reserved.</div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'
export default {
    data() {
        return {
            clientHeight: 0,
            ruleForm: {
                account: '',
                password: ''
            },
            rules: {
                account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        }
    },
    beforeMount() {
        this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        this.backgroundImage = require('@/' + window.platform.backgroundImage)
        this.loginType = window.platform.loginType
    },
    created() {
        localStorage.clear()
        this.queryRegions()
        localStorage.setItem('title', window.platform.title)
        this.verifyLogin()
    },
    methods: {
        async queryRegions() {
            let res = await this.$axios.get('auth/queryRegions')
            if (res.data.code == 200) {
                localStorage.setItem('regions', JSON.stringify(res.data.data))
            }
        },
        onEnter(event) {
            if (event.keyCode == 13) {
                this.submitForm('ruleForm')
            }
        },
        verifyLogin() {
            let that = this
            if (JSON.stringify(this.$route.query) != '{}') {
                this.$axios.post('/cloud/entrance/verifyLogin', this.$route.query).then(res => {
                    if (res.data.code == 200) {
                      if (res.data.data.jcyorg){
                        localStorage.setItem('jcyorg', res.data.data.jcyorg)
                      }
                        localStorage.setItem('color', res.data.data.color || '#0574d5')
                        if (res.data.data.color) {
                            var options = {
                                newColors: [...forElementUI.getElementUISeries(res.data.data.color)]
                            }
                            client.changer.changeColor(options, Promise).then(() => {})
                        }
                        localStorage.setItem('alias', res.data.data.alias)
                        localStorage.setItem('logo', res.data.data.logo)
                        localStorage.setItem('mark', res.data.data.mark)
                        localStorage.setItem('companyId', res.data.data.company[0].id)
                        localStorage.setItem('companyName', res.data.data.company[0].name)
                        localStorage.setItem('Authorization', res.data.data.tokenType + res.data.data.accessToken)
                        if (res.data.data.permissions) {
                            localStorage.setItem('permissions', res.data.data.permissions.split(','))
                        } else {
                            localStorage.setItem('permissions', 'no')
                        }
                        if (res.data.data.roleIds) {
                            localStorage.setItem('roleIds', res.data.data.roleIds.split(','))
                        } else {
                            localStorage.setItem('roleIds', 'no')
                        }
                        if (res.data.data.roleNames) {
                            localStorage.setItem('roleNames', res.data.data.roleNames.split(','))
                        } else {
                            localStorage.setItem('roleNames', 'no')
                        }
                        localStorage.setItem('departmentId', res.data.data.departmentId)
                        localStorage.setItem('avatar', res.data.data.avatar)
                        localStorage.setItem('userId', res.data.data.userId)
                        localStorage.setItem('account', res.data.data.account)
                        localStorage.setItem('name', res.data.data.name)
                        localStorage.setItem('company', JSON.stringify(res.data.data.company))
                        localStorage.setItem('_databaseId', res.data.data.datasourceType)
                        // 动态路由添加
                        localStorage.setItem('routes', JSON.stringify(res.data.data.routes))
                        that.$store.commit('handleAddRouter', true)
                        let routes = res.data.data.routes
                        for (let i = 0; i < routes.length; i++) {
                            that.$router.addRoute('home', {
                                name: routes[i].path,
                                path: '/' + routes[i].path,
                                component: resolve => require([`@/views/${routes[i].path}`], resolve),
                                meta: {
                                    title: routes[i].name
                                }
                            })
                        }
                        that.$router.replace({
                            path: that.$route.query.redirect || '/readme'
                        })
                        that.$store.commit('handleLogin')
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            }
        },
        submitForm(formName) {
            var that = this
            that.$refs[formName].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, that.ruleForm)
                    that.$axios.post('auth/login', params).then(res => {
                        if (res.data.code == 200) {
                            localStorage.setItem('color', res.data.data.color || '#0574d5')
                            if (res.data.data.color) {
                                var options = {
                                    newColors: [...forElementUI.getElementUISeries(res.data.data.color)]
                                }
                                client.changer.changeColor(options, Promise).then(() => {})
                            }
                            localStorage.setItem('alias', res.data.data.alias)
                            localStorage.setItem('logo', res.data.data.logo)
                            localStorage.setItem('mark', res.data.data.mark)
                            localStorage.setItem('companyId', res.data.data.company[0].id)
                            localStorage.setItem('companyName', res.data.data.company[0].name)
                            localStorage.setItem('Authorization', res.data.data.tokenType + res.data.data.accessToken)
                            if (res.data.data.permissions) {
                                localStorage.setItem('permissions', res.data.data.permissions.split(','))
                            } else {
                                localStorage.setItem('permissions', 'no')
                            }
                            if (res.data.data.roleIds) {
                                localStorage.setItem('roleIds', res.data.data.roleIds.split(','))
                            } else {
                                localStorage.setItem('roleIds', 'no')
                            }
                            if (res.data.data.roleNames) {
                                localStorage.setItem('roleNames', res.data.data.roleNames.split(','))
                            } else {
                                localStorage.setItem('roleNames', 'no')
                            }
                            localStorage.setItem('departmentId', res.data.data.departmentId)

                            localStorage.setItem('avatar', res.data.data.avatar)
                            localStorage.setItem('userId', res.data.data.userId)
                            localStorage.setItem('account', res.data.data.account)
                            localStorage.setItem('name', res.data.data.name)
                            localStorage.setItem('company', JSON.stringify(res.data.data.company))

                            localStorage.setItem('_databaseId', res.data.data.datasourceType)

                            // 动态路由添加
                            localStorage.setItem('routes', JSON.stringify(res.data.data.routes))
                            that.$store.commit('handleAddRouter', true)
                            let routes = res.data.data.routes
                            for (let i = 0; i < routes.length; i++) {
                                that.$router.addRoute('home', {
                                    name: routes[i].path,
                                    path: '/' + routes[i].path,
                                    component: resolve => require([`@/views/${routes[i].path}`], resolve),
                                    meta: {
                                        title: routes[i].name
                                    }
                                })
                            }

                            that.$router.replace({
                                path: that.$route.query.redirect || '/readme'
                            })

                            that.$store.commit('handleLogin')
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
::v-deep .el-form-item__content {
    line-height: 54px;
}
::v-deep .el-input__inner {
    height: 44px;
}
.form {
    width: 80%;
    max-width: 392px;
    height: 315px;
    position: absolute;
    margin: auto;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    background-color: #fff;
    padding: 0px 25px 0px 25px;
}
.title {
    font-weight: 700;
    line-height: 60px;
    color: #364a63;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 10px;
}
.login-btn button {
    width: 100%;
    height: 44px;
}
.footer {
    width: 100%;
    color: #526484;
    position: absolute;
    bottom: 15px;
    text-align: center;
}
</style>
