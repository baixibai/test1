
//-- DOM操作
const DOM = {
	//-- 获取标签
	getTag(name) {
		return window.document.getElementsByTagName(name)[0]
	},
	//-- 更换标题
	title(name){
		this.getTag('title').innerHTML = name
	},
	//-- 创建DOM
	create(name='div'){
		return document.createElement(name)
	},
	//-- 设置属性
	setAttr(node,name,value){
		node && node.setAttribute(name.replace(/\s/g,''),value)
	},
	//-- 添加DOM
	addBody(child){
		this.getTag('body').appendChild(child)
	},
	//-- 移除body中的dom
	removeBody(child){
		this.getTab('body').removeChild(child);
	},
	//-- 插入script
	script(url,callback){
		let script = this.create('script')
		this.setAttr(script,'src',url+'?callback=callback')
		script.onload = script.onreadystatechange = function(){
			if(script.readyState && script.readyState != 'loaded' && script.readyState != 'complete') return
			script.onreadystatechange = script.onload = null
			callback && callback()
		}
		this.addBody(script)
	}
}

//-- 基础，类似underscore
const _ = {
	op(){
		let op = Object.prototype
		return {
			ostring	: op.toString,
			hasOwn	: op.hasOwnProperty,
		}
	},
	isFunction(it){
		return this.op().ostring.call(it) === '[object Function]'
	},
	isArray(it) {
		return this.op().ostring.call(it) === '[object Array]'
	},
	isObject(it) {
		return this.op().ostring.call(it) === '[object Object]'
	},
	isString(it) {
		return this.op().ostring.call(it) === '[object String]'
	},
	isUndefine(it) {
		return this.op().ostring.call(it) === '[object Undefined]'
	},
	isBool(it) {
		return this.op().ostring.call(it) === '[object Boolean]'
	},
	isNumber(it) {
		return it%1 >= 0
	},
	hasArr(val,array){
		let res = false
		array.map((value) => {
			if(value === val){
				res = true
			}
		})
		return res
	},
	removeArr(val,array){
		array.map((value,i) => {
			value === val && array.splice(i,1)
		})
		return array
	},
	hasProp(obj, prop){
		return this.op().hasOwn.call(obj, prop)
	},
	eachProp(obj, func){
		for(let prop in obj){
			if(this.hasProp(obj, prop)){
				if(func(obj[prop], prop)){
					break;
				}
			}
		}
	},
	mixin(target, source) {
		if(source){
			this.eachProp(source, function(value, prop) {
				if (!this.hasProp(target, prop)) {
					if (this.isObject(value) && value &&
						!this.isArray(value) && !this.isFunction(value) &&
						!(value instanceof RegExp)){
						if(!target[prop]){
							target[prop] = {};
						}
						_.mixin(target[prop], value);
					}else{
						target[prop] = value;
					}
				}else{
					target[prop] = value;
				}
			}.bind(this))
		}
		return target;
	},
	now(){
		return parseInt( new Date() / 1000 )
	},
	filterSpace(txt){
		return txt.replace(/\s/g,'')
	},
	cut(txt){
		return this.filterSpace(txt).split('|')
	},
	random(min,max){
		let under	= max ? min : 0
		let top		= max || min
		return parseInt(Math.random()*(top-under+1) + under)
	},
	objEqual(a, b){
		let objA = Object.getOwnPropertyNames(a)
		let objB = Object.getOwnPropertyNames(b)
		if (objA.length != objB.length) {
			return false
		}
		for (var i = 0; i < objA.length; i++) {
			var propName = objA[i]
			if(_.isArray(a[propName])){
				console.log('array')
				if(a[propName].length != b[propName].length){
				}else{
					for (let j = 0; j < a[propName].length; j++){
						let cItemA = a[propName][j]
						let cItemB = b[propName][j]
						if(_.isObject(cItemA)){
							_.objEqual(cItemA, cItemB)
						}
					}
				}
			}else{
				if(_.isObject(a[propName])){
					_.objEqual(a[propName], b[propName])
				}else{
					if (a[propName] !== b[propName]) {
						return false
					}
				}
			}
		}
		return true
	}
}
//-- 改造时间
const TranTime = (data,mat) => {
	if(data=='0' || data==''){
		return format="--";
	}
	let time = new Date(data*1000)
	let format = mat || 'yyyy-MM-dd hh:mm:ss'
       var date = {
			"M+": time.getMonth() + 1,
			"d+": time.getDate(),
			"h+": time.getHours(),
			"m+": time.getMinutes(),
			"s+": time.getSeconds(),
			"q+": Math.floor((time.getMonth() + 3) / 3),
			"S+": time.getMilliseconds()
       }
       if(/(y+)/i.test(format)){
			format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
       }
       for (var k in date) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length))
              }
       }
       return format;
}

