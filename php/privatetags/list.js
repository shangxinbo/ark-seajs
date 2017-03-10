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
    if(!param.project_id){
        return 'param project_id error';
    }
    if(!param.type){
        return 'param type error';
    }
    if(param.type=='singlelist') {
        var d = {"id":6,"user_id":1,"summary":{"clue_time":20160913,"effect_time":0,"effect_total":0,"clue_num":0},"project":{"id":18,"name":"\u6d4b\u8bd5\u961f\u5217\u6570\u636e","template_id":12},"cycle_info":""};
    }else{
        var d = {
            user_id:23,
            list:[],
            head:{
                "cycle": Random.integer(0,100),
                "clue_download_count": Random.integer(0,100),
                "effect_total": Random.integer(0,100),
                "conversion": Random.integer(0,100)
            },
            all: {
                "effect_time": Random.integer(0,100),
                "effect_total": Random.integer(0,100),
                "level": [
                    Random.integer(0,100),
                    Random.integer(0,100)
                ],
                "levelScore": ["0.19","57.89","45.45",100,100]
            },
            level: [
                Random.csentence(3,6),
                Random.csentence(3,6)
            ],
            project: {
                "id":23,
                "name":"汽车营销项目"
            }
        };

        for(var i=0;i<3;i++){
            d.list.push({
                "id": 1,
                "user_id": 1,
                "project_id": 1,
                "effect_time": 1,
                "effect_total": 10000,
                "clue_time": 1,
                "clue_num": 5,
                "clue_create_status": Random.integer(0,1),
                "clue_download_status": 1,
                "upload_status": 1,
                "change_value": [
                    12,
                    5
                ],
                "change_score": [
                    "0.12",
                    "41.67"
                ],
                "level": [
                    12,
                    5
                ],
                "levelScore": [
                    "0.12",
                    "41.67"
                ]
            });
        }
    }
    return result.success(Mock.mock(d));
}