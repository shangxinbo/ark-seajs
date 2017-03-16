/**
 * NAME 2016/9/5
 * DATE 2016/9/5
 * AUTHOR shangxinbo
 */

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var d = {
        "template_name":"我的模板就是这样",
        "level":{
            "name":"用户id"
        },
        "level1":{
            "name":"阶段1",
            "value":["成功","失败"]
        },
        "level1":{
            "ext":["转化阶段一扩展信息","扩展信息2"]
        },
        "level2":{
            "name":"转化阶段二",
            "value":["成功","未提供","用户不详"]
        },
        "level3":{
            "name":"转化阶段3",
            "value":["成功","失败"]
        }
    };
    return result.success(Mock.mock(d));
}