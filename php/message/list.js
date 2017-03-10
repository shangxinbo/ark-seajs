/**
 * NAME 2016/9/2
 * DATE 2016/9/2
 * AUTHOR shangxinbo
 */
var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var page = req.body.page?req.body.page:1;
    var rows = req.body.rows?req.body.rows:20;
    var d = {
        messages:{
            data:[]
        }
    };
    for(var i=10;i<(10+parseInt(rows));i++){
        d.messages.data.push({
            "id": i,
            "user_id": Random.integer(),
            "content": Random.csentence(6,29),
            "project_id": 1,
            "report_id": 1,
            "type": 0,
            "created_at": Random.date('yyyy-MM-dd hh:mm:ss')
        });
    }
    return result.success(Mock.mock(d));
}