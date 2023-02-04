<template>
<div class="jc-share-navigation" ref="jc-share-navigation">
	<div class="jc-corpore jc-box">
		<div id="jc-corpore__info" class="jc-corpore__info jc-clear">
			<h1 title="${asset.name eq null ? '' : asset.name}" style="width:500px">{{asset.name}}</h1>
			<div style="position:absolute;top: 20px;right: 20px;font-size:14px;">业主：{{asset.manageCompanyName}}</div>
			<div style="position:absolute;top:40px;right: 20px;font-size:14px;">原产权单位：{{asset.owner}}</div>
			<div class="jc-corpore__info-slide">
				<div class="left-img">
                <div class="display-box">
                    <img :src="curimgUrl" width="400px" height="300px"/>
                </div>
                <div class="carousel-box" v-if="imagelist.length > 1">
                    <el-carousel height="62px" arrow="always" :autoplay="true" indicator-position="none" loop>
                        <el-carousel-item v-for="item in Math.ceil(imagelist.length / 4)" :key="item">
                            <img
                                v-for="items in 4"
                                :src="imagelist[(item - 1) * 4 + items - 1].fileurl"
                                :key="items"
                                v-if="imagelist[(item - 1) * 4 + items - 1]"
                                class="carousel-box-img"
                                @click="curimgUrl = imagelist[(item - 1) * 5 + items - 1].fileurl"
                            />
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
				<div class="jc-corpore__info-parmeter-total">
					<ul class="jc-clear">
						<li>
							<i class="fa fa-ticket"></i><b id="signUpCount">0</b> 人报名
						</li>
						<li>
							<i class="fa fa-bell"></i><b id="subscribeCount">0</b> 人订阅
						</li>
						<li>
							<i class="fa fa-eye"></i><b id="watchCount">0</b> 人次围观
						</li>
					</ul>
				</div>
				<div>
					<div class="jc_others">限制经营范围：{{asset.remark||'无'}}</div>
				</div>
			</div>
			<div class="jc-corpore__info-parameter">
				<div class="jc-corpore__info-parameter-price">
					<dl id="price_content_0" class="jc-clear">
						<dt>起拍价</dt>
						<dd>
							<label id="startingPrice">{{target.startingPrice}}</label> <b>元/月</b>
							<div style="color:red;font-size:15px;line-height:20px;">(租金年递增率为{{target.ndzl}}%,{{target.remark}})</div>
						</dd>
					</dl>
					<dl id="price_content_1" style="display: none" class="jc-clear">
						<dt>当前价</dt>
						<dd>
							<label id="currentPrice">5858</label>&nbsp;元/月
							<div id="fronter" style="display: none; float:right; padding-left:10px">
								<span>出价人：<b>{{}}</b></span>
							</div>
							<div style="color:red;font-size:15px;line-height:20px;">(租金年递增率为${target.ndzl}%)</div>
						</dd>
					</dl>
				</div>
				<div class="jc-corpore__info-parameter-time">
					<dl class="jc-clear">
						<dt id="timer_lable">距开始</dt>
						<dd>
							<div id="countdown_0" class="hzd-goods-info__countdown">
                  <span v-html="CountDown"></span>
							</div>
						</dd>
						<dd class="delay">
							<span><b id="delayCount">0</b>&nbsp;次延时</span>
						</dd>
					</dl>
				</div>
				<div class="jc-corpore__info-parameter-offer">
							<dl>
								<div id='frotext' style="color:red;"></div>
								<dt id="dt_status_bidding">请出价&#12288;</dt>
								<dd>
									<input type="text" id="price" :value="target.startingPrice" readonly />
                    <span onclick="gotoauc();">去报名</span>
                    <p>
                      <i></i>提醒：请先登录，后点击“去报名”按钮交保证金，再出价。
                    </p>
								</dd>
							</dl>
							<label id="statusText">即将开始</label>
				</div>
				<div id="collection" class="jc-corpore__info-parameter-collection" onclick="addcoll(${target.id})">
					<i class="fa ${iscoll ? 'fa-bell' : 'fa-bell-o'}"></i>订阅
				</div>
				<table class="jc-corpore__info-parameter-other jc-share__form">
					<tr>
						<th width="20%">
							<label>起拍价格</label>
						</th>
						<td width="30%">
							￥<b>{{target.startingPrice}}</b>
						</td>
						<th>
							<label>租期</label>
						</th>
						<td>
							<b>{{target.leaseTime}}</b>&nbsp;个月
						</td>
					</tr>
					<tr>
						<th width="20%">
							<label>加价幅度</label>
						</th>
						<td width="30%">
							<b id="markup">{{getJJFD()}}元</b></span>
						</td>
						<th>
							<label>房产类型</label>
						</th>
						<td>{{asset.typeName}}</td>
					</tr>
					<tr>
						<th>
							<label>竞拍押金</label>
						</th>
						<td>
							￥<b>{{target.earnest}}</b>
						</td>
						<th>
							<label>优先承租人</label>
						</th>
						<td>
							<b>{{target.preferName}}</b>
						</td>
					</tr>
					<tr>
						<th>
							<label>竞拍周期</label>
						</th>
						<td>
							<b>{{target.biddingTime}}</b>&nbsp;分钟
						</td>
						<th>
							<label>延时周期</label>
						</th>
						<td>
							<b>{{target.delayTime}}</b>&nbsp;分钟
						</td>
					</tr>
					<tr>
						<th>
							<label>竞价规则</label>
						</th>
						<td colspan="3" id="bidrule">{{target.bidRule}}</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="jc-corpore__detail">
			<div id="jc-corpore__detail-tabs" class="jc-corpore__detail-tabs">
				<ul class="jc-clear">
					<li :class="curtab!='affiche'?'':'currently'"  @click="gotoDiv('affiche')">
						<a>标的公告</a>
					</li>
					<li :class="curtab!='attention'?'':'currently'" @click="gotoDiv('attention')">
						<a >注意事项</a>
					</li>					
					<li :class="curtab!='info'?'':'currently'" @click="gotoDiv('info')">
						<a>标的物信息</a>
					</li>
					<li :class="curtab!='notice'?'':'currently'" @click="gotoDiv('notice')">
						<a>竞价须知</a>
					</li>					
				</ul>
			</div>
			<a class="tag"></a>
			<div class="jc-corpore__detail-container" id="tabBody">
				<div class="jc-corpore__detail-affiche jc-clear">
					<i class="ico-end">+</i>
					<div class="jc-corpore__detail-title">
						<label>标的<br />公告<i class="fa fa-caret-right"></i><i class="fa fa-dot-circle-o"></i></label>
					</div>
                    <div  id="affiche" ></div>
					<div class="jc-corpore__detail-box" style="font-size:15px;"><div v-html="target.ggHtml"></div></div>
				</div>
                <a class="tag"></a>
                <div class="jc-corpore__detail-notice jc-clear">
                    <i class="ico-end">+</i>
                    <div class="jc-corpore__detail-title">
                        <label>注意<br />事项<i class="fa fa-caret-right"></i><i class="fa fa-dot-circle-o"></i></label>
                    </div>
                    <div class="jc-corpore__detail-box" style="min-height: 400px;font-size:20px;color:red" id="attention" >{{target.attention}}</div>
                </div>      				
				<a class="tag"></a>
				<div class="jc-corpore__detail-info jc-clear">
					<i class="ico-end">+</i>
					<div class="jc-corpore__detail-title">
						<label>资产<br />介绍<i class="fa fa-caret-right"></i><i class="fa fa-dot-circle-o"></i></label>
					</div>
					<div class="jc-corpore__detail-box" id="info" >
						<div class="jc-corpore__detail-title-child">标的物属性</div>
						<div class="jc-corpore__detail-info-content">
							<table class="jc-share__form" width="85%" align="center">
								<tr>
									<th>
										<label>资产类别</label>
									</th>
									<td>{{asset.typeName}}</td>
									<th>
										<label>用途</label>
									</th>
									<td>{{asset.purposeName}}</td>
                                    <th>
										<label>户型</label>
									</th>
									<td></td>
									
								</tr>
                                <tr>
									<th>
										<label>朝向</label>
									</th>
									<td></td>
									<th>
										<label>建筑面积（约）</label>
									</th>
									<td>{{asset.build_area}}m²</td>
									<th>
										<label>使用面积（约）</label>
									</th>
									<td></td>
								</tr>
                                <tr>
									<th>
										<label>进深（约）</label>
									</th>
									<td></td>
									<th>
										<label>面宽（约）</label>
									</th>
									<td></td>
									<th>
										<label>层高（约）</label>
									</th>
									<td>{{asset.level}}</td>
								</tr>
								<tr>
									<th>
										<label>楼层</label>
									</th>
									<td>{{asset.plies}}层</td>
									<th>
										<label>装修情况</label>
									</th>
									<td>无</td>
									<th>
										<label>所在地</label>
									</th>
									<td colspan="3">{{asset.areainfoName}}</td>
								</tr>
                                <tr>
									<th>
										<label>详细地址</label>
									</th>
									<td  colspan="3">{{asset.location}}层</td>
									
								</tr>
							</table>
						</div>
						<div >
							<div class="jc-corpore__detail-title-child">标的物图片</div>
							<div class="jc-corpore__detail-info-pic" v-for="(item) in imagelist">
								<img :src="item.fileurl" alt="">
							</div>
						</div>
                        <!--
						<div>
							<div class="jc-corpore__detail-title-child">标的物视频</div>
							<div class="jc-corpore__detail-info-video">
								<video src=""></video>
							</div>
						</div>-->
						<div class="jc-corpore__detail-title-child"  v-if="asset.latitude != undefined && asset.latitude != null && asset.latitude != '' && asset.longitude != undefined && asset.longitude != null && asset.longitude != ''">所在地：{{asset.areainfoName}}</div>
						<div class="jc-corpore__detail-info-address" v-if="asset.latitude != undefined && asset.latitude != null && asset.latitude != '' && asset.longitude != undefined && asset.longitude != null && asset.longitude != ''">
							<div id="buildmap" class="map"></div>
						</div>
					</div>
				</div>
				<a class="tag"></a>
				<div class="jc-corpore__detail-notice jc-clear">
					<i class="ico-end">+</i>
					<div class="jc-corpore__detail-title">
						<label>竞价<br />须知<i class="fa fa-caret-right"></i><i class="fa fa-dot-circle-o"></i></label>
					</div>
					<div class="jc-corpore__detail-box" style="font-size:15px;"  id="notice"><div v-html="target.xzHtml"></div></div>
				</div>		
			</div>
		</div>
	</div>
