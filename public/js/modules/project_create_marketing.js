define([
	STATIC + 'lib/jquery-ui.min'
],function(require, exports, module){
	'use strict';
	/**
	 *  filterType 筛选人群类型
	 *	filterId   筛选人群ID
	 *	templateId 数据模板ID
	 *	projectName    项目名称
	 *	includeWeek    是否包含周末（0不包含 1包含）
	 *	includeHoliday 是否包含法定节假日（0不包含 1包含）
	 *	beginTime      项目开始时间
	 *	detailRequirement 描述
	 *	area           地域
	 *	cycle          周期（0单次 1天 2周 3月）
	 *	cycleNumber    周期数
	 */
	var project = {
		projectName:'',
		filterId   :-1,
		includeWeek :1,
		includeHoliday :1,
		beginTime :'',
		detailRequirement :'',
		area :'',
		cycle :2
	},
	cycleMap = {
		"周期项目" :2,
		"单次项目" :0,
		"单次" :0,
		"天" :1,
		"周" :2,
		"月" :3
	},
	includeWeekMap = {
		"包含周末" :1,
		"不包含周末" :0
	},
	includeHolidayMap ={
		"包含法定假日" :1,
		"不包含法定假日" :0
	};
	exports.getProject = function(){
		return project;
	};
	exports.updateProject = function(type,val,needMap){
//		var m = type + 'Map';
		if(typeof(val)=="string"){
			if(needMap){
				if(type == "cycle"){
					project[type] = cycleMap[val];
				}else if(type == "includeWeek"){
					project[type] = includeWeekMap[val];
				}else if(type == "includeHolidayMap"){
					project[type] = includeHolidayMap[val];
				}				
			}else{
				project[type] = val;
			}			
		}else if(val instanceof Object){
			for (var k in val) {
				project[k] = val[k];
			}
		}
		return project;	
	};
	exports.checkVal = function(name,len,regExp){
		if(name == ''|| name == -1){
			return 0;
		}else if(name.length > len){
			return 2;
		}else if(regExp){
			if(!regExp.test(name)){
				return 3;
			}
		}
		return 1;
	};
	exports.getErrMes =	function(type,val,len,valueStr){
		if(type == 0){
			return val + "不能为空";
		}else if(type == 2){
			var n = valueStr.length - len;
			return val + "超长" + n +"字，请重新输入";
		}else if(type == 3){
			return val + "应由中文，字母，数字组成"
		}
	};
	exports.canSub = function(statArr){
		for (var i=0;i<statArr.length;i++) {
			if(statArr[i] != 1){
				return false;
			}
		}
		return true;
	};
});