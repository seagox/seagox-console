<template>
    <div class="container">
        <el-main>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item v-if="typeOptions.length > 0" label="类型" prop="classify">
                    <el-select v-model="form.classify" placeholder="请选择">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发送范围" prop="toUserIds">
                    <div class="inside-input">
                        <el-select v-model="form.toUserIds" placeholder="请选择发送范围" clearable multiple filterable>
                            <el-option
                                v-for="item in memberPptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                        <i class="el-icon-document-copy iconE" @click="handleMemberDialog"></i>
                    </div>
                </el-form-item>
                <el-form-item v-if="relationOptions.length > 0" label="关联" prop="relation">
                    <div class="inside-input">
                        <el-select v-model="form.relation" placeholder="请选择需要关联的通知" clearable multiple filterable>
                            <el-option
                                v-for="item in relationOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-upload
                        ref="resources"
                        :action="action"
                        :headers="headers"
                        multiple
                        :show-file-list="true"
                        :file-list="fileList"
                        :before-upload="
							file => {
								return beforeFileUpload(file)
							}
						"
                        :on-success="
						    (res, file, fileList) => {
							    return handleSuccess(res, file, fileList)
						    }
					    "
                        :on-remove="handleRemove"
                    >
                        <el-button type="primary" icon="el-icon-upload"> 上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="text">
                    <editor ref="editor" id="text" placeholder="" v-model="form.content"> </editor>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button type="primary" @click="onSubmit(0)">暂存</el-button>
                    <el-button type="primary" @click="onSubmit(1)">发布</el-button>
                </el-form-item>
            </el-form>
            <excel-multiple-member ref="multipleMember" @confirm="memberConfirm" />
        </el-main>
    </div>
</template>

