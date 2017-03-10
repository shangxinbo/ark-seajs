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
        "data": [
            {
                "templateName": "数据反馈模板",
                "templateId": 1,
                "levelNum": 2,
                "levelName": "转化阶段一,",
                "createTime": "2016-09-05"
            },
            {
                "templateName": "数据反馈模板1",
                "templateId": 4,
                "levelNum": 3,
                "levelName": "转化阶段一,转化阶段二,",
                "createTime": "2016-09-05"
            },
            {
                "templateName": "数据反馈模板2",
                "templateId": 5,
                "levelNum": 2,
                "levelName": "转化阶段一,转化阶段二,转化阶段三，",
                "createTime": "2016-09-05"
            },
            {
                "templateName": "数据反馈模板3",
                "templateId": 6,
                "levelNum": 2,
                "levelName": "转化阶段一,转化阶段二,转化阶段三",
                "createTime": "2016-09-05"
            }
        ],
        "page": {
            total: 234
        }
    }

    return result.success(Mock.mock(d));
}