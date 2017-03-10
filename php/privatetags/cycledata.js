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
    var d = {
        "id":2,
        "user_id":23,
        "cycle":1,
        "summary": {
            "clue_time": 1,
            "effect_time": 1,
            "effect_total": 10000,
            "clue_num": 5
        },
        "project":{
            "id":123,
            "name":"汽车营销项目"
        },
        "cycle_info": {
            "feedback_no_total":[12,34],
            "feedback_total":[45,56],
            "cycle_name": [
                "拨打电话是否成功（非扩展2）",
                "用户是否回访（非扩展4）",
                "用户是否回访（非扩展4）"
            ],
            "change_value": [
                "23",
                "433",
                "433"
            ],
            "change_score": [
                "0.12",
                "41.67",
                "433"
            ],
            "stage": [
                1,
                2,
                3
            ]
        }
    };
    return result.success(Mock.mock(d));
}