<script>
import editor from '@/views/components/quill/editor'
import excelMultipleMember from '@/views/components/form/multiple-member'
export default {
    components: {
        editor,
        excelMultipleMember
    },
    data() {
        return {
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
            form: {
                id: undefined,
                title: '',
                toUserIds: [],
                content: {},
                resources: [],
                classify: '1',
                relation: []
            },
            rules: {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                toUserIds: [
                    {
                        required: true,
                        message: '请选择发送范围',
                        trigger: 'change'
                    }
                ]
            },
            fileList: [],
            memberPptions: [],
            typeOptions: [],
            relationOptions: []
        }
    },
    created() {
        this.queryMember()
        this.querySendOrRec()
        this.queryType()
        if (this.$route.query.id){
            this.queryDetails(this.$route.query.id)
        }
    },
    methods: {
        // 成员数据
        async queryMember() {
            let res = await this.$axios.get('jellyForm/queryDynamic?path=member&type=list')
            if (res.data.code === 200) {
                var options = []
                for (var i = 0; i < res.data.data.length; i++) {
                    options.push({
                        id: res.data.data[i].id,
                        label: res.data.data[i].name,
                        value: String(res.data.data[i].id)
                    })
                }
                this.memberPptions = options
            }
        },
        queryType(){
            let that = this
            that.$axios.get('notice/queryType').then(res => {
                if (res.data.code == 200) {
                    var options = []
                    for (var i = 0; i < res.data.data.length; i++) {
                        options.push({
                            label: res.data.data[i].name,
                            value: res.data.data[i].code
                        })
                    }
                    this.typeOptions = options
                }
            })
        },
        querySendOrRec(){
            this.$axios.get('notice/querySendOrRec').then(res =>{
                if (res.data.code == 200) {
                    var options = []
                    for (var i = 0; i < res.data.data.length; i++) {
                        options.push({
                            id: res.data.data[i].id,
                            label: res.data.data[i].title,
                            value: String(res.data.data[i].id)
                        })
                    }
                    this.relationOptions = options
                }
            })
        },
        // 获取详情
        queryDetails() {
            let that = this
            that.$axios.get('notice/queryById/' + this.$route.query.id).then(res => {
                if (res.data.code == 200) {
                    this.form.id = res.data.data.id
                    this.form.title = res.data.data.title
                    this.form.content = JSON.parse(res.data.data.content)
                    this.$refs.editor.setContents(this.form.content)
                    this.form.resources = JSON.parse(res.data.data.resources)
                    this.fileList = JSON.parse(res.data.data.resources)
                    this.form.toUserIds = res.data.data.toUserIds.split(',')
                    this.form.classify = res.data.data.classify
                    if (res.data.data.relation){
                        this.form.relation = res.data.data.relation.split(',')
                    }
                }
            })
        },
        memberConfirm(type, field, value) {
            this.form.toUserIds = value
        },
        onSubmit(flag) {
            let that = this
            var params = {
                id: this.form.id,
                title: this.form.title,
                toUserIds: this.form.toUserIds.toString(),
                content: JSON.stringify(this.form.content),
                resources: JSON.stringify(this.form.resources),
                status: flag,
                classify: this.form.classify,
                relation: this.form.relation.toString()
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (flag === 1){
                        that.$axios.post('notice/publish', params).then(res => {
                            if (res.data.code == 200) {
                                that.$message.success('发布成功')
                                that.$store.commit('worktabRemove', that.$route.fullPath)
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                    if (flag === 0){
                        that.$axios.post('notice/staging', params).then(res => {
                            if (res.data.code == 200) {
                                that.$message.success('暂存成功')
                                that.$store.commit('worktabRemove', that.$route.fullPath)
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                }
            })
        },
        handleMemberDialog() {
            this.$refs.multipleMember.showDialog('default', 'toUserIds', this.memberPptions, this.form.toUserIds)
        },
        beforeFileUpload(file){
            this.$loading({ text: '上传中，请稍后...' })
            if (file.size > 100*1024*1024) {
                this.$loading().close()
                this.$message.error('附件大小100M以内')
                return false
            }
            return true
        },
        // 文件上传成功
        handleSuccess(res, file, fileList) {
            this.$loading().close()
            if (res.code === 200) {
                let suffix = ''
                let fileType = ''
                let fileName = ''
                try {
                    const flieArr = file.name.split('.')
                    suffix = flieArr[flieArr.length - 1]
                    fileName = flieArr[0]
                } catch (err) {}
                if (suffix) {
                    suffix = suffix.toLocaleLowerCase()
                    fileType = this.getFileType(suffix)
                    file.type = fileType
                    file.url = res.data
                }
                if (!this.form.title){
                    this.form.title = fileName
                }
                this.form.resources.push({
                    type: fileType,
                    name: file.name,
                    size: file.size,
                    url: res.data
                })
            }
        },
        // 文件删除
        handleRemove(file, fileList) {
            let index = fileList.findIndex(fileItem => {
                return fileItem.url === file.url
            })
            this.form.resources.splice(index, 1)
        },
        //获取文件类型
        getFileType(suffix) {
            let result = ''
            // 图片格式
            const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
            // 进行图片匹配
            result = imglist.find(item => item === suffix)
            if (result) {
                return 'image'
            }
            // 图片格式
            const tiflist = ['tiff', 'tif']
            // 进行图片匹配
            result = tiflist.find(item => item === suffix)
            if (result) {
                return 'tif'
            }
            // 匹配txt
            const txtlist = ['txt']
            result = txtlist.find(item => item === suffix)
            if (result) {
                return 'txt'
            }
            // 匹配 excel
            const excelist = ['xls', 'xlsx']
            result = excelist.find(item => item === suffix)
            if (result) {
                return 'excel'
            }
            // 匹配 word
            const wordlist = ['doc', 'docx']
            result = wordlist.find(item => item === suffix)
            if (result) {
                return 'word'
            }
            // 匹配 pdf
            const pdflist = ['pdf']
            result = pdflist.find(item => item === suffix)
            if (result) {
                return 'pdf'
            }
            // 匹配 ppt
            const pptlist = ['ppt', 'pptx']
            result = pptlist.find(item => item === suffix)
            if (result) {
                return 'ppt'
            }
            // 匹配 视频
            const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v']
            result = videolist.find(item => item === suffix)
            if (result) {
                return 'video'
            }
            // 匹配 音频
            const radiolist = ['mp3', 'wav', 'wmv']
            result = radiolist.find(item => item === suffix)
            if (result) {
                return 'radio'
            }
            // 匹配 压缩
            const ziplist = ['zip', 'rar']
            result = ziplist.find(item => item === suffix)
            if (result) {
                return 'zip'
            }
            // 匹配 ofd
			const ofdlist = ['ofd']
			result = ofdlist.find(item => item === suffix)
			if (result) {
				return 'ofd'
			}
			// 匹配 rtf
			const rtflist = ['rtf']
			result = rtflist.find(item => item === suffix)
			if (result) {
				return 'rtf'
			}
            // 其他 文件类型
            return 'other'
        }
    }
}
</script>

<style scoped>
.container {
    padding-top: 15px;
}
.inside-input {
    position: relative;
}
.inside-input .iconE {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
}
::v-deep .inside-input .el-input--suffix .el-input__inner {
    padding-right: 48px;
}
::v-deep .inside-input .el-select .el-input__suffix .el-icon-arrow-up {
    display: none;
}
::v-deep .inside-input .el-select .el-input__suffix .el-icon-circle-close {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    color: #000;
}
</style>