</div>
  
</template>

<script>
let map
let markerLayer
export default {
  	name: "app",
  	data() {
   		return {
			imagelist:[],
			curimgUrl:'',
			id: '',
			assetId: '',
			asset: {},
			target: {},
			CountDown:undefined,
			interval:undefined,
			curtab:'affiche',
    	};
  	},
 	created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.assetId = this.$history.currentRoute.query.assetId
		this.id = this.$history.currentRoute.query.id
     
    },
  	mounted(){
		this.getFabuYulan()
       	this.interval=setInterval(()=>{
			let start= new Date(this.target.startTime)
			let end=new Date()
			let time=start-end
			if(time>0){
				let day=Math.floor(time/86400000)
				let hour=Math.floor(time/3600000%24)
				let min=Math.floor(time/60000%60)
				let sec=Math.floor(time/1000%60)
				this.CountDown= (day<10?'0'+day:day)+'<span class="sm-text">天</span>'+(hour<10?'0'+hour:hour)+'<span class="sm-text">时</span>'+(min<10?'0'+min:min)+'<span class="sm-text">分</span>'+(sec<10?'0'+sec:sec)+'<span class="sm-text">秒</span>'
			}else{
				this.CountDown='已结束'
			}
      	},1000)
        document.addEventListener('scroll',e=>{
			if(e.path[0].scrollTop>=630){
				document.getElementById('jc-corpore__detail-tabs').className='jc-corpore__detail-tabs jc-corpore__detail-tabs-float'
			}else{
				document.getElementById('jc-corpore__detail-tabs').className='jc-corpore__detail-tabs '
			}
		}, true)
        
	},	
	destroyed(){
		clearInterval(this.interval)
	},
 	methods: {
      	getJJFD(){
      		return (this.target.startingPrice*this.target.markup/100).toFixed(0)
      	},
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
					
					let filelist = this.target = res.data.data.attachstr
					for(var i = 0; i<filelist.length;i++){
						let file = {
							fileurl: filelist[i].fileurl
						}
						this.imagelist.push(file)
					}
					if(this.imagelist.length>0){
						this.curimgUrl=this.imagelist[0].fileurl
					}
					this.asset = res.data.data.asset
                    
                    this.target = res.data.data.target
					if(that.asset.longitude==undefined||that.asset.longitude==null||that.asset.longitude==''||that.asset.latitude==undefined||that.asset.latitude==null||that.asset.latitude==''){
						return
					}
					that.$nextTick(()=>{
						
						map = new TMap.Map(document.getElementById('buildmap'), {
							center: new TMap.LatLng(Number(that.asset.longitude),Number(that.asset.latitude)), //设置地图中心点坐标
							zoom: 11, //设置地图缩放级别
							viewMode: '2D',
							disableDefaultUI: true
						})
						markerLayer = new TMap.MultiMarker({
							map: map, //指定地图容器
							//样式定义
							styles: {
								//创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
								myStyle: new TMap.MarkerStyle({
									width: 25, // 点标记样式宽度（像素）
									height: 35 // 点标记样式高度（像素）
								})
							},
							//点标记数据数组
							geometries: [{
									id: 'map', //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
									styleId: 'myStyle', //指定样式id
									position: new TMap.LatLng(Number(that.asset.longitude),Number(that.asset.latitude)), //点标记坐标位置
									properties: {
										//自定义属性
										latitude: Number(that.asset.latitude),
										longitude:Number(that.asset.longitude),
									}
								}]
						})
					})
				}

			})
    
        },
      	gotoDiv(id){
          	this.curtab=id
           	document.querySelector('#'+id).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      	}
 	}
};
</script>

