<template>
    <div class="dpzs-page">
        <div class="head-box">国有资产运营数字化管理平台</div>
        <div class="content-box">
            <div class="left-box">
                <div class="solid-border ">
                    <div class="solid-img left-top-box">
                        <div class="bg-title">合同签订分析</div>
                        <div class="bottom-title"></div>
                        <div id="tubiao-1" style="height:380px;width:calc(100%+40px);margin:0 -20px"></div>
                    </div>
                </div>
                <div class="solid-border mt10">
                    <div class="solid-img  left-bottom-box">
                        <div class="bg-title">合同签订分析</div>
                        <div class="bottom-title"></div>
                        <div id="tubiao-2" style="height:380px;width:calc(100%+40px);margin:0 -20px"></div>
                    </div>
                </div>
            </div>
            <div class="center-box">
                <div id="container" style="height: calc(100% - 355px);"></div>
                <div class="solid-border">
                    <div class="solid-img center-bottom-box">
                        <div class="bg-title">资产累计数量</div>
                        <div class="bottom-title"></div>
                        <div>
                            <div class="cbt-box">
                                <div
                                    class="cbt-item"
                                    v-for="item in cbObj.numberStr"
                                    :key="item"
                                    :style="
                                        cbObj.numberStr.length > 5
                                            ? 'width:' +
                                              (777 / cbObj.numberStr.length - 20) +
                                              'px;height:' +
                                              (777 / cbObj.numberStr.length - 20) +
                                              'px;line-height:' +
                                              (777 / cbObj.numberStr.length - 20) +
                                              'px;font-size:' +
                                              ((777 / cbObj.numberStr.length - 20) / 118) * 72 +
                                              'px;'
                                            : ''
                                    "
                                >
                                    {{ item }}
                                </div>
                            </div>
                            <div class="cbb-box">
                                <div class="cbb-item">
                                    <div>总面积（㎡）</div>
                                    <div>{{ cbObj.totalBuilArea }}</div>
                                </div>
                                <div class="cbb-item cbb-border-item">
                                    <div>出租率</div>
                                    <div>{{ cbObj.rentRate }}</div>
                                </div>
                                <div class="cbb-item">
                                    <div>空置率</div>
                                    <div>{{ cbObj.freeRate }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-box">
                <div class="solid-border ">
                    <div class="solid-img right-top-box">
                        <div class="bg-title">财务数据分析</div>
                        <div class="bottom-title"></div>
                        <div class="right-subtitle">
                            <div>
                                <div class="title-line-bg"></div>
                                本年收款总额
                            </div>
                            <div
                                style="
font-size: 14px;font-weight:400"
                            >
                                <div style="display:inline-block">
                                    <div
                                        style="width: 16px;
                                        height: 8px;
                                        background: #00F2F4;
                                        border-radius: 4px;display:inline-block;margin:4px "
                                    ></div>
                                    本年&nbsp;&nbsp;
                                </div>
                                <div style="display:inline-block">
                                    <div
                                        style="width: 16px;
                                        height: 8px;
                                        background: #6884FC;
                                        border-radius: 4px;display:inline-block;margin:4px "
                                    ></div>
                                    去年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单位：万元
                                </div>
                            </div>
                        </div>
                        <div id="tubiao-3" style="height:230px;width:100%;margin: -20px"></div>
                        <div class="right-top-center-box">
                            <div class="right-top-center-item">
                                <div
                                    style="font-size: 24px;
font-weight: bold;
color: #04E7EF;"
                                >
                                    {{ rtrObj.total }}
                                </div>
                                <div>收款总额(万元)</div>
                            </div>
                            <div class="right-top-center-item">
                                <div>
                                    环比：{{ rtrObj.hb }}%
                                    <i class="el-icon-caret-bottom" style="color:red" v-if="rtrObj.hb < 0" />
                                    <i class="el-icon-caret-top" style="color:#00ff00" v-if="rtrObj.hb > 0" />
                                </div>
                                <div>
                                    同比：{{ rtrObj.tb }}%
                                    <i class="el-icon-caret-bottom" style="color:red" v-if="rtrObj.tb < 0" />
                                    <i class="el-icon-caret-top" style="color:#00ff00" v-if="rtrObj.tb > 0" />
                                </div>
                            </div>
                        </div>
                        <div class="right-subtitle">
                            <div>
                                <div class="title-line-bg"></div>
                                收款结构分析
                            </div>
                        </div>
                        <div id="tubiao-4" style="height:230px;width:100%;margin: -30px 0 -10px 0"></div>
                    </div>
                </div>
                <div class="solid-border mt10">
                    <div class="solid-img right-bottom-box">
                        <div class="bg-title">合同签订分析</div>
                        <div class="bottom-title"></div>
                        <div id="tubiao-5" style="height:240px;width:calc(100%+20px);margin:0 -20px"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import paths from './yonganMap.js'
import mapp from './yongan.js'
let map
let area
export default {
    data() {
        return {
            myChartlt: undefined,
            myChartlb: undefined,
            myChartrt: undefined,
            myChartrb: undefined,
            myChartrc: undefined,
            myChartmap: undefined,
            year: null,
            cbObj: {},
            rtrObj: {}
        }
    },
    created() {
        let dd = new Date()
        this.year = dd.getFullYear()
    },
    mounted() {
        this.getLTbox()
        // this.getCTbox()
        this.getLBbox()
        this.getRBbox()
        this.getRCbox()
        this.getRTbox()
        this.getmap()
        this.getCBbox()
    },
    methods: {
        getCBbox() {
            this.$axios.get('cloud/entrance/assetsAccumulative?year=' + this.year).then(res => {
                if (res.data.code == 200) {
                    this.cbObj = res.data.data[0]
                    this.cbObj.numberStr = res.data.data[0].num.toString()
                }
            })
        },
        getRTbox() {
            let that = this
            this.$axios.get('cloud/entrance/financialDataAnalysis?year=' + this.year).then(res => {
                if (res.data.code == 200) {
                    let list1 = []
                    let list2 = []
                    let ctotal = 0
                    let ltotal = 0
                    res.data.data.currentYearList.forEach(key => {
                        list1.push(key.totalAmount / 10000)
                        ctotal += key.totalAmount / 10000
                    })
                    res.data.data.lastYearList.forEach(key => {
                        list2.push(key.totalAmount / 10000)
                        ltotal += key.totalAmount / 10000
                    })
                    let dd = new Date()
                    let mm = dd.getMonth()
                    //环比计算：当前月/当年收款总金额   -（减）上个月/当年收款总金额，得到的百分比结果。
                    // 同比计算：当前月/当年收款总金额   -（减）去年的当月/去年收款总金额，得到的百分比结果。
                    that.rtrObj = {
                        total: Number(ctotal.toFixed(2)),
                        tb:
                            Number(
                                (
                                    (list1[mm] == 0 ? 0 : list1[mm] / ctotal) -
                                    (list2[mm] == 0 ? 0 : list2[mm] / ltotal)
                                ).toFixed(2)
                            ) * 100,
                        hb:
                            Number(
                                (
                                    (list1[mm] == 0 ? 0 : list1[mm] / ctotal) -
                                    (list2[mm] == 0 ? 0 : list2[mm] / ctotal)
                                ).toFixed(2)
                            ) * 100
                    }
                    that.myChartrt = that.$echarts.init(document.getElementById('tubiao-3'))
                    var option = {
                        color: ['#00F2F4', '#6884FC'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
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
                                boundaryGap: false,
                                data: [
                                    '1月',
                                    '2月',
                                    '3月',
                                    '4月',
                                    '5月',
                                    '6月',
                                    '7月',
                                    '8月',
                                    '9月',
                                    '10月',
                                    '11月',
                                    '12月'
                                ],
                                axisLabel: {
                                    color: '#7785B3'
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
                                axisLabel: {
                                    color: '#fff'
                                }
                            }
                        ],
                        series: [
                            {
                                name: '本年',
                                type: 'line',
                                smooth: true,
                                showSymbol: false,
                                emphasis: {
                                    focus: 'series'
                                },
                                areaStyle: {},
                                data: list1
                            },
                            {
                                name: '去年',
                                type: 'line',
                                smooth: true,
                                showSymbol: false,
                                emphasis: {
                                    focus: 'series'
                                },
                                areaStyle: {},

                                data: list2
                            }
                        ]
                    }
                    that.myChartrt.setOption(option)
                }
            })
        },
        getRCbox() {
            let that = this
            this.$axios.get('cloud/entrance/receiptStructureAnalysis?year=' + this.year).then(res => {
                if (res.data.code == 200) {
                    let obj = res.data.data[0]
                    let strlist = ['房租', '保证金', '电费', '燃气费', '水费', '押金', '其他费用']
                    let list = []
                    strlist.forEach(key => {
                        switch (key) {
                            case '房租':
                                {
                                    list.push(obj.houseRentRate)
                                }
                                break
                            case '保证金':
                                {
                                    list.push(obj.depositRate)
                                }
                                break
                            case '电费':
                                {
                                    list.push(obj.energyRate)
                                }
                                break
                            case '燃气费':
                                {
                                    list.push(obj.fuelRate)
                                }
                                break
                            case '水费':
                                {
                                    list.push(obj.waterRate)
                                }
                                break
                            case '押金':
                                {
                                    list.push(obj.securityFundRate)
                                }
                                break
                            case '其他费用':
                                {
                                    list.push(obj.otherRate)
                                }
                                break
                        }
                    })
                    that.myChartrc = that.$echarts.init(document.getElementById('tubiao-4'))

                    var option = {
                        tooltip: {},
                        yAxis: [
                            {
                                type: 'category',
                                data: ['房租', '保证金', '电费', '燃气费', '水费', '押金', '其他费用'],
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel: {
                                    inside: false,
                                    color: '#fff',
                                    interval: 0
                                },
                                axisTick: {
                                    show: false
                                },
                                nameTextStyle: {
                                    fontSize: 16,
                                    lineHeight: 20
                                }
                            }
                        ],
                        xAxis: [
                            {
                                type: 'value',
                                name: '百分比',
                                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
                                min: 0,
                                axisLabel: {
                                    color: '#7785B3'
                                }
                            }
                        ],
                        series: [
                            {
                                name: '金额',
                                type: 'bar',
                                symbol: 'triangle',
                                itemStyle: {
                                    color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: '#01EFF2 ' },
                                        { offset: 1, color: '#6884FC' }
                                    ]),
                                    borderRadius: 5
                                },

                                barCategoryGap: '50%',
                                tooltip: {
                                    valueFormatter: function(value) {
                                        return value + '%'
                                    }
                                },
                                data: list
                            }
                        ]
                    }
                    that.myChartrc.setOption(option)
                }
            })
        },
        getRBbox() {
            let that = this
            this.$axios.get('cloud/entrance/receivableBillAnalysis').then(res => {
                if (res.data.code == 200) {
                    let xlist = []
                    let datalist = []
                    res.data.data.forEach(key => {
                        let mflaglist = key.months.split('-')
                        switch (mflaglist[1]) {
                            case '01':
                                {
                                    xlist.push('1月')
                                }
                                break
                            case '02':
                                {
                                    xlist.push('2月')
                                }
                                break
                            case '03':
                                {
                                    xlist.push('3月')
                                }
                                break
                            case '04':
                                {
                                    xlist.push('4月')
                                }
                                break
                            case '05':
                                {
                                    xlist.push('5月')
                                }
                                break
                            case '06':
                                {
                                    xlist.push('6月')
                                }
                                break
                            case '07':
                                {
                                    xlist.push('7月')
                                }
                                break
                            case '08':
                                {
                                    xlist.push('8月')
                                }
                                break
                            case '09':
                                {
                                    xlist.push('9月')
                                }
                                break
                            case '10':
                                {
                                    xlist.push('10月')
                                }
                                break
                            case '11':
                                {
                                    xlist.push('11月')
                                }
                                break
                            case '12':
                                {
                                    xlist.push('12月')
                                }
                                break
                        }
                        datalist.push(key.totalAmount / 10000)
                    })
                    that.myChartrb = that.$echarts.init(document.getElementById('tubiao-5'))
                    var option = {
                        tooltip: {},
                        xAxis: [
                            {
                                type: 'category',
                                data: xlist,
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel: {
                                    color: '#7785B3'
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '单位/万元',
                                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
                                axisLabel: {
                                    color: '#fff'
                                }
                            }
                        ],
                        series: [
                            {
                                name: '金额',
                                type: 'bar',
                                symbol: 'triangle',
                                itemStyle: {
                                    color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: '#01EFF2 ' },
                                        { offset: 1, color: '#6884FC' }
                                    ])
                                },
                                data: datalist
                            }
                        ]
                    }
                    that.myChartrb.setOption(option)
                }
            })
        },
        getLBbox() {
            let that = this
            this.$axios.get('cloud/entrance/assetsTypeAnalysis').then(res => {
                if (res.data.code == 200) {
                    let list = []
                    let list2 = []
                    res.data.data.forEach(key => {
                        list.push({ name: key.name, value: key.num })
                    })
                    that.myChartlb = that.$echarts.init(document.getElementById('tubiao-2'))

                    var option = {
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            bottom: '0%',
                            left: 'center',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        series: [
                            {
                                name: 'Access From',
                                type: 'pie',
                                radius: ['40%', '55%'],
                                avoidLabelOverlap: false,
                                labelLine: {
                                    show: true
                                },
                                tooltip: '{d}%',
                                data: list
                            }
                        ]
                    }
                    that.myChartlb.setOption(option)
                }
            })
        },
        getLTbox() {
            let that = this
            this.$axios.get('cloud/entrance/contractSignAnalysis?year=' + this.year).then(res => {
                if (res.data.code == 200) {
                    let list1 = []
                    let list2 = []
                    res.data.data.forEach(key => {
                        list1.push(key.totalExpectAmount / 10000)
                        list2.push(key.num)
                    })
                    that.myChartlt = that.$echarts.init(document.getElementById('tubiao-1'))

                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: [
                                    '1月',
                                    '2月',
                                    '3月',
                                    '4月',
                                    '5月',
                                    '6月',
                                    '7月',
                                    '8月',
                                    '9月',
                                    '10月',
                                    '11月',
                                    '12月'
                                ],
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel: {
                                    color: '#7785B3'
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '单位/万元',
                                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
                                axisLabel: {
                                    color: '#fff'
                                },
                                nameTextStyle: {
                                    color: '#fff'
                                }
                            },
                            {
                                type: 'value',
                                name: '份',
                                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
                                axisLabel: {
                                    color: '#fff'
                                },
                                nameTextStyle: {
                                    color: '#fff'
                                }
                            }
                        ],
                        series: [
                            {
                                name: '金额',
                                type: 'pictorialBar',
                                symbol: 'triangle',
                                itemStyle: {
                                    color: '#00FFFF'
                                },
                                tooltip: {
                                    valueFormatter: function(value) {
                                        return value + '万元'
                                    }
                                },
                                data: list1
                            },
                            {
                                name: '数量',
                                type: 'line',
                                yAxisIndex: 1,
                                itemStyle: {
                                    color: '#F5C91A'
                                },
                                tooltip: {
                                    valueFormatter: function(value) {
                                        return value + '万元'
                                    }
                                },
                                data: list2
                            }
                        ]
                    }
                    that.myChartlt.setOption(option)
                }
            })
        },
        // getCTbox() {
        //     let path0 = [
        //         new TMap.LatLng(-90, 180),
        //         new TMap.LatLng(-90, -180),
        //         new TMap.LatLng(90, -180),
        //         new TMap.LatLng(90, 180)
        //     ]

        //     let path1 = []
        //     paths.paths.forEach(element => {
        //         path1.push(new TMap.LatLng(element[1], element[0]))
        //     })
        //     map = new TMap.Map(document.getElementById('container'), {
        //         center: new TMap.LatLng(25.94136, 117.36517), //设置地图中心点坐标
        //         zoom: 10, //设置地图缩放级别
        //         viewMode: '3D',
        //         disableDefaultUI: true,
        //         baseMap: {
        //             //设置底图样式
        //             type: 'vector', //设置底图为矢量底图
        //             features: [
        //                 //设置矢量底图要素类型
        //                 'base',
        //                 'point'
        //             ]
        //         },
        //         renderOptions: {
        //             enableBloom: true // 是否启用泛光效果 注：为true才会有效果
        //         }
        //     })
        //     map.enableAreaClip({ paths: path1 })
        //     map.enableAreaHighlight({
        //         paths: path1,
        //         highlightColor: 'rgba(0,0,0,0)', // 高亮颜色
        //         shadeColor: '#132356' // 其余阴影部分
        //     })
        //     var polygon = new TMap.MultiPolyline({
        //         id: 'polygon-layer', //图层id
        //         map: map, //设置多边形图层显示到哪个地图实例中
        //         //多边形样式
        //         styles: {
        //             Polyline: new TMap.PolylineStyle({
        //                 color: 'rgba(255,255,255,0)', //面填充色
        //                 showBorder: true, //是否显示拔起面的边线
        //                 borderColor: '#00FFFF', //边线颜色
        //                 enableBloom: true,
        //                 width: 8
        //             })
        //         },
        //         //多边形数据
        //         geometries: [
        //             {
        //                 id: 'p1', //该多边形在图层中的唯一标识（删除、更新数据时需要）
        //                 styleId: 'polygon', //绑定样式名
        //                 paths: path1 //多边形轮廓
        //             }
        //         ]
        //     })
        // },
        getmap() {
            let that = this
            this.$axios.get('cloud/entrance/areaAssetsAnalysis?areaCode=350481').then(res => {
                if (res.data.code == 200) {
                    var chartDom = document.getElementById('container')
                    that.myChartmap = this.$echarts.init(chartDom)
                    var option
                    // 以下倾斜地图
                    let jwd = [117.36517, 25.94136]
                    let deg = -0.4
                    let mapstr = mapp.map
                    let fea = mapstr.features.map((item, i) => {
                        let coo = item.geometry.coordinates.map((son, i) => {
                            return son.map((sub, ii) => {
                                return [
                                    (sub[0] - jwd[0]) * Math.cos(deg) - (sub[1] - jwd[1]) * Math.sin(deg) + jwd[0],
                                    (sub[0] - jwd[0]) * Math.sin(deg) + (sub[1] - jwd[1]) * Math.cos(deg) + jwd[1]
                                ]
                            })
                        })
                        return {
                            type: 'Feature',
                            properties: item.properties,
                            geometry: {
                                coordinates: coo,
                                type: 'Polygon'
                            }
                        }
                    })
                    let mm = {
                        type: 'FeatureCollection',
                        features: fea
                    }
                    this.$echarts.registerMap('YA', mm)

                    option = {
                        title: {
                            text: ''
                        },
                        tooltip: {
                            trigger: 'item',
                            triggerOn: 'mousemove',
                            backgroundColor: 'rgba(8, 19, 51, 0.9)',
                            shadowColor: 'rgba(0,0,0,0.3)',
                            textStyle: {
                                color: '#fff'
                            },
                            borderColor: 'rgba(0,0,0,0.1)'
                        },
                        geo: {
                            map: 'YA',
                            zoom: 1.15,
                            center: [117.36517, 25.94136],
                            itemStyle: {
                                borderColor: '#081333',
                                areaColor: '#081333'
                            },
                            label: {
                                show: false,
                                color: '#fff'
                            },
                            tooltip: {
                                show: false
                            },
                            emphasis: { disabled: true }
                        },
                        series: [
                            {
                                name: '永安县区地图',
                                type: 'map',
                                map: 'YA',
                                id: 'ya',
                                label: {
                                    show: true,
                                    color: '#fff'
                                },
                                zoom: 1.15,
                                itemStyle: {
                                    borderColor: '#00FFFF',
                                    areaColor: '#0B9EFC'
                                },
                                tooltip: {
                                    formatter: function(item) {
                                        return (
                                            (item.data && item.data.name ? item.data.name : '') +
                                            '<br/>空置数量:' +
                                            (item.data && item.data.freeNum ? item.data.freeNum : 0) +
                                            '<br/>出租数量:' +
                                            (item.data && item.data.rentNum ? item.data.rentNum : 0)
                                        )
                                    }
                                },
                                data: res.data.data
                            }
                            // {
                            //     type: 'effectScatter',
                            //     coordinateSystem: 'geo',
                            //     data: [
                            //         { name: 'Alabama', value: [117.34517, 25.89136] },
                            //         { name: 'Alab', value: [117.370911, 25.971853] }
                            //     ],
                            //     z: 100,
                            //     encode: {
                            //         value: 2
                            //     },
                            //     symbol: 'circle',
                            //     showEffectOn: 'render',
                            //     label: {
                            //         formatter: res => {
                            //             console.log(res)
                            //             return 1
                            //         },
                            //         position: 'center',
                            //         show: false
                            //     },
                            //     itemStyle: {
                            //         color: 'red'
                            //     },
                            //     emphasis: {
                            //         show: false
                            //     }
                            // }
                        ]
                    }

                    that.myChartmap.setOption(option)
                }
            })
        }
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}
.dpzs-page {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('https://zcyy-157-9000.jcaiwu.com/sea-oss/8b4723b1d3229a0c4a1f42c092b108e1.png');
    width: 100vw;
    height: 100vh;
}
.head-box {
    width: 100%;
    height: 90px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('https://zcyy-157-9000.jcaiwu.com/sea-oss/ad5a599a56a169f305f245169b1b3789.png');
    font-size: 36px;
    font-weight: 400;
    color: #ffffff;
    line-height: 90px;
    text-align: center;
}
.content-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: calc(100% - 65px);
    margin-top: -25px;
    padding: 0 25px;
}
.solid-border {
    width: 100%;
    background: rgba(8, 19, 51, 0.9);
    border-radius: 8px;
    overflow: hidden;
}
.solid-img {
    width: 100%;
    border: 2px solid;
    border-image: linear-gradient(0deg, #102058, #01dbfb, #102058) 2 2;
}
.bg-title {
    background-repeat: no-repeat;
    background-image: url('https://zcyy-157-9000.jcaiwu.com/sea-oss/8442ec2ddad612ce7436398e8afe7b16.png');
    background-size: content;
    background-position-y: center;
    font-size: 24px;
    font-weight: 400;
    color: #ffffff;
    line-height: 24px;
    text-align: center;
    width: 349px;
    margin: 0 auto;
    padding: 13px 0;
}
.bottom-title {
    width: 89px;
    height: 3px;
    background-repeat: no-repeat;
    background-image: url('https://zcyy-157-9000.jcaiwu.com/sea-oss/bd2c4df410b975f679420cf39ba2d675.png');
    background-size: cover;
    margin: 0 auto;
}
.left-box {
    width: calc((100vw - 80px) * 0.3);
}
.left-top-box {
    padding: 30px 20px 0 20px;
}
.left-bottom-box {
    padding: 30px 20px;
}
.center-box {
    width: calc((100vw - 80px) * 0.4);
    height: 100%;
}
.center-bottom-box {
    padding: 15px 20px;
}
.cbt-box {
    min-width: 777px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0 20px 0;
    height: 118px;
}
.cbt-item {
    height: 118px;
    width: 118px;
    background-image: url('https://zcyy-157-9000.jcaiwu.com/sea-oss/2cec28264cdaced97ce7b142b5696100.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    text-align: center;
    line-height: 118px;
    font-size: 72px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #01f0f3;
    margin: 0 10px;
}
.cbb-box {
    width: 652px;
    height: 100px;
    background: #132356;
    border: 2px solid;
    border-image: linear-gradient(0deg, #102058, #01dbfb, #102058) 2 2;
    border-radius: 4px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.cbb-item {
    width: 33%;
    height: 66px;
    text-align: center;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 30px;
}
.cbb-border-item {
    border-left: 2px solid #23387a;
    border-right: 2px solid #23387a;
}
.cbb-item :last-child {
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #04e7ef;
    line-height: 36px;
}
.right-box {
    width: calc((100vw - 80px) * 0.3);
}
.right-box {
}
.right-top-box {
    padding: 30px 20px 0 20px;
}
.right-subtitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 16px;
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    margin: 10px 0 0 0;
}
.right-top-center-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}
.right-top-center-item {
    width: 209px;
    height: 64px;
    background: #13235699;
    border: 2px solid;
    border-image: linear-gradient(0deg, #102058, #01dbfb, #102058) 2 2;
    border-radius: 4px;
    margin: 17px;
    text-align: center;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 24px;
    padding: 8px 0;
}
.title-line-bg {
    display: inline-block;
    width: 4px;
    height: 16px;
    background: linear-gradient(0deg, #0b9ffd, #094293);
    border-radius: 1px;
    margin-right: 5px;
}
.right-bottom-box {
    padding: 30px 20px 0 20px;
}
.mt10 {
    margin-top: 10px;
}
/deep/.rotate-circle,
/deep/.tmap-zoom-control,
/deep/.tmap-scale-control,
/deep/.logo-text,
/deep/a {
    display: none;
}
</style>
