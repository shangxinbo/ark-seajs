/**
 * NAME 2016/8/8
 * DATE 2016/8/8
 * AUTHOR shangxinbo
 */
var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var code = req.body.code;
    var level = req.body.level;
    var dataLength = 16;
    if(!code){
        code = 10;
    }
    if(level=='0'){
        code = 100;
    }else{
        code = parseInt(code) * 10;
        dataLength = 30;
    }
    var d = [];
    for(var i=1;i<dataLength;i++){
    	if(dataLength<30){
	    	d.push({
	            "code": code + i,
	            "hasChildrend":true,
	            "page":0,
	            "pageSize":0,
	            "tagLevel": parseInt(level)+1,
	            "tagName":Random.cword(3,6),
	            "spritClass":function(j){
				            	if(j<10){
				            		return "icon0"+j;
				            	}else{
				            		return "icon"+j;
				            	}
				            }(i)
	        });
    	}else{
	    	d.push({
	            "code": code + i,
	            "hasChildrend":function(){
	            	if(String(code).length <= 6)
	            		return true;
	            	else
	            		return false;
	            },
	            "page":0,
	            "pageSize":0,
	            "tagLevel": parseInt(level)+1,
	            "tagName":Random.cword(3,6)
	        });
    	}
    }
	return result.success(Mock.mock(d));
}