// 获取当前时间
const Nowtime = () =>{
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

// 获取当前月份
const Nowmonth = () =>{
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month;
	return currentdate;
}

// 获取时间段内的所有日期 2019-03-25  -  2019-04-03
const getDate = (datestr) =>{
    var temp = datestr.split("-");
    if (temp[1] === '01') {
        temp[0] = parseInt(temp[0],10) - 1;
        temp[1] = '12';
    } else {
        temp[1] = parseInt(temp[1],10) - 1;
    }
    var date = new Date(temp[0], temp[1], temp[2]);
    return date;
}

const getDateday = (start,end) =>{
    var startTime = getDate(start);
    var endTime = getDate(end);
    var dateArr = [];
    while ((endTime.getTime() - startTime.getTime()) >= 0) {
    	console.log(startTime.getMonth())
        var year = startTime.getFullYear();
        var month = (startTime.getMonth() + 1) < 10 ? "0" + (parseInt(startTime.getMonth().toString(),10) + 1) : (startTime.getMonth() + 1);
        var day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();
        dateArr.push(year + "-" + month + "-" + day);
        startTime.setDate(startTime.getDate() + 1);
    }
    return dateArr;
}

const getYeararr = (start) =>{
    var start = start || 2015;
    var date=new Date;
    var year=date.getFullYear()
    var arr=[]
    for(var i=year;i>start;i--){
        arr.push(i)
    }
    return arr;
}


// 数组去重
const uniqarr = (array) => {
    var temp = [];
    for(var i = 0; i < array.length; i++){
        if(temp.indexOf(array[i]) == -1){
            temp.push(array[i]);
        }
    }
    return temp;
}

// 数组去重数字和字符串相同时
const uniqarrstring = (array) => {
    var temp = [];
    for(var i = 0; i < array.length; i++){
        if(temp.indexOf(array[i].toString()) == -1){
			array[i] = parseInt(array[i])
            temp.push(parseInt(array[i]));
        }
    }
    return temp;
}

//-- ajax请求，不公开
const Ajax = () => {
	var map = []
	var ajax = {
		//-- 获取XML
		XML(){
			let XMLHttpReq
			try{
				XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e){
				try{
					XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e){
					XMLHttpReq = new XMLHttpRequest();
				}
			}
			return XMLHttpReq
		},
		//-- ajax请求过程
		process(XML,option){
			if(XML.readyState == 4){
				if(XML.status == 200){
					var res = XML.responseText
					try{
						res = JSON.parse(res)
					}catch(e){
						console.warn('返回数据不为JSON')
					}
					if(res.status != 1){
						option.error(res)
						return
					}
					option.success(res.data)
				}else{
					option.error(XML)
				}
			}
		},
	}

	return function(option){
		if(_.hasArr(option.api,map)){
			return
		}
		var xml = ajax.XML()
		option.async		= !option.async			|| true
		option.contentType	= option.contentType	|| 'application/x-www-form-urlencoded'
		option.error		= option.error		|| function(){}
		option.success		= option.success		|| function(){}
		option.type			= option.type		|| 'POST'
		let dataArr = []
		_.eachProp(option.data,function(value,name){
			if(_.isArray(value)){
				value.map(function(val,i){
					dataArr.push( name + '[]=' + encodeURIComponent(val) )
				})
			}else{
				dataArr.push( name + '=' + encodeURIComponent(value) )
			}
		})
		let newData = dataArr.join('&')
		//-- 防止重复提交
		let newapi
		if(option.url==''){
			newapi = option.api
		}else{
			newapi = option.url
		}
		var api = newapi
		map.push(api)
		setTimeout(function(){
			_.removeArr(api,map)
		},500)
		xml.open(option.type,newapi,option.async);
		xml.setRequestHeader("Content-Type",option.contentType);
		xml.onreadystatechange = function(){
			ajax.process(xml,option)
		}
		xml.send(newData)
	}
}

//-- AJAX实例
const AJAX = Ajax()

//-- 缓存
const Store = {
	set(key,value,type = true){
		if(value === void 0){
			return this.remove(key)
		}
		this.has(key) && this.remove(key)
		var name = !!type ? 'localStorage' : 'sessionStorage'
		try{
			value = JSON.stringify(value)
		}catch(e){
			console.warn('数据不为JSON格式')
		}
		window[name].setItem(key,value)
		return value
	},
	get(key){
		var value = window.localStorage.getItem(key) || window.sessionStorage.getItem(key)
		try{
			value = JSON.parse(value)
		}catch(e){
		}
		return value || false
	},
	has(key){
		return !!this.get(key)
	},
	remove(key){
		window.localStorage.removeItem(key)
		window.sessionStorage.removeItem(key)
	},
	clear(){
		window.localStorage.clear()
		window.sessionStorage.clear()
	},
	//设置cookie
	setCookie(cname, cvalue, exdays) {
		 var d = new Date();
		 d.setTime(d.getTime() + (exdays*24*60*60*1000));
		 var expires = "expires="+d.toUTCString();
		 document.cookie = cname + "=" + cvalue + "; " + expires;
	},
	//获取cookie
	getCookie(cookie_name)
	{//获取单个cookies
		var acookie=document.cookie.split("; ")
		for(var i=0;i<acookie.length;i++){
			var arr=acookie[i].split("=");
			if(cookie_name==arr[0]){
			if(arr.length>1)
			return unescape(arr[1]);
			else
			return "";
		}}
		return "";
	},
	// 删除cookie
	delCookie(name)
	{
	     setCookie(name, "", -1);
	},
	// 清除所有cookie
	clearCookie(){
	    var cookies = document.cookie.split(";");
		    for (var i = 0; i < cookies.length; i++) {
		        var cookie = cookies[i];
		        var eqPos = cookie.indexOf("=");
		        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		    }
		if(cookies.length > 0)
		{
		    for (var i = 0; i < cookies.length; i++) {
		        var cookie = cookies[i];
		        var eqPos = cookie.indexOf("=");
		        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		    var domain = location.host.substr(location.host.indexOf('.'));
		        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + domain;
		    }
		}
	}
}


//-- 跳转
const GO = (data,type) => {
	if(type){
		browserHistory.replace(data)
	}else{
		browserHistory.push(data)
	}
}

//-- 返回GET对象
const GET = () => {
	let search	= decodeURIComponent(location.search).replace('?','').split('&')
	let obj = {}
	search.map((val,i) => {
		let newArr = val.split('=')
		let name = newArr[0]
		let value = newArr[1]
		obj[name] = value
	})
	return obj
}

//-- 通过name获取DOM，返回对象
const GetName = (arr) => {
	let obj = {}
	arr.map(function(el){
		obj[el] = document.getElementsByName(el)[0]
	})
	return obj
}

//-- 转义成html字符串
const HTMLString = (val) => {
	console.log(val);
	let txt = JSON.stringify(val).replace(/ /g,'&nbsp;').replace(/\\n/g,'</br>')
	return txt.substr(1,(txt.length - 2))
}

const Pricedeal = (data)=>{
	let price = '0'
	if( ( data * 1 ) > 0 ){
		let arr = [data].join('').split('.')
		let integer = arr[0]
		let deci = arr[1]
		deci = deci
			? deci.length >= 2
				? deci.substr(0,2)
				: ( deci + '0' )
			: '00'
		price = [integer,deci].join('.')
	}
	return price
}

const getNowMonthDate = ()=> {
	var date = new Date();
	var year = date.getFullYear() + "";
	var month = (date.getMonth() + 1) + "";
	// 本月第一天日期
	if ( month < 10 ) {
		month = '0' + month
	}
	var begin = year + "-" + month + "-01"
	// 本月最后一天日期
	var lastDateOfCurrentMonth = new Date(year,month,0);
	var end = year + "-" + month + "-" + lastDateOfCurrentMonth.getDate();
	return [begin, end]
}

const NowtimeMonday = (date)=> {
	var Stamp,curdate;
	Stamp = new Date(date); 
	curdate = new Date(); 
	var num = 7-Stamp.getDay();
	if(Stamp>curdate) {
		Stamp.setDate(Stamp.getDate() + num + 1);
	} else {
		Stamp.setDate(Stamp.getDate() + num + 1);
	}
	var year = Stamp.getFullYear(); //获取完整的年份(4位,1970-????)
	var month = Stamp.getMonth() +1; //获取当前月份(0-11,0代表1月)
	var mvar ='';
	if(month<10){
		mvar = '0' + month;
	}else{
		mvar = month+'';
	}
	var day = Stamp.getDate();
	var dvar ='';
	if(day<10){
		dvar = '0' + day;
	}else{
		dvar = day+'';
	}
	return year+"-"+mvar+'-'+dvar
}

const Keydown = {
	// 只能输入整数
	changeInt(e,val,type){
		var value = e.target.value
		if(value.length==1){
			val[type]=value.replace(/[^(\-?)\d+]/ig,'')
		}else{
			val[type]=value.substring(0,1)+value.substring(1,value.length).replace(/[^\d+]/ig,'');
		}
		return val[type]
	},
	// 禁止输入中文
	UninputWord(e,val,type){
		var value = e.target.value
		val[type]=value.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,'')
		return val[type]
	},
}
// var data = [
// 	{"id":2,"name":"第一级1","pid":0},
// 	{"id":3,"name":"第二级1","pid":2},
// 	{"id":5,"name":"第三级1","pid":4},
// 	{"id":100,"name":"第三级2","pid":3},
// 	{"id":6,"name":"第三级2","pid":3},
// 	{"id":601,"name":"第三级2","pid":6},
// 	{"id":602,"name":"第三级2","pid":6},
// 	{"id":603,"name":"第三级2","pid":6}
//   ];
// 数组转树形结构数据（原理即为通过设置id为key值，再通过pid去找这个key是否一样，一样则为这数据的子级数据）
const arrayToJson = (treeArray) =>{
	  var r = [];
	  var tmpMap ={};
	  for (var i=0, l=treeArray.length; i<l; i++) {
	   // 以每条数据的id作为obj的key值，数据作为value值存入到一个临时对象里面
		tmpMap[treeArray[i]["id"]]= treeArray[i]; 
	  } 
	//   console.log('tmpMap',tmpMap)
	  for (i=0, l=treeArray.length; i<l; i++) {
		var key=tmpMap[treeArray[i]["p_id"]];
		// console.log('key',key)
		//循环每一条数据的pid，假如这个临时对象有这个key值，就代表这个key对应的数据有children，需要Push进去
		//如果这一项数据属于哪个数据的子级
		if (key) {
			// 如果这个数据没有children
		  if (!key["children"]){
			  key["children"] = [];
			  key["children"].push(treeArray[i]);
		  // 如果这个数据有children
		  }else{
			key["children"].push(treeArray[i]);
		  }       
		} else {
		  //如果没有这个Key值，就代表找不到属于哪个数据，那就代表没有父级,直接放在最外层
		  r.push(treeArray[i]);
		}
	  }
	  return r
	 }

const countTime = () =>{
	var now=new Date();
	var year=now.getFullYear();
	var month=now.getMonth()+1;
	if(month<10){
	month='0'+month;
	}
	var day=now.getDate();
	if(day<10){
		day='0'+day;
	}
	var hours=now.getHours();
	if(hours<10){
		hours='0'+hours;
	}
	var minutes=now.getMinutes();
	if(minutes<10){
		minutes='0'+minutes;
	}
	var seconds=now.getSeconds();
	if(seconds<10){
		seconds='0'+seconds;
	}
	var showTime=year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds+"";
	// console.log(showTime)
	setTimeout(countTime,1000);
	return showTime
	
	//一秒刷新一次显示时间
}

export default {
	Store,
	DOM,
	GO,
	GetName,
	HTMLString,
	_,
	GET,
    Nowtime,
	Nowmonth,
    getDateday,
	TranTime,
	Pricedeal,
    getYeararr,
    uniqarr,
	getNowMonthDate,
	NowtimeMonday,
	uniqarrstring,
	Keydown,
	arrayToJson,
	countTime
};

