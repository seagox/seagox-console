<template>
    <div>
        <div class="colorful-box">
            <div v-for="(items, indexs) in firstPart" :key="indexs" :class="'colorful-item-' + indexs">
                <div class="title">
                    {{ items.fundtypeName }}
                </div>
                <div class="colorful-flex-box">
                    <div>
                        <div>收入进度</div>
                        <el-tooltip effect="dark" placement="bottom">
                            <div slot="content">
                                <div>截止:{{ items.jzrq }}</div>
                                <div>收入:{{ items.srLj }}元</div>
                            </div>
                            <div class="colorful-percent-box" @click="pageJump(items.srUrl)">
                                <div class="percent-num">{{ items.srZb }}%</div>
                                <div class="percent-box">
                                    <div :style="'height:' + items.srZb + '%'"></div>
                                </div>
                            </div>
                        </el-tooltip>
                    </div>
                    <div>
                        <div>支出进度</div>
                        <el-tooltip effect="dark" placement="bottom">
                            <div slot="content">
                                <div>截止:{{ items.jzrq }}</div>
                                <div>支出:{{ items.zcLj }}元</div>
                            </div>
                            <div class="colorful-percent-box" @click="pageJump(items.zcUrl)">
                                <div class="percent-num">{{ items.zcZb }}%</div>
                                <div class="percent-box">
                                    <div :style="'height:' + items.zcZb + '%'"></div>
                                </div>
                            </div>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex">
            <div style="width: 66%">
                <div style="margin: 10px; position: relative">
                    <el-card :style="'height:350px'">
                        <div slot="header">
                            <span>部门预算执行动态</span>
                            <span
                                style="position: absolute; right: 20px; top: 20px; cursor: pointer; z-index: 100"
                                @click="pageJump('/reportList?id=122&title=支付明细')"
                                >更多</span
                            >
                        </div>
                        <div class="table-box" :style="'height:290px'" v-if="secondPart">
                            <div class="flex-between">
                                <div class="flex-between table-tips" :style="'background:' + curColor">
                                    <div style="color:#fff">截止日期</div>
                                    <div>{{ secondPart.jzrq }}</div>
                                </div>
                                <div class="flex-between table-tips" :style="'background:' + curColor">
                                    <div style="color:#fff">累计执行</div>
                                    <div>{{ secondPart.ljzxNum }}笔/{{ secondPart.ljzxMoney }}万元</div>
                                </div>
                            </div>
                            <div style="margin: 10px 0">
                                <el-table
									ref="table"
                                    :data="secondPart.list"
                                    stripe
                                    height="200"
                                    :row-style="{ background: curColor }"
                                    :header-row-style="{ background: curColor, color: '#fff', 'font-size': '24px' }"
                                >
                                    <el-table-column
                                        v-for="(items, indexs) in tableConfig"
                                        :key="indexs"
                                        :prop="items.keyName"
                                        :label="items.title"
                                    >
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-card>
                </div>
                <div style="margin: 10px; position: relative">
                    <el-card :style="'height:450px'">
                        <div slot="header">
                            <span>审查工作动态</span>
                            <span
                                style="position: absolute; right: 20px; top: 20px; cursor: pointer; z-index: 100"
                                @click="pageJump('/runCode?path=scTask&title=审查任务')"
                                >更多</span
                            >
                        </div>

                        <div class="tabs-box" :style="'height:390px'">
                            <el-tabs v-model="thirdValue">
                                <el-tab-pane
                                    v-for="(items, indexs) in thirdPart"
                                    :key="indexs"
                                    :name="items.configName"
                                    :label="items.configName"
                                >
                                    <div class="tab-pane-div">
                                        <div class="tab-pane-item">
                                            <div class="flex-between">
                                                <div>审查工作：</div>
                                                <div>{{ items.year }}年</div>
                                            </div>
                                            <div>审查阶段：{{ items.detailName }}</div>
                                            <div>审查工作：{{ items.taskName }}</div>
                                            <div>
                                                审查人员：<br />专家：{{ items.zjNum }} / 代表：{{ items.dbNum }} /
                                                专委会：{{ items.zwhNum }}
                                            </div>
                                            <div style="display: flex; justify-content: space-between">
                                                审查分组：
                                                <div>
                                                    <div
                                                        :style="
                                                            'display:inline-block;height:10px;width:10px;background-color:' +
                                                            curColor
                                                        "
                                                    ></div>
                                                    已完成
                                                    <div
                                                        style="
                                                            display: inline-block;
                                                            height: 10px;
                                                            width: 10px;
                                                            background-color: #ebeef5;
                                                        "
                                                    ></div>
                                                    未完成
                                                </div>
                                            </div>
                                            <div style="display: flex; align-items: center">
                                                <div style="width: 80%">
                                                    <el-progress
                                                        :percentage="
                                                            items.xzTotalNum == 0
                                                                ? 100
                                                                : (items.xzWcNum / items.xzTotalNum) * 100
                                                        "
                                                        :color="curColor"
                                                    ></el-progress>
                                                </div>
                                                <div>共{{ items.xzTotalNum }}组</div>
                                            </div>
                                            <div>任务时间：</div>
                                            <div>
                                                <div
                                                    style="
                                                        display: inline-block;
                                                        height: 8px;
                                                        width: 8px;
                                                        border-radius: 4px;
                                                        background-color: #ff9933;
                                                    "
                                                ></div>
                                                实际开始时间:{{ items.sjStartTime }}
                                            </div>
                                            <div>
                                                <div
                                                    style="
                                                        display: inline-block;
                                                        height: 8px;
                                                        width: 8px;
                                                        border-radius: 4px;
                                                        background-color: #ffcc66;
                                                    "
                                                ></div>
                                                任务开始时间:{{ items.startTime }}
                                            </div>
                                        </div>
                                        <div class="tab-pane-item border-box">
                                            <div class="flex-between">
                                                <span>审查意见:</span
                                                ><span
                                                    style="cursor: pointer"
                                                    @click="
                                                        pageJump(
                                                            '/runCode?path=scOpinionInquiryCenter&title=审查意见查询'
                                                        )
                                                    "
                                                    >详情</span
                                                >
                                            </div>
                                            <div
                                                :id="'tubiao-1-' + indexs"
                                                style="width: 200px; height: 200px; margin: auto"
                                            ></div>
                                            <div
                                                style="
                                                    text-align: center;
                                                    width: 100%;
                                                    min-width: 200px;
                                                    position: relative;
                                                    top: -120px;
                                                "
                                            >
                                                {{ items.yjTotalNum }}<br />
                                                意见总数
                                            </div>
                                        </div>
                                        <div class="tab-pane-item">
                                            <div class="flex-between">
                                                <span>审查报告</span
                                                ><span
                                                    style="cursor: pointer"
                                                    @click="
                                                        pageJump('/runCode?path=getScReportFk&title=审查报告及反馈查询')
                                                    "
                                                    >详情</span
                                                >
                                            </div>
                                            <div :id="'tubiao-2-' + indexs" style="width: 200px; height: 200px"></div>
                                        </div>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-card>
                </div>
            </div>
            <div style="width: 33%; margin: 10px; position: relative">
                <el-card :style="'height:660px'">
                    <div slot="header">
                        <span>预警动态</span>
                        <!-- <span style="position: absolute; right: 20px; top: 20px; cursor: pointer; z-index: 100"
                            >更多</span
                        > -->
                    </div>

                    <div class="tabs-box" :style="'height:540px'">
                        <el-tabs v-model="fourthValue">
                            <el-tab-pane
                                v-for="(items, indexs) in fourthPart"
                                :key="indexs"
                                :name="items.title"
                                :label="items.title"
                            >
                                <div class="">
                                    <div style="font-size：14px;padding:15px 0;text-align:right">
                                        <span style="color: #da001c; font-size: 14px">•</span>严重&nbsp;&nbsp;
                                        <span style="color: #fb5f14; font-size: 14px">•</span>警告&nbsp;&nbsp;
                                        <span style="color: #ffc034; font-size: 14px">•</span>提示&nbsp;&nbsp;
                                    </div>
                                    <div></div>
                                    <el-table :data="items.list" :show-header="false">
                                        <el-table-column prop="name"></el-table-column>
                                        <el-table-column width="50">
                                            <template slot-scope="slot">
                                                <span style="color: #da001c; font-size: 14px">•</span
                                                >{{ slot.row.yzNum }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="50">
                                            <template slot-scope="slot">
                                                <span style="color: #fb5f14; font-size: 14px">•</span
                                                >{{ slot.row.jgNum }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="50">
                                            <template slot-scope="slot">
                                                <span style="color: #ffc034; font-size: 14px">•</span
                                                >{{ slot.row.tsNum }}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                        <div v-if="fivePart" style="padding: 15px 0">预警指标排行Top5</div>
                        <div v-if="fivePart" class="sub-list-box">
                            <div v-if="fivePart.length == 0">暂无数据</div>
                            <div v-else>
                                <div v-for="(item, index) in fivePart" :key="index">
                                    {{ item.name }}:{{ item.countNum }}
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableConfig: [
                { title: '单位名称', keyName: 'dwmc' },
                { title: '功能分类', keyName: 'gnfl' },
                { title: '支付方式', keyName: 'zffs' },
                { title: '支付金额', keyName: 'zfje' },
                { title: '支付时间', keyName: 'zfsj' }
            ],
            curColor: '',
            firstPart: undefined,
            secondPart: undefined,
            thirdPart: [],
            fourthPart: undefined,
            fivePart: undefined,
            thirdValue: undefined,
            fourthValue: undefined
        }
    },
    mounted() {
        this.curColor = localStorage.getItem('color')
        this.getbmyszxdt()
        this.getIndexSrOrZcInfoByZjxz()
        this.getIndexScWorkDt()
        this.getIndexYjInfo()
        this.getYjZbRank()
    },
    methods: {
        getbmyszxdt() {
            this.$axios.get('/cloud/entrance/getIndexBmysZxdt').then(res => {
                if (res.data.code == 200) {
                    this.secondPart = res.data.data
					this.$nextTick(_ => {
						this.infinitScroll()
					})
                }
            })
        },
		infinitScroll() {
      		// 拿到表格挂载后的真实DOM
      		const table = this.$refs.table
      		// 拿到表格中承载数据的div元素
      		const divData = table.bodyWrapper
      		divData.onmouseover = function () {
        		clearInterval(t)
      		} //鼠标移入，停止滚动
      		divData.onmouseout = function () {
        		start()
      		} //鼠标移出，继续滚动
 
      		// 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      		let t;
			function start() {
				// 数据少于表格高度停止滚动
				if (divData.clientHeight >= divData.scrollHeight){
					return
				}
				t = setInterval(() => {
					// 元素自增距离顶部1像素
					divData.scrollTop += 1
					// 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
					if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
						// 重置table距离顶部距离
						divData.scrollTop = 0
					}
				}, 100)
			}
			start()
		},
        getIndexSrOrZcInfoByZjxz() {
            let that = this
            this.$axios.get('/cloud/entrance/getIndexSrOrZcInfoByZjxz').then(res => {
                if (res.data.code == 200) {
                    that.firstPart = res.data.data
                    that.firstPart.forEach((key, index) => {
                        switch (index) {
                            case 0:
                                key.srUrl = '/reportList?id=71&title=全县一般公共预算收入完成情况表'
                                key.zcUrl = '/reportList?id=87&title=全县一般公共预算支出完成情况表'
                                break
                            case 1:
                                key.srUrl = '/reportList?id=75&title=全县政府性基金预算收入完成情况表'
                                key.zcUrl = '/reportList?id=76&title=全县政府性基金预算支出完成情况表'
                                break
                            case 2:
                                key.srUrl = '/reportList?id=79&title=全县国有资本经营预算收入完成情况表'
                                key.zcUrl = '/reportList?id=80&title=全县国有资本经营预算支出完成情况表'
                                break
                            case 3:
                                key.srUrl = '/reportList?id=83&title=全县社会保险基金预算收入完成情况表'
                                key.zcUrl = '/reportList?id=84&title=全县社会保险基金预算支出完成情况表'
                                break
                        }
                    })
                }
            })
        },
        getIndexScWorkDt() {
            let that = this
            this.$axios.get('/cloud/entrance/getIndexScWorkDt').then(res => {
                if (res.data.code == 200) {
                    that.thirdPart = res.data.data
                    that.thirdValue = that.thirdPart[0].configName
                    this.$nextTick(() => {
                        this.thirdPart.forEach((key, index) => {
                            var chart = this.$echarts.init(document.getElementById('tubiao-2-' + index))
                            var option = {
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
                                    top: '5%',
                                    containLabel: true
                                },
                                yAxis: [
                                    {
                                        type: 'category',
                                        data: [
                                            '部门审查报告',
                                            '总体报告',
                                            '形成审查报告数',
                                            '已下达数',
                                            '已处理数',
                                            '报告处理情况数'
                                        ],
                                        axisTick: {
                                            alignWithLabel: true
                                        }
                                    }
                                ],
                                xAxis: [
                                    {
                                        type: 'value'
                                    }
                                ],
                                series: [
                                    {
                                        name: '',
                                        type: 'bar',
                                        barWidth: '100%',
                                        data: [
                                            key.bmBgNum,
                                            key.zBgNum,
                                            key.bmBgNum + key.zBgNum,
                                            key.yxdBgNum,
                                            key.yclBgNum,
                                            key.yxdBgNum + key.yclBgNum
                                        ]
                                    }
                                ]
                            }

                            // 使用刚指定的配置项和数据显示图表。
                            chart.setOption(option)

                            chart = this.$echarts.init(document.getElementById('tubiao-1-' + index))

                            option = {
                                tooltip: {
                                    trigger: 'item'
                                },
                                legend: {
                                    top: '0',
                                    left: 'center'
                                },
                                series: [
                                    {
                                        name: '审批意见',
                                        type: 'pie',
                                        radius: ['40%', '50%'],
                                        data: [
                                            { value: key.yjWtjNum, name: '未采纳' },
                                            { value: key.yjTotalNum - key.yjWtjNum, name: '已采纳' }
                                        ],
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                ]
                            }
                            chart.setOption(option)
                        })
                    })
                }
            })
        },
        getIndexYjInfo() {
            let that = this
            this.$axios.get('/cloud/entrance/getIndexYjInfo').then(res => {
                if (res.data.code == 200) {
                    that.fourthPart = res.data.data
                    that.fourthValue = that.fourthPart[0].title
                }
            })
        },
        getYjZbRank() {
            let that = this
            this.$axios.get('/cloud/entrance/getYjZbRank').then(res => {
                if (res.data.code == 200) {
                    that.fivePart = res.data.data
                }
            })
        },
        pageJump(data) {
            this.$history.push({
                path: data
            })
        }
    }
}
</script>
<style scoped>
::-webkit-scrollbar {
	width: 5px;
	height: 5px;
}
::-webkit-scrollbar-thumb {
	width: 5px;
	background: #ccc;
}
::-webkit-scrollbar-track {
	width: 5px;
	background: #eee;
}
::v-deep .el-scrollbar__wrap {
	overflow-x: hidden !important;
}
::-webkit-scrollbar {
	width: 4px;
	height: 4px;
}
::-webkit-scrollbar-thumb {
	width: 4px;
	background: #ccc;
}
.flex-between {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.colorful-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 15px;
}
.colorful-item-0,
.colorful-item-1,
.colorful-item-2,
.colorful-item-3 {
	color: #fff;
	width: 23%;
	line-height: 30px;
	padding: 15px;
	border-radius: 8px;
	font-size: 14px;
}
.colorful-item-0 > .title,
.colorful-item-1 > .title,
.colorful-item-2 > .title,
.colorful-item-3 > .title {
	font-size: 20px;
}
.colorful-item-0 {
	background: linear-gradient(90deg, #009aff, #00caff);
}
.colorful-item-1 {
	background: linear-gradient(90deg, #34ce9c, #33ccca);
}
.colorful-item-2 {
	background: linear-gradient(90deg, rgb(255, 153, 51), rgb(255, 204, 102));
}
.colorful-item-3 {
	background: linear-gradient(90deg, rgb(255, 102, 102), rgb(255, 153, 153));
}
.percent-num {
	font-size: 25px;
}
.percent-box {
	height: 30px;
	background: rgba(255, 255, 255, 0.4);
	width: 4px;
	border-radius: 2px;
	overflow: hidden;
	display: flex;
	align-items: flex-end;
	margin-right: 5px;
}
.percent-box div {
	background: #fff;
	width: inherit;
}
.colorful-flex-box,
.colorful-percent-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.colorful-flex-box > div {
	width: 48%;
}
.table-tips {
	width: 48%;
	padding: 10px;
	border-radius: 8px;
}
.table-tips :last-child {
	color: #fff;
}
.table-box,
.tabs-box {
	overflow: auto;
}
/deep/.el-tabs__item {
	font-size: 16px;
}
.tab-pane-div {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	height: 300px;
	overflow: auto;
	font-size: 14px;
}
.tab-pane-item {
	width: 30%;
	padding: 5px;
	height: 200px;
}
.border-box {
	border-right: 1px solid #eee;
	border-left: 1px solid #eee;
}
.sub-list-box {
	height: 150px;
}
</style>
