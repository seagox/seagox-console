<template>
    <div class="preview-container">
        <div class="head-box">
            <div>人大预算互联网监督平台</div>
            <div>数据更新至{{ getDate() }}</div>
        </div>
        <div class="preview-dody">
            <div class="preview-dody-left">
                <div class="theme-border-box">
                    <div class="blue-title">审查监督意见全过程分析</div>
                    <div class="detail-box">
                        <div class="first-box-flex">
                            <div class="first-box-bg-blue">
                                <div>{{ firstBox.scjdyj }}</div>
                                <div>审查监督意见</div>
                            </div>
                            <div class="first-box-bg-purple">
                                <div>{{ firstBox.clsl }}</div>
                                <div>意见处理</div>
                            </div>
                        </div>
                        <div id="tuli-1" style="height:200px;width:100%;margin-top:10px"></div>
                    </div>
                    <div class="border-light-left"></div>
                    <div class="border-light-right"></div>
                </div>
                <div class="theme-border-box" style="height:calc(100% - 430px)">
                    <div class="blue-title">
                        <div>自动监督预警全过程分析</div>
                        <div style="padding: 15px 0px; text-align: right;font-size:12px">
                            <span style="color: #1adc4a; font-size: 14px;">•</span>总数&nbsp;&nbsp;
                            <span style="color: rgb(218, 0, 28); font-size: 14px;">•</span>严重&nbsp;&nbsp;
                            <span style="color: rgb(251, 95, 20); font-size: 14px;">•</span>警告&nbsp;&nbsp;
                            <span style="color: rgb(255, 192, 52); font-size: 14px;">•</span>提示&nbsp;&nbsp;
                        </div>
                    </div>
                    <div class="detail-box">
                        <div>
                            <div v-for="(item, index) in LBTbox" :key="index" class="warm-list-item-box">
                                <div class="white-text">{{ item.name }}</div>
                                <div class="green-text">{{ item.total }}</div>
                                <div class="red-text">{{ item.yz }}</div>
                                <div class="orange-text">{{ item.jg }}</div>
                                <div class="yellow-text">{{ item.ts }}</div>
                            </div>
                        </div>
                        <div class="custom-table-class" style="margin-top:10px">
                            <div class="table-head">
                                <div style="width:80px">排名</div>
                                <div style="width:calc(100% - 200px)">触发预警规则</div>
                                <div style="width:100px">数量</div>
                            </div>
                            <el-scrollbar style="height:173px;overflow-y:auto">
                                <div class="table-body" v-for="(item, index) in LBBbox" :key="index">
                                    <div style="width:80px">{{ item.px }}</div>
                                    <div style="width:calc(100% - 200px)">{{ item.name }}</div>
                                    <div style="width:100px">{{ item.num }}</div>
                                </div>
                            </el-scrollbar>
                            <!-- <el-table :border="false" :data="LBBbox">
                                    <el-table-column label="排名" width="80" prop="px"></el-table-column>
                                    <el-table-column label="触发预警规则" prop="name"></el-table-column>
                                    <el-table-column label="数量" width="100" prop="num"></el-table-column>
                                </el-table> -->
                        </div>
                    </div>

                    <div class="border-light-left"></div>
                    <div class="border-light-right"></div>
                </div>
            </div>
            <div class="preview-dody-center">
                <div class="center-first-title">
                    <i
                        class="el-icon-caret-right"
                        style="color:rgba(82, 232, 237, 1);opacity: 0.6;font-size:16px;margin-right:-8px"
                    />
                    <i class="el-icon-caret-right" style="color:#52E8ED;;font-size:17px" />
                    预算执行动态监控
                    <i class="el-icon-caret-left" style="color:#52E8ED;;font-size:17px" />
                    <i
                        class="el-icon-caret-left"
                        style="color:rgba(82, 232, 237, 1);opacity: 0.6;;font-size:16px;margin-left:-8px"
                    />
                </div>
                <div class="center-img">
                    <el-carousel
                        arrow="never"
                        :interval="5000"
                        height="465px"
                        @change="changeCarousel"
                        indicator-position="outside"
                    >
                        <el-carousel-item v-for="(item, index) in CTbox" :key="index">
                            <div class="center-tab-box">
                                <div class="center-flex-tabs">
                                    <div
                                        :class="item.tabindex == 0 ? 'cur-tab' : 'default-tab'"
                                        @click="changeCTtab(index, 0)"
                                    >
                                        <div>收入</div>
                                        <div>单位：万元</div>
                                    </div>
                                    <div
                                        :class="item.tabindex == 1 ? 'cur-tab' : 'default-tab'"
                                        @click="changeCTtab(index, 1)"
                                    >
                                        <div>支出</div>
                                        <div>单位：万元</div>
                                    </div>
                                </div>
                                <div class="tab-content">
                                    <div class="srzc-list-item-box">
                                        <div>预算金额</div>
                                        <div>执行金额</div>
                                        <div>执行占比</div>
                                    </div>
                                    <div class="srzc-list-item-box">
                                        <div>{{ item.tabindex == 0 ? item.sr.ysje : item.zc.ysje }}</div>
                                        <div>{{ item.tabindex == 0 ? item.sr.jzje : item.zc.jzje }}</div>
                                        <div>{{ item.tabindex == 0 ? item.sr.zb : item.zc.zb }}</div>
                                    </div>
                                </div>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                    <div class="center-img-text">{{ CTbox[curCarousel].name }}</div>
                </div>

                <div class="theme-border-box center-bottom-box">
                    <div class="blue-title">
                        <div>支出进度</div>
                        <div style="text-align: right;font-size:14px">
                            单位：万元
                        </div>
                    </div>
                    <div class="detail-box " style="padding-top:0">
                        <div class="center-custom-table">
                            <div class="table-head">
                                <div style="width:40%">单位名称</div>
                                <div style="width:20%">本月金额</div>
                                <div style="width:20%">累计金额</div>
                                <div style="width:20%">累计执行进度</div>
                            </div>
                            <el-scrollbar style="height:230px;overflow-y:auto">
                                <div class="table-body" v-for="(item, index) in CBbox" :key="index">
                                    <div style="width:40%">{{ item.EN_NAME }}</div>
                                    <div style="width:20%">{{ item.BUDGET_AMOUNT }}</div>
                                    <div style="width:20%">{{ item.ljje }}</div>
                                    <div style="width:20%">{{ item.jd }}</div>
                                </div>
                                <div v-if="CBbox.length <= 0" class="table-body" style="height:230px">暂无数据</div>
                            </el-scrollbar>
                        </div>

                        <!-- <el-table :border="false" :data="CBbox" height="250" :highlight-current-row="false">
                                <el-table-column label="单位名称" prop="EN_NAME"></el-table-column>
                                <el-table-column label="本月金额" prop="BUDGET_AMOUNT"></el-table-column>
                                <el-table-column label="累计金额" prop="ljje"></el-table-column>
                                <el-table-column label="累计执行进度" prop="jd"></el-table-column>
                            </el-table> -->
                    </div>
                    <div class="border-light-left"></div>
                    <div class="border-light-right"></div>
                </div>
            </div>
            <div class="preview-dody-right">
                <div class="theme-border-box ">
                    <div class="blue-title">重点支出监督</div>
                    <div class="detail-box">
                        <div class="right-box-flex">
                            <div class="right-box-flex-item">
                                <div>{{ RTTbox.total }}</div>
                                <div class="right-box-flex-item-bottom">金额总计（万元）</div>
                            </div>
                            <div class="right-box-flex-item">
                                <div>
                                    {{ RTTbox.percent }}%
                                    <!-- <i class="el-icon-caret-bottom" /> -->
                                </div>
                                <div class="right-box-flex-item-bottom">同比（百分比）</div>
                            </div>
                        </div>
                        <div id="tuli-2" style="height:190px;width:100%;margin-top:10px"></div>
                    </div>

                    <div class="border-light-left"></div>
                    <div class="border-light-right"></div>
                </div>
                <div class="theme-border-box " style="height:calc(100% - 440px)">
                    <div class="blue-title">三公经费监督</div>
                    <el-scrollbar style="height:472px;overflow-y:auto">
                        <div class="detail-box">
                            <div v-for="(item, index) in RBbox" :key="index">
                                <div class="center-flex-tabs ">
                                    <div class="cur-tab" style="width:60%">{{ item.name }}</div>
                                    <div style="color:#fff">单位：万元</div>
                                </div>
                                <div class="right-last-box-item">
                                    <div style="width:40%">
                                        <div>预算数：{{ item.yss }}</div>
                                        <div>执行数：{{ item.zxs }}</div>
                                    </div>
                                    <div style="width:35%">
                                        <div>同比：{{ item.yssb }}%</div>
                                        <div>同比：{{ item.zxsb }}%</div>
                                    </div>
                                    <div :id="'tuli-3-' + index" style="height:100%"></div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>

                    <div class="border-light-left"></div>
                    <div class="border-light-right"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            firstBox: {},
            LBTbox: [{ name: '年初预算' }, { name: '预算调整' }, { name: '预算执行' }, { name: '决        算' }], //左下角上部分表格
            LBBbox: [], //左下角表格
            CBbox: [], //中下表格
            RTTbox: {
                total: 0,
                percent: 0
            },
            RBbox: [{ name: ' 因公出国（境）费用' }, { name: ' 公务用车购置及运行费' }, { name: '公务接待费' }],
            CTbox: [
                { name: '一般公共预算', tabindex: 0, sr: {}, zc: {} },
                { name: '政府性基金预算', tabindex: 0, sr: {}, zc: {} },
                { name: '国有资本经营预算', tabindex: 0, sr: {}, zc: {} },
                { name: '社会保险基金预算', tabindex: 0, sr: {}, zc: {} }
            ],
            curCarousel: 0
        }
    },
    created() {
        this.getfirstBox()
        this.getLBTbox()
        this.getLBBbox()
        this.getCBbox()
        this.getRTTbox()
        this.getCTbox()
        this.getRBbox()
    },
    mounted() {
        this.setFirstTuli()
        this.getrightBottom()
        this.getRTBbox()
    },
    methods: {
        getDate() {
            let dd = new Date()
            return dd.toLocaleDateString()
        },
        getfirstBox() {
            let that = this
            let params = {
                year: new Date().getFullYear()
            }
            this.$axios.get('cloud/entrance/querySHYJT', { params }).then(res => {
                if (res.data.code == 200) {
                    that.firstBox = res.data.data
                }
            })
        },
        setFirstTuli() {
            let that = this
            let params = {
                year: new Date().getFullYear()
            }
            this.$axios.get('cloud/entrance/querySHYJTable', { params }).then(res => {
                if (res.data.code == 200) {
                    let namelist = []
                    let blue = []
                    let red = []
                    res.data.data.forEach(element => {
                        if (
                            namelist.filter(key => {
                                return key == element.name
                            }).length <= 0
                        ) {
                            namelist.push(element.name)
                        }
                    })
                    res.data.data.forEach(element => {
                        namelist.forEach((key, index) => {
                            if (key == element.name) {
                                if (element.type == '未处理') {
                                    red[index] = element.value
                                } else {
                                    blue[index] = element.value
                                }
                            }
                        })
                    })
                    var chart = that.$echarts.init(document.getElementById('tuli-1'))
                    let option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        color: ['#FD5604', '#04BAFD'],
                        legend: {
                            right: 0,
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: namelist
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
                            }
                        ],
                        series: [
                            {
                                name: '未处理',
                                type: 'bar',
                                barWidth: 20,
                                stack: 'Search Engine',
                                emphasis: {
                                    focus: 'series'
                                },

                                data: red
                            },
                            {
                                name: '已处理',
                                type: 'bar',
                                stack: 'Search Engine',
                                emphasis: {
                                    focus: 'series'
                                },
                                data: blue
                            }
                        ]
                    }
                    chart.setOption(option)
                }
            })
        },
        getLBTbox() {
            let that = this
            let params = {
                year: new Date().getFullYear()
            }
            this.$axios.get('cloud/entrance/queryYSBZ', { params }).then(res => {
                if (res.data.code == 200) {
                    that.LBTbox[0] = Object.assign(that.LBTbox[0], res.data.data)
                }
            })
            this.$axios.get('cloud/entrance/queryYSTZ', { params }).then(res => {
                if (res.data.code == 200) {
                    that.LBTbox[1] = Object.assign(that.LBTbox[1], res.data.data)
                }
            })
            this.$axios.get('cloud/entrance/queryYSZX', { params }).then(res => {
                if (res.data.code == 200) {
                    that.LBTbox[2] = Object.assign(that.LBTbox[2], res.data.data)
                }
            })
            this.$axios.get('cloud/entrance/queryJS', { params }).then(res => {
                if (res.data.code == 200) {
                    that.LBTbox[3] = Object.assign(that.LBTbox[3], res.data.data)
                }
            })
        },
        getLBBbox() {
            let that = this
            let params = {
                year: new Date().getFullYear()
            }
            this.$axios.get('cloud/entrance/queryYJGZ', { params }).then(res => {
                if (res.data.code == 200) {
                    that.LBBbox = res.data.data
                }
            })
        },
        getCBbox() {
            let that = this
            let params = {
                year: new Date().getFullYear()
            }
            this.$axios.get('cloud/entrance/queryZCJD', { params }).then(res => {
                if (res.data.code == 200) {
                    that.CBbox = res.data.data
                }
            })
        },
        getRTTbox() {
            let that = this
            let params = {
                year: new Date().getFullYear()
            }
            this.$axios.get('cloud/entrance/queryJEZJ', { params }).then(res => {
                if (res.data.code == 200) {
                    that.RTTbox.total = res.data.data.value
                }
            })
            this.$axios.get('cloud/entrance/querrJEZJtb', { params }).then(res => {
                if (res.data.code == 200) {
                    that.RTTbox.percent = res.data.data.value
                }
            })
        },
        getCTbox() {
            let that = this
            this.CTbox.forEach((key, index) => {
                let params = {
                    queryName: key.name,
                    year: new Date().getFullYear()
                }
                that.$axios.get('cloud/entrance/queryYSZXDTSr', { params }).then(res => {
                    //收入
                    if (res.data.code == 200) {
                        that.CTbox[index].sr = Object.assign(that.CTbox[index].sr, res.data.data)
                    }
                })
                that.$axios.get('cloud/entrance//queryYSZXDTZc', { params }).then(res => {
                    //支出
                    if (res.data.code == 200) {
                        that.CTbox[index].zc = Object.assign(that.CTbox[index].zc, res.data.data)
                    }
                })
            })
        },
        getRBbox() {
            let that = this
            let params = {
                year: new Date().getFullYear()
            }
            this.$axios.get('cloud/entrance/queryYGCG', { params }).then(res => {
                if (res.data.code == 200) {
                    that.RBbox[0] = Object.assign(that.RBbox[0], res.data.data)
                }
            })
            this.$axios.get('cloud/entrance/queryGWYC', { params }).then(res => {
                if (res.data.code == 200) {
                    that.RBbox[1] = Object.assign(that.RBbox[1], res.data.data)
                }
            })
            this.$axios.get('cloud/entrance/queryGWJD', { params }).then(res => {
                if (res.data.code == 200) {
                    that.RBbox[2] = Object.assign(that.RBbox[2], res.data.data)
                }
            })
        },
        getRTBbox() {
            let that = this
            let params = {
                year: new Date().getFullYear()
            }
            this.$axios.get('cloud/entrance/queryZDZC', { params }).then(res => {
                if (res.data.code == 200) {
                    let namelist = []
                    let valuelist = []
                    res.data.data.forEach(element => {
                        namelist.push(element.name)
                        valuelist.push(element.value)
                    })
                    let chart = this.$echarts.init(document.getElementById('tuli-2'))

                    let option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        yAxis: [
                            {
                                type: 'category',
                                data: namelist,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        xAxis: [
                            {
                                type: 'value',
                                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
                            }
                        ],
                        series: [
                            {
                                name: 'Direct',
                                type: 'bar',
                                barWidth: '60%',
                                data: valuelist
                            }
                        ]
                    }
                    chart.setOption(option)
                }
            })
        },
        getrightBottom() {
            let that = this
            let params = {
                year: new Date().getFullYear()
            }
            this.$axios.get('cloud/entrance/queryYGCGhb', { params }).then(res => {
                if (res.data.code == 200) {
                    let chart = this.$echarts.init(document.getElementById('tuli-3-0'))
                    let option = {
                        color: ['RGBA(27, 251, 227, 1)', 'transparent'],
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            show: false,
                            bottom: '-3%',
                            left: '20%',
                            textStyle: {
                                color: '#FFF'
                            }
                        },
                        grid: {
                            left: '0%',
                            right: '0%',
                            bottom: '3%',
                            top: '5%',
                            containLabel: true
                        },
                        series: [
                            {
                                type: 'pie',
                                radius: ['70%', '80%'],
                                avoidLabelOverlap: false,
                                top: 0,
                                itemStyle: {
                                    borderRadius: '50%',
                                    borderColor: 'RGBA(27, 251, 227, 1)',
                                    borderWidth: 1
                                },
                                label: {
                                    show: false,
                                    formatter: '{d}%'
                                },
                                labelLine: {
                                    show: false,
                                    length: 35,
                                    lenght2: 35
                                },
                                data: [
                                    { name: '同比', value: res.data.data.value },
                                    {
                                        name: '',
                                        value: 100 - Number(res.data.data.value),
                                        itemStyle: {
                                            borderRadius: '50%',
                                            borderColor: 'rgba(29, 30, 34, 1)',
                                            borderWidth: 0
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'pie',
                                radius: ['70%', '80%'],
                                avoidLabelOverlap: false,
                                top: 0,
                                itemStyle: {
                                    borderRadius: '50%',
                                    borderColor: 'RGBA(30, 96, 172, 1)',
                                    borderWidth: 1
                                },
                                label: {
                                    show: true,
                                    formatter: '{d}%'
                                },
                                labelLine: {
                                    show: true,
                                    length: 35,
                                    lenght2: 35
                                },
                                data: []
                            }
                        ]
                    }

                    chart.setOption(option)
                }
            })
            this.$axios.get('cloud/entrance/queryGWYChb', { params }).then(res => {
                if (res.data.code == 200) {
                    let chart = this.$echarts.init(document.getElementById('tuli-3-1'))
                    let option = {
                        color: ['RGBA(27, 251, 227, 1)', 'transparent'],
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            show: false,
                            bottom: '-3%',
                            left: '20%',
                            textStyle: {
                                color: '#FFF'
                            }
                        },
                        grid: {
                            left: '0%',
                            right: '0%',
                            bottom: '3%',
                            top: '5%',
                            containLabel: true
                        },
                        series: [
                            {
                                type: 'pie',
                                radius: ['70%', '80%'],
                                avoidLabelOverlap: false,
                                top: 0,
                                itemStyle: {
                                    borderRadius: '50%',
                                    borderColor: 'RGBA(27, 251, 227, 1)',
                                    borderWidth: 1
                                },
                                label: {
                                    show: false,
                                    formatter: '{d}%'
                                },
                                labelLine: {
                                    show: false,
                                    length: 35,
                                    lenght2: 35
                                },
                                data: [
                                    { name: '同比', value: res.data.data.value },
                                    {
                                        name: '',
                                        value: 100 - Number(res.data.data.value),
                                        itemStyle: {
                                            borderRadius: '50%',
                                            borderColor: 'rgba(29, 30, 34, 1)',
                                            borderWidth: 0
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'pie',
                                radius: ['70%', '80%'],
                                avoidLabelOverlap: false,
                                top: 0,
                                itemStyle: {
                                    borderRadius: '50%',
                                    borderColor: 'RGBA(30, 96, 172, 1)',
                                    borderWidth: 1
                                },
                                label: {
                                    show: true,
                                    formatter: '{d}%'
                                },
                                labelLine: {
                                    show: true,
                                    length: 35,
                                    lenght2: 35
                                },
                                data: []
                            }
                        ]
                    }

                    chart.setOption(option)
                }
            })
            this.$axios.get('cloud/entrance/queryGWJDhb', { params }).then(res => {
                if (res.data.code == 200) {
                    let chart = this.$echarts.init(document.getElementById('tuli-3-2'))
                    let option = {
                        color: ['RGBA(27, 251, 227, 1)', 'transparent'],
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            show: false,
                            bottom: '-3%',
                            left: '20%',
                            textStyle: {
                                color: '#FFF'
                            }
                        },
                        grid: {
                            left: '0%',
                            right: '0%',
                            bottom: '3%',
                            top: '5%',
                            containLabel: true
                        },
                        series: [
                            {
                                type: 'pie',
                                radius: ['70%', '80%'],
                                avoidLabelOverlap: false,
                                top: 0,
                                itemStyle: {
                                    borderRadius: '50%',
                                    borderColor: 'RGBA(27, 251, 227, 1)',
                                    borderWidth: 1
                                },
                                label: {
                                    show: false,
                                    formatter: '{d}%'
                                },
                                labelLine: {
                                    show: false,
                                    length: 35,
                                    lenght2: 35
                                },
                                data: [
                                    { name: '同比', value: res.data.data.value },
                                    {
                                        name: '',
                                        value: 100 - Number(res.data.data.value),
                                        itemStyle: {
                                            borderRadius: '50%',
                                            borderColor: 'rgba(29, 30, 34, 1)',
                                            borderWidth: 0
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'pie',
                                radius: ['70%', '80%'],
                                avoidLabelOverlap: false,
                                top: 0,
                                itemStyle: {
                                    borderRadius: '50%',
                                    borderColor: 'RGBA(30, 96, 172, 1)',
                                    borderWidth: 1
                                },
                                label: {
                                    show: true,
                                    formatter: '{d}%'
                                },
                                labelLine: {
                                    show: true,
                                    length: 35,
                                    lenght2: 35
                                },
                                data: []
                            }
                        ]
                    }

                    chart.setOption(option)
                }
            })
        },
        changeCTtab(data1, data2) {
            this.CTbox[data1].tabindex = data2
        },
        changeCarousel(e) {
            this.curCarousel = e
        }
    }
}
</script>
<style scoped>
::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
::-webkit-scrollbar-thumb {
    width: 0px;
    background: #ccc;
}
::-webkit-scrollbar-track {
    width: 0px;
    background: #eee;
}
::v-deep .el-scrollbar__wrap {
    overflow-x: hidden !important;
}
::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
::-webkit-scrollbar-thumb {
    width: 0px;
    background: #ccc;
}
.preview-container {
    /* height: 100%; */
    width: 100%;
    min-width: 1690px;
    min-height: 820px;
    background-image: url('../../../assets/rd/dapin-back.png');
    background-size: cover;
    background-repeat: no-repeat;
}
.preview-container * {
    box-sizing: border-box;
}
.head-box {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
}
.head-box :first-child {
    font-size: 36px;
    font-family: Source Han Serif CN;
    font-weight: bold;
    color: #ffffff;
}
.head-box :last-child {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
}
.preview-dody {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    height: calc(100% - 90px);
}
.preview-dody-center {
    width: 40%;
    position: relative;
}
.preview-dody-left,
.preview-dody-right {
    width: 30%;
    height: 100%;
}
.theme-border-box {
    background: #022956;
    border: 2px solid #07458c;
    margin: 10px;
    position: relative;
}
.border-light-left {
    position: absolute;
    left: -2px;
    top: -2px;
    border-left: 2px solid #52e8ed;
    border-top: 2px solid #52e8ed;
    border-bottom: 0px solid #52e8ed;
    border-right: 0px solid #52e8ed;
    height: 22px;
    width: 22px;
}
.border-light-right {
    position: absolute;
    right: -2px;
    bottom: -2px;
    border-left: 0px solid #52e8ed;
    border-top: 0px solid #52e8ed;
    border-bottom: 2px solid #52e8ed;
    border-right: 2px solid #52e8ed;
    height: 22px;
    width: 22px;
}
.blue-title {
    height: 44px;
    background: linear-gradient(90deg, #075292, rgba(2, 41, 86, 0));
    font-size: 18px;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
}
.detail-box {
    padding: 24px;
}
.first-box-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.first-box-bg-blue {
    width: calc((100% - 10px) / 2);
    height: 92px;
    text-align: center;
    background-image: url('../../../assets/rd/back-blue.png');
    background-size: cover;
    background-repeat: no-repeat;
}
.first-box-bg-purple {
    width: calc((100% - 10px) / 2);
    height: 92px;
    text-align: center;
    background-image: url('../../../assets/rd/back-purple.png');
    background-size: cover;
    background-repeat: no-repeat;
}
.first-box-bg-purple :first-child,
.first-box-bg-blue :first-child {
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;
    line-height: 41px;
    margin-top: 13px;
}
.first-box-bg-purple :last-child,
.first-box-bg-blue :last-child {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    line-height: 27px;
}
.warm-list-item-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
    height: 48px;
    background: #033165;
    margin: 2px 0;
}
.warm-list-item-box .white-text {
    width: 40%;
    padding-left: 18px;
}
.warm-list-item-box .green-text {
    font-size: 14px;
    font-weight: 500;
    color: #1adc4a;
    width: 15%;
    text-align: center;
}
.warm-list-item-box .red-text {
    font-size: 14px;
    font-weight: 500;
    color: #fb3227;
    width: 15%;
    text-align: center;
}
.warm-list-item-box .orange-text {
    font-size: 14px;
    font-weight: 500;
    color: #fd7512;
    width: 15%;
    text-align: center;
}
.warm-list-item-box .yellow-text {
    font-size: 14px;
    font-weight: 500;
    color: #fdc504;
    width: 15%;
    text-align: center;
}
.custom-table-class .table-head {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #0157a1;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    border: none;
    height: 36px;
}
.center-custom-table .table-head {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    border: none;
    height: 36px;
}
.center-custom-table .table-body,
.custom-table-class .table-body {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #033165;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    min-height: 36px;
}
.custom-table-class /deep/ .el-table {
    border-radius: 0;
    background: transparent !important;
    border: none !important;
    color: #fff;
}
.custom-table-class /deep/ .el-table tr {
    border-radius: 0;
    background: transparent !important;
    border: none !important;
    color: #fff !important;
}

.custom-table-class /deep/ .el-table::before {
    background: transparent !important;
}
.custom-table-class /deep/ .el-table__header-wrapper th {
    background: #0157a1 !important;
    font-size: 14px !important;
    color: #ffffff !important;
    text-align: center !important;
    border: none;
}
.custom-table-class /deep/ .el-table__body-wrapper {
    background: #033165 !important;
    font-size: 14px !important;
    color: #ffffff !important;
    text-align: center !important;
}
.center-first-title {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    line-height: 50px;
    text-align: center;
    margin-bottom: 40px;
}
.center-tab-box {
    width: 614px;
    margin: 0 auto;
}
.center-flex-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.cur-tab {
    width: 49.5%;
    height: 44px;
    background: linear-gradient(-90deg, #075292, #318dfa);
    border-radius: 10px 10px 0px 0px;
    font-size: 18px;
    font-weight: 500;
    color: #ffffff;
    line-height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
}
.default-tab {
    width: 49.5%;
    height: 44px;
    background: linear-gradient(90deg, #075292, rgba(2, 41, 86, 0));
    border-radius: 10px 10px 0px 0px;
    font-size: 18px;
    font-weight: 500;
    color: #ffffff;
    line-height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
}
.cur-tab :last-child,
.default-tab :last-child {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
}
.tab-content {
    /* height: 165px; */
    background: #022956;
    border: 2px solid #07458c;
    border-radius: 0px 0px 4px 4px;
    padding: 16px;
    color: #fff;
}
.srzc-list-item-box {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 48px;
    background: #033165;
    margin: 2px 0;
}
.center-img {
    width: 614px;
    margin: 0 auto;
    background-image: url('../../../assets/rd/center-img.png');
    background-position-y: calc(100% - 28px);
    background-position-x: center;
    background-repeat: no-repeat;
    background-size: 606px 280px;
}
.center-img-text {
    width: 606px;
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
    position: absolute;
    top: 350px;
}
.center-bottom-box {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin: 10px 0;
}
.center-custom-table /deep/ .el-table {
    border-radius: 0;
    background: #022956 !important;
    border: none !important;
}
.center-custom-table /deep/ .el-table::before {
    background: #022956 !important;
}
.center-custom-table /deep/ .el-table__header-wrapper th {
    background: #022956 !important;
    font-size: 14px !important;
    color: #ffffff !important;
    text-align: center !important;
    border: none;
}
.center-custom-table /deep/ .el-table__body-wrapper {
    background: #033165 !important;
    font-size: 14px !important;
    color: #ffffff !important;
    text-align: center !important;
}
.right-box-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -20px;
}
.right-box-flex-item {
    width: 48%;
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    color: #18e7fa;
    line-height: 74px;
}
.right-box-flex-item-bottom {
    height: 44px;
    background: #033b6f;
    border: 2px solid;
    border-image: linear-gradient(90deg, #07458c, #28ded8, #07458c) 2 2;
    border-radius: 2px;
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
    line-height: 44px;
}
.right-last-box-item {
    width: 100%;
    height: 119px;
    background: #033165;
    border: 2px solid #07458c;
    border-radius: 0px 0px 4px 4px;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
    line-height: 37px;
}
.right-last-box-item > div {
    width: 33%;
}
</style>
