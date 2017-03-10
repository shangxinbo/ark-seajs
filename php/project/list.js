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
        "page": {
            "total": 5
        },
        "data": [
            {
                "id": 114,
                "user_id": 2,
                "template_id": 0,
                "project_name": "dancizhouqi",
                "area": "asdf",
                "cycle": 0,
                "cycle_number": 1,
                "include_week": 1,
                "include_holiday": 1,
                "begin_time": "20161011",
                "detail_requirement": "asdf",
                "project_status": 1,
                "clueDownloadNum": 0,
                "turnStatus": 99978,
                "project_status_desc": "进行中",
                "filter_name": "啊手动阀手动阀爱的色放",
                "user_name": "shangxinbo"
            },
            {
                "id": 113,
                "user_id": 2,
                "template_id": 18,
                "project_name": "asdfasf",
                "area": "asdf",
                "cycle": 0,
                "cycle_number": 1,
                "include_week": 1,
                "include_holiday": 1,
                "begin_time": "20161011",
                "detail_requirement": "asdf",
                "project_status": 1,
                "clueDownloadNum": 0,
                "turnStatus": 99978,
                "project_status_desc": "进行中",
                "filter_name": "啊手动阀手动阀爱的色放",
                "user_name": "shangxinbo"
            },
            {
                "id": 75,
                "user_id": 2,
                "template_id": 16,
                "project_name": "测试回掉",
                "area": "测试回掉",
                "cycle": 2,
                "cycle_number": 6,
                "include_week": 1,
                "include_holiday": 1,
                "begin_time": "20160930",
                "detail_requirement": "测试回掉",
                "project_status": 1,
                "clueDownloadNum": 0,
                "turnStatus": 599914,
                "project_status_desc": "进行中",
                "filter_name": "啊手动阀手动阀爱的色放",
                "user_name": "shangxinbo"
            },
            {
                "id": 67,
                "user_id": 2,
                "template_id": 16,
                "project_name": "测试下载",
                "area": "阿三发射点",
                "cycle": 1,
                "cycle_number": 36,
                "include_week": 1,
                "include_holiday": 1,
                "begin_time": "20160930",
                "detail_requirement": "阿斯蒂芬",
                "project_status": 1,
                "clueDownloadNum": 99947,
                "turnStatus": 3119553,
                "project_status_desc": "进行中",
                "filter_name": "啊手动阀手动阀爱的色放",
                "user_name": "shangxinbo"
            },
            {
                "id": 58,
                "user_id": 2,
                "template_id": 16,
                "project_name": "sxb01",
                "area": "asdfas",
                "cycle": 2,
                "cycle_number": 6,
                "include_week": 1,
                "include_holiday": 1,
                "begin_time": "20160930",
                "detail_requirement": "asdfasdf",
                "project_status": 1,
                "clueDownloadNum": 99947,
                "turnStatus": 599897,
                "project_status_desc": "进行中",
                "filter_name": "啊手动阀手动阀爱的色放",
                "user_name": "shangxinbo"
            }
        ],
        "total": {
            "salesNum": "799627",
            "changeNum": 0
        }
    };
    return result.success(Mock.mock(d));
}