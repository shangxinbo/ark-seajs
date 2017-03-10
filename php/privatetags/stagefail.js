/**
 * NAME 2016/9/5
 * DATE 2016/9/5
 * AUTHOR shangxinbo
 */

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var param = req.body;
    if(!param.id){
        return 'param id error';
    }
    if(!param.stage){
        return 'param stage error';
    }
    var d = {
        "summary": {
            "customers": 5,
            "conversion": "41.67"
        },
        "cycle": 1,
        "project": {
            "id":"12",
            "name":"项目1"
        },
        "fail_reason": [
            {
                "num": 0,
                "proportion": 50,
                "value": 1,
                "mark": "失败"
            },
            //{
            //    "num": 0,
            //    "proportion": 20,
            //    "value": 2,
            //    "mark": "空号"
            //},
            //{
            //    "num": 0,
            //    "proportion": 10,
            //    "value": 3,
            //    "mark": "无人接听"
            //},
            //{
            //    "num": 0,
            //    "proportion": 20,
            //    "value": 3,
            //    "mark": "无人接听"
            //},
            {
                "num": 0,
                "proportion": 50,
                "value": 4,
                "mark": "4444"
            }
        ]
    };

    return result.success(Mock.mock(d));
}