<style scoped>  
.gray {
	background-color: #999 !important;
}

.anchorBL {
	display: none;
}

.jc_others {
	border: 1px dotted #f90;
	text-align: center;
	background-color: #faffbd;
	color: #f30;
	line-height: 30px;
}

.jc-corpore__detail-notice,.jc-corpore__detail-affiche .jc-corpore__detail-box span
	{
	font-family: 'PingFangSC-Regular', 'Helvetica Neue', Helvetica, Arial,
		sans-serif;
	line-height: 36px;
}
.jc-share-navigation ol,
.jc-share-navigation ul,
.jc-share-navigation dl,
.jc-share-navigation dt,
.jc-share-navigation dd,
.jc-share-navigation form {
	display: block;
	margin: 0;
	padding: 0;
}
.jc-share-navigation table {
	border-spacing: 0;
}
.jc-share-navigation ol,
.jc-share-navigation ul,
.jc-share-navigation dl {
	list-style: none;
}
.jc-share-navigation iframe {
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: transparent;
}
.jc-share-navigation img {
	border: 0;
}

.jc-share-navigation a {
    color: #333;
	text-decoration: none;
    outline: none;
	cursor: pointer;
}
.jc-share-navigation a:hover {
	color: #000;
}

.carousel-box-img{
  width: 96px;
  height: 62px;
  background: #d2d2d2;
  margin: 0px 2px;
  cursor: pointer;
}
.jc-share-navigation /deep/ .el-carousel__arrow {
    border-radius: 0 !important;
    background: rgba(#000000, 0.5) !important;
    height: 100% !important;
    width: 24px !important;
}
.jc-share-navigation /deep/ .el-carousel__arrow--right {
    right: 0 !important;
    font-size: 19px !important;
}
.jc-share-navigation /deep/ .el-carousel__arrow--left {
    left: 0 !important;
    font-size: 19px !important;
}

/*
# Common
*/
.jc-box{
	margin: 0 auto;
	width: 1000px;
}
.jc-clear:after {
     content: ".";
     display: block;
	 width: 0;
     height: 0;
     clear: both;
     visibility: hidden;
}
/*
# jc-error
*/
.jc-error {
	height: 500px;
	padding-top: 50px;
	text-align: center;
	box-sizing: border-box;
}
.jc-error i {
	display: table;
	margin: 20px auto;
	color: #f30;
	font-size: 120px;
}
.jc-error span {
	display: table;
	margin: 0 auto;
	padding-bottom: 20px;
	color: #666;
	font-size: 16px;
	font-weight: bold;
	font-family: "Microsoft Yahei";
	border-bottom: 1px solid #666;
}
.jc-error p {
	font-size: 16px;
}


/*
# Share-header
*/
.jc-share-header {
	background-position: top center;
}
.jc-share-header .jc-box {
	padding: 25px 0;
	height: 110px;
	box-sizing: border-box;
}
/*
# Share-navigation
*/
.jc-share-navigation {
	margin-bottom: 30px;
    background-color: #F9F9F9;
}
/*.jc-share-navigation ul {
	float: right;
}*/
.jc-share-navigation li {
	display: inline-block;
	float: left;
	padding: 10px 0;
	height: 12px;
	line-height: 12px;
	color: #999;
	font-size: 13px;
}
.jc-share-navigation li i {
	margin: 0 10px;
}
.jc-share-navigation li:first-child i {
	margin: 0 10px 0 0;
}
.jc-share-navigation li a {
	color: #999;
	font-size: 13px;
}
.jc-share-navigation li a:hover {
	color: #333;
}

/*
# jc-share-form
*/
.jc-share__form {
	background-color: #fcfcfc;
}
.jc-share__form th,
.jc-share__form td {
	position: relative;
	height: 50px;
	padding: 0 20px;
	border-bottom: 1px dotted #ccc;
}
.jc-share__form th {
	padding: 0;
}
.jc-share__form th label {
	display: block;
	padding-right: 20px;
	text-align: right;
	border-right: 1px solid #aaa;
}
.jc-share__form th label b {
	display: inline-block;
	margin-right: 10px;
	color: red;
}
.jc-share__form input {
	padding: 0 10px;
	height: 30px;
	width: 150px;
	line-height: 30px;
	border: 1px solid #aaa;
	-moz-border-radius: 3px;
	-webkit-border-radius: 3px;
	border-radius: 3px;
}
.jc-share__form .textbox {
	border: 1px solid #aaa;
}
.jc-share__form input.textbox-text {
	padding: 0 10px;
	height: 30px;
}
.jc-share__form-imgbox {
	padding: 10px 0;
}
.jc-share__form-imgbox li {
	margin-top: 10px;
}
.jc-share__form-imgbox li:first-child {
	margin-top: 0;
}
.jc-share__form-imgbox li img {
	width: 50%;
}
.upload {
	position: absolute!important;
	top: 91px;
	right: 20px;
}
.idimg {
	margin: 9px 0;
	padding: 10px;
	width: 320px;
	height: 200px;
	border: 1px dotted #aaa;
	background-color: #fafafa;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	border-radius: 5px;
	text-align: center;
	background-color: #fff;
	box-sizing: border-box;
}
.idimg img {
	height: 100%;
}

/**
#IE11识别
*/
@media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
	.jc-login__getcode {
		display: table;
		position: absolute;
		margin: 0;
		top: 134px;
		right: 0px;
		height: 15px;
		line-height: 15px;
		padding: 15px 30px;
		color: #fff;
		font-size: 14px;
		letter-spacing: 1px;
		background-color: #666;
		-moz-border-bottom-right-radius: 4px;
		-moz-border-top-right-radius: 4px;
		-webkit-border-bottom-right-radius: 4px;
		-webkit-border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		border-top-right-radius: 4px;
		cursor: pointer;
	}
}

