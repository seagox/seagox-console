<template>
    <div>
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
            </el-col>
        </el-row>
    </div>
</template>

<script>
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
    },
    created() {
        localStorage.clear()
        this.queryRegions()
        localStorage.setItem('title', window.platform.title)
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
        submitForm(formName) {
            var that = this
            that.$refs[formName].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, that.ruleForm)
                    that.$axios.post('auth/loginConsole', params).then(res => {
                        if (res.data.code == 200) {
                            localStorage.setItem('alias', res.data.data.alias)
                            localStorage.setItem('logo', res.data.data.logo)
                            localStorage.setItem('mark', res.data.data.mark)
                            localStorage.setItem('companyId', res.data.data.company[0].id)
                            localStorage.setItem('companyName', res.data.data.company[0].name)
                            localStorage.setItem('Authorization', res.data.data.tokenType + res.data.data.accessToken)

                            localStorage.setItem('avatar', res.data.data.avatar)
                            localStorage.setItem('userId', res.data.data.userId)
                            localStorage.setItem('account', res.data.data.account)
                            localStorage.setItem('name', res.data.data.name)
                            localStorage.setItem('company', JSON.stringify(res.data.data.company))

                            localStorage.setItem('_databaseId', res.data.data.datasourceType)

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
</style>
