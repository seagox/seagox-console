<template>
    <div style="margin:0 auto;width:1000px">
        <el-button @click="printIt">打印</el-button>
        <div
            class="jc-corpore__detail-box"
            style="padding: 60px 20px 20px 20px;font-size: 16px;background-color: #fff8e6;border: 1px dotted #f90;"
            id="printElement"
        >
            <h1
                style="display: block;margin: 0 10px 40px 10px;padding: 20px 0;color: red;font-size: 20px;text-align: center;border-bottom: 1px solid red;"
            >
                网络竞价成功确认书
            </h1>
            <p
                style="padding: 0 50px;line-height: 35px;"
            >
                资产所属单位：{{ asset.manageCompanyName }}<br />
                原产权单位：{{ asset.owner }}<br />
                标的物名称: {{ asset.name }}<br />
                建筑面积(约): {{ asset.build_area }}m<sup style="line-height:0px;">2</sup>(面积以实物现状为准)<br />
                标的竞价链接：{{target.jjurl}}<br /> 
                竞价公告时间：{{ target.fabuTime }}<br />
                竞价开始时间：{{ target.startTime }}<br />
                竞价结束时间：{{target.bidEndTime }}<br />
                <!-- 限制经营范围：${asset.others }<br /> -->
                <br />
                【资产竞价结果】<br />
                <span v-if="target.winnerType==1">
                    用户姓名
                    <label style="border-bottom: 1px solid #000;">{{target.winnerName}}</label>
                    ，证件号<label style="border-bottom: 1px solid #000;">{{target.winnerCard}}</label>
                </span>
                <span v-else>
                    企业名称
                    <label style="border-bottom: 1px solid #000;">{{target.winnerCompany}}</label>，统一社会信用代码
                    <label style="border-bottom: 1px solid #000;">{{target.winnerXydm}}</label>，法人姓名
                    <label style="border-bottom: 1px solid #000;">{{target.winnerFrName}}</label>，身份证号
                    <label style="border-bottom: 1px solid #000;">{{target.winnerFrCard}}</label>
                </span>
              通过竞买号{{target.jph}}
                于
                <label style="border-bottom: 1px solid #000;">{{target.bidEndTime}}</label>在
                <label style="border-bottom: 1px solid #000;">{{asset.manageCompanyName}}</label>于好租点拍卖平台开展的“{{
                    target.name
                }}”项目公开竞价中，以最高应价胜出。<br />
                该标的网络竞拍成交价格：
                <label style="border-bottom: 1px solid #000;">
                    {{target.finalPrice }}({{digitUppercase(target.finalPrice)}})
                    元/月 </label
                >， 租期：<label style="border-bottom: 1px solid #000;">{{ target.leaseTime }}个月</label>。
                <br />
                在网络拍卖中竞拍成功的用户，必须依照标的物《竞买须知》、《竞买公告》要求， 按时交付标的物网拍成交余款
                <span v-if="target.ndzl != 0&&target.ndzl != '0'"
                    >
                    （ 租金年递增率为{{ target.ndzl }}%
                    <span v-if="!target.remark">
                        ，{{ target.remark }}</span>
                    ） </span
                >并办理相关手续。<br />
                标的物最终成交以{{asset.manageCompanyName }}出具拍卖成交裁定为准。<br />
            </p>
            <br />
            <p
                style="padding: 0 50px;line-height: 35px;"
            >
                竞得人(签字)：<label style="border-bottom: 1px solid #000;"
                    >&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;</label
                >
            </p>
            <h2
                style="font-size: 16px;font-weight: normal;text-align: right;padding-right: 50px;height:150px"
            >
                <span style="position:relative;">
                    {{target.finalTime }}
                    <img
                        style="width:150px;position: absolute;right:0px;top:-75px"
                        src="https://zcyy-9000.jcaiwu.com/sea-oss/40cacb0c726d824eaff44f5e8e5c8b80.png"
                    />
                </span>
            </h2>
        </div>
    </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
	  id: '',
	  assetId: '',
	  asset: {},
	  target: {},
    };
  },
  created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.assetId = this.$history.currentRoute.query.assetId
		this.id = this.$history.currentRoute.query.id
		this.getFabuYulan()
     
    },
   mounted(){
       
},
destroyed(){
},
  methods: {
	//查询公告模板
        getFabuYulan() {
            let that = this
            let params = {
                id: this.id,
				assetId: this.assetId,
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/getFabuYulan', params).then(res => {
                console.log(res.data.data)
				if(res.data.code == 200){
					
					this.asset = res.data.data.asset
                    
					this.target = res.data.data.target
				}
            })
        },
      printIt(){
         printPage('printElement', 'auto')
            function printPage(id, size) {
                var ieFlag = false
                if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                    removeIEHeaderAndFooter()
                    ieFlag = true
                }

                setTimeout(() => {
                    // 判断iframe是否存在，不存在则创建iframe
                    let iframe = document.getElementById('print-iframe')
                    if (!iframe) {
                        const printContent = document.getElementById(id)
                        iframe = document.createElement('IFRAME')
                        let doc = null
                        iframe.setAttribute('id', 'print-iframe')
                        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
                        document.body.appendChild(iframe)
                        doc = iframe.contentWindow.document
                        doc.write('<style media="print">@page {size:' + size + ';margin:0mm;}</style>')

                        doc.write(`<div">${printContent.innerHTML}</div>`)
                        doc.close()
                        iframe.contentWindow.focus()
                    }

                    var contentWindow = iframe.contentWindow

                    if (ieFlag) {
                        contentWindow.document.body.className += ' ext-ie'
                        contentWindow.document.execCommand('print', false, null)
                    } else {
                        contentWindow.print()
                    }

                    document.body.removeChild(iframe)
                })
            }

        },
      digitUppercase(n) {
		var fraction = [ "角", "分" ];
		var digit = [ "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" ];
		var unit = [ [ "元", "万", "亿" ], [ "", "拾", "佰", "仟" ] ];
		var head = n < 0 ? "负" : "";
		n = Math.abs(n);
		var s = "";
		for (var i = 0; i < fraction.length; i++) {
			s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, "");
		}
		s = s || "整";
		if (s.indexOf("角") == 1 && s.indexOf("分") == -1) {
			s = s + "整";
		}
		n = Math.floor(n);
		for (var i = 0; i < unit[0].length; i++) {
			if (n <= 0)
				break;
			var p = "";
			for (var j = 0; j < unit[1].length; j++) {
				if (n <= 0)
					break;
				p = digit[n % 10] + unit[1][j] + p;
				n = Math.floor(n / 10);
			}
			s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
		}
		return head + s.replace(/(零.)*零元/, "元").replace(/(零.)+/g, "零").replace(/^整$/, "零元整");
	}
  },
};
</script>

<style scoped>
.jc-corpore__detail-box {
    width: 70%;
    padding: 60px 20px 20px 20px;
    font-size: 16px;
    background-color: #fff8e6;
    border: 1px dotted #f90;
}
.jc-corpore__detail-box h1 {
    display: block;
    margin: 0 10px 40px 10px;
    padding: 20px 0;
    color: red;
    font-size: 20px;
    text-align: center;
    border-bottom: 1px solid red;
}
.jc-corpore__detail-box p {
    padding: 0 50px;
    line-height: 35px;
}
.jc-corpore__detail-box h2 {
    font-size: 16px;
    font-weight: normal;
    text-align: right;
    padding-right: 50px;
}
.jc-corpore__detail-box h2 img {
    width: 20%;
    /* float: right;
    position: relative;
    bottom: 0px;
    right: 60px; */
}
</style>