/*
# jc-corpore
*/
.jc-corpore__info {
	position: relative;
	padding: 20px;
	border: 1px dotted #CCC;
	border-top: 1px solid #f60;
}
.jc-corpore__info h1 {
	display: block;
	margin: 0;
	padding-bottom: 20px;
	font-size: 18px;
	font-weight: normal;
}
.jc-corpore__info-slide {
	float: left;
	width: 400px;
}

.jc-corpore__info-parameter {
	position: relative;
	float : left;
    margin-left: 30px;
	width: 528px;
}
.jc-corpore__info-parameter dl {
	padding-bottom: 20px;
}
.jc-corpore__info-parameter dt,
.jc-corpore__info-parameter dd {
	position: relative;
	display: inline-block;
	float: left;
	padding-left: 10px;
	width: 18%;
	height: 40px;
	font-size: 14px;
	box-sizing: border-box;
}
.jc-corpore__info-parameter dd {
	width: auto;
}
.jc-corpore__info-parameter-price dt {
	padding-top: 20px;
	height: 12px;
	line-height: 12px;
	box-sizing: border-box;
}
.jc-corpore__info-parameter-price label {
	color: red;
	font-size: 30px;
	vertical-align: sub;
}
.jc-corpore__info-parameter-price span {
	display: block;
	margin-top: 15px;
	padding: 3px 5px 2px 5px;
	height: 12px;
	line-height: 12px;
	color: #fff;
	font-size: 12px;
	font-family: "Arial";
	background-color: #666;
	-moz-border-radius: 3px;
	-webkit-border-radius: 3px;
	border-radius: 3px;
}
.jc-corpore__info-parameter-price span b {
	color: #fff;
	font-weight: normal;
	letter-spacing: 1px;
}
.jc-corpore__info-parameter-time dt {
	padding-top: 16px;
	box-sizing: border-box;
}
.jc-corpore__info-parameter-time dd {
    position: static;
}
.jc-corpore__info-parameter-time dd.delay {
	position: static;
	padding-top: 20px;
	box-sizing: border-box;
}
.jc-corpore__info-parameter-time dd.delay span {
	display: table;
	padding-left: 10px;
	height: 12px;
	line-height: 12px;
	font-size: 14px;
	border-left: 1px solid #aaa;
}
.hzd-goods-info__countdown span {
	display: inline-table;
	padding: 0 2px 0 5px;
	color: #333;
	font-size: 30px;
	font-weight: bold;
	box-sizing: border-box;
	vertical-align: inherit;
}
.hzd-goods-info__countdown .sm-text{
    font-size:14px;
    font-weight: 400;
}  
.hzd-goods-info__countdown span :first-child {
	padding-left: 0;
}
.jc-corpore__info-parameter-collection {
	position: absolute;
	top: 0;
	right: 20px;
	padding-left: 20px;
	color: #666;
	font-size: 14px;
	font-weight: bold;
	text-align: center;
    border-left: 1px dotted #ccc;
}
.jc-corpore__info-parameter-collection i {
	display: table;
	margin: 0 auto;
	margin-bottom: 3px;
	font-size: 25px;
	cursor: pointer;
}
.jc-corpore__info-parameter-collection i.fa-bell {
	color: #f90;
	cursor: default;
}
.jc-corpore__info-parameter-offer {
	position: relative;
	padding: 10px 0;
	height: 131px;
	background-color: #f6f6f6;
}
.jc-corpore__info-parameter-offer input {
	padding: 0 20px;
	width: 200px;
	height: 45px;
	line-height: 45px;
	color: #666;
	font-size: 25px;
	font-weight: bold;
	border: 1px solid #bbb;
	background-color: #fff;
	cursor: default;
}
.jc-corpore__info-parameter-offer span {
	display: table;
	margin-top: 10px;
	padding:  10px 0;
	width: 242px;
	height: 16px;
	line-height: 16px;
	color: #fff;
	font-size: 16px;
	text-align: center;
	background-color: #f60;
	cursor: pointer;
}
.jc-corpore__info-parameter-offer span.dOffer {
	display: none;
	color: #fff;
	background-color: #999;
	cursor: default;
}
.jc-corpore__info-parameter-offer dd div {
	display: table;
	position: absolute;
	top: 0;
	left: 254px;
}
.jc-corpore__info-parameter-offer dd div i {
	display: table;
	height: 21px;
	width: 30px;
	margin-bottom: 1px;
	color: #fff;
	font-size: 18px;
	font-style: normal;
	font-weight: bold;
	line-height: 21px;
	text-align: center;
	border: 1px solid #999;
	background-color: #aaa;
	cursor: pointer;
}
.jc-corpore__info-parameter-offer p {
	display: block;
	margin-top: 10px;
	padding: 5px;
	font-size: 12px;
	background-color: #fffaac;
	border: 1px solid #ffae00;

}
.jc-corpore__info-parameter-offer label {
	z-index: 999;
	position: absolute;
	display: table;
	right: 0;
	top: 0;
	padding: 0 10px;
	height: 20px;
	line-height: 20px;
	color: #fff;
	font-size: 12px;
	background-color: #f30;
}
.jc-corpore__info-parameter-offer li {
	display: inline-block;
	float: left;
	padding: 4px 12px 5px 12px;
	margin: 17px 5px 0 5px;
	height: 12px;
	line-height: 12px;
	color: #fff;
	font-size: 12px;
	background-color: #f90;
	-moz-border-radius: 11px;
	-webkit-border-radius: 11px;
	border-radius: 11px;
}
.jc-corpore__info-parameter-offer li:first-child {
	margin-left: 0;
}
.jc-corpore__info-parameter-offer div {
	font-size: 16px;
    font-weight: bold;
	text-align: center;
}
.jc-corpore__info-parameter-other {
	margin-top: 10px;
	width: 100%;
	background-color: #fff;
}
.jc-corpore__info-parameter-other tr:last-child th,
.jc-corpore__info-parameter-other tr:last-child td {
	border-bottom: 0;
}
.jc-corpore__info-parameter-other th,
.jc-corpore__info-parameter-other td {
	padding-top: 15px;
	padding-bottom: 10px;
	height: auto;
	line-height: 20px;
	text-align: left;
}
.jc-corpore__info-parameter-other th label {
	text-align: left;
	font-weight: normal;
	padding-left: 10px;
	border-right: 1px dotted #999;
}

