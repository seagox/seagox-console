<template>
    <div class="container" v-loading="loading">
        <!--简化版-->
        <div v-if="formDesignType === 1">
            <simplify-form
                    ref="simplifyForm"
                    :action="action"
                    :formModel="formModel"
                    :formCofig="formCofig"
                    :property="property"
                    :calculate="calculate"
                    :textModel="textModel"
            />
        </div>
        <!--高级版-->
        <div v-if="formDesignType === 2">
            <senior-form
                    ref="seniorForm"
                    :action="action"
                    :formModel="formModel"
                    :formCofig="formCofig"
                    :property="property"
                    :calculate="calculate"
            />
        </div>
        <div style="margin-bottom:30px; padding: 0 5px 0 5px">
            <table border="1" cellpadding="0" cellspacing="0" bordercolor="#fff" class="my_table">
                <tbody class="tbody">
                <tr>
                    <td :colspan="1" width="16.66666%">坐落位置</td>
                    <td :colspan="5">
                        <el-input
                                v-model="formModel[tableName + '.location']"
                                class="my_table_td"
                                clearable
                                placeholder="请输入坐落位置"
                        ></el-input>
                    </td>
                </tr>
                <tr>
                    <td :colspan="1" width="16.66666%">经度</td>
                    <td :colspan="1" width="16.66666%">
                        <el-input
                                v-model="formModel[tableName + '.longitude']"
                                clearable
                                placeholder="请输入经度"
                        ></el-input>
                    </td>
                    <td :colspan="1" width="16.66666%">纬度</td>
                    <td :colspan="1" width="16.66666%">
                        <el-input
                                v-model="formModel[tableName + '.latitude']"
                                clearable
                                placeholder="请输入坐落纬度"
                        ></el-input>
                    </td>
                    <td :colspan="2" style="text-align: left; padding-left: 10px">
                        <el-button type="primary" size="mini" @click="getPosition">定位</el-button>
                    </td>
                </tr>
                </tbody>
            </table>
            <div ref="qqMap" style="width: 100%; height: 600px; margin-top: 20px"></div>
        </div>
        <div class="footer">
            <div class="footer-right">
                <el-dropdown
                        trigger="click"
                        style="margin-right:10px"
                        @command="handleTextCommand"
                        v-if="textModel.flag"
                >
                    <el-button type="primary" icon="el-icon-document"
                    >正文类型<i class="el-icon-arrow-down el-icon--right"></i
                    ></el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="text">标准正文</el-dropdown-item>
                        <el-dropdown-item command="word">Word正文</el-dropdown-item>
                        <el-dropdown-item command="excel">Excel正文</el-dropdown-item>
                        <el-dropdown-item command="pdf">Pdf正文</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button
                        type="primary"
                        icon="el-icon-document"
                        @click="saveForm"
                        v-if="flowFlag === 1"
                        :disabled="disableButtonFlag.temp"
                >暂存</el-button
                >
                <el-button
                        type="primary"
                        icon="el-icon-document-checked"
                        @click="submitForm"
                        :disabled="disableButtonFlag.submit"
                >提交</el-button
                >
            </div>
        </div>
        <!--温馨提示-->
        <el-dialog title="温馨提示" width="500px" :visible.sync="verifyVisible" :close-on-click-modal="false">
            <div
                    v-for="(item, index) in messageArray"
                    :key="index"
                    style="color:#e6a23c;margin-bottom:10px;font-size:16px;"
            >
                <i class="el-icon-warning-outline"></i> {{ item }}
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="verifyVisible = false">取消</el-button>
                <el-button type="primary" @click="verifySubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--审批自选-->
        <el-dialog title="请选择" width="500px" :visible.sync="approveOptionalVisible" :close-on-click-modal="false">
            <div>
                <el-table
                        :data="approveOptionalList"
                        style="width: 100%"
                        :show-header="true"
                        :max-height="450"
                        @selection-change="handleApproveOptionalChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="全选" prop="name"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="approveOptionalVisible = false">取消</el-button>
                <el-button type="primary" @click="approveOptionalSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--流程自选-->
        <el-dialog title="请选择" width="500px" :visible.sync="flowOptionalVisible" :close-on-click-modal="false">
            <div>
                <el-table
                        :data="flowOptionalList"
                        style="width: 100%"
                        :show-header="true"
                        :max-height="450"
                        @selection-change="handleFlowOptionalChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="全选" prop="label"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="flowOptionalVisible = false">取消</el-button>
                <el-button type="primary" @click="flowOptionalSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    let qqMap
    let markerLayer
    export default {
        data() {
            return {
                action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
                tableData: [],
                formModel: {},
                calculate: {},
                property: {},
                formId: '',
                verifyVisible: false,
                messageArray: [],
                flowFlag: 2,
                formDesignType: 0,
                formCofig: {},
                approveOptionalVisible: false,
                approveOptionalList: [],
                approveOptionalSelection: [],
                flowOptionalVisible: false,
                flowOptionalList: [],
                flowOptionalSelection: [],
                textModel: { flag: false, type: 'text' },
                loading: false,
                disableButtonFlag: {
                    temp: false,
                    submit: false,
                    audit: false,
                    seaView: false,
                    abandon: false,
                    backFront: false,
                    backStart: false,
                    delete: false
                },

                qqMap: undefined, // 地图
                tableName: "assets_info"
            }
        },
        created() {
            if (+this.$history.currentRoute.query.id === 34) {
                this.tableName = "assets_info_modify"
            }
            this.queryByMark()
        },
        mounted() {
            this.$nextTick(()=> {
                this.initMap()
            })
        },
        methods: {
            async queryByMark() {
                this.loading = true
                const res = await this.$axios.get('jellyForm/queryByMark/' + this.$history.currentRoute.query.id)
                this.loading = false
                if (res.data.code == 200) {
                    if (this.$history.currentRoute.query.originAssetsId) {
                        await this.setFormByOriginAssetsId(this.$history.currentRoute.query.originAssetsId, 'assets_info_modify')
                    }
                    this.formId = res.data.data.id
                    if (res.data.data.hasOwnProperty('flowId') && res.data.data.flowId != null) {
                        this.flowFlag = 1
                    }
                    this.disableButtonFlag = res.data.data.disableButtonFlag
                    for (let i = 0; i < res.data.data.formDesignList.length; i++) {
                        let formDesign = res.data.data.formDesignList[i]
                        this.formDesignType = formDesign.type
                        this.formCofig = JSON.parse(formDesign.excelJson)
                    }
                }
            },
            handleApproveOptionalChange(val) {
                let approveOptionalSelection = []
                for (let i = 0; i < val.length; i++) {
                    approveOptionalSelection.push(val[i].id)
                }
                this.approveOptionalSelection = approveOptionalSelection
            },
            handleFlowOptionalChange(val) {
                let flowOptionalSelection = []
                for (let i = 0; i < val.length; i++) {
                    flowOptionalSelection.push(val[i].id)
                }
                this.flowOptionalSelection = flowOptionalSelection
            },
            verifySubmit() {
                this.verifyVisible = false
                let that = this
                var params = {
                    $formId: that.formId
                }

                //表单验证
                if (this.formDesignType === 1) {
                    let result = this.$refs.simplifyForm.validate()
                    if (!result) {
                        return
                    }
                } else if (this.formDesignType === 2) {
                    let result = this.$refs.seniorForm.validate()
                    if (!result) {
                        return
                    }
                }

                params = Object.assign(params, this.formModel)

                Object.keys(params).forEach((key, index) => {
                    let property = this.property[key]
                    if (property) {
                        if (
                            (property.type === 'checkbox' ||
                                property.type === 'select' ||
                                property.type === 'department' ||
                                property.type === 'member' ||
                                property.type === 'business' ||
                                property.type === 'cascader') &&
                            property.multiple
                        ) {
                            params[key] = params[key].toString()
                        }
                        if (
                            property.type === 'picture' ||
                            property.type === 'upload' ||
                            property.type === 'table' ||
                            property.type === 'area'
                        ) {
                            params[key] = JSON.stringify(params[key])
                        }
                    }
                    if (params[key] instanceof Array || params[key] instanceof Object) {
                        params[key] = JSON.stringify(params[key])
                    }
                })

                if (this.approveOptionalSelection.length > 0) {
                    params['approverOptionalList'] = this.approveOptionalSelection.toString()
                }

                if (this.flowOptionalSelection.length > 0) {
                    params['flowOptionalList'] = this.flowOptionalSelection.toString()
                }

                that.$axios.post('jellyForm/insertCustom', params).then(res => {
                    if (res.data.code == 200) {
                        that.$message.success('提交成功')
                        that.$store.commit('worktabRemove', that.$history.currentRoute.fullPath)
                    } else if (res.data.code == 10004) {
                        // 审批人自选
                        that.approveOptionalList = JSON.parse(res.data.message)
                        that.approveOptionalVisible = true
                    } else if (res.data.code == 10009) {
                        // 流程手动选择
                        that.flowOptionalList = JSON.parse(res.data.message)
                        that.flowOptionalVisible = true
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            submitForm() {
                let that = this
                var params = {
                    $formId: that.formId
                }
                //表单验证
                if (this.formDesignType === 1) {
                    let result = this.$refs.simplifyForm.validate()
                    if (!result) {
                        return
                    }
                } else if (this.formDesignType === 2) {
                    let result = this.$refs.seniorForm.validate()
                    if (!result) {
                        return
                    }
                }

                params = Object.assign(params, this.formModel)

                Object.keys(params).forEach((key, index) => {
                    let property = this.property[key]
                    if (property) {
                        if (
                            (property.type === 'checkbox' ||
                                property.type === 'select' ||
                                property.type === 'department' ||
                                property.type === 'member' ||
                                property.type === 'business' ||
                                property.type === 'cascader') &&
                            property.multiple
                        ) {
                            params[key] = params[key].toString()
                        }
                        if (
                            property.type === 'picture' ||
                            property.type === 'upload' ||
                            property.type === 'table' ||
                            property.type === 'area'
                        ) {
                            params[key] = JSON.stringify(params[key])
                        }
                    }
                    if (params[key] instanceof Array || params[key] instanceof Object) {
                        params[key] = JSON.stringify(params[key])
                    }

                    if (key.indexOf('|') > -1) {
                        params[key.split('|')[0] + '.' + key.split('|')[1]] = params[key]
                        delete params[key]
                    }
                })

                if (this.approveOptionalSelection.length > 0) {
                    params['approverOptionalList'] = this.approveOptionalSelection.toString()
                }

                if (this.flowOptionalSelection.length > 0) {
                    params['flowOptionalList'] = this.flowOptionalSelection.toString()
                }

                that.loading = true
                that.$axios.post('jellyForm/insertCustom', params).then(res => {
                    that.loading = false
                    if (res.data.code == 200) {
                        that.$message.success('提交成功')
                        that.$store.commit('worktabRemove', that.$history.currentRoute.fullPath)
                    } else if (res.data.code == 10004) {
                        // 审批人自选
                        that.approveOptionalList = JSON.parse(res.data.message)
                        that.approveOptionalVisible = true
                    } else if (res.data.code == 10009) {
                        // 流程手动选择
                        that.flowOptionalList = JSON.parse(res.data.message)
                        that.flowOptionalVisible = true
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            approveOptionalSubmit() {
                if (this.approveOptionalSelection.length === 0) {
                    this.$message.warning('请选择节点执行人')
                } else {
                    this.approveOptionalVisible = false
                    this.submitForm()
                }
            },
            flowOptionalSubmit() {
                if (this.flowOptionalSelection.length === 0) {
                    this.$message.warning('请选择流程节点')
                } else {
                    this.flowOptionalVisible = false
                    this.submitForm()
                }
            },
            saveForm() {
                let that = this
                var params = {
                    $formId: that.formId,
                    temporaryStorage: true
                }

                params = Object.assign(params, this.formModel)

                Object.keys(params).forEach((key, index) => {
                    let property = this.property[key]
                    if (property) {
                        if (
                            (property.type === 'checkbox' ||
                                property.type === 'select' ||
                                property.type === 'department' ||
                                property.type === 'member' ||
                                property.type === 'business' ||
                                property.type === 'cascader') &&
                            property.multiple
                        ) {
                            params[key] = params[key].toString()
                        }
                        if (
                            property.type === 'picture' ||
                            property.type === 'upload' ||
                            property.type === 'table' ||
                            property.type === 'area'
                        ) {
                            params[key] = JSON.stringify(params[key])
                        }
                    }
                    if (params[key] instanceof Array || params[key] instanceof Object) {
                        params[key] = JSON.stringify(params[key])
                    }

                    if (key.indexOf('|') > -1) {
                        params[key.split('|')[0] + '.' + key.split('|')[1]] = params[key]
                        delete params[key]
                    }
                })

                that.loading = true
                that.$axios.post('jellyForm/insertCustom', params).then(res => {
                    that.loading = false
                    if (res.data.code == 200) {
                        that.$message.success('保存成功')
                        that.$store.commit('worktabRemove', that.$history.currentRoute.fullPath)
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            handleTextCommand(command) {
                this.textModel.type = command
                if (command === 'text') {
                    // 标准正文
                    this.$set(this.formModel, this.textModel.field, {})
                } else if (command === 'word') {
                    // Word正文
                    this.$set(this.formModel, this.textModel.field, { type: 'word' })
                } else if (command === 'excel') {
                    // Excel正文
                    this.$set(this.formModel, this.textModel.field, { type: 'word' })
                } else if (command === 'pdf') {
                    // Pdf正文
                    this.$set(this.formModel, this.textModel.field, { type: 'pdf' })
                }
            },


            // 设置表单数据
            async setFormByOriginAssetsId(assetsId, tableName) {
                let params = {
                    id: assetsId
                }
                this.loading = true
                const res = await this.$axios.get('cloud/entrance/getAssetsInfoById', { params })
                this.loading = false
                if (res.data.code === 200) {
                    let data = JSON.parse(JSON.stringify(res.data.data))
                    if (data) {
                        for (let key in data) {
                            if (key == 'id' && tableName === 'assets_info_modify') {
                                this.$set(this.formModel, tableName + '.' + "origin_assets_id", data[key])
                            } else {
                                this.$set(this.formModel, tableName + '.' + key, data[key])
                            }
                        }
                    }
                } else {
                    this.$message.error(res.data.message)
                }
            },

            // 初始化地图
            initMap() {
                let center = new TMap.LatLng(39.984104, 116.307503);
                // 初始化地图
                qqMap = new TMap.Map(this.$refs.qqMap, {
                    zoom: 15,
                    center: center,
                });
                //初始化marker
                markerLayer = new TMap.MultiMarker({
                    id: 'marker-layer',
                    map: qqMap,
                    styles: {
                        "marker": new TMap.MarkerStyle({
                            "width": 25,
                            "height": 35,
                            "anchor": {
                                x: 16,
                                y: 32
                            },
                            "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png'
                        })
                    },
                    geometries: [{
                        "id": 'battery',
                        "styleId": 'marker',
                        "position": new TMap.LatLng(39.984104, 116.307503),
                        "properties": {
                            "title": "marker"
                        }
                    }]
                });

                // 去除logo及水印，开发文档中也有去除LOGO的方法，但不能去除左下角信息
                var a = document.querySelector('canvas+div:last-child')
                a.style.display = 'none'
            },

            getPosition() {
                let params = {
                    location: this.formModel[this.tableName + ".location"],
                }
                this.loading = true
                this.$axios.get('cloud/entrance/getPositionByLocation', {params}).then(res => {
                    this.loading = false
                    if (res.data.code == 200) {
                        if (res.data.data && res.data.data.lng && res.data.data.lat) {
                            this.$set(this.formModel, this.tableName + '.longitude', res.data.data.lng)
                            this.$set(this.formModel, this.tableName + '.latitude', res.data.data.lat)

                            // 地图重新定位
                            let geometrieslist = []
                            geometrieslist.push({
                                "id": 'battery',
                                "styleId": 'marker',
                                "position": new TMap.LatLng(res.data.data.lat, res.data.data.lng),
                                "properties": {
                                    "title": "marker"
                                }
                            })

                            qqMap.setCenter(new TMap.LatLng(res.data.data.lat, res.data.data.lng))
                            markerLayer.setGeometries(geometrieslist)

                        } else {
                            this.$message.error("请检查坐落位置是否正常")
                        }
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .container {
        padding: 5px 0px 45px 5px;
    }
    .footer {
        position: fixed;
        left: 230px;
        bottom: 0px;
        width: 100%;
        background: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        height: 65px;
        border-bottom: 1px solid #ebeef5;
        box-sizing: border-box;
        border-top: 1px solid #ebeef5;
    }
    .footer-right {
        position: fixed;
        bottom: 0px;
        right: 15px;
        padding: 10px;
    }
    .tbody {
        font-size: 12px;
        font-weight: bold;
    }
    .my_table {
        text-align: center;
        width: 100%;
        border-collapse: collapse;
        border: 1px solid rgb(142, 142, 142);
    }

    .my_table .el-input__inner {
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #fff !important;
        width: 100%;
    }
</style>