.jc-corpore__info-parmeter-total ul {
	display: table;
	margin: 0 auto;
	padding-top: 30px;
}
.jc-corpore__info-parmeter-total li {
	display: inline-block;
	float: left;
	margin-left: 20px;
	padding-left: 20px;
	text-align: center;
	border-left: 1px dotted #AAA;
}
.jc-corpore__info-parmeter-total li:first-child {
	margin-left: 0;
	padding-left: 0;
	border-left: none;
}
.jc-corpore__info-parmeter-total li i {
	margin-right: 10px;
}

.jc-corpore__detail {
	position: relative;
	margin-top: 20px;
	min-height: 500px;
	border: 1px solid #ddd;
	border-left: 1px dotted #f60;
}
.jc-corpore__detail-tabs {
	position: absolute;
	top: -1px;
	left: -1px;
	width: 100%;
	height: 41px;
	border: 1px solid #ddd;
	border-left: 1px dotted #f60;
	border-top: 0;
	overflow: visible;
}
.jc-corpore__detail-tabs-float {
	z-index: 99999;
	position: fixed;
	top: 0;
	left: 50%;
	width: 1000px;
	height: 42px;
	margin-left: -500px;
    background-color: #f0f0f0;
	box-sizing: border-box;
}
.jc-corpore__detail-tabs ul {
	position: absolute;
	top: 0;
	left: 0;
}
.jc-corpore__detail-tabs li {
	display: inline-block;
	float: left;
	width: 150px;
	height: 40px;
	line-height: 40px;
	color: #333;
	font-size: 15px;
	font-weight: bold;
	text-align: center;
	background-color: #f0f0f0;
	border: 1px solid #ddd;
	border-left: 0;
	cursor: pointer;
}
.jc-corpore__detail-tabs li a {
	font-size: 15px;
	font-weight: bold;
}
.jc-corpore__detail-tabs li.currently {
	color: #f30;
	border-top-color: #f60;
	border-bottom-color: #fff;
	background-color: #fff;
}
.jc-corpore__detail-container {
	padding: 80px 30px 30px 30px;
}
.jc-corpore__detail-container .jc-clear {
	position: relative;
}
.jc-corpore__detail-container .jc-clear i.ico-end {
	position: absolute;
	bottom: -8px;
	left: -34px;
	color: #f60;
	font-size: 16px;
	font-family: "simsun";
	font-style: normal;
}
.jc-corpore__detail-box {
	position: relative;
	margin: 0 auto;
	padding-bottom: 50px;
	width: 90%;
	min-height: 200px;
	border-bottom: 1px dotted #f60;
}
.jc-corpore__detail-title {
	position: relative;
	margin-top: 50px;
}
.jc-corpore__detail-title label {
	position: absolute;
	display: table;
	top: 0;
	left: -110px;
	padding: 8px 10px;
	height: 40px;
	line-height: 23px;
	color: #fff;
	font-size: 18px;
	text-align: center;
	background-color: #f60;
	-moz-border-top-right-radius: 8px;
	-moz-border-bottom-right-radius: 8px;
	-webkit-border-top-right-radius: 8px;
	-webkit-border-bottom-right-radius: 8px;
	border-top-right-radius: 8px;
	border-bottom-right-radius: 8px;
}
.jc-corpore__detail-title label i {
	position: absolute;
	top: 21px;
	right: -7px;
	color: #f60;
	font-size: 20px;
}
.jc-corpore__detail-title label i.fa-dot-circle-o {
	top: 23px;
	right: -31px;
	color: #f60;
	font-size: 17px;
}
.jc-corpore__detail-title-child {
	margin: 30px 0 20px 0;
	padding-left: 20px;
	height: 30px;
	line-height: 30px;
	color: #333;
	font-size: 14px;
	font-weight: bold;
	background-color: #fff8e6;
	border-left: 1px solid #f60;
}
.jc-corpore__detail-info-img,
.jc-corpore__detail-info-video {
	text-align: center;
}
.jc-corpore__detail-info-pic img {
	width: 90%;
}
.jc-corpore__detail-info-video video {
	height: 400px;
}

.jc-corpore__detail-info-address .map {
	margin: 0 auto;
	width: 800px;
	height: 360px;
}
.jc-corpore__detail-confirmation .jc-corpore__detail-box {
	width: 70%;
	padding: 60px 20px 20px 20px;
	font-size: 16px;
	background-color: #fff8e6;
	border: 1px dotted #f90;
}
.jc-corpore__detail-confirmation .jc-corpore__detail-box h1 {
	display: block;
	margin: 0 10px 40px 10px;
	padding: 20px 0;
	color: red;
	font-size: 20px;
	text-align: center;
	border-bottom: 1px solid red;
}
.jc-corpore__detail-confirmation .jc-corpore__detail-box p {
	padding: 0 50px;
	line-height: 35px;
}
.jc-corpore__detail-confirmation .jc-corpore__detail-box h2 {
	font-size: 16px;
	font-weight: normal;
	text-align: right;
	padding-right:50px;
}
#price{
    background:#ddd
}
.jc-corpore__detail-tabs-float {
	z-index: 99999;
	position: fiexd;
	top: 108px;
	left: calc(50% + 107px);
	width: 1000px;
	height: 42px;
	margin-left: -500px;
   background-color: #f0f0f0;
	box-sizing: border-box;
}
</style>